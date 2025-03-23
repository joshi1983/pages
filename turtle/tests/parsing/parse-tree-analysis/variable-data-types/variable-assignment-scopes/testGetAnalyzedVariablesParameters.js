import { escapeHTML } from '../../../../helpers/escapeHTML.js';
import { getAllAssignableDataTypesString } from '../../../../helpers/getAllAssignableDataTypesString.js';
import { getAnalyzedVariables } from '../../../../../modules/parsing/parse-tree-analysis/variable-data-types/getAnalyzedVariables.js';
import { getCachedParseTreeFromCode } from '../../../../helpers/getCachedParseTreeFromCode.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

const allTypesString = getAllAssignableDataTypesString();

function testParameters(logger) {
	const cases = [
		// simulate code quality problems to verify that they don't throw JavaScript errors.
		/*{'code': 'to p :x\nfd :x', 'resultMatters': false},
		{'code': 'fd :x', 'resultMatters': false},
		{'code': 'to p\nfd :x\nend', 'resultMatters': false},
		{'code': 'to p\nfd :x\nen', 'resultMatters': false},
		{'code': 'to p :y\nfd :x\nen', 'resultMatters': false},

		{'code': 'to p :x\nfd :x\nend\np 3 + 4\np 8 + 12', 'assignedTypes': 'int', 'requiredTypes': 'num(finite)'},
		{'code': 'to p :x\nfd :x\nend\np 3.14 + 4.234', 'assignedTypes': 'num(finite)', 'requiredTypes': 'num(finite)'},
		{'code': 'to p :x\nfd :x\nend\np 3 + 4', 'assignedTypes': 'int', 'requiredTypes': 'num(finite)'},
		{'code': 'to p :x\nfd :x\nend', 'assignedTypes': '', 'requiredTypes': 'num(finite)'},
		{'code': 'to p :x\nrepeat 4 [\nfd :x\n right 90]\nend', 'assignedTypes': '', 'requiredTypes': 'num(finite)'},
		{'code': 'to p :x\nrepeat 4 [\nfd :x\n right 90\nlocalmake "x 10]\nend', 'assignedTypes': '',
		'requiredTypes': 'alphacolor|bool|easing|gradient|list|num|plist|string|transparent'},
		// 'num' would be better.
		
		{'code': 'to p :x\nfor ["i 0 :x] []\nend', 'assignedTypes': '', 'requiredTypes': 'num'},
		{'code': 'to p :x\nrepeat 4 [localmake "x 10\nfd :x\n right 90\n]\nend', 'assignedTypes': '', 'requiredTypes': allTypesString},
		{'code': 'to p :x\nlabel :x\nend', 'assignedTypes': '', 'requiredTypes': 'list|string'},
		{'code': 'to p :x\nif :x < 4 [fd :x]\nend', 'assignedTypes': '', 'requiredTypes': 'num(finite)'},
		{'code': 'to p :x\nif :x > 4 [fd :x localmake "x "hello label :x]\nend', 'assignedTypes': '', 'requiredTypes': 'num(finite)'},
		{'code': 'to p :X\nend\nto p2 :Y\nend', 'assignedTypes': '', 'requiredTypes': allTypesString},
		{'code': 'to p :x\nfd :x\nend\np 100', 'assignedTypes': 'int', 'requiredTypes': 'num(finite)'},
		{'code': 'to p :x\nfd :x\nend\np 100\np "hi', 'assignedTypes': 'int|string', 'requiredTypes': 'num(finite)'},
		{'code': 'to p :x\nqueue "x 5\nend', 'assignedTypes': '', 'requiredTypes': 'list'},
		{'code': 'to p :x\nsetProperty "x "someKey 5\nend', 'assignedTypes': '', 'requiredTypes': 'plist'},
		{'code': 'to p :x\nlocalmake "x 5\nend', 'assignedTypes': '', 'requiredTypes': allTypesString},
		{'code': 'to p :x\nmake "x 5\nend', 'assignedTypes': '', 'requiredTypes': allTypesString},
		{'code': 'to p :x\nlocalmake "x 5\nfd :x\nend', 'assignedTypes': '', 'requiredTypes': allTypesString},
		{'code': 'to p :x\nmake "x 5\nforward :x\nend', 'assignedTypes': '', 'requiredTypes': allTypesString},
		{'code': 'to p :x\nfd :x\nend\np "hello\np 5', 'requiredTypes': 'num(finite)', 'assignedTypes': 'int|string'},
		{'code': 'to p :x\nmake "var1 :x\nsetFillColor :x\nend', 'requiredTypes': 'alphacolor|transparent', 'assignedTypes': ''},
		{'code': 'to p :x\nsetFillColor mix :x transparent 0.5\nend', 'requiredTypes': 'alphacolor', 'assignedTypes': ''},
		{
			'code': 'to p :x\nsetFillColor mix :x [1 2 3] 0.5\nend\np []',
			'requiredTypes': 'alphacolor',
			'assignedTypes': 'list'
		},
		{
			'code': 'to p :x\nsetFillColor mix :x [5] 0.5\nend\np []',
			'requiredTypes': 'alphacolor|list<alphacolor|num>',
			// Ideally, this would not include alphacolor but we're not quite there yet.
			// The reason to exclude alphacolor is because no alphacolor can be mixed with list [5].
			// An empty list is not a valid color or alphacolor.
			'assignedTypes': 'list'
		},
		*/{
			'code': `to p :num :x
		if list? :num [
			if list? :x [
				output []
			]
		]
		localmake "result "
		localmake "i 0
		print "here
		while :i < :x [
			localmake "i :i + 1
		]
		output :result
	end`, 'requiredTypes': 'alphacolor|list|num|string',
	// num|list would be even better.
	'assignedTypes': 'alphacolor|list|num|string'
	// 'list|num' would be better.
	}
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
						plogger(escapeHTML(`Expected requiredTypes to be ${caseInfo.requiredTypes} but got ${requiredTypesStr}`));
					if (assignedTypesStr !== caseInfo.assignedTypes)
						plogger(escapeHTML(`Expected assignedTypes to be ${caseInfo.assignedTypes} but got ${assignedTypesStr}`));
				}
			}
		}
	});
}

export function testGetAnalyzedVariablesParameters(logger) {
	wrapAndCall([
		testParameters
	], logger);
};