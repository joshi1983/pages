const invokingStates = new Set([193,880]);

export function isEndMarker(dtToken) {
	if (dtToken.symbol === undefined ||
	dtToken.symbol.text !== 'ENDMARKER')
		return false;
	return invokingStates.has(dtToken.invokingState);
};