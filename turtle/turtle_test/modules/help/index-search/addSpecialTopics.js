import { ArrayUtils } from '../../ArrayUtils.js';
import { fetchJson } from '../../fetchJson.js';
import { IndexSearchTopic } from './IndexSearchTopic.js';
import { showKeywords } from '../showKeywords.js';
import { showOperatorsHelp } from '../showOperatorsHelp.js';
const operatorSymbols = (await fetchJson('json/operators.json')).map(opInfo => opInfo.symbol);

const operatorsTopic = new IndexSearchTopic(IndexSearchTopic.TopicTypeOperator, {
	'primaryName': 'Operators',
	'searchKeywords': operatorSymbols
}, showOperatorsHelp);
const keywordsTopic = new IndexSearchTopic(IndexSearchTopic.TopicTypeGeneral, {
	'primaryName': 'Keywords',
	'searchKeywords': ['end', 'to', 'true', 'false']
}, showKeywords);

const specialTopics = [keywordsTopic, operatorsTopic];

export function addSpecialTopics(topics) {
	ArrayUtils.pushAll(topics, specialTopics);
};