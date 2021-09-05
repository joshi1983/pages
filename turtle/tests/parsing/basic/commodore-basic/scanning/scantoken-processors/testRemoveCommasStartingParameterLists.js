import { processCommodoreScanTokenProcessorCases } from
'./processCommodoreScanTokenProcessorCases.js';
import { removeCommasStartingParameterLists } from
'../../../../../../modules/parsing/basic/commodore-basic/scanning/scantoken-processors/removeCommasStartingParameterLists.js';

export function testRemoveCommasStartingParameterLists(logger) {
	const cases = [
		{'in': 'print "hi"', 'out': 'print "hi" '},
		{'in': 'line,1,2', 'out': 'line 1 , 2 '},
	];
	processCommodoreScanTokenProcessorCases(cases, removeCommasStartingParameterLists, logger);
};