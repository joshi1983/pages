import { compileOptionsArray } from '../../execution/compileOptionsArray.js';
import { createTestTurtle } from '../../../helpers/createTestTurtle.js';
import { LogoProgramExecuter } from '../../../../modules/parsing/execution/LogoProgramExecuter.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { sonicWebTurtleExamples } from
'../../../helpers/parsing/sonicWebTurtleExamples.js';
import { testCodeToProgram } from '../../../helpers/testCodeToProgram.js';
import { translate } from '../../../../modules/parsing/sonic-webturtle/translation-to-weblogo/translate.js';

const compileOptions = compileOptionsArray[compileOptionsArray.length - 1];

export function testTranslateAllExamples(logger) {
	const cases = [];
	sonicWebTurtleExamples.forEach(function(content) {
		cases.push(content);
	});
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo;
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		const translated = translate(code);
		if (typeof translated !== 'string')
			plogger(`Expected a string from translate but got ${translated}`);
		else {
			const program = testCodeToProgram(translated, plogger, compileOptions, true);
			const turtle = createTestTurtle();
			const executer = new LogoProgramExecuter(turtle, program);
			executer.executeInstructionsSync(2000);
		}
	});
};