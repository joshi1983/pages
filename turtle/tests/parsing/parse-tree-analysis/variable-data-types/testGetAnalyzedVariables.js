import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { getTokensByType } from '../../../../modules/parsing/parse-tree-analysis/cached-parse-tree/getTokensByType.js';
import { getVariablesFromCode } from './getVariablesFromCode.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

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
		const varReadToken = getTokensByType(cached, ParseTreeTokenType.VARIABLE_READ).
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
	testIsLocalVariableDeclared(prefixWrapper('testIsLocalVariableDeclared', logger));
	testParameters(prefixWrapper('testParameters', logger));
};