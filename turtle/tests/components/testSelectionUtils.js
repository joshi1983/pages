import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { SelectionUtils } from '../../modules/components/SelectionUtils.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

function testGetCursorPosition(logger) {
	const cases = [
	{
		'val': 'hello', 'selectionIndex': 0,
		'lineIndex': 0, 'colIndex': 0
	},
	{
		'val': 'hello', 'selectionIndex': 1,
		'lineIndex': 0, 'colIndex': 1
	},
	{
		'val': '\nhi', 'selectionIndex': 1,
		'lineIndex': 1, 'colIndex': 0
	},
	{
		'val': '\nhi', 'selectionIndex': 2,
		'lineIndex': 1, 'colIndex': 1
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(
		`Case ${index}, val=${caseInfo.val}, selectionIndex=${caseInfo.selectionIndex}`,
		logger);
		const mockElement = {
			'selectionStart': caseInfo.selectionIndex,
			'value': caseInfo.val
		};
		const result = SelectionUtils.getCursorPosition(mockElement);
		if (typeof result !== 'object')
			plogger(`Expected an object but found ${result}`);
		else {
			if (result.colIndex !== caseInfo.colIndex)
				plogger(`Expected colIndex to be ${caseInfo.colIndex} but found ${result.colIndex}`);
			if (result.lineIndex !== caseInfo.lineIndex)
				plogger(`Expected lineIndex to be ${caseInfo.lineIndex} but found ${result.lineIndex}`);
		}
	});
}

function testSetAndGetSelectionMethods(logger) {
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
}

export function testSelectionUtils(logger) {
	wrapAndCall([
		testGetCursorPosition,
		testSetAndGetSelectionMethods,
	], logger);
};