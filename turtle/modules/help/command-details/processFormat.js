const map = new Map([
	['absoluteUrl', 'must be an absolute url'],
	['gradientSpreadMethod', 'must be a valid gradient spread method such as pad, reflect, or repeat'],
	['lineCap', 'must be a valid line cap such as butt, round, or square'],
	['lineJoinStyle', 'must be a valid line join style such as miter, bevel, or round']
]);

export function processFormat(li, format) {
	const s = map.get(format);
	if (s !== undefined) {
		const p = document.createElement('p');
		p.innerText = s;
		li.appendChild(p);
	}
}