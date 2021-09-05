import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testPointsToCSV } from './testPointsToCSV.js';
import { testPointsToPCD } from './testPointsToPCD.js';
import { testPointsToPTS } from './testPointsToPTS.js';
import { testPointsToXYZ } from './testPointsToXYZ.js';

export function testExporters(logger) {
	testPointsToCSV(prefixWrapper('testPointsToCSV', logger));
	testPointsToPCD(prefixWrapper('testPointsToPCD', logger));
	testPointsToPTS(prefixWrapper('testPointsToPTS', logger));
	testPointsToXYZ(prefixWrapper('testPointsToXYZ', logger));
};