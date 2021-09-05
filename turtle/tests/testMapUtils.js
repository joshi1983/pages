import { MapUtils } from '../modules/MapUtils.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';

function testMerge(logger) {
	const map1 = new Map([['x', 1], ['y', 2]]);
	const map2 = new Map([['z', 8]]);
	MapUtils.merge(map1, map2);
	if (map2.size !== 1)
		logger(`map2.size expected to remain at 1 but got ${map2.size}`);
	if (map1.size !== 3)
		logger(`map1.size expected to be 3 but got ${map1.size}`);
	else if (map1.has('z') !== true)
		logger(`map1.has('z') expected to return true but got ${map1.has('z')}`);
}

export function testMapUtils(logger) {
	testMerge(prefixWrapper('testMerge', logger));
};