import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

/*
In JOSS, demand prompts end users for numbers and assigns the numbers to a list of variables.
For example, Demand x,y.
WebLogo has no equivalent.

The best translation seems to be assigning 0 to the variables.
*/
export function testExecDemand(logger) {
	const cases = [
		{'code': `Demand x.
Type x`, 'messages': ['0']},
		{'code': `Demand x,y.
Type x.
Type y.`, 'messages': ['0', '0']},
	];
	processTranslateExecuteCases(cases, logger);
};