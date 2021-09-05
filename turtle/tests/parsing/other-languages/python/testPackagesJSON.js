import { fetchJson } from '../../../../modules/fetchJson.js';
const packagesData = await fetchJson('json/logo-migrations/python/packages.json');

export function testPackagesJSON(logger) {
	packagesData.forEach(function(packageInfo, index) {
		if (typeof packageInfo === 'object' && packageInfo !== null) {
			if (typeof packageInfo.name !== 'string')
				logger(`name must be a string but found ${packageInfo.name}`);
			else if (index > 0) {
				const prev = packagesData[index - 1];
				if (typeof prev === 'object' && prev !== null && typeof prev.name === 'string') {
					if (prev.name >= packageInfo.name)
						logger(`names are out of order.  previous name ${prev.name} and ${packageInfo.name} at index ${index}`);
				}
			}
		}
	});
};