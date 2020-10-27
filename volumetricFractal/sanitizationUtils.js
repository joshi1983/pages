function sanitizeFloat(v, defaultVal) {
	if (typeof v === 'string') {
		v = v.trim();
		v = parseFloat(v);
	}
	if (typeof v !== 'number' || isNaN(v))
		return defaultVal;
	else
		return v;
}

function getDefaultedNumber(val1, defaultVal) {
	if (typeof val1 === 'number' && !isNaN(val1))
		return val1;
	else
		return defaultVal;
}

function getDefaultedInteger(val1, defaultVal) {
	return parseInt(getDefaultedNumber(val1, defaultVal));
}

function getDefaultedBool(val1, defaultVal) {
	if (typeof val1 === 'boolean')
		return val1;
	else
		return defaultVal;
}