import { compareTrees } from '../../helpers/parsing/compareTrees.js';
import { convertObjectToParseTree } from '../../../modules/parsing/serialization/convertObjectToParseTree.js';
import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testConvertObjectToParseTree(logger) {
	const cases = [
		'to p\nend',
		'print :x + x:y'
	];
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo;
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const sourceTree = getCachedParseTreeFromCode(code, plogger).root;
		const clone = convertObjectToParseTree(sourceTree);
		compareTrees(sourceTree, clone, plogger);
	});
};