import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteNumberLiterals(logger) {
	const cases = [
		// The following cases were tested with:
		// https://archive.org/details/msdos_qbasic_megapack
		{'code': 'print 10', 'messages': ['10']},
		{'code': 'print &010', 'messages': ['8']},
		{'code': 'print &017', 'messages': ['15']},
		{'code': 'print &H10', 'messages': ['16']},
		{'code': 'print &H1A', 'messages': ['26']},
	];
	processTranslateExecuteCases(cases, logger);
};