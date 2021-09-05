const conditionEndingMap = new Map([
	['je', '= 0'],
	['jg', '> 0'],
	['jl', '< 0'],
	['jne', '<> 0'],
	['jnl', '> 0']
]);

export function jumpNameToComparison(jumpName) {
	return conditionEndingMap.get(jumpName.toLowerCase());
};