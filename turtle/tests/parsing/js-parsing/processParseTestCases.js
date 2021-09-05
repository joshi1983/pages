import { analyzeQuality } from
'../../../modules/parsing/js-parsing/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { checkTreeInfo } from '../../helpers/parsing/checkTreeInfo.js';
import { parse } from '../../../modules/parsing/js-parsing/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';

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
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const root = parseResult.root;
		if (caseInfo.numTopChildren !== undefined && caseInfo.numTopChildren !== root.children.length)
			plogger(`Expected number of top children to be ${caseInfo.numTopChildren} but got ${root.children.length}. The top token types are ${root.children.map(t => ParseTreeTokenType.getNameFor(t.type)).join(',')}.`);
		if (caseInfo.maxDepth !== undefined && caseInfo.maxDepth !== getMaxDepth(root))
			plogger(`Expected maxDepth of ${caseInfo.maxDepth} but got ${getMaxDepth(root)}`);
		if (caseInfo.treeInfo !== undefined)
			checkTreeInfo(root, caseInfo.treeInfo, plogger, ParseTreeTokenType);
		if (caseInfo.numComments !== undefined && caseInfo.numComments !== parseResult.comments.length)
			plogger(`Expected ${caseInfo.numComments} comments but got ${parseResult.comments.length}`);
		if (caseInfo.ignoreQuality !== true) {
			const parseLogger = new TestParseLogger(plogger, caseInfo.code, false, function(msg) {
				if (typeof caseInfo.ignoreMessagesContaining === 'string' &&
				msg.indexOf(caseInfo.ignoreMessagesContaining) !== -1)
					return false;
				return true;
			});
			analyzeQuality(root, parseLogger);
		}
	});
};