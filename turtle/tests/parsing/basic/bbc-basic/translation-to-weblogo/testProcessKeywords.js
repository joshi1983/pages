import { processKeywords } from
'../../../../../modules/parsing/basic/bbc-basic/translation-to-weblogo/processKeywords.js';
import { scan } from
'../../../../../modules/parsing/basic/qbasic/scanning/scan.js';
import { scanTokensToCode } from
'../../../../../modules/parsing/basic/helpers/scanTokensToCode.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

const mockMigrationData = {
	'keywords': [
		{'from': 'endproc', 'to': 'end'}
	]
};

function wrappedProcessKeywords(code) {
	const tokens = scan(code);
	processKeywords(tokens, mockMigrationData);
	return scanTokensToCode(tokens).trim();
}

export function testProcessKeywords(logger) {
	const cases = [
		{'in': 'endproc', 'out': 'end'},
		{'in': 'print', 'out': 'print'},
	];
	testInOutPairs(cases, wrappedProcessKeywords, logger);
};