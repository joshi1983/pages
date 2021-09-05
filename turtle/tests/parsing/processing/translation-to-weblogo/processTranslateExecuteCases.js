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
		const webLogoCode = translate(code);
		const div = document.createElement('div');
		div.appendChild(document.createTextNode(`Case ${index}, Processing code=`));
		let codeDiv = document.createElement('div');
		codeDiv.innerText = code;
		div.appendChild(codeDiv);
		div.appendChild(document.createTextNode(`, translated to WebLogo code=`));
		codeDiv = document.createElement('div');
		codeDiv.innerText = webLogoCode;
		div.appendChild(codeDiv);
		const plogger = prefixWrapper(div, logger);
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