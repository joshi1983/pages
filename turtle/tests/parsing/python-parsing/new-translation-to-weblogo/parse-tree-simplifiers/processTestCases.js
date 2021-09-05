import { compareTrees } from
'../../../../helpers/parsing/compareTrees.js';
import { parse } from
'../../../../../modules/parsing/python-parsing/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function processTestCases(cases, simplifier, logger) {
	if (typeof simplifier !== 'function')
		throw new Error(`simplifier must be a function but found ${simplifier}`);
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function but found ${logger}`);
	
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		let expected = caseInfo.out;
		if (caseInfo.changed === false)
			expected = caseInfo.code;
		simplifier(parseResult.root);
		const expectedResult = parse(expected);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const settings = {
			'excludeIndexProperties': true,
			'ParseTreeTokenType': ParseTreeTokenType
		};
		compareTrees(parseResult.root, expectedResult.root, plogger, settings);
	});
};