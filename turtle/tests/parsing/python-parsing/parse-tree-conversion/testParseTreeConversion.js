import { testDtTokenToParseTreeTokenType } from './testDtTokenToParseTreeTokenType.js';
import { testGetSingleLineCommentsFromCode } from './testGetSingleLineCommentsFromCode.js';
import { testIndexToRowColIndex } from './testIndexToRowColIndex.js';
import { testIsPythonIdentifier } from './testIsPythonIdentifier.js';
import { testIsPythonOperator } from './testIsPythonOperator.js';
import { testSanitizePythonCode } from './testSanitizePythonCode.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testParseTreeConversion(logger) {
	wrapAndCall([
		testDtTokenToParseTreeTokenType,
		testGetSingleLineCommentsFromCode,
		testIndexToRowColIndex,
		testIsPythonIdentifier,
		testIsPythonOperator,
		testSanitizePythonCode
	], logger);
};