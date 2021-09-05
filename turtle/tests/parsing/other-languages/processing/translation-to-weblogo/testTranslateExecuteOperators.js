import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testTranslateExecuteOperators(logger) {
	const cases = [
	{'code': 'println(1 + 2)', 'messages': ['3']},
	{'code': 'println(11 + 2)', 'messages': ['13']},
	{'code': 'println(1 * 2)', 'messages': ['2']},
	{'code': 'println(3 * 2)', 'messages': ['6']},
	{'code': 'println(1 - 2)', 'messages': ['-1']},
	{'code': 'println(5 - 2)', 'messages': ['3']},
	{'code': 'println(1 << 2)', 'messages': ['4']},
	{'code': 'println(3 << 2)', 'messages': ['12']},
	{'code': 'println(1 >> 2)', 'messages': ['0']},
	{'code': 'println(5 >> 2)', 'messages': ['1']},
	{'code': 'println(1 / 2)', 'messages': ['0.5']},
	{'code': 'println(2 / 2)', 'messages': ['1']},
	{'code': 'println(true || false)', 'messages': ['true']},
	{'code': 'println(true || true)', 'messages': ['true']},
	{'code': 'println(false || false)', 'messages': ['false']},
	{'code': 'println(true && false)', 'messages': ['false']},
	{'code': 'println(true && true)', 'messages': ['true']},
	{'code': 'println(true ^ false)', 'messages': ['true']},
	{'code': 'println(true ^ true)', 'messages': ['false']},
	{'code': 'println(false ^ false)', 'messages': ['false']},
	{'code': 'println(2 | 1)', 'messages': ['3']},
	{'code': 'println(3 | 1)', 'messages': ['3']},
	{'code': 'println(2 & 1)', 'messages': ['0']},
	{'code': 'println(3 & 1)', 'messages': ['1']},
	];
	processTranslateExecuteCases(cases, logger);
};