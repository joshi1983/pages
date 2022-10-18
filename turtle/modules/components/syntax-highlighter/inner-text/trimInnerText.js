import { moveLeadingWhiteSpacesBefore } from './moveLeadingWhiteSpacesBefore.js';
import { moveTrailingWhiteSpacesAfter } from './moveTrailingWhiteSpacesAfter.js';

export function trimInnerText(element) {
	moveLeadingWhiteSpacesBefore(element);
	moveTrailingWhiteSpacesAfter(element);
};