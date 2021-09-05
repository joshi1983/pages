const commandMap = new Map([
	['and', 'and'],
	['%', 'modulo'],
	['**', 'power'],
	['^', 'bitXor'],
	['<<', 'aShift'],
	['>>', 'bitShiftRight'],
	['|', 'bitOr'],
	['&', 'bitAnd'],
	['~', 'bitNot'],
	['//', 'pyIDiv'],
	['in', 'member?'],
	['not in', 'member?'],
	['or', 'or'],
]);
export function getCommandForPythonOperator(operator) {
	return commandMap.get(operator);
};