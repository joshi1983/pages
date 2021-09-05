import { testAnimatedGifToStaticImageData } from './testAnimatedGifToStaticImageData.js';
import { testIsotoxalStar } from './testIsotoxalStar.js';
import { testPreventPathJoin } from './testPreventPathJoin.js';
import { testShortTermBase64Cache } from './testShortTermBase64Cache.js';
import { testStripes } from './testStripes.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testDrawing(logger) {
	wrapAndCall([
		testAnimatedGifToStaticImageData,
		testIsotoxalStar,
		testPreventPathJoin,
		testShortTermBase64Cache,
		testStripes
	], logger);
};