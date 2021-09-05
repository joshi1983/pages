import { ParseTreeTokenType } from
'../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { scan } from
'../../../../../modules/parsing/other-languages/pascal/turing/scanning/scan.js';
import { scanTokenToParseTreeToken } from
'../../../../../modules/parsing/other-languages/pascal/turing/scanTokenToParseTreeToken.js';
import { turingExamples } from
'../../../../helpers/parsing/pascal/turingExamples.js';

export function testScanTokenToParseTreeTokenVariousExamples(logger) {
	turingExamples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		const tokens = scan(code);
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
			const parseToken = scanTokenToParseTreeToken(token);
			if (parseToken.type === ParseTreeTokenType.UNRECOGNIZED)
				plogger(`Unrecognized token ${i} with s=${token.s}`);
		}
	});
};