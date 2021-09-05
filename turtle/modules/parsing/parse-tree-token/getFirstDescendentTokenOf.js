export function getFirstDescendentTokenOf(n) {
	while (n.children.length !== 0) {
		n = n.children[0];
	}
	return n;
};