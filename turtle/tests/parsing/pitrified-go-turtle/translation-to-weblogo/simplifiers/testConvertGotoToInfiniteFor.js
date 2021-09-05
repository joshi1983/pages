import { convertGotoToInfiniteFor } from
'../../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/simplifiers/convertGotoToInfiniteFor.js';
import { processSimplifierCases } from './processSimplifierCases.js';

export function testConvertGotoToInfiniteFor(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'x: goto x', 'to': `x:
for {
}`},
	];
	processSimplifierCases(cases, convertGotoToInfiniteFor, logger);
};