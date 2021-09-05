
import { compareTrees } from '../compareTrees.js';
import { parse } from '../../../../modules/parsing/basic/qbasic/parse.js';
import { prefixWrapper } from '../../prefixWrapper.js';
import { ParseTreeTokenType as QBasicParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';

/*
processQBasicFixerTestCase is to QBasic code parse trees what
tests/components/code-editor/code-fixer/fixers/processTestCase.js is to
WebLogo code parse trees

This is a separate module to make some of the differences easier to maintain.
*/
export function processQBasicFixerTestCase(caseInfo, fixerFunction, logger) {
	if (Number.isInteger(caseInfo.index))
		logger = prefixWrapper(`Case ${caseInfo.index}`, logger);
	if (typeof caseInfo.code !== 'string')
		throw new Error('code must be specified in caseInfo');
	if (caseInfo.changed === false)
		caseInfo.to = caseInfo.code;
	if (typeof caseInfo.to !== 'string')
		throw new Error(`to must be a string or changed=false.  Instead, changed=${caseInfo.changed} and to=${caseInfo.to}`);

	logger = prefixWrapper(`code=${caseInfo.code}`, logger);
	const parseResult = parse(caseInfo.code);
	const root = parseResult.root;
	fixerFunction(root);
	if (caseInfo.compareTreeSettings !== undefined && caseInfo.doNotCompareTrees !== true) {
		const outTreeResult = parse(caseInfo.to);
		const outTree = outTreeResult.root;
		const compareTreeSettings = {
			'ParseTreeTokenType': QBasicParseTreeTokenType,
			'excludeIndexProperties': true
		};
		compareTrees(root, outTree, logger, compareTreeSettings);
	}

};