export function validateIndividualTokens(validateToken) {
	if (typeof validateToken !== 'function')
		throw new Error(`validateToken must be a function but got ${validateToken}`);
	return function(tokens, parseLogger) {
		if (!(tokens instanceof Array))
			throw new Error(`tokens must be an Array but got ${tokens}`);
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
			validateToken(token, parseLogger);
		}
	};
};