function processFor(ifToken, result) {
	result.append('for [');
	processToken(forToken.children[0], result);
	result.append('\n] [\n');
}

function processIf(ifToken, result) {
	result.append('if ');
	processToken(ifToken.children[0], result);
}

function processWhile(whileToken, result) {
	result.append('while ');
	processToken(whileToken.children[0], result);
}

const clauseProcessors = new Map([
	[ParseTreeTokenType.FOR, processFor],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.WHILE, processWhile]
]);

function getCentralToken(token) {
	for (const child of token.children) {
		if (child.type !== ParseTreeTokenType.NUMBER_LITERAL &&
		!clauseProcessors.has(child.type))
			return child;
	}
}

function getClauseToken(token) {
	for (const child of token.children) {
		if (clauseProcessors.has(child.type) &&
		child.children.length !== 0)
			return child;
	}
}

export function processLineOfCode(token, result) {
	const clauseToken = getClauseToken(token);
	const centralToken = getCentralToken(token);
	if (clauseToken !== undefined) {
		const clauseProcessor = clauseProcessors.get(clauseToken.type);
		if (clauseProcessor !== undefined) {
			result.append('\n');
			clauseProcessor(clauseToken, result);
		}
	}
	processToken(centralToken, result);
	if (clauseToken !== undefined)
		result.append('\n]\n');
};