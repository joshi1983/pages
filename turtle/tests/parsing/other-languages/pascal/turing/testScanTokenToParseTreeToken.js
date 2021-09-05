import { ParseTreeTokenType } from
'../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { scanTokenToParseTreeToken, specialValues } from
'../../../../../modules/parsing/other-languages/pascal/turing/scanTokenToParseTreeToken.js';
import { Token } from
'../../../../../modules/parsing/generic-parsing-utilities/Token.js';

export function testScanTokenToParseTreeToken(logger) {
	specialValues.forEach(function(key) {
		const token = new Token(key, 0, 0);
		const parseToken = scanTokenToParseTreeToken(token);
		if (parseToken.type === ParseTreeTokenType.UNRECOGNIZED)
			logger(`Failed to recognize ParseTreeTokenType type for value ${key}`);
	});
};