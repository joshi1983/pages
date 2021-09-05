import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { getVariablesFromCode } from './getVariablesFromCode.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

function testGetAllVariables(logger) {
	const cases = [
		{'code': '', 'varNames': []},
		{'code': 'make "x 4', 'varNames': ['x']},
		{'code': 'make "X 4', 'varNames': ['x']},
		{'code': 'make "X 4\nmake "x 10', 'varNames': ['x']},
		{'code': 'for ["x 1 4 0] []', 'varNames': ['x']},
		{'code': 'for ["X 1 4 0] []', 'varNames': ['x']},
		{'code': 'MAKE "i 0\nUNTIL :i>3 [MAKE "i :i+1 PRINT :i]', 'varNames': ['i']},
		{'code': 'to p :x\nend', 'varNames': ['x']},
		{'code': 'to p :X\nend', 'varNames': ['x']},
		{'code': 'make "x 10\nto p :X\nend', 'varNames': ['x']},
		{'code': 'to p\nlocalmake "x 10\nend', 'varNames': ['x']},
		{'code': 'to p\nfor [ "x 0 10] []\nend', 'varNames': ['x']},
		{'code': 'to p :X\nend\nto p2 :Y\nend', 'varNames': ['x', 'y']},
		{'code': 'make "x 300\nto p\nend\nfd :x', 'varNames': ['x']},
	];
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo.code;
		const result = getVariablesFromCode(code, logger);
		const plogger = prefixWrapper(`Case ${index} with code "${code}"`, logger);
		if (result.countVariables() !== caseInfo.varNames.length)
			plogger(`Expected ${caseInfo.varNames.length} variables but got ${result.countVariables()}`);
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
	});
}

function testIsLocalVariableDeclared(logger) {
	const cases = [
		{'code': 'to p :x\nprint :x\nend', 'result': true},
		{'code': 'to p\nmake "x 1\nprint :x\nend', 'result': false}, 
		// "make" sets a global variable so the scope should not have a defined procedure

		{'code': 'to p\nprint :x\nend', 'result': false},
		{'code': 'to p\nlocalmake "x 5\nprint :x\nend', 'result': true},
		{'code': 'to p\nfor ["x 1 5] [\nprint :x\n]\nend', 'result': true}, // for-loop assigns value to x.
		{'code': 'to p\nfor ["x 1 5] []\nprint :x\nend', 'result': true}, // for-loop assigns value to x.
	];
	cases.forEach(function(caseInfo) {
		const cached = getCachedParseTreeFromCode(caseInfo.code, logger);
		const varReadToken = cached.getTokensByType(ParseTreeTokenType.VARIABLE_READ).
			filter(
				t => t.val === 'x' &&
				t.parentNode.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
				t.parentNode.val === 'print')[0];
		if (varReadToken === undefined)
			logger('Unexpectedly unable to find variable read token corresponding with "print :x" in code: ' + code);
		else {
			const variable = cached.getVariables().getVariableByName('x');
			const procedure = cached.getProcedureAtToken(varReadToken);
			const scopes = variable === undefined ? [] : variable.getScopesAt(varReadToken, procedure).filter(scope => scope.procedure !== undefined);
			const result = scopes.length !== 0;
			if (result !== caseInfo.result)
				logger(`Expected ${caseInfo.result} but got ${result} for code: ${caseInfo.code}`);
		}
	});
}

function testParameters(logger) {
	const cases = [
		{'code': 'make "x 5', 'params': []},
		{'code': 'to p :x\nend', 'params': [['p', 'x']]},
		{'code': 'to p :X\nend\nto p2 :Y\nend', 'params': [['p', 'x'], ['p2', 'y']]},
	];
	cases.forEach(function(caseInfo) {
		const code = caseInfo.code;
		const cached = getCachedParseTreeFromCode(code, logger);
		const result = getVariablesFromCode(code, logger);
		const proceduresMap = cached.getProceduresMap();
		caseInfo.params.forEach(function(paramInfo) {
			const proc = proceduresMap.get(paramInfo[0]);
			if (proc === undefined)
				logger('Expected to find a procedure named ' + paramInfo[0]);
			else {
				const var1 = result.getVariableByName(paramInfo[1]);
				if (var1 === undefined)
					logger('Unable to find variable with name ' + paramInfo[1]);
				else {
					const instructionListToken = proc.getInstructionListToken();
					const varScope = var1.getScopesAt(instructionListToken, proc);
					if (varScope === undefined)
						logger('Expected to get a parameter ' + paramInfo[1] + ' procedure ' + paramInfo[0]);
				}
			}
		});
	});
}

export function testGetAnalyzedVariables(logger) {
	testGetAllVariables(prefixWrapper('testGetAllVariables', logger));
	testIsLocalVariableDeclared(prefixWrapper('testIsLocalVariableDeclared', logger));
	testParameters(prefixWrapper('testParameters', logger));
};