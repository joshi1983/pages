const literalClassNames = ['-literal', '-operator', 'comment', 'parameterized-group'];

function isLiteralClassName(name) {
	return literalClassNames.some(lname => name.endsWith(lname));
}

export function getLiteralClassNamesFor(node) {
	return node.className.split(' ').filter(isLiteralClassName);
};

export function isLiteralElement(node) {
	if (!(node instanceof Element))
		return false;
	return getLiteralClassNamesFor(node).length !== 0;
};