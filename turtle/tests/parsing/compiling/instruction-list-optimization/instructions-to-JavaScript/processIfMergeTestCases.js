import { assertEquals } from '../../../../helpers/assertEquals.js';
import { instructionsDTOToInstructions } from '../../../../helpers/instructionsDTOToInstructions.js';
import { JavaScriptInstruction } from '../../../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function processIfMergeTestCases(cases, mergeIfFunction, logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const instructions = instructionsDTOToInstructions(caseInfo.instructionsDTO);
		mergeIfFunction(instructions);
		if (instructions.length !== caseInfo.afterLength)
			plogger(`Expected instructions.length to be ${caseInfo.afterLength} but got ${instructions.length}`);
		else {
			const code = instructions[caseInfo.codeIndex].code;
			assertEquals(caseInfo.expectedCode, code, logger);
		}
	});
};