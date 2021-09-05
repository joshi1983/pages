import { processExecuterTestCases } from './processExecuterTestCases.js';

export function testExecuterWithParsedOptimizations(logger) {
	const cases = [
		{'code': `to p
	make "x 1
	localmake "x 2
	print :x
end

p
print :x`,
			'messages': ['2', '1']},
		{'code': `to p
	localmake "x 2
	print :x
	make "x 1
	print :x
end

make "x 5
p
print :x`,
			'messages': ['2', '1', '5']},
		{'code': `make "context 1
print :context`,
		'messages': ['1']},
		{'code': `make "localVariables 1
print :localVariables`,
		'messages': ['1']},
		{'code': `make "seatColor "black

to bicycleFrameForward
end

to seatPost :size
	bicycleFrameForward
	setPenColor :seatColor
	setPenSize :size * 0.024
	forward :size * 0.1
	arcLeft 67 :size * 0.1
	forward :size * 0.05
	right 175
	forward :size * 0.15
	setPenSize 0
	setFillColor :seatColor
end

make "size 300 * (1 + animation.time * 0.1)
seatPost :size`, 'messages': []},
{'code': `to sizeToMountHeight :size
	output :size * 0.35
end

to drawMount :size
	localmake "angle 15
	localmake "mountHeight sizeToMountHeight :size
	localmake "size1 :mountHeight / cos :angle
	localmake "size2 :mountHeight * 0.03
	setFillColor penColor
	right 180 - :angle
	setPenSize :size2
	forward :size1
	setPenSize 0
	print :mountHeight
end

drawMount 100`, 'messages': ['35']},
	{'code': `to ratioToGray :val
	output [0 0 0]
end

to waveCircles :width :height
	localmake "numCircles 10
	localmake "maxCircleRadius :width * 0.15 / :numCircles
	localmake "sideStep :width / :numCircles
	setPenSize 0
	setFillColor "black
	repeat :numCircles [
		localmake "a repcount * 360 / :numCircles
		localmake "y :height * 0.5 * sin :a
		forward :y
		setFillColor ratioToGray (1 + cos :a) * 0.4
		circle :maxCircleRadius * (1.9 + cos :a)
		backward :y
		right 90
		forward :sideStep
		left 90
	]
end

waveCircles 250 120
print 1`,
		'ignoreWarnings': true,
		'messages': ['1']},
	{'code': `to ratioToGray :val
	output [0 0 0]
end

to waveCircles :width :height
	localmake "numCircles 3
	localmake "maxCircleRadius :width * 0.15 / :numCircles
	localmake "sideStep :width / :numCircles
	setPenSize 0
	setFillColor "black
	repeat :numCircles [
		localmake "a repcount * 360 / :numCircles
		localmake "y :height * 0.5 * sin :a
		forward :y
		print ratioToGray (1 + cos :a) * 0.4
		circle :maxCircleRadius * (1.9 + cos :a)
		backward :y
		right 90
		forward :sideStep
		left 90
	]
end

waveCircles 250 120
print 1`,
		'ignoreWarnings': true,
		'messages': ['[0 0 0]', '[0 0 0]', '[0 0 0]', '1']},
	{'code': `make "animationRatio 1
if :animationRatio > 0.5 [
	make "animationRatio 1 - :animationRatio
]
make "animationRatio :animationRatio * 2

print :animationRatio`,
'messages': ['0']},
	{'code': `make "height 100
make "colors ["#75160d "#c01818]
make "angle1 65.1
make "outerSize1 :height * 0.48
make "outerHeight :height - :outerSize1 * cos :angle1
repeat 2 [
	make "sign sign repcount - 1.5
	setFillColor item repcount :colors
	setHeading :sign * :angle1
	polyStart
	jumpForward :outerHeight
	right 180 - :angle1 * :sign
	polyEnd
]
print 1`, 'messages': ['1']},
	{'code': `make "prevPlotted? false
repeat 2 [
	ifelse true [
		make "pos2 pos
		if :prevPlotted? [
			setHeading towards :prevP
			forward distance :prevP
		]  
		make "prevPlotted? true
		make "prevP :pos2
	] [
		make "prevPlotted? false
	]
]
print "hi`, 'messages': ['hi']},
	{'code': `make "x 1
if :x > 0.5 [
	make "x 3 - :x
]
make "x :x * 2

print :x`, 'messages': ['4']},
	{'code': `to square :size
	if :size < penSize [
		localmake "size :size + penSize
		print "hi
	]
	polyStart
	repeat 4 [
		jumpForward :size
		right 90
	]
	polyEnd
	print "hi2
end

square -1`,
'messages': ['hi', 'hi2']
},
	{'code': `make "arcInfo [ 30 0.25 ]
make "arcRadius 100 * item 2 :arcInfo
print :arcRadius
ifelse :arcRadius = 0 [
	right 70
] [
	arcRight 70 :arcRadius
]`, 'messages': ['25']},
	{'code': `repeat 2 [
	make "scale 1
	if (remainder repcount 2) = 0 [
		make "scale 1.2
	]
	forward 100 * :scale
	forward 5 * :scale
]
print :scale`,
'messages': ['1.2']},
	{
'code': `to p :height
	make "arcs [
		[-0.255 0 16 53 0.85]
	]
	repeat 1 [
		localmake "arcInfo item repcount :arcs
		localmake "arcAngle item 4 :arcInfo
		make "arcRadius :height * item 5 :arcInfo
		ifelse :arcAngle < 0 [
			arcLeft -:arcAngle :arcRadius
		] [
			arcRight :arcAngle :arcRadius
		]
	]
end

p 100
print "hi`, 'messages': ['hi']},
{'code': `make "colors [ "white]

to drawFractalStar :size :colorIndex
	if :size > 1 [
		if :colorIndex <= 0 [
			localmake "colorIndex :colorIndex + 1
		]
		setFillColor item :colorIndex :colors
		drawFractalStar :size * 0.38197  :colorIndex - 1
	]
end

drawFractalStar 2 1
print "hi`, 'messages': ['hi']},
{'code': `to rainDrop :width :height :alpha
	print :width
	print :height
	print :alpha
end

to rainingWithoutCloud :height :timeRatio
	localmake "width :height * 1.5
	localmake "angle 30
	localmake "lineLength :height / cos :angle
	localmake "numDropsPerLine 3
	localmake "numLines 4
	localmake "lineStep :width / :numLines
	localmake "dropHeightRatio 0.7
	localmake "betweenDropStep (:lineLength * (1 - :dropHeightRatio/:numDropsPerLine)) / :numDropsPerLine
	localmake "dropWidth :lineStep * 0.3
	localmake "dropHeight :betweenDropStep * :dropHeightRatio
	localmake "alphaOffset 0
	repeat :numDropsPerLine + 1 [
		localmake "alpha 1 - :alphaOffset + :timeRatio
		if repcount >= :numDropsPerLine [
			localmake "alpha :alpha - 0.7 * (1 + repcount - :numDropsPerLine)
		]
		localmake "alpha clamp :alpha 0 1
		if :alpha > 0 [
			rainDrop :dropWidth :dropHeight :alpha
		]
	]
end

rainingWithoutCloud 100 animation.time / animation.duration
print "hi`,
'messages': ['11.25', '20.65631', '1', '11.25', '20.65631', '1',
'11.25', '20.65631', '0.3', 'hi']},
	{'code': `make "treadColor "black
make "frameColor "skyBlue
make "frameShadeColor mix :frameColor "black 0.6
make "seatColor "black
print "hi`, 'messages': ['hi']}
	];
	processExecuterTestCases(cases, logger);
};