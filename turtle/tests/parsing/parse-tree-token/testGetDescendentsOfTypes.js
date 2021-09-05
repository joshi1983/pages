import { getCachedParseTreeFromCode } from
'../../helpers/getCachedParseTreeFromCode.js';    
import { getDescendentsOfType } from
'../../../modules/parsing/parse-tree-token/getDescendentsOfType.js';
import { getDescendentsOfTypes } from
'../../../modules/parsing/parse-tree-token/getDescendentsOfTypes.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/ParseTreeTokenType.js';

export function testGetDescendentsOfTypes(logger) {
	const code = 'make "x 30\nfd 10\nprint :x';
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const root = cachedParseTree.root;
	const typesToCheck = [
		ParseTreeTokenType.PARAMETERIZED_GROUP,
		ParseTreeTokenType.LEAF,
		ParseTreeTokenType.NUMBER_LITERAL,
		ParseTreeTokenType.STRING_LITERAL,
		ParseTreeTokenType.TREE_ROOT
	];
	typesToCheck.forEach(function(type) {
		const types = new Set([type]);
		/*
		For performance reasons, some of the logic from getDescendentsOfType was
		reimplemented in getDescendentsOfTypes.
		Since they solve very similar problems, we're testing that the results are consistent.
		*/
		const result1 = getDescendentsOfTypes(root, types);
		const result2 = getDescendentsOfType(root, type);
		if (result1.length !== result2.length)
			logger(`Expected ${result2.length} tokens for type ${ParseTreeTokenType.getNameFor(type)} but got ${result1.length}`);
	});
};