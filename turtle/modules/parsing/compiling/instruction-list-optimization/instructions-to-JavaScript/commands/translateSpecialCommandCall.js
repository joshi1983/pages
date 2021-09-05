import { and } from './and.js';
import { bitAnd } from './bitAnd.js';
import { bitNot } from './bitNot.js';
import { bitOr } from './bitOr.js';
import { bitShiftLeft } from './bitShiftLeft.js';
import { bitShiftRight } from './bitShiftRight.js';
import { bitXor } from './bitXor.js';
import { count } from './count.js';
import { createPList } from './createPList.js';
import { createPList2 } from './createPList2.js';
import { emptyp } from './emptyp.js';
import { evenp } from './evenp.js';
import { first } from './first.js';
import { item } from './item.js';
import { list } from './list.js';
import { listp } from './listp.js';
import { max } from './max.js';
import { min } from './min.js';
import { not } from './not.js';
import { oddp } from './oddp.js';
import { or } from './or.js';
import { product } from './product.js';
import { stringp } from './stringp.js';
import { sum } from './sum.js';

export const commandsMap = new Map();
[and, bitAnd, bitNot, bitOr, bitShiftLeft, bitShiftRight, bitXor, count, 
createPList, createPList2, emptyp, evenp, first, item, list, listp, max, min, not, 
oddp, or, product, stringp, sum].forEach(function(func) {
	commandsMap.set(func.name, func);
});


// Any commands that have extra error checks in their implementations atan
// modules/command-groups should be in this set.
// These are commands that will be translated only when compiling for production.
export const productionOnlySet = new Set([
'first',
'item'
]);

export function translateSpecialCommandCall(commandInfo, args, compileOptions) {
	if (compileOptions.forProduction !== true && productionOnlySet.has(commandInfo.primaryName))
		return; // indicate unable to translate.
	const func = commandsMap.get(commandInfo.primaryName);
	if (func === undefined)
		return;
	return func(args);
};