export function getCounterVariableNameFromFor(forToken) {
	const toToken = forToken.children[0];// toToken.val could be "to"
	const initToken = toToken.children[0]; // initToken.val could be "="
	const varNameToken = initToken.children[0]; // varNameToken.val could be "x"
	return varNameToken.val.toLowerCase();
};