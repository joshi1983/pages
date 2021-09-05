import { optimizePushedIfStatementConditions } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimizePushedIfStatementConditions.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testOptimizePushedIfStatementConditions(logger) {
	const cases = [
		{'in': '', 'out': undefined},
		{'in': 'context.valueStack.push(1)',
			'out': {'updated': '', 'conditionJS': '!1'}
		},
		{'in': 'context.valueStack.push(1);',
			'out': {'updated': '', 'conditionJS': '!1'}},
		{'in': 'context.valueStack.push("hi")',
			'out': {'updated': '', 'conditionJS': '!"hi"'}},
		{'in': 'context.valueStack.push(context.math.not(x));',
			'out': {'updated': '', 'conditionJS': 'x'}},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = optimizePushedIfStatementConditions(caseInfo.in);
		if ((result !== undefined) !== (caseInfo.out !== undefined))
			plogger(`Expected ${caseInfo.result} but got ${result}`);
		else if (result !== undefined) {
			if (result.updated !== caseInfo.out.updated)
				plogger(`Expected updated to be "${caseInfo.out.updated}" but got "${result.updated}"`);
			if (result.conditionJS !== caseInfo.out.conditionJS)
				plogger(`Expected conditionJS to be "${caseInfo.out.conditionJS}" but got "${result.conditionJS}"`);
		}
	});
};