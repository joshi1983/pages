import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteCINT(logger) {
	const cases = [
		// The following cases and outputs were found with:
		// https://archive.org/details/msdos_qbasic_megapack
		// so they should be very consistent with QBASIC's CINT function.
		//
		// Please maintain all test cases for CINT this way.
		// If another case is added for CINT, run it on the emulated QBASIC 1.1
		// so the test reflects how the real QBASIC CINT function works.
		{'code': 'print CINT(0)', 'messages': ['0']},
		{'code': 'print CINT(0.1)', 'messages': ['0']},
		{'code': 'print CINT(0.5)', 'messages': ['0']},
		{'code': 'print CINT(0.7)', 'messages': ['1']},
		{'code': 'print CINT(1)', 'messages': ['1']},
		{'code': 'print CINT(-1)', 'messages': ['-1']},
		{'code': 'print CINT(-1.1)', 'messages': ['-1']},
		{'code': 'print CINT(-1.5)', 'messages': ['-2']},
		{'code': 'print CINT(-1.9)', 'messages': ['-2']},
		{'code': 'print CINT(-2)', 'messages': ['-2']},
		{'code': 'print CINT(45.67)', 'messages': ['46']},
		{'code': 'print CINT(45.5)', 'messages': ['46']},
		{'code': 'print CINT(45)', 'messages': ['45']}
	];
	processTranslateExecuteCases(cases, logger);
};