export function sum(args) {
	if (args.length === 0)
		return;
	return `(${args.join(' + ')})`;
};