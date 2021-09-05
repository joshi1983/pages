import { pcFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/pcFixer.js';
import { processTestCases } from './processTestCases.js';

export function testPcFixer(logger) {
	const cases = [
		{'code': 'print pc', 'logged': false},
		{'code': 'print pc\nprint 4', 'logged': false},
		{'code': 'print mix pc 5 0.5', 'logged': false},
		{'code': 'pc [0]', 'logged': false},
		{'code': 'pc [0 0]', 'logged': false},
		{'code': 'pc ["hi "yo "yoyo]', 'logged': false},
		{'code': 'pc [0 0 "yoyo]', 'logged': false},
		{'code': 'pc 5', 'to': 'setPenColor 5', 'logged': true},
		{'code': 'pc "red', 'to': 'setPenColor "red', 'logged': true},
		{'code': 'pc [0 0 0]', 'to': 'setPenColor [0 0 0]', 'logged': true},
		{'code': 'pc [0 0 0 0]', 'to': 'setPenColor [0 0 0 0]', 'logged': true},
		{'code': 'pc 5 setPenColor 9', 'to': 'setPenColor 5 setPenColor 9', 'logged': true},
		{'code': 'pc 5 fd 10', 'to': 'setPenColor 5 fd 10', 'logged': true},
	];
	processTestCases(cases, pcFixer, logger);
};