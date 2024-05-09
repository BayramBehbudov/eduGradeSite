if (!localStorage.getItem('entry')) { // istifadəçinin login edərək girdiyini yoxlayırıq
    window.location.href = "index.html"
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    get
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyCzP1pxOdfzwSYGSO8-W1N_yJNWfdLzOOo",
    authDomain: "evaluation-6b826.firebaseapp.com",
    databaseURL: "https://evaluation-6b826-default-rtdb.firebaseio.com",
    projectId: "evaluation-6b826",
    storageBucket: "evaluation-6b826.appspot.com",
    messagingSenderId: "1034282103244",
    appId: "1:1034282103244:web:ac1fb21cb89297b2a76d69",
    measurementId: "G-CQGESFZH5G"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const users = ref(database, "users");
const submitButton = document.getElementById("submitBtn");


document.addEventListener("DOMContentLoaded", function () {

    writeUsers() // ekrana istifadəçiləri yazan funksiya


    submitButton.addEventListener("click", function () {  // submitə klik eventi
        if (checkInputs()) {

            const usersInAdminPanel = document.querySelectorAll("#userTable tr");


            usersInAdminPanel.forEach(function (userTrNodeList) {

                addPoint(userTrNodeList)
            });
            alert("Data successfully added")
        } else {
            alert("Please enter the information correctly")
        }


    });


});


async function writeUsers() {


    const allDataUsers = (await get(users)).val();

    let allUsers = ""

    Object.keys(allDataUsers).forEach(key => {

        const item = allDataUsers[key]
        
        if (item.login.fullName != "admin") {

            allUsers += ` <tr id="${key}">
                    <td>${item.login.fullName}</td>
                    <td><input type="date" id="scoreDate"></td>
                    <td>
                    <select name="lessonType">
                    <option value="select" disabled selected>Select</option>
                    <option value="practice">Practice</option>
                    <option value="lesson">Lesson</option>
                    </select>
                    </td>
                    <td><input type="number"></td>
                    <td><input type="text"></td>
                    </tr>`
        }
    })

    document.getElementById("userTable").innerHTML = allUsers
    
}



function addPoint(user) {
    const name = user.querySelector("td:first-child").textContent;
    const dateTd = user.querySelector("#scoreDate").value;
    const lessonType = user.querySelector("select[name='lessonType']").value;
    const score = user.querySelector("input[type='number']").value;
    const notes = user.querySelector("input[type='text']").value;

    let currentMonth = dateTd.split("-")[1]
    let resultMonth

    if (currentMonth === "01") {
        resultMonth = "January";
    } else if (currentMonth === "02") {
        resultMonth = "February";
    } else if (currentMonth === "03") {
        resultMonth = "March";
    } else if (currentMonth === "04") {
        resultMonth = "April";
    } else if (currentMonth === "05") {
        resultMonth = "May";
    } else if (currentMonth === "06") {
        resultMonth = "June";
    } else if (currentMonth === "07") {
        resultMonth = "July";
    } else if (currentMonth === "08") {
        resultMonth = "August";
    } else if (currentMonth === "09") {
        resultMonth = "September";
    } else if (currentMonth === "10") {
        resultMonth = "October";
    } else if (currentMonth === "11") {
        resultMonth = "November";
    } else if (currentMonth === "12") {
        resultMonth = "December";
    }




    let data = {
        lessonType,
        score,
        notes,
        name,
        dateTd
    }
    const userRef = ref(database, `users/${user.id}/scores/${resultMonth}/${dateTd}`)
    set(userRef, data)
}



function checkInputs() {
    let inputs = document.querySelectorAll('tr input[type="date"], tr input[type="number"], tr select');


    let allInputsFilled = true;

    inputs.forEach(input => {

        if (!input.value.trim()) {

            allInputsFilled = false;
            input.style.border = "1px solid red";

            setTimeout(() => {
                input.style.border = ""
            }, 1500);
        } else {
            input.style.border = ""
        }
    });

    return allInputsFilled

}

document.querySelector(".logoutbtnadmin").addEventListener("click",()=>{
    localStorage.clear()
    window.location.href = "index.html";
})