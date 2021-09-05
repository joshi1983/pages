import { ArrayUtils } from '../../ArrayUtils.js';
import { fetchJson } from '../../fetchJson.js';
import { IndexSearchTopic } from './IndexSearchTopic.js';
import { showColorBlendModeHelp } from '../showColorBlendModeHelp.js';
import { showGlossary } from '../showGlossary.js';
import { showKeywords } from '../showKeywords.js';
import { showOperatorsHelp } from '../showOperatorsHelp.js';
const operatorSymbols = (await fetchJson('json/operators.json')).map(opInfo => opInfo.symbol);

const blendModesTopic = new IndexSearchTopic(IndexSearchTopic.TopicTypeGeneral, {
	'primaryName': 'Color Blend Modes',
	'searchKeywords': ['blend modes', 'color blend modes', 'mix', 'modes']
}, showColorBlendModeHelp);

const glossaryTopic = new IndexSearchTopic(IndexSearchTopic.TopicTypeGlossaryTerm, {
	'primaryName': 'Glossary',
	'searchKeywords': ['definition', 'definitions', 'terms']
}, showGlossary);

const keywordsTopic = new IndexSearchTopic(IndexSearchTopic.TopicTypeGeneral, {
	'primaryName': 'Keywords',
	'searchKeywords': ['end', 'to', 'true', 'false']
}, showKeywords);

const operatorsTopic = new IndexSearchTopic(IndexSearchTopic.TopicTypeOperator, {
	'primaryName': 'Operators',
	'searchKeywords': operatorSymbols
}, showOperatorsHelp);

const specialTopics = [blendModesTopic, glossaryTopic, keywordsTopic, operatorsTopic];

export function addSpecialTopics(topics) {
	ArrayUtils.pushAll(topics, specialTopics);
};