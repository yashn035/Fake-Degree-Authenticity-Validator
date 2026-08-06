import { imageHash } from 'image-hash';
import { promisify } from 'util';

export async function generateImageHash(imagePath) {
  return new Promise((resolve, reject) => {
    imageHash(imagePath, 16, true, (err, hash) => {
      if (err) reject(err);
      else resolve(hash);
    });
  });
}
