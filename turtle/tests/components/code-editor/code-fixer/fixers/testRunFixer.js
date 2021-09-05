import { runFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/runFixer.js';
import { processTestCases } from './processTestCases.js';

export function testRunFixer(logger) {
	const cases = [
		{'code': 'run', 'logged': false},
		{'code': 'run []', 'to': ' ', 'logged': true},
		{'code': 'run [print "hi]', 'to': ' print "hi', 'logged': true},
	];
	processTestCases(cases, runFixer, logger);
};