import { insertSpacesAfterIntegerLabels } from
'../../../../modules/parsing/basic/helpers/insertSpacesAfterIntegerLabels.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

/*
Some BASIC code is listed without spaces after integer labels.
The code without spaces gets hard to read by humans.
The lack of a space also makes it a little more difficult to scan the labels and recognize them as labels
instead of integer number literals that may be part of a mathematical calculation.

insertSpacesAfterIntegerLabels inserts spaces to get the code in a clearer state.
*/
export function testInsertSpacesAfterIntegerLabels(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'REM', 'out': 'REM'},
		{'in': 'REM1', 'out': 'REM1'},
		{'in': '1REM', 'out': '1 REM'},
		{'in': '123REM', 'out': '123 REM'},
		{'in': ' 1REM', 'out': ' 1 REM'},
		{'in': '   1REM', 'out': '   1 REM'},
		{'in': '\t1REM', 'out': '\t1 REM'},
		{'in': '\t \t1REM', 'out': '\t \t1 REM'},
		{'in': '123(', 'out': '123 ('},
		{'in': '123:', 'out': '123:'}, 
		// the : makes very clear that the integer is a label so no new space is required.
		
		{'in': '123 :', 'out': '123 :'},
		{'in': '123\t:', 'out': '123\t:'},
		{'in': '123\t:PRINT', 'out': '123\t:PRINT'},
		{'in': '123:PRINT', 'out': '123:PRINT'},
		{'in': '123PRINT', 'out': '123 PRINT'}, // space required to make it more readable.
	];
	testInOutPairs(cases, insertSpacesAfterIntegerLabels, logger);
};