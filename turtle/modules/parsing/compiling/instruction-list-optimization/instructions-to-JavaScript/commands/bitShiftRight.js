export function bitShiftRight(args) {
	if (args.length === 2) {
		return `( ${args[0]} ) >> ( ${args[1]} )`;
	}
};