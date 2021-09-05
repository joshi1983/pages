import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { scan } from
'../../../../../modules/parsing/basic/qbasic/scanning/scan.js';

export function processSanitizeTokensTestCases(cases, sanitize, logger) {
	if (typeof sanitize !== 'function')
		throw new Error(`sanitize must be a function but found ${sanitize}`);
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tokens = scan(caseInfo.code);
		sanitize(tokens);
		if (tokens.length !== caseInfo.tokens.length) {
			plogger(`Expected ${caseInfo.tokens.length} tokens but found ${tokens.length}.  The found token s values are: ${tokens.map(t => t.s).join(', ')}`);
			return;
		}
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
			const eTokenInfo = caseInfo.tokens[i];
			const expectedS = typeof eTokenInfo === 'object' ? eTokenInfo.s : eTokenInfo;
			const tlogger = prefixWrapper(`Token ${i}`, plogger);
			if (token.s !== expectedS)
				tlogger(`expected to have s='${expectedS}' but found '${token.s}'`);
			if (Number.isInteger(eTokenInfo.colIndex) &&
			eTokenInfo.colIndex !== token.colIndex)
				tlogger(`Expected colIndex ${eTokenInfo.colIndex} but found ${token.colIndex}`);
			if (Number.isInteger(eTokenInfo.lineIndex) &&
			eTokenInfo.lineIndex !== token.lineIndex)
				tlogger(`Expected lineIndex ${eTokenInfo.lineIndex} but found ${token.lineIndex}`);
		}
	});
};