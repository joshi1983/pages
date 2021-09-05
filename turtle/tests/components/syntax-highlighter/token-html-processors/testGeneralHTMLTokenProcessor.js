import { GeneralHTMLTokenProcessor } from '../../../../modules/components/syntax-highlighter/token-html-processors/GeneralHTMLTokenProcessor.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';
await ParseTreeToken.asyncInit();

const testTokens = [
	new ParseTreeToken('hello\nworld', null, 0, 0, ParseTreeTokenType.LONG_STRING_LITERAL, 'hello\nworld'),
	new ParseTreeToken('#800', null, 0, 0, ParseTreeTokenType.STRING_LITERAL, '#800'),
];

function testToHTML(logger) {
	testTokens.forEach(function(token) {
		const id = 'idval';
		const result = GeneralHTMLTokenProcessor.toHTML(token, id);
		if (typeof result !== 'string') {
			logger(`Expected a string but got ${result}`);
		}
	});
}

export function testGeneralHTMLTokenProcessor(logger) {
	wrapAndCall([
		testToHTML
	], logger);
};