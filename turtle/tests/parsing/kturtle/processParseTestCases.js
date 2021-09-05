import { checkTreeInfo } from '../../helpers/parsing/checkTreeInfo.js';
import { parse } from '../../../modules/parsing/kturtle/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/kturtle/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';
import { validateTokensByType } from '../../../modules/parsing/kturtle/parsing/parse-tree-analysis/validation/validateTokensByType.js';

export function processParseTestCases(cases, logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = parse(caseInfo.code);
		if (typeof result !== 'object')
			plogger(`Expected an object but got ${result}`);
		else if (!(result.comments instanceof Array))
			plogger(`Expected result.comments to be an Array but got ${result.comments}`);
		else if (typeof result.root !== 'object')
			plogger(`Expected result.root to be an object but got ${result.root}`);
		else {
			if (Number.isInteger(caseInfo.numTopChildren) && caseInfo.numTopChildren !== result.root.children.length) {
				plogger(`Expected result.root.children.length expected to be ${caseInfo.numTopChildren} but got ${result.root.children.length}`);
			}
			if (caseInfo.treeInfo !== undefined) {
				checkTreeInfo(result.root, caseInfo.treeInfo, plogger, ParseTreeTokenType);
			}
			const parseLogger = new TestParseLogger(plogger, caseInfo.code);
			validateTokensByType(result.root, parseLogger);
		}
	});
};