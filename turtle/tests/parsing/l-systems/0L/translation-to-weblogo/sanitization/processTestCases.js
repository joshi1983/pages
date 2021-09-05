import { parse } from
'../../../../../../modules/parsing/l-systems/0L/parse.js';
import { stringifyZeroLCode } from
'../../../../../../modules/parsing/l-systems/0L/stringifyZeroLCode.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function wrappedFunc(sanitizeFunc) {
	return function(zeroLCode) {
		const parseResult = parse(zeroLCode);
		sanitizeFunc(parseResult.root);
		return stringifyZeroLCode(parseResult.root);
	};
}

export function processTestCases(cases, sanitizeFunc, logger) {
	testInOutPairs(cases, wrappedFunc(sanitizeFunc), logger);
};