import { processScanTestCases } from '../../processScanTestCases.js';
import { scan } from '../../../../modules/parsing/pov-ray/scanning/scan.js';

export function testScan(logger) {
	const cases = [{
		'code': '"hello world"',
		'tokens': [{'s': '"hello world"', 'colIndex': 12}]
	},{
		'code': '',
		'len': 0
	},{
		'code': '// a comment',
		'tokens': [
		{'s': '// a comment', 'colIndex': 11}
		]
	},{
		'code': '// a comment\n',
		'tokens': [
		{'s': '// a comment', 'colIndex': 11}
		]
	},{
		'code': `/* hello
	world
*\/`,
		'len': 1
	}, {
		'code': '-.5',
		'tokens': [{'s': '-.5', 'colIndex': 2, 'lineIndex': 0}]
	}, {
		'code': '-.5\n',
		'tokens': [{'s': '-.5', 'colIndex': 2, 'lineIndex': 0}]
	}, {
		'code': '.5',
		'tokens': [{'s': '.5', 'colIndex': 1}]
	}, {
		'code': '#declare x',
		'tokens': [
			{'s': '#declare', 'colIndex': 7, 'lineIndex': 0},
			{'s': 'x', 'colIndex': 9, 'lineIndex': 0}
		]
	}, {
		'code': '#declare R = 0.20;',
		'tokens': [
			'#declare', 'R', '=', '0.20', ';'
		]
	}, {
		'code': '#declare R=0.20;',
		'tokens': [
			'#declare', 'R', '=', '0.20', ';'
		]
	},{
		'code': '0,60,0',
		'len': 5,
		'tokens': [
			'0', ',', '60', ',', '0'
		]
	},{
		'code': 'rotate<0,60,0>',
		'len': 8,
		'tokens': [
			'rotate', '<', '0', ',', '60', ',', '0', '>'
		]
	},{
		'code': 'cylinder {<-1,-2,-3>,<-4, 5,-6>,R}',
		'len': 20,
		'tokens': [
			'cylinder', '{', '<', '-1', ',', '-2', ',', '-3', '>', ',',
			'<', '-4', ',', '5', ',', '-6', '>', ',', 'R', '}'
		]
	},{
		'code': 'background{White}',
		'len': 4,
		'tokens': [
			'background', '{', 'White', '}'
		]
	},{
		'code': '#include "colors.inc"',
		'tokens': [
			{'s': '#include', 'colIndex': 7, 'lineIndex': 0},
			{'s': '"colors.inc"', 'colIndex': 20, 'lineIndex': 0}
		]
	},{
		'code': '#include "colors.inc"\n',
		'tokens': [
			{'s': '#include', 'colIndex': 7, 'lineIndex': 0},
			{'s': '"colors.inc"', 'colIndex': 20, 'lineIndex': 0}
		]
	},{
		'code': '#version 3.6;',
		'len': 3,
		'tokens': [
			'#version', '3.6', ';'
		]
	},{
		'code': '#while (2 < x)#end',
		'len': 7,
		'tokens': [
			'#while', '(', '2', '<', 'x', ')', '#end'
		]
	},{
		'code': 'x*y',
		'len': 3,
		'tokens': ['x', '*', 'y']
	},{
		'code': 'x*y/z',
		'len': 5,
		'tokens': ['x', '*', 'y', '/', 'z']
	},{
		'code': '!x',
		'len': 2,
		'tokens': ['!', 'x']
	},{
		'code': 'x&u',
		'len': 3,
		'tokens': ['x', '&', 'u']
	},{
		'code': 'x|u',
		'len': 3,
		'tokens': ['x', '|', 'u']
	},{
		'code': '#end// comment',
		'len': 2,
		'tokens': ['#end', '// comment']
	},{
		'code': 'x != 0',
		'len': 3,
		'tokens': ['x', '!=', '0']
	},{
		'code': 'x!=0',
		'tokens': [
			{'s': 'x', 'colIndex': 0},
			{'s': '!=', 'colIndex': 2},
			{'s': '0', 'colIndex': 3}
		]
	},{
		'code': 'x?y:z',
		'tokens': ['x',
			{'s': '?', 'colIndex': 1},
			{'s': 'y', 'colIndex': 2},
			{'s': ':', 'colIndex': 3},
			'z']
	},{
		'code': 'Bar-1',
		'tokens': [
			{'s': 'Bar', 'colIndex': 2},
			{'s': '-', 'colIndex': 3},
			{'s': '1', 'colIndex': 4}
		]
	},{
		'code': '2e-3',
		'tokens': [{'s': '2e-3', 'colIndex': 3}]
	},{
		'code': '#declare Element',
		'tokens': ['#declare', 'Element']
	},{
		'code': '.property',
		'tokens': [{'s': '.', 'colIndex': 0}, {'s': 'property', 'colIndex': 8}]
	},{
		'code': '{x}',
		'tokens': [
			{'s': '{', 'colIndex': 0},
			{'s': 'x', 'colIndex': 1},
			{'s': '}', 'colIndex': 2}
		]
	},{
		'code': '{x+4}',
		'tokens': [
			{'s': '{', 'colIndex': 0},
			{'s': 'x', 'colIndex': 1},
			'+', '4', '}'
		]
	},{'code': '#declare (', 
	'tokens': [
		{'s': '#declare', 'colIndex': 7},
		{'s': '(', 'colIndex': 9}]
	}
	];
	processScanTestCases(cases, scan, logger);
};