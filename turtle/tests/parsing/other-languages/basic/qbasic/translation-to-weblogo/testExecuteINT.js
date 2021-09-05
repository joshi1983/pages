import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteINT(logger) {
	const cases = [
		// test cases from https://wiki.qb64.dev/qb64wiki/index.php/INT
		// doublechecked with QBASIC 1.1 emulated at 
		// https://archive.org/details/msdos_qbasic_megapack
		{'code': 'print INT(2.5)', 'messages': ['2']},
		{'code': 'print INT(-2.5)', 'messages': ['-3']},

		{'code': 'print INT(0)', 'messages': ['0']},
		{'code': 'print INT(0.1)', 'messages': ['0']},
		{'code': 'print INT(0.5)', 'messages': ['0']},
		{'code': 'print INT(0.7)', 'messages': ['0']},
		{'code': 'print INT(1)', 'messages': ['1']},
		{'code': 'print INT(1.1)', 'messages': ['1']},
		{'code': 'print INT(1.5)', 'messages': ['1']},
		{'code': 'print INT(1.7)', 'messages': ['1']},

		{'code': 'print INT(-0.1)', 'messages': ['-1']},
		{'code': 'print INT(-0.5)', 'messages': ['-1']},
		{'code': 'print INT(-0.7)', 'messages': ['-1']},
		{'code': 'print INT(-1)', 'messages': ['-1']},
		{'code': 'print INT(-1.1)', 'messages': ['-2']},
		{'code': 'print INT(-1.5)', 'messages': ['-2']},
		{'code': 'print INT(-1.7)', 'messages': ['-2']},
		{'code': 'print INT(-2)', 'messages': ['-2']},
	];
	processTranslateExecuteCases(cases, logger);
};