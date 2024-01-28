import { isExactlyListType } from './isNonColorList.js';

const listTypeNames = new Set([
'alphacolorlist',
'colorlist', 'list',
'list<bool>', 'list<int>', 'list<list>', 'list<num>', 'list<string>']);

export function isListType(type) {
	if (listTypeNames.has(type))
		return true;
	return isExactlyListType(type);
};