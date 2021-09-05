import { processCommodoreScanTokenProcessorCases } from
'./processCommodoreScanTokenProcessorCases.js';
import { splitTokensEndingWithNumbers, sToStartName } from
'../../../../../../modules/parsing/basic/commodore-basic/scanning/scantoken-processors/splitTokensEndingWithNumbers.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

function testSToStartName(logger) {
	const cases = [
		{'in': 'COLOR0', 'out': 'color'},
		{'in': 'draw0', 'out': 'draw'},
		{'in': 'graphic0', 'out': 'graphic'}
	];
	testInOutPairs(cases, sToStartName, logger);
}

function testGeneral(logger) {
	const cases = [
		{'in': 'graphic0,1', 'out': 'graphic 0 , 1 '},
	];
	processCommodoreScanTokenProcessorCases(cases, splitTokensEndingWithNumbers, logger);
}

export function testSplitTokensEndingWithNumbers(logger) {
	wrapAndCall([
		testGeneral,
		testSToStartName
	], logger);
};