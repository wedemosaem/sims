/* cards-section.js */
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // use the container styles from global CSS
  block.classList.add('container');

  // get placeholders: pairs of [image holder, content holder]
  const children = Array.from(block.children);
  // clear existing
  block.textContent = '';

  for (let i = 0; i < children.length; i += 2) {
    const imgHolder = children[i];
    const contentHolder = children[i + 1];

    // image source and alt
    const rawImg = imgHolder.querySelector('img');
    const src = rawImg ? rawImg.src : imgHolder.textContent.trim();
    const alt = rawImg?.alt || '';

    // optimized picture
    const picture = createOptimizedPicture(src, alt, false, [
      { width: '1200' },
      { width: '800' },
      { width: '400' },
    ]);
    picture.classList.add('card-img');

    // build card element
    const card = document.createElement('div');
    card.className = 'card';
    card.append(picture);

    // build content wrapper
    const content = document.createElement('div');
    content.className = 'card-content';
    // move heading and paragraph
    Array.from(contentHolder.children).forEach((el) => content.append(el));

    card.append(content);
    block.append(card);
  }
}
