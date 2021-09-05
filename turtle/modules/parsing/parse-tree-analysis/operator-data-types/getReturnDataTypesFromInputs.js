import { DataTypes } from
'../../data-types/DataTypes.js';
import { isDataTypeContainingUsingKey } from
'../../data-types/isDataTypeContainingUsingKey.js';
import { Operators } from
'../../Operators.js';

await DataTypes.asyncInit();
const numType = new DataTypes('num');

function intersectWithNum(operandTypes) {
	return operandTypes.map(function(typeString) {
		const types = new DataTypes(typeString);
		types.intersectWith(numType);
		return DataTypes.stringify(types);
	});
}

export function getReturnDataTypesFromInputs(operatorSymbol, operandTypes) {
	const info = Operators.getOperatorInfo(operatorSymbol);
	if (info.returnTypes === 'bool')
		return info.returnTypes;
	if (operandTypes.length === 2) {
		if (operatorSymbol === '/')
			return 'num';

		operandTypes = intersectWithNum(operandTypes);
		if (operandTypes[0] === operandTypes[1])
			return operandTypes[0];

		if (isDataTypeContainingUsingKey(operandTypes[1], operandTypes[0]))
			return operandTypes[1];

		if (operandTypes[1] === 'num(unfinite)')
			return 'num(unfinite)';
	}
	else
		operandTypes = intersectWithNum(operandTypes);
	if (operandTypes[0] === '')
		return 'num';
	return operandTypes[0];
};