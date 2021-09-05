import { ParseTreeTokenType } from '../../../modules/parsing/python-parsing/ParseTreeTokenType.js';

export function testParseTreeTokenType(logger) {
	const result = ParseTreeTokenType.getNameFor(ParseTreeTokenType.TREE_ROOT);
	const expectedVal = 'TREE_ROOT';
	if (result !== expectedVal)
		logger(`Expected getNameFor to return ${expectedVal} but got ${result}`);
};