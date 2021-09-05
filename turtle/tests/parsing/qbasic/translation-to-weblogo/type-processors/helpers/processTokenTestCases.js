import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../../modules/parsing/qbasic/parse.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function processTokenTestCases(cases, testFunction, logger) {
	if (typeof testFunction !== 'function')
		throw new Error(`testFunction must be a function but found ${testFunction}`);
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		const filtered = tokens.filter(testFunction);
		const expectedCount = caseInfo.count;
		if (expectedCount !== filtered.length) {
			plogger(`Expected count of ${expectedCount} but found ${filtered.length}`);
		}
	});
};