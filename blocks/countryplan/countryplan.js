// esim-plan-block.js

function checkDomain() {
  if (window.location.hostname.includes('hlx.page') || window.location.hostname.includes('localhost')) {
    return 'https://publish-p157306-e1665625.adobeaemcloud.com/';
  }
  return window.location.origin;
}

const AEM_HOST = checkDomain();
// countryplan.js
export default async function decorate(block) {
  block.classList.add('esim-plan');

  // Extract country slug from URL
  const segments = window.location.pathname
    .split('/')
    .filter(Boolean);
  const country = segments[segments.length - 1].toLowerCase();

  // Fetch GraphQL data
  const url = `${AEM_HOST}/graphql/execute.json/aem-demo-assets/esimplan-by-country;country=${country}`;
  let plan;

  try {
    const response = await fetch(url);
    const json = await response.json();
    const { items } = json.data.esimPlanList;
    [plan] = items;
  } catch {
    block.textContent = 'Unable to load eSIM plan.';
    return;
  }

  // Build header
  const header = document.createElement('div');
  header.className = 'data-plan__header';

  const flag = document.createElement('div');
  flag.className = 'data-plan__flag';

  const title = document.createElement('h2');
  title.className = 'data-plan__title';
  title.textContent = plan.title;

  const currency = document.createElement('div');
  currency.className = 'data-plan__currency';
  const currencySelect = document.createElement('select');
  ['Euros', 'Dollars', 'Pounds'].forEach((c) => {
    const option = document.createElement('option');
    option.textContent = c;
    currencySelect.append(option);
  });
  currency.append(currencySelect);

  header.append(flag, title, currency);

  // Helper to build rows
  const makeRow = (main, sub, options) => {
    const row = document.createElement('div');
    row.className = 'data-plan__row';

    const label = document.createElement('div');
    label.className = 'data-plan__label';
    const mainSpan = document.createElement('span');
    mainSpan.className = 'label__main';
    mainSpan.textContent = main;
    const subSpan = document.createElement('span');
    subSpan.className = 'label__sub';
    subSpan.textContent = sub;
    label.append(mainSpan, subSpan);

    const selectWrapper = document.createElement('div');
    selectWrapper.className = 'data-plan__select';
    const select = document.createElement('select');
    options.forEach((o) => {
      const opt = document.createElement('option');
      opt.textContent = o;
      select.append(opt);
    });
    selectWrapper.append(select);

    row.append(label, selectWrapper);
    return row;
  };

  const rowDays = makeRow(
    'Select number of days',
    'Add the number of travel days',
    ['1', '2', '3', '4'],
  );

  const rowPeople = makeRow(
    'Select number of people',
    'Add the number of travelers',
    ['1', '2', '3'],
  );

  // Total and CTA
  const total = document.createElement('div');
  total.className = 'data-plan__total';
  const totalLabel = document.createElement('span');
  totalLabel.textContent = 'Total price';
  const amount = document.createElement('span');
  amount.className = 'amount';
  amount.textContent = `€${plan.price.toFixed(2)}`;
  total.append(totalLabel, amount);

  const ctaWrapper = document.createElement('div');
  ctaWrapper.className = 'data-plan__cta';
  const button = document.createElement('button');
  button.textContent = `Continue to checkout €${plan.price.toFixed(2)}`;
  ctaWrapper.append(button);

  // Plan summary
  const summary = document.createElement('div');
  summary.className = 'plan-summary';
  const summaryTitle = document.createElement('h2');
  summaryTitle.textContent = 'Plan Summary';
  summary.append(summaryTitle);

  const card = document.createElement('div');
  card.className = 'plan-card';

  const items = [
    { icon: 'data_usage', title: 'Plan', sub: plan.plan },
    { icon: 'call', title: 'Calls and SMS', sub: plan.callsandsms },
    { icon: 'event', title: 'Validity period', sub: plan.validityperiod },
    { icon: 'public', title: 'Networks', sub: plan.networks },
    { icon: 'wifi_tethering', title: 'Tethering/Hotspot', sub: plan.tetheringhotspot },
  ];

  items.forEach((item) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'plan-item';
    const iconSpan = document.createElement('span');
    iconSpan.className = 'material-icons';
    iconSpan.textContent = item.icon;

    const textDiv = document.createElement('div');
    textDiv.className = 'item-text';
    const titleDiv = document.createElement('div');
    titleDiv.className = 'item-title';
    titleDiv.textContent = item.title;
    const subDiv = document.createElement('div');
    subDiv.className = 'item-subtitle';
    subDiv.textContent = item.sub;
    textDiv.append(titleDiv, subDiv);

    itemDiv.append(iconSpan, textDiv);
    card.append(itemDiv);
  });

  summary.append(card);

  // Render block
  block.textContent = '';
  block.append(header, rowDays, rowPeople, total, ctaWrapper, summary);
}
