// titlecustom.js
export default function decorate(block) {
  // grab the three field placeholders in the order defined in your JSON
  const placeholders = Array.from(block.querySelectorAll(':scope > div'));
  const titleDiv = placeholders[0];
  const colorDiv = placeholders[1];
  const typeDiv = placeholders[2];

  // extract their values (with sensible defaults)
  const titleText = titleDiv?.textContent.trim() || '';
  const colorHex = colorDiv?.textContent.trim() || '#000000';
  const tagName = (typeDiv?.textContent.trim() || 'h2').toLowerCase();

  // build the heading
  const heading = document.createElement(tagName);
  heading.classList.add('titlecustom-heading');
  heading.textContent = titleText;
  heading.style.color = colorHex;

  // replace the entire block with our new heading
  block.textContent = '';
  block.appendChild(heading);
}
