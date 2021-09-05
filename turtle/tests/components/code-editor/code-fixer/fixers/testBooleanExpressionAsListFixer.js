import { processTestCases } from './processTestCases.js';
import { booleanExpressionAsListFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/booleanExpressionAsListFixer.js';

export function testBooleanExpressionAsListFixer(logger) {
	const cases = [
		{'code': 'if 1 < 2 [print "hello]', 'logged': false},
		{'code': 'if [1 < 2] [print "hello]', 'to': 'if 1 < 2 [print "hello]', 'logged': true},
		{'code': 'if [1 < 2*3] [print "hello]', 'to': 'if 1 < 2*3 [print "hello]', 'logged': true},
		{'code': 'if [1 < (2*3)] [print "hello]', 'to': 'if 1 < (2*3) [print "hello]', 'logged': true},
	];
	processTestCases(cases, booleanExpressionAsListFixer, logger);
};