import { isFiniteNum } from './isFiniteNum.js';
import { isUnfiniteNum } from './isUnfiniteNum.js';

export function getMinMaxGenericReturnTypes(types1, types2) {
	const args = Array.from(arguments);
	if (!args.some(t => t !== 'int'))
		return 'int';
	if (!args.some(t => !isFiniteNum(t)))
		return 'num(finite)';
	if (!args.some(t => !isUnfiniteNum(t)))
		return 'num(unfinite)';
	return 'num';
}