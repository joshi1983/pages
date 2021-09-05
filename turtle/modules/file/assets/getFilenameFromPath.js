export function getFilenameFromPath(path) {
	let index = Math.max(...['/', '\\'].map(slash => path.lastIndexOf(slash)));
	if (index !== -1)
		return path.substring(index + 1);
	else
		return path;
};