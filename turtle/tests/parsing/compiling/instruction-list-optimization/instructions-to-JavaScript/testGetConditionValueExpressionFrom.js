import { createRootToken } from
'../../../../helpers/createRootToken.js';
import { getConditionValueExpressionFrom } from
'../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/getConditionValueExpressionFrom.js';
import { isNumber } from '../../../../../modules/isNumber.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { PushInstruction } from
'../../../../../modules/parsing/execution/instructions/PushInstruction.js';

export function testGetConditionValueExpressionFrom(logger) {
	const token = createRootToken();
	const cases = [
		{'instruction': new PushInstruction(3, token, false), 'notResult': false, 'numToRemove': 1, 'outCode': '!3'},
		{'instruction': new PushInstruction(true, token, false), 'notResult': false, 'numToRemove': 1, 'outCode': '!true'}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = getConditionValueExpressionFrom(caseInfo.instruction, caseInfo.notResult);
		if (typeof result !== 'object')
			plogger(`Expected result to be an object but got ${result}`);
		else {
			if (!isNumber(result.numToRemove))
				plogger(`Expected a number but got ${result.numToRemove}`);
			else if (result.numToRemove !== caseInfo.numToRemove)
				plogger(`Expected ${caseInfo.numToRemove} but got ${result.numToRemove}`);
			if (result.jsCode !== caseInfo.outCode)
				plogger(`Expected ${caseInfo.outCode} but got ${result.jsCode}`);
		}
	});
};