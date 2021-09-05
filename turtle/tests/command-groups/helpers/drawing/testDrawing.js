import { testIsotoxalStar } from './testIsotoxalStar.js';
import { testStripes } from './testStripes.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testDrawing(logger) {
	wrapAndCall([
		testIsotoxalStar,
		testStripes
	], logger);
};