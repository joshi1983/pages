export function pathToJSPDFLines(pdfDrawer, path, p) {
	const result = [];
	const elements = path.elements;
	for (let i = 1; i < elements.length; i++) {
		const e1 = pdfDrawer.transformPoint(elements[i]);
		const e2 = e1.minus(p);
		result.push([e2.getX(), e2.getY()]);
		p = e1;
	}
	return result;
};