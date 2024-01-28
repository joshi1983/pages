import { ColorHTMLTokenProcessor } from './ColorHTMLTokenProcessor.js';
import { LongStringHTMLTokenProcessor } from './LongStringHTMLTokenProcessor.js';

const processors = [
ColorHTMLTokenProcessor,
LongStringHTMLTokenProcessor
];

export class GeneralHTMLTokenProcessor {
	static isApplicableTo(token) {
		for (let i = 0; i < processors.length; i++) {
			if (processors[i].isApplicableTo(token))
				return true;
		}
		return false;
	}

	static toHTML(token) {
		for (let i = 0; i < processors.length; i++) {
			const processor = processors[i];
			if (processor.isApplicableTo(token))
				return processor.toHTML(token);
		}
	}
};