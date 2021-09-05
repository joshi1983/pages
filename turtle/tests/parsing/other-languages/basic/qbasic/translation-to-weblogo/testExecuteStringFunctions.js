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
	{
		'code': 'PRINT HEX$(&HF41)',
		'messages': ['F41']
		// tested with: https://archive.org/details/msdos_qbasic_megapack
	},
	{
		'code': 'PRINT OCT$(10)',
		'messages': ['12']
		// tested with: https://archive.org/details/msdos_qbasic_megapack
	},
	{'code': 'print oct$(3)',
	'messages': ['3']},
	{'code': 'print oct$(8)',
	'messages': ['10']},
	{'code': 'print cvi(mki$(1))',
	'messages': ['1']},
	{'code': 'print cvi(mki$(1000))',
	'messages': ['1000']},
	{'code': 'print cvl(mkl$(1))',
	'messages': ['1']},
	{'code': 'print cvl(mkl$(1000))',
	'messages': ['1000']},
	{'code': 'print _cv(integer, mki$(2))',
	'messages': ['2']},
	{'code': 'print _cv(integer, mki$(1000))',
	'messages': ['1000']},
	{'code': 'print _cv(_integer64, _mk$(_integer64, 1))',
	'messages': ['1']},
	{'code': 'print _cv(_integer64, _mk$(_integer64, 256))',
	'messages': ['256']},
	{'code': 'print _cv(long, _mk$(long, 1))',
	'messages': ['1']},
	{'code': 'print _cv(long, _mk$(long, 256))',
	'messages': ['256']},
	{'code': 'print _cv(integer, _mk$(integer, 1))',
	'messages': ['1']},
	{'code': 'print _cv(integer, _mk$(integer, 256))',
	'messages': ['256']},
	{'code': 'print _cv(_byte, _mk$(_byte, 1))',
	'messages': ['1']},
	{'code': 'print _cv(_byte, _mk$(_byte, 100))',
	'messages': ['100']},
	];
	processTranslateExecuteCases(cases, logger);
};