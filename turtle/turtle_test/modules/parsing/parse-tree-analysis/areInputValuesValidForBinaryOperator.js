import { DataTypes } from '../data-types/DataTypes.js';
import { Operators } from '../Operators.js';

export function areInputValuesValidForBinaryOperator(symbol, operand1, operand2) {
	const operatorInfo = Operators.getOperatorInfo(symbol);
	if (operatorInfo === undefined)
		throw new Error(`Unrecognized operator symbol "${symbol}"`);
	if (operand1 === undefined || operand2 === undefined)
		throw new Error('At least one of the operands were undefined so we can not calculate the result');
	const operands = [operand1, operand2];
	for (let index = 0; index < 2; index++) {
		const acceptableTypes = new DataTypes(DataTypes.parse(
			Operators.getParameterTypes(operatorInfo, index)
		));
		acceptableTypes.intersectWithValueCompatability(operands[index]);
		if (acceptableTypes.isEmpty()) {
			return false;
		}
	}
	return true;
};