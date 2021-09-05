import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testBlurRatiosToSequentialAlphaRatios } from './testBlurRatiosToSequentialAlphaRatios.js';
import { testGetAnimationSetup } from './testGetAnimationSetup.js';
import { testGetBlurRatios } from './testGetBlurRatios.js';
import { testGetDrawingSnapshot } from './testGetDrawingSnapshot.js';
import { testGetSnapshotStyleFromProgram } from './testGetSnapshotStyleFromProgram.js';
import { testSnapshotStyle } from './testSnapshotStyle.js';

export function testAnimation(logger) {
	testGetAnimationSetup(prefixWrapper('testGetAnimationSetup', logger));
	testBlurRatiosToSequentialAlphaRatios(prefixWrapper('testBlurRatiosToSequentialAlphaRatios', logger));
	testGetBlurRatios(prefixWrapper('testGetBlurRatios', logger));
	testGetDrawingSnapshot(prefixWrapper('testGetDrawingSnapshot', logger));
	testGetSnapshotStyleFromProgram(prefixWrapper('testGetSnapshotStyleFromProgram', logger));
	testSnapshotStyle(prefixWrapper('testSnapshotStyle', logger));
};