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
const STATE_FILE = path.join(DATA, '.state.json');

function loadState() {
    try {
        if (fs.existsSync(STATE_FILE)) {
            const s = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
            return s.activeEmail || null;
        }
    } catch { /* ignore */ }
    return null;
}

function saveState(email) {
    try { writeJson(STATE_FILE, { activeEmail: email }); } catch { /* ignore */ }
}

let activeEmail = loadState();
if (activeEmail) console.log(`[State] Restored active email: ${activeEmail}`);

// ── API routes ─────────────────────────────────────────────────────────────

// ── Helpers ────────────────────────────────────────────────────────────────
/** YOPmail returns totalEmails=-1 and an empty inbox when it shows a CAPTCHA page */
function isCaptchaResponse(inbox) {
    return inbox && (inbox.totalEmails < 0 || (inbox.totalEmails === 0 && inbox.fetchedEmailCount === 0 && inbox.pageCount === 0));
}

/** Read valid cached inbox (skip files saved from CAPTCHA responses) */
function readValidCache(inboxFile) {
    try {
        if (!fs.existsSync(inboxFile)) return null;
        const cached = JSON.parse(fs.readFileSync(inboxFile, 'utf8'));
        if (isCaptchaResponse(cached)) { fs.unlinkSync(inboxFile); return null; }
        if ((cached.inbox || []).length > 0) return cached;
    } catch { /* ignore */ }
    return null;
}

// GET /api/generate-email
app.get('/api/generate-email', async (_req, res) => {
    try {
        const email = await easyYopmail.getMail();
        activeEmail  = email;
        saveState(email);
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
        activeEmail = email;
        saveState(email);

        const inboxFile = path.join(DATA, emailDir(email), 'inbox.json');

        // CAPTCHA detected: totalEmails=-1 is YOPmail's indicator
        if (isCaptchaResponse(inbox)) {
            console.warn(`[Inbox API] CAPTCHA detected for ${email} (totalEmails=${inbox.totalEmails})`);
            const cached = readValidCache(inboxFile);
            if (cached) {
                console.log(`[Inbox API] Serving cached ${cached.inbox.length} email(s)`);
                return res.json({ success: true, data: cached, fromCache: true });
            }
            // No valid cache – tell the frontend CAPTCHA is blocking
            return res.json({
                success: true,
                data: { ...inbox, inbox: [] },
                captchaRequired: true,
                yopmailUrl: `https://yopmail.com/en/inbox?login=${encodeURIComponent(email.split('@')[0])}`
            });
        }

        writeJson(inboxFile, { ...inbox, savedAt: new Date().toISOString() });
        res.json({ success: true, data: inbox });
    } catch (err) {
        const inboxFile = path.join(DATA, emailDir(email), 'inbox.json');
        const cached = readValidCache(inboxFile);
        if (cached) {
            console.warn(`[Inbox API] Error fetching, serving cached: ${err.message}`);
            return res.json({ success: true, data: cached, fromCache: true });
        }
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

    const cacheFile = path.join(DATA, emailDir(email), `${id}.json`);

    // Serve from local cache if already fetched successfully
    if (fs.existsSync(cacheFile)) {
        try {
            const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
            // Only use cache if content is not a CAPTCHA response
            const c = cached.content;
            const cStr = Array.isArray(c) ? c.join(' ') : String(c || '');
            if (!/complete the captcha/i.test(cStr)) {
                return res.json({ success: true, data: cached, fromCache: true });
            }
        } catch { /* fall through to fetch */ }
    }

    try {
        const message = await easyYopmail.readMessage(email, id, { format: 'html' });

        // Detect CAPTCHA response
        const content = message.content;
        const contentStr = Array.isArray(content) ? content.join(' ') : String(content || '');
        if (/complete the captcha/i.test(contentStr)) {
            const username = email.split('@')[0];
            return res.json({
                success: true,
                data: {
                    ...message,
                    captchaRequired: true,
                    yopmailUrl: `https://yopmail.com/en/mail?b=${encodeURIComponent(username)}&id=${encodeURIComponent(id)}`,
                }
            });
        }

        writeJson(cacheFile, { ...message, savedAt: new Date().toISOString() });
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

// ── Auto-poll every 60 s ───────────────────────────────────────────────────
const POLL_INTERVAL = 60_000;

setInterval(async () => {
    if (!activeEmail) return;
    try {
        const inbox = await easyYopmail.getInbox(activeEmail);
        const n = inbox.inbox ? inbox.inbox.length : 0;

        // Guard: if email count suddenly drops to 0 while we had emails before,
        // YOPmail likely returned a CAPTCHA page — skip update to preserve inbox
        const inboxFile = path.join(DATA, emailDir(activeEmail), 'inbox.json');
        let prevCount = 0;
        try {
            if (fs.existsSync(inboxFile)) {
                const prev = JSON.parse(fs.readFileSync(inboxFile, 'utf8'));
                prevCount = (prev.inbox || []).length;
            }
        } catch { /* ignore */ }

        if (isCaptchaResponse(inbox)) {
            console.warn(`[Poll] CAPTCHA detected for ${activeEmail} (totalEmails=${inbox.totalEmails}), keeping last inbox`);
            return;
        }

        writeJson(inboxFile, { ...inbox, savedAt: new Date().toISOString() });
        broadcast({ type: 'inbox_update', email: activeEmail, data: inbox });
        console.log(`[Poll] ${activeEmail}  →  ${n} email(s)`);
    } catch (err) {
        console.error('[Poll Error]', err.message);
    }
}, POLL_INTERVAL);

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║       Easy-YOPmail Web Server         ║');
    console.log('╠═══════════════════════════════════════╣');
    console.log(`║  ➜  http://localhost:${PORT}               ║`);
    console.log('║  Press Ctrl+C to stop                 ║');
    console.log('╚═══════════════════════════════════════╝\n');
});
