// put your AEM publish address here
// this fixes having to manually change the AEM host here
function checkDomain() {
  if (
    window.location.hostname.includes('hlx.page')
    || window.location.hostname.includes('localhost')
    || window.location.hostname.includes('aem.page')
  ) {
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
  const fichaDiv = document.createElement('div');
  fichaDiv.id = `ficha-${slug}`;
  quoteDiv.replaceWith(fichaDiv);

  fetch(`${AEM_HOST}/graphql/execute.json/aem-demo-assets/item-by-id;slug=${slug}`)
    .then((response) => response.json())
    .then((response) => {
      const item = response.data.peliculaList.items[0];
      const { cover } = item;
      const coverImagePath = `${AEM_HOST}${cover.path}`;
      const { titulo, calificacion } = item;
      const sinopsis = item.sinopsis.plaintext;
      const info = item.info.plaintext;
      const equipoTecnico = item.equipotecnico.plaintext;
      fichaDiv.innerHTML = `
        <div class="ficha-container">
          <div class="ficha-column ficha-column-left">
            <img src="${coverImagePath}">
            Valoracion de usuarios
            <div class="ee-stars">
              <div class="rating-content j-stars">
                <div class="stars">
                  <a href="https://www.movistarplus.es/valoracion?p=5&amp;elemento=519034" title="Muy bien" class="vote-5 " rel="nofollow" data-telemetry-payload="seccion:rating_5"><span>5</span></a>
                  <a href="https://www.movistarplus.es/valoracion?p=4&amp;elemento=519034" title="Bien" class="vote-4 " rel="nofollow" data-telemetry-payload="seccion:rating_4"><span>4</span></a>
                  <a href="https://www.movistarplus.es/valoracion?p=3&amp;elemento=519034" title="Regular" class="vote-3  fill " rel="nofollow" data-telemetry-payload="seccion:rating_3"><span>3</span></a>
                  <a href="https://www.movistarplus.es/valoracion?p=2&amp;elemento=519034" title="Mal" class="vote-2  fill " rel="nofollow" data-telemetry-payload="seccion:rating_2"><span>2</span></a>
                  <a href="https://www.movistarplus.es/valoracion?p=1&amp;elemento=519034" title="Muy mal" class="vote-1  fill " rel="nofollow" data-telemetry-payload="seccion:rating_1"><span>1</span></a>
                </div>
                <div class="rating-value">
                  <span class="rating">3</span>
                  <span class="ratingC">733</span>
                  <span>votos</span>
                </div>
              </div>
            </div>
          </div>
          <div class="ficha-column ficha-column-right">
            <h4>Titulo</h4>
            <p>${titulo}</p>
            <h4>Sinopsis</h4>
            <p>${sinopsis}</p>
            <h4>info</h4>
            <p>${info}</p>
            <h4>Calificacion</h4>
            <p>${calificacion}</p>
            <h4>Equipo Tecnico</h4>
            <p>${equipoTecnico}</p>
          </div>
        </div>
      `;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('Error fetching data:', error);
    });
}
