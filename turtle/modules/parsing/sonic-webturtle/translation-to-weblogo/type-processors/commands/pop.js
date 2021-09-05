export function pop(token, result, settings) {
	if (token.children.length === 1) {
		const child = token.children[0];
		result.append(`make "${child.val} pop "${settings.stackVariableName}`);
	}
	else {
		result.append(`; Unable to translate call to pop because\n`);
		result.append(`; 1 parameter was expected but ${token.children.length} was found\n`);
	}
};