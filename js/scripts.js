"use strict";

const numOfEmployees = 12;
const url =`https://randomuser.me/api/?results=${numOfEmployees}`;
let gallery = document.getElementById("gallery");
let close;

const getEmployeeData = async (url) => {
    const employees = await fetch(url);
    return employees;
}

const populateEmployees = (employeeData) => {
    for (let i=0; i<employeeData.length; i++){

        let employeeInfo = employeeData[i];
        let image = employeeInfo.picture.large;
        let firstName = employeeInfo.name.first;
        let lastName = employeeInfo.name.last;
        let email = employeeInfo.email;
        let city = employeeInfo.location.city;
        let state = employeeInfo.location.state;
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

const createModals = (employeeData) => {
    const body = document.body;
    const cards = document.getElementsByClassName("card");
    for (let i=0; i<cards.length; i++) {
        let employeeInfo = employeeData[i];
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

        cards[i].addEventListener("click", (e) => {
            let html = `
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
    
                    // IMPORTANT: Below is only for exceeds tasks 
                    <div class="modal-btn-container">
                        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                        <button type="button" id="modal-next" class="modal-next btn">Next</button>
                    </div>
                </div>
            `;

            body.insertAdjacentHTML("beforeend", html);

            /** EVENT LISTENERS FOR MODALS **/
            const modal = document.getElementsByClassName("modal-container")[0];
            const close = document.getElementById("modal-close-btn");
            close.addEventListener("click", () => {
                modal.parentNode.removeChild(modal);
            });

        });
    }
}

getEmployeeData(url)
    .then(res => res.json())
    .then(data => {
        populateEmployees(data.results);
        createModals(data.results);
    });