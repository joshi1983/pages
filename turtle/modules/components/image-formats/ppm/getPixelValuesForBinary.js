function getValuesFromPackedBits(byteArray, width) {
	const result = [];
	for (let i = 0; i < byteArray.length; i++) {
		const byteVal = byteArray[i];
		for (let bitIndex = 7; bitIndex >= 0; bitIndex--) {
			const bitValue = ((byteVal >> bitIndex) & 1);
			result.push((1 - bitValue) * 255);

			// If at the end of a row of pixels, ignore the remaining bits from byteVal.
			if (result.length % width === 0)
				break;
		}
	}
	return result;
}

export function getPixelValuesForBinary(byteArray, maxValue, width) {
	if (maxValue === 1) {
		return getValuesFromPackedBits(byteArray, width);
	}
	else {
		let numBytesPerValue;
		/*
		The number of bytes per value is always 1 with the test data.
		Having 2 bytes per value is documentation on P6 at: https://netpbm.sourceforge.net/doc/ppm.html.
		This is trying to handle the 2-bytes case based on that documentation but
		the case isn't properly tested.
		*/
		if (maxValue > 255)
			numBytesPerValue = 2;
		else
			numBytesPerValue = 1;

		const result = [];
		for (let i = 0; i < byteArray.length; i++) {
			const byteValue = byteArray[i];
			let val = byteValue;
			if (numBytesPerValue === 2) {
				val = byteValue | (byteArray[++i] << 8);
			}
			result.push(val);
		}
		return result;
	}
}