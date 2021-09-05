export function processScanTokenOperators(tokens, migrationInfo) {
	const operators = migrationInfo.operators;
	if (operators === undefined || operators.length === 0)
		return; // nothing to do.

	const fromToMap = new Map();
	for (const operator of operators) {
		if (operator.to !== undefined) {
			if (operator.to !== operator.symbol)
				fromToMap.set(operator.symbol, operator.to);
		}
	}
	if (fromToMap.size === 0)
		return; // nothing more to do.

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const toS = fromToMap.get(token.s);
		if (toS !== undefined) {
			token.s = toS;
		}
	}
};