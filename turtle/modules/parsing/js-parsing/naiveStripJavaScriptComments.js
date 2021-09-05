import { StringBuffer } from '../../StringBuffer.js';

export function naiveStripJavaScriptComments(code) {
	const result = new StringBuffer();
	let startIndex = 0;
	while (true) {
		const singleLineCommentIndex = code.indexOf('//', startIndex);
		const multiLineCommentIndex = code.indexOf('/*', startIndex);
		if (singleLineCommentIndex === -1 && multiLineCommentIndex === -1) {
			result.append(code.substring(startIndex));
			break;
		}
		else if (multiLineCommentIndex !== -1 &&
		(singleLineCommentIndex === -1 || singleLineCommentIndex > multiLineCommentIndex)) {
			result.append(code.substring(startIndex, multiLineCommentIndex));
			const multiLineCommentIndexEnd = code.indexOf('*/', multiLineCommentIndex);
			if (multiLineCommentIndexEnd === -1)
				break;
			else {
				startIndex = multiLineCommentIndexEnd + 2;
			}
		}
		else {
			result.append(code.substring(startIndex, singleLineCommentIndex));
			const lineEndIndex = code.indexOf('\n', singleLineCommentIndex);
			if (lineEndIndex === -1)
				break;
			else {
				startIndex = lineEndIndex;
				// Let's keep the \n in the result.
				// The \n is good for the way this function is generally used.
			}
		}
	}
	return result.toString();
};