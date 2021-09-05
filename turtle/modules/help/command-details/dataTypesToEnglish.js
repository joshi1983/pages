import { CProcType } from '../../parsing/data-types/CProcType.js';
import { DataTypes } from '../../parsing/data-types/DataTypes.js';
import { simplifyTypes } from './simplifyTypes.js';

const typeToEnglish = {
	'alphacolor': 'alphacolor(semitransparent color)',
	'bool': 'boolean',
	'cproc': 'command or procedure name',
	'int': 'integer',
	'list<alphacolor>': 'list of alphacolors(semitransparent colors)',
	'list<bool>': 'list of boolean values',
	'list<color>': 'list of colors',
	'list<int>': 'list of integers',
	'list<list>': 'list of lists',
	'list<num>': 'list of numbers',
	'list<plist>': 'list of property lists',
	'list<string>': 'list of strings(text)',
	'num': 'number',
	'plist': 'property list',
	'string': 'string(text)'
};

export function argumentToEnglish(arg) {
	if (typeof arg === 'object' && arg.types !== undefined) {
		arg = arg.types;
	}
	const pluralSubstring = arg.indexOf('|') === -1 ? '' : 's';
	const english = dataTypesToEnglish(arg);
	if (english === 'any type')
		return ' of any type';
	return ' of type' + pluralSubstring + ' ' + english;
};

function cprocTypeToString(cprocName) {
	const type = CProcType.parseName(cprocName);
	if (type.numArgs === undefined)
		return typeToEnglish.cproc;
	else {
		return `${typeToEnglish.cproc} with ${type.numArgs} parameter${type.numArgs === 1 ? '' : 's'}`;
	}
}

export function dataTypesToEnglish(types) {
	if (typeof types !== 'string') {
		types = DataTypes.stringify(types);
	}
	if (types === '')
		return 'nothing';
	if (types === '*')
		return 'any type';
	types = types.split('|');
	types = types.map(function(type) {
		if (typeToEnglish[type] !== undefined)
			return typeToEnglish[type];
		type = simplifyTypes(type);
		if (typeToEnglish[type] !== undefined)
			return typeToEnglish[type];
		if (type.startsWith('cproc')) {
			return cprocTypeToString(type);
		}
		return type;
	});
	return types.join(', ');
};