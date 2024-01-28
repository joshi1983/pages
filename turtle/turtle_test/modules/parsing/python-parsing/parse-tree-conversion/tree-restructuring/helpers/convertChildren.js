export function convertChildren(token, converter) {
	let result = false;
	for (let i = 0; i < token.children.length; i++) {
		if (converter(token.children[i]))
			result = true;
	}
	return result;
};