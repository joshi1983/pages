/*
If you want to check for data types that correspond with any list, use isListType instead.

This one looks specifically for DataListType and not colorlist or alphacolorlist.
*/
import { DataTypes } from '../../data-types/DataTypes.js';

const listTypeNames = new Set([
'list',
'list<bool>', 'list<int>', 'list<list>', 'list<num>', 'list<string>']);

export function isExactlyListType(type) {
	if (type === 'list')
		return true;
	if (type === undefined)
		return false;
	if (type.startsWith('list<') && type.endsWith('>')) {
		const types = DataTypes.parse(type);
		return types.size === 1;
	}
	return false;
};

export function isNonColorList(type) {
	/*
	Checking Sets first for performance's sake
	*/
	if (listTypeNames.has(type))
		return true;
	return isExactlyListType(type);
};