import { PythonOperators } from '../PythonOperators.js';

const operatorStarts = new Set();
for (const info of PythonOperators.getAll()) {
	const symbol = info.symbol;
	for (let len = 1; len < symbol.length; len++) {
		const s = symbol.substring(0, len);
		operatorStarts.add(s);
	}
}

export function isStartOfOperator(s) {
	return operatorStarts.has(s);
};