import { DataTypes } from '../../parsing/data-types/DataTypes.js';

const typeToEnglish = {
	'alphacolor': 'alphacolor(semitransparent color)',
	'bool': 'boolean',
	'cproc': 'command or procedure name',
	'int': 'integer',
	'num': 'number',
	'plist': 'property list',
	'string': 'string(text)'
};

export function argumentToEnglish(arg) {
	if (typeof arg === 'object' && arg.types !== undefined) {
		arg = arg.types;
	}
	const pluralSubstring = arg.indexOf('|') === -1 ? '' : 's';
	return ' of type' + pluralSubstring + ' ' + dataTypesToEnglish(arg);
};

export function dataTypesToEnglish(types) {
	if (typeof types !== 'string') {
		types = DataTypes.stringify(types);
	}
	if (types === '*')
		return 'any type';
	types = types.split('|');
	types = types.map(function(type) {
		if (typeToEnglish[type] !== undefined)
			return typeToEnglish[type];
		return type;
	});
	return types.join(', ');
};