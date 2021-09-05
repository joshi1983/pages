import { testMixBlendMode } from './testMixBlendMode.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testMixBlendModes(logger) {
	wrapAndCall([
		testMixBlendMode
	], logger);
};