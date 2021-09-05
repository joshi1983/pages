import { StringBuffer } from '../../StringBuffer.js';

export function getCodeUpToAndIncludingToken(code, token) {
	const result = new StringBuffer();
	let curIndex = 0;
	for (let i = 0; i < token.lineIndex; i++) {
		const index = code.indexOf('\n', curIndex);
		if (index === -1)
			return code;
		else {
			result.append(code.substring(curIndex, index));
			curIndex = index;
		}
	}
	let offset = 1;
	if (!result.isEmpty())
		offset++;
	result.append(code.substring(curIndex, curIndex + token.colIndex + offset));
	return result.toString();
};