const commandMap = new Map([
	['and', 'and'],
	['%', 'modulo'],
	['**', 'power'],
	['^', 'bitXor'],
	['<<', 'aShift'],
	['|', 'bitOr'],
	['&', 'bitAnd'],
	['//', 'pyIDiv'],
	['in', 'member?'],
	['not in', 'member?'],
	['or', 'or'],
]);
export function getCommandForPythonOperator(operator) {
	return commandMap.get(operator);
};