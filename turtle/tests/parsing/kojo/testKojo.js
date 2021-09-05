import { testIsLikelyKojo } from './testIsLikelyKojo.js';
import { testMigrationJson } from './testMigrationJson.js';
import { testScanning } from './scanning/testScanning.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testKojo(logger) {
	wrapAndCall([
		testIsLikelyKojo,
		testMigrationJson,
		testScanning
	], logger);
};