import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testPrintExecution(logger) {
	const cases = [
		{'code': 'make "x 4 print thing "x', 'messages': ['4']},
		{'code': 'print yCor', 'messages': ['0']},
		{'code': 'forward 100 print yCor', 'messages': ['100']},
		{'code': 'pause forward 40 wait 1000 print yCor', 'messages': ['40']},
		{'code': 'for [i 1 3] [print :i]', 'messages': ['1', '2', '3']},

		{'code': 'print (sentence "index 3 "hello)', 'messages': ['[index 3 hello]']},
		// MSWLogo and FMSLogo would print without the square brackets but
		// WebLogo shows the brackets to indicate the printed data type is not a string.
		// Maybe part of the translator could use a procedure to remove the brackets but
		// this seems good enough for now and for this test.

		{'code': 'print {1 2 3}', 'messages': ['[1 2 3]']},
		{'code': 'print arrayToList {1 2 3}', 'messages': ['[1 2 3]']},
		
		// case from: https://fmslogo.sourceforge.io/manual/command-fput.html
		{'code': 'SHOW FPUT 1 [2 3 4]', 'messages': ['[1 2 3 4]']},
		// case from: https://fmslogo.sourceforge.io/manual/command-lput.html
		{'code': 'SHOW LPUT 4 [1 2 3]', 'messages': ['[1 2 3 4]']},

		// adapted case from: https://fmslogo.sourceforge.io/manual/command-array.html
		// That shows origin 0 but I adapted to origin 1.
		// origin for FMSLogo arrays can be 0 or 1.
		// All lists start at index 1 but FMSLogo arrays can be 0 or 1.
		// MSWLogo was tested to behave like this test case.
		// origin 0 seems difficult to translate to WebLogo because all subsequent
		// item and setItem calls associated with the value would be affected.
		{'code': `MAKE "myarray (ARRAY 3 1)
SETITEM 3 :myarray 1
SETITEM 2 :myarray 2
SETITEM 1 :myarray 3
SHOW :myarray`, 'messages': ['[3 2 1]']},

		{'code': 'print {1 2 3}@0', 'messages': ['[1 2 3]']},
		{'code': 'print {1 2 3}@2', 'messages': ['[1 2 3]']},
		{'code': 'print {a b c}@0', 'messages': ['[a b c]']},
		{'code': `TEST 1 = 1
  IFTRUE [PRINT "hi]
  IFFALSE [PRINT "bye]`, 'messages': ['hi']},
		{'code': `TEST 1 = 0
  IFTRUE [PRINT "hi]
  IFFALSE [PRINT "bye]`, 'messages': ['bye']},
	];
	processTranslateExecuteCases(cases, logger);
};