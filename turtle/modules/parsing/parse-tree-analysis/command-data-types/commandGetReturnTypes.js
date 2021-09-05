import { butFirstAndButLast } from './butFirstAndButLast.js';
import { DataTypes } from '../../data-types/DataTypes.js';
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
	'ifelse': function(conditionTypes, aTypes, bTypes) {
		if (aTypes === bTypes)
			return aTypes;
		aTypes = new DataTypes(aTypes);
		bTypes = new DataTypes(bTypes);
		aTypes.addTypes(bTypes);
		return DataTypes.stringify(aTypes);
	},
	'item': function(indexTypes, listTypes) {
		if (listTypes === undefined || listTypes === 'list' || listTypes === 'list|string')
			return '*';
		if (listTypes === 'string')
			return 'string';
		const containsString = listTypes.indexOf('string') !== -1;
		const startBracket = listTypes.indexOf('<');
		const endBracket = listTypes.lastIndexOf('>');
		if (startBracket !== -1 && endBracket !== -1) {
			const result1 = listTypes.substring(startBracket + 1, endBracket);
			if (containsString && !result1.endsWith('|string'))
				return result1 + '|string';
			else
				return result1;
		}
		else
			return '*';
	},
	'mix': getMixReturnTypes,
	'power': function(types1, types2) {
		if (types1 === 'int' && types2 === 'int')
			return 'int';
		else
			return 'num';
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

commandGetReturnTypes.first = commandGetReturnTypes.item;
commandGetReturnTypes.last = commandGetReturnTypes.item;
commandGetReturnTypes.pick = commandGetReturnTypes.item;

export { commandGetReturnTypes };