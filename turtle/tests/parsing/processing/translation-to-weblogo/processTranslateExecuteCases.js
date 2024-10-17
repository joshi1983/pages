import { checkMessagesEquality } from
'../../../helpers/checkMessagesEquality.js';
import { getTestExecuterForCode } from
'../../../helpers/getTestExecuterForCode.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { translate } from
'../../../../modules/parsing/processing/translation-to-weblogo/translate.js';

const compileOptions = 	{
	'translateToJavaScript': true,
	'mergeJavaScriptInstructions': true,
	'forProduction': true
};

export function processTranslateExecuteCases(cases, logger) {
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo.code;
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		const webLogoCode = translate(code);
		const settings = {};
		const messages = [];
		settings.print = function(s) {
			messages.push(s);
		};
		const executer = getTestExecuterForCode(webLogoCode, plogger, compileOptions, settings);
		if (executer === undefined)
			return;
		executer.addEventListener('exception', function(e) {
			console.error(e);
			plogger(`Exception thrown: ${e}`);
		});
		executer.executeInstructionsSync(1000);
		checkMessagesEquality(messages, caseInfo.messages, plogger);
	});
};