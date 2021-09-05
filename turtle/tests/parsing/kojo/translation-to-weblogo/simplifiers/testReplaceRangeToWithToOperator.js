import { processSimplifierCases } from './processSimplifierCases.js';
import { replaceRangeToWithToOperator } from
'../../../../../modules/parsing/kojo/translation-to-weblogo/simplifiers/replaceRangeToWithToOperator.js';

export function testReplaceRangeToWithToOperator(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'repeatFor(1 to 3){\n}', 'changed': false},
		{'code': 'repeatFor(rangeTo(1, 3)){\n}', 'to': 'repeatFor(1 to 3){\n}'},
	];
	processSimplifierCases(cases, replaceRangeToWithToOperator, logger);
};