export function createJSPDFTranslationMatrix(Matrix, p) {
	console.log('p = ' + p);
	return new Matrix(
		1, 0,
		0, 1,
		p.getX(), p.getY());
};