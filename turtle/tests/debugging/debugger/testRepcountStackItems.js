import { RepcountStackItems } from '../../../modules/debugging/debugger/RepcountStackItems.js';

export function testRepcountStackItems(logger) {
	const e = document.createElement('div');
	const stack = [];
	const items = new RepcountStackItems(stack);
	const divs1 = items.getDivs();
	if (divs1.length !== 0)
		logger('Expected 0 divs but got ' + divs1.length);
	items.refreshContainer(e);
	stack.push({'max': 3, 'current': 1});
	const divs2 = items.getDivs();
	if (divs2.length !== 1)
		logger('Expected 1 div but got ' + divs2.length);
	const stack2 = [];
	items.setStack(stack2);
	if (items.items.size !== 0)
		logger('Expected items to clear for a size of 0 when setting new stack but got a size of ' + items.items.size);
	items.refreshContainer(e);
};