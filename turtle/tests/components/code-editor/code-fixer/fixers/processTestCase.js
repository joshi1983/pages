import { assertEquals } from
'../../../../helpers/assertEquals.js';
import { Command } from '../../../../../modules/parsing/Command.js';
import { compareTrees } from '../../../../helpers/parsing/compareTrees.js';
import { getProceduresMap } from
'../../../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../../../../modules/parsing/LogoParser.js';
import { parseTreeToCodeWithComments } from
'../../../../../modules/parsing/parseTreeToCodeWithComments.js';
import { ParseTreeToken } from '../../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { TestFixLogger } from '../../../../helpers/TestFixLogger.js';
import { TestParseLogger } from '../../../../helpers/TestParseLogger.js';
import { WriteOptimizedCachedParseTree } from
'../../../../../modules/parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';
await LogoParser.asyncInit();
await ParseTreeToken.asyncInit();

function isTokenContained(token, tokens) {
	for (const token2 of tokens) {
		if (token.val === token2.val &&
		token.type === token2.type) {
			if ((token.parentNode === null) !== (token2.parentNode === null))
				continue;
			if (token.children.length !== token2.children.length)
				continue;
			return true;
		}
	}
	return false;
}

function getTokensDifferentAsString(actualTokens, allTokensFromCache) {
	const result = [];
	for (const token of actualTokens) {
		if (!isTokenContained(token, allTokensFromCache))
			result.push(token);
	}
	for (const token of allTokensFromCache) {
		if (!isTokenContained(token, actualTokens))
			result.push(token);
	}
	return result.map(t => `(val=${t.val}, type=${ParseTreeTokenType.getNameFor(t.type)}, line=${t.lineIndex})`).join(', ');
}

function checkCacheIsNotStale(cachedTree, logger) {
	let totalTokens = 0;
	ParseTreeTokenType.getTypeNumbers().forEach(function(type) {
		const plogger = prefixWrapper(`Testing with token type ${ParseTreeTokenType.getNameFor(type)}`, logger);
		cachedTree.getTokensByType(type).forEach(function(token) {
			totalTokens++;
			if (token.type !== type)
				plogger(`Expected token type ${ParseTreeTokenType.getNameFor(type)} but got ${token.type} which has the name ${ParseTreeTokenType.getNameFor(token.type)}`);
		});
	});
	const allTokensFromCache = cachedTree.getAllTokens();
	if (allTokensFromCache.length !== totalTokens)
		logger(`Expected total tokens taken from getTokensByType to equal number of tokens from getAllTokens() but they did not match.  getAllTokens() returned ${allTokensFromCache.length} but got ${totalTokens}`);
	const actualTokens = ParseTreeToken.flatten(cachedTree.root);
	if (allTokensFromCache.length !== actualTokens.length)
		logger(`Expected getAllTokens() to return ${actualTokens.length} but got ${allTokensFromCache.length}.  Different tokens are: ${getTokensDifferentAsString(actualTokens, allTokensFromCache)}`);
	else {
		for (let i = 0; i < actualTokens.length; i++) {
			const token = actualTokens[i];
			if (allTokensFromCache.indexOf(token) === -1)
				logger(`Expected to find a token(${token.toString()}, lineIndex=${token.lineIndex}, colIndex=${token.colIndex}, val=${token.val}) in the writable result from getAllTokens() but did not.`);
		}
	}
	const freshProceduresMap = getProceduresMap(cachedTree.root);
	if (freshProceduresMap.size !== cachedTree.proceduresMap.size)
		logger(`Expected proceduresMap.size to be ${freshProceduresMap.size} but got ${cachedTree.proceduresMap.size}`);
	else {
		const keys = Array.from(freshProceduresMap.keys());
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (typeof key !== 'string')
				logger(`Every procedure name should be a string but found: ${key}`);
			else if (!cachedTree.proceduresMap.has(key))
				logger(`Unable to find procedure named ${key}`);
		}
	}
}

