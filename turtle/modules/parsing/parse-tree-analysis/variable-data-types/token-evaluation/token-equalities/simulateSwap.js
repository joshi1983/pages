export function simulateSwap(swapToken, result, executionState) {
	const children = swapToken.children;
	if (children.length === 2 &&
	children.every(t => t.isStringLiteral())) {
		const [varName1, varName2] = children.map(t => t.val.toLowerCase());
		executionState.swapVariables(varName1, varName2);
	}
	return true;
};