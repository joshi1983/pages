const commandMap = new Map([
	['and', 'and'],
	['%', 'modulo'],
	['**', 'power'],
	['^', 'bitXor'],
	['<<', 'aShift'],
	['|', 'bitOr'],
	['&', 'bitAnd'],
	['//', 'pyIDiv'],
	['in', 'memberp'],
	['not in', 'memberp'],
	['or', 'or'],
]);
export function getCommandForPythonOperator(operator) {
	return commandMap.get(operator);
};