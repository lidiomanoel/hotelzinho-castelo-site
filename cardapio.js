const monthlyMenu = {
  1: [
    { day: 'Segunda-feira', meals: ['Banana e pão caseiro', 'Arroz, feijão, frango desfiado, abóbora e cenoura', 'Cuscuz com ovo mexido'] },
    { day: 'Terça-feira', meals: ['Mamão', 'Arroz, feijão, carne moída e chuchu cozido', 'Bolo caseiro e melancia'] },
    { day: 'Quarta-feira', meals: ['Melão e tapioca', 'Macarrão com frango e legumes', 'Pão com queijo e fruta da estação'] },
    { day: 'Quinta-feira', meals: ['Pera', 'Arroz, feijão, peixe assado e purê de macaxeira', 'Cuscuz com manteiga'] },
    { day: 'Sexta-feira', meals: ['Maçã', 'Arroz, feijão, almôndegas caseiras e abobrinha', 'Bolo de milho e banana'] },
  ],
  2: [
    { day: 'Segunda-feira', meals: ['Melancia', 'Arroz, feijão, frango ao molho e batata-doce', 'Tapioca com queijo'] },
    { day: 'Terça-feira', meals: ['Banana', 'Purê de macaxeira com carne moída e legumes', 'Pão caseiro e mamão'] },
    { day: 'Quarta-feira', meals: ['Mamão e cuscuz', 'Arroz, feijão, ovo mexido e abóbora cozida', 'Bolo simples e melão'] },
    { day: 'Quinta-feira', meals: ['Pera', 'Macarrão com carne e molho de tomate caseiro', 'Cuscuz com frango desfiado'] },
    { day: 'Sexta-feira', meals: ['Melão', 'Arroz, feijão, peixe assado e legumes cozidos', 'Pão com banana amassada'] },
  ],
  3: [
    { day: 'Segunda-feira', meals: ['Mamão', 'Arroz, feijão, carne de panela desfiada e cenoura', 'Cuscuz com queijo'] },
    { day: 'Terça-feira', meals: ['Banana e tapioca', 'Arroz, feijão, frango assado e purê de abóbora', 'Bolo caseiro e melancia'] },
    { day: 'Quarta-feira', meals: ['Melão', 'Macarrão com carne moída e legumes', 'Pão caseiro com ovo mexido'] },
    { day: 'Quinta-feira', meals: ['Pera', 'Arroz, feijão, frango desfiado e chuchu', 'Tapioca com queijo e fruta'] },
    { day: 'Sexta-feira', meals: ['Maçã', 'Arroz, feijão, carne moída e batata-doce', 'Cuscuz e banana'] },
  ],
  4: [
    { day: 'Segunda-feira', meals: ['Melancia', 'Arroz, feijão, frango ensopado e legumes', 'Pão caseiro com queijo'] },
    { day: 'Terça-feira', meals: ['Mamão e cuscuz', 'Macaxeira cozida com carne desfiada e cenoura', 'Bolo simples e melão'] },
    { day: 'Quarta-feira', meals: ['Banana', 'Arroz, feijão, omelete e abobrinha cozida', 'Tapioca com frango desfiado'] },
    { day: 'Quinta-feira', meals: ['Pera', 'Macarrão com frango, tomate e legumes', 'Cuscuz com queijo e fruta'] },
    { day: 'Sexta-feira', meals: ['Melão', 'Arroz, feijão, carne de panela e purê de batata', 'Pão caseiro e banana'] },
  ],
};

const weekTabs = [...document.querySelectorAll('.week-tab')];
const weekPanel = document.querySelector('#week-panel');
const weekTitle = document.querySelector('#week-title');
const weekSubtitle = document.querySelector('#week-subtitle');
const printButton = document.querySelector('#print-menu');

const mealLabels = [
  { label: 'Lanche da manhã', icon: '☀' },
  { label: 'Almoço', icon: '🍽' },
  { label: 'Lanche da tarde', icon: '♡' },
];

function renderWeek(weekNumber) {
  const days = monthlyMenu[weekNumber];
  if (!weekPanel || !days) return;

  weekTabs.forEach((tab) => {
    const selected = Number(tab.dataset.week) === weekNumber;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  weekPanel.setAttribute('aria-labelledby', `week-tab-${weekNumber}`);
  weekTitle.textContent = `Semana ${weekNumber}`;
  weekSubtitle.textContent = 'De segunda a sexta · exemplo de refeições';

  weekPanel.innerHTML = days.map((day, dayIndex) => `
    <article class="menu-day-card" style="--day-color: ${['#f1c232', '#119bd2', '#e89580', '#70b5a2', '#b7a2d6'][dayIndex]}">
      <div class="menu-day-heading">
        <h3>${day.day}</h3>
        <span class="day-badge">${String(dayIndex + 1).padStart(2, '0')}</span>
      </div>
      <div class="meal-list">
        ${day.meals.map((meal, mealIndex) => `
          <div class="meal-row">
            <span class="meal-label"><span aria-hidden="true">${mealLabels[mealIndex].icon}</span>${mealLabels[mealIndex].label}</span>
            <p class="meal-item">${meal}</p>
          </div>
        `).join('')}
      </div>
    </article>
  `).join('');
}

weekTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => renderWeek(Number(tab.dataset.week)));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? weekTabs.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + weekTabs.length) % weekTabs.length;
    weekTabs[nextIndex].focus();
    renderWeek(Number(weekTabs[nextIndex].dataset.week));
  });
});

printButton?.addEventListener('click', () => window.print());
renderWeek(1);
