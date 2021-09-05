import { convertInstructionsToJavaScript } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/convertInstructionsToJavaScript.js';
import { instructionsDTOToInstructions } from '../../../../helpers/instructionsDTOToInstructions.js';
import { JavaScriptInstruction } from '../../../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { Transparent } from '../../../../../modules/Transparent.js';

export function testConvertInstructionsToJavaScriptForTransparent(logger) {
	const instructionsDTO = [
		{"name":"push", "value": Transparent, 'isCloningValue': false},
		{"name":"call-cmd","commandName": "print", "numArgs": 1},
		{"name":"pop"},
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO, new Map());
	convertInstructionsToJavaScript(instructions, [], false, {});
	if (instructions.length !== 1)
		logger(`Expected 1 instruction but got ${instructions.length}`);
	else if (!(instructions[0] instanceof JavaScriptInstruction))
		logger(`Expected a JavaScriptInstruction but got ${instructions[0]}`);
	else {
		const instruction = instructions[0];
		const expectedContained = 'this.Transparent';
		if (instruction.code.indexOf(expectedContained) === -1)
			logger(`Expected to find ${expectedContained} in the JavaScript but did not in: "${instruction.code}"`);
	}
};