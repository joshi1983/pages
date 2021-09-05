import { ArrayUtils } from '../../ArrayUtils.js';
import { DataTypes } from '../../parsing/data-types/DataTypes.js';
import { IndexSearchTopic } from './IndexSearchTopic.js';
import { getHelpIndexedTypes, helpUrlToEnglish, showDataTypesHelp } from '../showDataTypesHelp.js';
import { showDedicatedColorHelp } from '../showDedicatedColorHelp.js';

function dataTypeToTopic(type) {
	const helpUrl = type.name === 'color' ? 'color' : type.constructor.helpUrl;
	function click() {
		if (type.name === 'color')
			showDedicatedColorHelp();
		else
			showDataTypesHelp(type.constructor.helpUrl);
	}
	const info = {
		'primaryName': helpUrlToEnglish(helpUrl)
	};
	return new IndexSearchTopic(IndexSearchTopic.TopicTypeDataType, info, click);
}
const dataTypesTopic = new IndexSearchTopic(IndexSearchTopic.TopicTypeDataType, {
	'primaryName': 'Data Types',
	'searchKeywords': getHelpIndexedTypes().map(type => type.name),
}, showDataTypesHelp);

const dataTypeTopics = [dataTypesTopic, ...getHelpIndexedTypes().map(dataTypeToTopic)];

export function addDataTypeTopics(topics) {
	ArrayUtils.pushAll(topics, dataTypeTopics);
};