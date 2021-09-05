import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translateWebLogoToJS } from
'../../../../modules/parsing/compiling/to-js/translateWebLogoToJS.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

function testTranslateWebLogoToJSPerformance(logger) {
	const cases = [
		{'in': 'print cos :degrees', 'out': 'console.log(Math.cos( degrees * 0.017453292519943295 ));'},
		{'in': 'print sin :degrees', 'out': 'console.log(Math.sin( degrees * 0.017453292519943295 ));'},
		{'in': 'print tan :degrees', 'out': 'console.log(Math.tan( degrees * 0.017453292519943295 ));'},
		{'in': 'print 3+10', 'out': 'console.log(13);'},
		{'in': 'print 3*10', 'out': 'console.log(30);'},
		{'in': 'print 3-10', 'out': 'console.log(-7);'},
		{'in': 'print 3/10', 'out': 'console.log(0.3);'},
		{'in': 'print 1+3/10', 'out': 'console.log(1.3);'},
		{'in': 'print abs -2', 'out': 'console.log(2);'},
		{'in': 'print char 65', 'out': 'console.log("A");'},
		{'in': 'print cosh 1', 'out': 'console.log(1.5430806348152437);'},
		{'in': 'print difference 5 2', 'out': 'console.log(3);'},
		{'in': 'print exp -2', 'out': 'console.log(0.1353352832366127);'},
		{'in': 'print floor 1.1', 'out': 'console.log(1);'},
		{'in': 'print hypot [3 4]', 'out': 'console.log(5);'},
		{'in': 'print pi', 'out': 'console.log(3.141592653589793);'},
		{'in': 'print product 2 3', 'out': 'console.log(6);'},
		{'in': 'print product 2 1+3', 'out': 'console.log(8);'},
		{'in': 'print (product 2 3 4)', 'out': 'console.log(24);'},
		{'in': 'print radCos 1', 'out': 'console.log(0.5403023058681398);'},
		{'in': 'print radSin 1', 'out': 'console.log(0.8414709848078965);'},
		{'in': 'print radTan 1', 'out': 'console.log(1.5574077246549023);'},
		{'in': 'print remainder 10 2', 'out': 'console.log(0);'},
		{'in': 'print round 3.2', 'out': 'console.log(3);'},
		{'in': 'print sign -1', 'out': 'console.log(-1);'},
		{'in': 'print sinh 1', 'out': 'console.log(1.1752011936438014);'},
		{'in': 'print sqrt 1', 'out': 'console.log(1);'},
		{'in': 'print sum 2 3', 'out': 'console.log(5);'},
		{'in': 'print (sum 2 3 4)', 'out': 'console.log(9);'},
	];
	const options = {
		'optimizeFor': 'performance'
	};
	testInOutPairs(cases, function(code) {
		return translateWebLogoToJS(code, options);
	}, logger);
}

function testWithAllOptions(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'break', 'out': 'break;'},
		{'in': 'make "x 3', 'out': 'x = 3'},
		{'in': 'print 3', 'out': 'console.log(3);'},
		{'in': 'print :x+:t', 'out': 'console.log( x + t );'},
		{'in': 'print :x-:y', 'out': 'console.log( x - y );'},
		{'in': 'print :x/:y', 'out': 'console.log( x / y );'},
		{'in': 'print true', 'out': 'console.log(true);'},
		{'in': 'print false', 'out': 'console.log(false);'},
		{'in': 'print "hi', 'out': 'console.log("hi");'},
		{'in': 'print abs -:x', 'out': 'console.log(Math.abs(x));'},
		{'in': 'print and :x :y', 'out': 'console.log( x && y );'},
		{'in': 'print bitAnd :x :y', 'out': 'console.log( x & y );'},
		{'in': 'print bitOr :x :y', 'out': 'console.log( x | y );'},
		{'in': 'print bitShiftLeft :x :y', 'out': 'console.log( x << y );'},
		{'in': 'print bitShiftRight :x :y', 'out': 'console.log( x >> y );'},
		{'in': 'print boolean? x', 'out': 'console.log( typeof x === "boolean" );'},
		{'in': 'print char :x', 'out': 'console.log(String.fromCharCode(x));'},
		{'in': 'print cosh :x', 'out': 'console.log(Math.cosh(x));'},
		{'in': 'print count :x', 'out': 'console.log( x.length );'},
		{'in': 'print createPList', 'out': 'console.log(new Map());'},
		{'in': 'print createPList2 []', 'out': 'console.log(new Map());'},
		{'in': 'print createPList2 [[0 "hi]]', 'out': 'console.log(new Map([[0, "hi"]]));'},
		{'in': 'print difference :x :y', 'out': 'console.log( x - y );'},
		{'in': 'print exp :x', 'out': 'console.log(Math.exp(x));'},
		{'in': 'print first x', 'out': 'console.log( x[0] );'},
		{'in': 'print firsts x', 'out': 'console.log( x.map(e => e[0]) );'},
		{'in': 'print hypot :x', 'out': 'console.log(Math.hypot(...x));'},
		{'in': 'print not :x', 'out': 'console.log( !x );'},
		{'in': 'print or :x :y', 'out': 'console.log( x || y );'},
		{'in': 'print power 2 3', 'out': 'console.log(Math.pow(2, 3));'},
		{'in': 'print radCos :angleRadians', 'out': 'console.log(Math.cos(angleRadians));'},
		{'in': 'print radSin :angleRadians', 'out': 'console.log(Math.sin(angleRadians));'},
		{'in': 'print radTan :angleRadians', 'out': 'console.log(Math.tan(angleRadians));'},
		{'in': 'print remainder :x :y', 'out': 'console.log( x % y );'},
		{'in': 'print round :x', 'out': 'console.log(Math.round(x));'},
		{'in': 'print sign :x', 'out': 'console.log(Math.sign(x));'},
		{'in': 'print sinh :x', 'out': 'console.log(Math.sinh(x));'},
		{'in': 'print sqrt :x', 'out': 'console.log(Math.sqrt(x));'},
		{'in': 'print string? x', 'out': 'console.log( typeof x === "string" );'},
		{'in': 'print tanh 1', 'out': 'console.log(Math.tanh(1));'},
		{'in': 'print ifelse true 1 2', 'out': 'console.log( true ? 1 : 2 );'},
	];
	const options = [];
	for (const optimizeFor of [undefined, 'performance']) {
		options.push({
			'optimizeFor': optimizeFor
		});
	}
	options.forEach(function(options, index) {
		const optionSpecificLogger = prefixWrapper(`Options ${index}, options=${JSON.stringify(options)}`, logger);
		testInOutPairs(cases, function(code) {
			return translateWebLogoToJS(code, options);
		}, optionSpecificLogger);
	});
}

export function testTranslateWebLogoToJS(logger) {
	wrapAndCall([
		testTranslateWebLogoToJSPerformance,
		testWithAllOptions
	], logger);
};