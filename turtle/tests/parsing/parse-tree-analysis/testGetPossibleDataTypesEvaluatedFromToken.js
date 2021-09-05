import { getPossibleDataTypesEvaluatedFromToken } from '../../../modules/parsing/parse-tree-analysis/getPossibleDataTypesEvaluatedFromToken.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testWithSingleTokens(logger) {
	const cases = [
		{'val': 'red', 'type': ParseTreeTokenType.STRING_LITERAL, 'result': 'colorstring'},
		{'val': 'redsdhksdfsdhf', 'type': ParseTreeTokenType.STRING_LITERAL, 'result': 'string'},
		{'val': 5, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'result': 'int'},
		{'val': 5.23, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'result': 'num'},
		{'val': true, 'type': ParseTreeTokenType.BOOLEAN_LITERAL, 'result': 'bool'},
		{'val': false, 'type': ParseTreeTokenType.BOOLEAN_LITERAL, 'result': 'bool'},
	];
	cases.forEach(function(caseInfo) {
		const token = new ParseTreeToken(caseInfo.val, null, 0, 0, caseInfo.type);
		const prefix = 'Testing with val: ' + caseInfo.val + ' and type ' + ParseTreeTokenType.getNameFor(token.type);
		const plogger = prefixWrapper(prefix, logger);
		const result = getPossibleDataTypesEvaluatedFromToken(token, new Map(), new Set()).toString();
		if (result !== caseInfo.result)
			plogger('Expected ' + caseInfo.result + ' but got ' + result);
	});
}

export function testGetPossibleDataTypesEvaluatedFromToken(logger) {
	wrapAndCall([
		testWithSingleTokens
	], logger);
};