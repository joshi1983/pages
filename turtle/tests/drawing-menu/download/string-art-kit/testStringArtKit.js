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
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testStringArtKit(logger) {
	wrapAndCall([
		testCanDrawingBeExportedToStringArtKit,
		testDrawingToStringArtKitDrawing,
		testGetDistinctPointsFromDrawing,
		testGetLineHintsFromDrawing,
		testGetPointsFromShape,
		testGetSanitizedDrawingForStringArtKit,
		testLineHint,
		testSanitizeOptions,
		testSanitizePointsCloserThanThreshold,
		testStringArtLocalStorage
	], logger);
};