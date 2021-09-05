import { MixBlendMode } from
'../../../../modules/drawing/vector/shapes/mix-blend-modes/MixBlendMode.js';
import { mixBlendModeToSVGName } from
'../../../../modules/drawing/drawers/svg/mixBlendModeToSVGName.js';

export function testMixBlendModeToSVGName(logger) {
	for (const name of MixBlendMode.getNames()) {
		const modeInt = MixBlendMode.parse(name);
		const svgName = mixBlendModeToSVGName(modeInt);
		if (typeof svgName !== 'string')
			logger(`Expected to get a string from mixBlendModeToSVGName(${modeInt}) but found ${svgName}. ${modeInt} is the integer corresponding with MixBlendMode name ${name}`);
	}
};