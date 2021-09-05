import { instructionsDTOToInstructions } from '../../../helpers/instructionsDTOToInstructions.js';
import { getVariableNames } from '../../../../modules/parsing/compiling/instruction-list-optimization/getVariableNames.js';

export function testGetVariableNames(logger) {
	const instructionsDTO = [
		{'name': 'push', 'value': 'x', 'isCloningValue': false},
		{'name': 'push', 'value': 3, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2},
		{'name': 'pop'},
		{'name': 'read-variable', 'variableName': 'x'}
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	const varNames = getVariableNames(instructions, 2);
	if (!(varNames instanceof Array))
		logger(`getVariableNames should return an Array but got ${varNames}`);
	else if (varNames.length !== 1)
		logger(`getVariableNames expected 1 result but got ${varNames.length}`);
	else if (varNames[0] !== 'x')
		logger('getVariableNames expected to return ["x"] but got ' + varNames[0]);
};