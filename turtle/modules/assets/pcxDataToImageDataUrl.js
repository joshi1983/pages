import { genericDataToImageDataUrl } from './genericDataToImageDataUrl.js';
import { PCX } from '../components/image-formats/PCX.js';

const pcxDataToImageDataUrl = genericDataToImageDataUrl(PCX);

export { pcxDataToImageDataUrl };