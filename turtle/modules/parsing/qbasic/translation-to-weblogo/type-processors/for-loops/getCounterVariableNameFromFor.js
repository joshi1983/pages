export function getCounterInitTokenFromFor(forToken) {
	const toToken = forToken.children[0];// toToken.val could be "to"
	if (toToken === undefined)
		return;
	return toToken.children[0]; // initToken.val could be "="
};

export function getCounterVariableNameFromFor(forToken) {
	const initToken = getCounterInitTokenFromFor(forToken);
	if (initToken === undefined)
		return;
	const varNameToken = initToken.children[0]; // varNameToken.val could be "x"
	if (varNameToken === undefined)
		return;
	return varNameToken.val.toLowerCase();
};