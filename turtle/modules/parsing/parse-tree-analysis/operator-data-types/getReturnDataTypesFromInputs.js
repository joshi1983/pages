import { DataTypes } from
'../../data-types/DataTypes.js';
import { hasMaxValue } from
'../command-data-types/hasMaxValue.js';
import { hasMinValue } from
'../command-data-types/hasMinValue.js';
import { isDataTypeContainingUsingKey } from
'../../data-types/isDataTypeContainingUsingKey.js';
import { isFiniteNum } from
'../command-data-types/isFiniteNum.js';
import { isUnfiniteNum } from
'../command-data-types/isUnfiniteNum.js';
import { NumberType } from
'../../data-types/NumberType.js';
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

function getNumberType(s) {
	const type = Array.from(new DataTypes(s).types).filter(t => t.name === 'num')[0];
	return type;
}

export function getReturnDataTypesFromInputs(operatorSymbol, operandTypes) {
	const info = Operators.getOperatorInfo(operatorSymbol);
	if (info.returnTypes === 'bool')
		return info.returnTypes;

	if (operandTypes.length === 2) {
		operandTypes = intersectWithNum(operandTypes);
		if (operatorSymbol === '/') {
			if (operandTypes[1] === 'num(finite,max=0,min=0)') {
				return 'num(unfinite)';
				// dividing by 0 never gives a finite result.
			}
			return 'num';
		}

		if (isUnfiniteNum(operandTypes[0]) || isUnfiniteNum(operandTypes[1]))
			return 'num(unfinite)';

		if ((operatorSymbol === '+' || operatorSymbol === '-' || operatorSymbol === '*') &&
		operandTypes.filter(ot => hasMinValue(ot) || hasMaxValue(ot)).length === 2) {
			const type0 = getNumberType(operandTypes[0]);
			const type1 = getNumberType(operandTypes[1]);
			let max, min;
			if (operatorSymbol === '+') {
				max = type0.max + type1.max;
				min = type0.min + type1.min;
			}
			else if (operatorSymbol === '-') {
				max = type0.max - type1.min;
				min = type0.min - type1.max;
			}
			else {
				max = -Infinity;
				min = Infinity;
				for (const v1 of [type0.max, type0.min]) {
					for (const v2 of [type1.max, type1.min]) {
						const v = v1 * v2;
						if (isNaN(v)) {
							max = Infinity;
							min = -Infinity;
							break;
						}
						else {
							max = Math.max(max, v);
							min = Math.min(min, v);
						}
						
					}
				}
			}
			return new NumberType(type0.isFiniteOnly && type1.isFiniteOnly,
				type0.isUnfiniteOnly && type1.isUnfiniteOnly,
				min, max).toString();
		}

		if (operandTypes[0] === operandTypes[1])
			return operandTypes[0];

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
		const types = operandTypes[0];
		if (info.symbol === '-') {
			// unary - or a negative sign.
			if (types === 'int')
				return 'int'; // - of an int is an int.

			if (hasMinValue(types) && hasMaxValue(types)) {
				const types1 = new DataTypes(types);
				for (const type of types1.types) {
					if (type.name === 'num') {
						return new NumberType(type.isFiniteOnly, type.isUnfiniteOnly,
							-type.max, -type.min).toString();
					}
				}
			}

			if (isFiniteNum(types))
				return 'num(finite)'; // make sure the min is removed.

			if (isUnfiniteNum(types))
				return 'num(unfinite)'; // make sure the min is removed.
		}
		operandTypes = intersectWithNum(operandTypes);
	}
	if (operandTypes[0] === '')
		return 'num';
	return operandTypes[0];
};