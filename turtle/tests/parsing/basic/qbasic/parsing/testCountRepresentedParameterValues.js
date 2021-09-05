import { countRepresentedParameterValues } from
'../../../../../modules/parsing/basic/qbasic/parsing/countRepresentedParameterValues.js';
import { findToken } from
'../../../../helpers/findToken.js';
import { flatten } from
'../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { QBasicInternalFunctions } from
'../../../../../modules/parsing/basic/qbasic/QBasicInternalFunctions.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

function wrappedCountRepresentedParameterValues(logger) {
	return function(caseInfo, index) {
		let tokenInfo = caseInfo.token;
		if (tokenInfo === undefined)
			tokenInfo = {};
		tokenInfo.type = ParseTreeTokenType.ARG_LIST;
		tokenInfo.hasParentType = ParseTreeTokenType.FUNCTION_CALL;
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const token = findToken(tokenInfo, tokens, plogger);
		if (token !== undefined) {
			const func = token.parentNode;
			const nameToken = func.children[0];
			if (nameToken.type !== ParseTreeTokenType.IDENTIFIER) {
				plogger(`Expected name token to have type IDENTIFIER but found ${ParseTreeTokenType.getNameFor(nameToken.type)}`);
			}
			else {
				const info = QBasicInternalFunctions.getFunctionInfo(nameToken.val);
				if (info === undefined) {
					plogger(`Expected to find function info but could not find it for ${nameToken.val}`);
				}
				return countRepresentedParameterValues(token.children, info);
			}
		}
	};
}

export function testCountRepresentedParameterValues(logger) {
	const cases = [
		{'in': {'code': 'print "hi"'}, 'out': 1},
		{'in': {'code': 'print'}, 'out': 0},
		{'in': {'code': 'locate ,2'}, 'out': 2},
		{'in': {'code': 'locate ,,2'}, 'out': 3},
		{'in': {'code': 'locate ,,,2'}, 'out': 4}
	];
	testInOutPairs(cases, wrappedCountRepresentedParameterValues(logger), logger);
};