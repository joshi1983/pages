import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testCanDrawingBeExportedToStringArtKit } from './testCanDrawingBeExportedToStringArtKit.js';
import { testDrawingToStringArtKitDrawing } from './testDrawingToStringArtKitDrawing.js';
import { testGetDistinctPointsFromDrawing } from './testGetDistinctPointsFromDrawing.js';
import { testGetPointsFromShape } from './testGetPointsFromShape.js';
import { testGetSanitizedDrawingForStringArtKit } from './testGetSanitizedDrawingForStringArtKit.js';
import { testSanitizePointsCloserThanThreshold } from './testSanitizePointsCloserThanThreshold.js';

export function testStringArtKit(logger) {
	testCanDrawingBeExportedToStringArtKit(prefixWrapper('testCanDrawingBeExportedToStringArtKit', logger));
	testDrawingToStringArtKitDrawing(prefixWrapper('testDrawingToStringArtKitDrawing', logger));
	testGetDistinctPointsFromDrawing(prefixWrapper('testGetDistinctPointsFromDrawing', logger));
	testGetPointsFromShape(prefixWrapper('testGetPointsFromShape', logger));
	testGetSanitizedDrawingForStringArtKit(prefixWrapper('testGetSanitizedDrawingForStringArtKit', logger));
	testSanitizePointsCloserThanThreshold(prefixWrapper('testSanitizePointsCloserThanThreshold', logger));
};