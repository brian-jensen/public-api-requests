/* jshint esversion: 6 */

fetch('https://randomuser.me/api/?results=12&nat=us')
  .then(response => response.json())
  .then(data => directory(data.results))
  .catch(error => console.log('Error fetching data:', error)
);

document.querySelector('body').innerHTML += `<div class="modal-container"></div>`;

const directory = employees => {
  const gallery = document.querySelector('#gallery');
  for (let index in employees) {
    let employee = employees[index];
    let _state = abbrState(employee.location.state);
    gallery.innerHTML += `
      <div class="card">
        <div class="card-img-container">
          <img class="card-img" src="${employee.picture.large}" alt="${employee.name.first}'s profile picture">
        </div>
        <div class="card-info-container">
          <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
          <p class="card-text">${employee.email}</p>
          <p class="card-text cap">${employee.location.city}, ${_state}</p>
        </div>
      </div>
    `;
  }

  gallery.querySelectorAll('.card').forEach((card, index) => {
    card.addEventListener('click', () => {
      modal(employees, employees[index], index);
    });
  });
};


const modal = (employees, employee, index) => {
  const modalContainer = document.querySelector('.modal-container');
  const dob = new Date(Date.parse(employee.dob.date)).toLocaleDateString(navigator.language);
  const _state = abbrState(employee.location.state);
  modalContainer.style.display = 'block';
  modalContainer.innerHTML = `
    <div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
      <div class="modal-info-container">
        <img class="modal-img" src="${employee.picture.large}" alt="${employee.name.first}'s profile picture">
        <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
        <p class="modal-text">${employee.email}</p>
        <p class="modal-text cap">${employee.location.city}</p>
        <hr>
        <p class="modal-text">${employee.phone}</p>
        <p class="modal-text cap">${employee.location.street}, ${employee.location.city}, ${_state} ${employee.location.postcode}</p>
        <p class="modal-text">Birthday: ${dob}</p>
      </div>
    </div>
    <div class="modal-btn-container">
      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div> 
  `;

  document.querySelector('.modal-close-btn').addEventListener('click', () => {
    modalContainer.style.display = 'none';
  });

  const len = employees.length - 1;

  document.querySelector('.modal-prev').addEventListener('click', () => {
    return index > 0 ? modal(employees, employees[index - 1], index - 1) : modal(employees, employees[len], len);
  });

  document.querySelector('.modal-next').addEventListener('click', () => {
    return index < len ? modal(employees, employees[index + 1], index + 1) : modal(employees, employees[0], 0);
  });
};

document.querySelector('.search-container').innerHTML = `
  <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
`;

const handleSearch = () => {
  const cards = document.querySelectorAll('.card');
  const names = document.querySelectorAll('.card-name');
  names.forEach((name, index) => {
    return name.innerHTML.toLowerCase().indexOf(search.value.toLowerCase()) > -1 ? 
           cards[index].style.display = '' : cards[index].style.display = 'none';
  });
};

const search = document.querySelector('#search-input');
const submit = document.querySelector('#search-submit');

search.addEventListener('keyup', handleSearch);

submit.addEventListener('click', event => {
  event.preventDefault();
  handleSearch();
});