import { getInnerText } from './getInnerText.js';
import { isLiteralElement } from './isLiteralElement.js';
import { processPossibleComment } from './processPossibleComment.js';
import { pullInNeighbouringNonWhitespaces } from './pullInNeighbouringNonWhitespaces.js';
import { scanInnerText } from './scanInnerText.js';

export function processPossibleToken(node, procNameSet) {
	if (procNameSet === undefined)
		procNameSet = new Set();

	if (node.parentNode !== null && isLiteralElement(node) && getInnerText(node) === '') {
		node.parentNode.removeChild(node);
		return;
	}
	pullInNeighbouringNonWhitespaces(node);
	if (node.parentNode !== null) {
		const nodes = scanInnerText(node, procNameSet);
		if (nodes !== undefined) {
			nodes.forEach(function(node) {
				processPossibleComment(node);
			});
		}
	}
};