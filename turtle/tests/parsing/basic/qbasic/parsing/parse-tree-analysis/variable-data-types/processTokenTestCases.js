import { flatten } from
'../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parseRootToOptionsMock } from
'../../../translation-to-weblogo/parseRootToOptionsMock.js';
import { ParseTreeTokenType } from
'../../../../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { parse } from
'../../../../../../../modules/parsing/basic/qbasic/parse.js';
import { prefixWrapper } from
'../../../../../../helpers/prefixWrapper.js';

function tokenToString(token) {
	return `(type: ${ParseTreeTokenType.getNameFor(token.type)}, val: ${token.val} )`;
}

function tokensToString(tokens) {
	return tokens.map(tokenToString).join(', ');
}

export function processTokenTestCases(cases, testFunction, logger) {
	if (typeof testFunction !== 'function')
		throw new Error(`testFunction must be a function but found ${testFunction}`);
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const options = parseRootToOptionsMock(parseResult.root);
		const tokens = flatten(parseResult.root);
		const filtered = tokens.filter(function(token) {
			return testFunction(token, options);
		});
		const expectedCount = caseInfo.count;
		if (expectedCount !== filtered.length) {
			plogger(`Expected count of ${expectedCount} but found ${filtered.length}. The tokens found were ${tokensToString(filtered)}`);
		}
	});
};