import { testBlurRatiosToSequentialAlphaRatios } from './testBlurRatiosToSequentialAlphaRatios.js';
import { testGetAnimationSetup } from './testGetAnimationSetup.js';
import { testGetBlurRatios } from './testGetBlurRatios.js';
import { testGetDrawingSnapshot } from './testGetDrawingSnapshot.js';
import { testGetSnapshotStyleFromProgram } from './testGetSnapshotStyleFromProgram.js';
import { testSnapshotStyle } from './testSnapshotStyle.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testAnimation(logger) {
	wrapAndCall([
		testGetAnimationSetup,
		testBlurRatiosToSequentialAlphaRatios,
		testGetBlurRatios,
		testGetDrawingSnapshot,
		testGetSnapshotStyleFromProgram,
		testSnapshotStyle
	], logger);
};