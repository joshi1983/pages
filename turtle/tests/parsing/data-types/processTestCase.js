import { Token } from '../../../modules/parsing/Token.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';

export function processTestCase(caseInfo, logger, dataType) {
	const token = new Token(caseInfo.s, 0, 0);
	const parseToken = ParseTreeToken.createFromScannedToken(token, new Set());
	const actualCompatibility = dataType.mayBeCompatibleWith(parseToken);
	if (caseInfo.isCompatible !== actualCompatibility)
		logger(dataType.name + ' type expected compatiblity with ' + caseInfo.s + ' to be ' +
			caseInfo.isCompatible + ' but got ' + actualCompatibility);
};