import { testAsyncDownscale } from './testAsyncDownscale.js';
import { testBlendModeToCanvasContextGlobalCompositeOperation } from './testBlendModeToCanvasContextGlobalCompositeOperation.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testCanvas(logger) {
	wrapAndCall([
		testAsyncDownscale,
		testBlendModeToCanvasContextGlobalCompositeOperation
	], logger);
};