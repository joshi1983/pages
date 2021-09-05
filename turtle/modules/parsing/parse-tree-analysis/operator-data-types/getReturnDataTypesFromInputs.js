import { DataTypes } from
'../../data-types/DataTypes.js';
import { getSingleType } from
'../command-data-types/getSingleType.js';
import { hasMaxValue } from
'../command-data-types/hasMaxValue.js';
import { hasMinValue } from
'../command-data-types/hasMinValue.js';
import { IntegerType } from
'../../data-types/IntegerType.js';
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

function processMinMax(type0, type1, operatorSymbol) {
	let max, min;
	if (typeof type0 !== 'object' || typeof type1 !== 'object')
		return [Infinity, -Infinity];

	if (operatorSymbol === '+') {
		max = type0.max + type1.max;
		min = type0.min + type1.min;
	}
	else if (operatorSymbol === '-') {
		max = type0.max - type1.min;
		min = type0.min - type1.max;
	}
	else {
		if (operatorSymbol === '*') {
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
		else {
			max = Infinity;
			min = -Infinity;
		}
		if ((operatorSymbol === '*' || operatorSymbol === '/') &&
		min === -Infinity && max === Infinity) {
			if (((type0.min >= 0) && (type1.min >= 0)) ||
			(type0.max <= 0 && type1.max <= 0))
				min = 0;
				// multiply or divide 2 negatives and you get a positive.
				// multiply or divide 2 negatives and you get a positive.
				// We're including 0's so the result can also be 0.
			else if ((type0.max <= 0 && type1.min >= 0) ||
			(type1.max <= 0 && type0.min >= 0)) {
				max = 0;
				// multiply or divide mixed signs and you get a negative.
				// We're including 0's so the result can also be 0.
			}
		}
	}
	return [max, min];
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
			if (isFiniteNum(operandTypes[0]) && isUnfiniteNum(operandTypes[1]))
				return 'int(max=0,min=0)';
				// Dividing a finite number by an unfinite(-Infinity or Infinity) returns 0.
		}

		if (isUnfiniteNum(operandTypes[0]) || isUnfiniteNum(operandTypes[1]))
			return 'num(unfinite)';

		if (['+', '-', '*', '/'].indexOf(operatorSymbol) !== -1 &&
		operandTypes.filter(ot => hasMinValue(ot) || hasMaxValue(ot)).length === 2) {
			let type0 = getNumberType(operandTypes[0]);
			let type1 = getNumberType(operandTypes[1]);
			if (type0 === undefined || type1 === undefined) {
				if (operandTypes[0].indexOf('|') === -1 &&
				operandTypes[1].indexOf('|') === -1) {
					type0 = getSingleType(operandTypes[0]);
					type1 = getSingleType(operandTypes[1]);
					if (type0 !== undefined && type1 !== undefined) {
						let min, max;
						if (type0.name === 'int' && type1.name === 'int' &&
						operatorSymbol !== '/') {
							if (operandTypes[0].indexOf('|') === -1 &&
							operandTypes[1].indexOf('|') === -1) {
								[max, min] = processMinMax(type0, type1, operatorSymbol);
								return new IntegerType(max, min).toString();
							}
							return 'int';
						}
						else {
							[max, min] = processMinMax(type0, type1, operatorSymbol);
							return new NumberType(false, false,
								min, max).toString();
						}
					}
				}
				return 'num';
			}
			let max, min;
			[max, min] = processMinMax(type0, type1, operatorSymbol);
			return new NumberType(type0.isFiniteOnly && type1.isFiniteOnly,
				type0.isUnfiniteOnly && type1.isUnfiniteOnly,
				min, max).toString();
		}
		if (operatorSymbol === '/')
			return 'num';

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
			if (types === 'int' ||
			types === 'num' || types === 'num(finite)' ||
			types === 'num(unfinite)')
				return types; // - of an int is an int.

			if (hasMinValue(types) && hasMaxValue(types)) {
				const types1 = new DataTypes(types);
				const parts = [];
				for (const type of types1.types) {
					if (type.name === 'int') {
						parts.push(new IntegerType(-type.max, -type.min).toString());
					}
					else if (type.name === 'num') {
						parts.push(new NumberType(type.isFiniteOnly, type.isUnfiniteOnly,
							-type.max, -type.min).toString());
					}
				}
				return parts.join('|');
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