import { MixBlendMode } from
'../../../drawing/vector/shapes/mix-blend-modes/MixBlendMode.js';

export function mixBlendMode(s) {
	s = s.trim().toLowerCase();
	const blendModeInt = MixBlendMode.parse(s);
	if (!Number.isInteger(blendModeInt))
		return `Unsupported mix blend mode "${s}".  The mix blend mode must be one of ${MixBlendMode.getNames().join(',')}`;
};