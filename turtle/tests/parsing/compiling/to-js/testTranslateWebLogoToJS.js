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
		{'in': 'print 3+10', 'out': 'console.log( 3 + 10 );'},
		{'in': 'print :x+:t', 'out': 'console.log( x + t );'},
		{'in': 'print 3*10', 'out': 'console.log( 3 * 10 );'},
		{'in': 'print 3-10', 'out': 'console.log( 3 - 10 );'},
		{'in': 'print :x-:y', 'out': 'console.log( x - y );'},
		{'in': 'print 3/10', 'out': 'console.log( 3 / 10 );'},
		{'in': 'print :x/:y', 'out': 'console.log( x / y );'},
		{'in': 'print 1+3/10', 'out': 'console.log( 1 + 3 / 10 );'},
		{'in': 'print true', 'out': 'console.log(true);'},
		{'in': 'print false', 'out': 'console.log(false);'},
		{'in': 'print "hi', 'out': 'console.log("hi");'},
		{'in': 'print abs -2', 'out': 'console.log(Math.abs(-2));'},
		{'in': 'print abs -:x', 'out': 'console.log(Math.abs(x));'},
		{'in': 'print and :x :y', 'out': 'console.log( x && y );'},
		{'in': 'print bitAnd :x :y', 'out': 'console.log( x & y );'},
		{'in': 'print bitOr :x :y', 'out': 'console.log( x | y );'},
		{'in': 'print boolean? x', 'out': 'console.log( typeof x === "boolean" );'},
		{'in': 'print char 65', 'out': 'console.log(String.fromCharCode(65));'},
		{'in': 'print cosh 1', 'out': 'console.log(Math.cosh(1));'},
		{'in': 'print count :x', 'out': 'console.log( x.length );'},
		{'in': 'print createPList', 'out': 'console.log(new Map());'},
		{'in': 'print createPList2 []', 'out': 'console.log(new Map());'},
		{'in': 'print createPList2 [[0 "hi]]', 'out': 'console.log(new Map([[0, "hi"]]));'},
		{'in': 'print difference 5 2', 'out': 'console.log( 5 - 2 );'},
		{'in': 'print exp -2', 'out': 'console.log(Math.exp(-2));'},
		{'in': 'print first x', 'out': 'console.log( x[0] );'},
		{'in': 'print firsts x', 'out': 'console.log( x.map(e => e[0]) );'},
		{'in': 'print floor 1.1', 'out': 'console.log(Math.floor(1.1));'},
		{'in': 'print hypot [3 4]', 'out': 'console.log(Math.hypot(3, 4));'},
		{'in': 'print hypot :x', 'out': 'console.log(Math.hypot(...x));'},
		{'in': 'print not :x', 'out': 'console.log( !x );'},
		{'in': 'print or :x :y', 'out': 'console.log( x || y );'},
		{'in': 'print pi', 'out': 'console.log(Math.PI);'},
		{'in': 'print power 2 3', 'out': 'console.log(Math.pow(2, 3));'},
		{'in': 'print product 2 3', 'out': 'console.log( 2 * 3 );'},
		{'in': 'print product 2 1+3', 'out': 'console.log( 2 * ( 1 + 3 ));'},
		{'in': 'print (product 2 3 4)', 'out': 'console.log( 2 * 3 * 4 );'},
		{'in': 'print radCos 1', 'out': 'console.log(Math.cos(1));'},
		{'in': 'print radSin 1', 'out': 'console.log(Math.sin(1));'},
		{'in': 'print radTan 1', 'out': 'console.log(Math.tan(1));'},
		{'in': 'print remainder 10 2', 'out': 'console.log( 10 % 2 );'},
		{'in': 'print round 3.2', 'out': 'console.log(Math.round(3.2));'},
		{'in': 'print sign -1', 'out': 'console.log(Math.sign(-1));'},
		{'in': 'print sinh 1', 'out': 'console.log(Math.sinh(1));'},
		{'in': 'print sqrt 1', 'out': 'console.log(Math.sqrt(1));'},
		{'in': 'print string? x', 'out': 'console.log( typeof x === "string" );'},
		{'in': 'print sum 2 3', 'out': 'console.log( 2 + 3 );'},
		{'in': 'print (sum 2 3 4)', 'out': 'console.log( 2 + 3 + 4 );'},
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