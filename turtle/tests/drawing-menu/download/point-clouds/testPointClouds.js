import { testCanDrawingBeExportedToPointCloud } from './testCanDrawingBeExportedToPointCloud.js';
import { testDrawingToPoints } from './testDrawingToPoints.js';
import { testExporters } from './exporters/testExporters.js';
import { testPointCloudFileFormats } from './testPointCloudFileFormats.js';
import { testPointCloudFormatsJSON } from './testPointCloudFormatsJSON.js';
import { testPointCloudLocalStorage } from './testPointCloudLocalStorage.js';
import { testPointCloudPreviewer } from './testPointCloudPreviewer.js';
import { testRotatingTransformer } from './testRotatingTransformer.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testPointClouds(logger) {
	wrapAndCall([
		testCanDrawingBeExportedToPointCloud,
		testDrawingToPoints,
		testExporters,
		testPointCloudFileFormats,
		testPointCloudFormatsJSON,
		testPointCloudLocalStorage,
		testPointCloudPreviewer,
		testRotatingTransformer
	], logger);
};