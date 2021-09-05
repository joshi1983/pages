import { mergeTokensForAssignmentOperators } from
'./mergeTokensForAssignmentOperators.js';

export function processOperators(scanTokens, migrationData) {
	const operators = migrationData.operators;
	if (operators === undefined)
		return;

	mergeTokensForAssignmentOperators(scanTokens, migrationData.operators);

	const operatorsMap = new Map();
	for (const f of operators) {
		let to;
		if (f.toSymbol !== undefined)
			to = f.toSymbol;
		else if (f.convertToCommand !== undefined && f.unary !== undefined)
			to = f.convertToCommand;
		if (to !== undefined)
			operatorsMap.set(f.symbol.toLowerCase(), to);
	}
	for (const scanToken of scanTokens) {
		const s = scanToken.s;
		const newS = operatorsMap.get(s.toLowerCase());
		if (newS !== undefined)
			scanToken.s = newS;
	}
};