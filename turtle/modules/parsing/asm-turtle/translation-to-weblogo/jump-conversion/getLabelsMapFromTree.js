import { getDescendentsOfType } from '../../../generic-parsing-utilities/getDescendentsOfType.js';
import { jumpToLabelName } from './jumpToLabelName.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function getLabelsMapFromTree(root, jumps) {
	const labels = getDescendentsOfType(root, ParseTreeTokenType.LABEL_ANCHOR);
	const jumpToLabelValues = new Set(jumps.map(jumpToLabelName));
	const result = new Map();
	for (const label of labels) {
		if (jumpToLabelValues.has(label.val.toLowerCase())) {
			result.set(label.val.toLowerCase(), label);
		}
	}
	return result;
};