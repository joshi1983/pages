import { getClosest } from './getClosest.js';
import { getInnerText } from './getInnerText.js';
import { processHyperlinks } from '../processHyperlinks.js';

export function processPossibleComment(node) {
	const nearestCommentElement = getClosest(node, '.comment');
	if (nearestCommentElement !== null) {
		nearestCommentElement.innerHTML = processHyperlinks(getInnerText(nearestCommentElement));
	}
}