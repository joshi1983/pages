const duplicatesToRemove = new Set([
	':=', ',', ':', ';'
]);
const rightRemovablePairs = new Map([
	[':', [':=']]
]);

for (const key of rightRemovablePairs.keys()) {
	rightRemovablePairs.set(key, new Set(rightRemovablePairs.get(key)));
}

export function removeInvalidatingTokens(tokens) {
	for (let i = 0; i < tokens.length - 1; i++) {
		const token = tokens[i];
		const next = tokens[i + 1];
		if (next.s === token.s && duplicatesToRemove.has(token.s))
			tokens.splice(i + 1, 1);
		else {
			const info = rightRemovablePairs.get(token.s);
			if (info !== undefined && info.has(next.s)) {
				tokens.splice(i, 1);
			}
		}
	}
};