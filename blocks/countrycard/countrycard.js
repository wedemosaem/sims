// countrycards.js
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // 1. Namespace the root
  block.classList.add('countrycards');

  // 2. Build a UL wrapper
  const ul = document.createElement('ul');

  // 3. For each original “row” (one card’s placeholders)
  Array.from(block.children).forEach((row) => {
    const li = document.createElement('li');

    // 3a. Extract the three placeholders
    const [imgHolder, headingHolder, colorHolder] = Array.from(row.children);

    // 3b. Determine image src & alt
    const rawImg = imgHolder.querySelector('img');
    const src = rawImg ? rawImg.src : imgHolder.textContent.trim();
    const alt = rawImg?.alt || headingHolder.textContent.trim() || '';

    // 3c. Create optimized <picture> as true background
    const picture = createOptimizedPicture(src, alt, false, [
      { width: '1200' },
      { width: '800' },
      { width: '400' },
    ]);
    picture.classList.add('countrycards-bg');
    li.append(picture);

    // 3d. Read heading text & color
    const headingText = headingHolder.textContent.trim();
    const textColor = colorHolder.textContent.trim();

    // 3e. Build the overlaid content
    const content = document.createElement('div');
    content.className = 'countrycard-content';
    content.style.color = textColor;

    const h2 = document.createElement('h2');
    h2.textContent = headingText;

    const p = document.createElement('p');
    p.textContent = 'Keep using your apps and social media without complications.';

    content.append(h2, p);
    li.append(content);

    // 3f. Add this card to the UL
    ul.append(li);
  });

  // 4. Replace original placeholders with our new structure
  block.textContent = '';
  block.append(ul);
}
