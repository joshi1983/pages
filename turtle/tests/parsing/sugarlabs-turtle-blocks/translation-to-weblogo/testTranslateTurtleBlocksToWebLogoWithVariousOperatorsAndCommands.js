import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translateTurtleBlocksToWebLogo } from
'../../../../modules/parsing/sugarlabs-turtle-blocks/translation-to-weblogo/translateTurtleBlocksToWebLogo.js';

export function testTranslateTurtleBlocksToWebLogoWithVariousOperatorsAndCommands(logger) {
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
},
{'in': `[
[0,["start",{"id":1748072747034,"collapsed":false,"xcor":0,"ycor":0,
"heading":0,"color":-10,"shade":60,"pensize":5,"grey":100}]
,235,145,[null,2,null]],
[1,"print",263,249,[2,3,null]],
[2,"if",249,186,[0,4,1,null]],
[3,["number",{"value":321}],337,249,[1]],
[4,["greater",{"value":null}],344,186,[2,5,6]],
[5,["number",{"value":123}],409,186,[4]],
[6,["number",{"value":1}],409,218,[4]]]`,
'out':
`if ( 123 > 1 ) [
	print 321
]`},
{'in': `[
[0,["start",{"id":1748072747034,"collapsed":false,"xcor":0,"ycor":0,"heading":0,
"color":-10,"shade":60,"pensize":5,"grey":100}],235,145,[null,1,null]],
[1,"ifthenelse",249,186,[0,8,2,3,4]],
[2,"penup",263,249,[1,null]],
[3,"pendown",263,312,[1,null]],
[4,"setcolor",249,375,[1,5,6]],
[5,["number",{"value":0}],334,375,[4]],
[6,"setpensize",249,407,[4,7,null]],
[7,["number",{"value":5}],358,407,[6]],
[8,["equal",{"value":null}],344,186,[1,9,10]],
[9,["number",{"value":123}],409,186,[8]],
[10,["number",{"value":100}],409,218,[8]]]`,
'out':
`ifelse ( 123 = 100 ) [
	penUp
] [
	penDown
]
setPenColor 0
setPenSize 5`},
{'in':
`[
[0,["start",{"id":1748072747034,"collapsed":false,"xcor":0,"ycor":0,"heading":0,"color":-10,
"shade":60,"pensize":5,"grey":100}],235,145,[null,1,null]],
[1,"setheading",249,186,[0,2,null]],
[2,["number",{"value":123}],355,186,[1]]]`,
'out': 'setHeading 123'},
{'in': `[
[0,["start",{"id":1748072747034,"collapsed":false,"xcor":0,"ycor":0,"heading":0,"color":-10,
"shade":60,"pensize":5,"grey":100}],235,145,[null,3,null]],
[1,["media",{"value":null}],1303,569,[null]],
[2,["mousebutton",{"value":null}],1269,579,[null]],
[3,"backward",249,186,[0,4,5]],
[4,"hidden",263,218,[3,6]],
[5,"hidden",249,281,[3,null]],
[6,"print",263,218,[4,7,null]],
[7,"oneOf",337,218,[6,8,9]],
[8,["number",{"value":0}],423,218,[7]],
[9,["number",{"value":1}],423,250,[7]]]`,
'out': 'print pick [ 0 1 ]'},
	{'in': `[
[0,["start",{"id":1748072747034,"collapsed":false,"xcor":123.00000000000001,"ycor":0,"heading":180,
"color":-10,"shade":50,"pensize":5,"grey":100}],236,146,[null,1,null]],
[1,"fill",250,187,[0,3,2]],
[2,"hidden",250,408,[1,null]],
[3,"forward",264,219,[1,4,5]],
[4,["number",{"value":100}],343,219,[3]],
[5,"right",264,251,[3,6,7]],
[6,["number",{"value":90}],338,251,[5]],
[7,"forward",264,283,[5,8,9]],
[8,["number",{"value":123}],343,283,[7]],[9,"right",264,315,[7,10,11]],
[10,["number",{"value":90}],338,315,[9]],
[11,"forward",264,347,[9,12,null]],
[12,["number",{"value":100}],343,347,[11]]]`,
	'out':
`polyStart
forward 100
right 90
forward 123
right 90
forward 100
polyEnd`},
	{'in': `[
	[0,["start",{"id":1748072747034,"collapsed":false,"xcor":123.00000000000001,"ycor":0,
	"heading":180,"color":-10,"shade":60,"pensize":5,"grey":100}],236,146,[null,1,null]],
	[1,"setturtlecolor",250,187,[0,2,3]],
	[2,["number",{"value":90}],373,187,[1]],
	[3,"setturtlename2",250,219,[1,4,5]],
	[4,["text",{"value":"Yertle"}],340,219,[3]],
	[5,"print",250,251,[3,6,null]],
	[6,["turtlename",{"value":null}],324,251,[5]]
	]`,
	'out': 'print "turtleName'},
	{'in': `[[0,["start",{"id":1748072747034,"collapsed":false,"xcor":123.00000000000001,"ycor":0,"heading":180,
	"color":-10,"shade":60,"pensize":5,"grey":100}],197,136,[null,1,null]],
	[1,"print",211,177,[0,2,null]],
	[2,"plus",285,177,[1,3,4]],
	[3,["number",{"value":2}],371,177,[2]],
	[4,"multiply",371,209,[2,5,6]],
	[5,["number",{"value":12}],457,209,[4]],
	[6,"divide",457,241,[4,7,8]],
	[7,["number",{"value":1}],543,241,[6]],
	[8,["number",{"value":4}],543,273,[6]]
	]`, 'out': 'print ( 2 + ( 12 * ( 1 / 4 ) ) )'}
	];
	testInOutPairs(cases, translateTurtleBlocksToWebLogo, logger);
}