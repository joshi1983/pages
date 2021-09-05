function getClosestContextIdentifierToken(variableNameLiteralToken) {
	const argList = variableNameLiteralToken.parentNode;
	const funcCall = argList.parentNode;
	return funcCall;
}

export function getVariableReadRootToken(variableNameLiteralToken) {
	return getClosestContextIdentifierToken(variableNameLiteralToken);
};