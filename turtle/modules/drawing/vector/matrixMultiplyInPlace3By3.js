/*
Assumes both matrixes are 3 by 3.
*/
export function matrixMultiplyInPlace3By3(m1, m2) {
	const result = [];
	for (let i = 0; i < 3; i++) {
		const row = [];
		for (let j = 0; j < 3; j++) {
			let val = 0;
			for (let k = 0; k < 3; k++) {
				val += m1[i][k] * m2[k][j];
			}
			row.push(val);
		}
		result.push(row);
	}
	for (let i = 0; i < 3; i++) {
		m1[i] = result[i];
	}
};