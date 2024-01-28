export function getValueForCurvedBracketExpression(token, tokenValueMap) {
	const nonBrackets = token.children.filter(t => !t.isBracket());
	if (nonBrackets.length === 1 && tokenValueMap.has(nonBrackets[0]))
		return tokenValueMap.get(nonBrackets[0]);
};