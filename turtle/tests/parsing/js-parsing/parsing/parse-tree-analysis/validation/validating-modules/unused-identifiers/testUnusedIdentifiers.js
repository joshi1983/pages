import { testGetIdentifierStringsFromImport } from './testGetIdentifierStringsFromImport.js';
import { testIsFromExportStatement } from './testIsFromExportStatement.js';
import { testMightBeReading } from './testMightBeReading.js';
import { wrapAndCall } from '../../../../../../../helpers/wrapAndCall.js';

export function testUnusedIdentifiers(logger) {
	wrapAndCall([
		testGetIdentifierStringsFromImport,
		testIsFromExportStatement,
		testMightBeReading
	], logger);
};