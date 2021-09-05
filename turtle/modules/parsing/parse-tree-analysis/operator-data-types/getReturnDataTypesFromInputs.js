import { DataTypes } from
'../../data-types/DataTypes.js';
import { isDataTypeContainingUsingKey } from
'../../data-types/isDataTypeContainingUsingKey.js';
import { isFiniteNum } from
'../command-data-types/isFiniteNum.js';
import { isUnfiniteNum } from
'../command-data-types/isUnfiniteNum.js';
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
	
		if (isUnfiniteNum(operandTypes[0]) || isUnfiniteNum(operandTypes[1]))
			return 'num(unfinite)';

		if (isDataTypeContainingUsingKey(operandTypes[1], operandTypes[0]))
			return operandTypes[1];

		if (isDataTypeContainingUsingKey(operandTypes[0], operandTypes[1]))
			return operandTypes[0];

		if (isFiniteNum(operandTypes[0]) && isFiniteNum(operandTypes[1]))
			return 'num(finite)';

		if (operandTypes[1] === 'num(unfinite)')
			return 'num(unfinite)';
		
		return 'num';
	}
	else {
		if (info.symbol === '-') {
			// unary - or a negative sign.
			if (operandTypes[0] === 'int')
				return 'int'; // - of an int is an int.

			if (isFiniteNum(operandTypes[0]))
				return 'num(finite)'; // make sure the min is removed.

			if (isUnfiniteNum(operandTypes[0]))
				return 'num(unfinite)'; // make sure the min is removed.
		}
		operandTypes = intersectWithNum(operandTypes);
	}
	if (operandTypes[0] === '')
		return 'num';
	return operandTypes[0];
};