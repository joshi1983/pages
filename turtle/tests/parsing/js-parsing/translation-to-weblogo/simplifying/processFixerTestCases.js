import { compareTrees } from
'../../../../helpers/parsing/compareTrees.js';
import { parse } from
'../../../../../modules/parsing/js-parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
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
		if (typeof caseInfo.code !== 'string') {
			plogger(`code must be a string.`);
			return;
		}
		if (caseInfo.to === undefined && caseInfo.changed === false)
			caseInfo.to = caseInfo.code;
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