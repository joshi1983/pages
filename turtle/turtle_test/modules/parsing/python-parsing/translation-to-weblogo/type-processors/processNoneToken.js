export function processNoneToken(token, result, cachedParseTree) {
	/*
	There is no better translation in WebLogo for None than the string 'None'.
	 WebLogo does not support null or undefined.
	 Translating to the string seems a bit better than forcing the user 
	to manually translate, though.
	*/
	result.append('"None');
}