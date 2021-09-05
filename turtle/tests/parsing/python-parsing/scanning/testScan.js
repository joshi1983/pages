import { processScanTestCases } from '../../processScanTestCases.js';
import { PythonOperators } from
'../../../../modules/parsing/python-parsing/PythonOperators.js';
import { scan } from '../../../../modules/parsing/python-parsing/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': '\\\n', 'tokens': ['\\\n']},
		{'code': 'print "hi"\\\n', 'tokens': ['print', '"hi"', '\\\n']},
		{'code': 'print "hi"\\\nprint 3',
		'tokens': ['print', '"hi"', '\\\n', 'print', '3']},
		{'code': '# some comment', 'tokens': ['# some comment']},
		{'code': ' # some comment', 'tokens': ['# some comment']},
		{'code': '\t# some comment', 'tokens': ['\t', '# some comment']},
		{'code': '\t # some comment', 'tokens': ['\t', '# some comment']},
		{'code': '"hello world"', 'tokens': ['"hello world"']},
		{'code': '"hello \\world"', 'tokens': ['"hello \\world"']},
		{'code': '"hi\\""', 'tokens': ['"hi\\""']},
		{'code': '"\\""', 'tokens': ['"\\""']},
		{'code': '"\\\'"', 'tokens': ['"\\\'"']},
		{'code': '\'hello world\'', 'tokens': ['\'hello world\'']},
		{'code': '"[]{}(),.+-*^%$#@!\'"', 'tokens': ['"[]{}(),.+-*^%$#@!\'"']}, // string literals can contain almost any character.
		{'code': '""" a possible docstring """', 'tokens': ['""" a possible docstring """']},
		{'code': '\'\'\' a possible docstring \'\'\'',
			'tokens': ['\'\'\' a possible docstring \'\'\'']},
		{'code': 'False', 'tokens': ['False']},
		{'code': 'True', 'tokens': ['True']},
		{'code': 'None', 'tokens': ['None']},
		{'code': '123', 'tokens': ['123']},
		{'code': '-123', 'tokens': ['-123']},
		{'code': '123.456', 'tokens': ['123.456']},
		{'code': '-123.456', 'tokens': ['-123.456']},
		{'code': '-0b100', 'tokens': ['-0b100']}, // binary literal
		{'code': '0b100', 'tokens': ['0b100']}, // binary literal
		{'code': 'print(0b100)', 'tokens': ['print', '(', '0b100', ')']},
		{'code': '-0o77', 'tokens': ['-0o77']}, // octal literal
		{'code': '0o77', 'tokens': ['0o77']}, // octal literal
		{'code': '0xfb', 'tokens': ['0xfb']}, // hex literal
		{'code': 't.setposition(0,-270)', 'tokens': ['t', '.', 'setposition', '(', '0', ',', '-270', ')']},
		{'code': 'print 123', 'tokens': ['print', '123']},
		{'code': 'print(123)', 'tokens': ['print', '(', '123', ')']},
		{'code': 'i*-1', 'tokens': ['i', '*', '-1']},
		{'code': 'print"hi"', 'tokens': ['print', '"hi"']}, 
			// not great Python code but handle it gracefully.

		{'code': 'print("hi")', 'tokens': ['print', '(', '"hi"', ')']},
		{'code': 'print(x:=2)', 'tokens': ['print', '(', 'x', ':=', '2', ')']},
		{'code': 'x="hi"', 'tokens': ['x', '=', '"hi"']},
		{'code': 'x=\'hi\'', 'tokens': ['x', '=', '\'hi\'']},
		{'code': '123*2', 'tokens': ['123', '*', '2']},
		{'code': 'import turtle', 'tokens': ['import', 'turtle']},
		{'code': 'turtle.fd(10)', 'tokens': ['turtle', '.', 'fd', '(', '10', ')']},
		{'code': 'turtle.fd(x*10)', 'tokens': ['turtle', '.', 'fd', '(', 'x', '*', '10', ')']},
		{'code': 'def f:\n\treturn 1', 'tokens': ['def', 'f', ':', '\t', 'return', '1']},
		{'code': '(1,2,)', 'tokens': ['(','1', ',', '2', ',', ')']},
		{'code': 'if 5 > 2', 'tokens': ['if','5', '>', '2']},
		{'code': 'x,y,z=fruits', 'tokens': ['x', ',', 'y', ',', 'z', '=', 'fruits']},
		{'code': 'x=b"hi"', 'tokens': ['x','=', 'b"hi"']},
		{'code': 'is_something', 'tokens': ['is_something']},
		{'code': 'notx', 'tokens': ['notx']},
		{'code': 'Truex', 'tokens': ['Truex']},
		{'code': '@staticmethod', 'tokens': ['@staticmethod']},
		{'code': '@staticmethod\ndef a():\n\tpass', 'tokens': ['@staticmethod', 'def',
			'a', '(', ')', ':', '\t', 'pass']},
		{'code': 'print("""some long string""")', 'tokens': ['print', '(', '"""some long string"""', ')']},
		{'code': '{}', 'tokens': ['{', '}']},
		{'code': 'x={}', 'tokens': ['x', '=', '{', '}']},
		{'code': 'x={\'p\': "Positive"}', 'tokens': ['x', '=', '{', "'p'", ':', '"Positive"', '}']},
		{'code': 'x={y:3}', 'tokens': ['x', '=', '{', 'y', ':', '3', '}']},
		{'code': 'x -= 5', 'tokens': ['x', '-=', '5']},
		{'code': 'x^=3', 'tokens': ['x', '^=', '3']},
		{'code': 'x|=True', 'tokens': ['x', '|=', 'True']},
		{'code': 'x&=True', 'tokens': ['x', '&=', 'True']},
		{'code': 'x!=y', 'tokens': ['x', '!=', 'y']},
		{'code': `import turtle   #Outside_In
import turtle`, 'tokens': ['import', 'turtle', '#Outside_In', 'import', 'turtle']},
		{'code': '[x:-1]', 'tokens': ['[', 'x', ':', '-1', ']']},
		{'code': ':-1]', 'tokens': [':', '-1', ']']},
	];
	PythonOperators.getAll().forEach(function(info) {
		if (info.symbol.indexOf(' ') !== -1)
			return;
		cases.push({
			'code': info.symbol,
			'tokens': [info.symbol]
		});
	});
	processScanTestCases(cases, scan, logger);
};