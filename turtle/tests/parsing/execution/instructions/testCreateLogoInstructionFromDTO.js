import { createLogoInstructionFromDTO } from '../../../../modules/parsing/execution/instructions/createLogoInstructionFromDTO.js';
import { LogoInstruction } from '../../../../modules/parsing/execution/instructions/LogoInstruction.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../../modules/parsing/Procedure.js';

export function testCreateLogoInstructionFromDTO(logger) {
	const cases = [
		{'name': 'binary-operator', 'symbol': '+'},
		{'name': 'call-cmd', 'commandName': 'forward', 'numArgs': 1},
		{'name': 'call-proc', 'procName': 'proc1'},
		{'name': 'increment-for-counter'},
		{'name': 'increment-repcount'},
		{'name': 'jump', 'newIndex': 0},
		{'name': 'jump-if-true', 'newIndex': 0},
		{'name': 'output'},
		{'name': 'output-null'},
		{'name': 'pop'},
		{'name': 'pop-for-count'},
		{'name': 'pop-repcount'},
		{'name': 'push', 'value': 5, 'isCloningValue': false},
		{'name': 'push-for-count'},
		{'name': 'push-from-stack', 'numToPush': 2},
		{'name': 'push-max-repcount'},
		{'name': 'read-variable', 'variableName': 'x'},
		{'name': 'unary-operator', 'symbol': '-'},
	];
	const token = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	const proceduresMap = new Map();
	const nameToken = new ParseTreeToken('proc1', null, 0,0, ParseTreeTokenType.LEAF);
	const proc1 = new Procedure('proc1', [], nameToken);
	proceduresMap.set(proc1.name, proc1);
	cases.forEach(function(dto) {
		const instruction = createLogoInstructionFromDTO(dto, token, proceduresMap);
		if (!(instruction instanceof LogoInstruction))
			logger('Expected createLogoInstructionFromDTO to return a LogoInstruction but did not get one');
	});
};