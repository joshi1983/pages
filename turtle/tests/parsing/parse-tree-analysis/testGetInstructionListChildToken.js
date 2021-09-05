import { findToken } from '../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { getInstructionListChildToken } from '../../../modules/parsing/parse-tree-analysis/getInstructionListChildToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testBasic(logger) {
	const code = 'to f\nif 1 < 2 [\n"jik\nprinT "xyz\npriNt 1 + 3 * "azy]\nprInt "abc\nend\npRint "yay\n';
	const tree = getCachedParseTreeFromCode(code, logger);
	const cases = [{
		'token': {'val': 'xyz'},
		'result': {
			'val': 'prinT',
			'parentType': ParseTreeTokenType.LIST
		}
	}, {
		'token': {'val': 'jik', 'type': ParseTreeTokenType.STRING_LITERAL},
		'result': {
			'val': 'jik',
			'grandParentType': ParseTreeTokenType.PARAMETERIZED_GROUP
		}
	}, {
		'token': {'val': 'azy'},
		'result': {
			'val': 'priNt',
			'grandParentType': ParseTreeTokenType.PARAMETERIZED_GROUP
		}
	}, {
		'token': {'val': 'abc'},
		'result': {
			'val': 'prInt',
			'parentType': ParseTreeTokenType.LIST,
			'grandParentType': ParseTreeTokenType.PROCEDURE_START_KEYWORD
		}
	}, {
		'token': {'val': 'yay'},
		'result': {
			'val': 'pRint',
			'parentType': ParseTreeTokenType.TREE_ROOT
		}
	}
	];
	const tokens = tree.getAllTokens();
	cases.forEach(function(caseInfo) {
		const plogger = prefixWrapper('Failed for val ' + caseInfo.val, logger);
		const inputToken = findToken(caseInfo.token, tokens, plogger);
		const result = getInstructionListChildToken(inputToken);
		const expectedResult = findToken(caseInfo.result, tokens, plogger);
		if (expectedResult !== result)
			plogger(`Expected ${expectedResult} but got ${result}`);
	});
}

function testWithForLoop(logger) {
	const code = 'for ["x 0 1] [print :x]';
	const tree = getCachedParseTreeFromCode(code, logger);
	const tokens = tree.getAllTokens();
	const xVariableReadToken = findToken({'type': ParseTreeTokenType.VARIABLE_READ, 'val': 'x'}, tokens, logger);
	const printToken = findToken({'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'val': 'print'}, tokens, logger);
	if (xVariableReadToken !== undefined) {
		const result1 = getInstructionListChildToken(xVariableReadToken);
		if (result1.val !== 'print')
			logger(`Expected the instruction list child token to have val print but got ${result1.val}`);
		const result2 = getInstructionListChildToken(printToken);
		if (result2.val !== 'print')
			logger(`Expected the instruction list child token to have val print but got ${result2.val}`);
	}
}

function testWithIfElseExpression(logger) {
	const code = 'prinT ifelse 1 < 2 :x :y';
	const tree = getCachedParseTreeFromCode(code, logger);
	const tokens = tree.getAllTokens();
	const xToken = findToken({'type': ParseTreeTokenType.VARIABLE_READ, 'val': 'x'}, tokens, logger);
	const yToken = findToken({'type': ParseTreeTokenType.VARIABLE_READ, 'val': 'y'}, tokens, logger);
	if (xToken !== undefined && yToken !== undefined) {
		const result1 = getInstructionListChildToken(xToken);
		if (result1.val !== 'prinT')
			logger(`Expected the instruction list child token to have val prinT but got ${result1.val}`);
		const result2 = getInstructionListChildToken(yToken);
		if (result2.val !== 'prinT')
			logger(`Expected the instruction list child token to have val prinT but got ${result2.val}`);
	}
}

function testWithIfElseStatement(logger) {
	const code = 'ifelse 1 < 2 [print :x] [Print :y]';
	const tree = getCachedParseTreeFromCode(code, logger);
	const tokens = tree.getAllTokens();
	const xVariableReadToken = findToken({'type': ParseTreeTokenType.VARIABLE_READ, 'val': 'x'}, tokens, logger);
	const printToken1 = findToken({'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'val': 'print'}, tokens, logger);
	const printToken2 = findToken({'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'val': 'Print'}, tokens, logger);
	if (xVariableReadToken !== undefined) {
		const result1 = getInstructionListChildToken(xVariableReadToken);
		if (result1.val !== 'print')
			logger(`Expected the instruction list child token to have val print but got ${result1.val}`);
		if (printToken1 !== undefined) {
			const result2 = getInstructionListChildToken(printToken1);
			if (result2.val !== 'print')
				logger(`Expected the instruction list child token to have val print but got ${result2.val}`);
		}
		if (printToken2 !== undefined) {
			const result3 = getInstructionListChildToken(printToken2);
			if (result3.val !== 'Print')
				logger(`Expected the instruction list child token to have val Print but got ${result3.val}`);
		}
	}
}

export function testGetInstructionListChildToken(logger) {
	wrapAndCall([
		testBasic,
		testWithForLoop,
		testWithIfElseExpression,
		testWithIfElseStatement
	], logger);
};