import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { dataTypeTokenToString } from
'../../../../../modules/parsing/kojo/parsing/parse-tree-analysis/dataTypeTokenToString.js';
import { flatten } from
'../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

function wrappedDataTypeToString(s) {
	const code = `a[${s}]`;
	const parseResult = parse(code);
	const tokens = flatten(parseResult.root);
	const index = ArrayUtils.indexOfMatch(tokens, t =>
		(t.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION ||
		t.type === ParseTreeTokenType.IDENTIFIER) &&
		t.parentNode !== null &&
		t.parentNode.type === ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION);
	if (index === -1)
		return;
	const token = tokens[index];
	return dataTypeTokenToString(token);
}

export function testDataTypeTokenToString(logger) {
	const cases = [
		{'in': 'Boolean', 'out': 'Boolean'},
		{'in': 'Byte', 'out': 'Byte'},
		{'in': 'Int', 'out': 'Int'},
		{'in': 'Array', 'out': 'Array'},
	];
	testInOutPairs(cases, wrappedDataTypeToString, logger);
};