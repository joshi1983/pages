import { processScanTestCases } from
'../../../../../parsing/processScanTestCases.js';
import { scan } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/terrapin/scan.js';

export function testScan(logger) {
	const cases = [
	{'code': ';', 'tokens': [';']},
	{'code': 'TO START', 'tokens': ['TO', 'START']},
	{'code': `; Copied from https://resources.terrapinlogo.com/logolib/clock.html
; The author's email address is: tekwiz@beyondbb.com
TO START`, 'tokens': ['; Copied from https://resources.terrapinlogo.com/logolib/clock.html',
'\n',
'; The author\'s email address is: tekwiz@beyondbb.com', '\n',
'TO', 'START']},
	{'code': 'fd 100', 'tokens': ['fd', '100']},
	{'code': 'print 100', 'tokens': ['print', '100']},
	{'code': 'PR "|Welcome.|', 'tokens': ['PR', '\'Welcome.\'']},
	{'code': `PR "|Welcome.|
PR "hi`, 'tokens': ['PR', '\'Welcome.\'', '\n', 'PR', '"hi']},
	{'code': 'PR "|Welcome to my project.|', 'tokens': ['PR', '\'Welcome to my project.\'']},
	// We want some string literals converted to WebLogo's long string literals
	// so WebLogo's parser has fewer problems parsing Terrapin's code.

	];
	processScanTestCases(cases, scan, logger);
};