export function filterBrackets(tokens) {
	return tokens.filter(t =>
		!t.isBracket());
};