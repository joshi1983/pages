/*
We want operators like ++ and -- to be adjusted to be parent or child of their
operand tokens.
*/
export function adjustUnaryOperator(Operators, identifierType, token) {
	const operatorInfo = Operators.getOperatorInfo(token.val);
	if (operatorInfo.unary.mayBePrefix !== true)
		return token;
	const previousSibling = token.getPreviousSibling();
	if (previousSibling === null)
		return token;
	if (previousSibling.type === identifierType) {
		token.remove();
		previousSibling.appendChild(token);
		return previousSibling;
	}
	return token;
};