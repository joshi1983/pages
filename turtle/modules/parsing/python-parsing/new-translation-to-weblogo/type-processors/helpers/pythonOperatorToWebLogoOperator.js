const opSymbolMap = new Map([
	['!=', '<>'],
	['==', '='],
	['is', '=']
]);

export function pythonOperatorToWebLogoOperator(opSymbol) {
	const result = opSymbolMap.get(opSymbol);
	if (result !== undefined)
		return result;
	return opSymbol;
};