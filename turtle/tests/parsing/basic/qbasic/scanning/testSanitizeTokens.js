import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { QBasicInternalFunctions } from
'../../../../../modules/parsing/basic/qbasic/QBasicInternalFunctions.js';
import { sanitizeTokens } from
'../../../../../modules/parsing/basic/qbasic/scanning/sanitizeTokens.js';
import { scan } from
'../../../../../modules/parsing/basic/qbasic/scanning/scan.js';

export function testSanitizeTokens(logger) {
	const cases = [
	{'code': 'print "hi"',
	'tokens': ['print',
		{'s': '"hi"', 'colIndex': 9}]},
	{'code': 'print ”hi”',
	'tokens': ['print', '"hi"']},
	{'code': 'print “hi“',
	'tokens': ['print', '"hi"']},
	{'code': 'print “hi',
	'tokens': ['print',
		{'s': '"hi"', 'colIndex': 9}]},
	{'code': 'print ”hi“',
	'tokens': ['print', '"hi"']},
	{'code': '’iconfile.ico’',
	'tokens': ['"iconfile.ico"']},
	{'code': '$EXEICON:’iconfile.ico’',
	'tokens': ['$EXEICON', ':', '"iconfile.ico"']},
	{'code': '', 'tokens': []}, // The  character should get filtered out.
	{'code': 'print 3 *',
	'tokens': ['print', '3']}, // a trailing binary operator should be removed.
	{'code': 'print 3 +',
	'tokens': ['print', '3']},{
		'code': 'dimx',
		'tokens': ['dim', 'x']
	},{
		'code': 'defx=3',
		'tokens': ['defx', '=', '3']
	},{
		'code': 'defx(y)=3',
		'tokens': ['def', 'x', '(', 'y', ')', '=', '3']
	},{
		'code': `DEFNYT()=X
DEFNYB()=X`,
		'tokens': ['DEF', 'NYT', '(', ')', '=', 'X',
		'DEF', 'NYB', '(', ')', '=', 'X']
	},{
		'code': 'dimx=3',
		'tokens': ['dimx', '=', '3']
	},{
		'code': '123 dimx=3',
		'tokens': ['123', 'dimx', '=', '3']
	},{
		'code': 'dimx as integer',
		'tokens': ['dim', 'x', 'as', 'integer']
	},{
		'code': 'for4',
		'tokens': ['for4'] // 4 is not an identifier so don't split.
	},{
		'code': 'for4 = 5 to step',
		'tokens': ['for4', '=', '5', 'to', 'step'] // 4 is not an identifier so don't split.
		// even though the 'to' is in the same line, splitting for4 into for 4 won't make it valid QBasic code.
	},{
		'code': 'forx',
		'tokens': ['forx'] // x 'to' and 'step' are not on the same line so don't split.
		// "to" is needed on the same line as any for-loop.
	},{
		'code': 'forx=4 to 10\nnext x',
		'tokens': ['for', 'x', '=', '4', 'to', '10', 'next', 'x']
	},{
		'code': 'forx=4',
		'tokens': ['forx', '=', '4']
	},{
		'code': 'forx=4+y',
		'tokens': ['forx', '=', '4', '+', 'y']
	},{
		'code': 'forx=4*y',
		'tokens': ['forx', '=', '4', '*', 'y']
	},{
		'code': 'goto 3',
		'tokens': ['goto', '3']
	},{
		'code': 'goto3',
		'tokens': ['goto', '3']
	},{
		'code': 'goto x',
		'tokens': ['goto', 'x']
	},{
		'code': 'gotox',
		'tokens': ['goto', 'x']
	},{
		'code': '3 goto3',
		'tokens': ['3', 'goto', '3']
	},{
		'code': 'x = x + gotoy',
		'tokens': ['x', '=', 'x', '+', 'gotoy']
	},{
		'code': 'ifx = 5',
		'tokens': ['ifx', '=', '5']
	},{
		'code': 'ifx = 5 then',
		'tokens': ['if', 'x', '=', '5', 'then']
	},{
		'code': ':ifx = 5 then',
		'tokens': [':', 'if', 'x', '=', '5', 'then']
	},{
		'code': 'x = x + ify',
		'tokens': ['x', '=', 'x', '+', 'ify']
	},{
		'code': 'sub ifx',
		'tokens': ['sub', 'ifx']
	},{
		'code': 'function ifx',
		'tokens': ['function', 'ifx']
	},{
		'code': 'screen4 = 5',
		'tokens': ['screen4', '=', '5']
	},{
		'code': 'SCREEN9',
		'tokens': [
			{'s': 'SCREEN', 'lineIndex': 0, 'colIndex': 5},
			{'s': '9', 'lineIndex': 0, 'colIndex': 6}
		]
	},{
		'code': 'screen 4',
		'tokens': ['screen', '4']
	},{
		'code': 'x = x + screen3',
		'tokens': ['x', '=', 'x', '+', 'screen3']
	},{
		'code': 'print screen4',
		'tokens': ['print', 'screen4']
	},{
		'code': 'sub screen4',
		'tokens': ['sub', 'screen4']
	},{
		'code': 'function screen4',
		'tokens': ['function', 'screen4']
	},{
		'code': 'function screen4\nscreen4',
		'tokens': ['function', 'screen4', 'screen4']
	},{
		'code': 'function screen4\nscreen3',
		'tokens': ['function', 'screen4', 'screen', '3']
	},{
		'code': 'next',
		'tokens': ['next']
	},{
		'code': 'nexti',
		'tokens': ['next', 'i']
	},{
		'code': 'nexti = 4',
		'tokens': ['nexti', '=', '4']
	},{
		'code': 'next4', // the 4 can't be a for-loop variable name so don't split.
		'tokens': ['next4']
	},{
		'code': '100 POKE1047, &H0',
		'tokens': ['100', 'POKE', '1047', ',', '&H0']
	},{
		'code': 'POKE1047, &H0',
		'tokens': ['POKE', '1047', ',', '&H0']
	},{
		'code': 'POKE1047',
		'tokens': ['POKE', '1047']
	},{
		'code': 'poke1047',
		'tokens': ['poke', '1047']
	},{
		'code': '100 POKE1047',
		'tokens': ['100', 'POKE', '1047']
	},{
		'code': 'POKE 1047, KeyFlags',
		'tokens': ['POKE', '1047', ',', 'KeyFlags']
	},{
		'code': 'POKE1047, KeyFlags',
		'tokens': ['POKE', '1047', ',', 'KeyFlags']
	},{
		'code': 'print next4',
		'tokens': ['print', 'next4']
	},{
		'code': 'print nexti',
		'tokens': ['print', 'nexti']
	},{
		'code': 'x = x + nexty',
		'tokens': ['x', '=', 'x', '+', 'nexty']
	},{
		'code': 'sub nexti',
		'tokens': ['sub', 'nexti']
	},{
		'code': 'function nexti',
		'tokens': ['function', 'nexti']
	},{
		'code': 'declare sub nexti\nnexti',
		'tokens': ['declare', 'sub', 'nexti', 'nexti']
	},{
		'code': 'declare sub nexti\nfor x=0 to 10\nnextx',
		'tokens': ['declare', 'sub', 'nexti',
		'for', 'x', '=', '0', 'to', '10', 'next', 'x']
	},{
		'code': 'declare function nexti\nnexti',
		'tokens': ['declare', 'function', 'nexti', 'nexti']
	},{
		'code': 'type',
		'tokens': ['type']
	},{
		'code': 'typex',
		'tokens': ['type', 'x']
	},{
		'code': 'typex = 4',
		'tokens': ['typex', '=', '4']
	},{
		'code': 'print typex',
		'tokens': ['print', 'typex']
	},{
		'code': 'type4',
		'tokens': ['type4'] 
		// keep type4 together because the 4 can't be a valid type name.
	},{
		'code': '100 typex',
		'tokens': ['100', 'type', 'x']
	},{
		'code': 'while',
		'tokens': ['while']
	},{
		'code': 'whilex',
		'tokens': ['while', 'x']
	},{
		'code': 'while3<4',
		'tokens': ['while', '3', '<', '4']
	},{
		'code': 'whilex<4',
		'tokens': ['while', 'x', '<', '4']
	},{
		'code': 'x = x + whiley',
		'tokens': ['x', '=', 'x', '+', 'whiley']
	},{
		'code': 'print while4',
		'tokens': ['print', 'while4']
	},{
		'code': 'wend',
		'tokens': ['wend']
	},{
		'code': 'wendx',
		'tokens': ['wend', 'x']
	},{
		'code': 'declare sub wendx\nwhile (1)\nwendx',
		'tokens': ['declare', 'sub', 'wendx',
			'while', '(', '1', ')', 'wendx']
	},{
		'code': 'x = x + wendy',
		'tokens': ['x', '=', 'x', '+', 'wendy']
	},{
		'code': 'wendx = 4',
		'tokens': ['wendx', '=', '4']
	},{
		'code': 'wendprint',
		'tokens': ['wend', 'print']
	},{
		'code': 'wendprint "hi"',
		'tokens': ['wend', 'print', '"hi"']
	},{
		'code': 'print wend4',
		'tokens': ['print', 'wend4']
	},{
		'code': 'x=2y',
		'tokens': ['x', '=', '2', '*', 'y']
	},{
		'code': 'let x=2y',
		'tokens': ['let', 'x', '=', '2', '*', 'y']
	},{
		'code': 'const x=2y',
		'tokens': ['const', 'x', '=', '2', '*', 'y']
	},{
		'code': 'LET x=2y',
		'tokens': ['LET', 'x', '=', '2', '*', 'y']
	},{
		'code': 'CONST x=2y',
		'tokens': ['CONST', 'x', '=', '2', '*', 'y']
	}];
	QBasicInternalFunctions.getAllFunctionsInfo().forEach(function(commandInfo) {
		if (commandInfo.primaryName.indexOf(' ') !== -1)
			return;

		// Check that the sanitization does not split tokens with internal function names.
		cases.push({
			'code': commandInfo.primaryName,
			'tokens': [{
				's': commandInfo.primaryName,
				'colIndex': commandInfo.primaryName.length - 1,
				'lineIndex': 0
			}]
		});
		// test again using a label.
		cases.push({
			'code': '100 ' + commandInfo.primaryName,
			'tokens': ['100', commandInfo.primaryName]
		});
	});
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tokens = scan(caseInfo.code);
		sanitizeTokens(tokens);
		if (tokens.length !== caseInfo.tokens.length) {
			plogger(`Expected ${caseInfo.tokens.length} tokens but found ${tokens.length}.  The found token s values are: ${tokens.map(t => t.s).join(', ')}`);
			return;
		}
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
			const eTokenInfo = caseInfo.tokens[i];
			const expectedS = typeof eTokenInfo === 'object' ? eTokenInfo.s : eTokenInfo;
			const tlogger = prefixWrapper(`Token ${i}`, plogger);
			if (token.s !== expectedS)
				tlogger(`expected to have s='${expectedS}' but found '${token.s}'`);
			if (Number.isInteger(eTokenInfo.colIndex) &&
			eTokenInfo.colIndex !== token.colIndex)
				tlogger(`Expected colIndex ${eTokenInfo.colIndex} but found ${token.colIndex}`);
			if (Number.isInteger(eTokenInfo.lineIndex) &&
			eTokenInfo.lineIndex !== token.lineIndex)
				tlogger(`Expected lineIndex ${eTokenInfo.lineIndex} but found ${token.lineIndex}`);
		}
	});
};