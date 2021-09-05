import { colourStringLiteralFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/colourStringLiteralFixer.js';
import { processTestCases } from './processTestCases.js';

export function testColourStringLiteralFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'to red\nend', 'logged': false},
		{'code': 'setPenColor "red', 'logged': false},
		{'code': 'setPenColor red', 'to': 'setPenColor "red', 'logged': true},
		{'code': 'setPenColor #333', 'to': 'setPenColor "#333', 'logged': true},
		{'code': 'setPenColor #112233', 'to': 'setPenColor "#112233', 'logged': true},
		{'code': 'setFillColor "f0ff00', 'to': 'setFillColor "#f0ff00', 'logged': true},
	];
	processTestCases(cases, colourStringLiteralFixer, logger);
};