const regex =  new RegExp(/^[a-zA-Z_]\w*$/, 'u');
const reservedWords = new Set(['async', 'await',
'break', 'continue', 'def',
'False', 'for', 'global', 'if',
'is', 'not', 'pass',
'return', 'True', 'while', 'yield']);

/*
Decides if the specified string is a valid identifier in Python.
In other words, decides if s represents a valid name for a variable, parameter, or class name.
*/
export function isPythonIdentifier(s) {
	if (reservedWords.has(s))
		return false; // reserved words are not valid identifiers.
	const matchResult = s.match(regex);
	if (matchResult === null)
		return false;
	return matchResult[0].length === s.length;
};