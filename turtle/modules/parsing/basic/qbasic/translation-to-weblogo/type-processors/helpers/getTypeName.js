export function getTypeName(token) {
	const children = token.children;
	const firstChild = children[0];
	
	return firstChild.val.toLowerCase();
};