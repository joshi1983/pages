import { mightNeedSpaceBetweenTokens } from
'../../../modules/parsing/parse-tree-token/mightNeedSpaceBetweenTokens.js';
import { ParseTreeToken } from
'../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/ParseTreeTokenType.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

export function testMightNeedSpaceBetweenTokens(logger) {
	const cases = [
	{'inArgs': [
		new ParseTreeToken(1, null, 0, 0, ParseTreeTokenType.NUMBER_LITERAL, '1'),
		new ParseTreeToken('count', null, 0, 5, ParseTreeTokenType.PARAMETERIZED_GROUP),
	], 'out': true},
	{'inArgs': [
		new ParseTreeToken(1, null, 0, 0, ParseTreeTokenType.NUMBER_LITERAL, '1'),
		new ParseTreeToken(2, null, 0, 1, ParseTreeTokenType.NUMBER_LITERAL, '2'),
	], 'out': true},
	{'inArgs': [
		new ParseTreeToken('1', null, 0, 1, ParseTreeTokenType.STRING_LITERAL),
		new ParseTreeToken(2, null, 0, 2, ParseTreeTokenType.NUMBER_LITERAL, '2'),
	], 'out': true},
	{'inArgs': [
		new ParseTreeToken('1', null, 0, 1, ParseTreeTokenType.STRING_LITERAL),
		new ParseTreeToken('end', null, 0, 4, ParseTreeTokenType.PROCEDURE_END_KEYWORD),
	], 'out': true},
	];
	testInOutPairs(cases, mightNeedSpaceBetweenTokens, logger);
};