import { escapeHTML } from '../../../helpers/escapeHTML.js';
import { LongStringHTMLTokenProcessor } from '../../../../modules/components/syntax-highlighter/token-html-processors/LongStringHTMLTokenProcessor.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';
await ParseTreeToken.asyncInit();

const cases = [
{'val': '', 'numLines': 1},
{'val': 'http://www.google.com', 'numLines': 1},
{'val': 'hello', 'numLines': 1},
{'val': 'hello\nworld', 'numLines': 2},
{'val': 'hello\nworld\n', 'isComplete': true, 'numLines': 3, 'spanCount': 3},
{'val': 'hello\nworld\n', 'isComplete': false, 'numLines': 3, 'spanCount': 2},
{'val': 'hi', 'type': ParseTreeTokenType.STRING_LITERAL, 'numLines': 1}
];

function caseToToken(caseInfo) {
	let type = ParseTreeTokenType.LONG_STRING_LITERAL;
	if (caseInfo.type !== undefined)
		type = caseInfo.type;
	const result = new ParseTreeToken(caseInfo.val, null, 0, 0, type, caseInfo.val);
	if (caseInfo.isComplete === false)
		result.isComplete = false;
	return result;
}

function testHyperlinks(logger) {
	const caseInfo = {'val': 'hello http://www.google.com\nworld https://yahoo.com'};
	const token = caseToToken(caseInfo);
	const result = LongStringHTMLTokenProcessor.toHTML(token);
	const hyperlinkCount = result.split('<a ').length - 1;
	if (hyperlinkCount !== 2)
		logger(`Expected 2 hyperlinks but got ${hyperlinkCount}`);
}

function testIsApplicableTo(logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const token = caseToToken(caseInfo);
		const result = LongStringHTMLTokenProcessor.isApplicableTo(token);
		const expected = (token.type === ParseTreeTokenType.LONG_STRING_LITERAL);
		if (result !== expected)
			plogger(`Expected ${expected} but got ${result}`);
	});
}

function testNewLinesOutsideSpans(logger) {
	const caseInfo = {'val': 'hello\nworld'};
	const token = caseToToken(caseInfo);
	const result = LongStringHTMLTokenProcessor.toHTML(token);
	if (result.indexOf('\n</') !== -1) {
		logger(escapeHTML(`Expected all line breaks to be outside the returned HTML elements but found one inside.  HTML = ${result}`));
	}
	if (result.indexOf('\n') === -1)
		logger(escapeHTML(`Expected to find line break in HTML but not found in ${result}`));
}

function testToHTML(logger) {
	cases.forEach(function(caseInfo, index) {
		const token = caseToToken(caseInfo);
		if (LongStringHTMLTokenProcessor.isApplicableTo(token)) {
			const plogger = prefixWrapper(`Case ${index}`, logger);
			const result = LongStringHTMLTokenProcessor.toHTML(token);
			if (result.indexOf('>\'') === -1)
				plogger(escapeHTML(`Expected an apostraphe at the start of a long string literal but not found in ${result}`));
			const spanCount = result.split('<span').length - 1;
			let expectedSpanCount = caseInfo.numLines;
			if (caseInfo.spanCount !== undefined)
				expectedSpanCount = caseInfo.spanCount;
			if (spanCount !== expectedSpanCount) {
				plogger(escapeHTML(`Expected span count to be ${expectedSpanCount} but found ${spanCount}.  The HTML is ${result}`));
			}
		}
	});
}

export function testLongStringHTMLTokenProcessor(logger) {
	wrapAndCall([
		testHyperlinks,
		testIsApplicableTo,
		testNewLinesOutsideSpans,
		testToHTML
	], logger);
};