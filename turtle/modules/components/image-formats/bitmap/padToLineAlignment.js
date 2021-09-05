export function padToLineAlignment(bytes, bytesPerLine) {
	if (!Number.isInteger(bytes.length))
		throw new Error(`bytes must have an integer length property but bytes=${bytes}. bytes.length=${bytes.length}`);
	if (!Number.isInteger(bytesPerLine))
		throw new Error(`bytesPerLine must be an integer but found ${bytesPerLine}`);

	// pad to nearest bytesPerLine.
	while ((bytes.length % bytesPerLine) !== 0) {
		bytes.push(0);
	}
};