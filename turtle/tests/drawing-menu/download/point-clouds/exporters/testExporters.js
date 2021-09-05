import { testPointsToCSV } from './testPointsToCSV.js';
import { testPointsToPCD } from './testPointsToPCD.js';
import { testPointsToPTS } from './testPointsToPTS.js';
import { testPointsToXYZ } from './testPointsToXYZ.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testExporters(logger) {
	wrapAndCall([
		testPointsToCSV,
		testPointsToPCD,
		testPointsToPTS,
		testPointsToXYZ
	], logger);
};