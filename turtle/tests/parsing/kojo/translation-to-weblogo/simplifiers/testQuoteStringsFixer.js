import { processSimplifierCases } from './processSimplifierCases.js';
import { quoteStringsFixer } from
'../../../../../modules/parsing/kojo/translation-to-weblogo/simplifiers/quoteStringsFixer.js';

export function testQuoteStringsFixer(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'write(hello)', 'changed': false},
		{'code': 'write(x)', 'changed': false},
		{'code': 'write("hello world")', 'changed': false},
		{'code': 'write(x y)', 'to': 'write("x y")'}
	];
	processSimplifierCases(cases, quoteStringsFixer, logger);
};