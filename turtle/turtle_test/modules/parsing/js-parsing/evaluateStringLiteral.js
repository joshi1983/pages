/*
We don't use eval to avoid potential JavaScript-injection security problems.
eval(literal) should give the same result unless JavaScript is injected, though.
*/
export function evaluateStringLiteral(literal) {
	const ch = literal.charAt(0);
	if (ch === '"' || ch === '\'') {
		let result = '';
		for (let i = 1; i < literal.length; i++) {
			const ch2 = literal[i];
			if (ch2 === '\\') {
				i++;
				result += literal[i];
			}
			else if (ch2 === ch)
				break;
			else {
				result += ch2;
			}
		}
		return result;
	}
	throw new Error(`string literal expected to be wrapped in quotes but got ${literal}`);
};