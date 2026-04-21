'use strict';

const express     = require('express');
const path        = require('path');
const fs          = require('fs');
const easyYopmail = require('./index.js');

const app    = express();
const PORT   = process.env.PORT || 3000;
const DATA   = path.join(__dirname, 'data');
const PUBLIC = path.join(__dirname, 'public');

app.use(express.json());
app.use(express.static(PUBLIC));

if (!fs.existsSync(DATA))   fs.mkdirSync(DATA,   { recursive: true });
if (!fs.existsSync(PUBLIC)) fs.mkdirSync(PUBLIC, { recursive: true });

// ── Validation helpers ─────────────────────────────────────────────────────
const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const ID_RE    = /^[a-zA-Z0-9_\-=]+$/;

function validEmail(e) { return EMAIL_RE.test(e); }

/** Convert email to a safe directory name – prevents path traversal */
function emailDir(email) {
    return email.replace('@', '_at_').replace(/[^a-zA-Z0-9_.\-]/g, '');
}

function writeJson(file, data) {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── SSE – real-time push to browser ───────────────────────────────────────
const clients = new Set();

function broadcast(payload) {
    const msg = `data: ${JSON.stringify(payload)}\n\n`;
    for (const client of [...clients]) {
        try { client.write(msg); } catch { clients.delete(client); }
    }
}

app.get('/events', (req, res) => {
    res.setHeader('Content-Type',  'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection',    'keep-alive');
    res.flushHeaders();
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
    clients.add(res);
    // Heartbeat keeps Nginx/proxies from closing idle connections
    const hb = setInterval(() => {
        try { res.write(': hb\n\n'); } catch { clearInterval(hb); }
    }, 20_000);
    req.on('close', () => { clearInterval(hb); clients.delete(res); });
});

// ── Server state ───────────────────────────────────────────────────────────
let activeEmail = null;

// ── API routes ─────────────────────────────────────────────────────────────

// GET /api/generate-email
app.get('/api/generate-email', async (_req, res) => {
    try {
        const email = await easyYopmail.getMail();
        activeEmail  = email;
        res.json({ success: true, email });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/inbox/:email
app.get('/api/inbox/:email', async (req, res) => {
    const email = decodeURIComponent(req.params.email);
    if (!validEmail(email))
        return res.status(400).json({ success: false, error: 'Invalid email address' });
    try {
        const inbox = await easyYopmail.getInbox(email);
        // Track the most recently polled email so the auto-poller follows it
        activeEmail = email;
        writeJson(
            path.join(DATA, emailDir(email), 'inbox.json'),
            { ...inbox, savedAt: new Date().toISOString() }
        );
        res.json({ success: true, data: inbox });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/message/:email/:id
app.get('/api/message/:email/:id', async (req, res) => {
    const email = decodeURIComponent(req.params.email);
    const { id } = req.params;
    if (!validEmail(email))
        return res.status(400).json({ success: false, error: 'Invalid email address' });
    if (!ID_RE.test(id))
        return res.status(400).json({ success: false, error: 'Invalid message ID' });
    try {
        const message = await easyYopmail.readMessage(email, id, { format: 'html' });
        writeJson(
            path.join(DATA, emailDir(email), `${id}.json`),
            { ...message, savedAt: new Date().toISOString() }
        );
        res.json({ success: true, data: message });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE /api/message/:email/:id
app.delete('/api/message/:email/:id', async (req, res) => {
    const email = decodeURIComponent(req.params.email);
    const { id } = req.params;
    if (!validEmail(email))
        return res.status(400).json({ success: false, error: 'Invalid email address' });
    if (!ID_RE.test(id))
        return res.status(400).json({ success: false, error: 'Invalid message ID' });
    try {
        const result = await easyYopmail.deleteMessage(email, id);
        res.json({ success: true, message: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE /api/inbox/:email
app.delete('/api/inbox/:email', async (req, res) => {
    const email = decodeURIComponent(req.params.email);
    if (!validEmail(email))
        return res.status(400).json({ success: false, error: 'Invalid email address' });
    try {
        const result = await easyYopmail.deleteInbox(email);
        res.json({ success: true, message: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/send
app.post('/api/send', async (req, res) => {
    const { from, to, subject, body } = req.body;
    if (!from || !to || !subject || !body)
        return res.status(400).json({ success: false, error: 'All fields are required: from, to, subject, body' });
    if (!validEmail(to))
        return res.status(400).json({ success: false, error: 'Invalid recipient email address' });
    try {
        const result = await easyYopmail.writeMessage(from, to, subject, body);
        res.json({ success: true, message: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ── Auto-poll every 30 s ───────────────────────────────────────────────────
setInterval(async () => {
    if (!activeEmail) return;
    try {
        const inbox = await easyYopmail.getInbox(activeEmail);
        writeJson(
            path.join(DATA, emailDir(activeEmail), 'inbox.json'),
            { ...inbox, savedAt: new Date().toISOString() }
        );
        broadcast({ type: 'inbox_update', email: activeEmail, data: inbox });
        const n = inbox.inbox ? inbox.inbox.length : 0;
        console.log(`[Poll] ${activeEmail}  →  ${n} email(s)`);
    } catch (err) {
        console.error('[Poll Error]', err.message);
    }
}, 30_000);

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║       Easy-YOPmail Web Server         ║');
    console.log('╠═══════════════════════════════════════╣');
    console.log(`║  ➜  http://localhost:${PORT}               ║`);
    console.log('║  Press Ctrl+C to stop                 ║');
    console.log('╚═══════════════════════════════════════╝\n');
});
