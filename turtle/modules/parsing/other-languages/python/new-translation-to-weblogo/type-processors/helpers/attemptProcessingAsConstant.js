import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { PythonFunctions } from '../../../PythonFunctions.js';

export function attemptProcessingAsConstant(token, result, cachedParseTree) {
	if (token.children.length !== 0 &&
	token.children[0].val === '.' &&
	token.children[0].children.length !== 0) {
		const className = token.val;
		const child = token.children[0].children[0];
		const constantName = child.val;
		
		// if something like sys.argv[2]
		if (className === 'sys' && constantName === null &&
		child.type === ParseTreeTokenType.SUBSCRIPT_EXPRESSION &&
		child.children.length === 2 &&
		child.children[0].type === ParseTreeTokenType.IDENTIFIER &&
		child.children[0].val === 'argv') {
			result.append(' "4 ');
			return true;
		}

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