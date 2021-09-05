const tutorialIndexKey = 'tutorialIndex';

export function wasTutorialUsed() {
	return localStorage.getItem(tutorialIndexKey) !== null;
};

export function getTutorialFromLocalStorage() {
	const result = localStorage.getItem(tutorialIndexKey);
	if (result === null || isNaN(result))
		return -1;
	else
		return parseInt(result);
};

export function setTutorialFromLocalStorage(index) {
	if (typeof index !== 'number')
		throw new Error('index must be a number');
	return localStorage.setItem(tutorialIndexKey, '' + index);
};