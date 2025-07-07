// banner.js
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  block.classList.add('banner');

  // 1. Your two placeholders:
  const [imgHolder, contentHolder] = Array.from(block.children);

  // 2. Get the URL (prefer an <img>, otherwise plain text)
  const rawImg = imgHolder.querySelector('img');
  const src = rawImg ? rawImg.src : imgHolder.textContent.trim();
  const alt = rawImg?.alt || contentHolder.querySelector('h1')?.textContent || '';

  // 3. Build an optimized <picture>
  const picture = createOptimizedPicture(src, alt, false, [
    { width: '1200' },
    { width: '800' },
    { width: '400' },
  ]);
  picture.classList.add('banner-bg');

  // 4. Move your content into .banner-content
  const content = document.createElement('div');
  content.className = 'banner-content';
  while (contentHolder.firstChild) {
    content.append(contentHolder.firstChild);
  }

  // 5. Clear and re-append
  block.textContent = '';
  block.append(picture, content);
}
