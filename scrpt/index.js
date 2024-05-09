import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    push,
    set,
    get,
    update,
    remove,
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
const loginInputs = document.querySelectorAll(".sign-in-container input")
const registerInputs = document.querySelectorAll(".sign-up-container input")

const allDataUsers = (await get(users)).val()


// overlay containerin hərəkəti və içərisindəkilərin müvafiq konfiqurasiyası

document.querySelector(".signIn").addEventListener("click", () => {
    document.querySelector(".overlayContainer").classList.toggle("overlayTransport")

    document.querySelector(".signIn").classList.toggle("display")
    document.querySelector(".signIn").classList.toggle("hidden")
    document.querySelector(".signUp").classList.toggle("hidden")
    document.querySelector(".signUp").classList.toggle("display")
})


document.querySelector(".signUp").addEventListener("click", () => {
    document.querySelector(".overlayContainer").classList.toggle("overlayTransport")
    document.querySelector(".signIn").classList.toggle("display")
    document.querySelector(".signIn").classList.toggle("hidden")
    document.querySelector(".signUp").classList.toggle("hidden")
    document.querySelector(".signUp").classList.toggle("display")
})



document.querySelector(".sign-in-container button").onclick = function () {  // giriş məlumatlarını daxil edib login btn klik etdikdə
    if (checkInputs(loginInputs)) { // əgər inputlar doludursa

        // input valueləri götürürük
        const logMail = document.querySelector(".logMail").value
        const logPas = document.querySelector(".logPas").value

        if (isValidEmail(logMail)) { // mailin standartlara uyğunluğunu yoxlayırıq

            if (
                usersControl(logMail, logPas)  // istifadəçi məlumatları doğrudursa
            ) {
                localStorage.setItem("mail", logMail);
                localStorage.setItem('entry', 'true');

                if (logMail == "admin@mail.ru" && logPas == "admin") {
                    window.location.href = "admin.html"; // yöndləndir home səhifəsinə
                } else {
                    window.location.href = "home.html"; // yöndləndir home səhifəsinə
                }
            } else { // əgər login məlumatları doğru deyilsə  
                writeErrorMessage("sign-in-container", "User not found")
            }
        } else {
            writeErrorMessage("sign-in-container", "Enter valid mail") // mail standarta uyğun deyilsə
        }
    }

};



document.querySelector(".sign-up-container button").onclick = () => { // registr formdakı registr btna klik olanda

    if (checkInputs(registerInputs)) { // əgər registr inputlar doludursa
        // input valuelər götürürük
        const fullName = document.querySelector(".fullName").value
        const regMail = document.querySelector(".regMail").value
        const regPasword = document.querySelector(".regPasword").value


        if (isValidEmail(regMail)) { // maili kontrol edirik

            if (findUsers(regMail)) { // əgər daha öncə bu mail istifadə edilməyibsə

                addNewUser(fullName, regMail, regPasword); // həmin istifadəçini databaseyə əlavə edirik
                localStorage.setItem("mail", regMail);
                localStorage.setItem('entry', 'true');


                window.location.href = "home.html"; // yöndləndir home səhifəsinə

            } else { // əgər həmin istifadəçi daha öncə qeydiyyatdan keçibsə
                writeErrorMessage("sign-up-container", "This user already exists")
            }
        } else { // mail standarta uyğun deyilsə
            writeErrorMessage("sign-up-container", "Enter valid mail")

        }
    }
}







function addNewUser(fullName, registerMail, registerPassword) {  // istifadəçini databaseyə əlavə edən funksiya


    push(users, {
        login: {
            fullName,
            registerMail,
            registerPassword
        }
    })
        .then(() => {
            writeErrorMessage("sign-up-container", "Registration completed")

        })
        .catch((error) => {
            console.error(error);
        });
}


function checkInputs(inputs) { //inputların dolu olub olmadığını yoxlayan funksiya, arqument olaraq yoxlayacağı səhifənin inputlarını alır

    let result = true

    inputs.forEach(item => { // inputları döndürür

        if (!item.value) { // hansı input boşdursa 
            item.setAttribute("style", "border: 3px solid red;")  // həmin inputu qırmızı edir

            setTimeout(() => { // 1 saniyə sonra silir qırmızı borderi
                item.removeAttribute("style", "border: 3px solid red;")
            }, 1000);

            result = false // və false qaytarır
        }
    })
    return result  // əks halda true qaytarır

}

function usersControl(email, password) { // login zamanı istifadəçi məlumatlarını yoxlayır dogrudursa true deyilsə false qaytarır
    let result = false
    const alldata = Object.entries(allDataUsers)

    alldata.forEach(item => { // döndürürük və yoxlayırıq əgər databasedə girilən məlumatlara uyğun data varsa resultı true edirik

        if (item[1].login.registerMail === email && item[1].login.registerPassword === password) {
            result = true
        }

    })
    return result

}


function findUsers(mail) {  // bu funksiya ona gələn emaili databasedə olan maillər ilə müqayisə edir əgər yoxdusa true varsa false return edəcək

    let result = true
    const alldata = Object.entries(allDataUsers)

    alldata.forEach(item => {
        if (item[1].login.registerMail === mail) {
            result = false
        }
    })

    return result
}




function writeErrorMessage(element, messages) {  // bu funksiya müvafiq mesajları ekrana çıxarıq

    let div = document.createElement("div")  //yeni div yaradırıq
    div.setAttribute("style", "text-align: center; color: blue; margin-top: 5px;") //dizayn edirik 
    div.appendChild(document.createTextNode(`${messages}`)) //içərisinə mesaj yazırıq
    document.querySelector(`.${element}`).appendChild(div) // register forma yerləşdiririk


    setTimeout(() => {  //1.5 saniyə sonra silirik
        document.querySelector(`.${element}`).removeChild(div)
    }, 1500);
}







function isValidEmail(email) {  // daxil edilən email inputunun içindəki məlumatın emailin conteksinə uyğunluğunu yoxlayır 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
