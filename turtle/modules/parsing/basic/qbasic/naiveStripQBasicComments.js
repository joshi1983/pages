export function naiveStripQBasicComments(code) {
	const lines = code.split('\n');
	for (let i = 0; i < lines.length; i++) {
		let line= lines[i];
		let index = line.indexOf('\'');
		if (index !== -1)
			line = line.substring(0, index);
		index = line.toLowerCase().indexOf('rem');
		if (index !== -1)
			line = line.substring(0, index);
		lines[i] = line;
	}
	return lines.join('\n');
};