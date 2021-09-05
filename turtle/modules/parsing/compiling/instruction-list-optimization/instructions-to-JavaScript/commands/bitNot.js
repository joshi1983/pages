export function bitNot(args) {
	if (args.length === 1) {
		return `~(${args[0]})`;
	}
};