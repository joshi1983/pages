import { DataTypes } from '../../parsing/data-types/DataTypes.js';
import { simplifyTypes } from './simplifyTypes.js';
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

function cprocTypeToString(cprocType) {
	if (cprocType.numArgs === undefined)
		return typeToEnglish.cproc;
	else {
		return `${typeToEnglish.cproc} with ${cprocType.numArgs} parameter${cprocType.numArgs === 1 ? '' : 's'}`;
	}
}

function listToString(list, escapeForHTML) {
	let minLenPart = '';
	if (list.minLen > 0)
		minLenPart = `at least ${list.minLen} `;

	let subtypesPart = '';
	if (list.subtypes !== undefined) {
		subtypesPart = dataTypesToEnglish(list.subtypes, escapeForHTML).trim();
		if (!subtypesPart.endsWith('s'))
			subtypesPart += 's';
	}
	let ofPart = '';
	if (list.minLen > 0 || list.subtypes !== undefined)
		ofPart = ' of ';
	return `list${ofPart}${minLenPart}${subtypesPart}`;
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
		let typeStr = type.toString();
		if (typeToEnglish[typeStr] !== undefined)
			return typeToEnglish[typeStr];
		if (type.name === 'list')
			return listToString(type, escapeForHTML);
		if (type.name === 'cproc')
			return cprocTypeToString(type);
		typeStr = simplifyTypes(typeStr);
		if (typeToEnglish[typeStr] !== undefined)
			return typeToEnglish[typeStr];
		return type;
	});
	return types.join(', ');
};