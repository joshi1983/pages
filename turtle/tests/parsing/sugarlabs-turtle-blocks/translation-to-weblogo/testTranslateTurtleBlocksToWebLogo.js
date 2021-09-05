import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { sugarLabsTurtleBlocksExamples } from
'../../../helpers/parsing/sugarLabsTurtleBlocksExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translateTurtleBlocksToWebLogo } from
'../../../../modules/parsing/sugarlabs-turtle-blocks/translation-to-weblogo/translateTurtleBlocksToWebLogo.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

function testSpecialCases(logger) {
	const cases = [
	/*
	Most of these test cases were made by exporting a few very short block programs from:
	https://turtle.sugarlabs.org/

	The HTML version was saved from the download feature which includes the JSON input data.
	*/
	{'in': `[
[0,["start",
	{"id":1748038532229,"collapsed":true,
		"xcor":0,"ycor":200,"heading":0,"color":-10,"shade":50,"pensize":5,"grey":100
	}
	],377,98,[null,1,null]],
[1,"forward",391,139,[0,2,null]],
[2,["number",{"value":100}],470,139,[1]]
]`, 'out': 'forward 100'},
	{'in': `[
	[0,["start",{"id":1748038532229,"collapsed":false,"xcor":0,"ycor":-343,"heading":0,
	"color":-10,"shade":50,"pensize":5,"grey":100}],377,98,[null,4,null]
	],
	[1,"forward",405,171,[4,2,null]],
	[2,["number",{"value":123}],484,171,[1]],
	[3,"forever",377,108,[null,null,null]],
	[4,"forever",391,139,[0,1,null]]
]`, 'out': 
`forever [
	forward 123
]`},{
	'in': `[[0,["start",{"id":1748038532229,"collapsed":false,"xcor":0,"ycor":-343,"heading":0,
	"color":-10,"shade":50,"pensize":5,"grey":100}],377,98,[null,5,null]],
	[1,"forward",405,171,[5,2,null]],
	[2,["number",{"value":123}],484,171,[1]],
	[3,"forever",377,108,[null,4,null]],
	[4,"forever",1307,600,[3,null,null]],
	[5,"repeat",391,139,[0,6,1,null]],
	[6,["number",{"value":4}],493,139,[5]]]`,
	'out':
`repeat 4 [
	forward 123
]`
},
	{'in': `[
	[0,["start",{"id":1748038532229,"collapsed":false,
	"xcor":0,"ycor":-288,"heading":0,"color":-10,"shade":50,"pensize":5,"grey":100}
	],343,118,[null,3,null]],
	[1,"forward",371,286,[4,2,null]],
	[2,["number",{"value":123}],450,286,[1]],
	[3,"forever",357,159,[0,6,4]],
	[4,"repeat",357,254,[3,5,1,null]],
	[5,["number",{"value":4}],459,254,[4]],
	[6,"forward",371,191,[3,7,null]],
	[7,["number",{"value":321}],450,191,[6]]
]`,
	'out':
`forever [
	forward 321
]
repeat 4 [
	forward 123
]`},{
	'in': `[
	[0,"arc",248,186,[3,1,2,null]],
	[1,["number",{"value":90}],322,186,[0]],
	[2,["number",{"value":100}],322,218,[0]],
	[3,["start",{"id":1748072747034,"collapsed":false,"xcor":100,
	"ycor":100,"heading":90,"color":-10,"shade":50,"pensize":5,"grey":100}],234,145,[null,0,null]]
]`,
	'out': 'arcRight 90 100'
},
{'in': `[
[0,["start",{"id":1748072747034,"collapsed":false,"xcor":100,
"ycor":100,"heading":90,"color":-10,"shade":50,
"pensize":5,"grey":100}],234,145,[null,1,null]],
[1,"forward",248,186,[0,2,3]],
[2,["number",{"value":123}],327,186,[1]],
[3,"back",248,218,[1,4,5]],
[4,["number",{"value":321}],322,218,[3]],
[5,"left",248,250,[3,6,7]],
[6,["number",{"value":90}],322,250,[5]],
[7,"setxy",248,282,[5,8,9,null]],
[8,["number",{"value":0}],322,282,[7]],
[9,["number",{"value":0}],322,314,[7]]
]`,
'out':
`forward 123
backward 321
left 90
setXY 0 0`},
{'in': `[
[0,["start",{"id":1748072747034,"collapsed":false,"xcor":0,"ycor":0,
"heading":270,"color":-10,"shade":50,"pensize":5,"grey":100}],234,145,[null,1,null]],
[1,"print",248,186,[0,2,null]],
[2,"plus",322,186,[1,3,4]],
[3,["number",{"value":2}],408,186,[2]],
[4,["number",{"value":12}],408,218,[2]]]`,
'out':
`print ( 2 + 12 )`},
{'in': `[
[0,["start",{"id":1748072747034,"collapsed":false,"xcor":0,"ycor":0,"heading":270,
"color":-10,"shade":50,"pensize":5,"grey":100}],234,145,[null,1,null]],
[1,"print",248,186,[0,2,null]],
[2,"multiply",322,186,[1,3,4]],
[3,["number",{"value":1}],408,186,[2]],
[4,["number",{"value":12}],408,218,[2]]
]`,
'out': 'print ( 1 * 12 )'},
{'in': `[
[0,["start",{"id":1748072747034,"collapsed":false,"xcor":0,"ycor":0,"heading":270,
"color":-10,"shade":50,"pensize":5,"grey":100}],234,145,[null,1,null]],
[1,"print",248,186,[0,2,null]],
[2,"minus",322,186,[1,3,4]],
[3,["number",{"value":8}],408,186,[2]],
[4,["number",{"value":4}],408,218,[2]]]`,
	'out': 'print ( 8 - 4 )'
},
{'in': `[
[0,["start",{"id":1748072747034,"collapsed":false,"xcor":0,"ycor":0,"heading":0,"color":-10,
"shade":50,"pensize":5,"grey":100}],235,145,[null,1,null]],
[1,"print",249,186,[0,2,null]],
[2,"divide",323,186,[1,3,4]],
[3,["number",{"value":1}],409,186,[2]],
[4,["number",{"value":4}],409,218,[2]]]`,
'out': 'print ( 1 / 4 )'},
{'in': `[
[0,["start",{"id":1748072747034,"collapsed":false,"xcor":0,"ycor":0,
"heading":0,"color":-10,"shade":50,"pensize":5,"grey":100}],235,145,[null,2,null]],
[1,"print",263,249,[2,3,null]],
[2,"if",249,186,[0,4,1,null]],
[3,["number",{"value":321}],337,249,[1]],
[4,["equal",{"value":false}],344,186,[2,5,6]],
[5,["number",{"value":123}],409,186,[4]],
[6,["number",{"value":1}],409,218,[4]]
]`, 'out':
`if ( 123 = 1 ) [
	print 321
]`},
{'in': `[[0,["start",{"id":1748072747034,"collapsed":false,"xcor":0,"ycor":0,
"heading":0,"color":-10,"shade":50,"pensize":5,"grey":100}],235,145,[null,2,null]],
[1,"print",263,249,[2,3,null]],
[2,"if",249,186,[0,4,1,null]],
[3,["number",{"value":321}],337,249,[1]],
[4,["less",{"value":null}],344,186,[2,5,6]],
[5,["number",{"value":123}],409,186,[4]],
[6,["number",{"value":100}],409,218,[4]]]`,
'out':
`if ( 123 < 100 ) [
	print 321
]`
}
	];
	testInOutPairs(cases, translateTurtleBlocksToWebLogo, logger);
}

function testAllExamplesDoNotThrowError(logger) {
	for (const code of sugarLabsTurtleBlocksExamples) {
		try {
			const result = translateTurtleBlocksToWebLogo(code);
			if (typeof result !== 'string')
				logger(`Expected result to be a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			logger(`Error with message (${exceptionToString(e)}) thrown while translating ${code}`);
		}
	}
}

export function testTranslateTurtleBlocksToWebLogo(logger) {
	wrapAndCall([
		testAllExamplesDoNotThrowError,
		testSpecialCases,
	], logger);
};