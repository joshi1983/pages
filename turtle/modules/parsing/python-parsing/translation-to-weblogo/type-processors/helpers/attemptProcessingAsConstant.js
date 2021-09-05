import { PythonFunctions } from '../../../PythonFunctions.js';

export function attemptProcessingAsConstant(token, result, cachedParseTree) {
	if (token.children.length !== 0 &&
	token.children[0].val === '.' &&
	token.children[0].children.length !== 0) {
		let className = token.val;
		let constantName = token.children[0].children[0].val;
		const info = PythonFunctions.getFunctionInfo(constantName, className);
		if (info !== undefined && info.isConstant) {
			if (typeof info.translateToCommand === 'string') {
				result.append(info.translateToCommand);
				return true;
			}
		}
	}
	return false;
};