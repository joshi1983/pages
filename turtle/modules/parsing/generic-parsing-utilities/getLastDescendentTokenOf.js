
/*
Similar to getSortedLastDescendentTokenOf except does not 
run isAfterOrSame to all tokens in the tree to verify that 
the result is the sorted last.

This will perform faster in most cases but keep in mind that the right-most 
child is not always sorted last.  It can be different if code-fixer mutations 
moved tokens around or assigned different values to lineIndex or colIndex.
*/
export function getLastDescendentTokenOf(token) {
	while (token.children.length !== 0) {
		const children = token.children;
		token = children[children.length - 1];
	}
	return token;
};