export function valueToString(v, cycleValues) {
	if (v === null)
		v = 'null';
	else if (typeof v === 'number') {
		if (Math.abs(Math.round(v * 1000) - v * 1000) < 0.0001)
			v = Math.round(v * 1000) * 0.001;
		if (('' + v).length > 8) {
			// find ways to shrink the number.
			const fixedDigits = Math.max(0, 7 - Math.log10(Math.abs(v)));
			if (v.toFixed(fixedDigits).length < ('' + v).length)
				v = v.toFixed(fixedDigits);
		}
	}
	else if (v instanceof Map) {
		let result = '[';
		if (cycleValues === undefined)
			cycleValues = new Set();
		cycleValues.add(v);
		for (const [key, value] of v) {
			if (result !== '[')
				result += ' ';
			result += valueToString(key) + ':=' + valueToString(value, cycleValues);
		}
		cycleValues.delete(v);
		return result + ']';
	}
	else if (typeof v === 'object') {
		if (typeof v.toPrintedString === 'function')
			return v.toPrintedString();
		else if (typeof v.toString === 'function' && !(v instanceof Array))
			return v.toString();
		else if (cycleValues === undefined)
			cycleValues = new Set();
		else if (!(cycleValues instanceof Set))
			throw new Error('cycleValues must either be undefined or a Set');
		if (cycleValues.has(v))
			return '$$CYCLE$$';
		cycleValues.add(v);
		if (v instanceof Array) {
			const result = '[' + v.map(function(ae) {
				return valueToString(ae, cycleValues);
			}).join(' ') + ']';
			cycleValues.delete(v);
			return result;
		}
	}
	return '' + v;
}