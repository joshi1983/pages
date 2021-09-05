import { harmonizeVariableNameCase } from '../../../../modules/components/code-editor/harmonize-case/harmonizeVariableNameCase.js';
import { processTestCases } from './processTestCases.js';

export function testHarmonizeVariableNameCase(logger) {
	const cases = [
		{// fully harmonized so no change needed
			'code': 'make "X 4\nprint :X',
			'changed': false
		},
		{
			'code': 'setItem 3 (item 1 item 1 :cells) true',
			'changed': false
		},
		{
			// closest to camelCase wins when there is a tie for most-used case.
			'code': 'make "x 4\nprint :X',
			'to': 'make "x 4\nprint :x'
		},
		{
			// most-used case wins.
			'code': 'make "X 4\nmake "X 8\nprint :x',
			'to': 'make "X 4\nmake "X 8\nprint :X'
		},
		{
			// closest to camelcase wins.
			'code': 'to p :X\nend make "x 5',
			'to': 'to p :x\nend make "x 5'
		},
		{
			'code': 'to p :X\nlocalmake "x 5\nend',
			'to': 'to p :x\nlocalmake "x 5\nend'
		},
		{
			'code': 'to p :x\nlocalmake "X 5\nend',
			'to': 'to p :x\nlocalmake "x 5\nend'
		}
	];
	processTestCases(cases, harmonizeVariableNameCase, logger);

};