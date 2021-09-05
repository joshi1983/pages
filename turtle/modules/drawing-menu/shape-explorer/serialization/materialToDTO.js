function fillToDTO(fill) {
	const result = {};
	if (fill.gradient !== undefined) {
		result.gradient = 'gradient';
	}
	else
		result.color = fill.color.toString();
	return result;
}

export function materialToDTO(material) {
	const result = {
		'fill': fillToDTO(material.fill)
	};
	return result;
};