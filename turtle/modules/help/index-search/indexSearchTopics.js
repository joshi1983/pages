import { addCommandTopics } from './addCommandTopics.js';
import { addDataTypeTopics } from './addDataTypeTopics.js';
import { addGeneralHelpTopics } from './addGeneralHelpTopics.js';
import { addOperatorTopics } from './addOperatorTopics.js';
import { addSpecialTopics } from './addSpecialTopics.js';
import { addTutorialTopics } from './addTutorialTopics.js';

function compareByPrimaryName(topic1, topic2) {
	return topic1.primaryName.toLowerCase().localeCompare(topic2.primaryName.toLowerCase());
}

const indexSearchTopics = [];
addCommandTopics(indexSearchTopics);
addDataTypeTopics(indexSearchTopics);
addGeneralHelpTopics(indexSearchTopics);
addOperatorTopics(indexSearchTopics);
addSpecialTopics(indexSearchTopics);
addTutorialTopics(indexSearchTopics);

indexSearchTopics.sort(compareByPrimaryName);
export { indexSearchTopics };