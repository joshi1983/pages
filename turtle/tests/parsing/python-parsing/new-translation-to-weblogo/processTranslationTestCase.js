import { assertEquals } from '../../../helpers/assertEquals.js';
import { formatCode } from '../../../../modules/components/code-editor/format/formatCode.js';
import { parse } from '../../../../modules/parsing/python-parsing/parsing/parse.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { tokenToWebLogoCode } from '../../../../modules/parsing/python-parsing/new-translation-to-weblogo/tokenToWebLogoCode.js';

export function processTranslationTestCase(caseInfo, logger) {
	if (typeof caseInfo.in !== 'string')
		throw new Error(`caseInfo.in must be a string.  Not: ${caseInfo.in}`);
	const plogger = prefixWrapper(`Case ${caseInfo.index}, Python code=${caseInfo.in}`, logger);
	const parseResult = parse(caseInfo.in);
	if (parseResult.root === undefined) {
		plogger('Expected to get a parse tree but got a root of undefined');
		return;
	}
	try {
		const out = formatCode(tokenToWebLogoCode(parseResult.root, parseResult.comments, false));
		if (caseInfo.outStartsWith !== undefined) {
			if (!out.startsWith(caseInfo.outStartsWith))
				plogger(`Expected start is ${caseInfo.outStartsWith} but got ${out.substring(0, caseInfo.outStartsWith.length)}`);
		}
		else if (caseInfo.outContains !== undefined) {
			if (!out.indexOf(caseInfo.outContains) === -1)
				plogger(`Expected to find ${caseInfo.outContains} but got ${out}`);
		}
		else {
			assertEquals(caseInfo.out, out, plogger);
		}
	}
	catch (e) {
		plogger(`JavaScript exception thrown: ${e}`);
		throw e;
	}
};