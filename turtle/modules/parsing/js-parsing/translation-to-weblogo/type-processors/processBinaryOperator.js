const valToCommandsMap = new Map([
	['&&', 'and'],
	['&', 'bitAnd'],
	['|', 'bitOr'],
	['%', 'modulo'],
	['||', 'or'],
	['^', 'bitXor'],
	['**', 'power'],
]);
const jsOperatorToWebLogo = new Map([
	['===', '='],
	['==', '='],
	['!=', '<>'],
	['!==', '<>'],
]);

function processChildren(processToken, tokens, result) {
	for (let i = 0; i < tokens.length; i++) {
		const child = tokens[i];
		processToken(child, result);
		result.append(' ');
	}
}

function jsOperatorToWebLogoFunction(symbol) {
	const result = jsOperatorToWebLogo.get(symbol);
	if (result !== undefined)
		return result;
	return symbol;
}

export function processBinaryOperator(processToken) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken must be a function but got ${processToken}`);
	return function(token, result) {
		const commandName = valToCommandsMap.get(token.val);
		const children = token.children;
		if (commandName !== undefined) {
			result.append(`${commandName} `);
			processChildren(processToken, children, result);
		}
		else if (children.length === 2) {
			// normal case with most operators common between 
			// JavaScript and WebLogo such as *,+,-,/...
			const first = children[0];
			const last = children[1];
			processToken(first, result);
			result.append(' ');
			result.append(jsOperatorToWebLogoFunction(token.val));
			result.append(' ');
			processToken(last, result);
		}
		else {
			// rare case where the parse tree is in an invalid state.
			// The parsing of input code failed possibly due to a syntax error.
			// We still want to translate as well as possible to help a human fix the 
			// rest of the problem manually.
			result.append('(');
			if (children.length !== 0)
				processToken(children[0], result);
			result.append(token.val);
			processChildren(processToken, children.slice(1), result);
			result.append(')');
		}
	};
};