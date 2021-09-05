import { instructionsDTOToInstructions } from '../../../helpers/instructionsDTOToInstructions.js';
import { getVariableName } from '../../../../modules/parsing/compiling/instruction-list-optimization/getVariableName.js';

export function testGetVariableName(logger) {
	const instructionsDTO = [
		{'name': 'push', 'value': 'x', 'isCloningValue': false},
		{'name': 'push', 'value': 3, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2},
		{'name': 'pop'},
		{'name': 'read-variable', 'variableName': 'x'}
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	const varName = getVariableName(instructions, 2);
	if (varName !== 'x')
		logger('getVariableName expected to return x but got ' + varName);
};