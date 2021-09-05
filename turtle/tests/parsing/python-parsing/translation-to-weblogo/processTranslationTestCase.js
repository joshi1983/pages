import { getSingleLineCommentsFromCode } from '../../../../modules/parsing/python-parsing/parse-tree-conversion/getSingleLineCommentsFromCode.js';
import { getStringComparisonDetails } from '../../../helpers/getStringComparisonDetails.js';
import { asyncInit, parse } from '../../../../modules/parsing/python-parsing/parse.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { asyncInit as tokenToWebLogoCodeAsyncInit, tokenToWebLogoCode } from '../../../../modules/parsing/python-parsing/translation-to-weblogo/tokenToWebLogoCode.js';

export async function processTranslationTestCase(caseInfo, logger) {
	if (typeof caseInfo.in !== 'string')
		throw new Error(`caseInfo.in must be a string.  Not: ${caseInfo.in}`);
	await asyncInit();
	await tokenToWebLogoCodeAsyncInit();
	const plogger = prefixWrapper(`Case ${caseInfo.index}, Python code=${caseInfo.in}`, logger);
	const tree = parse(caseInfo.in);
	if (tree === undefined) {
		plogger('Expected to get a parse tree but got undefined');
		return;
	}
	try {
		const comments = getSingleLineCommentsFromCode(caseInfo.in);
		const out = tokenToWebLogoCode(tree, comments, false);
		if (caseInfo.outStartsWith !== undefined) {
			if (!out.startsWith(caseInfo.outStartsWith))
				plogger(`Expected start is ${caseInfo.outStartsWith} but got ${out.substring(0, caseInfo.outStartsWith.length)}`);
		}
		else if (out !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${out}.  Comparison details: ${getStringComparisonDetails(caseInfo.out, out)}`);
	}
	catch (e) {
		plogger(`JavaScript exception thrown: ${e}`);
		throw e;
	}
};