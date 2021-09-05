import { fetchText } from
'../../../../modules/fetchText.js';
import { newTranslatePythonCodeToWebLogo } from
'../../../../modules/parsing/python-parsing/newTranslatePythonCodeToWebLogo.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { pythonExamplesMap } from
'../../../helpers/parsing/pythonTurtleExampleFilesContent.js';

export function testTranslateExamplesContains(logger) {
	const cases = [
		{"filename": "2kcreator-colourful-geometry.py",
		"checks": [
			"0.008",
			"1GU3XKP1pQY",
			'"black',
			"convertColorUsingMode",
			"penUp",
			"penDown"
		]},
		{"filename": "adidas-logo.py",
		"checks": [
			'jumpTo', 'polyStart', 'polyEnd', 'pyCircle', 'right', 'setPenSize'
		]},
		{"filename": "android-logo.py",
		"checks": [
			'#3DDC84', 'to draw_upperbody', 'to draw_middlebody', 'to draw_hand', 'to draw_legs',
			'jumpTo', 'left', 'repeat 20 [', 'repeat 45 [', 'right'
		]},
		{"filename": "avatar-logo.py",
		"checks": [
			'black', 'or ', 'ifelse :n [', ':m = 0', ':m = 60', 'left 1', 'forward 3'
		]},
		{"filename": "avengers-logo.py",
			"checks": [
				'to draw_circle', 'polyStart', 'red', 'white',
				'polyEnd', 'to draw_circle2', 'setPenSize 2', 'black',
				'to draw_A', 'forward 23', 'backward 123',
				'left 60', 'backward 100', 'right 117',
				'to draw_triangle', 'to draw_arrow', 'black'
			]
		},
		{
			"filename": "geek-tutorial-heart.py",
			"checks": [
				'setScreenColor', 'black', 'setPenSize 2', 'to curve',
				'repeat 200 [', 'right 1', 'forward 1', 'red', 'pink',
				'polyStart', 'left 140', 'forward 111.65',
				'left 120', 'hideTurtle'
			]
		},
		{
			"filename": "greece_flag.py",
			"checks": [
				'output "Ready',
				'draw_all_flags :width',
				'to main',
				'to prepare_drawing :x :y :rotation',
				'to rectangle :x :y :width :height :rotation',
			]
		},
		{"filename": "heart.py",
			"checks": [
				'to curve', 'repeat 200 [', 'right 1', 'forward 1',
				'to heart',
				'setFillColor', 'polyStart', 'left 140', 'forward 113',
				'forward 112', 'polyEnd', 'hideTurtle'
			]
		},
		{"filename": "hexagon.py",
		"checks": [
			'make "num_sides 6', 'make "side_length 70',
			'make "angle 360 / :num_sides',
			'repeat :num_sides [',
			'forward :side_length'
		]},
		{"filename": "hexagon2.py",
		"checks": [
			'make "my_num_sides 6', 'make "my_side_length 70',
			'make "my_angle 360 / :my_num_sides',
			'repeat :my_num_sides [',
			'forward :my_side_length',
			'right :my_angle'
		]},
		{"filename": "house.py",
		"checks": [
			'Grass', "green", "jumpTo [ -400 -100 ]",
			'polyStart', 'repeat 2 [', 'forward 800',
			'left 90', 'forward 500', 'polyEnd', 'Sun',
			'jumpTo [ -320 225 ]', 'yellow', 'white', 'chocolate',
			'brown', 'black', 'red', 'Window 2 Cross - Horizontal Line',
			'Window 2 Cross - Vertical Line', 'Door Handle'
		]
		},
		{"filename": "hsv_pattern.py",
		"checks": [
			'setFillColor', 'polyStart', 'left 100', 'right 109', 'polyEnd'
		]
		},
		{"filename": "impostor-simple.py",
			"checks": [
				'#9acedc', 'to body', 'right 90', 'forward 50', 'right 180'
			]
		},
		{"filename": "mountain.py",
			"checks": [
				'setScreenColor', 'skyblue', 'jumpTo [ -400 -100 ]',
				'polyStart', 'repeat 2', 'forward 800', 'right 90', 'forward 400',
				'polyEnd', 'repeat 3 [', 'forward 300', 'left 120', 'jumpTo [ 100 -100 ]',
				'to tree'
			]
		},
		{"filename": "odhabi-draw-art.py",
			"checks": [
				'make "cl [ "',
				'to drawArt :d :angle :x :y', 'jumpTo [ :x :y ]', 'repeat 399 [',
				'forward :d', 'left :angle', 'localmake "d :d - 1',
				'if ( :c > 2 ) ['
			]
		},
		{"filename": "pattern-coding-with-norman.py",
			"checks": [
				'setPenSize 2', 'setScreenColor ', 'black', 'left 80', 'forward 250',
				'for [ "i 0 329 ] [', 'make "h :h + 0.004', 'forward :i'
			]
		},
		{"filename": "pen-circle.py",
		"checks": [
			'purple', 'orange', 'setPenSize 10', 'circleLeft 90'
		]},
		{"filename": "pink-heart.py",
		"checks": [
			'to calculateY :k', 'to calculateX :k', 'radCos :k', 'radCos 3 * :k',
			'15 * ( power ( radSin :k ) 3 )', '#f73487'
		]},
		{
			"filename": "python-logo.py",
			"checks": [
				'to s_curve', 'to r_curve', 'to l_curve', 'to l_curve1',
				'to eye', 'to sec_dot', '"#306998', '"#FFD43B'
			]
		},
		{
			"filename": "spiral-helix.py",
			"checks": [
				'for [ "i 0 99 ] [', 'left :i'
			]
		},
		{
			"filename": "square-inside-out.py",
			"checks": [
				'blue', 'to sqrfunc :size', 'repeat 4 [',
				'forward :size', 'left 90', 'localmake "size :size - 5',
				'sqrfunc 146', 'sqrfunc 126', 'sqrfunc 106'
			]
		},
		{
			"filename": "star.py",
			"checks": [
				'repeat 4 [', 'right 144', 'forward 100'
			]
		},
		{
			"filename": "star2.py",
			"checks": [
				'yellow', 'black', 'repeat 5 [', 'forward 150', 'right 144'
			]
		},
		{
			"filename": "superman.py",
			"checks": [
				"to curve :value", 'polyStart', 'black',
				'maroon', 'setPenSize 3', 'curve 61', 'curve 20', 'curve 30',
				'curve 40', 'curve 45', 'right 5', 'forward 45', 'polyEnd', 'home',
				'forward 20', 'hideTurtle'
			]
		},
		{
			"filename": "three-sides-of-square.py",
			"checks": [
				"forward 100", "print heading"
			]
		},
		{"filename": "tree-coding-with-norman.py",
		"checks": [
			"to tree :i", 'ifelse :i < 15 [', 'forward :i', 'left 30', 'tree 3 * :i / 4',
			'right 60', 'left 30', 'backward :i'
		]},
		{"filename": "ugly-bicycle.py",
		"checks": [
			"to draw_bicycle", "jumpTo [ -100 0 ]", "forward 200",
			"right 90", "forward 50"
		]},
		{"filename": "vast-coding-colorful-spiral.py",
		"checks": [
			"black", "setPenSize 2", 'hideTurtle', 'for [ "i 0 999 ] [', 'setPenColor',
			'forward :i', 'right 98.5', 'make "hue :hue + 0.005'
		]},
		{"filename": "yanko99x-pattern.py",
		"checks": [
			"black", "setPenSize 3", 'make "h 0', "repeat 120 [", "0.003", "forward 250", "left 90", "right 10", "hideTurtle"
		]}
	];
	cases.forEach(async function(caseInfo, index) {
		let code = pythonExamplesMap.get(caseInfo.filename);
		if (code === undefined) {
			// some Python examples aren't in pythonExamplesMap.
			code = await fetchText(`tests/data/python/${caseInfo.filename}`);
		}
		const result = newTranslatePythonCodeToWebLogo(code);
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		if (typeof result !== 'string')
			plogger(`Expected a string but found ${result}`);
		else {
			for (const substr of caseInfo.checks) {
				if (result.indexOf(substr) === -1) {
					plogger(`Expected to find ${substr} in translated result but did not.  result=${result}`);
					return;
				}
			}
		}
	});
};