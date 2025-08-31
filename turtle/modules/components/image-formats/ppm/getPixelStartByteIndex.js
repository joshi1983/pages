export function getPixelStartByteIndex(s, byteArray, pixelCount, width, versionNumber) {
	if (typeof s !== 'string')
		throw new Error(`s must be a string but found ${s}`);

	// avoid scanning when dealing with binary formats.
	// Whitespace characters like a regular space, 
	// '\n', '\r' can represent valid pixel data.
	// For that reason, we don't want to potentially skip over them 
	// as if only non-whitespaces can be pixel data values.
	if (versionNumber === 6) {
		const rgbOffsetResult = byteArray.length - pixelCount * 3;
		if (rgbOffsetResult > 0)
			return rgbOffsetResult;
	}
	else if (versionNumber === 4) {
		const bytesPerLine = Math.ceil(width / 8); 
		// 8 because there are 8 pixels per byte. 
		// 1 bit per pixel.

		const height = Math.floor(pixelCount / width);
		const totalBytes = height * bytesPerLine;
		const rgbOffsetResult = byteArray.length - totalBytes;
		if (rgbOffsetResult > 0)
			return rgbOffsetResult;
	}
	let isBinary = [4, 6].indexOf(versionNumber) !== -1;
	let token = '';
	let tokenCount = 0;
	function pushToken() {
		if (token !== '') {
			tokenCount++;
			token = '';
		}
	}
	let i = 0;
	let expectedCount = 3; // 3 for version number, width, and height.

	// some versions use an extra token to represent the maximum value.
	if (versionNumber === 2 || versionNumber === 3 || versionNumber === 6)
		expectedCount++;
	for (; i < s.length; i++) {
		const ch = s[i];
		if (ch === '#') {
			pushToken();
			let i2 = s.indexOf('\n', i + 1);
			if (i2 === -1)
				return i; // weird case that should not happen in a valid PPM file.			
			i = i2;
			token = '';
		}
		else if (/\s/.test(ch)) {
			pushToken();
		}
		else {
			token += ch;
		}
		if (token === '' && tokenCount === expectedCount)
			break;
	}
	// find index of next non-whitespace.
	if (!isBinary) {
		for (; i < s.length; i++) {
			const ch = s[i];
			if (!(/\s/.test(ch)))
				break;
		}
	}

	return i;
};