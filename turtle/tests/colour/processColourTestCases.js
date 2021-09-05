import { AlphaColour } from '../../modules/AlphaColour.js';
import { Colour } from '../../modules/Colour.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

export function processColourTestCases(cases, func, logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		let colour;
		if (Colour.isValidColourString(caseInfo.in))
			colour = new Colour(caseInfo.in);
		else
			colour = new AlphaColour(caseInfo.in);
		const result = func(colour);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${result}`);
	});
};