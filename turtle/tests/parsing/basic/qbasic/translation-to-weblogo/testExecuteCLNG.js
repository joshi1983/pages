import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteCLNG(logger) {
	const cases = [
		// These test cases are based on running code in an emulated QBASIC 1.1 at:
		// from https://archive.org/details/msdos_qbasic_megapack
		{'code': 'print CLNG(2.5)', 'messages': ['2']},
		{'code': 'print CLNG(-2.5)', 'messages': ['-2']},

		{'code': 'print CLNG(0)', 'messages': ['0']},
		{'code': 'print CLNG(0.1)', 'messages': ['0']},
		{'code': 'print CLNG(0.5)', 'messages': ['0']},
		{'code': 'print CLNG(0.7)', 'messages': ['1']},

		{'code': 'print CLNG(1)', 'messages': ['1']},
		{'code': 'print CLNG(1.1)', 'messages': ['1']},
		{'code': 'print CLNG(1.5)', 'messages': ['2']},
		{'code': 'print CLNG(1.7)', 'messages': ['2']},

		{'code': 'print CLNG(-0.1)', 'messages': ['0']},
		{'code': 'print CLNG(-0.5)', 'messages': ['0']},
		{'code': 'print CLNG(-0.7)', 'messages': ['-1']},

		{'code': 'print CLNG(-1)', 'messages': ['-1']},
		{'code': 'print CLNG(-1.1)', 'messages': ['-1']},
		{'code': 'print CLNG(-1.5)', 'messages': ['-2']},
		{'code': 'print CLNG(-1.7)', 'messages': ['-2']},
		{'code': 'print CLNG(-2)', 'messages': ['-2']},
	];
	processTranslateExecuteCases(cases, logger);
};