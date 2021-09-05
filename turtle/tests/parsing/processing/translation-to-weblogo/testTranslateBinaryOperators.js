import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/processing/translation-to-weblogo/translate.js';

export function testTranslateBinaryOperators(logger) {
	const cases = [
		{'in': 'int x = 2 + y', 'out': 'make "x 2 + :y'},
		{'in': 'println(2 + y)', 'out': 'print 2 + :y'},
		{'in': 'int y;println(2 * (y + 3))', 'out': 'make "y 0\nprint 2 * ( :y + 3 )'},
		{'in': 'println(2 + "hi)', 'out': 'print word str 2 "hi'},
		{'in': 'println(y * 3)', 'out': 'print :y * 3'},
		{'in': 'println(2 - y)', 'out': 'print 2 - :y'},
		{'in': 'println(2 / y)', 'out': 'print 2 / :y'},
		{'in': 'println(2 % y)', 'out': 'print modulo 2 :y'},
		{'in': 'println(2 ^ y)', 'out': 'print xor 2 :y'},
		{'in': 'println(2 || y)', 'out': 'print or 2 :y'},
		{'in': 'println(2 && y)', 'out': 'print and 2 :y'},
		{'in': 'println(2 & y)', 'out': 'print bitAnd 2 :y'},
		{'in': 'println(2 | y)', 'out': 'print bitOr 2 :y'},
		{'in': 'println(2 < y)', 'out': 'print 2 < :y'},
		{'in': 'println(2 > y)', 'out': 'print 2 > :y'},
		{'in': 'println(2 <= y)', 'out': 'print 2 <= :y'},
		{'in': 'println(2 >= y)', 'out': 'print 2 >= :y'},
		{'in': 'println(2 == y)', 'out': 'print 2 = :y'},
		{'in': 'println(2 >> y)', 'out': 'print bitShiftRight 2 :y'},
		{'in': 'println(2 << y)', 'out': 'print bitShiftLeft 2 :y'},
	];
	testInOutPairs(cases, translate, logger);
};