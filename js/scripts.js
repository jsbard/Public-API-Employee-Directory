"use strict";

const numOfEmployees = 12;
const url =`https://randomuser.me/api/?results=${numOfEmployees}&nat=us`;
let gallery = document.getElementById("gallery");

const getEmployeeData = async (url) => {
    return await fetch(url);
}

/** Populate gallery with employee data **/
const populateEmployees = (employeeData) => {
    for (let i=0; i<employeeData.length; i++){
        let employeeInfo = employeeData[i];
        let image = employeeInfo.picture.large;
        let firstName = employeeInfo.name.first;
        let lastName = employeeInfo.name.last;
        let email = employeeInfo.email;
        let city = employeeInfo.location.city;
        let state = employeeInfo.location.state;

        // Markup template
        let html = `
                <div class="card ${i}">
                    <div class="card-img-container">
                        <img class="card-img" src="${image}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${firstName} ${lastName}</h3>
                        <p class="card-text">${email}</p>
                        <p class="card-text cap">${city}, ${state}</p>
                    </div>
                </div>
        `;

        gallery.insertAdjacentHTML("beforeend", html);
    }
}

/** Listen for clicks on gallery card.
    Display and populate modal with data from appropriate employee **/
const createModals = (employeeData) => {
    const body = document.body;
    const cards = document.getElementsByClassName("card");
    let currentIndex;
    // Loop over all cards and add event listener for each
    for (let i=0; i<cards.length; i++) {
        let html;

        const generateMarkup = (employeeInfo) => {
            let image = employeeInfo.picture.large;
            let firstName = employeeInfo.name.first;
            let lastName = employeeInfo.name.last;
            let bdayMonth = employeeInfo.dob.date.substr(5, 2);
            let bdayDay = employeeInfo.dob.date.substr(8, 2);
            let bdayYear = employeeInfo.dob.date.substr(0, 4);
            let phone = employeeInfo.phone;
            let email = employeeInfo.email;
            let streetNum = employeeInfo.location.street.number;
            let street = employeeInfo.location.street.name;
            let city = employeeInfo.location.city;
            let state = employeeInfo.location.state;
            let zip = employeeInfo.location.postcode;

        // Modal markup template
            html = `
                <div class="modal-container">
                    <div class="modal">
                        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                        <div class="modal-info-container">
                            <img class="modal-img" src="${image}" alt="profile picture">
                            <h3 id="name" class="modal-name cap">${firstName} ${lastName}</h3>
                            <p class="modal-text">${email}</p>
                            <p class="modal-text cap">${city}</p>
                            <hr>
                            <p class="modal-text">${phone}</p>
                            <p class="modal-text">${streetNum} ${street}, ${city}, ${state} ${zip}</p>
                            <p class="modal-text">Birthday: ${bdayMonth}/${bdayDay}/${bdayYear}</p>
                        </div>
                    </div>
                    <div class="modal-btn-container">
                        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                        <button type="button" id="modal-next" class="modal-next btn">Next</button>
                    </div>
                </div>
            `;

            return html;
        }

        // Display corresponding employee when their card is clicked
        cards[i].addEventListener("click", (e) => {
            let employeeInfo = employeeData[i];
            // Marker to keep track of current modal
            // utilized in addPrevButtonListener() and addNextButtonListener()
            currentIndex = i;
            //Insert clicked employee's modal into the DOM
            generateMarkup(employeeInfo);
            body.insertAdjacentHTML("beforeend", html);

            // Call listeners on modal buttons
            const modal = document.getElementsByClassName("modal-container")[0];
            const close = document.getElementById("modal-close-btn");
            const prev = document.getElementById("modal-prev");
            const next = document.getElementById("modal-next");

            addCloseModalListener(close, modal);
            addPrevButtonListener(prev, modal, i, employeeData);
            addNextButtonListener(next, modal, i, employeeData);
        });

        /** EVENT LISTENERS FOR MODAL CONTENT **/
        const addCloseModalListener = (button, modal) => {
            button.addEventListener("click", () => {
                modal.parentNode.removeChild(modal);
            });
        }

        const addPrevButtonListener = (button, modal, index, employeeData) => {
            if (index > 0) {
                button.addEventListener("click", () => {
                    const i = index - 1;
                    const html = generateMarkup(employeeData[i]);
                    modal.parentNode.removeChild(modal);
                    body.insertAdjacentHTML("beforeend", html);

                    // Add listeners to the newly generated modal buttons
                    const newCloseButton = document.getElementById("modal-close-btn");
                    const newModal = document.getElementsByClassName("modal-container")[0];
                    const newPrevButton = document.getElementById("modal-prev");
                    const newNextButton = document.getElementById("modal-next");
                    addPrevButtonListener(newPrevButton, newModal, i, employeeData);
                    addNextButtonListener(newNextButton, newModal, i, employeeData);
                    addCloseModalListener(newCloseButton, newModal);
                });
            } else { // Remove Previous button if there is no previous employee
                const prevButton = document.getElementById("modal-prev");
                prevButton.parentNode.removeChild(prevButton);
            }
        }

        const addNextButtonListener = (button, modal, index, employeeData) => {
            if (index < employeeData.length-1) {
                button.addEventListener("click", () => {
                    const i = index + 1;
                    const html = generateMarkup(employeeData[i]);
                    modal.parentNode.removeChild(modal);
                    body.insertAdjacentHTML("beforeend", html);

                    // Add listeners to the newly generated modal buttons
                    const newCloseButton = document.getElementById("modal-close-btn");
                    const newModal = document.getElementsByClassName("modal-container")[0];
                    const newPrevButton = document.getElementById("modal-prev");
                    const newNextButton = document.getElementById("modal-next");
                    addPrevButtonListener(newPrevButton, newModal, i, employeeData);
                    addNextButtonListener(newNextButton, newModal, i, employeeData);
                    addCloseModalListener(newCloseButton, newModal);
                });
            } else { // Remove Next button if there is no next employee
                const nextButton = document.getElementById("modal-next");
                nextButton.parentNode.removeChild(nextButton);
            }
        }
    }
}

getEmployeeData(url)
    .then(res => res.json())
    .then(data => {
        populateEmployees(data.results);
        createModals(data.results);
    });