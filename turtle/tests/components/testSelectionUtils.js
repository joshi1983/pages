import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { SelectionUtils } from '../../modules/components/SelectionUtils.js';

export function testSelectionUtils(logger) {
	const cases = [
		{'val': '', 'start': 1, 'end': 1, 'selected': ''},
		{'val': 'Hello World', 'start': 1, 'end': 6, 'selected': 'ello '},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const input = document.createElement('input');
		input.value = caseInfo.val;
		SelectionUtils.setSelectionRange(input, caseInfo.start, caseInfo.end);
		const selected = SelectionUtils.getSelectedText(input);
		if (selected !== caseInfo.selected)
			plogger(`Expected "${caseInfo.selected}" but got "${selected}"`);
	});
};