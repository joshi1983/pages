import { moveConstants } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/moveConstants.js';
import { processFixerCases } from './processFixerCases.js';

export function testMoveConstants(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'const x = 3', 'changed': false},
		{'code': `print a
x = 10
const a = x`, 'to': `x = 10
const a = x
print a`},
	];
	processFixerCases(cases, moveConstants, logger);
};