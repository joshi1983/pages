import { processScanTestCases } from '../../processScanTestCases.js';
import { scan } from '../../../../modules/parsing/qbasic/scanning/scan.js';

export function testScan(logger) {
	const cases = [
	{
		'code': 'CLS',
		'tokens': [{'s': 'CLS', 'colIndex': 2}]
	},{
		'code': 'SCREEN 10',
		'tokens': ['SCREEN', 
		{'s': '10', 'lineIndex': 0, 'colIndex': 8}]
	},{
		'code': 'SCREEN\n10',
		'tokens': ['SCREEN', 
		{'s': '10', 'lineIndex': 1, 'colIndex': 1}]
	},{
		'code': 'print "hello world"',
		'tokens': [
		'print', {'s': '"hello world"', 'colIndex': 18}]
	},{
		// weird quotes but we still want to scan as if they're ".
		// This is just to gracefully handle code copied from websites that
		// don't get the quotes exactly correct or the quotes could be adjusted
		// in PDF's.
		'code': 'PRINT ” The age is “;A',
		'tokens': ['PRINT', '” The age is “', ';','A']
	},{
		'code': 'PRINT " The age is ";A',
		'tokens': ['PRINT', '" The age is "', ';','A']
	},{
		'code': 'PRINT "";A',
		'tokens': ['PRINT', {'s': '""', 'colIndex': 7},
			{'s': ';', 'colIndex': 8},
			{'s': 'A', 'colIndex': 9}
		]
	},{
		'code': 'PRINT "";A$',
		'tokens': ['PRINT', {'s': '""', 'colIndex': 7},
			{'s': ';', 'colIndex': 8},
			{'s': 'A$', 'colIndex': 10}
		]
	},{
		'code': 'CIRCLE (100, 100), 25, 4,0,3.14',
		'tokens': [
		'CIRCLE', '(', '100', ',', '100', ')', ',', '25',
		',', '4', ',', '0', ',', '3.14'
		]
	},{
		'code': 'REM a comment',
		'tokens': [
			{'s': 'REM a comment', 'colIndex': 12, 'lineIndex': 0}
		]
	},{
		'code': 'DECLARE FUNCTION frac! (number!)',
		'tokens': [
			'DECLARE', 'FUNCTION', 'frac!', '(', 'number!', ')'
		]
	},{
		'code': 'PRINT "Count is now " + STR$(count)',
		'tokens': [
			'PRINT', '"Count is now "', '+', 'STR$', '(', 'count', ')'
		]
	},{
		// I didn't find any example code with no whitespaces like this but 
		// I want the scanner to handle it anyway.
		'code': 'numb=1-numb',
		'tokens': [
			'numb', '=', '1', '-', 'numb'
		]
	},{
		// The QBasic code I found had a lot more whitespace but 
		// I want to handle this anyway.
		'code': 'INT(RND*17)+16',
		'tokens': [
			'INT', '(', 'RND', '*', '17', ')', '+' , '16'
		]
	},{
		'code': 'IF Z>9 THEN Z=1',
		'tokens': [
			'IF', 'Z', '>', '9', 'THEN', 'Z', '=' , '1'
		]
	},{
		'code': 'IF scrnmode <> 12',
		'tokens': ['IF', 'scrnmode', '<>', '12']
	},{
		'code': 'IF scrnmode<>12',
		'tokens': ['IF', 'scrnmode', '<>', '12']
	},{
		'code': 'IF scrnmode >= 12',
		'tokens': ['IF', 'scrnmode', '>=', '12']
	},{
		'code': 'IF scrnmode>=12',
		'tokens': ['IF', 'scrnmode', '>=', '12']
	},{
		'code': 'IF scrnmode <= 12',
		'tokens': ['IF', 'scrnmode', '<=', '12']
	},{
		'code': 'IF scrnmode<=12',
		'tokens': ['IF', 'scrnmode', '<=', '12']
	},{
		'code': 'FUNCTION Min% (a AS INTEGER, b AS INTEGER)',
		'tokens': ['FUNCTION', 'Min%', '(', 'a', 'AS', 'INTEGER', ',', 'b', 'AS', 'INTEGER', ')']
	},{
		'code': 'DATA &HCD, &H21',
		'tokens': ['DATA', '&HCD', ',', '&H21']
	},{
		'code': '-3',
		'tokens': ['-3']
	},{
		'code': '-.23',
		'tokens': ['-.23']
	},{
		'code': '-0.23',
		'tokens': ['-0.23']
	},{
		'code': '.23',
		'tokens': ['.23']
	},{
		'code': '-.23#',
		'tokens': ['-.23#']
	},{
		'code': '-3#',
		'tokens': ['-3#']
	},{
		'code': '3#',
		'tokens': ['3#']
	},{
		'code': '#3',
		'tokens': ['#3']
	},{
		'code': '#f',
		'tokens': ['#f']
	},{
		'code': '#F',
		'tokens': ['#F']
	},{
		'code': '#F&',
		'tokens': ['#F&']
	},{
		'code': '#1F&',
		'tokens': ['#1F&']
	},{
		'code': 'i~%',
		'tokens': ['i~%']
	},{
		'code': 'i&&',
		'tokens': ['i&&']
	},{
		'code': '#f&',
		'tokens': ['#f&']
	},{
		'code': 'a.23',
		'tokens': ['a', '.23']
	},{
		'code': 'a.y',
		'tokens': ['a', '.', 'y']
	},{
		'code': 'a3',
		'tokens': ['a3']
	},{
		'code': 'x-3',
		'tokens': ['x', '-3']
	},{
		'code': 'print 3-2',
		'tokens': ['print', '3', {
			's': '-', 'lineIndex': 0, 'colIndex': 7
		}, {'s': '2', 'lineIndex': 0, 'colIndex': 8}]
	},{
		'code': `PRINT "This is an example.
IF`,// Normally, a QBasic string literal ends with a ".
// We want to handle querky QBasic code that has string literals ending with a line break, though.
// We want a \n character to be an unusual alternate marker of an end to a string literal.
// An example was found at: http://www.petesqbsite.com/sections/tutorials/tuts/Subsl.html
		'tokens': [
		{'s': 'PRINT', 'colIndex': 4, 'lineIndex': 0},
		{'s': '"This is an example.', 'colIndex': 25, 'lineIndex': 0},
		{'s': 'IF', 'colIndex': 1, 'lineIndex': 1}]
	},{
		'code': `gosub 1
1`, 'tokens': ['gosub', '1', {'s': '1', 'colIndex': 0, 'lineIndex': 1}]
	},{
		'code': '$EXEICON:"iconfile.ico"',
		'tokens': ['$EXEICON', ':', '"iconfile.ico"']
	},{
		'code': 'INPUT” Enter the radius ”',
		'tokens': ['INPUT', '” Enter the radius ”']
	},{
		'code': 'x% = RangeRand%(',
		'tokens': ['x%', '=', 'RangeRand%', '(']
	}];
	processScanTestCases(cases, scan, logger);
};