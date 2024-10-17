import { checkMessagesEquality } from
'../../../helpers/checkMessagesEquality.js';
import { LogoProgramExecuter } from
'../../../../modules/parsing/execution/LogoProgramExecuter.js';
import { asyncInit, parse } from
'../../../../modules/parsing/python-parsing/parse.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { testCodeToProgram } from
'../../../helpers/testCodeToProgram.js';
import { asyncInit as tokenToWebLogoCodeAsyncInit, tokenToWebLogoCode } from
'../../../../modules/parsing/python-parsing/translation-to-weblogo/tokenToWebLogoCode.js';
import { Turtle } from
'../../../../modules/command-groups/Turtle.js';
import { Vector2DDrawing } from
'../../../../modules/drawing/vector/Vector2DDrawing.js';

const compileOptions = 	{
	'translateToJavaScript': true,
	'mergeJavaScriptInstructions': false,
	'forProduction': true
};
const settings = {
	'animationTime': 0,
	'animationDurationSeconds': 10
};

export async function processPythonExecuterTest(caseInfo, logger) {
	await asyncInit();
	await tokenToWebLogoCodeAsyncInit();
	const plogger = prefixWrapper(`Case ${caseInfo.index}, Python code=${caseInfo.in}`, logger);
	const pythonParseTree = parse(caseInfo.in);
	const weblogoCode = tokenToWebLogoCode(pythonParseTree, [], true);
	if (typeof weblogoCode !== 'string') {
		logger(`Failed to get WebLogo code from python code ${caseInfo.in}`);
		return;
	}
	if (caseInfo.showWebLogoCode === true) {
		console.log('weblogoCode = ', weblogoCode);
	}
	const program = testCodeToProgram(weblogoCode, plogger, compileOptions);
	if (program === undefined) {
		logger(`Failed to get program for weblogoCode: ${weblogoCode}`);
		return;
	}
	const messages = [];
	settings.print = function(s) {
		messages.push(s);
	};
	const drawing = new Vector2DDrawing();
	const turtle = new Turtle(settings, drawing);
	const executer = new LogoProgramExecuter(turtle, program);
	executer.addEventListener('exception', function(e) {
		console.error(e);
		plogger(`Exception thrown: ${e}`);
	});
	executer.executeInstructionsSync(100);
	// 100 should be enough instructions for all test programs to complete.

	checkMessagesEquality(messages, caseInfo.messages, plogger);
};