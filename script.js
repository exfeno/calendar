const header = document.querySelector(".calendar h3");
const dates = document.querySelector('.dates');
const navs =document.querySelectorAll('#prev, #next');
let comparisonMode = false;
let userA = null;
let userB = null;

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

// date variables
let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();

//user creation and associated date data structure
let mainUser = 'currentUser';
const freeDays = {[mainUser]: new Set()};
let activeUser = mainUser;

//range handling
let isSelectingRange = false;
let rangeStart = null;
let rangeEnd = null;

//functions handling free day user data
function addFreeDay(userId, userDate) {
    if (!freeDays[userId]) {
        console.error('User does not exist');
        return;
    }
    freeDays[userId].add(userDate);
}

function isFreeDay(userId, userDate) {
    if (!freeDays[userId]) {
        console.error('User does not exist');
        return false;
    }
    return freeDays[userId].has(userDate);
}

function removeFreeDay(userId, userDate) {
    if (!freeDays[userId]) {
        console.error('User does not exist');
        return;
    }
    freeDays[userId].delete(userDate);
}
function getDatesInRange(startDate, endDate) {
    let first = new Date(startDate + 'T00:00:00');
    let last = new Date(endDate + 'T00:00:00');
    if (first > last) {
        let temp = first;
        first = last;
        last = temp;
    }
    const dates = [];
    let firstcopy = new Date(first.getTime());
    while (firstcopy <= last) {
        let dateStr = `${firstcopy.getFullYear()}-${(firstcopy.getMonth() + 1).toString().padStart(2, '0')}-${firstcopy.getDate().toString().padStart(2, '0')}`;
        dates.push(dateStr);
        firstcopy.setDate(firstcopy.getDate()+1);
    }
    return dates;
}

function addUser(username) {
    const user = username.trim();
    if (!user) {
        console.error('User cannot be empty');
        return;
    }
    if (freeDays[user]) {
        console.error('User already exists');
        return;
    }
    freeDays[user] = new Set();
    updateUserSelect();
    updateActiveUserDisplay();
    document.getElementById('new-username').value = '';
    
    
}

function setActiveUser(username) {
    activeUser = username;
    updateActiveUserDisplay();
    renderCalendar();
}

function getAllUsers() {
    return Object.keys(freeDays);
}

function updateUserSelect() {
    const userSelect = document.getElementById('user-select');
    userSelect.innerHTML = '';
    getAllUsers().forEach(user => {
        const option = document.createElement('option');
        option.value = user;
        option.textContent = user;
        if (user === activeUser) {
            option.selected = true;
        }
        userSelect.appendChild(option);
    });
}

function updateActiveUserDisplay() {
    const activeUserDisplay = document.getElementById('active-user');
    activeUserDisplay.textContent = `Current User: ${activeUser}`;
}

function toggleComparisonMode() {
    const checkbox = document.getElementById('comparison-toggle');
    comparisonMode = checkbox.checked;
    
    if (comparisonMode) {
        document.querySelector('.calendar').classList.add('comparison-mode');
        document.getElementById('comparison-controls').style.display = 'block';
        document.getElementById('pattern-legend').style.display = 'block';
        document.getElementById('single-user-controls').style.display = 'none';
        updateComparisonSelects();
        const users = getAllUsers();
        if (users.length >= 2) {
            userA = users[0];
            userB = users[1];
        }
        else if (users.length === 1) {
            userA = users[0];
            userB = null;
        }
        else {
            userA = null;
            userB = null;
        }
    } else {
        document.querySelector('.calendar').classList.remove('comparison-mode');
        document.getElementById('comparison-controls').style.display = 'none';
        document.getElementById('pattern-legend').style.display = 'none';
        document.getElementById('single-user-controls').style.display = 'block';
        userA = null;
        userB = null;
    }
    renderCalendar();
}

function updateComparisonSelects() {
    const one = document.getElementById('user-a-select');
    const two = document.getElementById('user-b-select');
    one.innerHTML = '';
    two.innerHTML = '';
    getAllUsers().forEach(user => {
        const optionA = document.createElement('option');
        optionA.value = user;
        optionA.textContent = user;
        if (user === userA) {
            optionA.selected = true;
        }
        one.appendChild(optionA);
        const optionB = document.createElement('option');
        optionB.value = user;
        optionB.textContent = user;
        if (user === userB) {
            optionB.selected = true;
        }
        two.appendChild(optionB);
    })
}

function setUserA(user) {
    userA = user;
    renderCalendar();
}

function setUserB(user) {
    userB = user;
    renderCalendar();
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
        let formatted = `${year}-${(month+1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        let classes = '';

         if (i === date.getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear()) {
                classes += 'today';
            }

        if (comparisonMode) {
            if (isFreeDay(userA, formatted) && isFreeDay(userB, formatted)) {
                classes += (classes ? ' ' : '') + 'intersection';
            } else if (isFreeDay(userA, formatted)) {
                classes += (classes ? ' ' : '') + 'user-a-only';
            } else if (isFreeDay(userB, formatted)) {
                classes += (classes ? ' ' : '') + 'user-b-only';
            }
        }
        else if (isFreeDay(activeUser, formatted)) {
            classes += (classes ? ' ' : '') + 'free';
        }

        let className = classes ? ` class="${classes}"` : '';
         
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
        if (comparisonMode) {
            return;
        }
        const clickedDate = target.dataset.date;
        if (!isSelectingRange) {
            rangeStart = clickedDate;
            isSelectingRange = true;
            console.log(`Range started: ${rangeStart}`);
        } else {
            rangeEnd = clickedDate;
            const datesInRange = getDatesInRange(rangeStart, rangeEnd);
            console.log(`Range star: ${rangeStart}, range end: ${rangeEnd}`);
            console.log('Full array returned:', datesInRange);
            console.log('Array length:', datesInRange.length);
            console.log(`Range ended: ${rangeEnd}`);
            console.log(`Dates in range: ${datesInRange}`);
            datesInRange.forEach(date => {
                if (isFreeDay(activeUser, date)) {
                    removeFreeDay(activeUser, date);
                } else {
                    addFreeDay(activeUser, date);
                }
            });
            isSelectingRange = false;
            rangeStart = null;
            rangeEnd = null;
            console.log('Range completed')
        }
        
        renderCalendar();
    }
});
renderCalendar(); 
updateUserSelect();
updateActiveUserDisplay();