import { processValidationTestCase } from './processValidationTestCase.js';
import { validateDataTypes2 } from '../../../../modules/parsing/parse-tree-analysis/validation/validateDataTypes2.js';

export function testValidateDataTypes2(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'ifelse randomRatio < 0.5 [print :x] []', 'error': false},
		{'code': 'make "x []\nsetItem 1 "x 4', 'error': false},
		{'code': 'make "x 1\nsetItem 1 "x 4', 'error': true},
		{'code': 'make "x 1\nsetProperty "x 0 "red', 'error': true},
		{'code': 'make "x "hi\nsetItem 1 "x 4', 'error': true},
		{'code': 'make "x createPList\nsetProperty "x 0 "red', 'error': false},
		{'code': 'make "x createPList\nsetProperty "x "key "val\nprint getProperty "x "key', 'error': false},
		{'code': 'make "x [1]\nprint item 1 :x', 'error': false},
		{'code': 'make "x 5 print -:x', 'error': false},
		{'code': 'make "x "hello print -:x', 'error': true},
		{'code': 'print and true false', 'error': false},
		{'code': 'print and "tre false', 'error': true},
		{'code': 'fd 100', 'error': false},
		{'code': 'fd 100+4', 'error': false},
		{'code': 'fd sin 90', 'error': false},
		{'code': 'fd print 90', 'error': true},
		{'code': 'make "x 100\nfd :x', 'error': false},
		{'code': 'fd "x', 'error': true},
		{'code': 'fd []', 'error': true},
		{'code': 'make "x "hello\nfd :x', 'error': true},
		{'code': 'print "x - 3', 'error': true},
		{'code': 'print "x / 3', 'error': true},
		{'code': 'make "x "hello\nprint :x / 3', 'error': true},
		{'code': 'make "x 5\nprint :x / 3', 'error': false},
		{'code': 'to something :x\nprint :x\nend', 'error': false},
		{'code': 'to something :x\nforward :x\nend', 'error': false},
		{'code': 'fd fd 10', 'error': true}, // fd will return nothing which isn't compatible with the num.
		{'code': 'print fd 10', 'error': true}, // fd will return nothing can not be printed.
		{'code': 'setpencolor 1', 'error': false},
		{'code': 'setpencolor 15', 'error': false},
		{'code': 'setpencolor "red', 'error': false},
		{'code': 'setpencolor [0 0 0]', 'error': false},
		{'code': 'setpencolor [255 255 255]', 'error': false},
		{'code': 'setpencolor [1 0 0 0]', 'error': false},
		{'code': 'setpencolor [255 255 255 255]', 'error': false},
		{'code': 'setpencolor "abcdef', 'error': true},
		{'code': 'setpencolor [0 1 2 3]', 'error': false},
		{'code': 'setpencolor []', 'error': true},
		{'code': 'setpencolor [0]', 'error': true},
		{'code': 'setpencolor [0 1]', 'error': true},
		{'code': 'setfillcolor transparent', 'error': false},
		{'code': 'for ["x 1 5 1] [fd :x]', 'error': false},
		{'code': 'for ["x 1 5 1] [print :x]', 'error': false},
		{'code': 'for [ "i 100 10 -10 ] []', 'error': false},
		{'code': `for [ "i 100 10 -10 ] [
	repeat 5 [fd :i	lt 72]
	lt 72
]`, 'error': false},
		{'code': `for [ "i 100 10 -10 ] [
	repeat 5 [
		repeat 5 [
			fd :i
			lt 72
		]
		lt 72
	]
]`, 'error': false},
		{'code': 'make "x []\nqueue "x 1', 'error': false},
		{'code': 'make "x 23\nqueue "x 1', 'error': true}, // x must be a list but is a number.
		{'code': 'to p :x\nfd :x\nend\np "hello', 'error': true},
		{'code': 'to p :x\nfd :x\nend\np "hello\np 5', 'error': true},
		{'code': 'to p\nmake "x 5\nend\np\nprint :x', 'error': false},
		//{'code': 'to p\nmake "x 5\nend\nprint :x', 'error': true},
		{'code': 'to p\nmake "x 5\nend\nto p2\np\nend\np2\nprint :x', 'error': false},
		{'code': 'setFillColor mix [] [] 0.5', 'error': true},
		{'code': 'print mix 101.1 101.1 0.5', 'error': false},
		{'code': 'print mix 101.1 101 0.5', 'error': false},
		{'code': 'print mix 101 101.1 0.5', 'error': false},
		{'code': 'to p\nlocalmake "x []\nsetFillColor mix :x [] 0.5\nend', 'error': true},
		{'code': 'make "x []\nsetFillColor mix :x [] 0.5', 'error': true},
		{'code': 'make "x []\nsetFillColor mix :x transparent 0.5', 'error': true},
		{'code': 'MAKE "i 0\nMAKE "i :i+1\nfd :i', 'error': false},
		{'code': 'MAKE "i 0\nUNTIL :i>3 [MAKE "i :i+1 PRINT :i]', 'error': false},
		{'code': 'make "red "red\nto spike :size :color1\nmake "var1 :color1\nsetFillColor :color1\nend\nspike 100 :red', 'error': false},
		{'code': `make "color1 "#fff

to p
	localmake "numDivisions 64
	repeat :numDivisions [
		localmake "ratio repcount / :numDivisions
		setFillColor mix :color1 transparent 0.1 * :ratio * :ratio
	]
end`, 'error': false},
		{'code': `to p
	localmake "x 1
	if true [
		localmake "x 1 - power :x 2
	]
	forward 5 * ( :x )
end`, 'error': false},
	{'code': `to p
	if true [
		localmake "x 5.234
		localmake "x 1
	]
	forward 5 * (:x)
end`, 'error': false},
	{'code': 'print :x + x:y', 'error': false},
	{'code': 'setFillColor "transparent', 'error': true},

	{'code': '-1', 'error': false},

	{'code': 'make "x 5\nprint -:x', 'error': false},
	{'code': 'make "x "hi\nprint -:x', 'error': true},
	{'code': 'to p\noutput 5\nend print -p', 'error': false},
	{'code': 'to p\noutput "Hi\nend print -p', 'error': true},
	{'code': 'repeat 3 [\nmake "p []\nsetItem 2 "p -item 2 "\n]', 'error': false},
	{'code': 'repeat 3 [\nmake "p []\nsetItem 2 "p -item 2 "p\n]', 'error': false},
	{'code': `to p :radius
	localmake "x pos
	localmake "size2 :radius * 0.2

	jumpTo :x
	repeat 2 [
		localmake "size2 -:size2
	]
end

p 100`, 'error': false},
	{'code': `to p :x
	if number? :x [
		output
			2 * :x
	]
end
	p "red`,
	'error': false
	},
	{'code': `make "x 100.1
make "y 100.1
repeat 2 [
	print mix :x :y 0.5
	make "y :y * 0.5
]`, 'error': false
	},
	{'code': `to p :cells
	localmake "row []
	for ["j 1 count :row] [
		localmake "cell item :j :row
		setItem :j "row true
	]
end`, 'error': false},
	{'code': `to p
	localmake "row []
	setItem 1 "row 5
end`, 'error': false},
	{'code': `to p
	localmake "row []
	queue2 "row 3
end

make "list1 [5]
print item 1 :list1
`, 'error': false}
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processValidationTestCase(caseInfo, logger, validateDataTypes2);
	});
}
