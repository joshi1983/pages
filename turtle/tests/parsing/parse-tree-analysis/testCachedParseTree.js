import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { getProceduresMap } from '../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { Procedure } from '../../../modules/parsing/Procedure.js';
import { Variables } from '../../../modules/parsing/parse-tree-analysis/variable-data-types/Variables.js';

function testGetProcedureByName(logger) {
	const code = 'to p\nend';
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const proc = cachedParseTree.getProcedureByName('p');
	if (!(proc instanceof Procedure))
		logger('Expected an instance of Procedure but got something else.  typeof proc = ' + (typeof proc));
}

function testGetProceduresMap(logger) {
	const code = '\nto square :size\n  localmake "originalPos pos\n  penup\n  forward :size * 0.5\n  right 90\n  back :size * 0.5\n  pendown\n  repeat 4 [\n    forward :size\n    right 90\n  ]\n  penup\n  setpos :originalPos\n  pendown\n  left 90\nend\n\nsquare 100\n\n\nrepeat 50 [\n  square 100 + repcount * 5\n]';
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const proceduresMap = cachedParseTree.getProceduresMap();
	if (proceduresMap.size !== 1)
		logger(`Expected 1 procedure but got ${proceduresMap.size}`);
}

function testGetVariables(logger) {
	const code = 'make "x 100\nfd :x\nto p :size\nfd :size\nend';
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const variables = cachedParseTree.getVariables();
	if (variables instanceof Variables) {
		if (variables.countVariables() !== 2)
			logger(`Expected 2 variables but got ${variables.countVariables()}`);
		else if (!variables.hasVariable("size"))
			logger('Expected to have a variable named size');
		else if (!variables.hasVariable("x"))
			logger('Expected to have a variable named x');
	}
	else {
		logger('Expected an instance fo Variables but got ' + variables);
	}
}

function testGetLengthFromToken(logger) {
	const cases = [
		{'code': '"h', 'out': 1},
		{'code': '"hi', 'out': 2},
		{'code': '[]', 'out': 0},
		{'code': '[', 'out': 0},
		{'code': '[1 2 3]', 'out': 3},
		{'code': '[6]', 'out': 1},
		{'code': '[6', 'out': 1},
		{'code': '[:x]', 'out': 1},
		{'code': '[:x', 'out': 1},
		{'code': '[[]]', 'out': 1},
		{'code': '[[:x]]', 'out': 1},
		{'code': '[[:x] :y]', 'out': 2}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const code = `print ${caseInfo.code}`;
		const cachedParseTree = getCachedParseTreeFromCode(code, plogger);
		const token = cachedParseTree.getTokensByTypes([ParseTreeTokenType.LIST, ParseTreeTokenType.STRING_LITERAL]).
			filter(token => token.parentNode.val === 'print')[0];
		if (token === undefined)
			plogger('Expected to find a list or string literal token in a print command call but did not find one');
		else {
			const result = cachedParseTree.getLengthFromToken(token);
			if (result !== caseInfo.out)
				plogger(`Expected length of ${caseInfo.out} but got ${result}`);
		}
	});
}

export function testCachedParseTree(logger) {
	const code = 'fd 100';
	const cachedTree = getCachedParseTreeFromCode(code, logger);
	const commandCallTokens = cachedTree.getCommandCallsArray();
	if (!(commandCallTokens instanceof Array))
		logger('Expected getCommandCallsArray() to return an Array but got ' + commandCallTokens);
	else if (commandCallTokens.length !== 1)
		logger(`Expected 1 but got ${commandCallTokens.length} command call tokens`);
	else if (!(commandCallTokens[0] instanceof ParseTreeToken))
		logger('Expected an instance of ParseTreeToken but got ' + commandCallTokens[0]);
	const lastToken = cachedTree.getLastToken();
	if (!(lastToken instanceof ParseTreeToken))
		logger('Expected getLastToken() to return a ParseTreeToken but got something else.  lastToken = ' + lastToken);
	else if (lastToken.val !== 100) {
		logger('Expected getLastToken() to return a token with val 100 but the val is ' + lastToken.val);
	}
	testGetLengthFromToken(prefixWrapper('testGetLengthFromToken', logger));
	testGetProcedureByName(prefixWrapper('testGetProcedureByName', logger));
	testGetProceduresMap(prefixWrapper('testGetProceduresMap', logger));
	testGetVariables(prefixWrapper('testGetVariables', logger));
};