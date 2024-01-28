const listOfIntTypes = new Set([
'alphacolorlist', 'colorlist',
'list<int>', 'list<num>'
]);

export function isListOfStrictlyIntOrListOfNumber(types) {
	return listOfIntTypes.has(types);
};