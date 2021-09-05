import { Colour } from '../../modules/Colour.js';
import { MathCommands } from '../../modules/command-groups/MathCommands.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

function testEqualP(logger) {
	const cases = [
		{'in': [new Colour('red'), [255, 0, 0]], 'out': true},
		{'in': [new Colour('red'), '#f00'], 'out': true},
		{'in': [new Colour('red'), '#ff0000'], 'out': true},
		{'in': [new Colour('red'), 'red'], 'out': true},
		{'in': [new Colour('red'), 'Red'], 'out': true},
		{'in': [new Colour('green'), [255, 0, 0]], 'out': false},
		{'in': [new Colour('green'), '#f00'], 'out': false},
		{'in': [new Colour('green'), 'red'], 'out': false}
	];
	const m = new MathCommands();
	cases.forEach(function(caseInfo) {
		const result = m.equalp(caseInfo.in[0], caseInfo.in[1]);
		if (result !== caseInfo.out)
			logger('Expected ' + caseInfo.out + ' but got ' + result + ' for inputs ' + caseInfo.in[0] + ' and ' + caseInfo.in[1]);
	});
}

export function testMath(logger) {
	wrapAndCall([
		testEqualP
	], logger);
};