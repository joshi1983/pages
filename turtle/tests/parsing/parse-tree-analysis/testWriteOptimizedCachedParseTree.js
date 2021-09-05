import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
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
	else if (allTokens.length !== 3)
		logger('allTokens expected to be have a length of 3 but got ' + allTokens.length);
	const rootTokens = writeOptimizedCachedParseTree.getTokensByType(ParseTreeTokenType.TREE_ROOT);
	if (rootTokens.length !== 1)
		logger('expected there to be 1 root token but got ' + rootTokens.length);
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
	const allActualTokens = cachedParseTree.getAllTokens();
	const allTokensFromWriteOptimized = writeOptimizedCachedParseTree.getAllTokens();
	if (allActualTokens.length !== allTokensFromWriteOptimized.length)
		logger(`Expected ${allActualTokens.length} tokens but getAllTokens returned ${allTokensFromWriteOptimized.length}`);
}

function testTokenRemoved(logger) {
	const code = 'fd 100\npenDown\nprint :x';
	const proceduresMap = new Map();
	['penDown', 100, 'x'].forEach(function(valToRemove, index) {
		const plogger = prefixWrapper(`Case ${index}, val=${valToRemove}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(code, plogger);
		const allTokens = cachedParseTree.getAllTokens();
		const matches = allTokens.filter(token => token.val === valToRemove);
		if (matches.length !== 1)
			plogger(`Expected 1 match for val ${valToRemove} but got ${matches.length}`);
		else {
			const token = matches[0];
			const actualTokensBeforeRemove = ParseTreeToken.flatten(cachedParseTree.root);
			const wTree = new WriteOptimizedCachedParseTree(cachedParseTree.root, proceduresMap);
			token.parentNode.removeChild(token);
			wTree.tokenRemoved(token);
			const allTokensFromCache = wTree.getAllTokens();
			const actualTokens = ParseTreeToken.flatten(cachedParseTree.root);
			if (actualTokens.length !== allTokensFromCache.length) {
				if (allTokensFromCache.length === actualTokensBeforeRemove.length)
					plogger(`It looks like tokenRemoved did nothing because the length is the same at ${actualTokensBeforeRemove.length}`);
				plogger(`Expected getAllTokens() to return ${actualTokens.length} but got ${allTokensFromCache.length}.  ` +
				`ParseTreeToken.flatten returned ${JSON.stringify(actualTokens.map(t => t.toString()))}.  writable returned ${JSON.stringify(allTokensFromCache.map(t => t.toString()))}`);
			}
		}
	});
}

function testTokenReplaced(logger) {
	const code = 'fd 1';
	const proceduresMap = new Map();
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const wTree = new WriteOptimizedCachedParseTree(cachedParseTree.root);
	const allTokens = ParseTreeToken.flatten(cachedParseTree.root);
	const tokenToReplace = allTokens.filter(t => t.val === 1)[0];
	const fdToken = allTokens.filter(t => t.val === 'fd')[0];
	const newToken = new ParseTreeToken(2, null, 1, 1, ParseTreeTokenType.NUMBER_LITERAL);
	fdToken.removeChild(tokenToReplace);
	fdToken.appendChild(newToken);
	wTree.tokenReplaced(tokenToReplace, newToken);
	const allTokensFromCache = wTree.getAllTokens();
	const actualTokens = ParseTreeToken.flatten(cachedParseTree.root);
	if (actualTokens.length !== allTokensFromCache.length)
		logger(`Expected ${actualTokens.length} tokens but got ${allTokensFromCache.length}`);
	const newTokenMatch = allTokensFromCache.filter(t => t.val === 2)[0];
	if (newTokenMatch === undefined)
		logger('Expected to find a token with val of 2 but found none.');
	const oldTokenMatch = allTokensFromCache.filter(t => t.val === 1)[0];
	if (oldTokenMatch !== undefined)
		logger('Expected to not find the old token with val of 1 but found it.');
}

export function testWriteOptimizedCachedParseTree(logger) {
	testConstructor(prefixWrapper('testConstructor', logger));
	testTokenRemoved(prefixWrapper('testTokenRemoved', logger));
	testTokenReplaced(prefixWrapper('testTokenReplaced', logger));
};