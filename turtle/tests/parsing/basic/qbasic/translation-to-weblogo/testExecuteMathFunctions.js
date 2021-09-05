import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteMathFunctions(logger) {
	const cases = [
		// The following cases were tested with:
		// https://archive.org/details/msdos_qbasic_megapack
		{'code': 'print exp(1)', 'messages': ['2.718282']},
		{'code': 'print exp(0)', 'messages': ['1']},

		{'code': 'print log(1)', 'messages': ['0']},
		{'code': 'print log(2)', 'messages': ['0.6931472']},
		{'code': 'print log(10)', 'messages': ['2.302585']},

		{'code': 'print sin(0)', 'messages': ['0']},
		{'code': 'print sin(1)', 'messages': ['0.8414710']},
		{'code': 'print sin(90)', 'messages': ['0.8939967']},

		{'code': 'print cos(0)', 'messages': ['1']},
		{'code': 'print cos(1)', 'messages': ['0.5403023']},
	
		{'code': 'print tan(0)', 'messages': ['0']},
		{'code': 'print tan(3.14159265358979/4)', 'messages': ['1']},

		{'code': `print atn(1)`, 'messages': ['0.7853982']},
		{'code': `print atn(0)`, 'messages': ['0']},
		{'code': `print atn(0.5)`, 'messages': ['0.4636476']},
		{'code': `print atn(-1)`, 'messages': ['-0.7853982']},

		{'code': `print abs(0)`, 'messages': ['0']},
		{'code': `print abs(0.5)`, 'messages': ['0.5']},
		{'code': `print abs(-1)`, 'messages': ['1']},
		{'code': `print abs(-0.5)`, 'messages': ['0.5']},
	];
	processTranslateExecuteCases(cases, logger);
};