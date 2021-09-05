import { createRootToken } from
'../../../helpers/createRootToken.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { UnaryOperatorInstruction } from
'../../../../modules/parsing/execution/instructions/UnaryOperatorInstruction.js';

export function testUnaryOperatorInstruction(logger) {
	const cases = [
		{'symbol': '-'}
	];
	const token = createRootToken();
	cases.forEach(function(dto, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const instruction = UnaryOperatorInstruction.createFromDTO(dto, token);
		if (!(instruction instanceof UnaryOperatorInstruction))
			plogger(`Expected an instance of UnaryOperatorInstruction but instruction = ${instruction}`);
		else {
			if (instruction.operatorSymbol !== dto.symbol)
				plogger(`Expected operatorSymbol to be ${dto.symbol} but found ${instruction.operatorSymbol}`);
		}
	});
};