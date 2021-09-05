function getStartLine(scope) {
	if (scope.declarationToken === undefined)
		return 0;
	return scope.declarationToken.lineIndex;
}

function getStartCol(scope) {
	if (scope.declarationToken === undefined)
		return 0;
	return scope.declarationToken.colIndex;
}

function getLineCount(scope) {
	return scope.toToken.lineIndex - getStartLine(scope);
}

function compareScopes(scope1, scope2) {
	const scope1LineCount = getLineCount(scope1);
	const scope2LineCount = getLineCount(scope2);
	if (scope1LineCount > scope2LineCount)
		return 1;
	else if (scope1LineCount < scope2LineCount)
		return -1;
	const startLine1 = getStartLine(scope1);
	const startLine2 = getStartLine(scope2);
	if (startLine1 > startLine2)
		return -1;
	else if (startLine1 < startLine2)
		return 1;
	const startCol1 = getStartCol(scope1);
	const startCol2 = getStartCol(scope2);
	if (startCol1 > startCol2)
		return -1;
	else if (startCol1 < startCol2)
		return 1;
	return 0;
}

export function getMostNarrowScope(scopes) {
	let result = scopes[0];
	for (let i = 1; i < scopes.length; i++) {
		if (compareScopes(result, scopes[i]) > 0)
			result = scopes[i];
	}
	return result;
};