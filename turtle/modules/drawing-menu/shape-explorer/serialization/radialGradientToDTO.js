export function radialGradientToDTO(radialGradient) {
	return {
		'outerCenter': radialGradient.outerCentre,
		'focus': radialGradient.focus,
		'radius': radialGradient.radius
	};
};