import { getAllAssignableDataTypesString } from '../../../../helpers/getAllAssignableDataTypesString.js';
import { getAnalyzedVariables } from '../../../../../modules/parsing/parse-tree-analysis/variable-data-types/getAnalyzedVariables.js';
import { getCachedParseTreeFromCode } from '../../../../helpers/getCachedParseTreeFromCode.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';

const allTypesString = getAllAssignableDataTypesString();

function testParameters(logger) {
	const cases = [
		// simulate code quality problems to verify that they don't throw JavaScript errors.
		{'code': 'to p :x\nfd :x', 'resultMatters': false},
		{'code': 'fd :x', 'resultMatters': false},
		{'code': 'to p\nfd :x\nend', 'resultMatters': false},
		{'code': 'to p\nfd :x\nen', 'resultMatters': false},
		{'code': 'to p :y\nfd :x\nen', 'resultMatters': false},

		{'code': 'to p :x\nfd :x\nend\np 3 + 4\np 8 + 12', 'assignedTypes': 'int', 'requiredTypes': 'num'},
		{'code': 'to p :x\nfd :x\nend\np 3.14 + 4.234', 'assignedTypes': 'num', 'requiredTypes': 'num'},
		{'code': 'to p :x\nfd :x\nend\np 3 + 4', 'assignedTypes': 'int', 'requiredTypes': 'num'},
		{'code': 'to p :x\nfd :x\nend', 'assignedTypes': '', 'requiredTypes': 'num'},
		{'code': 'to p :x\nrepeat 4 [\nfd :x\n right 90]\nend', 'assignedTypes': '', 'requiredTypes': 'num'},
		{'code': 'to p :x\nrepeat 4 [\nfd :x\n right 90\nlocalmake "x 10]\nend', 'assignedTypes': '', 'requiredTypes': 'num'},
		{'code': 'to p :x\nrepeat 4 [localmake "x 10\nfd :x\n right 90\n]\nend', 'assignedTypes': '', 'requiredTypes': allTypesString},
		{'code': 'to p :x\nlabel :x\nend', 'assignedTypes': '', 'requiredTypes': 'list|string'},
		{'code': 'to p :x\nif :x < 4 [fd :x]\nend', 'assignedTypes': '', 'requiredTypes': 'num'},
		{'code': 'to p :x\nif :x > 4 [fd :x localmake "x "hello label :x]\nend', 'assignedTypes': '', 'requiredTypes': 'num'},
		{'code': 'to p :X\nend\nto p2 :Y\nend', 'assignedTypes': '', 'requiredTypes': allTypesString},
		{'code': 'to p :x\nfd :x\nend\np 100', 'assignedTypes': 'int', 'requiredTypes': 'num'},
		{'code': 'to p :x\nfd :x\nend\np 100\np "hi', 'assignedTypes': 'int|string', 'requiredTypes': 'num'},
		{'code': 'to p :x\nqueue "x 5\nend', 'assignedTypes': '', 'requiredTypes': 'list'},
		{'code': 'to p :x\nsetProperty "x "someKey 5\nend', 'assignedTypes': '', 'requiredTypes': 'plist'},
		{'code': 'to p :x\nlocalmake "x 5\nend', 'assignedTypes': '', 'requiredTypes': allTypesString},
		{'code': 'to p :x\nmake "x 5\nend', 'assignedTypes': '', 'requiredTypes': allTypesString},
		{'code': 'to p :x\nlocalmake "x 5\nfd :x\nend', 'assignedTypes': '', 'requiredTypes': allTypesString},
		{'code': 'to p :x\nmake "x 5\nforward :x\nend', 'assignedTypes': '', 'requiredTypes': allTypesString},
		{'code': 'to p :x\nfd :x\nend\np "hello\np 5', 'requiredTypes': 'num', 'assignedTypes': 'int|string'},
		{'code': 'to p :x\nmake "var1 :x\nsetFillColor :x\nend', 'requiredTypes': 'alphacolor|transparent', 'assignedTypes': ''},
		{'code': 'to p :x\nsetFillColor mix :x transparent 0.5\nend', 'requiredTypes': 'alphacolor', 'assignedTypes': ''},
	];
	cases.forEach(function(caseInfo, index) {
		const cached = getCachedParseTreeFromCode(caseInfo.code, logger);
		const procedure = cached.getProceduresMap().get('p');
		const plogger = prefixWrapper(`Case ${index} with code ${caseInfo.code}`, logger);
		if (procedure === undefined && caseInfo.resultMatters !== false)
			plogger('Expected to find a procedure p but not found.');
		else {
			const variables = getAnalyzedVariables(cached);
			if (caseInfo.resultMatters !== false) {
				const variable = variables.getVariableByName('x');
				const scope = variable.getFirstScopeInProcedure(procedure);
				if (scope === undefined)
					plogger('Expected a scope but got ' + scope);
				else {
					const requiredTypesStr = scope.requiredTypes.toString();
					const assignedTypesStr = scope.assignedTypes.toString();
					if (requiredTypesStr !== caseInfo.requiredTypes)
						plogger(`Expected requiredTypes to be ${caseInfo.requiredTypes} but got ${requiredTypesStr}`);
					if (assignedTypesStr !== caseInfo.assignedTypes)
						plogger(`Expected assignedTypes to be ${caseInfo.assignedTypes} but got ${assignedTypesStr}`);
				}
			}
		}
	});
}

export function testGetAnalyzedVariablesParameters(logger) {
	testParameters(prefixWrapper('testParameters', logger));
};