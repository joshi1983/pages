import { compileOptionsArray } from
'../../../../../parsing/execution/compileOptionsArray.js';
import { createTestTurtle } from
'../../../../../helpers/createTestTurtle.js';
import { LogoProgramExecuter } from
'../../../../../../modules/parsing/execution/LogoProgramExecuter.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { testCodeToProgram } from
'../../../../../helpers/testCodeToProgram.js';
import { translateToWebLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/codeheart-turtlescript/translateToWebLogo.js';

const compileOptions = compileOptionsArray[compileOptionsArray.length - 1];

export function testTranslatedConsoleLogStatementsWithExecution(logger) {
	const cases = [
	{'code': 'setColor(RED)', 'messages': []},
	];
	cases.forEach(function(caseInfo, index) {
		const webLogoCode = translateToWebLogo(caseInfo.code);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}, translated WebLogo code is: ${webLogoCode}`, logger);
		let isAnalyzingCodeQuality = true;
		if (caseInfo.analyzeCodeQuality === false)
			isAnalyzingCodeQuality = false;
		const code = caseInfo.code;
		const program = testCodeToProgram(webLogoCode, plogger, compileOptions, isAnalyzingCodeQuality);
		if (program === undefined) {
			plogger(`Failed to compile a WebLogo program`);
			return;
		}
		const messages = [];
		const turtle = createTestTurtle();
		turtle.print = function(msg) {
			messages.push('' + msg);
		};
		const executer = new LogoProgramExecuter(turtle, program);
		executer.executeInstructionsSync(1000);
		if (caseInfo.messages.length !== messages.length)
			plogger(`Expected ${caseInfo.messages.length} but found ${messages.length}.  Actual messages were ${messages.join(', ')}`);
		else {
			for (let i = 0; i < messages.length; i++) {
				if (messages[i] !== caseInfo.messages[i]) {
					plogger(`messages[${i}] expected to be ${caseInfo.messages[i]} but got ${messages[i]}`);
				}
			}
		}
	});
};