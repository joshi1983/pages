import { QBasicOperators } from '../QBasicOperators.js';

const trailingValsToRemove = new Set([
	'run'
]);
for (const opInfo of QBasicOperators.getAllOperatorsInfo()) {
	if (opInfo.unary === undefined) {
		trailingValsToRemove.add(opInfo.symbol);
	}
}

export function removeErroneousTrailingTokens(tokens) {
	while (tokens.length !== 0 &&
	trailingValsToRemove.has(tokens[tokens.length - 1].s.toLowerCase()))
		tokens.pop();
};