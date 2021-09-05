import { DataTypes } from
'../../data-types/DataTypes.js';
import { isExactlyListType } from './isNonColorList.js';

const listTypeNames = new Set([
null, 'alphacolorlist',
'colorlist', 'list',
'list<bool>', 'list<int>', 'list<list>', 'list<num>', 'list<string>']);

export function isListType(type) {
	if (listTypeNames.has(type) ||
	isExactlyListType(type))
		return true;

	if (type.indexOf('list') === -1)
		return false;

	const types = new DataTypes(type);
	for (const singleType of types.types) {
		const typeName = singleType.name;
		if (typeName !== 'list' &&
		typeName !== 'colorlist' &&
		typeName !== 'alphacolorlist')
			return false;
	}

	return true;
};