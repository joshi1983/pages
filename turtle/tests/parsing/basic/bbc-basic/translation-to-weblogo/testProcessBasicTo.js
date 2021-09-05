import { processBasicTo } from
'../../../../../modules/parsing/basic/bbc-basic/translation-to-weblogo/processBasicTo.js';
import { scan } from
'../../../../../modules/parsing/basic/qbasic/scanning/scan.js';
import { scanTokensToCode } from
'../../../../../modules/parsing/basic/helpers/scanTokensToCode.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

const functions = new Map([
	['print', 'p']
]);

function wrappedProcessBasicTo(code) {
	const tokens = scan(code);
	processBasicTo(tokens, functions);
	return scanTokensToCode(tokens).trim();
}

export function testProcessBasicTo(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'print', 'out': 'p'},
		{'in': 'print 123', 'out': 'p 123'},
		{'in': 'print 123+1', 'out': 'p 123 + 1'}
	];
	testInOutPairs(cases, wrappedProcessBasicTo, logger);
};