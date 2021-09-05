import { checkMessagesEquality } from
'../checkMessagesEquality.js';
import { checkShapesEquality } from
'../checkShapesEquality.js';
import { getTestExecuterForCode } from
'../getTestExecuterForCode.js';
import { prefixWrapper } from
'../prefixWrapper.js';
import { VectorDrawing } from
'../../../modules/drawing/vector/VectorDrawing.js';

const compileOptions = 	{
	'translateToJavaScript': true,
	'mergeJavaScriptInstructions': true,
	'forProduction': true
};

export function processTranslateExecuteCases(cases, translate, logger) {
	if (!(cases instanceof Array))
		throw new Error(`cases must be an Array but found ${cases}`);
	if (typeof translate !== 'function')
		throw new Error(`translate must be a function but found ${translate}`);
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function but found ${logger}`);
	cases.forEach(function(caseInfo, index) {
		if (typeof caseInfo.code !== 'string')
			throw new Error(`code must be a string but found ${caseInfo.code}`);

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
		const plogger = prefixWrapper(div, prefixWrapper(`Case ${index}, code=${code}`, logger));
		const settings = {
			'drawing': new VectorDrawing()
		};
		const messages = [];
		settings.print = function(s) {
			messages.push(s);
		};
		const executer = getTestExecuterForCode(webLogoCode, plogger,
			compileOptions, settings, caseInfo.analyzeCodeQuality);
		if (executer === undefined)
			return;
		executer.addEventListener('exception', function(e) {
			console.error(e);
			plogger(`Exception thrown: ${e}`);
		});
		executer.executeInstructionsSync(1000);
		checkMessagesEquality(messages, caseInfo.messages, plogger);
		checkShapesEquality(settings.drawing.getShapesArray(), caseInfo.shapes, plogger);
	});
};