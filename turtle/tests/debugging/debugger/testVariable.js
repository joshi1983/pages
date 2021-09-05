import { Variable } from '../../../modules/debugging/debugger/Variable.js';

export function testVariable(logger) {
	let result = 1;
	function getValue() {
		return result;
	}
	const testVar = new Variable('x', getValue);
	let e = testVar.getDiv();
	if (!(e instanceof Element))
		logger('getDiv() must return an Element instead of ' + e);
	if (e.textContent.toLowerCase().indexOf('x') === -1)
		logger('x expected to be in textContent but not found in: "' + (e.textContent) + '"');
	if (e.textContent.indexOf('1') === -1)
		logger('1 expected to be in textContent but not found in: "' + (e.textContent) + '"');

	result = 2;
	e = testVar.getDiv();
	if (e.textContent.indexOf('2') === -1)
		logger('2 expected to be in textContent but not found in: "' + (e.textContent) + '"');
};