import { testConvertLogoProgramToSerializableObject } from './testConvertLogoProgramToSerializableObject.js';
import { testConvertMessageObjectsToParseMessages } from './testConvertMessageObjectsToParseMessages.js';
import { testConvertObjectToLogoProgram } from './testConvertObjectToLogoProgram.js';
import { testConvertObjectToParseTree } from './testConvertObjectToParseTree.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testSerialization(logger) {
	return wrapAndCall([
		testConvertLogoProgramToSerializableObject,
		testConvertMessageObjectsToParseMessages,
		testConvertObjectToLogoProgram,
		testConvertObjectToParseTree
	], logger);
};