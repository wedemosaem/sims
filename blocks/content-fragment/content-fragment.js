// put your AEM publish address here
// this fixes having to manually change the AEM host here

function checkDomain() {
  if (window.location.hostname.includes('hlx.page') || window.location.hostname.includes('localhost')) {
    return 'https://publish-p157306-e1665625.adobeaemcloud.com/';
  }
  return window.location.origin;
}

const AEM_HOST = checkDomain();

export default function decorate(block) {
  const slugDiv = block.querySelector('div:nth-child(1)');
  const slugID = document.createElement('div');
  slugID.id = 'slug';
  slugDiv.replaceWith(slugID);
  slugID.innerHTML = `${slugDiv.innerHTML}`;
  const slug = slugID.textContent.trim();
  const quoteDiv = block.querySelector('div:last-of-type');
  const adventureDiv = document.createElement('div');
  adventureDiv.id = `adventure-${slug}`;
  quoteDiv.replaceWith(adventureDiv);

  fetch(`${AEM_HOST}/graphql/execute.json/aem-demo-assets/adventure-by-slug;slug=${slug}`)
    .then((response) => response.json())
    .then((response) => {
      const { items } = response.data.adventureList;
      const adventure = items[0];
      const { _path: backgroundImage } = adventure.primaryImage;
      document.getElementById(adventureDiv.id).innerHTML = `<section><img src='${AEM_HOST}${backgroundImage}'></section>`;

      const { title: adventureTitle } = adventure;
      document.getElementById(adventureDiv.id).innerHTML += `<section><h3>${adventureTitle}</h3></section>`;

      const { plaintext: adventureDesc } = adventure.description;
      document.getElementById(adventureDiv.id).innerHTML += `<section>${adventureDesc}</section>`;

      const { adventureType } = adventure;
      document.getElementById(adventureDiv.id).innerHTML += `<section>Adventure Type: ${adventureType}</section>`;

      const { tripLength } = adventure;
      document.getElementById(adventureDiv.id).innerHTML += `<section>Trip Length: ${tripLength}</section>`;

      const { difficulty: tripDifficulty } = adventure;
      document.getElementById(adventureDiv.id).innerHTML += `<section>Difficulty: ${tripDifficulty}</section>`;

      const { groupSize } = adventure;
      document.getElementById(adventureDiv.id).innerHTML += `<section>Group Size: ${groupSize}</section>`;

      const { html: tripItinerary } = adventure.itinerary;
      document.getElementById(adventureDiv.id).innerHTML += `<section>Itinerary: <br/>${tripItinerary}</section>`;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('Error fetching data:', error);
    });
}
