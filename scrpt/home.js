if (!localStorage.getItem('entry')) { // istifadəçinin həqiqətən login edərək girdiyini yoxlayırıq
    window.location.href = "index.html"
}


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

import {
    getDatabase,
    ref,
    get,
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
const usersRef = ref(database, "users");
const dataInUsers = Object.entries((await get(usersRef)).val())


const usermail = localStorage.getItem("mail");  // lokalda olan maili və adı götürürük
const username = Object.values(dataInUsers).filter(item => item[1].login.registerMail === usermail)[0][1].login.fullName



const monthFilterSelector = document.getElementById("month-filter")
const gradesContainerSelector = document.getElementById("gradesContainer")
const summaryContainerSelector = document.getElementById("summaryContainer")




// qarşılama mesajı
document.querySelector(".welcomeMsg").textContent = `Salam ${username}`


let allMonthForSelection = "" // tələbənin sağda yuxarıda ay seçə bilməsi üçün ayları ora çıxaracağıq

let scoresInfo  // bu dəyişən tələbənin balları haqqında məlumatları saxlayacaq



dataInUsers.forEach(userInfo => {  // userlərin hamısını döndürüb

    const loginInfo = userInfo[1].login // login datalar
    
    scoresInfo = userInfo[1].scores // scores datalar

    
    if (loginInfo.registerMail === usermail) { // faktiki tələbənin datası

        Object.keys(scoresInfo).forEach(month => { // hansı aylarda balları varsa götürüb

            allMonthForSelection += `<option value=${month}>${month}</option>`
        })
    }

})

monthFilterSelector.innerHTML += allMonthForSelection // yazdırırıq müvafiq inputa



monthFilterSelector.addEventListener("change", function () { // burada inputları döndürüb tələbənin hansı ayı seçdiyini təyin edirik
    const selectedMonth = monthFilterSelector.value;

    updateTable(selectedMonth); 
});




function updateTable(selectedMonth) {  // tələbənin qarşısına seçilmiş ayın günlər üzrə nəticələrini çıxaracaq

    let allData = ""

    Object.entries(scoresInfo).filter(monthData => {  // scores datanı aylar üzrə filtr edirik ki
        
        if (monthData[0] === selectedMonth) { // yoxlayaq görək seçilmiş aya bərabərdirmi

            let allDailyData = Object.values(monthData[1]) // və scoresin içindən seçilmiş ayın məlumatlarını götürüb gündəlik məlumatlarını mənimsədirik array formasında

            

            Object.values(allDailyData).filter(dailyData => { // və həmin datanı allDataya mənimsədib yekunda göndəririk müvafiq elementə ki ekrana çıxsın

                allData += `<tr>
                <th>${dailyData.dateTd}</th>
                <th>${dailyData.lessonType}</th>
                <th>${dailyData.score}</th>
                <th>${dailyData.notes}</th>
                </tr>`

            })
            writeSummary(monthData)  
        }
    })

    gradesContainerSelector.innerHTML = allData
}



function writeSummary(selectedMonth) {  // bu funksiya ekranda yekun nəticəni yəni aylıq ortalamasını hesablayır və həmçinin ekrana çap edir

    let count = 0
    let sum = 0

    Object.values(selectedMonth[1]).filter(dailyInfo => {
        count++
        sum += +dailyInfo.score
    });

    let result = sum / count
    let resultMsg

    switch (true) {
        case result >= 0 && result < 50:
            resultMsg = "E";
            break;
        case result >= 50 && result < 60:
            resultMsg = "F";
            break;
        case result >= 60 && result < 70:
            resultMsg = "D";
            break;
        case result >= 70 && result < 80:
            resultMsg = "C";
            break;
        case result >= 80 && result < 90:
            resultMsg = "B";
            break;
        case result >= 90 && result <= 100:
            resultMsg = "A";
            break;
        default:
            resultMsg = "N/A";
            break;
    }


    summaryContainerSelector.innerHTML = `
    <th></th>
    <th>Final Grade</th>
    <th>${result}</th>
    <th>${resultMsg}</th>
    `
}

document.querySelector(".logoutbtnstudent").addEventListener("click",()=>{
    localStorage.clear()
    window.location.href = "index.html";
})