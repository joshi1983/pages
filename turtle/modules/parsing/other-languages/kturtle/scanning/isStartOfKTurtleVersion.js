export function isStartOfKTurtleVersion(s) {
	if ('kturtle-script-v'.startsWith(s))
		return true;
	if (/^kturtle-script-v[0-9](\.[0-9]*)?$/.test(s))
		return true;
	return false;
};