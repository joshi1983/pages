import { processExecuterTestCases } from './processExecuterTestCases.js';

export function testLogoProgramExecuterUsingPrint(logger) {
	const cases = [
		{'code': 'print linecap', 'messages': ['round']},
		// FMSLogo and MSWLogo shows a round cap initially.
		// We want WebLogo to copy that by default.

		{'code': 'print 1', 'messages': ['1']},
		{'code': 'print 1E1', 'messages': ['10']},
		{'code': 'print 1.2E1', 'messages': ['12']},
		{'code': 'print 1.2E+1', 'messages': ['12']},
		{'code': 'print 12E+1', 'messages': ['120']},
		{'code': 'print 1E+1', 'messages': ['10']},
		{'code': 'print 1E-1', 'messages': ['0.1']},
		{'code': '(print 1 2)', 'messages': ['1 2']},
		{'code': 'print (4 / 2) - 1 - 2', 'messages': ['-1']},
		{'code': 'make "x 1\nprint -:x', 'messages': ['-1']},
		{'code': 'to p\noutput 1\nend\nprint -p', 'messages': ['-1']},
		{'code': 'to p\noutput 1\nend\nprint p + 3', 'messages': ['4']},
		{'code': 'to p\noutput 1\nend\nprint 3 + p', 'messages': ['4']},
		{'code': 'setPenColor "black\nprint penColor', 'messages': ['[0 0 0]']},
		{'code': 'repeat 3 [print 1]', 'messages': ['1', '1', '1']},
		{'code': 'repeat 3 [print repcount]', 'messages': ['1', '2', '3']},
		{'code': 'for ["x 1 5 1] [print :x]', 'messages': ['1', '2', '3', '4', '5']},
		{'code': 'for ["x 1 5] [print :x]', 'messages': ['1', '2', '3', '4', '5']},
		{'code': 'for ["x 1 -5] [print :x]', 'messages': ['1', '0', '-1', '-2', '-3', '-4', '-5']},
		{'code': 'to hi\nrepeat 3 [print repcount]\nend\nhi', 'messages': ['1', '2', '3']},
		{'code': 'to f :x\nifelse :x = 1 [output 1] [output :x*f :x - 1]\nend\nprint f 5', 'messages': ['120']},
		{'code': 'to f\noutput 1\nend\nprint f', 'messages': ['1']},
		{'code': 'to f output 1\nend\nprint f', 'messages': ['1']}, // parameter list ends with command call instead of new line.
		{'code': 'to f end\nf print "hi', 'messages': ['hi']}, // parameter list ended by "end" keyword instead of new line
		{'code': 'to f\nfor ["x 1 5 1] [print :x output 1]\nend\nprint f', 'messages': ['1', '1']},
		{'code': 'to f\nfor ["x 1 5 1] [print :x output 0]\nend\nfor ["x 1 5 1] [print :x]', 'messages': ['1', '2', '3', '4', '5']},
		{'code': 'to f\nfor ["x 1 5 1] [print :x output 0]\nend\nfor ["x 1 5 1] [print f]', 'messages': ['1', '0', '1', '0', '1', '0', '1', '0', '1', '0']},
		{'code': 'to f\nfor ["x 1 5 1] [print :x output 0]\nend\nfor ["x 1 5 1] [print :x+f]', 'messages': ['1', '1', '1', '2', '1', '3', '1', '4', '1', '5']},
		{'code': 'to f\nrepeat 5 [output 0]\nend\nrepeat 5 [print f]',
			'messages': ['0', '0', '0', '0', '0']
		},
		{'code': 'to getZero\nlocalmake "results [0]\noutput first :results\nend\nmake "x getZero\nprint :x', 'messages': ['0']},
		{'code': 'to getValue\nfor [ "i 0 255 1] [print :i output 5]\noutput 255\nend\nmake "v getValue\nprint :v',
			'messages': ['0', '5']
		},
		{'code': 'make "x 1 print -:x', 'messages': ['-1']},
		{'code': 'make "x 1 print sum 1 -:x', 'messages': ['0']},
		{'code': 'make "x 1 print sum -:x 1', 'messages': ['0']},
		{'code': 'make "x 1 print sum (-:x) 1', 'messages': ['0']},
		{'code': 'make "x 1 print sum ( -:x) 1', 'messages': ['0']},
		{'code': 'make "x 1 print sum (-:x) (1)', 'messages': ['0']},
		{'code': 'make "x 1 print sum ( - :x ) (1)', 'messages': ['0']},
		{'code': 'make "x 1 print sum -(:x) 1', 'messages': ['0']},
		{'code': 'make "x 1 print 1 + -:x', 'messages': ['0']},
		{'code': 'make "x -(1) print :x', 'messages': ['-1']},
		{'code': 'make "x arcTan 1 print :x', 'messages': ['45']},
		{'code': 'make "x -arcTan 1 print :x', 'messages': ['-45']},
		{'code': 'to f :AMOUNT\nprint :AMOUNT\nend\nf 5',
			'messages': ['5']
		},
		{'code': 'to f\nlocalmake "Amount 5\nprint :AMOUNT\nend\nf',
			'messages': ['5']
		},
		{'code': 'to f\nlocalmake "Amount "Bla\nprint :AMOUNT\nend\nf',
			'messages': ['Bla']
		},
		{'code': 'print true',
			'messages': ['true']
		},
		{'code': 'print false',
			'messages': ['false']
		},
		{'code': `print '('`, 'messages': ['(']},
		{'code': `print ')'`, 'messages': [')']},
		{'code': `print '['`, 'messages': ['[']},
		{'code': `print ']'`, 'messages': [']']},
		{'code': `print ['(' ')']`, 'messages': ['[( )]']},
		{'code': `print ['[' ']']`, 'messages': ['[[ ]]']},
		{'code': 'forward 100 print pos',
			'messages': ['[0 100 0]']
		},
		{
			'code': 'MAKE "i 0\nUNTIL :i>3 [MAKE "i :i+1 PRINT :i]',
			'messages': ['1', '2', '3', '4']
		},
		{
			'code': 'MAKE "i 0\nUNTIL :i>-1 [MAKE "i :i+1 PRINT :i]',
			'messages': [],
			'ignoreWarnings': true
		},
		{
			'code': 'for ["x 5 0] [print :x]',
			'messages': ['5', '4', '3', '2', '1', '0']
		},
		{
			'code': 'for ["x 5 0 -1] [print :x]',
			'messages': ['5', '4', '3', '2', '1', '0']
		},
		{
			'code': 'for ["x 0 5] [print :x]',
			'messages': ['0', '1', '2', '3', '4', '5']
		},
		{
			'code': 'for ["x 0 5 1] [print :x]',
			'messages': ['0', '1', '2', '3', '4', '5']
		},
		{
			'code': 'for ["x 5 5] [print :x]',
			'messages': ['5']
		},
		{
			'code': 'for ["x 5 5 1] [print :x]',
			'messages': ['5']
		},
		{
			'code': 'for ["x 5 5 -1] [print :x]',
			'messages': ['5']
		},
		{
			'code': 'ifelse 1 < 2 [print "hi] [print "bye]',
			'messages': ['hi']
		},
		{
			'code': 'print ifelse 1 < 2 ["red] ["blue]',
			'messages': ['[red]']
		},
		{
			'code': 'ifelse 3 < 2 [print "hi] [print "bye]',
			'messages': ['bye']
		},
		{
			'code': 'print ifelse 3 < 2 "hi "bye',
			'messages': ['bye']
		},
		{
			'code': 'make "x []\nqueue "X 5\nprint count :x\nprint item 1 :X',
			'messages': ['1', '5']
		},
		{
			'code': 'make "x []\nqueue2 "X 5\nprint count :x\nprint item 1 :X',
			'messages': ['1', '5']
		},
		{
			'code': 'make "x []\nqueue "X 5\nqueue "X 8\nprint count :x\nprint dequeue "X\nprint dequeue "x\nprint count :X',
			'messages': ['2', '5', '8', '0']
		},
		{
			'code': 'make "x []\nqueue "X 5\nmake "y :x\nprint dequeue "X\nprint count :y',
			'messages': ['5', '1']
		},
		{
			'code': 'make "x []\nqueue "X 5\nmake "y :x\nprint dequeue2 "X\nprint count :y',
			'messages': ['5', '0']
		},
		{
			'code': 'make "x []\nqueue "X 5 + 1\nprint dequeue "x',
			'messages': ['6']
		},
		{
			'code': 'make "x []\npush "x 1\npush "x 2\npush "x 3\nprint :x\nprint pop "x\nprint :x',
			'messages': ['[3 2 1]', '3', '[2 1]']
		},
		{
			'code': 'make "x []\nmake "y :x\npush "x 1\nprint :y\nprint :x',
			'messages': ['[]', '[1]'] // push should not affect the original instance of Array.
		},
		{
			'code': 'make "x [1]\nmake "y :x\nprint pop "x\nprint :x\nprint :y',
			'messages': ['1', '[]', '[1]'] // pop should not affect the original instance of Array.
		},
		{
			'code': 'make "x [1]\nmake "y :x\nqueue2 "x 5\nprint :x\nprint :y',
			'messages': ['[1 5]', '[1 5]']
		},
		{
			'code': 'make "x 0\ndo.while [\nprint :x\nmake "X :x + 1] :x < 3',
			'messages': ['0', '1', '2']
		},
		{
			'code': 'make "x 0\nuntil :x > 2 [\nprint :x\nmake "X :x + 1]',
			'messages': ['0', '1', '2']
		},
		{
			'code': 'make "plist1 createPList\nprint :plist1',
			'messages': ['[]']
		},
		{
			'code': 'make "plist1 createPList\nprint :plist1\nsetProperty "plist1 "x 5\nprint getProperty "plist1 "x',
			'messages': ['[]', '5']
		},
		{
			'code': 'make "plist1 createPList\nprint :plist1\nsetProperty "plist1 "x 5\nprint getProperty "plist1 "x\nremoveProperty "plist1 "x\nremoveProperty "plist1 "x',
			'messages': ['[]', '5']
		},
		{
			'code': 'make "pList1 createPList\nprint :plist1\nsetProperty "pList1 "x 5\nprint getProperty "pList1 "x\nremoveProperty "plist1 "x\nremoveProperty "plist1 "x',
			'messages': ['[]', '5']
		},
		{
			'code': 'make "x [] repeat count :x [ print "hi]',
			'messages': [],
			'ignoreErrors': true
			// error expected since the repeat count is 0.
			// The error message is expected to say something about the 
			// repeat being useless code since it does nothing.
		},
		{
			'code': `to p
	localmake "oldPos pos
	localmake "oldHeading heading
	repeat 2 [
		localmake "offsetLen 0
		print 60
	]
end

p`,
			'ignoreWarnings': true,
			'messages': ['60', '60']
		},
		{
			'code': `to p
	localmake "oldPos pos
	localmake "oldHeading heading
	for ["x 0 1 1] [
		localmake "offsetLen 0
		print 60
	]
end

p`,
			'ignoreWarnings': true,
			'messages': ['60', '60']
		},
		{
			'code': 'print (invoke "sum 1 2)',
			'messages': ['3']
		},
		{
			'code': 'make "x "sum\nprint (invoke :x 1 2)',
			'messages': ['3']
		},
		{
			'code': 'to mulTwo :val\noutput :val * 2\nend\nprint (invoke "mulTwo 3)',
			'messages': ['6']
		},
		{
			'code': 'to p\nlocalmake "result []\nrepeat 2 [\nqueue2 "result repcount\n]\noutput :result\nend\nprint p',
			'messages': ['[1 2]']
		},
		{
			'code': `to p\nlocalmake "result []
				repeat 2 [
					queue "result repcount
				]
				output :result
			end
			print p`,
			'messages': ['[1 2]']
		},
		{
			'code': `to p
	localmake "mylist [-4 -0.3333 0.3333  0.25]
	repeat count :mylist [
		localmake "val 5
		setItem repcount "mylist :val
	]
	print :val
end

p`,
			'messages': ['5']
		},
		{
			'code': `repeat 1 [
		if repcount = 2 [
			print 3
		]
	]`, 'messages': [],
		'ignoreWarnings': true
		},
		{
			'code': `repeat 1 [
		if repcount = 2 [
			print 3
		]
		if repcount = 1 [
			make "x 4
		]
	]`,
			'messages': [],
			'ignoreWarnings': true
		},
		{
			'code': `repeat 2 [
		if repcount = 2 [
			print :x
		]
		if repcount = 1 [
			make "x 4
		]
	]`,
			'messages': ['4']
		},
		{
			'code': `to p
	repeat 2 [
		if repcount = 2 [
			print :x
		]
		if repcount = 1 [
			localmake "x 4
		]
	]
	localmake "x 10
	print :x
end
p`,
			'messages': ['4', '10']
		},
		{
			'code': 'print transparent',
			'messages': ['transparent']
		},
		{
			'code': `to p
	localmake "oldFillColor fillColor
	setFillColor :oldFillColor
end

setScreenColor transparent
p
print 1`, 'messages': ['1']
		},{
			'code': 'print easeSteps 2 "jumpEnd',
			'messages': ['easeSteps 2 "jumpEnd']
		},{
			'code': 'make "stepPosition "jumpEnd\nprint easeSteps 2 :stepPosition',
			'messages': ['easeSteps 2 "jumpEnd']
		},{
			'code': 'print easeCubicBezier 1 2 3 4',
			'messages': ['easeCubicBezier 1 2 3 4']
		},
		{
			'code': 'print (and true true true false)',
			'messages': ['false']
		},
		{
			'code': `to p :cap
	setLineCap :cap
	print lineCap
end

p "round`,
			'messages': ['round']
		}, {
			'code': `to p :easing
	print :easing
end

p easeInQuad`,
			'messages': ['easeInQuad']
		},{
			'code': 'print ifelse 3 < 2 "hi "bye',
			'messages': ['bye']
		},{
			'code': 'print ifelse 3 < 2 1 + 4 "bye',
			'messages': ['bye']
		},{
			'code': 'print ifelse 1 < 2 1 + 4 "bye',
			'messages': ['5']
		},{
			'code': 'make "x 1\nprint ifelse 1 < 2 :x + 4 "bye',
			'messages': ['5']
		},
		{'code': 'print isinstance 4 "int', 'messages': ['true']},
		{'code': 'print isinstance 4.1 "int', 'messages': ['false']},
		{'code': `to p :x
	assert isinstance :x 'int|num|string'
	print "hi
end

p 4
p "hi`, 'messages': ['hi', 'hi']},
		{'code': `to p
	localmake "z 10
	print :z
end

make "z 30
p`, 'messages': ['10']},
		{'code': `to p
	print :z
	localmake "z 10
	print :z
end

make "z 30
p`, 'messages': ['30', '10']},
	{'code': `to p
	localmake "result -1
	localmake "d distanceToLine pos pos
	if :d > 0 [
		if or :result < 0 :d < :result [
			localmake "result :d
		]
	]
	output :result
end

p
print "hi`, 'messages': ['hi']},
	{'code': `to p
	localmake "result -1
	localmake "line [pos pos]
	localmake "d distanceToLine first :line last :line
	if :d > 0 [
		if or :result < 0 :d < :result [
			localmake "result :d
		]
	]
	output :result
end

p
print "hi`, 'messages': ['hi']},
	{'code': `to p
	localmake "lines [[pos pos]]
	localmake "result -1
	repeat count :lines [
		localmake "line item repcount :lines
		localmake "d distanceToLine first :line last :line
		if :d > 0 [
			if or :result < 0 :d < :result [
				localmake "result :d
			]
		]
	]
	output :result
end

p
print "hi`, 'messages': ['hi']},
	{'code': `to getClosestLineIntersection :lines
	localmake "result -1
	repeat count :lines [
		localmake "line item repcount :lines
		localmake "d distanceToLine first :line last :line
		if :d > 0 [
			if or :result < 0 :d < :result [
				localmake "result :d
			]
		]
	]
	output :result
end

make "x getClosestLineIntersection [[pos pos]]
print "hi`, 'messages': ['hi']},
	{'code': `to getClosestLineIntersection :lines
	localmake "result -1
	repeat count :lines [
		localmake "line item repcount :lines
		localmake "d distanceToLine first :line last :line
		if :d > 0 [
			if or :result < 0 :d < :result [
				localmake "result :d
			]
		]
	]
	output :result
end

to drawBase :height
	localmake "radiatingRadius :height * 0.12 + 1
	localmake "innerLines [[pos pos]]
	repeat 2 [
		localmake "d getClosestLineIntersection :innerLines
		if :d > :radiatingRadius [
			jumpForward :d
			backward :d - :radiatingRadius
		]
	]
end

drawBase 100
print "hi`, 'messages': ['hi']},
	{'code': `to p :size :shadowDown :intensityRatio
	localmake "colorStops createPList
	setProperty "colorStops 0 mix fillColor "black 1 - 0.5 * :intensityRatio
	setProperty "colorStops 1 mix fillColor "black :intensityRatio
	localmake "fromPos pos
	localmake "toPos pos
	if :shadowDown [
		swap "fromPos "toPos
	]
end

setFillColor "red
p 100 true 0.3
print "hello`, 'ignoreWarnings': true, 'messages': ['hello']}
	];
	processExecuterTestCases(cases, logger);
};