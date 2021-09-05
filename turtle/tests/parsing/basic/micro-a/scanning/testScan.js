import { processScanTestCases } from '../../../processScanTestCases.js';
import { scan } from
'../../../../../modules/parsing/basic/micro-a/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': 'func f()', 'tokens': ['def', 'f', '(', ')']},
		{'code': `WinMsg wmMOUSEMOVE

   mousex mx
   mousey my

Endwm`, 'tokens': []},
		{'code': `WinMsg wmLButtonDown
EndWm
WinMsg wmRButtonDown
EndWm`, 'tokens': []}
	];
	processScanTestCases(cases, scan, logger);
};