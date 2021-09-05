export function translateOperators(tokens, migrationData) {
	if (migrationData.operators !== undefined) {
		const operatorsMap = new Map();
		for (const operatorInfo of migrationData.operators) {
			if (operatorInfo.to !== undefined) {
				operatorsMap.set(operatorInfo.symbol, operatorInfo.to);
			}
		}
		for (const token of tokens) {
			if (operatorsMap.has(token.s))
				token.s = operatorsMap.get(token.s);
		}
	}
};