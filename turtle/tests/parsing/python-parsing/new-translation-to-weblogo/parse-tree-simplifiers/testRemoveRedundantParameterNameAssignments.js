import { processTestCases } from
'./processTestCases.js';
import { removeRedundantParameterNameAssignments } from
'../../../../../modules/parsing/python-parsing/new-translation-to-weblogo/parse-tree-simplifiers/removeRedundantParameterNameAssignments.js';

export function testRemoveRedundantParameterNameAssignments(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'f(x=100)', 'changed': false},
		{'code': 'circle(100)', 'changed': false},
		{'code': 'circle(extent=100)', 'changed': false}, 
			// removing extent= would change the meaning.
			// extent is the second argument.

		{'code': 'circle(100, 90)', 'changed': false},
		{'code': 'circle(radius=100)',
			'out': 'circle(100)'},
		{'code': 't.circle(radius=100)',
			'out': 't.circle(100)'},
		{'code': 'turtle.circle(radius=100)',
			'out': 'turtle.circle(100)'},
		{'code': 'circle(radius=100, extent=90)',
			'out': 'circle(100, 90)'},
		{'code': 't.circle(radius=100, extent=90)',
			'out': 't.circle(100, 90)'},
	];
	processTestCases(cases, removeRedundantParameterNameAssignments, logger);
};