const intTypes = new Set([
	'byte', 'int', 'int8', 'int16', 'int32', 'int64',
	'uint', 'uint8', 'uint16', 'uint32', 'uint64'
]);

export function isIntegerType(s) {
	return intTypes.has(s);
};