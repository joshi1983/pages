import { testPointsToCSV } from './testPointsToCSV.js';
import { testPointsToOBJ } from './testPointsToOBJ.js';
import { testPointsToPLY } from './testPointsToPLY.js';
import { testPointsToPCD } from './testPointsToPCD.js';
import { testPointsToPTS } from './testPointsToPTS.js';
import { testPointsToXYZ } from './testPointsToXYZ.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testExporters(logger) {
	wrapAndCall([
		testPointsToCSV,
		testPointsToOBJ,
		testPointsToPCD,
		testPointsToPLY,
		testPointsToPTS,
		testPointsToXYZ
	], logger);
};