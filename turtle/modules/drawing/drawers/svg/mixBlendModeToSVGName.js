import { MixBlendMode } from
'../../vector/shapes/mix-blend-modes/MixBlendMode.js';

const intToSVGName = new Map([
	[MixBlendMode.Color, "color"],
	[MixBlendMode.Color_burn, "color-burn"],
	[MixBlendMode.Color_dodge, "color-dodge"],
	[MixBlendMode.Darken, "darken"],
	[MixBlendMode.Difference, 'difference'],
	[MixBlendMode.Exclusion, 'exclusion'],
	[MixBlendMode.Hard_light, "hard-light"],
	[MixBlendMode.Hue, "hue"],
	[MixBlendMode.Lighter, 'lighten'],
	[MixBlendMode.Luminosity, "luminosity"],
	[MixBlendMode.Multiply, 'multiply'],
	[MixBlendMode.Normal, 'normal'],
	[MixBlendMode.Overlay, 'overlay'],
	[MixBlendMode.Saturation, 'saturation'],
	[MixBlendMode.Screen, "screen"],
	[MixBlendMode.Soft_light, "soft-light"],
]);

export function mixBlendModeToSVGName(blendModeInt) {
	return intToSVGName.get(blendModeInt);
};