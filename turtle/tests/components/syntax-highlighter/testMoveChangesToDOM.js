import { moveChangesToDOM } from '../../../modules/components/syntax-highlighter/moveChangesToDOM.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testMoveChangesToDOM(logger) {
	const cases = [
		{'code': '', 'oldCode': '', 'result': ''},
		{'code': '', 'oldCode': 'h', 'result': ''},
		{'code': 'h', 'oldCode': '', 'result': 'h'},
		{'code': '', 'oldCode': 'hello', 'result': ''},
		{'code': 'hello', 'oldCode': '', 'result': 'hello'},
		{'code': 'hello', 'oldCode': 'hello world', 'result': 'hello'},
		{'code': 'hello world', 'oldCode': 'hello', 'result': 'hello world'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, oldCode=${caseInfo.oldCode}`, logger);
		const e = document.createElement('pre');
		e.innerText = caseInfo.oldCode;
		moveChangesToDOM(caseInfo.code, e);
		const result = e.innerText;
		if (result !== caseInfo.code)
			plogger(`Expected ${caseInfo.code} but got ${result}`);
	});
};