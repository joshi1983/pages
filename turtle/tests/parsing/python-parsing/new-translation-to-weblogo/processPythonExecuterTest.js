import { checkMessagesEquality } from
'../../../helpers/checkMessagesEquality.js';
import { LogoProgramExecuter } from
'../../../../modules/parsing/execution/LogoProgramExecuter.js';
import { parse } from
'../../../../modules/parsing/python-parsing/parsing/parse.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { simplifyParseTree } from
'../../../../modules/parsing/python-parsing/new-translation-to-weblogo/parse-tree-simplifiers/simplifyParseTree.js';
import { testCodeToProgram } from
'../../../helpers/testCodeToProgram.js';
import { tokenToWebLogoCode } from
'../../../../modules/parsing/python-parsing/new-translation-to-weblogo/tokenToWebLogoCode.js';
import { Turtle } from
'../../../../modules/command-groups/Turtle.js';
import { VectorDrawing } from
'../../../../modules/drawing/vector/VectorDrawing.js';

const compileOptions = 	{
	'translateToJavaScript': true,
	'mergeJavaScriptInstructions': false,
	'forProduction': true
};
const settings = {
	'animationTime': 0,
	'animationDurationSeconds': 10
};

export function processPythonExecuterTest(caseInfo, logger) {
	const plogger = prefixWrapper(`Case ${caseInfo.index}, Python code=${caseInfo.in}`, logger);
	const parseResult = parse(caseInfo.in);
	simplifyParseTree(parseResult.root);
	const weblogoCode = tokenToWebLogoCode(parseResult.root, [], true);
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
	const drawing = new VectorDrawing();
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