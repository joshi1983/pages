import { insertSpaces } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testInsertSpaces(logger) {
	const cases = [
		{'in': 'ifx = 3', 'changed': false},
		// ifx is a valid variable name.
		// ifx should not get replaced with "if x" here.
		
		{'in': 'gotox = 3', 'changed': false},
		{'in': 'forx = 3', 'changed': false},
		
	];
	testInOutPairs(cases, insertSpaces, logger);
};