function validateWriteOptimizedCachedParseTree(cachedTree, logger) {
	checkCacheIsNotStale(cachedTree, logger);

	// Test that the parse tree hasn't been changed to a state that is never possible from Logo.getParseTree.
	cachedTree.getTokensByType(ParseTreeTokenType.BINARY_OPERATOR).forEach(function(token) {
		if (token.children.length > 2)
			logger(`Binary operator tokens should have at most 2 children but one was found with ${token.children.length}.  token.val=${token.val}`);
	});
	cachedTree.getTokensByType(ParseTreeTokenType.UNARY_OPERATOR).forEach(function(token) {
		if (token.children.length > 1)
			logger(`Binary operator tokens should have at most 1 child but one was found with ${token.children.length}.  token.val=${token.val}`);
	});
	cachedTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).forEach(function(token) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined) {
			const argCount = Command.getArgCount(info);
			if (argCount.isFlexible === false && argCount.defaultCount < token.children.length)
				logger(`The command "${info.primaryName}" has at most ${argCount.defaultCount} children but it has ${token.children.length}`);
		}
	});
}

export function processTestCase(caseInfo, fixerFunction, logger) {
	if (Number.isInteger(caseInfo.index))
		logger = prefixWrapper(`Case ${caseInfo.index}`, logger);
	if (typeof caseInfo.code !== 'string')
		throw new Error('code must be specified in caseInfo');
	logger = prefixWrapper(`code=${caseInfo.code}`, logger);
	if (caseInfo.logged === false && caseInfo.to !== undefined)
		throw new Error(`If logged is false, to should not be initially specified but it was`);
	if (caseInfo.logged === false)
		caseInfo.to = caseInfo.code;
	if (typeof caseInfo.to !== 'string')
		throw new Error(`to must be specified as a string in caseInfo if logged is not false. to=${caseInfo.to}`);
	let parseLogger = new TestParseLogger(logger, caseInfo.code);
	if (caseInfo.ignoreParseErrors === true)
		parseLogger = new TestParseLogger(function() {}, caseInfo.code);
	const tree = LogoParser.getParseTree(caseInfo.code, parseLogger);
	const fixLogger = new TestFixLogger(parseLogger);
	const proceduresMap = getProceduresMap(tree, new Map());
	let treeArg = new WriteOptimizedCachedParseTree(tree, proceduresMap);
	fixerFunction(treeArg, fixLogger);
	const proceduresAfter = getProceduresMap(tree, new Map());
	const fixedCode = parseTreeToCodeWithComments(tree, caseInfo.code);
	assertEquals(caseInfo.to, fixedCode, logger);
	if (caseInfo.logged !== fixLogger.hasLogged)
		logger(`Expected to log a message of ${caseInfo.logged} but got ${fixLogger.hasLogged}`);
	validateWriteOptimizedCachedParseTree(treeArg, 
		prefixWrapper('validateWriteOptimizedCachedParseTree', logger));
	if (caseInfo.compareTreeSettings !== undefined && caseInfo.doNotCompareTrees !== true) {
		const outTree = LogoParser.getParseTree(caseInfo.to, parseLogger);
		compareTrees(tree, outTree, logger, caseInfo.compareTreeSettings);
	}
	assertEquals(proceduresAfter.size, proceduresMap.size, logger);
	for (const [key, proc] of proceduresMap) {
		const afterProc = proceduresAfter.get(key);
		if (afterProc === undefined)
			logger(`Expected to find a procedure named ${key} but could not.`);
		else {
			const plogger = prefixWrapper(`Procedure ${key}`, logger);
			assertEquals(afterProc.parameters.length, proc.parameters.length, plogger);
			for (let i = 0; i < Math.min(afterProc.parameters.length, proc.parameters.length); i++) {
				assertEquals(afterProc.parameters[i], proc.parameters[i], prefixWrapper(`checking parameters at index ${i}`, plogger));
			}
		}
	}
};