function setIntoMap(map, name, commandInfo, isCaseSensitive) {
	if (isCaseSensitive !== true)
		name = name.toLowerCase();
	let mapValue = map.get(name);
	if (mapValue === undefined) {
		mapValue = [
		commandInfo
		];
		map.set(name, mapValue);
	}
	else {
		mapValue.push(commandInfo);
	}
}

export function mergeIntoCommandsMap(map, commands, isCaseSensitive) {
	if (!(map instanceof Map))
		throw new Error(`Expected map to be a Map but got ${map}`);
	if (!(commands instanceof Array))
		throw new Error(`Expected commands to be an Array but got ${commands}`);
	if (typeof isCaseSensitive !== 'boolean')
		throw new Error(`Expected isCaseSensitive to be boolean but got ${isCaseSensitive}`);
	for (const commandInfo of commands) {
		let key = commandInfo.primaryName;
		setIntoMap(map, commandInfo.primaryName, commandInfo, isCaseSensitive);
		if (commandInfo.names instanceof Array) {
			for (const name of commandInfo.names) {
				setIntoMap(map, name, commandInfo, isCaseSensitive);
			}
		}
	}
};

export function commandsToMap(isCaseSensitive) {
	const result = new Map();
	for (let i = 1; i < arguments.length; i++) {
		mergeIntoCommandsMap(result, arguments[i], isCaseSensitive);
	}
	return result;
};