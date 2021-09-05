export function dec(token, result, settings) {
	if (token.children.length === 1) {
		const child = token.children[0];
		result.append(`make "${child.val} :${child.val} - 1`);
	}
	else {
		result.append(`;FIXME: unable to translate dec instruction because 1 operand was expected but found ${token.children.length}`);
	}
};