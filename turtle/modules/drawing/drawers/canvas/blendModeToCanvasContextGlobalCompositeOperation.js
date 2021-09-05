import { MixBlendMode } from
'../../vector/shapes/mix-blend-modes/MixBlendMode.js';

const blendModes = new Map([
	[MixBlendMode.Color, "color"],
	[MixBlendMode.Color_burn, "color-burn"],
	[MixBlendMode.Color_dodge, "color-dodge"],
	[MixBlendMode.Darken, "darken"],
	[MixBlendMode.Difference, "difference"],
	[MixBlendMode.Exclusion, "exclusion"],
	[MixBlendMode.Hard_light, "hard-light"],
	[MixBlendMode.Hue, "hue"],
	[MixBlendMode.Lighter, "lighter"],
	[MixBlendMode.Luminosity, "luminosity"],
	[MixBlendMode.Multiply, "multiply"],
	[MixBlendMode.Normal, "source-over"],
	[MixBlendMode.Overlay, 'overlay'],
	[MixBlendMode.Saturation, 'saturation'],
	[MixBlendMode.Screen, "screen"],
	[MixBlendMode.Soft_light, "soft-light"],
]);

export function blendModeToCanvasContextGlobalCompositeOperation(blendModeInt) {
	return blendModes.get(blendModeInt);
};