import { ArrayUtils } from
'../../../../../../modules/ArrayUtils.js';
import { processScanTestCases } from
'../../../../../parsing/processScanTestCases.js';
import { isGoodPlaceToMergeNegative, scan } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/terrapin/scan.js';
import { LogoScanner } from
'../../../../../../modules/parsing/LogoScanner.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

function testIsGoodPlaceToMergeNegative(logger) {
	// The function is intended for - with a number literal but
	// we're using :x to make sure the internally used 
	// LogoScanner.scan separates the - from the token after it.
	const cases = [
	{'code': '(3 -3)', 'result': false}, // false because we likely want to interpret it like (3 - 3).
	{'code': '(-3)', 'result': true}, // true because the - can't be a binary operator.
	{'code': '(-:x)', 'result': true}, // true because the - can't be a binary operator.
	{'code': '[-3]', 'result': true},
	{'code': '[-:x]', 'result': true},
	{'code': '[3 -3]', 'result': true},
	{'code': '[] -:x', 'result': true}, // can't subtract from a list so likely a good case to merge.
	{'code': 'pd setpc "yellow fill pu setxy [60 -2] pd', 'result': true},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tokens = LogoScanner.scan(caseInfo.code);
		const negativeIndex = ArrayUtils.indexOfMatch(tokens, t => t.s === '-');
		if (negativeIndex === -1) {
			if (caseInfo.result === true) // if the negative sign should be merged, it is ok that LogoScanner.scan already kept the values together.
				return;
			plogger(`Expected to find a token with s='-' but did not find it. token.s values were ${tokens.map(t => t.s).join(', ')}`);
		}
		else {
			const result = isGoodPlaceToMergeNegative(tokens, negativeIndex);
			if (result !== caseInfo.result)
				plogger(`Expected ${caseInfo.result} but found ${result}`);
		}
	});
}

function testScanCases(logger) {
	const cases = [
	{'code': ';', 'tokens': [';']},
	{'code': 'TO START', 'tokens': [{'s': 'TO', 'colIndex': 1, 'lineIndex': 0}, 'START']},
	{'code': `; Copied from https://resources.terrapinlogo.com/logolib/clock.html
; The author's email address is: tekwiz@beyondbb.com
TO START`, 'tokens': ['; Copied from https://resources.terrapinlogo.com/logolib/clock.html',
'\n',
'; The author\'s email address is: tekwiz@beyondbb.com', '\n',
'TO', 'START']},
	{'code': 'fd 100', 'tokens': ['fd', '100']},
	{'code': 'print 100', 'tokens': ['print', '100']},
	{'code': 'PR "|Welcome.|', 'tokens': ['PR', 
		{'s': '\'Welcome.\'', 'colIndex': 12, 'lineIndex': 0}]},
	{'code': `PR "|Welcome.|
PR "hi`, 'tokens': ['PR', '\'Welcome.\'', '\n', 'PR', '"hi']},
	{'code': 'PR "|Welcome to my project.|', 'tokens': ['PR', 
		{'s': '\'Welcome to my project.\'', 'colIndex': 26}
	]},
	// We want some string literals converted to WebLogo's long string literals
	// so WebLogo's parser has fewer problems parsing Terrapin's code.
	// I couldn't find documentation of the | in Terrapin 
	// marking the start and end of a special string literal.
	// Some code examples made it very clear, though.

	{'code': 'PRINT [WITH A PRINTOUT OF THE HELP FOR PLAY]',
	'tokens': ['PRINT', '\'WITH A PRINTOUT OF THE HELP FOR PLAY\'']},
	{'code': 'PR [WITH A PRINTOUT OF THE HELP FOR PLAY]',
	'tokens': ['PR', '\'WITH A PRINTOUT OF THE HELP FOR PLAY\'']},
	{'code': 'SETFONT [ARIAL BALTIC]', 'tokens': ['SETFONT', '\'ARIAL BALTIC\'']},
	{'code': '[85 -45]', 'tokens': ['[', '85', '-45', ']']},
	{'code': 'setxy [85 -45]', 'tokens': ['setxy', '[', '85', '-45', ']']},
	{'code': 'setxy [85 -2]', 'tokens': ['setxy', '[', '85', '-2', ']']},
	{'code': 'setxy [ 85 -2 ]', 'tokens': ['setxy', '[', '85', '-2', ']']},
	{'code': 'setxy [85 -45] pd setpc "yellow fill pu setxy [60 -2]',
	'tokens': ['setxy', '[', '85', '-45', ']', 'pd', 'setpc', '"yellow',
		'fill', 'pu', 'setxy', '[', '60', '-2', ']']},
	{'code': 'MAKE “X', 'tokens': ['MAKE', '"X']}
	];
	processScanTestCases(cases, scan, logger);
}

export function testScan(logger) {
	wrapAndCall([
		testIsGoodPlaceToMergeNegative,
		testScanCases,
	], logger);
};