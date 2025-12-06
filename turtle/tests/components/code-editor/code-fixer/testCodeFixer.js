import { testCodeToTranslator } from './testCodeToTranslator.js';
/*import { testFixCode } from './testFixCode.js';
import { testFixCodeWithVariousExamples } from './testFixCodeWithVariousExamples.js';
import { testFixers } from './fixers/testFixers.js';
import { testFixLogger } from './testFixLogger.js';
import { testWrappedFixLogger } from './testWrappedFixLogger.js';
*/import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testCodeFixer(logger) {
	wrapAndCall([
		testCodeToTranslator,/*
		testFixCode,
		testFixCodeWithVariousExamples,
		testFixers,
		testFixLogger,
		testWrappedFixLogger*/
	], logger);
};