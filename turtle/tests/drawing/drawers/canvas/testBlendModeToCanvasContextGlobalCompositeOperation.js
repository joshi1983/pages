import { blendModeToCanvasContextGlobalCompositeOperation } from
'../../../../modules/drawing/drawers/canvas/blendModeToCanvasContextGlobalCompositeOperation.js';
import { MixBlendMode } from
'../../../../modules/drawing/vector/shapes/mix-blend-modes/MixBlendMode.js';

export function testBlendModeToCanvasContextGlobalCompositeOperation(logger) {
	for (const name of MixBlendMode.getNames()) {
		const modeInt = MixBlendMode.parse(name);
		const compositeOperationName = blendModeToCanvasContextGlobalCompositeOperation(modeInt);
		if (typeof compositeOperationName !== 'string')
			logger(`Expected to get a string from blendModeToCanvasContextGlobalCompositeOperation(${modeInt}) but found ${compositeOperationName}. ${modeInt} is the integer corresponding with MixBlendMode name ${name}`);
	}
};
