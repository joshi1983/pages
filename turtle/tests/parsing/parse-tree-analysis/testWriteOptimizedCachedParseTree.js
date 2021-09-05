import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { WriteOptimizedCachedParseTree } from '../../../modules/parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

function testConstructor(logger) {
	const code = 'fd 100';
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const proceduresMap = new Map();
	const writeOptimizedCachedParseTree = new WriteOptimizedCachedParseTree(cachedParseTree.root, proceduresMap);
	const allTokens = writeOptimizedCachedParseTree.getAllTokens();
	if (!(allTokens instanceof Array))
		logger('allTokens expected to be an Array');
	else if (allTokens.length < 2)
		logger('allTokens expected to be have a length of at least 2 but got ' + allTokens.length);
	const numberTokens = writeOptimizedCachedParseTree.getTokensByType(ParseTreeTokenType.NUMBER_LITERAL);
	if (numberTokens.length !== 1)
		logger('expected there to be 1 number literal token but got ' + numberTokens.length);
	const pGroupTokens = writeOptimizedCachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP);
	if (pGroupTokens.length !== 1)
		logger('expected there to be 1 parameterized group token but got ' + pGroupTokens.length);
	const pGroupsAndNumbers = writeOptimizedCachedParseTree.getTokensByTypes([ParseTreeTokenType.NUMBER_LITERAL, ParseTreeTokenType.PARAMETERIZED_GROUP]);
	if (pGroupsAndNumbers.length !== 2)
		logger('expected there to be 2 tokens of type parameterized group or number but got ' + pGroupsAndNumbers.length);
	const procedures = writeOptimizedCachedParseTree.getProceduresMap();
	if (!(procedures instanceof Map))
		logger('Expected a procedures Map but got ' + procedures);
}

export function testWriteOptimizedCachedParseTree(logger) {
	testConstructor(prefixWrapper('testConstructor', logger));
	
};