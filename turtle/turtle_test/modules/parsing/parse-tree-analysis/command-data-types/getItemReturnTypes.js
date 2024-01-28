export function getItemReturnTypes(indexTypes, listTypes) {
	if (listTypes === undefined || listTypes === 'list' || listTypes === 'list|string')
		return '*';
	if (listTypes === 'string')
		return 'string';
	if (listTypes === 'colorlist' || listTypes === 'alphacolorlist')
		return 'num';
	const containsColorList = listTypes.startsWith('alphacolorlist') || listTypes.startsWith('colorlist');
	const containsString = listTypes.indexOf('string') !== -1;
	const startBracket = listTypes.indexOf('<');
	const endBracket = listTypes.lastIndexOf('>');
	if (startBracket !== -1 && endBracket !== -1) {
		let result1 = listTypes.substring(startBracket + 1, endBracket);
		if (containsColorList && !result1.endsWith('|num'))
			result1 += '|num';
		if (containsString && !result1.endsWith('|string'))
			return result1 + '|string';
		else
			return result1;
	}
	else
		return '*';
};