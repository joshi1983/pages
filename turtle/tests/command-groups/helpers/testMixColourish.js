import { AlphaColour } from '../../../modules/AlphaColour.js';
import { Colour } from '../../../modules/Colour.js';
import { mixColourish } from '../../../modules/command-groups/helpers/mixColourish.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { Transparent } from '../../../modules/Transparent.js';

export function testMixColourish(logger) {
	const cases = [
		{'inArgs': [Transparent, new Colour('red')], 'out': new AlphaColour([127.5, 255, 0, 0])},
		{'inArgs': [new Colour('red'), new Colour('red')], 'out': new Colour('red')},
		{'inArgs': [Transparent, new AlphaColour('red')], 'out': new AlphaColour([127.5, 255, 0, 0])},
		{'inArgs': [Transparent, Transparent], 'out': Transparent},
		{'inArgs': [new AlphaColour('red'), new AlphaColour('red')], 'out': new AlphaColour('red')},
		{'inArgs': [new AlphaColour('red'), new AlphaColour('blue')], 'out': new AlphaColour('#800080')},
	];
	// make every case mix with a ratio of 0.5
	cases.forEach(caseInfo => caseInfo.inArgs.push(0.5));
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = mixColourish(...caseInfo.inArgs);
		if (!result.equals(caseInfo.out)) {
			plogger(`Expected ${caseInfo.out} but got ${result}`);
		}
		// swap arguments.
		const temp = caseInfo.inArgs[0];
		caseInfo.inArgs[0] = caseInfo.inArgs[1];
		caseInfo.inArgs[1] = temp;
		const result2 = mixColourish(...caseInfo.inArgs);
		// Since the ratio is 0.5, swapping the arguments shouldn't change the result.
		if (!result2.equals(caseInfo.out)) {
			plogger(`Expected ${caseInfo.out} but got ${result}`);
		}
	});
};