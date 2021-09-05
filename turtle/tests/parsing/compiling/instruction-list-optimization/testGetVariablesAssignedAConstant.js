import { instructionsDTOToInstructions } from '../../../helpers/instructionsDTOToInstructions.js';
import { getVariablesAssignedAConstant } from '../../../../modules/parsing/compiling/instruction-list-optimization/getVariablesAssignedAConstant.js';

export function testGetVariablesAssignedAConstant(logger) {
	const instructionsDTO = [
		{'name': 'push', 'value': 'x', 'isCloningValue': false},
		{'name': 'push', 'value': 2, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2},
		{'name': 'pop'},
		{'name': 'push', 'value': 'y', 'isCloningValue': false},
		{'name': 'push', 'value': 4, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2},
		{'name': 'pop'},
		{'name': 'push', 'value': 'm', 'isCloningValue': false},
		{'name': 'push', 'value': 41, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2},
		{'name': 'pop'},
		{'name': 'push', 'value': 'm', 'isCloningValue': false},
		{'name': 'read-variable', 'variableName': 'fdfgd'}, // this should cause m to get excluded as a constant.
		{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2},
		{'name': 'pop'},
		{'name': 'push', 'value': 'z', 'isCloningValue': false},
		{'name': 'push', 'value': 5, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2}, 
		// make should not be recognized as something that makes constants since they could be global variables
		// with values that change from the commander.
		{'name': 'pop'},
		{'name': 'push', 'value': 't', 'isCloningValue': false},
		{'name': 'read-variable', 'variableName': 'xyz'},
		{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2},
		{'name': 'pop'},
		{'name': 'push', 'value': 15, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'forward', 'numArgs': 2},
		{'name': 'pop'},
		// Logo code: localmake "propertylistvariable plistCreate
		{'name': 'push', 'value': 'propertylistvariable', 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'plistCreate', 'numArgs': 0},
		{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2},
		{'name': 'pop'},
		// setProperty modifies the value of 'propertylistvariable' so it should not be considered constant.
		// Logo code: setProperty "propertylistvariable "x 5
		{'name': 'push', 'value': 'propertylistvariable', 'isCloningValue': false},
		{'name': 'push', 'value': 'x', 'isCloningValue': false},
		{'name': 'push', 'value': 5, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'setProperty', 'numArgs': 3},
		{'name': 'pop'},

	];
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	const constNames = getVariablesAssignedAConstant(instructions);
	if (constNames.length !== 2)
		logger('Expected 2 constant names but got ' + constNames.length + '. They are: ' + JSON.stringify(constNames));
	else {
		if (constNames.indexOf('x') === -1)
			logger('Expected to find x in constant names.  The actual result is: ' + JSON.stringify(constNames));
		if (constNames.indexOf('y') === -1)
			logger('Expected to find y in constant names.  The actual result is: ' + JSON.stringify(constNames));
	}
};