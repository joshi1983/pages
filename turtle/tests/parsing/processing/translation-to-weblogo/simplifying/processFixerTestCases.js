import { compareTrees } from
'../../../../helpers/parsing/compareTrees.js';
import { parse } from
'../../../../../modules/parsing/processing/parse.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/processing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function processFixerTestCases(cases, fixerFunction, logger) {
	if (!(cases instanceof Array))
		throw new Error(`cases must be an Array but got ${cases}`);
	if (typeof fixerFunction !== 'function')
		throw new Error(`fixerFunction must be a function but got ${fixerFunction}`);
	if (typeof logger !== 'function') {
		console.error(`logger = `, logger);
		throw new Error(`logger must be a function but got ${logger}`);
	}
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const root = parseResult.root;
		fixerFunction(root);
		const outTree = parse(caseInfo.to).root;
		const compareTreeSettings = {
			'ParseTreeTokenType': ParseTreeTokenType,
			'excludeIndexProperties': true
		};
		compareTrees(root, outTree, plogger, compareTreeSettings);
	});
};