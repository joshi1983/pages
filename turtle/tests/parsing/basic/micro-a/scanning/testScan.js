import { processScanTestCases } from '../../../processScanTestCases.js';
import { scan } from
'../../../../../modules/parsing/basic/micro-a/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': '\' comment', 'tokens': ['\' comment']},
		{'code': '\' comment!', 'tokens': ['\' comment!']},
		{'code': '\' comment|', 'tokens': ['\' comment|']},
		{'code': '\' comment&', 'tokens': ['\' comment&']},
		{'code': '\' comment<', 'tokens': ['\' comment<']},
		{'code': 'func f()', 'tokens': ['def', 'f', '(', ')']},
		{'code': `WinMsg wmMOUSEMOVE

   mousex mx
   mousey my

Endwm`, 'tokens': []},
		{'code': `WinMsg wmLButtonDown
EndWm
WinMsg wmRButtonDown
EndWm`, 'tokens': []},
		{'code': 'print !true',
		'tokens': ['print', 'not', 'true']},
		{'code': 'print true&false',
		'tokens': ['print', 'true', 'and', 'false']},
		{'code': 'print true|false',
		'tokens': ['print', 'true', 'or', 'false']}
	];
	processScanTestCases(cases, scan, logger);
};