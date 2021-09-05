import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testCanDrawingBeExportedToStringArtKit } from './testCanDrawingBeExportedToStringArtKit.js';
import { testDrawingToStringArtKitDrawing } from './testDrawingToStringArtKitDrawing.js';
import { testGetDistinctPointsFromDrawing } from './testGetDistinctPointsFromDrawing.js';
import { testGetLineHintsFromDrawing } from './testGetLineHintsFromDrawing.js';
import { testGetPointsFromShape } from './testGetPointsFromShape.js';
import { testGetSanitizedDrawingForStringArtKit } from './testGetSanitizedDrawingForStringArtKit.js';
import { testLineHint } from './testLineHint.js';
import { testSanitizeOptions } from './testSanitizeOptions.js';
import { testSanitizePointsCloserThanThreshold } from './testSanitizePointsCloserThanThreshold.js';
import { testStringArtLocalStorage } from './testStringArtLocalStorage.js';

export function testStringArtKit(logger) {
	testCanDrawingBeExportedToStringArtKit(prefixWrapper('testCanDrawingBeExportedToStringArtKit', logger));
	testDrawingToStringArtKitDrawing(prefixWrapper('testDrawingToStringArtKitDrawing', logger));
	testGetDistinctPointsFromDrawing(prefixWrapper('testGetDistinctPointsFromDrawing', logger));
	testGetLineHintsFromDrawing(prefixWrapper('testGetLineHintsFromDrawing', logger));
	testGetPointsFromShape(prefixWrapper('testGetPointsFromShape', logger));
	testGetSanitizedDrawingForStringArtKit(prefixWrapper('testGetSanitizedDrawingForStringArtKit', logger));
	testLineHint(prefixWrapper('testLineHint', logger));
	testSanitizeOptions(prefixWrapper('testSanitizeOptions', logger));
	testSanitizePointsCloserThanThreshold(prefixWrapper('testSanitizePointsCloserThanThreshold', logger));
	testStringArtLocalStorage(prefixWrapper('testStringArtLocalStorage', logger));
};