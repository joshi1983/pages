import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { scan } from
'../../../../modules/parsing/basic/qbasic/scanning/scan.js';
import { scanTokensToCode } from
'../../../../modules/parsing/basic/helpers/scanTokensToCode.js';
import { StringUtils } from
'../../../../modules/StringUtils.js';
import { Token } from
'../../../../modules/parsing/Token.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

function testNumLines(logger) {
	const cases = [
		{'code': 'print 1', 'numLines': 1},
		{'code': 'line 1,2,3,4', 'numLines': 1},
		{'code': 'line (1,2),(3,4)', 'numLines': 1},
		{'code': 'line (1,2)-(3,4)', 'numLines': 1}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const scanTokens = scan(caseInfo.code);
		const result = scanTokensToCode(scanTokens);
		if (typeof result !== 'string')
			plogger(`Expected a string but found ${result}`);
		else {
			const lineCount = 1 + StringUtils.countChar(result, '\n');
			if (lineCount !== caseInfo.numLines)
				plogger(`Expected ${caseInfo.numLines} lines but found ${lineCount}`);
		}
	});
}

function testWithModifiedColIndex(logger) {
	const vals = ['line', '1', ',', '2', ',', '3', ',', '4'];
	const tokens = [];
	for (let i = 0; i < vals.length; i++) {
		const val = vals[i];
		tokens.push(new Token(val, i, 0));
	}
	const result = scanTokensToCode(tokens);
	const numLines = 1 + StringUtils.countChar(result, '\n');
	if (numLines !== 1)
		logger(`Expected 1 line but found ${numLines}`);
}

export function testScanTokensToCode(logger) {
	wrapAndCall([
		testNumLines,
		testWithModifiedColIndex
	], logger);
};