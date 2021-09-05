import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteOr(logger) {
	const cases = [
		// tested at:
		// https://archive.org/details/msdos_qbasic_megapack
		{'code': 'print 1 or 1', 'messages': ['1']},
		{'code': 'print 1 or 2', 'messages': ['3']},
		{'code': 'print 3 or 2', 'messages': ['3']},
	];
	processTranslateExecuteCases(cases, logger);
};