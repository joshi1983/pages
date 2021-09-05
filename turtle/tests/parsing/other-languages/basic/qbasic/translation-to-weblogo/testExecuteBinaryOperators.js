import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteBinaryOperators(logger) {
	const cases = [
	// some of these examples were copied or adapted from:
	// https://allbachelor.com/2023/08/06/exploring-arithmetic-operators-in-qbasic/
	{'code': `CLS
   DIM a, b, result AS INTEGER
   a = 10
   b = 20
   result = a + b
   PRINT "Sum:", result`,
	'messages': ['Sum:\t30']},
	{'code': `a = 10
   b = 20
   result = a * b
   PRINT "Product:", result`,
	'messages': ['Product:\t200']},
	{'code': `a = 10
   b = 20
   result = a - b
   PRINT "Difference:", result`,
	'messages': ['Difference:\t-10']},
	{'code': `numA = 23
   numB = 7
   remainder = numA MOD numB
   PRINT "Remainder:", remainder`,
	'messages': ['Remainder:\t2']},
	{'code': `base = 2
   exponent = 3
   result = base ^ exponent
   PRINT "Result:", result`,
   'messages': ['Result:\t8']},
   {'code': `print 0.5 \\ 1 REM 0
 print 1.5 \\ 1 REM 2
 print 2.5 \\ 1 REM 2
 print 3.5 \\ 1 REM 4
 print 4.5 \\ 1 REM 4
 print 5.5 \\ 1 REM 6`, // integer division like at 
 // https://qb64phoenix.com/qb64wiki/index.php/%5C
   'messages': ['0', '2', '2', '4', '4', '6']
 // That same input doesn't return the same results using qbjs
 // but I trust the examples at https://qb64phoenix.com/qb64wiki/index.php/%5C
 // to be more accurate to QBasic than qb.js.
   },

   {'code': `print 5 / 2
 print 4 / 2
 print 3 / 2`, // floating point division
   'messages': ['2.5', '2', '1.5']},

	{'code': `PRINT 1 imp 1`,
   'messages': ['true']},
	{'code': `PRINT 1 imp 0`,
   'messages': ['false']},
	{'code': `PRINT "hi" + 1`,
   'messages': ['hi1']},
	{'code': `PRINT 3 + "hi"`,
   'messages': ['3hi']},
	{'code': `x = 3
PRINT x + "hi"`,
   'messages': ['3hi']},
	{'code': `x = 3
PRINT "hi" + x`,
   'messages': ['hi3']},

	// some tests of order of operation
	{'code': `print 8 / 4 \\ 1`, 'messages': ['2']},
	{'code': `print 1 + 4 \\ 2`, 'messages': ['3']},
	{'code': `print 8 mod 4 \\ 2`, 'messages': ['0']},
	];
	processTranslateExecuteCases(cases, logger);
};