import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteString$(logger) {
/*
The following cases were tested with:
https://archive.org/details/msdos_qbasic_megapack
to make sure the messages are the same in QBASIC 1.1.
*/
	const cases = [
	{'code': `print string$(1, "A")`,
	'messages': ['"A']},
	{'code': `print string$(1, "ABC")`,
	'messages': ['"A']},
	{'code': `print string$(1, "B")`,
	'messages': ['"B']},
	{'code': `print string$(1, "C")`,
	'messages': ['"C']},
	{'code': `print string$(2, "A")`,
	'messages': ['"AA']},
	{'code': `print string$(5, "ABC")`,
	'messages': ['"AAAAA']},
	{'code': `print string$(1, 65)`,
	'messages': ['"A']},
	{'code': `print string$(2, 65)`,
	'messages': ['"AA']},
	{'code': `print string$(5, 65)`,
	'messages': ['"AAAAA']},
	{'code': `print string$(2, 66)`,
	'messages': ['"BB']},
	];
	processTranslateExecuteCases(cases, logger);
};