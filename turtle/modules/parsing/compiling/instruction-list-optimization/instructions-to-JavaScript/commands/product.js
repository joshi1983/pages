export function product(args) {
	if (args.length === 0)
		return;
	return `(${args.join(') * (')})`;
};