import { getInnerText } from './getInnerText.js';
import { isLiteralElement } from './isLiteralElement.js';

function processNode(node) {
	if (node !== null &&
		isLiteralElement(node) &&
		getInnerText(node) === '')
		node.parentNode.removeChild(node);
}

export function removeNeighbouringEmptyLiteralElements(node) {
	processNode(node.nextSibling);
	processNode(node.previousSibling);
};