export function max(args) {
	let result = 'Math.max(';
	for (let i = 0; i < args.length; i++) {
		if (i !== 0)
			result += ',';
		result += args[i];
	}
	return result + ')';
};