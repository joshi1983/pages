export function arcTo2D(arc) {
	if (arc.position.getZ() !== 0) {
		const result = arc.deepClone();
		result.position.setZ(0);
		return result;
	}
	return arc;
};