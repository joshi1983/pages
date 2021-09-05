export function hasElseOrElif(token) {
	return token.children.length > 3;
};