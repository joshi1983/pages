import { processCommodoreScanTokenProcessorCases } from
'./processCommodoreScanTokenProcessorCases.js';
import { processSimpleLineCases } from
'../../../../../../modules/parsing/basic/commodore-basic/scanning/scantoken-processors/processSimpleLineCases.js';

export function testProcessSimpleLineCases(logger) {
	const cases = [
		{'in': 'line 1,2,3,4', 'out': 'line ( 1 , 2 ) - ( 3 , 4 ) '},
		{'in': 'line 1,2,3,4\n9', 'out': 'line ( 1 , 2 ) - ( 3 , 4 ) \n9 '}, // ignore the number on the next line.
		{'in': 'line 1,2,3,4,5', 'out': 'line ( 1 , 2 ) - ( 3 , 4 ) , 5 '},
		{'in': 'line 1,2,3,4-x', 'out': 'line 1 , 2 , 3 , 4 - x ' }
		// the - operator makes this not a simple enough case to be handled.
	];
	processCommodoreScanTokenProcessorCases(cases, processSimpleLineCases, logger);
};