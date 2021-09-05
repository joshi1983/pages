import { BinaryOperatorInstruction } from
'../../../../modules/parsing/execution/instructions/BinaryOperatorInstruction.js';
import { createRootToken } from
'../../../helpers/createRootToken.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';

export function testBinaryOperatorInstruction(logger) {
	const cases = [
		{'symbol': '-'},
		{'symbol': '+'},
		{'symbol': '*'},
		{'symbol': '/'},
		{'symbol': '>'},
		{'symbol': '<'},
		{'symbol': '>='},
		{'symbol': '<='},
		{'symbol': '='},
		{'symbol': '<>'}
	];
	const token = createRootToken();
	cases.forEach(function(dto, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const instruction = BinaryOperatorInstruction.createFromDTO(dto, token);
		if (!(instruction instanceof BinaryOperatorInstruction))
			plogger(`Expected an instance of BinaryOperatorInstruction but instruction = ${instruction}`);
		else {
			if (instruction.operatorSymbol !== dto.symbol)
				plogger(`Expected operatorSymbol to be ${dto.symbol} but found ${instruction.operatorSymbol}`);
		}
	});
};