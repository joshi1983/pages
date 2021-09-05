export function difference(args) {
	if (args.length === 0)
		return;
	return `(${args.join(' - ')})`;
};