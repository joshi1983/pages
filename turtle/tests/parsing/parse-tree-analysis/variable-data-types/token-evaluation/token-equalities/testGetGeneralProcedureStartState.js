import { getCachedParseTreeFromCode } from
'../../../../../helpers/getCachedParseTreeFromCode.js';
import { getGeneralProcedureStartState } from
'../../../../../../modules/parsing/parse-tree-analysis/variable-data-types/token-evaluation/token-equalities/getGeneralProcedureStartState.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { SimulatedExecutionState } from
'../../../../../../modules/parsing/parse-tree-analysis/variable-data-types/token-evaluation/token-equalities/SimulatedExecutionState.js';

export function testGetGeneralProcedureStartState(logger) {
	const cases = [
		{
			'code': `make "x 3`,
			'numGlobalVariables': 1,
			'globalVariables': ['x']
		},
		{
			'code': `make "x pi + 6`,
			'numGlobalVariables': 1,
			'globalVariables': ['x']
		},
		{
			'code': `make "x 3
make "y []`,
			'numGlobalVariables': 2,
			'globalVariables': ['x', 'y']
		},
		{
			'code': `make "x []
queue2 "x 123`,
			'numGlobalVariables': 0
		},
		{
			'code': `make "x 123
to p
	print :x
end`,
			'numGlobalVariables': 1,
			'globalVariables': ['x']
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const ctree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		if (ctree !== undefined) {
			const result = getGeneralProcedureStartState(ctree);
			if (!(result instanceof SimulatedExecutionState))
				plogger(`Expected a SimulatedExecutionState but found ${result}`);
			else {
				if (caseInfo.numGlobalVariables !== undefined &&
				caseInfo.numGlobalVariables !== result.globalVariables.size)
					plogger(`Number of global variables expected to be ${caseInfo.numGlobalVariables} but found ${result.globalVariables.size}`);
				if (caseInfo.globalVariables instanceof Array) {
					for (const variableName of caseInfo.globalVariables) {
						if (!result.globalVariables.has(variableName))
							plogger(`Expected to find global variable named ${variableName} but did not`);
					}
				}
			}
		}
	});
};