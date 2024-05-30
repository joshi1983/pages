export function getTransposeOfMatrix(m) {
	const height = m.length;
	if (height === 0)
		return [];
	const width = m[0].length;
	const result = [];
	for (let i = 0; i < width; i++) {
		const row = [];
		for (let j = 0; j < height; j++) {
			row.push(m[j][i]);
		}
		result.push(row);
	}
	return result;
};