export function blockInfoToName(blockInfo) {
	let name = blockInfo[1];
	if (typeof name === 'string')
		return name;
	return name[0];
};