/* jshint esversion: 6 */

// Fetches 12 random user objects from randomuser.me and passes them to directory()
fetch('https://randomuser.me/api/?results=12&nat=us&exc=login,gender,registered,id')
  .then(response => response.json())
  .then(data => directory(data.results))
  .catch(error => console.error('Error fetching data:', error)
);

document.querySelector('body').innerHTML += `<div class="modal-container"></div>`;

/**
 * Builds employee info card gallery
 * @param {array} employees - Any array of 12 random employee objects.
 */
const directory = employees => {
  const gallery = document.querySelector('#gallery');
  for (let index in employees) {
    let employee = employees[index];
    
    gallery.innerHTML += `
      <div class="card">
        <div class="card-img-container">
          <img class="card-img" src="${employee.picture.large}" alt="${employee.name.first}'s profile picture">
        </div>
        <div class="card-info-container">
          <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
          <p class="card-text">${employee.email}</p>
          <p class="card-text cap">${employee.location.city}</p>
        </div>
      </div>
    `;
  }
  // Adds 'click' event handler to each employee info card. Calls modal() and passes info regarding the employee that was clicked.
  gallery.querySelectorAll('.card').forEach((card, index) => {
    card.addEventListener('click', () => {
      modal(employees, employees[index], index);
    });
  });
};

/**
 * Displays modal and employee modal info.
 * @param {array} employees - Any array of 12 employee objects.
 * @param {object} employee - Object containing the clicked employees info.
 * @param {number} index - Index position in array.
 */
const modal = (employees, employee, index) => {
  const modalContainer = document.querySelector('.modal-container');
  const dob = new Date(Date.parse(employee.dob.date)).toLocaleDateString(navigator.language); // Formats date depending on users locale.
  const _state = abbrState(employee.location.state); // Changes state name from full name to 2 letter abbreviation.
  modalContainer.style.display = 'block';
  modalContainer.innerHTML = `
    <div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
      <div class="modal-info-container">
        <img class="modal-img" src="${employee.picture.large}" alt="${employee.name.first}'s profile picture">
        <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
        <p class="modal-text">${employee.email}</p>
        <p class="modal-text cap">${employee.location.city}</p><hr>
        <p class="modal-text">${employee.phone}</p>
        <p class="modal-text cap">${employee.location.street}, ${_state} ${employee.location.postcode}</p>
        <p class="modal-text">Birthday: ${dob}</p>
      </div>
    </div>
    <div class="modal-btn-container">
      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div> 
  `;
  // Closes modal when 'X' is clicked
  document.querySelector('.modal-close-btn').addEventListener('click', () => {
    modalContainer.style.display = 'none';
  });

/* MODAL NAVIGATION */
  const len = employees.length - 1;
// Navigates modal to previous employee. If clicked while on first employee, displays last employee.
  document.querySelector('.modal-prev').addEventListener('click', () => {
    return index > 0 ? modal(employees, employees[index - 1], index - 1) : modal(employees, employees[len], len);
  });
// Navigates modal to next employee. If clicked while on last employee, displays first employee.
  document.querySelector('.modal-next').addEventListener('click', () => {
    return index < len ? modal(employees, employees[index + 1], index + 1) : modal(employees, employees[0], 0);
  });
};
// Displays modal navigation.
document.querySelector('.search-container').innerHTML = `
  <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
`;

// Handles user name search.
const handleSearch = () => {
  const cards = document.querySelectorAll('.card');
  const names = document.querySelectorAll('.card-name');
  names.forEach((name, index) => {
    return name.innerHTML.toLowerCase().indexOf(search.value.toLowerCase()) > -1 ? 
           cards[index].style.display = '' : cards[index].style.display = 'none';
  });
};

const search = document.querySelector('#search-input');
// Listens for user to type characters in a name to filter search results.
search.addEventListener('keyup', handleSearch);
// Listens for user to click search submit button to filter search results.
document.querySelector('#search-submit').addEventListener('click', event => {
  event.preventDefault();
  handleSearch();
});