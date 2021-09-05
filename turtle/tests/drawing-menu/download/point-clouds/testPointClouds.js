import { testCanDrawingBeExportedToPointCloud } from './testCanDrawingBeExportedToPointCloud.js';
import { testExporters } from './exporters/testExporters.js';
import { testMouseWheelZoom } from './testMouseWheelZoom.js';
import { testPointCloudFileFormats } from './testPointCloudFileFormats.js';
import { testPointCloudFormatsJSON } from './testPointCloudFormatsJSON.js';
import { testPointCloudLocalStorage } from './testPointCloudLocalStorage.js';
import { testPointCloudPreviewer } from './testPointCloudPreviewer.js';
import { testRotatingTransformer } from './testRotatingTransformer.js';
import { testRotatingTransformerModes } from './testRotatingTransformerModes.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testPointClouds(logger) {
	wrapAndCall([
		testCanDrawingBeExportedToPointCloud,
		testExporters,
		testMouseWheelZoom,
		testPointCloudFileFormats,
		testPointCloudFormatsJSON,
		testPointCloudLocalStorage,
		testPointCloudPreviewer,
		testRotatingTransformer,
		testRotatingTransformerModes
	], logger);
};