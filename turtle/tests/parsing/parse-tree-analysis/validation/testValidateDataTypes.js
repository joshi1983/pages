import { processValidationTestCases } from './processValidationTestCases.js';
import { validateDataTypes } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateDataTypes.js';

export function testValidateDataTypes(logger) {
	const cases = [/*
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
		{'code': 'fd 1', 'error': false},
		{'code': 'fd 1/0', 'error': true},
		{'code': 'fd []', 'error': true},
		{'code': 'make "x "hello\nfd :x', 'error': true},
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
	{'code': 'make "list1 [1 2 3 4]\nrepeat 3 [\nmake "p []\nsetItem 2 "p -item 2 :list1\n]', 'error': false},
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
`, 'error': false},
	{'code': 'print mixItems [1 2] 0', 'error': false},
	{'code': `make "points []
repeat 100 [
	queue2 "points pos
]
repeat 100 [
	make "fromPoint item repcount :points
	print round :fromPoint / 5
]`, 'error': true},
	{'code': `to p :x
	assert number? :x
end

p 4
p "hi`, 'error': true},
	{'code': `to p :x
	assert number? :x
end

p 4`, 'error': false},
	{'code': `to p :x
	assert number? :x
end

p 4.4`, 'error': false},
	{'code': `to p :x
	assert integer? :x
end
p 4`, 'error': false},
	{'code': `to p :x
	assert integer? :x
end
p 4
p "hi`, 'error': true},
	{'code': `to p :x
	queue "x 4
	assert isinstance :x 'colorlist'
end

p [1 2]`, 'error': false},
	{'code': `to p :x
	queue2 "x 4
	assert isinstance :x 'colorlist'
end

p [1 2]`, 'error': false},
	{'code': `print sum 1 3`, 'error': false},
	{'code': `print (sum 1 3)`, 'error': false},
	{'code': `print (sum 1 2 3)`, 'error': false},
	{'code': `print (sum 1 2 "hi)`, 'error': true},
	{'code': `setPenColor ifelse 1 < 2 [ "red ] [ "blue ]`, 'error': true},
	{'code': `setPenColor ifelse 1 < 2 "red "blue`, 'error': false},
	{'code': 'print 2 * arcSin 1.3', 'error': false}, // 1.3 is out of range -1..1 but still a valid type
	{'code': `to p :val
	ifElse number? :val [
		ifElse :val < 0 [
			print int :val
		] [
			localmake "val min 10 :val
			setPenColor item :val + 1 :colorPalette
		]
	] [
	]
end

p "hello`, 'error': false},
// no error should be found because the int is called within a section checked for number? :val.

	{'code': `to p :value
	if string? :value [
		output "s
	]
	if integer? :value [
		output "num
	]
	output str :value
end

print p "red`, 'error': false},
	{'code': `to p :value
	if integer? :value [
		localmake "value abs :value
		localmake "result ''
		output :result
	]
	if boolean? :value [
		output ifelse :value '1' '0'
	]
	output :value
end`, 'error': false},

// start of minlen-related tests
		{'code': 'print pick [1]', 'error': false},
		{'code': 'print pick [1 2]', 'error': false},
		{'code': 'print pick []', 'error': true},
		{'code': 'print first []', 'error': true},
		{'code': 'print first [3]', 'error': false},
		{'code': 'print first [random 3]', 'error': false},
		{'code': 'print first "', 'error': true},
		{'code': 'print first "Hello', 'error': false},
		{'code': 'make "p []\nprint item 1 :p', 'error': true},
		{'code': 'print item 1 "', 'error': true},
		{'code': 'repeat 2 [\nprint item 1 "\n]', 'error': true},
		{'code': 'to addElement :mylist\nqueue2 "mylist 5\nend\nmake "mylist1 []\naddElement :mylist1\nprint item 1 :mylist1', 'error': false},

		//queue2 adds an element to the list so it should not cause a problem when the print statement runs.
		{'code': 'to addElement :mylist\nqueue2 "mylist 5\nend\nto p1\nlocalmake "mylist1 []\naddElement :mylist1\nprint item 1 :mylist1\nend\np1', 'error': false},

		//queue2 adds an element to the list so it should not cause a problem when the print statement runs.
		//{'code': 'to addElement :mylist\nqueue "mylist 5\nend\nto p1\nlocalmake "mylist1 []\naddElement :mylist1\nprint item 1 :mylist1\nend\np1',
		//'error': true},
		// this test case should pass before removing the validateMinLen module.

		//queue creates a new instance of the Array so it won't mutate the caller's instance.
		//Therefore, item is called with an empty list so we should expect a validation error.
			{'code': `to p
	localmake "row []
	setItem 1 "row 5
end`, 'error': false},
	/*{'code': `to p
	localmake "row []
	queue2 "row 3
end

make "list1 []
print item 1 :list1
`, 'error': true},
	// this test case should pass before removing the validateMinLen module.

	{'code': `make "list1 []
queue2 "list1 5
print item 1 :list1
`, 'error': false}

//The queue2 should make list1 long enough to satisfy item's minimum length by the time item runs.
,
		{'code': 'setPos solveQuartic :a :b :c :d :e', 'error': false},
		{'code': 'setPos solveCubic :a :b :c :d', 'error': false},
		{'code': 'setPos solveQuadratic :a :b :c', 'error': false},
		{'code': `to p
	localmake "oldPos pos
	localmake "arcsInfo1 [
		[5 1.55] [54 0.2] [25 0.255]
	]
	setFillColor "red
	jumpRight 5
	localmake "pos1 pos
	polyStart
	setItem 1 "arcsInfo1 [12 0.33]
	jumpForward distanceToLine :oldPos :pos1
	polyEnd
end`, 'error': false},

// end of minlen-related test cases
	{'code': 'print map "sin [1 2 3]', 'error': false},
	{'code': 'print (sort [] "arcTan2)', 'error': true}, // arcTan2 does not return the required bool.
	{'code': 'print (sort [] "lessEqual?)', 'error': false},
*/
// end of minlen-related test cases
	{'code': `to p :num
	if list? :num [
		stop
	]
end`, 'error': false},
	{'code': `to p :num :numDigits
	if list? :num [
		output []
	]
	localmake "result "
	localmake "i 0
	while :i < :numDigits [
		localmake "digitChar "1
		localmake "result word :digitChar :result
		localmake "i :i + 1
	]
	output :result
end`, 'error': false},
	{'code': `to p :num :numDigits
	if list? :num [
		output []
	]
	localmake "result "
	localmake "i 0
	while :i < :numDigits [
		localmake "i :i + 1
	]
	output :result
end`, 'error': false},
	{'code': `to p :num :numDigits
	if list? :num [
		if list? :numDigits [
			output []
		]
	]
	localmake "result "
	localmake "i 0
	while :i < :numDigits [
		localmake "i :i + 1
	]
	output :result
end`, 'error': false},
	/*{'code': `to p :num :numDigits
	if list? :num [
		if list? :numDigits [
			output []
		]
	]
	localmake "result "
	localmake "i 0
	while :i < :numDigits [
		localmake "digitVal modulo :num 10
		localmake "digitChar char :digitVal + ascii "0
		localmake "result word :digitChar :result
		localmake "i :i + 1
	]
	output :result
end`, 'error': false}*/
	];
	processValidationTestCases(cases, logger, validateDataTypes);
}
