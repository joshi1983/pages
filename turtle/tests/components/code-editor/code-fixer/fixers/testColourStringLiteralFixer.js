import { colourStringLiteralFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/colourStringLiteralFixer.js';
import { processTestCase } from './processTestCase.js';

export function testColourStringLiteralFixer(logger) {
	const cases = [
		{'code': '', 'to': '', 'logged': false},
		{'code': 'to red\nend', 'to': 'to red\nend', 'logged': false},
		{'code': 'setPenColor "red', 'to': 'setPenColor "red', 'logged': false},
		{'code': 'setPenColor red', 'to': 'setPenColor "red', 'logged': true},
		{'code': 'setPenColor #333', 'to': 'setPenColor "#333', 'logged': true},
		{'code': 'setPenColor #112233', 'to': 'setPenColor "#112233', 'logged': true},
	];
	cases.forEach(function(caseInfo) {
		processTestCase(caseInfo, colourStringLiteralFixer, logger);
	});
};