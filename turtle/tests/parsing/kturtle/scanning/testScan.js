import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { processScanTestCases } from '../../processScanTestCases.js';
import { scan } from '../../../../modules/parsing/kturtle/scanning/scan.js';

export function testScan(logger) {
	const cases = [{
		'code': '',
		'len': 0
	}, {
		'code': '10.8',
		'len': 1,
		'tokens': [
			'10.8'
		]
	}, {
		'code': ',255',
		'len': 2,
		'tokens': [
			',', '255'
		]
	},{
		'code': '0,255,0',
		'len': 5,
		'tokens': [
			'0', ',', '255', ',', '0'
		]
	},{
		'code': 'reset',
		'len': 1,
	}, {
		'code': '$a = true',
		'len': 3
	}, {
		'code': 'print "this text will get printed on the canvas"',
		'len': 2,
		'tokens': [
			'print',
			'"this text will get printed on the canvas"'
		]
	}, {
		'code': '1*2',
		'len': 3,
		'tokens': [
			'1',
			'*',
			'2'
		]
	}, {
		'code': '# Fractal tree',
		'len': 1,
		'tokens': [
			'# Fractal tree'
		]
	}, {
		'code': '##',
		'len': 1,
		'tokens': [
			'##'
		]
	}, {
		'code': '# $1-2*4{}^/',
		'len': 1,
		'tokens': [
			'# $1-2*4{}^/'
		]
	}, {
		'code': 'direction 0',
		'len': 2,
		'tokens': [
			'direction',
			'0'
		]
	}, {
		'code': 'go 400, 500',
		'len': 4,
		'tokens': [
			'go',
			'400',
			',',
			'500'
		]
	}, {
		'code': 'if $depth > 0',
		'len': 4,
		'tokens': [
			'if',
			'$depth',
			'>',
			'0'
		]
	}, {
		'code': '$depth-1',
		'len': 3,
		'tokens': [
			'$depth',
			'-',
			'1'
		]
	}, {
		'code': '$depth^2',
		'len': 3,
		'tokens': [
			'$depth',
			'^',
			'2'
		]
	}, {
		'code': '$depth/2',
		'len': 3,
		'tokens': [
			'$depth',
			'/',
			'2'
		]
	}, {
		'code': 'if $depth > 0 {}',
		'len': 6,
		'tokens': [
			'if', '$depth', '>', '0', '{', '}'
		]
	}, {
		'code': '$A == $B',
		'len': 3,
		'tokens': [
			'$A', '==', '$B'
		]
	}, {
		'code': '$A != $B',
		'len': 3,
		'tokens': [
			'$A', '!=', '$B'
		]
	}, {
		'code': '$A >= $B',
		'len': 3,
		'tokens': [
			'$A', '>=', '$B'
		]
	}, {
		'code': '$A <= $B',
		'len': 3,
		'tokens': [
			'$A', '<=', '$B'
		]
	}, {
		'code': '<$B',
		'len': 2,
		'tokens': [
			'<', '$B'
		]
	}, {
		'code': '>$B',
		'len': 2,
		'tokens': [
			'>', '$B'
		]
	}, {
		'code': '$A<',
		'len': 2,
		'tokens': [
			'$A', '<'
		]
	}, {
		'code': '$A<=',
		'len': 2,
		'tokens': [
			'$A', '<='
		]
	}, {
		'code': '$A>',
		'len': 2,
		'tokens': [
			'$A', '>'
		]
	}, {
		'code': '$A>=',
		'len': 2,
		'tokens': [
			'$A', '>='
		]
	}, {
		'code': '==$B',
		'len': 2,
		'tokens': [
			'==', '$B'
		]
	}, {
		'code': '<=$B',
		'len': 2,
		'tokens': [
			'<=', '$B'
		]
	}, {
		'code': '$x,',
		'len': 2,
		'tokens': [
			'$x', ','
		]
	}, {
		'code': '12.34,',
		'len': 2,
		'tokens': [
			'12.34', ','
		]
	}, {
		'code': ',,',
		'len': 2,
		'tokens': [
			',', ','
		]
	}, {
		'code': ',$x',
		'len': 2,
		'tokens': [
			',', '$x'
		]
	}, {
		'code': ',12.34',
		'len': 2,
		'tokens': [
			',', '12.34'
		]
	}, {
		'code': 'kturtle-script-v1.0',
		'len': 1,
		'tokens': [
			'kturtle-script-v1.0'
		]
	}, {
		'code': '@(turnright)',
		'len': 3,
		'tokens': [
			'@(', 'turnright', ')'
		]
	}, {
		'code': '850@',
		'len': 2,
		'tokens': [
			'850', '@'
		]
	}, {
		'code': '$length@',
		'len': 2,
		'tokens': [
			'$length', '@'
		]
	}, {
		'code': '{print',
		'len': 2,
		'tokens': [
			'{', 'print'
		]
	},{
		'code': '$x{print',
		'len': 3,
		'tokens': [
			'$x', '{', 'print'
		]
	}];
	processScanTestCases(cases, scan, logger);
};