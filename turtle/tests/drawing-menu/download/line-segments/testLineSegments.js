import { testCanDrawingBeExportedToLineSegments } from './testCanDrawingBeExportedToLineSegments.js';
import { testColouredLineSegment } from './testColouredLineSegment.js';
import { testDownload } from './testDownload.js';
import { testDrawingToLineSegments } from './testDrawingToLineSegments.js';
import { testExporters } from './exporters/testExporters.js';
import { testGetAverageColour } from './testGetAverageColour.js';
import { testLineSegmentFileFormats } from './testLineSegmentFileFormats.js';
import { testLineSegmentFormatsJSON } from './testLineSegmentFormatsJSON.js';
import { testLineSegmentsLocalStorage } from './testLineSegmentsLocalStorage.js';
import { testLineSegmentsPreviewer } from
'./testLineSegmentsPreviewer.js';
import { testLineSegmentsToBackgroundColour } from
'./testLineSegmentsToBackgroundColour.js';
import { testRotatingTransformer } from './testRotatingTransformer.js';
import { testShapeConversion } from './shape-conversion/testShapeConversion.js';
import { testSortLineSegments } from './testSortLineSegments.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testLineSegments(logger) {
	wrapAndCall([
		testCanDrawingBeExportedToLineSegments,
		testColouredLineSegment,
		testDownload,
		testDrawingToLineSegments,
		testExporters,
		testGetAverageColour,
		testLineSegmentFileFormats,
		testLineSegmentFormatsJSON,
		testLineSegmentsLocalStorage,
		testLineSegmentsPreviewer,
		testLineSegmentsToBackgroundColour,
		testRotatingTransformer,
		testShapeConversion,
		testSortLineSegments
	], logger);
};