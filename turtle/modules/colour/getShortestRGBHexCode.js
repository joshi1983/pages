export function getShortestRGBHexCode(c) {
	const result = c.to6DigitHTMLCode();
	if (result.charAt(1) === result.charAt(2) &&
	result.charAt(3) === result.charAt(4) &&
	result.charAt(5) === result.charAt(6))
		return '#' + result.charAt(1) + result.charAt(3) + result.charAt(5);
	return result;
};