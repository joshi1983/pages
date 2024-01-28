export function refreshNoShapes(numShapes, shapeRangeDescription, header) {
	if (numShapes === 0) {
		shapeRangeDescription.innerText = 'No shapes to explore.  The drawing is empty.';
		header.classList.add('no-shapes');
	}
	else {
		header.classList.remove('no-shapes');
	}
};