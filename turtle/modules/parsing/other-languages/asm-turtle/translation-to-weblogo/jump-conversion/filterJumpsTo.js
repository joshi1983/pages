import { jumpToLabelName } from './jumpToLabelName.js';

export function filterJumpsTo(jumps, label) {
	const labelToMatch = label.val.toLowerCase();
	const result = [];
	for (const jump of jumps) {
		const labelName = jumpToLabelName(jump);
		if (labelToMatch === labelName) {
			result.push(jump);
		}
	}
	return result;
};