import { convertToJumpCommandFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/convertToJumpCommandFixer.js';
import { processTestCases } from './processTestCases.js';

export function testConvertToJumpCommandFixer(logger) {
	const cases = [
		{'code': 'pc 1', 'logged': false},
		{'code': 'fd 100', 'logged': false},
		{'code': 'to p\npenDown\nend\npenup p forward 10', 'logged': false},
		{'code': 'penUp\nto p\nforward 10\nend\npenDown\np', 'logged': false},
		{'code': 'if 5 < random 10 [ penup] forward 10', 'logged': false},
		{'code': 'penUp repeat 2 [forward 10 penDown]', 'logged': false},

		{
			'code': 'penUp forward 10',
			'to': 'penUp jumpForward 10',
			'logged': true
		},
		{
			'code': 'penup forward 10',
			'to': 'penup jumpForward 10',
			'logged': true
		},
		{
			'code': 'setPenColor transparent forward 10',
			'to': 'setPenColor transparent jumpForward 10',
			'logged': true
		},
		{
			'code': 'setPenSize 0 forward 10',
			'to': 'setPenSize 0 jumpForward 10',
			'logged': true
		},
		{
			'code': 'setPenSize 0 fd 10',
			'to': 'setPenSize 0 jumpForward 10',
			'logged': true
		},
		{
			'code': 'setPenSize 0 backward 10',
			'to': 'setPenSize 0 jumpBackward 10',
			'logged': true
		},
		{
			'code': 'setPenSize 0 back 10',
			'to': 'setPenSize 0 jumpBackward 10',
			'logged': true
		},
		{
			'code': 'setPenSize 0 setXY 1 2',
			'to': 'setPenSize 0 jumpTo [1 2]',
			'logged': true
		},
		{
			'code': 'setPenSize 0 setXYZ 1 2 3',
			'to': 'setPenSize 0 jumpTo [1 2 3]',
			'logged': true
		},
	];
	processTestCases(cases, convertToJumpCommandFixer, logger);
};