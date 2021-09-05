import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testParseDataTypeString } from './testParseDataTypeString.js';
import { testScanDataTypeString } from './testScanDataTypeString.js';
import { testValidateDataTypeString } from './testValidateDataTypeString.js';
import { testValidateTypesInCommands } from './testValidateTypesInCommands.js';

export function testDataTypeParsing(logger) {
	testParseDataTypeString(prefixWrapper('testParseDataTypeString', logger));
	testScanDataTypeString(prefixWrapper('testScanDataTypeString', logger));
	testValidateDataTypeString(prefixWrapper('testValidateDataTypeString', logger));
	testValidateTypesInCommands(prefixWrapper('testValidateTypesInCommands', logger));
};