import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/processing/translation-to-weblogo/translate.js';

export function testTranslateMethodCalls(logger) {
	const cases = [
		{'in': `beginShape(TRIANGLE_FAN)`, 'out': 'polyStart'},
		{'in': `endShape();`, 'out': 'polyEnd'},
		{'in': 'size(400, 400);', 'out': ''},
		{'in': 'size(400, 400, P3D);', 'out': ''},
		{'in': 'PImage img = loadImage("laDefense.jpg");',
		'out': 'make "img "laDefense.jpg'},
		{'in': 'println(3)', 'out': 'print 3'},
		{'in': 'println (3)', 'out': 'print 3'},
		{'in': 'println ( 3 )', 'out': 'print 3'},
		{'in': 'println(1,2,3,"hi");',
		'out': 'type 1\ntype 2\ntype 3\nprint "hi'},
		{'in': 'printArray(x)', 'out': 'print :x'},
		{'in': 'fill(255)', 'out': 'setFillColor "#FFFFFF'},
		{'in': 'fill(1)', 'out': 'setFillColor "#010101'},
		{'in': 'fill(255, 128)', 'out': 'setFillColor "#80FFFFFF'},
		{'in': 'fill(0xff0102, 128)', 'out': 'setFillColor "#80FF0102'},
		{'in': 'fill(#ff0102, 128)', 'out': 'setFillColor "#80FF0102'},
		{'in': 'fill(0xff0102, 128)', 'out': 'setFillColor "#80FF0102'},
		{'in': 'fill(#ff0102)', 'out': 'setFillColor "#ff0102'},
		{'in': 'fill(0xff0102)', 'out': 'setFillColor "#ff0102'},
		{'in': 'fill(255, 1, 2)', 'out': 'setFillColor "#FF0102'},
		{'in': 'fill(x,y,z)', 'out': 'setFillColor [ :x :y :z ]'},
		{'in': 'stroke(#ff0102)', 'out': 'setPenColor "#ff0102'},
		{'in': 'stroke(0xff0102)', 'out': 'setPenColor "#ff0102'},
		{'in': 'stroke(255, 1, 2)', 'out': 'setPenColor "#FF0102'},
		{'in': 'stroke(x,y,z)', 'out': 'setPenColor [ :x :y :z ]'},
		{'in': 'stroke(255, 128)', 'out': 'setPenColor "#80FFFFFF'},
		{'in': 'stroke(0xff0102, 128)', 'out': 'setPenColor "#80FF0102'},
		{'in': 'background(0);', 'out': 'setScreenColor "#000000'},
		{'in': 'p()', 'out': 'p'},
		{'in': 'line(0, 0, segLength, 0);', 'outContains': 'pLine2D 0 0 :segLength 0'},
		{'in': 'line(0, 0, segLength, 0);', 'outContains': 'to pLine2D '},
		{'in': 'binary(#ff0201)', 'outContains': 'pBinary "#ff0201'},
		{'in': 'color c1 = #FFCC00', 'out': 'make "c1 "#ffcc00'},
		{'in': 'color c1 = color(255, 204, 0);', 'out': 'make "c1 "#FFCC00'},
		{'in': 'println(str(\'R\'));', 'out': 'print "R'},
	];
	testInOutPairs(cases, translate, logger);
};