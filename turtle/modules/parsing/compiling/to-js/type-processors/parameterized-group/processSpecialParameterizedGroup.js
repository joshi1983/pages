import { booleanp } from './booleanp.js';
import { createPList2 } from './createPList2.js';
import { do_while } from './do_while.js';
import { for_ } from './for_.js';
import { forever } from './forever.js';
import { hasProperty } from './hasProperty.js';
import { hypot } from './hypot.js';
import { if_ } from './if_.js';
import { ifelse } from './ifelse.js';
import { item } from './item.js';
import { make } from './make.js';
import { output } from './output.js';
import { stringp } from './stringp.js';
import { substringp } from './substringp.js';
import { until } from './until.js';
import { while_ } from './while_.js';

const nameProcessorsMap = new Map([
	['boolean?', booleanp],
	['createPList2', createPList2],
	['do.while', do_while],
	['for', for_],
	['hasProperty', hasProperty],
	['if', if_],
	['localmake', make],
	['string?', stringp],
	['substring?', substringp],
	['while', while_]
]);
for (const f of [forever, hypot, ifelse, item, make, output, until]) {
	nameProcessorsMap.set(f.name, f);
}

export function processSpecialParameterizedGroup(token, result) {
	const processor = nameProcessorsMap.get(token.val);
	if (processor !== undefined) {
		processor(token, result);
		return true;
	}
};