import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteIntegerDivision(logger) {
	const cases = [
// The outputs from these test cases were found by running:
// https://archive.org/details/msdos_qbasic_megapack
// That's an emulated version of QBASIC 1.1.
		{'code': 'print 1 \\ 1', 'messages': ['1']},
		{'code': 'print 2 \\ 1', 'messages': ['2']},
		{'code': 'print 1 \\ -1', 'messages': ['-1']},
		{'code': 'print 2 \\ -1', 'messages': ['-2']},
		{'code': 'print 1 \\ 2', 'messages': ['0']},
		{'code': 'print 2 \\ 2', 'messages': ['1']},
		{'code': 'print 1 \\ -2', 'messages': ['0']},
		{'code': 'print 2 \\ -2', 'messages': ['-1']},

		{'code': 'print 3 \\ -2', 'messages': ['-1']},
		{'code': 'print 3 \\ -1', 'messages': ['-3']},
		{'code': 'print 3 \\ 1', 'messages': ['3']},
		{'code': 'print 3 \\ 2', 'messages': ['1']},

		{'code': 'print 1.5 \\ 1', 'messages': ['2']},

		{'code': 'print 2.5 \\ 1', 'messages': ['2']},
		{'code': 'print 1 \\ 1.5', 'messages': ['0']},
		{'code': 'print 1 \\ 2.5', 'messages': ['0']},
		{'code': 'print 2 \\ 1.5', 'messages': ['1']},
		{'code': 'print 1 \\ -1.5', 'messages': ['0']},
		{'code': 'print 1 \\ -2.5', 'messages': ['0']},
		{'code': 'print 2 \\ -1.5', 'messages': ['-1']},
		{'code': 'print 1.5 \\ 1.5', 'messages': ['1']},
		{'code': 'print -1.5 \\ 1', 'messages': ['-2']},
		{'code': 'print -1.5 \\ 2', 'messages': ['-1']},

		{'code': 'print 4 \\ (1 + 1)', 'messages': ['2']},
		{'code': 'print (2 + 2) \\ (1 + 1)', 'messages': ['2']},
		{'code': 'print (3 + 1) \\ (1 + 1)', 'messages': ['2']},
		{'code': 'print 2 * 2 \\ (1 + 1)', 'messages': ['2']}
	];
	processTranslateExecuteCases(cases, logger);
};