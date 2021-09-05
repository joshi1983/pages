import { mergeTokensForAssignmentOperators } from
'./mergeTokensForAssignmentOperators.js';

export function processOperators(scanTokens, migrationData) {
	const operators = migrationData.operators;
	if (operators === undefined)
		return;

	mergeTokensForAssignmentOperators(scanTokens, migrationData.operators);

	const operatorsMap = new Map();
	for (const f of operators) {
		if (f.toSymbol !== undefined)
			operatorsMap.set(f.symbol.toLowerCase(), f.toSymbol);
	}
	for (const scanToken of scanTokens) {
		const s = scanToken.s;
		const newS = operatorsMap.get(s.toLowerCase());
		if (newS !== undefined)
			scanToken.s = newS;
	}
};