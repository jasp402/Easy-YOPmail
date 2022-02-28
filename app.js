const puppeteer=require("puppeteer"),cheerio=require("cheerio"),constants=require("./constants/constants.app");async function _constructor(){const t=await puppeteer.launch(constants.BROWSER_OPTIONS),e=(await t.pages())[0];return await e.setRequestInterception(!0),e.on("request",t=>{"image"===t.resourceType()?t.abort():t.continue()}),e.on("dialog",async t=>{await t.accept()}),{page:e,browser:t}}async function _openInbox(t,e){const a=constants.COOKIE(e);return await t.setCookie(a),await t.goto(constants.URL),await t.waitForSelector(constants.S_LOGIN),await t.evaluate(() => {accept();}),await t.focus(constants.S_LOGIN),await t.keyboard.press("Enter"),await t.waitForSelector(constants.S_HOME),await t.waitForTimeout(300),t}function getMail(){return(async()=>{try{const{page:t,browser:e}=await _constructor();await t.goto(constants.URL_GENERATOR);const a=await t.$eval(constants.S_GENERATOR,t=>t.innerText);return await t.close(),await e.close(),a}catch(t){throw new Error(t)}})()}function getRSS(t){return(async()=>{let{page:e,browser:a}=await _constructor();e=await _openInbox(e,t),await e.evaluate(()=>genrss()),await e.waitForTimeout(3e3);const n=await e.$eval(constants.S_GENERATOR,t=>t.innerText);return await e.close(),await a.close(),n})()}function getInbox(t,e={},a={}){let n=Object.keys(e);if(!t)throw new Error(constants.ERROR_MAIL_INVALID);if(n.length>2)throw new Error("Error en la cantidad de parametros");n.length>1&&n.forEach(t=>{let e=["content","subject"].includes(t);if(!e)throw new Error(`El parametro [${t}] es invalido`);console.log(e)});let o=a.MAX_PAGE||5;if(o>20)throw new Error("MAX_PAGE must be less than 20. This number directly affects memory consumption, handle it with care.");let r=[],s=void 0,i=0;return(async(t,e,a)=>{try{let{page:a,browser:n}=await _constructor();a=await _openInbox(a,t);const c=Number(String(await a.$eval(constants.S_N_MAIL,t=>t.innerText)).split(" ")[0]);if(c<=75){let t=(c/15).toFixed(0);o=t>0?t:1}for(await a.waitForTimeout(1e3);i<o;){const t=a.frames().find(t=>t.name(constants.S_IFRAME_BOX));s=await t.$$eval(constants.S_INBOX_LIST,(t,e,a)=>{let n=[],{subject:o,content:r,date:s,index:i}=e;return t.map(t=>{let e=!1,s={},i=t.getAttribute("id"),c=t.querySelector(a.S_TIME).innerText,w=t.querySelector(a.S_SUBJECT).innerText,l=t.querySelector(a.S_CONTENT).innerText;o&&o===w&&(e=!0),r&&r===l&&(e=!0),o||r||(e=!0),e&&(s.id=i,s.time=c,s.subject=w,s.content=l,n.push(s))}),n},e,constants),i<o-1&&(await a.click(constants.S_BTN_NEXT),await a.waitForTimeout(3e3)),s.length>0&&r.push(s),i++}const w={totalEmail:c,maxPage:o,pages:r};return await a.waitForTimeout(1e3),await n.close(),w}catch(t){throw new Error(t)}})(t,e)}function emptyInbox(t){return(async()=>{let{page:e,browser:a}=await _constructor();e=await _openInbox(e,t),await e.evaluate(()=>suppr_all()),await e.waitForTimeout(3e3);const n=Number(String(await e.$eval(constants.S_N_MAIL,t=>t.innerText)).split(" ")[0]);return await a.close(),{deleted:n<=0,totalMails:n}})()}function readMessage(t,e,a="html",n=""){try{return(async(e,a,n,o)=>{let{page:r,browser:s}=await _constructor();r=await _openInbox(r,t),await r.waitForTimeout(1e3),await r.goto(`${constants.URL}mail?b=${e}&id=m${a}`);let i=await r.evaluate(()=>document.querySelector("#mail").outerHTML);if(await s.close(),o){const t=cheerio.load(i);i=t(o).contents().map(function(){return"text"===this.type?t(this).text().trim():""}).get().filter(Boolean)}return i})(t,e,0,n)}catch(t){console.log(t)}}function sendMessage(t,e,a,n){try{return(async(t,e,a,n)=>{let{page:o,browser:r}=await _constructor();o=await _openInbox(o,t),await o.evaluate(()=>newm()),await o.waitForTimeout(1e3);const s=await o.$("#ifmail"),i=await s.contentFrame();return await i.type(constants.S_INPUT_TO,e),await i.type(constants.S_INPUT_SUBJECT,a),await i.type(constants.S_INPUT_BODY,n),await i.click(constants.S_BNT_SEND),await o.close(),await r.close(),!0})(t,e,a,n)}catch(t){console.log(t)}}function deleteMessage(t,e){try{return(async(t,e)=>{let{page:a,browser:n}=await _constructor();return a=await _openInbox(a,t),await a.evaluate(()=>w.suppr_mail()),await a.close(),await n.close(),!0})(t)}catch(t){console.log(t)}}module.exports={getMail:getMail,getRSS:getRSS,getInbox:getInbox,emptyInbox:emptyInbox,readMessage:readMessage,sendMessage:sendMessage,deleteMessage:deleteMessage};