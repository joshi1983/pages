import { GlossaryRepository } from '../../modules/components/GlossaryRepository.js';

export function testGlossaryRepository(logger) {
	const algorithmInfo = GlossaryRepository.getInfoByName('algorithm');
	if (typeof algorithmInfo !== 'object')
		logger(`Expected algorithmInfo to be an object but got ${algorithmInfo}`);
	const allData = GlossaryRepository.getAllTermsData();
	if (!(allData instanceof Array))
		logger(`getAllTermsData() expected to return an Array but got ${getAllTermsData}`);
};