export function hasElse(token) {
	return token.children.some(child => child.val === 'else');
};