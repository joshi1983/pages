import { butFirstAndButLast } from './butFirstAndButLast.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { getItemReturnTypes } from './getItemReturnTypes.js';
import { getMixReturnTypes } from './getMixReturnTypes.js';

/*
Each method calculates return types based on parameter types.
*/
const commandGetReturnTypes = {
	'abs': function(parameterTypes) {
		if (parameterTypes === 'int')
			return 'int';
		else
			return 'num';
	},
	'butFirst': butFirstAndButLast,
	'butLast': butFirstAndButLast,
	'difference': function(num1Types, num2Types) {
		if (num1Types === 'int' && num2Types === 'int')
			return 'int';
		else
			return 'num';
	},
	'duplicate': function(valueToDuplicateTypes) {
		return `list<${valueToDuplicateTypes}>`;
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
	'sublist': function(types1) {
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