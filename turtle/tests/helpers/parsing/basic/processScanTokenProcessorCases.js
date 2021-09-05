import { scanTokensToCode } from
'../../../../modules/parsing/basic/helpers/scanTokensToCode.js';
import { testInOutPairs } from
'../../testInOutPairs.js';

export function processScanTokenProcessorCases(scan, cases, 
processFunc, logger) {
	if (typeof scan !== 'function')
		throw new Error(`scan must be a function but found ${scan}`);
	if (!(cases instanceof Array))
		throw new Error(`cases must be an Array but found ${cases}`);
	if (typeof processFunc !== 'function')
		throw new Error(`processFunc must be a function but found ${processFunc}`);
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function but found ${logger}`);
	
	function wrapped(code) {
		const tokens = scan(code);
		processFunc(tokens);
		return scanTokensToCode(tokens);
	}

	testInOutPairs(cases, wrapped, logger);
};