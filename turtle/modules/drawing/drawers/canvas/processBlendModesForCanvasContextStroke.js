import { blendModeToCanvasContextGlobalCompositeOperation } from './blendModeToCanvasContextGlobalCompositeOperation.js';

export function processBlendModesForCanvasContextStroke(style, ctx) {
	ctx.globalCompositeOperation = blendModeToCanvasContextGlobalCompositeOperation(style.getPenBlendMode());
};