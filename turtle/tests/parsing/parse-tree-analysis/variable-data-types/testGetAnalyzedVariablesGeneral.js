import { escapeHTML } from '../../../helpers/escapeHTML.js';
import { getVariablesFromCode } from './getVariablesFromCode.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testGetAnalyzedVariablesGeneral(logger) {
	const cases = [
		{'code': '', 'varNames': [], 'numScopes': 0},
		{'code': 'make "x 4', 'varNames': ['x'], 'numScopes': 1, 'scopeChecks': [
			{
				'varName': 'x',
				'scopeIndex': 0,
				'assignedTypesStr': 'int'
			}
			]
		},
		{'code': 'make "X 4', 'varNames': ['x'], 'numScopes': 1},
		{'code': 'make "X 4\nmake "x 10', 'varNames': ['x'], 'numScopes': 2},
		{'code': 'make "X 4\nmake "Y 0\nswap "x "y\nforward :x\nforward :y', 'varNames': ['x', 'y'], 'numScopes': 4},
		{'code': 'for ["x 1 4 0] []', 'varNames': ['x'], 'numScopes': 1, 'scopeChecks': [
			{
				'varName': 'x',
				'scopeIndex': 0,
				'assignedTypesStr': 'int'
			}
			]
		},
		{'code': 'for ["X 1 4 0] []', 'varNames': ['x'], 'numScopes': 1},
		{'code': 'MAKE "i 0\nUNTIL :i>3 [MAKE "i :i+1 PRINT :i]', 'varNames': ['i'], 'numScopes': 2},
		{'code': 'to p :x\nend', 'varNames': ['x'], 'numScopes': 1},
		{'code': 'to p :X\nend', 'varNames': ['x'], 'numScopes': 1},
		{'code': 'make "x 10\nto p :X\nend', 'varNames': ['x'], 'numScopes': 2},
		{'code': 'to p\nlocalmake "x 10\nend', 'varNames': ['x'], 'numScopes': 1},
		{'code': 'to p\nfor [ "x 0 10] []\nend', 'varNames': ['x'], 'numScopes': 1},
		{'code': 'to p :X\nend\nto p2 :Y\nend', 'varNames': ['x', 'y'], 'numScopes': 2},
		{'code': 'make "x 300\nto p\nend\nfd :x', 'varNames': ['x'], 'numScopes': 1},
		{'code': 'make "x 1\nto', 'varNames': ['x'], 'numScopes': 1},
		// not valid code but we should still be able to get the variable and a scope on it.
		{'code': 'for [] []', 'varNames': [], 'numScopes': 0},
		{'code': 'make "x []\nsetItem "x 1 5', 'varNames': ['x'], 'numScopes': 1},
		{'code': `make "points []
repeat 100 [
	queue2 "points pos
]
print item 1 :points`, 'varNames': ['points'], 'numScopes': 1, 'scopeChecks': [
{
	'varName': 'points',
	'scopeIndex': 0,
	'assignedTypesStr': 'list<list<num>(minlen=3)>'
}]},{'code': `make "points []
repeat 100 [
	queue2 "points pos
]
repeat 100 [
	make "fromPoint item repcount :points
	print round :fromPoint / 5
]`, 'varNames': ['frompoint', 'points'], 'numScopes': 2,
'scopeChecks': [{
	'varName': 'points',
	'scopeIndex': 0,
	'assignedTypesStr': 'list<list<num>(minlen=3)>'
}, {
	'varName': 'frompoint',
	'scopeIndex': 0,
	'assignedTypesStr': 'list<num>(minlen=3)'
}]},
{
	'code': `to p1
	maKe "X 0.345
end

to p2
	mAke "x 1
	Make "x str :x + 4
end`,
	'varNames': ['x'],
	'numScopes': 3,
	'scopeChecks': [
	 {
		'varName': 'x',
		'scopeIndex': 1,
		'assignedTypesStr': 'int'
	}
	]
}];
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo.code;
		const plogger = prefixWrapper(`Case ${index} with code "${code}"`, logger);
		const result = getVariablesFromCode(code, plogger);
		if (result.countVariables() !== caseInfo.varNames.length)
			plogger(`Expected ${caseInfo.varNames.length} variables but got ${result.countVariables()}.  The variable names found are: ${result.getAllVariablesAsArray().map(v => v.name).join(',')}`);
		const scopes = result.getAllScopesAsArray();
		if (scopes.length !== caseInfo.numScopes)
			plogger(`Expected number of scopes to be ${caseInfo.numScopes} but found ${scopes.length}`);
		caseInfo.varNames.forEach(function(varName) {
			if (!result.hasVariable(varName))
				plogger(`Expected to have variable ${varName} but not found`);
			else {
				const variable = result.getVariableByName(varName);
				const scopes = variable.getScopesArray();
				if (scopes.length === 0)
					plogger('Expected at least 1 scope for every variable but got 0 for variable ' + variable.name);
			}
		});
		if (caseInfo.scopeChecks !== undefined)
			caseInfo.scopeChecks.forEach(function(scopeCheckInfo, scopeCheckIndex) {
				const slogger = prefixWrapper(`Scope check ${scopeCheckIndex}`, plogger);
				const variable = result.getVariableByName(scopeCheckInfo.varName);
				if (variable === undefined)
					slogger(`Unable to find scope check varName ${scopeCheckInfo.varName}`);
				else {
					const scope = variable.scopes[scopeCheckInfo.scopeIndex];
					if (scope === undefined)
						slogger(`Unable to find scope at index ${scopeCheckInfo.scopeIndex} for variable ${scopeCheckInfo.varName}.  scope index range is 0..${variable.scopes.length - 1}`);
					else {
						if (scopeCheckInfo.assignedTypesStr !== undefined) {
							if (scope.assignedTypes === undefined)
								slogger(escapeHTML(`Expected assignedTypes to be ${scopeCheckInfo.assignedTypesStr} but got undefined`));
							else if (scope.assignedTypes.toString() !== scopeCheckInfo.assignedTypesStr)
								slogger(escapeHTML(`Expected assignedTypes to be ${scopeCheckInfo.assignedTypesStr} but got ${scope.assignedTypes.toString()}`));
						}
					}
				}
			});
	});
};