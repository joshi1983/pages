const nameToEndMarkerMap = new Map([
	['func', 'end'],
	['while', 'wend']
]);
// 'for' is not included because pBasic already does not use {}. 
// 'if' is not included because pBasic has 1-line if-statements only as I type this.

export function processCurlyBrackets(scanTokens) {
	const nameStack = [];
	let name;
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (nameToEndMarkerMap.has(token.s.toLowerCase()))
			name = token.s.toLowerCase();
		else if (token.s === '{') {
			nameStack.push(name);
			scanTokens.splice(i, 1); // remove the token.
			i--;
			name = undefined;
		}
		else if (token.s === '}') {
			const endMarker = nameToEndMarkerMap.get(nameStack.pop());
			if (endMarker !== undefined)
				token.s = endMarker;
		}
	}
};