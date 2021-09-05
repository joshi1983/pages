import { assertEquals } from
'../../../helpers/assertEquals.js';
import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { getDescendentsOfType } from
'../../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { parse } from
'../../../../modules/parsing/js-parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { parseTreeToCodeWithComments } from
'../../../../modules/parsing/js-parsing/parseTreeToCodeWithComments.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { processExecuterTestCase } from
'../../execution/processExecuterTestCase.js';
import { translateWebLogoToJS } from
'../../../../modules/parsing/compiling/to-js/translateWebLogoToJS.js';
import { valueToString } from
'../../../../modules/valueToString.js';

function isConsoleLog(token) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	if (token.val !== 'console' ||
	token.children.length !== 1)
		return false;
	const child = token.children[0];
	if (child.type !== ParseTreeTokenType.DOT ||
	child.children.length !== 1)
		return false;

	const grandchild = child.children[0];
	if (grandchild.type !== ParseTreeTokenType.IDENTIFIER ||
	grandchild.val !== 'log' ||
	grandchild.children.length !== 0)
		return false;

	return true;
}

function replaceConsoleLogWithPrint(s) {
	const parseResult = parse(s);
	const consoleLogs = getDescendentsOfType(parseResult.root, ParseTreeTokenType.IDENTIFIER).
		filter(isConsoleLog);
	consoleLogs.forEach(function(call) {
		call.val = 'print';
		call.removeAllChildren();
	});
	return parseTreeToCodeWithComments(parseResult.root, parseResult.comments);
}

export async function processExecuteTests(cases, logger) {
	for (let i = 0; i < cases.length; i++) {
		const caseInfo = cases[i];
		const plogger = prefixWrapper(`Case code=${caseInfo.code}, ${i}`, logger);
		try {
			processExecuterTestCase(caseInfo, i, plogger);
				// Running the WebLogo execution tests helps us make sure the expected outputs are consistent
				// accross the to-js translator and various compilation options.
		} catch (e) {
			console.error(e);
			plogger(`Exception or error thrown while trying to execute the code with various compilation options. e=${exceptionToString(e)}`);
			continue;
		}
		const options = {
			'toModule': true
		};
		const translated = 'let print;\nexport function setPrintFunction(f) { print = f; };\n' +
			replaceConsoleLogWithPrint(translateWebLogoToJS(caseInfo.code, options));
		try {
			const dataUrl = 'data:text/javascript;base64,' + btoa(translated);
			const module = await import(dataUrl);
			const messages = [];

			function print(s) {
				messages.push(valueToString(s));
			}
			module.setPrintFunction(print);
			module.run();
			if (caseInfo.messages.length !== messages.length)
				plogger(`Expected length of ${caseInfo.messages.length} but found a length of ${messages.length}`);
			else {
				for (let i = 0; i < caseInfo.messages.length; i++) {
					assertEquals(caseInfo.messages[i], messages[i], prefixWrapper(`i=${i}`, plogger));
				}
			}
		}
		catch (e) {
			console.error(e);
			plogger(`Exception or error caught while running translated module. e=${exceptionToString(e)}, translated=${translated}`);
		}
	}
};