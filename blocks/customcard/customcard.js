// customcard.js
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // 0. If we're wrapped in a <p>, unwrap ourselves entirely
  const wrapperP = block.closest('p');
  if (wrapperP) {
    wrapperP.parentElement.replaceChild(block, wrapperP);
  }

  block.classList.add('customcard');

  // 1. Grab exactly the three placeholder DIVs under our block
  const placeholders = Array.from(block.querySelectorAll(':scope > div'));
  const [imgHolder, headingHolder, colorHolder] = placeholders;

  // 2. Get image URL & alt
  const rawImg = imgHolder.querySelector('img');
  const src = rawImg ? rawImg.src : imgHolder.textContent.trim();
  const alt = rawImg?.alt || headingHolder.textContent.trim() || '';

  // 3. Build optimized <picture> and mark it as our background
  const picture = createOptimizedPicture(src, alt, false, [
    { width: '1200' },
    { width: '800' },
    { width: '400' },
  ]);
  picture.classList.add('customcard-bg');

  // 4. Read heading text & the hex color (or default to white)
  const headingText = headingHolder.textContent.trim();
  let textColor = colorHolder?.textContent.trim();
  if (!textColor) textColor = '#ffffff';

  // 5. Build the overlay content
  const content = document.createElement('div');
  content.className = 'customcard-content';
  content.style.color = textColor;

  const h2 = document.createElement('h2');
  h2.textContent = headingText;

  const p = document.createElement('p');
  p.textContent = 'Keep using your apps and social media without complications.';

  content.append(h2, p);

  // 6. Clear out any placeholders and append bg + overlay
  block.textContent = '';
  block.append(picture, content);
}
