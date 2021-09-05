import { Bitmap } from '../components/image-formats/Bitmap.js';
import { genericDataToImageDataUrl } from './genericDataToImageDataUrl.js';

const bmpDataToImageDataUrl = genericDataToImageDataUrl(Bitmap);

export { bmpDataToImageDataUrl };