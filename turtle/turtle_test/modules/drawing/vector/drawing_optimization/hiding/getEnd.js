export function getEnd(element) {
	if (element.getEndPoint !== undefined)
		return element.getEndPoint();
	else
		return element;
};