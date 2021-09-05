import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteStringFunctions(logger) {
	const cases = [
	// some cases copied from: https://www.qbasic.net/en/reference/qb11/Function/RIGHT_.htm
	{'code': `a$ = "Microsoft QBasic"
PRINT LEFT$(a$, 5)`,
'messages': ['Micro']},
	{'code': `a$ = "Microsoft QBasic"
PRINT RIGHT$(a$, 5)`,
'messages': ['Basic']},
	{'code': `a$ = "Microsoft QBasic"
PRINT LEFT$(a$, 5)
PRINT RIGHT$(a$, 5)`,
'messages': ['Micro', 'Basic']},

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
	'messages': ['WTexas']},

	// cases from:
	// https://prajwalrai.com.np/string-pattern-in-qbasic/
	{'code': `A$=”NEPAL”

FOR I = 1 TO LEN (A$)

PRINT LEFT$(A$,i)

NEXT i`,
	'messages': ['N', 'NE', 'NEP', 'NEPA', 'NEPAL']
	},
	{'code': `A$ = “NEPAL”

FOR i = LEN(A$) TO 1 STEP -1

PRINT LEFT$(A$, i)

NEXT i`,
	'messages': ['NEPAL', 'NEPA', 'NEP', 'NE', 'N']},

	// case tested with https://qbjs.org/
	{'code': `dim A$ as String
A$ = "NEPAL"

FOR i = LEN(A$) TO 1 STEP -1

PRINT RIGHT$(A$, i)

NEXT i`,
		'messages': ['NEPAL', 'EPAL', 'PAL', 'AL', 'L']
	},
	{'code': `a$ = “NEPAL”
x = LEN(a$)
FOR i = 1 TO x – 1
PRINT TAB(i); MID$(a$, i, 2)
NEXT i`, 'messages': ['\tNE', '\t\tEP', '\t\t\tPA', '\t\t\t\tAL']},
	{'code': 'print mki$ &h4142',
	'messages': ['AB']
	},
	{'code': 'print mkl$ &h41424344',
	'messages': ['ABCD']
	},
	];
	processTranslateExecuteCases(cases, logger);
};