import { SelectionUtils } from '../SelectionUtils.js';

export function isAnyTextSelected(event) {
	const textarea = event.target;
	if (textarea.tagName === 'TEXTAREA') {
		return SelectionUtils.getSelectedText(textarea) !== '';
	}
	return false;
};