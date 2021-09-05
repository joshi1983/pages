function pairToInserterFunction(pair) {
	const regex = pair[0];
	const offset = pair[1];
	return function(line) {
		const match = line.match(regex);
		if (match !== null) {
			const prefix = match[0];
			return prefix.substring(0, prefix.length - offset) +
			' ' + line.substring(prefix.length - offset);
		}
		return line;
	};
}

export function genericInsertSpaces(inserters) {
	if (!(inserters instanceof Array))
		throw new Error(`inserters must be an Array but found ${inserters}`);

	for (let i = 0; i < inserters.length; i++) {
		inserters[i] = pairToInserterFunction(inserters[i]);
	}
	return function(code) {
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
};