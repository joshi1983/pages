export function getValueTokenFromDeclareOrLocal(token) {
	const child = token.children[0];
	if (child.children.length > 1) {
		const valToken = child.children[1];
		return valToken;
	}
};