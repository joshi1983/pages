import { testCodeToTranslator } from './testCodeToTranslator.js';
import { testFixCode } from './testFixCode.js';
import { testFixers } from './fixers/testFixers.js';
import { testFixLogger } from './testFixLogger.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testCodeFixer(logger) {
	wrapAndCall([
		testCodeToTranslator,
		testFixCode,
		testFixers,
		testFixLogger
	], logger);
};