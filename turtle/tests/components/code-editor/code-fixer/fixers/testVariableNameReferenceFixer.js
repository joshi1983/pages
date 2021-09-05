import { variableNameReferenceFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/variableNameReferenceFixer.js';
import { processTestCases } from './processTestCases.js';

export function testVariableNameReferenceFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'make :x 5', 'to': 'make "x 5', 'logged': true},
		{'code': 'make :x "x', 'to': 'make "x "x', 'logged': true},
		{'code': 'make x 5', 'to': 'make "x 5', 'logged': true},
		{'code': 'make " 5', 'logged': false},
		{'code': 'make " "x', 'logged': false},
		{'code': 'make " :x', 'logged': false},
		{'code': 'make " x', 'logged': false},
		{'code': 'print :x + x:y', 'logged': false},
		{'code': 'swap "x "y', 'logged': false},
		{'code': 'swap :x "y', 'to': 'swap "x "y', 'logged': true},
		{'code': 'swap "x :y', 'to': 'swap "x "y', 'logged': true},
		{'code': 'swap x y', 'to': 'swap "x "y', 'logged': true},
		{'code': 'swap :x :y', 'to': 'swap "x "y', 'logged': true},
		{'code': 'setItem 1 :list 3', 'to': 'setItem 1 "list 3', 'logged': true},
	];
	processTestCases(cases, variableNameReferenceFixer, logger);
};