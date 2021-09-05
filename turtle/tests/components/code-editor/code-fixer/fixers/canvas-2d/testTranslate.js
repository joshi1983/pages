import { processTranslateTestCases } from './processTranslateTestCases.js';

export function testTranslate(logger) {
	const cases = [
		{'in': 'const canvas = document.getElementById("canvas");', 'out': ''},
		{'in': 'const ctx = canvas.getContext("2d");', 'out': ''},
		{'in': 'ctx.moveTo(230 180);', 'out': 'jumpTo [ 230 180 ]'},
		{'in': 'ctx.moveTo(0, 0);\nctx.beginPath();ctx.lineTo(100, 100);\nctx.stroke();', 'out': 
`setLineCap "butt
setLineJoinStyle "miter
jumpTo [ 0 0 ]
polyStart
make "p [ 100 100 ]
setHeading towards :p
forward distance :p
polyEnd`},
		{'in': 'ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);',
		'out': `setLineCap "butt
setLineJoinStyle "miter
jumpTo [ :x :y ]
setHeading :startAngle
arc :endAngle - :startAngle :radius`},
		{'in': 'ctx.arc(x, y, radius, 0, Math.PI * 2, counterclockwise);',
		'out': `setLineCap "butt
setLineJoinStyle "miter
jumpTo [ :x :y ]
circle :radius`},
		{'in': `if (true) {}`, 'out': ''},
		{'in': `if (canvas.getContext) {}`, 'out': ''},
		{'in': `if (1) {}`, 'out': ''},
		{'in': `ctx.strokeText("hi", 0, 0)`, 'out':
`setLineCap "butt
setLineJoinStyle "miter
jumpTo [ 0 0 ]
make "oldFillColor fillColor
setFillColor transparent
label "hi
setFillColor :oldFillColor`},
		{'in': `ctx.fillText("hi", 1, 2)`, 'out':
`jumpTo [ 1 2 ]
make "oldPenSize penSize
setPenSize 0
label "hi
setPenSize :oldPenSize`},
		{'in': 'ctx.fillRect(x, y, width, height);',
		'out':
`jumpTo [ :x + :width / 2 :y ]
stripes :width :height [ fillColor ]`},
		{'in': 'console.log(ctx.lineCap);',
		'out': 'print lineCap'},
		{'in': 'x = ctx.lineCap;',
		'out': 'make "x lineCap'},
		{'in': 'ctx.miterLimit = 3;',
		'out': ''},
		{'in': 'ctx.lineCap = "round";',
		'out': 'setLineCap "round'},
		{'in': 'ctx.fillStyle = "#123";',
		'out': 'setFillColor "#123'},
		{'in': 'ctx.fillStyle = "red";',
		'out': 'setFillColor "#FF0000'},
		{'in': 'ctx.fillStyle = "rgb(1,2,3)";',
		'out': 'setFillColor "#010203'},
		{'in': 'ctx.fillStyle = "rgba(1,2,3,0.5)";',
		'out': 'setFillColor "#80010203'},
		{'in': 'ctx.fillStyle = 3;',
		// weird input but we want to know no JavaScript error is thrown.
		'out': 'setFillColor 3'},
		{'in': 'ctx.strokeStyle = "black";',
		'out': 'setPenColor "#000000'},
		{'in': 'ctx.font = \'30px\';',
		'out': 'setFontSize 30'},
		{'in': 'ctx.font = \'Arial\';',
		'out': 'setFontFamily "Arial'},
		{'in': 'ctx.font = \'30px Arial\';',
		'out': 'setFontSize 30\nsetFontFamily "Arial'}
	];
	processTranslateTestCases(cases, logger);
};