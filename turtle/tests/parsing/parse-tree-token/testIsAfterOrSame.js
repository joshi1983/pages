import { isAfterOrSame } from '../../../modules/parsing/parse-tree-token/isAfterOrSame.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { Token } from '../../../modules/parsing/Token.js';

export function testIsAfterOrSame(logger) {
	const token1 = new ParseTreeToken("hi", null, 1, 1, ParseTreeTokenType.STRING_LITERAL);
	const token2 = new Token(";hello", 0, 0);
	const cases = [
		{
			'colIndex': 1,
			'lineIndex': 1,
			'out': true
		},
		{
			'colIndex': 1,
			'lineIndex': 0,
			'out': false
		},
		{
			'colIndex': 2,
			'lineIndex': 0,
			'out': false
		},
		{
			'colIndex': 10000,
			'lineIndex': 0,
			'out': false
		},
		{
			'colIndex': 1,
			'lineIndex': 2,
			'out': true
		},
		{
			'colIndex': 0,
			'lineIndex': 2,
			'out': true
		}
	];
	cases.forEach(function(caseInfo, index) {
		token2.colIndex = caseInfo.colIndex;
		token2.lineIndex = caseInfo.lineIndex;
		let result = isAfterOrSame(token2, token1);
		if (result !== caseInfo.out)
			logger(`Case ${index}: ${caseInfo.out} expected but got ${result}`);
	});
};