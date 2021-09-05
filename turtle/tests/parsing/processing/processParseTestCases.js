import { processParseTestCases as generalProcessParseTestCases } from '../../helpers/parsing/processParseTestCases.js';
import { parse } from '../../../modules/parsing/processing/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

function getMaxDepth(parseTreeToken) {
	if (parseTreeToken.children.length === 0)
		return 1;
	let result = 1;
	parseTreeToken.children.forEach(function(child) {
		result = Math.max(result, 1 + getMaxDepth(child));
	});
	return result;
}

export function wrapSingleTreeInfoObject(obj) {
	return {
		'type': ParseTreeTokenType.TREE_ROOT,
		'val': null,
		'children': [
			obj
		]
	};
};

export function processParseTestCases(cases, logger) {
	generalProcessParseTestCases(cases, parse, ParseTreeTokenType, logger);
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const root = parseResult.root;
		if (caseInfo.maxDepth !== undefined && caseInfo.maxDepth !== getMaxDepth(root))
			plogger(`Expected maxDepth of ${caseInfo.maxDepth} but got ${getMaxDepth(root)}`);
	});
};