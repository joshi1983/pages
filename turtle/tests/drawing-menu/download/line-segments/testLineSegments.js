import { testCanDrawingBeExportedToLineSegments } from './testCanDrawingBeExportedToLineSegments.js';
import { testColouredLineSegment } from './testColouredLineSegment.js';
import { testDownload } from './testDownload.js';
import { testDrawingToLineSegments } from './testDrawingToLineSegments.js';
import { testExporters } from './exporters/testExporters.js';
import { testGetAverageColour } from './testGetAverageColour.js';
import { testLineSegmentFileFormats } from './testLineSegmentFileFormats.js';
import { testLineSegmentFormatsJSON } from './testLineSegmentFormatsJSON.js';
import { testLineSegmentShapeToColouredLineSegment } from './testLineSegmentShapeToColouredLineSegment.js';
import { testLineSegmentsToBackgroundColour } from
'./testLineSegmentsToBackgroundColour.js';
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
		testLineSegmentShapeToColouredLineSegment,
		testLineSegmentsToBackgroundColour,
		testSortLineSegments
	], logger);
};