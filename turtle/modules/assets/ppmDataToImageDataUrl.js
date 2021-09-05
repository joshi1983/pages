import { genericDataToImageDataUrl } from './genericDataToImageDataUrl.js';
import { PPM } from '../components/image-formats/PPM.js';

const ppmDataToImageDataUrl = genericDataToImageDataUrl(PPM);

export { ppmDataToImageDataUrl };