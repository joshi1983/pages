export function processOperatorSymbol(operatorInfo) {
	const symbolSpan = document.getElementById('operator-symbol');
	symbolSpan.innerText = operatorInfo.symbol;
};