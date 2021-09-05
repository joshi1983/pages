import { processScanTokensTestCases } from './processScanTokensTestCases.js';
import { rectToQBasicLine } from
'../../../../../modules/parsing/basic/micro-a/scanning/rectToQBasicLine.js';

export function testRectToQBasicLine(logger) {
	const cases = [
		{'code': 'rect', 'tokens': ['rect']},
		{'code': 'rect 1,2,3',
			'tokens': ['rect', '1', ',', '2', ',', '3']},
		{'code': 'rect 1,2,3,',
			'tokens': ['rect', '1', ',', '2', ',', '3', ',']},
		{'code': 'rect 1,2,3,4',
			'tokens': ['line', '(', '1', ',', '2', ')', '-',
				'(', '3', ',', '4', ')', ',', ',', 'BF']},
		{'code': 'rect 1,2,3,4\nprint "hi"',
			'tokens': ['line', '(', '1', ',', '2', ')', '-', '(', '3', ',', '4', ')', ',', ',', 'BF',
			'print', '"hi"']},
		{'code': 'print "before"\nrect 1,2,3,4\nprint "hi"',
			'tokens': ['print', '"before"',
			'line', '(', '1', ',', '2', ')', '-', '(', '3', ',', '4', ')', ',', ',', 'BF',
			'print', '"hi"']}
	];
	processScanTokensTestCases(cases, rectToQBasicLine, logger);
};