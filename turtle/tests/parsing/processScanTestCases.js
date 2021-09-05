import { prefixWrapper } from '../helpers/prefixWrapper.js';

export function processScanTestCases(cases, scan, logger) {
	cases.forEach(function(caseInfo, index) {
		if (caseInfo.len === undefined && caseInfo.tokens instanceof Array)
			caseInfo.len = caseInfo.tokens.length;
		const result = scan(caseInfo.code);
		const plogger = prefixWrapper(`Case ${index}`, logger);
		if (!(result instanceof Array))
			plogger(`Expected result to be an Array but got ${result}`);
		else if (result.length !== caseInfo.len) {
			plogger(`Expected length of ${caseInfo.len} but got ${result.length}, result strings = "${result.map(t => t.s).join('", "')}"`);
		}
		else {
			if (caseInfo.tokens instanceof Array) {
				const tokens = caseInfo.tokens;
				for (let i = 0; i < tokens.length; i++) {
					const resultToken = result[i];
					const token = tokens[i];
					const s = typeof token === 'string' ? token : token.s;
					if (typeof s === 'string' && s !== resultToken.s)
						plogger(`Expected result[${i}] to have s of ${s} but got ${resultToken.s}`);
					if (typeof token === 'object') {
						const expectedColIndex = token.colIndex;
						const expectedLineIndex = token.lineIndex;
						if (expectedColIndex !== undefined && expectedColIndex !== resultToken.colIndex)
							plogger(`Expected colIndex ${expectedColIndex} but found ${resultToken.colIndex}`);
						if (expectedLineIndex !== undefined && expectedLineIndex !== resultToken.lineIndex)
							plogger(`Expected lineIndex ${expectedLineIndex} but found ${resultToken.lineIndex}`);
					}
				}
			}
		}
	});
};