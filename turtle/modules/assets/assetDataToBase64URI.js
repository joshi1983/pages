/*
dataString should be base-64-encoded data.
mime should be something like image/png.
*/
export function assetDataToBase64URI(dataString, mime) {
	return `data:${mime};base64,${dataString}`;
};