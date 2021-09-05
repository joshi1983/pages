import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testCanDrawingBeExportedToPointCloud } from './testCanDrawingBeExportedToPointCloud.js';
import { testExporters } from './exporters/testExporters.js';
import { testMouseWheelZoom } from './testMouseWheelZoom.js';
import { testPointCloudFileFormats } from './testPointCloudFileFormats.js';
import { testPointCloudFormatsJSON } from './testPointCloudFormatsJSON.js';
import { testPointCloudLocalStorage } from './testPointCloudLocalStorage.js';
import { testPointCloudPreviewer } from './testPointCloudPreviewer.js';
import { testRotatingTransformer } from './testRotatingTransformer.js';
import { testRotatingTransformerModes } from './testRotatingTransformerModes.js';

export function testPointClouds(logger) {
	testCanDrawingBeExportedToPointCloud(prefixWrapper('testCanDrawingBeExportedToPointCloud', logger));
	testExporters(prefixWrapper('testExporters', logger));
	testMouseWheelZoom(prefixWrapper('testMouseWheelZoom', logger));
	testPointCloudFileFormats(prefixWrapper('testPointCloudFileFormats', logger));
	testPointCloudFormatsJSON(prefixWrapper('testPointCloudFormatsJSON', logger));
	testPointCloudLocalStorage(prefixWrapper('testPointCloudLocalStorage', logger));
	testPointCloudPreviewer(prefixWrapper('testPointCloudPreviewer', logger));
	testRotatingTransformer(prefixWrapper('testRotatingTransformer', logger));
	testRotatingTransformerModes(prefixWrapper('testRotatingTransformerModes', logger));
};