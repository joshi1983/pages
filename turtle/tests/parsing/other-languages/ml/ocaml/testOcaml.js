import { testIsLikelyOcaml } from './testIsLikelyOcaml.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testOcaml(logger) {
	wrapAndCall([
		testIsLikelyOcaml,
	], logger);
};