function getHeading(p1, p2) {
	const deltaX = p2.getX() - p1.getX();
	const deltaY = p2.getY() - p1.getY();
}

function getEndHeading(elements, i) {
	let p1, p2;
	let e1 = elements[i - 1], e2 = elements[i];
	if (!(e2 instanceof Shape))
		p2 = e2;
	else
		p2 = e2.getStartPoint();
	if (!(e1 instanceof Shape))
		p2 = e1;
	else
		p2 = e1.getStartPoint();
}

export function getMiterJoinPointBetweenLines(path, i) {
	const elements = path.elements;
	if (i < 1 || i === elements.length - 1)
		return;
	const maxMiterLength = path.style.getMiterLimit() * path.style.getPenWidth();
	//const fromHeading = ;
};