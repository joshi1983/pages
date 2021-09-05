import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';

export function testDataListType(logger) {
	const dataListType = DataTypes.createFromName('list');
	if (typeof dataListType !== 'object')
		logger('dataListType expected to be an object');
};