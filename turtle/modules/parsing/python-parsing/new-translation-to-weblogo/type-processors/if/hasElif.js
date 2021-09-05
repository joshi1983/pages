export function hasElif(token) {
	return token.children.some(child => child.val === 'elif');
};