const header = document.querySelector(".calendar h3");
const dates = document.querySelector('.dates');
const navs =document.querySelectorAll('#prev, #next');

const months = [
    "January",
    "February",
    "March",   
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();

let mainUser = 'currentUser';
const freeDays = {[mainUser]: new Set()};

let activeUser = mainUser;

function addFreeDay(userId, userDate) {
    if (!freeDays[userId]) {
        console.error('User does not exist');
        return;
    }
    freeDays[userId].add(userDate);
    
}





function renderCalendar() {
    const start = new Date(year, month, 1).getDay();
    const endDate = new Date(year, month + 1, 0).getDate();
    const end = new Date(year, month, endDate).getDay();
    const endDatePrev = new Date(year, month, 0).getDate();

    let datesHtml = '';
    
    for (let i = start; i > 0; i--) {
        let ymd = ``;
        let prevMonth = 0
        let stringEndDay = (endDatePrev - i + 1).toString().padStart(2, '0');
        if (month === 0) {
            let prevYear = (year - 1);
             prevMonth = (11).toString().padStart(2, '0');
             ymd = `${prevYear}-${prevMonth}-${stringEndDay}`
        }
        else {
            prevMonth = (month-1).toString().padStart(2, '0');
            ymd = `${year}-${prevMonth}-${stringEndDay}`;
        }
        
        datesHtml += `<li class="inactive" data-date="${ymd}">${endDatePrev - i + 1}</li>`;
    }


    for (let i = 1; i <= endDate; i++) {
        let formatted = `${year}-${(month+1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`
        let className = 
            i === date.getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear()
                ? ' class="today"': '';
         
        datesHtml += `<li${className} data-date="${formatted}">${i}</li>`;
    }
        


 
    dates.innerHTML = datesHtml;
    header.textContent = `${months[month]} ${year}`;
}

navs.forEach(nav=> {
    nav.addEventListener('click', e => {
        const btnId = e.target.id;

        if (btnId === 'prev' && month === 0) {
            year--;
            month = 11;
        } else if (btnId === 'next' && month === 11) {
            year++;
            month = 0;
        } else {
            month = btnId === 'next' ? month + 1 : month - 1;
        }
        

        date = new Date(year, month, new Date().getDate());
        year = date.getFullYear();
        month = date.getMonth();

        renderCalendar();
    });
});
    
dates.addEventListener('click', e => {
    const target = e.target;
    if (!target.classList.contains('inactive') && target.nodeName === 'LI') {
        date = target.dataset.date;
    }
});
renderCalendar(); 