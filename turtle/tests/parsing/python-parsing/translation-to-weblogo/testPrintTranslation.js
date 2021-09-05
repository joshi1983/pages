import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testPrintTranslation(logger) {
	const cases = [
		{'in': 'print(None)', 'out': 'print "None'},
		{'in': 'print "hi"', 'out': 'print "hi'},
		{'in': 'print "hello world"', 'out': 'print \'hello world\''},
		{'in': 'print("hi")', 'out': 'print "hi'},
		{'in': 'print \'hi\'', 'out': 'print "hi'},
		{'in': 'print \'hi world\'', 'out': 'print \'hi world\''},
		{'in': 'print("""hello world""")', 'out': 'print \'hello world\''},
		{'in': 'print """hello world"""', 'out': 'print \'hello world\''},
		{'in': '"""some comment"""\nprint """hello world"""', 'out': '; some comment\n\nprint \'hello world\''},
		{'in': 'print(0b100)', 'out': 'print 4'},
		{'in': 'print(0o10)', 'out': 'print 8'},
		{'in': 'print(-0o10)', 'out': 'print -8'},
		{'in': 'print(-0x10)', 'out': 'print -16'},
		{'in': 'print []', 'out': 'print []'},
		{'in': 'print [1]', 'out': 'print [1]'},
		{'in': 'print [x]', 'out': 'print [:x]'},
		{'in': 'print [1,2]', 'out': 'print [1 2]'},
		{'in': 'print f()', 'out': 'print f'},
		{'in': 'print xcor()', 'out': 'print xCor'},
		{'in': 'print(xcor())', 'out': 'print xCor'},
		{'in': 'print(turtle.xcor())', 'out': 'print xCor'},
		{'in': 'print(5 + turtle.xcor())', 'out': 'print 5 + xCor'},
		{'in': 'print ( () )', 'out': 'print []'},
		{'in': 'print([1,2]*2)', 'out': 'print  [1 2 1 2]'},
		{'in': 'print(str(x % (y)))', 'out': 'print str (modulo :x (:y))'}
	];
	processTranslationTestCases(cases, logger);
};