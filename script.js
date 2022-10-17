let valueInput = 0;
const onChange = function (evt) {
  valueInput = evt.target.value;
};

const input = document.getElementById('num');
input.addEventListener('input', onChange, false);

console.clear();

const costAB = 700;
const costBA = 1200;
const travelTimeMinutes = 50;
const travelMilliseconds50 = 3000000;

const timesAB = `
  2022-09-22 18:00:00
  2022-09-22 18:30:00
  2022-09-22 18:45:00
  2022-09-22 19:00:00
  2022-09-22 19:15:00
  2022-09-22 21:00:00
`;

const timesBA = `
  2022-09-22 18:30:00
  2022-09-22 18:45:00
  2022-09-22 19:00:00
  2022-09-22 19:15:00
  2022-09-22 19:35:00
  2022-09-22 21:50:00
  2022-09-22 21:55:00
`;

const parseTimes = (times) =>
  times
    .trim()
    .split('\n')
    .map((str) => new Date(str.trim()));

const datesAB = parseTimes(timesAB);
const datesBA = parseTimes(timesBA);
const el = Object.fromEntries(
  ['direction', 'timesAB', 'timesBA', 'blockAB', 'blockBA', 'output'].map(
    (id) => [id, document.getElementById(id)]
  )
);
const timeStart = (n) => n.toString().padStart(2, '0');

const createOptions = (datesArray, id) => {
  datesArray.forEach((time) => {
    const option = document.createElement('option');
    option.value = time.getTime();

    option.innerText = `${timeStart(time.getHours())}:${timeStart(
      time.getMinutes()
    )}`;
    el[id].appendChild(option);
  });
};

createOptions(datesAB, 'timesAB');
createOptions(datesBA, 'timesBA');

const filterBAOptions = () => {
  let latest = 0;

  if (el.direction.value & 1) {
    latest = +el.timesAB.value + travelMilliseconds50;
  }
  const isSelectionValid = +el.timesBA.value >= latest;
  let isFixApplied = false;

  el.timesBA.querySelectorAll('option').forEach((opt) => {
    if (+opt.value < latest) {
      opt.setAttribute('disabled', 'disabled');
    } else {
      opt.removeAttribute('disabled');
      if (!isSelectionValid && !isFixApplied) {
        el.timesBA.value = opt.value;
        isFixApplied = true;
      }
    }
  });
};

const onDirectionChange = () => {
  const bits = +el.direction.value;
  el.blockAB.classList[bits & 1 ? 'remove' : 'add']('hidden');
  el.blockBA.classList[bits & 2 ? 'remove' : 'add']('hidden');
};

const printTicket = () => {
  const timeMillisecondsDepartureВА = +el.timesBA.value;
  const timeMillisecondsArrivalBA =
    timeMillisecondsDepartureВА + travelMilliseconds50;
  const timeDepartureВА = new Date(timeMillisecondsDepartureВА);
  const timeArrivalBA = new Date(timeMillisecondsArrivalBA);

  const timeMillisecondsDeparture = +el.timesAB.value;
  const timeMillisecondsArrival =
    timeMillisecondsDeparture + travelMilliseconds50;
  const timeDeparture = new Date(timeMillisecondsDeparture);
  const timeArrival = new Date(timeMillisecondsArrival);
  console.log(el.direction.value);
  const cost =
    valueInput *
    ((el.direction.value & 1 ? costAB : 0) +
      (el.direction.value & 2 && costBA));

  if (el.direction.value == 1) {
    el.output.innerHTML = `
<p>${valueInput} билета по маршруту из A в B стоимостью ${cost} руб.</p>
<p>Это путешествие займет у вас ${travelTimeMinutes} минут.</p>
<p>Теплоход отправляется в ${timeStart(timeDeparture.getHours())}:${timeStart(
      timeDeparture.getMinutes()
    )}, а прибудет в ${timeStart(timeArrival.getHours())}:${timeStart(
      timeArrival.getMinutes()
    )}.</p>
  `;
  } else if (el.direction.value == 2) {
    el.output.innerHTML = `
<p>${valueInput} билета по маршруту из B в A стоимостью ${cost} руб.</p>
<p>Это путешествие займет у вас ${travelTimeMinutes} минут.</p>
<p>Теплоход отправляется в ${timeStart(timeDepartureВА.getHours())}:${timeStart(
      timeDepartureВА.getMinutes()
    )}, а прибудет в ${timeStart(timeArrivalBA.getHours())}:${timeStart(
      timeArrivalBA.getMinutes()
    )}.</p>
  `;
  } else if (el.direction.value == 3) {
    console.log('hi');
    el.output.innerHTML = `
<p>${valueInput} билета по маршруту из А в В и ${valueInput} билета по маршруту из B в A стоимостью ${cost} руб.</p>
<p>Это путешествие займет у вас ${travelTimeMinutes * 2} минут.</p>
<p>Теплоход отправляется из А в В в ${timeStart(
      timeDeparture.getHours()
    )}:${timeStart(timeDeparture.getMinutes())}, а прибудет в ${timeStart(
      timeArrival.getHours()
    )}:${timeStart(timeArrival.getMinutes())}.</p>
<p>Теплоход отправляется из B в A в ${timeStart(
      timeDepartureВА.getHours()
    )}:${timeStart(timeDepartureВА.getMinutes())}, а прибудет в ${timeStart(
      timeArrivalBA.getHours()
    )}:${timeStart(timeArrivalBA.getMinutes())}.</p>
  `;
  }
};

const update = () => (onDirectionChange(), filterBAOptions());

el.direction.addEventListener('change', update);
el.timesAB.addEventListener('change', update);
el.timesBA.addEventListener('change', update);

update();

const button = document.getElementById('button');

button.addEventListener('click', (e) => {
  printTicket();
});
