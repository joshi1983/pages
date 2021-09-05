import { polyEndAfterProcedureFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/polyEndAfterProcedureFixer.js';
import { processTestCases } from './processTestCases.js';

export function testPolyEndAfterProcedureFixer(logger) {
	const cases = [
		{'code': 'to p\npolyEnd\npolyStart\n fd 100\nright 90\nfd 100\noutput 100\nend\npolyStart circleLeft 100 p\npolyEnd',
			'logged': false
		},/* procedure p ends the path so the fixer shouldn't do anything with the global polyStart and polyEnd */
		{'code': 'to p\ncircleLeft 100\npolyEnd\nend\npolyStart p\npolyEnd',
			'to': 'to p\ncircleLeft 100\npolyEnd\nend\npolyStart p\n',
			'logged': true
		}
	];
	processTestCases(cases, polyEndAfterProcedureFixer, logger);
};