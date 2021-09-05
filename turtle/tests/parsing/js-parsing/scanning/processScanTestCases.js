import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

const keys = ['colIndex', 'lineIndex', 's'];

export function processScanTestCases(cases, scan, logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code = ${caseInfo.code}`, logger);
		const result = scan(caseInfo.code);
		if (!(result instanceof Array))
			plogger(`result expected to be an Array but got ${result}`);
		else if (result.length !== caseInfo.len)
			plogger(`Expected length of ${caseInfo.len} but got ${result.length}, token strings were ${result.map(t => t.s).join(', ')}`);
		else if (caseInfo.tokens instanceof Array) {
			for (let i = 0; i < caseInfo.tokens.length; i++) {
				const tokenInfo = caseInfo.tokens[i];
				const token = result[i];
				keys.forEach(function(key) {
					if (tokenInfo[key] !== undefined && token[key] !== tokenInfo[key])
						plogger(`Expected ${key} for token ${i} to be ${tokenInfo[key]} but got ${token[key]}`);
				});
			}
		}
	});
}