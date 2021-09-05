import { CallStackItems } from '../../../modules/debugging/debugger/CallStackItems.js';
import { fetchText } from '../../../modules/fetchText.js';
import { getTestExecuterForCode } from '../../helpers/getTestExecuterForCode.js';
import { testCodeToProgram } from '../../helpers/testCodeToProgram.js';
import { noop } from '../../../modules/noop.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';
const html = await fetchText('content/debugging/debugger.html');

function testWithoutProcedures(logger) {
	const code = 'make "x 5\nprint :x';
	const executer = getTestExecuterForCode(code, noop);
	const callStackItems = new CallStackItems(executer);
	const container = document.createElement('div');
	let itemDivs = callStackItems.getDivs();
	if (!(itemDivs instanceof Array))
		logger('Expected an Array but got ' + itemDivs);
	else if (itemDivs.length !== 0)
		logger('Expected 0 divs but got ' + itemDivs.length);

	callStackItems.refreshContainer(container);
	executer.setProgram(testCodeToProgram('make "y 10\nprint :y', logger));
	if (callStackItems.itemsMap.size !== 0)
		logger('setProgram should clear itemsMap but found size to be ' + callStackItems.itemsMap.size);
	callStackItems.refreshContainer(container);
}

function testWithAProcedure(logger) {
	const code = 'to testProc :x\nprint :x\nend\ntestProc 5';
	const executer = getTestExecuterForCode(code, noop);
	const callStackItems = new CallStackItems(executer);
	let isFound = false;
	for (let i = 0; i < 1000; i++) {
		executer.executeInstruction();
		const divs = callStackItems.getDivs();
		if (divs.length !== 0) {
			isFound = true;
			if (callStackItems.itemsMap.size !== 1)
				logger('Expected 1 CallStackItem to be in itemsMap but found ' + callStackItems.itemsMap);
			callStackItems.getDivs(); // simulate multiple calls to get the same divs.
			break;
		}
	}
	if (!isFound)
		logger('Expected to call a procedure and find a value but no procedure was called in the first 1000 instructions');
}

export function testCallStackItems(logger) {
	const div = document.createElement('div');
	div.innerHTML = html;
	document.body.appendChild(div);
	wrapAndCall([
		testWithoutProcedures,
		testWithAProcedure
	], logger);
	div.remove();
};