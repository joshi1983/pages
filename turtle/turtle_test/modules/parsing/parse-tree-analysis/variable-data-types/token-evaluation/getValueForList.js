export function getValueForList(token, tokenValueMap) {
	const nonBrackets = token.children.filter(t => !t.isBracket());
	const childValues = [];
	for (let i = 0; i < nonBrackets.length; i++) {
		const child = nonBrackets[i];
		if (tokenValueMap.has(child))
			childValues.push(tokenValueMap.get(child));
		else
			break;
	}
	if (childValues.length === nonBrackets.length)
		return childValues;
};