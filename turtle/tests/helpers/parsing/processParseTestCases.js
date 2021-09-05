import { checkTreeInfo } from './checkTreeInfo.js';
import { prefixWrapper } from '../prefixWrapper.js';

export function wrapSingleTreeInfoObject(obj) {
	return {
		'val': null,
		'children': [
			obj
		]
	};
};

export function processParseTestCases(cases, parse, ParseTreeTokenType, logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code, caseInfo.parseSettings);
		if (typeof parseResult !== 'object' || parseResult === null)
			plogger(`Expected parse result to be an object but got ${parseResult}`);
		else if (!(parseResult.comments instanceof Array))
			plogger(`Expected parseResult.comments to be an Array but got ${parseResult.comments}`);
		else {
			if (caseInfo.numComments !== undefined && parseResult.comments.length !== caseInfo.numComments) {
				plogger(`Expected ${caseInfo.numComments} comments but got ${parseResult.comments.length}`);
			}
			if (caseInfo.treeInfo !== undefined) {
				checkTreeInfo(parseResult.root, caseInfo.treeInfo, plogger, ParseTreeTokenType);
			}
			if (caseInfo.numTopChildren !== undefined && parseResult.root.children.length !== caseInfo.numTopChildren)
				plogger(`Expected ${caseInfo.numTopChildren} top children but got ${parseResult.root.children.length}`);
		}
	});
};