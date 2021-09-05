export function getStart(element) {
	if (element.getStartPoint !== undefined)
		return element.getStartPoint();
	else
		return element;
};