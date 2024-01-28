import { CProcType } from '../../parsing/data-types/CProcType.js';
import { DataTypes } from '../../parsing/data-types/DataTypes.js';
import { simplifyTypes } from './simplifyTypes.js';
import { StringUtils } from '../../StringUtils.js';
await DataTypes.asyncInit();

const typeToEnglish = {
	'alphacolor': 'alphacolor(semitransparent color)',
	'bool': 'boolean',
	'cproc': 'command or procedure name',
	'int': 'integer',
	'list<alphacolor>': 'list of alphacolors(semitransparent colors)',
	'list<alphacolor|transparent>': 'list of elements that are either alphacolor or transparent',
	'list<bool>': 'list of boolean values',
	'list<color>': 'list of colors',
	'list<color|transparent>': 'list of elements that are either color or transparent',
	'list<int>': 'list of integers',
	'list<list>': 'list of lists',
	'list<num>': 'list of numbers',
	'list<plist>': 'list of property lists',
	'list<string>': 'list of strings(text)',
	'num': 'number',
	'plist': 'property list',
	'string': 'string(text)'
};

function isSafeToSimplify(type) {
	return type.startsWith('list<') === -1;
}

export function argumentToEnglish(arg, escapeForHTML) {
	if (typeof arg === 'object' && arg.types !== undefined) {
		arg = arg.types;
	}
	const pluralSubstring = arg.indexOf('|') === -1 ? '' : 's';
	const english = dataTypesToEnglish(arg, escapeForHTML);
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

export function dataTypesToEnglish(types, escapeForHTML) {
	if (typeof types !== 'string') {
		types = DataTypes.stringify(types);
	}
	if (types === '' || types === 'null')
		return 'nothing';
	if (types === '*')
		return 'any type';
	if (escapeForHTML === undefined)
		escapeForHTML = true;
	types = Array.from(DataTypes.parse(types));
	types = types.map(function(type) {
		type = type.toString();
		if (typeToEnglish[type] !== undefined)
			return typeToEnglish[type];
		if (!isSafeToSimplify(type)) {
			if (escapeForHTML)
				return StringUtils.escapeHTML(type); // may contain < and > symbols
			else
				return type;
		}
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