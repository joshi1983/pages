import { testGetAttributesFromToken } from './testGetAttributesFromToken.js';
import { testParseDataTypeString } from './testParseDataTypeString.js';
import { testScanDataTypeString } from './testScanDataTypeString.js';
import { testValidateDataTypeString } from './testValidateDataTypeString.js';
import { testValidateTypesInCommands } from './testValidateTypesInCommands.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testDataTypeParsing(logger) {
	wrapAndCall([
		testGetAttributesFromToken,
		testParseDataTypeString,
		testScanDataTypeString,
		testValidateDataTypeString,
		testValidateTypesInCommands
	], logger);
};