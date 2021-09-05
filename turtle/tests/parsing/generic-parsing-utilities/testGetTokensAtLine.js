import { findToken } from '../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { getTokensAtLine } from '../../../modules/parsing/generic-parsing-utilities/getTokensAtLine.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testGetTokensAtLine(logger) {
	const cases = [
	{'code': 'setXY :x :y', 'subcases': [
		{'token': {'val': 'x'}, 'len': 4},
		{'token': {'val': 'y'}, 'len': 4},
		{'token': {'val': 'setXY'}, 'len': 4}
	]}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const cTree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const allTokens = cTree.getAllTokens();
		caseInfo.subcases.forEach(function(subcaseInfo, sIndex) {
			const slogger = prefixWrapper(`Subcase ${sIndex}`, plogger);
			const token = findToken(subcaseInfo.token, allTokens, slogger);
			const result = getTokensAtLine(token, token.lineIndex);
			if (subcaseInfo.len !== result.length)
				slogger(`Expected ${subcaseInfo.len} tokens but got ${result.length}`);
		});
	});
};