import { findToken } from '../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from
'../../helpers/getCachedParseTreeFromCode.js';
import { getSortedPreviousTokenOf } from
'../../../modules/parsing/generic-parsing-utilities/getSortedPreviousTokenOf.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/ParseTreeTokenType.js';
import { preferNonNullVal } from
'../../../modules/parsing/generic-parsing-utilities/preferNonNullVal.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testGetSortedPreviousTokenOf(logger) {
	const cases = [
	{'code': 'setXY :x :y', 'subcases': [
		{'inToken': {'val': null, 'type': ParseTreeTokenType.TREE_ROOT}, 'outToken': null},
		{'inToken': {'val': 'setXY'}, 'outToken': null},
		{'inToken': {'val': 'x'}, 'outToken': {'val': 'setXY'}},
		{'inToken': {'val': 'y'}, 'outToken': {'val': 'x'}}
	]},
	{'code': 'setXY :x :y :z', 'subcases': [
		{'inToken': {'val': 'setXY'}, 'outToken': null},
		{'inToken': {'val': 'x'}, 'outToken': {'val': 'setXY'}},
		{'inToken': {'val': 'y'}, 'outToken': {'val': 'x'}},
		{'inToken': {'val': 'z'}, 'outToken': {'val': 'y'}}
	]},
	{'code': 'setXY\n:x\n:y', 'subcases': [
		{'inToken': {'val': 'setXY'}, 'outToken': null},
		{'inToken': {'val': 'x'}, 'outToken': {'val': 'setXY'}},
		{'inToken': {'val': 'y'}, 'outToken': {'val': 'x'}},
	]}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const cTree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const allTokens = cTree.getAllTokens();
		caseInfo.subcases.forEach(function(subcaseInfo, sIndex) {
			const slogger = prefixWrapper(`Subcase ${sIndex}`, plogger);
			const inToken = findToken(subcaseInfo.inToken, allTokens, slogger);
			let outToken = null;
			if (subcaseInfo.outToken !== null)
				outToken = findToken(subcaseInfo.outToken, allTokens, slogger);
			const result = getSortedPreviousTokenOf(inToken, preferNonNullVal);
			if (result !== outToken) {
				if (result === null || outToken === null)
					slogger(`Expected ${outToken} but found ${result}`);
				else
					slogger(`Expected ${outToken} but found ${result}.  expected val=${outToken.val} but found val=${result.val}`);
			}
		});
	});
};