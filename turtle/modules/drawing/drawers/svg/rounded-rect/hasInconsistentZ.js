function getZ(element) {
	if (element.getZ !== undefined)
		return element.getZ();
	else
		return element.position.getZ();
}

export function hasInconsistentZ(elements) {
	let z;
	for (let i = 0; i < elements.length; i++) {
		const e = elements[i];
		const eZ = getZ(e);
		if (z === undefined)
			z = eZ;
		else if (z !== eZ)
			return true;
	}
	return false;
};