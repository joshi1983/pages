import { Dialog } from '../components/Dialog.js';
import { DialogGroups } from '../components/dialog/DialogGroups.js';
import { fetchText } from '../fetchText.js';
import { Operators } from '../parsing/Operators.js';
import { populateTemplateUsingObject } from '../populateTemplateUsingObject.js';
import { processHelpLinks } from './processHelpLinks.js';
import { processOperatorDescription } from './operator-details/processOperatorDescription.js';
import { processOperatorInputs } from './operator-details/processOperatorInputs.js';
import { processOperatorOutputs } from './operator-details/processOperatorOutputs.js';
import { processOperatorSymbol } from './operator-details/processOperatorSymbol.js';
import { processSeeAlsoCommands } from './operator-details/processSeeAlsoCommands.js';
import { processUnaryOperator } from './operator-details/processUnaryOperator.js';
import { PushStates } from '../components/PushStates.js';
const operatorDetailsHTML = await fetchText('content/help/logo-language-topics/operator-details-template.html');
await Operators.asyncInit();

export class OperatorDetails {
	static showDetails(operatorSymbol, autoPushState) {
		if (typeof operatorSymbol !== 'string')
			throw new Error('showDetails requires a string for operatorSymbol.');

		if (autoPushState !== false) {
			PushStates.add(function() {
				OperatorDetails.showDetails(operatorSymbol, false);
			});
		}
		const operatorInfo = Operators.getOperatorInfo(operatorSymbol);
		const html = populateTemplateUsingObject(operatorDetailsHTML, operatorInfo);
		Dialog.show(html, operatorInfo.name.toUpperCase() + ' Operator Details', undefined, undefined, {
			'className': 'operator-details',
			'groupId': DialogGroups.HELP,
			'iconClass': 'dialog-icon operators-icon'
		});
		processOperatorSymbol(operatorInfo);
		processOperatorDescription(operatorInfo);
		processOperatorInputs(operatorInfo);
		processOperatorOutputs(operatorInfo);
		processSeeAlsoCommands(operatorInfo);
		processUnaryOperator(operatorInfo);
		processHelpLinks();
	}
};