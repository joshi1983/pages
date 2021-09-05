function pairToInserterFunction(pair) {
	const regex = pair[0];
	const offset = pair[1];
	return function(line) {
		const match = line.match(regex);
		if (match !== null) {
			const prefix = match[0];
			return prefix.substring(0, prefix.length - offset) + ' ' + line.substring(prefix.length - offset);
		}
		return line;
	};
}

const inserters = [
	[/^\s*([1-9][0-9]*\s*\:?)?\s*DEFPROC/i, 4],
	[/^\s*([1-9][0-9]*\s*\:?)?\s*FOR\S/i, 1],
	[/^\s*([1-9][0-9]*\s*\:?)?\s*INPUT\S/i, 1],
	[/^\s*([1-9][0-9]*\s*\:?)?\s*MODE\S/i, 1],
	[/^\s*([1-9][0-9]*\s*\:?)?\s*PRINT\S/i, 1],
	[/^\s*([1-9][0-9]*\s*\:?)?\s*VDU\S/i, 1]
];

for (let i = 0; i < inserters.length; i++) {
	inserters[i] = pairToInserterFunction(inserters[i]);
}

export function insertSpaces(code) {
	const lines = code.split('\n');
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i];
		for (const inserter of inserters) {
			line = inserter(line);
		}
		lines[i] = line;
	}
	return lines.join('\n');
};