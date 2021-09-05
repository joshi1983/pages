import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteMidStringFunction(logger) {
	const cases = [
	// cases copied from https://www.qbasic.net/en/reference/qb11/Function/MID_.htm
	{'code': `a$ = "Where is Paris?"
PRINT MID$(a$, 10, 5)`,
	'messages': ['Paris']},
	{'code': `Text$ = "Paris, France"
MID$(Text$, 7) = "Texas "
PRINT Text$`,
	'messages': ['Paris,Texas ']},
	{'code': `Text$ = "Paris, France"
MID$(Text$, 8) = "Texas "
PRINT Text$`,
	'messages': ['Paris, Texas ']},
	{'code': `a$ = "Where is Paris?"
MID$(a$, 10, 5) = "Texas"
PRINT a$`,
	'messages': ['Where is Texas?']},
	{'code': `a$ = "Where is Paris?"
MID$(a$, 10, 6) = "Texas"
PRINT a$`,
	'messages': ['Where is Texas']},
	{'code': `a$ = "Where is Paris?"
MID$(a$, 10, 600) = "Texas"
PRINT a$`,
	'messages': ['Where is Texas']},
	{'code': `a$ = "Where is Paris?"
MID$(a$, 1, 600) = "Texas"
PRINT a$`,
	'messages': ['Texas']},
	{'code': `a$ = "Where is Paris?"
MID$(a$, 2, 600) = "Texas"
PRINT a$`,
	'messages': ['WTexas']}
	];
	processTranslateExecuteCases(cases, logger);
};