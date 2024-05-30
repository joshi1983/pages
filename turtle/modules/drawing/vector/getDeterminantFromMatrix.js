function getLaplaceSubmatrix(m, index) {
	const result = [];
	for (let i = 1; i < m.length; i++) {
		const row = [];
		for (let j = 0; j < m.length; j++) {
			if (j !== index)
				row.push(m[i][j]);
		}
		result.push(row);
	}
	return result;
}

/*
Determinant calculations are documented at
https://en.wikipedia.org/wiki/Determinant
*/
export function getDeterminantFromMatrix(m) {
	if (!(m instanceof Array))
		throw new Error(`m expected to be an Array but got ${m}`);
	if (m.length === 0)
		return 0;
	if (m.length !== m[0].length)
		throw new Error(`m expected to represent a square matrix but ${m.length} !== ${m[0].length}`);
	if (m.length === 1)
		return m[0][0];
	if (m.length > 3) {
		// use Laplace expansion to perform the calculation recursively.
		let result = 0;
		for (let i = 0; i < m.length; i++) {
			const subMatrix = getLaplaceSubmatrix(m, i);
			const val = getDeterminantFromMatrix(subMatrix);
			result += val * m[0][i] * Math.sign(0.5 - (i&1));
		}
		return result;
	}
	let result = 0;
	const len = m.length - 1 + (m.length & 1);
	for (let i = 0; i < len; i++) {
		let val1 = 1, val2 = 1;
		for (let j = 0; j < m.length; j++) {
			const index = (i + j) % m.length;
			val1 *= m[j][index];
			val2 *= m[m.length - 1 - j][index];
		}
		result += val1 - val2;
	}
	return result;
};