export function pythonOperatorToWebLogoOperator(opSymbol) {
	if (opSymbol === '!=')
		return '<>';
	else if (opSymbol === '==')
		return '=';
	else
		return opSymbol;
};