import { getNameFrom } from '../../parsing/parse-tree-analysis/getNameFrom.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function useLastIfDuplicated(root) {
	const assignmentsAndArrows = root.children.filter(t =>
		t.type === ParseTreeTokenType.ASSIGNMENT || t.type === ParseTreeTokenType.ARROW).
		filter(t => getNameFrom(t) !== undefined);
	const tokensToRemove = [];
	const names = new Set();
	for (let i = assignmentsAndArrows.length - 1; i >= 0; i--) {
		const token = assignmentsAndArrows[i];
		const name = getNameFrom(token);
		if (names.has(name))
			tokensToRemove.push(token);
		else
			names.add(name);
	}
	tokensToRemove.forEach(function(tokenToRemove) {
		tokenToRemove.remove();
	});
};