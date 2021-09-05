import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/kturtle/translation-to-weblogo/translate.js';

export function testTranslate(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': '$x = 1', 'out': 'make "x 1'},
		{'in': 'print $x + "hello"', 'out': 'print ( combine :x "hello )'},
		{'in': 'learn p $x { $x = 1}', 'out': 'to p :x\n\tlocalmake "x 1\nend'},
		{'in': 'turnright 90', 'out': 'right 90'},
		{'in': 'print "Hello"', 'out': 'print "Hello'},
		{'in': 'print "Hello world"', 'out': 'print \'Hello world\''},
		{'in': 'if $x < 1 {}', 'out': 'if :x < 1 [\n]'},
		{'in': 'if $x != 1 {}', 'out': 'if :x <> 1 [\n]'},
		{'in': 'if $x < 1 {print "bye"} else {print "hi"}', 'out': 'ifelse :x < 1 [\n\tprint "bye\n] [\n\tprint "hi\n]'},
		{'in': 'for $x = 1 to 10 {}', 'out': 'for [ "x 1 10 ] [\n]'},
		{'in': 'for $z = 123 to 456 {}', 'out': 'for [ "z 123 456 ] [\n]'},
		{'in': 'for $x = 1 {}', 'out': 'for [ "x 1 10 ] [\n]'},
		{'in': 'for $y = 2 {}', 'out': 'for [ "y 2 10 ] [\n]'},
		{'in': 'for $x {}', 'out': 'for [ "x 1 10 ] [\n]'},
		{'in': 'for $y {}', 'out': 'for [ "y 1 10 ] [\n]'},
		{'in': 'while true {}', 'out': 'while true [\n]'},
		{'in': 'while true', 'out': 'while true [\n]'},
		{'in': 'while 1 < $x {}', 'out': 'while 1 < :x [\n]'},
		{'in': 'repeat 4 {}', 'out': 'repeat 4 [\n]'},
		{'in': 'repeat 4', 'out': 'repeat 4 [\n]'},
		{'in': 'repeat', 'out': 'repeat 1 [\n]'},
		{'in': 'learn', 'out': 'to p\nend'},
		{'in': 'learn {}', 'out': 'to p\nend'},
		{'in': 'learn {print "hi"}', 'out': 'to p\n\tprint "hi\nend'},
		{'in': 'learn p{print "hi"}', 'out': 'to p\n\tprint "hi\nend'},
		{'in': 'learn r{print "hi"}', 'out': 'to r\n\tprint "hi\nend'},
		{'in': 'learn r $x{print $x}', 'out': 'to r :x\n\tprint :x\nend'},
		{'in': 'wait 1', 'out': ''}, // wait should be removed.
		{'in': 'canvassize 100,100', 'out': ''}, // canvassize should be removed.
		{'in': 'cs 100,100', 'out': ''}, // cs is short for canvassize.
		{'in': '@(turnright) 90', 'out': 'right 90'},
		{'in': 'canvascolor 9', 'out': 'setScreenColor 9'},
		{'in': 'canvascolor 255,0,0', 'out': 'setScreenColor [ 255 0 0 ]'},
		{'in': 'pencolor 255,0,0', 'out': 'setPenColor [ 255 0 0 ]'},
		{'in': 'penwidth 5', 'out': 'setPenSize 5'},
		{'in': 'direction 135', 'out': 'setHeading 135'},
		{'in': 'center', 'out': 'home'},
		{'in': 'go 100,200', 'out': 'setXY 100 200'},
		{'in': 'gox 100', 'out': 'setX 100'},
		{'in': 'goy 100', 'out': 'setY 100'},
		{'in': 'getx', 'out': 'xCor'},
		{'in': 'gety', 'out': 'yCor'},
		{'in': 'spriteshow', 'out': 'showTurtle'},
		{'in': 'spritehide', 'out': 'hideTurtle'},
	];
	testInOutPairs(cases, translate, logger);
};