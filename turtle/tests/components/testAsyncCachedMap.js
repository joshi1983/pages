import { AsyncCachedMap } from '../../modules/components/AsyncCachedMap.js';

export async function testAsyncCachedMap(logger) {
	const map = new AsyncCachedMap(getter, 2);

	function getter(key) {
		return new Promise(function(resolve) {
			resolve(key * 2);
		});
	}

	const result1 = await map.get(3);
	if (result1 !== 6)
		logger(`Expected to get 6 but got ${result1}`);
	if (map.map.size !== 1)
		logger(`Expected map.map.size to be 1 but got ${map.map.size}`);
	const result1a = await map.get(3);
	if (result1a !== 6)
		logger(`After second time running get(3), expected to get 6 but got ${result1a}`);
	if (map.map.size !== 1)
		logger(`After second time running get(3), expected map.map.size to be 1 but got ${map.map.size}`);
	const result2 = await map.get(5);
	if (result2 !== 10)
		logger(`Expected to get 10 but got ${result2}`);
	if (map.map.size !== 2)
		logger(`After running get(5), expected map.map.size to be 2 but got ${map.map.size}`);

	const result3 = await map.get(7);
	if (result3 !== 14)
		logger(`Expected to get 14 but got ${result3}`);
	if (map.map.size !== 2)
		logger(`After running get(7), expected map.map.size to be 2 but got ${map.map.size}`);
	if (map.readAgeMap.size !== 2)
		logger(`After running get(7), expected map.readAgeMap.size to be 2 but got ${map.readAgeMap.size}`);
	map.dispose();
};