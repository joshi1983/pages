import { butFirstAndButLast } from './butFirstAndButLast.js';
import { DataListType } from '../../data-types/DataListType.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { getItemReturnTypes } from './getItemReturnTypes.js';
import { getMixReturnTypes } from './getMixReturnTypes.js';
import { isFiniteNum } from './isFiniteNum.js';

function getMinLen(typesString) {
	if (typesString.indexOf('minlen=') === -1)
		return 0; // we can skip the DataTypes parsing work.

	const dTypes = new DataTypes(typesString);
	let result;
	for (const type of dTypes.types) {
		if (!Number.isInteger(type.minLen))
			return 0;
		else if (result === undefined)
			result = type.minLen;
		else
			result = Math.min(result, type.minLen);
	}
	return result;
}

/*
Each method calculates return types based on parameter types.
*/
const commandGetReturnTypes = {
	'abs': function(parameterTypes) {
		if (parameterTypes === 'int')
			return 'int';
		else if (parameterTypes === 'num(finite)')
			return 'num(finite)';
		else
			return 'num';
	},
	'butFirst': butFirstAndButLast,
	'butLast': butFirstAndButLast,
	'clone': function(types1) {
		return types1;
	},
	'concat': function(val1Types, val2Types) {
		let minLen = getMinLen(val1Types) + getMinLen(val2Types);
		if (val1Types.indexOf('<') !== -1 &&
		val2Types.indexOf('<') !== -1) {
			const types1 = new DataTypes(val1Types);
			const types2 = new DataTypes(val2Types);
			if (types1.types.size === 1 && types1.types.size === 1) {
				const type1 = types1.types.values().next().value;
				const type2 = types2.types.values().next().value;
				const subtypes1 = new DataTypes(type1.subtypes);
				subtypes1.addTypes(new DataTypes(type2.subtypes));
				const listType = new DataListType(subtypes1, minLen);
				return DataTypes.stringify(new Set([listType]));
			}
		}
		if (minLen > 0) {
			return 'list(minlen=' + minLen + ')';
		}
		return 'list';
	},
	'difference': function(num1Types, num2Types) {
		if (num1Types === 'int' && num2Types === 'int')
			return 'int';
		else if (isFiniteNum(num1Types) && isFiniteNum(num2Types))
			return 'num(finite)';
		else
			return 'num';
	},
	'duplicate': function(valueToDuplicateTypes) {
		return `list<${valueToDuplicateTypes}>`;
	},
	'filter': function(cproc, types2) {
		return types2;
	},
	'firsts': function(listOfListsTypes) {
		if (listOfListsTypes.endsWith('>') && listOfListsTypes.startsWith('list<')) {
			const result = listOfListsTypes.substring('list<'.length, listOfListsTypes.length - 1);
			if (result.startsWith('list<'))
				return result;
		}
		return 'list';
	},
	'ifelse': function(conditionTypes, aTypes, bTypes) {
		if (aTypes === bTypes)
			return aTypes;
		aTypes = new DataTypes(aTypes);
		bTypes = new DataTypes(bTypes);
		aTypes.addTypes(bTypes);
		return DataTypes.stringify(aTypes);
	},
	'item': getItemReturnTypes,
	'mix': getMixReturnTypes,
	'power': function(types1, types2) {
		if (types1 === 'int' && types2 === 'int')
			return 'int';
		else
			return 'num';
	},
	'remove': function(thingToRemoveTypes, thingsTypes) {
		if (thingsTypes === 'string' || thingsTypes === 'list')
			return thingsTypes;
		if (thingsTypes.startsWith('list<') && thingsTypes.endsWith('>'))
			return thingsTypes;
		return 'list|string';
	},
	'sort': function(types1) {
		return types1;
	},
	'sublist': function(types1) {
		const minLenIndex = types1.indexOf('minlen=');
		if (minLenIndex !== -1) {
			const index = types1.lastIndexOf('(');
			if (minLenIndex > index)
				return types1.substring(0, index);
		}
		return types1;
	},
	'sum': function() {
		for (let i = 0; i < arguments.length; i++) {
			if (arguments[i] !== 'int')
				return 'num';
		}
		return 'int';
	}
};

commandGetReturnTypes.first = getItemReturnTypes;
commandGetReturnTypes.last = getItemReturnTypes;
commandGetReturnTypes.pick = getItemReturnTypes;

export { commandGetReturnTypes };