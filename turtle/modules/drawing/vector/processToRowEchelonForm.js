import { isNumber } from '../../isNumber.js';

function compareByNumberOfLeadingZeros(row1, row2) {
	for (let i = 0; i < row1.length; i++) {
		if (row1[i] === 0 && row2[i] !== 0) {
			return 1;
		}
		if (row1[i] !== 0 && row2[i] === 0) {
			return -1;
		}
	}
	return 0;
}

function scaleRow(row, scale) {
	for (let i = 0; i < row.length; i++) {
		row[i] *= scale;
	}
}

function rowSubtract(resultRow, otherRow, scale) {
	if (!isNumber(scale))
		throw new Error(`scale expected to be a number but got ${scale}`);
	if (!(resultRow instanceof Array))
		throw new Error(`Expected resultRow must be an Array but got ${resultRow}`);
	if (!(otherRow instanceof Array))
		throw new Error(`Expected otherRow must be an Array but got ${otherRow}`);
	for (let i = 0; i < resultRow.length; i++) {
		resultRow[i] -= scale * otherRow[i];
	}
}

/*
m is expected to be an Array of Array's.
*/
export function processToRowEchelonForm(m) {
	m.sort(compareByNumberOfLeadingZeros);
	for (let i = 0; i < m.length; i++) {
		const row = m[i];
		let index = i;
		for (;index < row.length;index++) {
			if (row[index] !== 0)
				break;
		}
		if (index === row.length)
			break;
		const val = row[index];
		scaleRow(row, 1/val);
		for (let j = 0; j < m.length; j++) {
			if (j === i)
				continue;
			const jRow = m[j];
			const val = jRow[index];
			if (val !== 0) {
				rowSubtract(jRow, row, val);
			}
		}
	}
};