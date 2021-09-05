import { DeepEquality } from '../../../../modules/DeepEquality.js';
import { getTokenValueBasic } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getTokenValueBasic.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';

export function testGetTokenValueBasic(logger) {
	const listToken1 = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.LIST);
	listToken1.appendChild(new ParseTreeToken(5, null, 0, 0, ParseTreeTokenType.NUMBER_LITERAL));
	const multiplyZeroToken = new ParseTreeToken('*', null, 0, 0, ParseTreeTokenType.BINARY_OPERATOR);
	const zeroToken = new ParseTreeToken(0, null, 0, 0, ParseTreeTokenType.NUMBER_LITERAL);
	const varToken = new ParseTreeToken("x", null, 0, 0, ParseTreeTokenType.VARIABLE_READ)
	multiplyZeroToken.appendChild(zeroToken);
	multiplyZeroToken.appendChild(varToken);
	const cases = [
		{'tok': new ParseTreeToken(5, null, 0, 0, ParseTreeTokenType.NUMBER_LITERAL), 'result': 5},
		{'tok': new ParseTreeToken("Hello", null, 0, 0, ParseTreeTokenType.STRING_LITERAL), 'result': "Hello"},
		{'tok': new ParseTreeToken("Hello", null, 0, 0, ParseTreeTokenType.LONG_STRING_LITERAL), 'result': "Hello"},
		{'tok': new ParseTreeToken(true, null, 0, 0, ParseTreeTokenType.BOOLEAN_LITERAL), 'result': true},
		{'tok': new ParseTreeToken(false, null, 0, 0, ParseTreeTokenType.BOOLEAN_LITERAL), 'result': false},
		{'tok': new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.LIST), 'result': []},
		{'tok': listToken1, 'result': [5]},
		{'tok': multiplyZeroToken, 'result': 0},
	];
	cases.forEach(function(caseInfo) {
		const result = getTokenValueBasic(caseInfo.tok);
		if (!DeepEquality.equals(result, caseInfo.result))
			logger(`Expected ${caseInfo.result} but got ${result}`);
	});
};