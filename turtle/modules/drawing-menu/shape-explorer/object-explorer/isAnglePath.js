export function isAnglePath(path) {
	const index = path.lastIndexOf('.');
	if (index !== -1)
		path = path.substring(index + 1);
	path = path.toLowerCase();
	const angleKeys = ['angle', 'radians', 'rotation'];
	for (let i = 0; i < angleKeys.length; i++) {
		if (path.indexOf(angleKeys[i]) !== -1)
			return true;
	}
	return false;
};