import { repAboveFixer } from
'../../../../../../modules/parsing/other-languages/turtleSpaces/translation-to-weblogo/fixers/repAboveFixer.js';
import { processTestCases } from
'../../../../../components/code-editor/code-fixer/fixers/processTestCases.js';

export function testRepAboveFixer(logger) {
	const cases = [
		{'code': `repeat 3 [
	show repcount
]`, 'logged': false},
		{'code': `repeat 3 [
	show repabove 0
]`, 'to': `repeat 3 [
	show repcount 
]`, 'logged': true},
		{'code': `repeat 3 [
	repeat 2 [
		show repabove 1
	]
]`,
		'to': `repeat 3 [make "repcount1 repcount
	repeat 2 [
		show :repcount1 
	]
]`, 'logged': true}
	];
	processTestCases(cases, repAboveFixer, logger);
};