import { blendModeToCanvasContextGlobalCompositeOperation } from './blendModeToCanvasContextGlobalCompositeOperation.js';

export function processBlendModesForCanvasContextFill(style, ctx) {
	ctx.globalCompositeOperation = blendModeToCanvasContextGlobalCompositeOperation(style.getFillBlendMode());
};