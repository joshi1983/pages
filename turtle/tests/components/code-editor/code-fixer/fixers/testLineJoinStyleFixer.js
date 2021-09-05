import { processTestCases } from './processTestCases.js';
import { lineJoinStyleFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/lineJoinStyleFixer.js';

export function testLineJoinStyleFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'setLineJoinStyle "round', 'logged': false},
		{'code': 'setLineJoinStyle round',
			'to': 'setLineJoinStyle "round', 'logged': true, 'ignoreParseErrors': true},
		{'code': 'setLineJoinStyle miter',
			'to': 'setLineJoinStyle "miter', 'logged': true},
		{'code': 'setLineJoinStyle bevel',
			'to': 'setLineJoinStyle "bevel', 'logged': true},
	];
	processTestCases(cases, lineJoinStyleFixer, logger);
};