import { processScanTestCases } from '../../processScanTestCases.js';
import { scan } from '../../../../modules/parsing/pov-ray/scanning/scan.js';

export function testScan(logger) {
	const cases = [{
		'code': '"hello world"',
		'len': 1,
		'tokens': ['"hello world"']
	},{
		'code': '',
		'len': 0
	},{
		'code': '// a comment',
		'len': 1,
		'tokens': [
		'// a comment'
		]
	},{
		'code': `/* hello
	world
*\/`,
		'len': 1
	}, {
		'code': '-.5',
		'len': 1,
		'tokens': ['-.5']
	}, {
		'code': '.5',
		'len': 1,
		'tokens': ['.5']
	}, {
		'code': '#declare x',
		'len': 2,
		'tokens': [
			{'s': '#declare', 'colIndex': 7, 'lineIndex': 0},
			{'s': 'x', 'colIndex': 9, 'lineIndex': 0}
		]
	}, {
		'code': '#declare R = 0.20;',
		'len': 5,
		'tokens': [
			'#declare', 'R', '=', '0.20', ';'
		]
	}, {
		'code': '#declare R=0.20;',
		'len': 5,
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
		'len': 2,
		'tokens': [
			'#include', '"colors.inc"'
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
		'len': 3,
		'tokens': ['x', '!=', '0']
	},{
		'code': 'x?y:z',
		'len': 5,
		'tokens': ['x', '?', 'y', ':', 'z']
	},{
		'code': 'Bar-1',
		'len': 3,
		'tokens': ['Bar', '-', '1']
	},{
		'code': '2e-3',
		'len': 1,
		'tokens': ['2e-3']
	},{
		'code': '#declare Element',
		'len': 2,
		'tokens': ['#declare', 'Element']
	},{
		'code': '.property',
		'len': 2,
		'tokens': ['.', 'property']
	}];
	processScanTestCases(cases, scan, logger);
};