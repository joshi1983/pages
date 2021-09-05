import { Variables } from '../../../modules/debugging/debugger/Variables.js';

export function testVariables(logger) {
	const varsMap = new Map();
	const vars = new Variables(varsMap);
	const divs = vars.getDivs();
	if (!(divs instanceof Array))
		logger('getDivs() expected to return an Array but got ' + divs);
	else if (divs.length !== 0)
		logger('getDivs() expected to return an Array with length 0 but got a length of ' + divs.length);

	varsMap.set('x', 5);
	const divs2 = vars.getDivs();
	if (divs2.length !== 1)
		logger('Expected length to be 1 when the variable x is set but got a length of ' + divs2.length);
	else if (!(divs2[0] instanceof Element))
		logger('Expected a div Element but got ' + divs2[0]);

	const varsMap2 = new Map();
	vars.setMap(varsMap2);
	const divs3 = vars.getDivs();
	if (divs3.length !== 0)
		logger('Expected length of 0 but got ' + divs3.length);
};