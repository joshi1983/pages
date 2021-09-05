const invokeStates = new Set([
193,
880
]);

export function isEndMarker(dtToken) {
	if (dtToken.symbol === undefined ||
	dtToken.symbol.text !== 'ENDMARKER')
		return false;
	return invokeStates.has(dtToken.invokingState);
};