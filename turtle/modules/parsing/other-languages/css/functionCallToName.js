export function functionCallToName(funcCallToken) {
	const children = funcCallToken.children;
	if (children.length < 1)
		return;
	return children[0].val;
};