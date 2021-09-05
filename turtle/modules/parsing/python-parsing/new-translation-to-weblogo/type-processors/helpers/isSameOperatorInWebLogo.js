const sameSymbols = new Set(['+', '-', '*', '/', '<>', '>=', '<=', '<', '>']);
export function isSameOperatorInWebLogo(opSymbol) {
	return sameSymbols.has(opSymbol);
};