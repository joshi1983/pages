export function checkOnly1Defined(info, keys, logger) {
	let count = 0;
	for (const key of keys) {
		if (info[key] !== undefined)
			count++;
	}
	if (count > 1)
		logger(`Only one of ${keys.join(',')} should be defined but found ${count} defined.`);
}