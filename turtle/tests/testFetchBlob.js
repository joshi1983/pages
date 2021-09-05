import { fetchBlob } from '../modules/fetchBlob.js';

export async function testFetchBlob(logger) {
	// check that no JavaScript error is thrown.
	const blob = await fetchBlob('images/logo-32px.png');
};