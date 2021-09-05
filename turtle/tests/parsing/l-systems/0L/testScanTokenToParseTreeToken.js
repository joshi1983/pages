import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { cgjenningsExamples } from
'../../../helpers/parsing/l-systems/cgjenningsExamples.js';
import { fractintExamples } from
'../../../helpers/parsing/l-systems/fractintExamples.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/l-systems/0L/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { scan } from
'../../../../modules/parsing/l-systems/0L/scanning/scan.js';
import { scanTokenToParseTreeToken } from
'../../../../modules/parsing/l-systems/0L/scanTokenToParseTreeToken.js';
import { zeroLExamples } from
'../../../helpers/parsing/l-systems/zeroLExamples.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, cgjenningsExamples);
ArrayUtils.pushAll(nonExamples, fractintExamples);

export function testScanTokenToParseTreeToken(logger) {
	const cases = [];
	nonExamples.forEach(function(code) {
		cases.push({
			'code': code,
			'isValid': false
		});
	});
	zeroLExamples.forEach(function(code) {
		cases.push({
			'code': code,
			'isValid': true
		});
	});
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Example ${index}, code=${caseInfo.code}`, logger);
		const tokens = scan(caseInfo.code);
		tokens.forEach(function(token, tokenIndex) {
			try {
				const result = scanTokenToParseTreeToken(token);
				if (typeof result !== 'object' || result.parentNode === undefined)
					plogger(`Expected a ParseTreeToken as a result but found ${result}`);
				else if (caseInfo.isValid && result.type === ParseTreeTokenType.UNRECOGNIZED) {
					plogger(`Token type UNRECOGNIZED found for an input token with s=${token.s}`);
				}
			}
			catch (e) {
				console.error(e);
				plogger(`Exception thrown and caught while processing a token with s=${token.s}, tokenIndex=${tokenIndex}. e=${exceptionToString(e)}`);
			}
		});
	});
};

