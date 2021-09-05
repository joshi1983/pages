import { ColorHTMLTokenProcessor } from
'../../../../modules/components/syntax-highlighter/token-html-processors/ColorHTMLTokenProcessor.js';
import { escapeHTML } from '../../../helpers/escapeHTML.js';
import { ParseTreeToken } from
'../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';
await ParseTreeToken.asyncInit();

const cases = [
	'red',
	{'val': 'black', 'substrings': ['dark']},
	'white', 'yellow',
	{'val': '#f00', 'substrings': ['dark']},
	{'val': '#5f00', 'substrings': ['dark']}
];

function caseToToken(caseInfo) {
	let val = caseInfo;
	if (typeof val === 'object')
		val = val.val;
	return new ParseTreeToken(val, null, 0, 0, ParseTreeTokenType.STRING_LITERAL, val);
}

function testIncompleteLongStringLiteral(logger) {
	// token is similar to what you'd get from parsing 'red with the second apostrophe missing.
	const token = new ParseTreeToken('red', null, 0, 0, ParseTreeTokenType.LONG_STRING_LITERAL, 'red');
	token.isComplete = false;
	const result = ColorHTMLTokenProcessor.toHTML(token);
	const expected = '>\'red<';
	if (result.indexOf(expected) === -1) {
		logger(escapeHTML(`Expected to find ${expected} but did not in ${result}`));
	}
}

function testIsApplicableTo(logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const token = caseToToken(caseInfo);
		const result = ColorHTMLTokenProcessor.isApplicableTo(token);
		if (result !== true)
			plogger(`Expected true from isApplicableTo but got ${result}`);
	});
}

function testToHTML(logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const token = caseToToken(caseInfo);
		const result = ColorHTMLTokenProcessor.toHTML(token);
		if (typeof result !== 'string')
			plogger(`Expected a string but got ${result}`);
		else {
			if (result.indexOf('color-literal') === -1)
				plogger(escapeHTML(`Expected to find color-literal in HTML but got ${result}`));
			if (result.indexOf(token.val) === -1)
				plogger(escapeHTML(`Expected to find ${token.val} in HTML but got ${result}`));
			else {
				let s;
				if (token.type === ParseTreeTokenType.STRING_LITERAL)
					s = `"${token.val}`;
				else
					s = `'${token.val}'`;
				if (result.indexOf(s) === -1)
					plogger(escapeHTML(`Expected to find ${s} in HTML but got ${result}`));
			}
			if (result.indexOf('style="') === -1)
				plogger(escapeHTML(`Expected to find style attribute setting for the background color but not found in ${result}`));
			if (caseInfo.substrings !== undefined) {
				caseInfo.substrings.forEach(function(substring) {
					if (result.indexOf(substring) === -1)
						plogger(escapeHTML(`Expected to find substring ${substring} but did not find it in ${result}`));
				});
			}
		}
	});
}

export function testColorHTMLTokenProcessor(logger) {
	wrapAndCall([
		testIncompleteLongStringLiteral,
		testIsApplicableTo,
		testToHTML
	], logger);
};