export function naiveStripCobolComments(s) {
	const lines = [];
	for (const line of s.split('\n')) {
		let index = line.indexOf('*>');
		if (index === -1)
			lines.push(line);
		else
			lines.push(line.substring(0, index));
	}
	return lines.join('\n');
};