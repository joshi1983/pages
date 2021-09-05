function isVariableReference(token) {
	return token.s[0] === '$';
}

function isVariableRead(tokens, i) {
	const currentToken = tokens[i];
	const next = tokens[i + 1];
	if (next === undefined || next.s !== '=')
		return true;
	const prev = tokens[i - 1];
	if (prev === undefined || prev.lineIndex !== currentToken.lineIndex)
		return false;
	return true;
}

function isInProcedure(tokens, i) {
	for (i --; i >= 0; i--) {
		const token = tokens[i];
		if (token.s.toLowerCase() === 'to')
			return true;
		else if (token.s.toLowerCase() === 'end')
			return false;
	}
	return false;
}

function isInQuestionCall(tokens, i) {
	const commandNameToken = tokens[i - 2];
	if (commandNameToken === undefined)
		return false;
	const commandName = commandNameToken.s.toLowerCase();
	return commandName === 'vraag';
}

function getMakeCommandNameFor(tokens, i) {
	return isInProcedure(tokens, i) ? 'localmake' : 'make';
}

function processQuestionCall(tokens, i) {
	tokens[i - 1].s = ':' + tokens[i].s.substring(1);
	tokens[i - 2].s = getMakeCommandNameFor(tokens, i);
	tokens[i].s = '"newValue';
}

export function processVariableReferences(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (isVariableReference(token)) {
			if (isInQuestionCall(tokens, i)) {
				processQuestionCall(tokens, i);
			}
			else if (isVariableRead(tokens, i))
				token.s = ':' + token.s.substring(1);
			else {
				const next = tokens[i + 1]; // next was a '=' token that must be replaced.
				next.s = '"' + token.s.substring(1);
				token.s = getMakeCommandNameFor(tokens, i);
			}
		}
	}
};