export function shouldTranslateToNothing(token) {
	const children = token.children;
	if (children.length < 2)
		return true;

	return false;
};