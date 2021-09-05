import { forToRepeatFor } from
'../../../../../modules/parsing/kojo/translation-to-weblogo/simplifiers/forToRepeatFor.js';
import { processSimplifierCases } from './processSimplifierCases.js';

export function testForToRepeatFor(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'penUp', 'changed': false},
		{'code': 'for ( ) {\n}', 'changed': false},
		{'code': 'for ( i ) {\n}', 'changed': false},
		{'code': 'for (i <- 1 until 10) {\n}',
		'to': 'repeatFor(1 until 10){\n}'},
		{'code': 'for (i <- 1 to 10) {\n}',
		'to': 'repeatFor(1 to 10){\n}'},
		{'code': 'for (i <- 1 until 10) {\nwrite(i)}',
		'to': 'repeatFor(1 until 10){\ni => write(i)\n}'},
	];
	processSimplifierCases(cases, forToRepeatFor, logger);
};