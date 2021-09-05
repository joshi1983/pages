const emptyNames = new Set([
	'active', 'before', 'first-child', 'last-child'
]);

export function doesPseudoClassExpectParameters(pseudoClassName) {
	if (pseudoClassName[0] === ':')
		pseudoClassName = pseudoClassName.substring(1);
	if (emptyNames.has(pseudoClassName))
		return false;
	return true;
}