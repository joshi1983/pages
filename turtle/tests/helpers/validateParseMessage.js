function isTagSupported(tagName) {
	// based on code from
	// https://stackoverflow.com/questions/10048316/how-to-test-if-current-browser-supports-a-given-tagname
	const element = document.createElement(tagName);
	if (element.constructor === 'HTMLUnknownElement') {
		return false;
	}
	return true;
}

function getTagName(s) {
	const terminators = [' ', '>', '<'];
	for (let i = 0; i < terminators.length; i++) {
		const index = s.indexOf(terminators[i]);
		if (index !== -1)
			s = s.substring(0, index);
	}
	return s;
}

function validateHTML(html, logger) {
	let startIndex = 0;
	while (true) {
		const index = html.indexOf('<', startIndex);
		if (index === -1)
			break;
		const substringToCheck = html.substring(index + 1, index + 15).trim();
		const tagName = getTagName(substringToCheck);
		if (!tagName.startsWith('/') && !isTagSupported(tagName))
			logger(`It looks like tagName ${tagName} is not supported by the browser.`);
		startIndex = index + 1;
	}
}

function validateInnerText(msg, logger) {
	if (msg.indexOf('&lt;') !== -1)
		logger(`Expected not to find &lt; but found it in ${msg}`);
	if (msg.indexOf('&gt;') !== -1)
		logger(`Expected not to find &gt; but found it in ${msg}`);
}

export function validateParseMessage(msg, logger) {
	if (msg.isHTML === true) {
		validateHTML(msg.msg, logger);
	}
	else {
		validateInnerText(msg.msg, logger);
	}
};