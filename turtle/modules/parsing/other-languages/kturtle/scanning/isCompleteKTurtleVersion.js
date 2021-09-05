export function isCompleteKTurtleVersion(s) {
	return /^kturtle-script-v[0-9](\.[0-9]+)?$/.test(s);
};