import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testFunctionCallTranslation(logger) {
	const cases = [
		{'in': 'func1(50)', 'out': 'func1 50'},
		{'in': 'fd(50)', 'outContains': 'forward 50'},
		{'in': 'skk.fd(50)', 'outContains': 'forward 50'},
		{'in': 'star.right(75)', 'outContains': 'right 75'},
		{'in': 'turtle.heading()', 'outContains': 'pyHeading'},
		{'in': 'turtle.circle(100)', 'outContains': 'circleLeft 100'},
		{'in': 'turtle.up()\nx = 0', 'outContains': 'make "x 0'},
		// turtle.up() would translate to penUp but then get removed 
		// because the pen state is never used.

		{'in': 'turtle.setpos(x, y)', 'outContains': 'setPos [ :x :y ]'},
		{'in': 'turtle.Screen().bgcolor("black")', 'out': 'setScreenColor "black'},
		{'in': 'func1(1,2)', 'out': 'func1 1 2'},
		{'in': 'fillcolor()', 'out': 'fillColor'},
		{'in': 'fillcolor(255, 0, 0)', 'outContains': 'setFillColor convertColorUsingMode [ 255 0 0 ]'},
		{'in': 'color()', 'out': 'penColor'},
		{'in': 'color(255, 0, 100)', 'outContains': 'setColors convertColorUsingMode [ 255 0 100 ]'},
		{'in': 'distance(0, 1)', 'out': 'distance [ 0 1 ]'},
		{'in': 'color(\'red\', \'yellow\')', 'out': 'setPenColor "red\nsetFillColor "yellow'},
		{'in': 'turtle.color(random.random(), random.random(), random.random())',
		'outContains': 'setColors convertColorUsingMode [ randomRatio randomRatio randomRatio\n]'},
		{'in': 'abs(pos())', 'out': 'hypot pos'},
		{'in': 'abs([1,2])', 'out': 'hypot [ 1 2 ]'},
		{'in': 'abs( (1,2) )', 'out': 'hypot [ 1 2 ]'},
		{'in': 'abs(x)', 'out': 'abs :x'},
		{'in': 'color("red")', 'out': 'setColors "red'},
		{'in': 'color("aliceblue")', 'out': 'setColors "aliceblue'},
		{'in': 'color("skyblue1")', 'out': 'setColors "#87CEFF'},
		{'in': "t.color('#4285F4','#4285F4')",
		'out': 'setPenColor "#4285F4\nsetFillColor "#4285F4'},
		{'in': "t.color('red','blue')", 'out': 'setPenColor "red\nsetFillColor "blue'},
		{'in': "t.color('#4285F4','#4285F4')\nt.pensize(5)",
		'out': 'setPenColor "#4285F4\nsetFillColor "#4285F4\nsetPenSize 5'},
		{'in': 't.screen.bgcolor("black")', 'out': 'setScreenColor "black'},
		{'in': 'random.choice([1,2,3])', 'out': 'pick [ 1 2 3 ]'},
		{'in': 'random.random()', 'out': 'randomRatio'},
		{'in': 'home()', 'outContains': 'pyHome'},
		{'in': 'dot()', 'outContains': 'pyDot -1 penColor'},
		{'in': 'dot(10)', 'outContains': 'pyDot 10 penColor'},
		{'in': 'dot("red")', 'outContains': 'pyDot -1 "red'},
		{'in': 'dot(10, "red")', 'outContains': 'pyDot 10 "red'},
		{'in': 'tur.dot(10, "red")', 'outContains': 'pyDot 10 "red'},
		{'in': 'turtle.dot(60, color="yellow")',  'outContains': 'pyDot 60 "yellow'},
		{'in': 'degrees(1)', 'outContains': 'pyDegrees 1'},
		{'in': 'degrees(360)', 'outContains': 'pyDegrees 360'},
		{'in': 'radians()', 'outContains': 'pyDegrees 2 * pi'},
		{'in': 'seth(1)', 'out': 'setHeading 90 - 1'},
		{'in': 'seth(x)', 'out': 'setHeading 90 - :x'},
		{'in': 'seth(1 + 3)', 'outContains': 'setHeading 90 - ( 1 + 3 )'},
		{'in': 'setheading(1)', 'out': 'setHeading 90 - 1'},
		{'in': 'turtle.seth(1)', 'out': 'setHeading 90 - 1'},
		{'in': 'turtle.setheading(1)', 'out': 'setHeading 90 - 1'},
		{'in': 'print(str(1))', 'out': 'print str 1'},
		{'in': 't.pen(shown=True, pendown=True, pencolor="purple", fillcolor="orange", pensize=10, speed=9)',
		'out': 'showTurtle\npenDown\nsetPenColor "purple\nsetFillColor "orange\nsetPenSize 10'},
		// The translation would include penDown but it is removed
		// because no lines or shapes are drawn.
		
		{'in': 'import math\nprint math.cos(1)', 'out': 'print radCos 1'},
		{'in': 'import math\nprint math.sin(1)', 'out': 'print radSin 1'},
		{'in': 'import math\nprint math.tan(1)', 'out': 'print radTan 1'},
		{'in': 'hsv_to_rgb(h, 1, 1)', 'outContains': 'pyHSVToRGB :h 1 1'},
		{'in': 'color(hsv_to_rgb(h, 1, 1))', 'outContains': 'pyHSVToRGB :h 1 1'},
		{'in': `color(hsv_to_rgb(h, 1, 1))
rt(10)`, 'outContains': ' pyHSVToRGB :h 1 1'},
		{'in': "turtle.Screen().bgcolor('navy')", 'out': 'setScreenColor "navy'},
		{'in': "print screen.window_width()", 'out': 'print 640'}
	];
	processTranslationTestCases(cases, logger);
};