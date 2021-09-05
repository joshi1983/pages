import { getCachedParseTreeFromCode } from
'../../../../../helpers/getCachedParseTreeFromCode.js';
import { getProcedureEffectsOnGlobalVariables } from
'../../../../../../modules/parsing/parse-tree-analysis/variable-data-types/token-evaluation/token-equalities/getProcedureEffectsOnGlobalVariables.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testGetProcedureEffectsOnGlobalVariables(logger) {
	const cases = [
		{'code': `to p
end`,
			'numKeys': 0
		},
		{'code': `to p :x
	make "x 3
end`,
			'numKeys': 0
		},
		{'code': `to p :x
	localmake "x 3
end`,
			'numKeys': 0
		},
		{'code': `to p :x
	queue "x 4
end`,
			'numKeys': 0,
			// queue and queue2 are different.
		},
		{'code': `to p
	localmake "x 3
	make "x 4
end`,
			'numKeys': 0
		},
		{'code': `to p
	localmake "x 3
	repeat 2 [
		make "x 4
	]
end`,
			'numKeys': 0
		},
		{'code': `to p
	make "x 4
end`,
			'numKeys': 1,
			'checks': [
				{
					'key': 'p',
					'variables': ['x'],
					'hasMutation': false
				}
			]
		},
		{'code': `to p
	make "x 4
	localmake "x 3
end`,
			'numKeys': 1,
			'checks': [
				{
					'key': 'p',
					'variables': ['x'],
					'hasMutation': false
				}
			]
		},
		{'code': `make "x []
to p
	queue2 "x 4
end`,
			'numKeys': 1,
			'checks': [
				{
					'key': 'p',
					'variables': ['x'],
					'hasMutation': true,
				}
			]
		},
		{'code': `make "x []
to p
	queue "x 4
end`,
			'numKeys': 1,
			'checks': [
				{
					'key': 'p',
					'variables': ['x'],
					'hasMutation': false
						// queue makes a clone so it doesn't risk mutating
						// a global variable indirectly. 
						// queue "x 4 is similar to:
						// make "x lput 4 :x.
				}
			]
		},
		{'code': `to p :x
	queue2 "x 4
end`,
			'numKeys': 1,
			// queue and queue2 are different.
			'checks': [
				{
					'key': 'p',
					'variables': [],
					'hasMutation': true
				}
			]
		},
		{
			'code': `to p1
	make "x 3
end

to p2
	p1
end`,
			'numKeys': 2,
			'checks': [
				{
					'key': 'p1',
					'variables': ['x'],
					'hasMutation': false
				},
				{
					'key': 'p2',
					'variables': ['x'],
					'hasMutation': false
				}
			]
		},
		{
			'code': `to p1
	queue2 "x 3
end

to p2
	p1
end`,
			'numKeys': 2,
			'checks': [
				{
					'key': 'p1',
					'variables': ['x'],
					'hasMutation': true
				},
				{
					'key': 'p2',
					'variables': ['x'],
					'hasMutation': true
				}
			]
		},
		{
			'code': `to p1
	make "x 3
end

to p2
	p1
end

to p3
	p2
end`,
			'numKeys': 3,
			'checks': [
				{
					'key': 'p1',
					'variables': ['x'],
					'hasMutation': false
				},
				{
					'key': 'p2',
					'variables': ['x'],
					'hasMutation': false
				},
				{
					'key': 'p3',
					'variables': ['x'],
					'hasMutation': false
				}
			]
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const result = getProcedureEffectsOnGlobalVariables(cachedParseTree);
		if (!(result instanceof Map))
			plogger(`A Map is expected but found ${result}`);
		else if (caseInfo.numKeys !== undefined &&
		caseInfo.numKeys !== result.size)
			plogger(`Expected result to have size ${caseInfo.numKeys} but found ${result.size}`);
		else if (caseInfo.checks instanceof Array) {
			const checkedKeys = new Set();
			caseInfo.checks.forEach(function(checkInfo, checkIndex) {
				const clogger = prefixWrapper(`Check ${checkIndex}, key=${checkInfo.key}`, plogger);
				if (checkedKeys.has(checkInfo.key))
					clogger(`The test data has a problem.  ${checkInfo.key} is checked more than once.`);
				else
					checkedKeys.add(checkInfo.key);
				const actualProcedureInfo = result.get(checkInfo.key);
				if (actualProcedureInfo === undefined)
					clogger(`Expected to find information for procedure but did not`);
				else {
					if (checkInfo.hasMutation !== undefined &&
					actualProcedureInfo.hasMutation !== checkInfo.hasMutation)
						clogger(`Expected hasMutation to be ${checkInfo.hasMutation} but found ${actualProcedureInfo.hasMutation}`);
					if (checkInfo.variables !== undefined) {
						checkInfo.variables.forEach(function(variableName) {
							if (!actualProcedureInfo.has(variableName))
								clogger(`Expected to find a variable named ${variableName} but did not.  variables = ${Array.from(actualProcedureInfo.possiblyAffectedGlobalVariables).join(',')}`);
						});
					}
				}
			});
		}
	});
};