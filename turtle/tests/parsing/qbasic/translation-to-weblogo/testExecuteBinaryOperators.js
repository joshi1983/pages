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
	];
	processTranslateExecuteCases(cases, logger);
};