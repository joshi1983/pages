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
	{'code': '', 'messages': []},
	{'code': 'setColor(RED)', 'messages': []},
	{'code': 'console.log("hi")', 'messages': ['hi']},
	{'code': 'for (let i = 0; i === 0; i++) {console.log("hi")}', 'messages': ['hi']},
	{'code': 'for (let i = 0; 0 === i; i++) {console.log("hi")}', 'messages': ['hi']},
	{'code': 'for (let i = 0; i !== 2; i++) {console.log("hi")}', 'messages': ['hi', 'hi']},
	{'code': 'for (let i = 0; 2 !== i; i++) {console.log("hi")}', 'messages': ['hi', 'hi']},
	{'code': 'for (let i = 0; i < 1; i+=0.5) {console.log("hi")}', 'messages': ['hi', 'hi']},
	{'code': 'for (let i = 0; 2 > i; i++) {console.log("hi")}', 'messages': ['hi', 'hi']},
	{'code': 'for (let i = 0; i < 2; i++) {console.log("hi")}', 'messages': ['hi', 'hi']},
	{'code': 'for (let i = 0; i < 2; i++) {console.log(i)}', 'messages': ['0', '1']},
	{'code': 'for (let i = 0; i <= 2; i++) {console.log("hi")}', 'messages': ['hi', 'hi', 'hi']},
	{'code': 'for (let i = 0; i <= 2; i++) {console.log(i)}', 'messages': ['0', '1', '2']},
	{'code': 'for (let i = 0; 2 >= i; i++) {console.log("hi")}', 'messages': ['hi', 'hi', 'hi']},
	{'code': 'for (let i = 2; i >= 0; i--) {console.log("hi")}', 'messages': ['hi', 'hi', 'hi']},
	{'code': 'for (let i = 2; i >= 0; i--) {console.log(i)}', 'messages': ['2', '1', '0']},
	{'code': 'for (let i = 2; 0 <= i; i--) {console.log("hi")}', 'messages': ['hi', 'hi', 'hi']},
	{'code': 'for (let i = 2; i > 0; i--) {console.log("hi")}', 'messages': ['hi', 'hi']},
	{'code': 'for (let i = 2; 0 < i; i--) {console.log("hi")}', 'messages': ['hi', 'hi']},
	{'code': 'for (let i = 2; i < 10; i+=2) {console.log(i)}', 'messages': ['2', '4', '6', '8']},
	{'code': 'for (let i = 2; i < 10; i*=2) {console.log(i)}', 'messages': ['2', '4', '8']},
	{'code': 'for (let i = 8; i > 1; i/=2) {console.log(i)}', 'messages': ['8', '4', '2']},
	{'code': 'repeat (1) {console.log("hi")}', 'messages': ['hi']},
	{'code': 'repeat (2) {console.log("hi")}', 'messages': ['hi', 'hi']},
	{'code': 'x=0; while (x < 2) {console.log(x); x++}', 'messages': ['0', '1']},
	{'code': 'x=0; do {console.log(x); x++} while (x < 2);', 'messages': ['0', '1']},
	{'code': 'switch (console.log("hi")) {}', 'messages': ['hi']},
	{'code': 'switch (1) {case 1: console.log("hi");}', 'messages': ['hi'], 'analyzeCodeQuality': false},
	{'code': 'switch (1) {case 2: console.log("hi");}', 'messages': [], 'analyzeCodeQuality': false},
	{'code': 'if (1 < 2) {console.log("hi")}', 'messages': ['hi'], 'analyzeCodeQuality': false},
	{'code': 'if (2 < 1) {console.log("hi")}', 'messages': [], 'analyzeCodeQuality': false},
	{'code': 'if (2 < 1) {console.log("hi")} else {console.log("bye")}', 'messages': ['bye'], 'analyzeCodeQuality': false},
	{'code': 'if (1 < 2) {console.log("hi")} else {console.log("bye")}', 'messages': ['hi'], 'analyzeCodeQuality': false},
	{'code': 'if (2 < 1) {console.log("hi")} else if (1 < 2) {console.log("bye")}', 'messages': ['bye'], 'analyzeCodeQuality': false},
	{'code': 'if (2 < 1) {console.log("hi")} else if (2 < 1) {console.log("bye")}', 'messages': [], 'analyzeCodeQuality': false},
	{'code': 'if (2 < 1) {console.log("hi")} else if (2 < 1) {console.log("bye")} else {console.log("else")}', 'messages': ['else'], 'analyzeCodeQuality': false},

	//{'code': 'if (2 < 1) {} else if (2 < 1) {} else if (1 < 2) {console.log("so");} else {console.log("so")}', 'messages': ['yo'], 'analyzeCodeQuality': false},
	//{'code': 'if (2 < 1) {} else if (2 < 1) {} else if (2 < 1) {} else {console.log("yo")}', 'messages': ['yo'], 'analyzeCodeQuality': false},
	// FIXME: it would be nice to reactivate these tests and fix them eventually.
	// if-else statements with that many parts are rare enough to not handle properly for now, though.
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