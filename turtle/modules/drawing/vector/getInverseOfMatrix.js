import { processToRowEchelonForm } from './processToRowEchelonForm.js';

export function getInverseOfMatrix(m) {
	if (!(m instanceof Array))
		throw new Error(`Array expected but found ${m}`);
	if (m.length === 0)
		return [];
	if (m.length !== m[0].length)
		throw new Error(`For a matrix to be invertible, it must be square but ${m.length} does not equal ${m[0].length}`);
	const result = [];
	for (let i = 0; i < m.length; i++) {
		const readRow = m[i];
		if (!(readRow instanceof Array))
			throw new Error(`Every row in matrix must be an Array but found something else at index ${i}`);
		if (readRow.length !== m.length)
			throw new Error(`Every row must be the same length but ${readRow.length} is not the same as ${m.length}`);
		const row = [];
		for (let j = 0; j < readRow.length; j++) {
			row.push(readRow[j]);
		}
		// augment the identity matrix row.
		for (let j = 0; j < i; j++) {
			row.push(0);
		}
		row.push(1);
		for (let j = i + 1; j < m.length; j++) {
			row.push(0);
		}
		result.push(row);
	}
	// perform row reduction.
	processToRowEchelonForm(result);

	for (let i = 0; i < m.length; i++) {
		result[i].splice(0, m.length);
	}
	return result;
};