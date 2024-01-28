import { and } from './and.js';
import { bitAnd } from './bitAnd.js';
import { bitNot } from './bitNot.js';
import { bitOr } from './bitOr.js';
import { bitXor } from './bitXor.js';
import { count } from './count.js';
import { createPList } from './createPList.js';
import { emptyp } from './emptyp.js';
import { evenp } from './evenp.js';
import { first } from './first.js';
import { item } from './item.js';
import { listp } from './listp.js';
import { max } from './max.js';
import { min } from './min.js';
import { not } from './not.js';
import { oddp } from './oddp.js';
import { or } from './or.js';
import { product } from './product.js';
import { stringp } from './stringp.js';
import { sum } from './sum.js';

export const commandsMap = new Map([
['and', and],
['bitAnd', bitAnd],
['bitNot', bitNot],
['bitOr', bitOr],
['bitXor', bitXor],
['count', count],
['createPList', createPList],
['emptyp', emptyp],
['evenp', evenp],
['first', first],
['item', item],
['listp', listp],
['max', max],
['min', min],
['not', not],
['oddp', oddp],
['or', or],
['product', product],
['stringp', stringp],
['sum', sum],
]);

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