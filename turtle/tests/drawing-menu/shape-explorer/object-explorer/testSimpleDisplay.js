import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { SimpleDisplay } from '../../../../modules/drawing-menu/shape-explorer/object-explorer/SimpleDisplay.js';

export function testSimpleDisplay(logger) {
	const cases = [
		{'val': 'Hello', 'findtext': 'Hello'},
		{'val': true, 'findtext': 'true'},
		{'val': false, 'findtext': 'false'},
		{'val': 0, 'findtext': '0'},
		{'val': 5, 'findtext': '5'},
		{'val': 5.12, 'findtext': '5.12'},
		{'val': -5.12, 'findtext': '-5.12'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const display = new SimpleDisplay(caseInfo.val);
		const div = display.toDiv();
		if (!(div instanceof Element)) {
			plogger(`Expected an Element but got ${div}`);
		}
		else if (div.innerText.indexOf(caseInfo.findtext) === -1) {
			plogger(`Expected to find ${caseInfo.findtext} in innerText "${div.innerText}"`);
		}
	});
};