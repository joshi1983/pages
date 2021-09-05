import { codeToElement } from
'../../../../../modules/components/syntax-highlighter/codeToElement.js';
import { escapeHTML } from
'../../../../helpers/escapeHTML.js';
import { isConvertToAssetApplicableToAnchorElement } from
'../../../../../modules/components/syntax-highlighter/context-menu/convert-to-asset/isConvertToAssetApplicableToAnchorElement.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function testIsConvertToAssetApplicableToAnchorElement(logger) {
	const cases = [
	{
		'code': `image 100 100 'https://www.google.com/image1.jpg'`,
		'element': {
			'css': '.string-literal > a'
		},
		'result': true
	},
	{
		'code': `image 100 100 'local://image1.jpg'`,
		'element': {
			'css': '.string-literal'
		},
		'result': false
	},
	{
		'code': `print 'hi'`,
		'element': {
			'css': '.string-literal'
		},
		'result': false
	},
	{
		'code': `print 'https://www.google.com/image1.jpg'`,
		'element': {
			'css': '.string-literal > a'
		},
		'result': false
	},
	{
		'code': `setPenColor "#9B2C2C
image 100 100 'https://miro.medium.com/v2/resize:fit:3840/1*xMuIOwjliGUPjkzukeWKfw.jpeg'`,
		'element': {
			'css': '.string-literal > a'
		},
		'result': true
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const code = caseInfo.code;
		let tree = undefined;
		const parseMessages = [];
		const idPrefix = 'id';
		const isBlock = false;
		const elementInfo = codeToElement(code, tree, parseMessages, idPrefix, isBlock);
		const element = elementInfo.element;
		tree = elementInfo.tree;
		const anchor = element.querySelector(caseInfo.element.css);
		if (anchor === null)
			plogger(escapeHTML(`Expected to find element but not found for CSS: ${caseInfo.element.css}`));
		else {
			const result = isConvertToAssetApplicableToAnchorElement(anchor, tree);
			if (result !== caseInfo.result)
				plogger(`Expected ${caseInfo.result} but got ${result}`);
		}
	});
};