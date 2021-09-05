import { argListBracketBalanceFixer } from
'../../../../../modules/parsing/kojo/translation-to-weblogo/simplifiers/argListBracketBalanceFixer.js';
import { processSimplifierCases } from './processSimplifierCases.js';

export function testArgListBracketBalanceFixer(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'println("hi")', 'changed': false},
		{'code': 'println("hi" write("hello")', 'to': 'println("hi")\nwrite("hello")'},
		{'code': `setPenFont(Font("algerian",14)
write("hi")`, 'to': `setPenFont(Font("algerian",14))
write("hi")`}
	];
	processSimplifierCases(cases, argListBracketBalanceFixer, logger);
};