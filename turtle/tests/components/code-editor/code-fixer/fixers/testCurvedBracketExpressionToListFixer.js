import { curvedBracketExpressionToListFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/curvedBracketExpressionToListFixer.js';
import { processTestCases } from './processTestCases.js';

export function testCurvedBracketExpressionToListFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'jumpTo :x', 'logged': false},
		{'code': 'jumpTo [1 2]', 'logged': false},
		{'code': 'setPos (:possibleList)', 'logged': false},
		{'code': 'jumpTo (1 2)', 'to': 'jumpTo [1 2]', 'logged': true},
		{'code': 'setPos (1 2)', 'to': 'setPos [1 2]', 'logged': true}
	];
	processTestCases(cases, curvedBracketExpressionToListFixer, logger);
};