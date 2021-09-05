import { LogoScanner } from '../../modules/parsing/LogoScanner.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
await LogoScanner.asyncInit();

export function testScanner(logger) {
	const cases = [
		{'code': '', 'numTokens': 0},
		{'code': '\n', 'numTokens': 1, 'tokens': [
			{'s': '\n', 'colIndex': 0, 'lineIndex': 0},
		]},
		{'code': 'true', 'tokens': [
			{'s': 'true', 'colIndex': 3}
		]},
		{'code': '()', 'tokens': [
			{'s': '(', 'colIndex': 0},
			{'s': ')', 'colIndex': 1}
		]},
		{'code': '(())', 'tokens': [
			{'s': '(', 'colIndex': 0},
			{'s': '(', 'colIndex': 1},
			{'s': ')', 'colIndex': 2},
			{'s': ')', 'colIndex': 3},
		]},
		{'code': '[[', 'tokens': [
			{'s': '[', 'colIndex': 0},
			{'s': '[', 'colIndex': 1}
		]},
		{'code': '[[]', 'tokens': [
			{'s': '[', 'colIndex': 0},
			{'s': '[', 'colIndex': 1},
			{'s': ']', 'colIndex': 2}
		]},
		{'code': '123', 'tokens': [
			{'s': '123', 'colIndex': 2}
		]},
		{'code': '(sum 1 3)', 'numTokens': 5},
		{'code': '2+5', 'tokens': [
			{'s': '2', 'colIndex': 0},
			{'s': '+', 'colIndex': 1},
			{'s': '5', 'colIndex': 2}
		]},
		{'code': '2+', 'tokens': [
			{'s': '2', 'colIndex': 0},
			{'s': '+', 'colIndex': 1}
		]},
		{'code': '2>', 'numTokens': 2},
		{'code': '<2', 'tokens': [
			{'s': '<', 'colIndex': 0},
			{'s': '2', 'colIndex': 1}
		]},
		{'code': '<=2', 'tokens': [
			{'s': '<=', 'colIndex': 1},
			{'s': '2', 'colIndex': 2}
		]},
		{'code': '=2', 'tokens': [
			{'s': '=', 'colIndex': 0},
			{'s': '2', 'colIndex': 1}
		]},
		{'code': '1=2', 'numTokens': 3},
		{'code': '1<>2', 'tokens': [
			{'s': '1', 'colIndex': 0},
			{'s': '<>', 'colIndex': 2},
			{'s': '2', 'colIndex': 3}
		]},
		{'code': '1<>true', 'tokens': [
			{'s': '1', 'colIndex': 0},
			{'s': '<>', 'colIndex': 2},
			{'s': 'true', 'colIndex': 6}
		]},
		{'code': '1<=2', 'numTokens': 3},
		{'code': '1>=2', 'numTokens': 3},
		{'code': '-2', 'tokens': [
			{'s': '-2', 'colIndex': 1}
		]},
		{'code': '[-2]', 'numTokens': 3},
		{'code': '[ -2 ]', 'numTokens': 3},
		{'code': '[-20]', 'numTokens': 3},
		{'code': '[ -20 ]', 'tokens': [
			{'s': '[', 'colIndex': 0},
			{'s': '-20', 'colIndex': 4},
			{'s': ']', 'colIndex': 6}
		]},
		{'code': '[-200]', 'tokens': [
			{'s': '[', 'colIndex': 0},
			{'s': '-200', 'colIndex': 4},
			{'s': ']', 'colIndex': 5}
		]},
		{'code': '[ -200 ]', 'numTokens': 3},
		{'code': '+2', 'tokens': [
			{'s': '+2', 'colIndex': 1}
		]}, // 1 because the + should be a redundent positive/negative sign if it is directly prefixing a number
		{'code': '-2-2', 'tokens': [
			{'s': '-2', 'colIndex': 1},
			{'s': '-', 'colIndex': 2},
			{'s': '2', 'colIndex': 3}
		]}, // should be scanned as ['-2', '-', '2'].
		{'code': '-23-2', 'tokens': [
			{'s': '-23', 'colIndex': 2},
			{'s': '-', 'colIndex': 3},
			{'s': '2', 'colIndex': 4}
		]},// should be scanned as ['-23', '-', '2'].
		{'code': '+23-2', 'tokens': [
			{'s': '+23', 'colIndex': 2},
			{'s': '-', 'colIndex': 3},
			{'s': '2', 'colIndex': 4}
		]},// should be scanned as ['+23', '-', '2'].
		{'code': '-23.45-2', 'tokens': [
			{'s': '-23.45', 'colIndex': 5},
			{'s': '-', 'colIndex': 6},
			{'s': '2', 'colIndex': 7}
		]},// should be scanned as ['-23.45', '-', '2'].
		{'code': '+23.45-2', 'numTokens': 3},// should be scanned as ['+23.45', '-', '2'].
		{'code': '+.45-2', 'numTokens': 3},// should be scanned as ['+.45', '-', '2'].
		{'code': '+.45-.2', 'numTokens': 3},// should be scanned as ['+.45', '-', '.2'].
		{'code': '1e1', 'numTokens': 1},
		{'code': '1.e1', 'numTokens': 1},
		{'code': '1e12', 'numTokens': 1},
		{'code': '1e-1', 'numTokens': 1},
		{'code': '1e+1', 'numTokens': 1},
		{'code': 'print 1e-1', 'numTokens': 2},
		{'code': '-1e1', 'numTokens': 1},
		{'code': 'fd 100', 'numTokens': 2},
		{'code': 'fd 100 rt 45', 'numTokens': 4},
		{'code': 'bk 100', 'tokens': [
			{'s': 'bk', 'colIndex': 1},
			{'s': '100', 'colIndex': 5}
		]},
		{'code': 'fd 10.0', 'tokens': [
			{'s': 'fd', 'colIndex': 1},
			{'s': '10.0', 'colIndex': 6}
		]},
		{'code': 'fd -10.0', 'tokens': [
			{'s': 'fd', 'colIndex': 1},
			{'s': '-10.0', 'colIndex': 7}
		]},
		{'code': 'fd 10+5', 'tokens': [
			{'s': 'fd', 'colIndex': 1},
			{'s': '10', 'colIndex': 4},
			{'s': '+', 'colIndex': 5},
			{'s': '5', 'colIndex': 6}
		]},
		{'code': 'fd 10*5', 'numTokens': 4},
		{'code': 'fd 10-5', 'numTokens': 4},
		{'code': 'fd 10/5', 'numTokens': 4},
		{'code': 'fd 10+5*2', 'numTokens': 6},
		{'code': 'and true false', 'numTokens': 3},
		{'code': 'print 1+2*3', 'numTokens': 6},
		{'code': 'print 5/4', 'tokens': [
			{'s': 'print', 'colIndex': 4},
			{'s': '5', 'colIndex': 6},
			{'s': '/', 'colIndex': 7},
			{'s': '4', 'colIndex': 8}
		]},
		{'code': 'print (1+2)*3', 'numTokens': 8},
		{'code': 'fd 10 + 5 * 2', 'tokens': [
			{'s': 'fd', 'colIndex': 1},
			{'s': '10', 'colIndex': 4},
			{'s': '+', 'colIndex': 6},
			{'s': '5', 'colIndex': 8},
			{'s': '*', 'colIndex': 10},
			{'s': '2', 'colIndex': 12}
		]},
		{'code': 'fd -5', 'numTokens': 2},
		{'code': 'fd +5', 'tokens': [
			{'s': 'fd', 'colIndex': 1},
			{'s': '+5', 'colIndex': 4}
		]},
		{'code': 'fd :x', 'tokens': [
			{'s': 'fd', 'colIndex': 1},
			{'s': ':x', 'colIndex': 4}
		]},
		{'code': 'fd :x+:y', 'tokens': [
			{'s': 'fd', 'colIndex': 1},
			{'s': ':x', 'colIndex': 4},
			{'s': '+', 'colIndex': 5},
			{'s': ':y', 'colIndex': 7}
		]},
		{'code': 'make "x 51', 'tokens': [
			{'s': 'make', 'colIndex': 3},
			{'s': '"x', 'colIndex': 6},
			{'s': '51', 'colIndex': 9}
		]},
		{'code': 'list "x 51', 'tokens': [
			{'s': 'list', 'colIndex': 3},
			{'s': '"x', 'colIndex': 6},
			{'s': '51', 'colIndex': 9}
		]},
		{'code': 'make "x (list "x 51)', 'numTokens': 7},
		{'code': 'LIST "Hello "World!', 'numTokens': 3},
		{'code': 'to donothing\nend', 'numTokens': 4},
		{'code': 'print [:x]', 'numTokens': 4},
		{'code': 'print [-:x]', 'numTokens': 5},
		{'code': 'print [-:x 4]', 'numTokens': 6},
		{'code': 'print [56+random 200]', 'numTokens': 7},
		{'code': 'setpc (list 56+random 200 56+random 200 56+random 200)', 'numTokens': 16},
		{'code': 'print [Choose YES to run example now, Choose NO Study it now.]', 'numTokens': 14},
		{'code': 'to fd\nend', 'numTokens': 4},
		{'code': 'make "x 100\nfd :x', 'numTokens': 6},
		{'code': 'fd 100;hello world comment', 'numTokens': 3},
		{'code': ';make "x 100 fd :x', 'numTokens': 1},
		{'code': ';print \'hello world :!@#$#%#$^#6;5646*)\'', 'numTokens': 1},
		{'code': ';Inspired by a video at https://www.youtube.com/watch?v=3F5-USpL2Xk', 'numTokens': 1},
		{'code': ';Inspired by a video at https://www.youtube.com/watch?v=3F5-USpL2Xk\nfd 100', 'numTokens': 4},
		{'code': '[255 255 255]', 'tokens': [
			{'s': '[', 'colIndex': 0},
			{'s': '255', 'colIndex': 3},
			{'s': '255', 'colIndex': 7},
			{'s': '255', 'colIndex': 11},
			{'s': ']', 'colIndex': 12}
		]},
		{'code': 'setpencolor [255 255 255]', 'numTokens': 6},
		{'code': '["x -200 200 1]', 'tokens': [
			{'s': '[', 'colIndex': 0},
			{'s': '"x', 'colIndex': 2},
			{'s': '-200', 'colIndex': 7},
			{'s': '200', 'colIndex': 11},
			{'s': '1', 'colIndex': 13},
			{'s': ']', 'colIndex': 14}
		]},
		{
			'code': 'if or (not :dx=:dy) (not :dx=0) [', 'tokens': [
				{'s': 'if', 'colIndex': 1},
				{'s': 'or', 'colIndex': 4},
				{'s': '(', 'colIndex': 6},
				{'s': 'not', 'colIndex': 9},
				':dx',
				'=',
				':dy',
				')',
				'(',
				'not',
				':dx','=','0',')','['
			]
		},
		{
			'code': ':x+:dx*:small',
			'tokens': [
				':x', '+', ':dx', '*', ':small'
			]
		},
		{
			'code': 'make "dx 1 make "dy 2 if or (not :dx=:dy) (not :dx=0) []',
			'tokens': [
				'make', '"dx', '1', 'make', '"dy', '2', 'if', 'or', 
				'(', 'not', ':dx', '=', ':dy', ')', 
				'(', 'not', ':dx', '=', '0', ')', '[', ']'
			]
		},
		{
			'code': 'make "x 1\nprint -:x',
			'tokens': [
				{'s': 'make', 'colIndex': 3},
				{'s': '"x', 'colIndex': 6},
				{'s': '1', 'colIndex': 8},
				{'s': '\n', 'colIndex': 9},
				{'s': 'print', 'colIndex': 4},
				{'s': '-', 'colIndex': 6},
				{'s': ':x', 'colIndex': 8}
			]
		},
		{
			'code': 'make "x 1\nprint sum -:x 1',
			'tokens': [
				{'s': 'make', 'colIndex': 3},
				{'s': '"x', 'colIndex': 6},
				{'s': '1', 'colIndex': 8},
				{'s': '\n', 'colIndex': 9},
				{'s': 'print', 'colIndex': 4},
				{'s': 'sum', 'colIndex': 8},
				{'s': '-', 'colIndex': 10},
				{'s': ':x', 'colIndex': 12},
				{'s': '1', 'colIndex': 14}
			]
		},
		{
			'code': 'print empty? []',
			'tokens': [
				{'s': 'print', 'colIndex': 4},
				{'s': 'empty?', 'colIndex': 11},
				{'s': '[', 'colIndex': 13},
				{'s': ']', 'colIndex': 14}
			]
		},
		{
			'code': 'setpencolor"red',
			'tokens': [
				'setpencolor',
				'"red'
			]
		},
		{
			'code': 'fd 100',
			'tokens': [
				{'s': 'fd', 'colIndex': 1},
				{'s': '100', 'colIndex': 5}
			]
		},
		{
			'code': 'fd 100; Hello World',
			'tokens': [
				{'s': 'fd', 'colIndex': 1},
				{'s': '100', 'colIndex': 5},
				{'s': '; Hello World', 'colIndex': 18}
			]
		},
		{
			'code': 'fd 100; Hello World\n  print "Hello',
			'tokens': [
				{'s': 'fd', 'colIndex': 1, 'lineIndex': 0},
				{'s': '100', 'colIndex': 5, 'lineIndex': 0},
				{'s': '; Hello World', 'colIndex': 18, 'lineIndex': 0},
				{'s': '\n', 'colIndex': 19, 'lineIndex': 0},
				{'s': 'print', 'colIndex': 6, 'lineIndex': 1},
				{'s': '"Hello', 'colIndex': 13, 'lineIndex': 1}
			]
		},
		{
			'code': 'make "x 0\nwhile [ :x < 3 ] [\nprint :x\nmake "x :x + 1\n]',
			'tokens': [
				{'s': 'make', 'lineIndex': 0, 'colIndex': 3},
				{'s': '"x', 'lineIndex': 0, 'colIndex': 6},
				{'s': '0', 'lineIndex': 0, 'colIndex': 8},
				{'s': '\n', 'lineIndex': 0, 'colIndex': 9},
				{'s': 'while', 'lineIndex': 1, 'colIndex': 4},
				{'s': '[', 'lineIndex': 1, 'colIndex': 6},
				{'s': ':x', 'lineIndex': 1, 'colIndex': 9},
				{'s': '<', 'lineIndex': 1, 'colIndex': 11},
				{'s': '3', 'lineIndex': 1, 'colIndex': 13},
				{'s': ']', 'lineIndex': 1, 'colIndex': 15},
				{'s': '[', 'lineIndex': 1, 'colIndex': 17},
				{'s': '\n', 'lineIndex': 1, 'colIndex': 18},
				{'s': 'print', 'lineIndex': 2, 'colIndex': 4},
				{'s': ':x', 'lineIndex': 2, 'colIndex': 7},
				{'s': '\n', 'lineIndex': 2, 'colIndex': 8},
				{'s': 'make', 'lineIndex': 3, 'colIndex': 3},
				{'s': '"x', 'lineIndex': 3, 'colIndex': 6},
				{'s': ':x', 'lineIndex': 3, 'colIndex': 9},
				{'s': '+', 'lineIndex': 3, 'colIndex': 11},
				{'s': '1', 'lineIndex': 3, 'colIndex': 13},
				{'s': '\n', 'lineIndex': 3, 'colIndex': 14},
				{'s': ']', 'lineIndex': 4, 'colIndex': 0}
			]
		},
		{
			// Not valid WebLogo code but tokens should be scanned anyway.
			'code': '+=',
			'tokens': [
				'+', '='
			]
		},
		{
			'code': '"+z',
			'tokens': [
				'"+z'
			]
		},
		{
			'code': 'print \'Hello World\'',
			'tokens': [
				{'s': 'print', 'colIndex': 4},
				{'s': '\'Hello World\'', 'colIndex': 18}
			]
		},
		{
			'code': '0.23.5', // not a valid number literal but also should not be broken by scanner.
			'tokens': [
				{'s': '0.23.5', 'colIndex': 5}
			]
		},
		{
			'code': '135h', // also not a valid number literal but keep it together for better troubleshooting messages
			'tokens': [
				{'s': '135h', 'colIndex': 3}
			]
		},
		{
			'code': 'to p\nif 0 = count [] [\n]\nend',
			'tokens': [
				{'s': 'to'},
				{'s': 'p'},
				{'s': '\n'},
				{'s': 'if'},
				{'s': '0'},
				{'s': '='},
				{'s': 'count'},
				{'s': '['},
				{'s': ']'},
				{'s': '['},
				{'s': '\n'},
				{'s': ']'},
				{'s': '\n'},
				{'s': 'end'},
			]
		},
		{
			'code': 'make "x - arctan 0.5',
			'tokens': [
				{'s': 'make', 'colIndex': 3},
				{'s': '"x', 'colIndex': 6},
				{'s': '-', 'colIndex': 8},
				{'s': 'arctan', 'colIndex': 15},
				{'s': '0.5', 'colIndex': 19}
			]
		},
		{
			'code': 'ht',
			'tokens': [
				{'s': 'ht', 'colIndex': 1}
			]
		},
		{
			'code': ';;',
			'tokens': [
				{'s': ';;', 'colIndex': 1}
			]
		},
		{
			'code': ';; ',
			'tokens': [
				{'s': ';; ', 'colIndex': 2}
			]
		},
		{
			'code': '; ',
			'tokens': [
				{'s': '; ', 'colIndex': 1}
			]
		},
		{
			'code': '\n\n',
			'tokens': [
				{'s': '\n', 'colIndex': 0, 'lineIndex': 0},
				{'s': '\n', 'colIndex': 0, 'lineIndex': 1}
			]
		},
		{
			'code': '\'',
			'tokens': [
				{'s': '\'', 'colIndex': 0, 'lineIndex': 0}
			]
		},
		{
			'code': '\'\n',
			'tokens': [
				{'s': '\'\n', 'colIndex': 0, 'lineIndex': 1},
			]
		},
		{
			'code': '\'hello\nend',
			'tokens': [
				{'s': '\'hello\nend', 'colIndex': 2, 'lineIndex': 1}
			]
		},
		{
			'code': 'print ["hi [0 "NO CITY]]',
			'tokens': [
				{'s': 'print'},
				{'s': '['},
				{'s': '"hi'},
				{'s': '['},
				{'s': '0'},
				{'s': '"NO'},
				{'s': 'CITY'},
				{'s': ']'},
				{'s': ']'}
			]
		},
		{
			'code': `print ['(' ')']`,
			'tokens': [
				{'s': 'print'},
				{'s': '['},
				{'s': `'('`},
				{'s': `')'`},
				{'s': ']'}
			]
		},
		{
			'code': `!=`,
			'tokens': [
				{'s': '!='}
			]
		},
		{
			'code': `1 != 2`,
			'tokens': [
				{'s': '1'},
				{'s': '!='},
				{'s': '2'}
			]
		},
		{
			'code': '1!=2',
			'tokens': [
				{'s': '1'},
				{'s': '!='},
				{'s': '2'}
			]
		},
		{
			'code': ':x!=:y',
			'tokens': [
				{'s': ':x'},
				{'s': '!='},
				{'s': ':y'}
			]
		},
		{
			'code': '1%2',
			'tokens': [
				{'s': '1'},
				{'s': '%'},
				{'s': '2'}
			]
		},
		{
			'code': ':x%:y',
			'tokens': [
				{'s': ':x'},
				{'s': '%'},
				{'s': ':y'}
			]
		},
		{
			'code': 'to 1 rpt 3 [fd a rt 120] end',
			'tokens': [
				{'s': 'to'},
				{'s': '1'},
				{'s': 'rpt'},
				{'s': '3'},
				{'s': '['},
				{'s': 'fd'},
				{'s': 'a'},
				{'s': 'rt'},
				{'s': '120'},
				{'s': ']'},
				{'s': 'end'}
			]
		},
		{
			'code': 'to p1a',
			'tokens': [
				{'s': 'to'},
				{'s': 'p1a'}
			]
		},
		{
			'code': 'to 1a end',
			// keep 1 a together when after 'to'.
			'tokens': [
				{'s': 'to'},
				{'s': '1a'},
				{'s': 'end'}
			]
		},
		{
			'code': 'to 1a end 1a',
			// keep 1 a together when after 'to'.
			'tokens': [
				{'s': 'to'},
				{'s': '1a'},
				{'s': 'end'},
				{'s': '1a'}
			]
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}. While scanning ${caseInfo.code}`, logger);
		const tokens = LogoScanner.scan(caseInfo.code);
		if (caseInfo.tokens === undefined && caseInfo.numTokens === undefined)
			plogger(`Either tokens or numTokens must be specified.`);
		const numTokens = caseInfo.numTokens !== undefined ? caseInfo.numTokens : caseInfo.tokens.length;
		if (tokens.length !== numTokens) {
			plogger('Expected ' + numTokens + ' but got ' + tokens.length + ' tokens from code ' + caseInfo.code);
			console.error(tokens);
		}
		else if (caseInfo.tokens instanceof Array) {
			caseInfo.tokens.forEach(function(tok, index) {
				const pplogger = prefixWrapper(`Token ${index}`, plogger);
				const actualTok = tokens[index];
				const s = typeof tok === 'object' ? tok.s : tok;
				const colIndex = typeof tok === 'object' ? tok.colIndex : undefined;
				const lineIndex = typeof tok === 'object' ? tok.lineIndex : undefined;
				if (actualTok.s !== s)
					pplogger(`Expected "${tok.s}" but got "${actualTok.s}"`);
				if (colIndex !== undefined && actualTok.colIndex !== colIndex)
					pplogger(`Expected colIndex of ${colIndex} but got ${actualTok.colIndex} for token with s of ${s}, actual tokens are ${JSON.stringify(tokens)}`);
				if (lineIndex !== undefined && actualTok.lineIndex !== lineIndex)
					pplogger(`Expected lineIndex of ${lineIndex} but got ${actualTok.lineIndex}`);
			});
		}
	});
}