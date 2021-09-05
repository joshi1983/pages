import { testJulia } from './julia/testJulia.js';
import { testMatLab } from './matlab/testMatLab.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testMath(logger) {
	wrapAndCall([
		testJulia,
		testMatLab
	], logger);
};