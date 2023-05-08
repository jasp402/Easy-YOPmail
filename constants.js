const path                     = require('path');
module.exports      = Object.freeze({
	//--- Settings
	URL                 : 'https://yopmail.com/es/',
	URL_GENERATOR       : 'https://yopmail.com/es/email-generator',
	BROWSER_OPTIONS     : {
		headless   : true,
		product    : 'chrome',
		chromeFlags: [
			'--disable-web-security',
			'--disable-javascript',
			'--blink-settings=imagesEnabled=false',
			'--disable-gpu',
			'--renderer',
			'--no-sandbox',
			'--no-service-autorun',
			'--no-experiments',
			'--no-default-browser-check',
			'--disable-webgl',
			'--disable-threaded-animation',
			'--disable-threaded-scrolling',
			'--disable-in-process-stack-traces',
			'--disable-histogram-customizer',
			'--disable-gl-extensions',
			'--disable-extensions',
			'--disable-composited-antialiasing',
			'--disable-canvas-aa',
			'--disable-3d-apis',
			'--disable-accelerated-2d-canvas',
			'--disable-accelerated-jpeg-decoding',
			'--disable-accelerated-mjpeg-decode',
			'--disable-app-list-dismiss-on-blur',
			'--disable-accelerated-video-decode',
			'--num-raster-threads=1']
	},
	ERROR_MAIL_INVALID  : 'parameters \'mail\' is required',
	ERROR_SEARCH_INVALID: 'parameters \'_search\' keys is invalid, try again with (subject ot content)',
	COOKIE              : mail => {
		return {
			name    : 'ygen',
			value   : mail,
			domain  : '.yopmail.com',
			url     : 'https://yopmail.com/',
			path    : '/',
			httpOnly: false,
			secure  : false
		}
	},
	
	//--- Tests
	TEST_MAIL   : 'test@yopmail.com',
	INBOX_FILE  : path.resolve('tests', 'archives', 'inbox.json'),
	MAIL_CONTENT: path.resolve('tests', 'archives', 'mailContent.json'),
	HTML_ID     : path.resolve('tests', 'archives', 'mailHTML_id.html'),
	HTML_SUBJECT: path.resolve('tests', 'archives', 'mailHTML_subject.html'),
	HTML_CONTENT: path.resolve('tests', 'archives', 'mailHTML_content.html'),
	
	//--- Selectors
	S_LOGIN        : '#login',
	S_HOME         : '#webmail',
	S_IFRAME_BOX   : 'ifinbox',
	S_IFRAME_MAIL  : 'ifmail',
	S_INBOX_LIST   : 'div.mctn>div.m',
	S_TIME         : 'span[class="lmh"]',
	S_SUBJECT      : 'span[class="lmf"]',
	S_CONTENT      : 'div[class="lms"]',
	S_GENERATOR    : '#egen',
	S_N_MAIL       : '#nbmail',
	S_BTN_NEXT     : 'button[title="Siguiente"]',
	S_INPUT_TO     : '#msgto',
	S_INPUT_SUBJECT: '#msgsubject',
	S_INPUT_BODY   : '#msgbody',
	S_BNT_SEND     : '#msgsend',
	
	//--- Message
	M_ERR_ID     : 'id not match with search!',
	M_ERR_SUBJECT: 'Subject not match with search!',
	M_ERR_CONTENT: 'Content not match with search!'
});