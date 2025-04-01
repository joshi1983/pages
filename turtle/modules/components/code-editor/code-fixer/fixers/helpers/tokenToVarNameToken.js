export function tokenToVarNameToken(token, commandInfo) {
	if (commandInfo.primaryName === 'make' ||
	commandInfo.primaryName === 'localmake') {
		if (token.children.length > 0 &&
		token.children[0].isStringLiteral())
			return token.children[0];
	}
	for (let i = 0; i < commandInfo.args.length; i++) {
		const argInfo = commandInfo.args[i];
		if (argInfo.refTypes !== undefined) {
			const child = token.children[i];
			if (child === undefined || typeof child.val !== 'string')
				return;
			return child;
		}
	}
};