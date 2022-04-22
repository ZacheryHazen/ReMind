let btnChoiceDay = document.getElementById("reviewChoiceDay");
let btnChoiceReminder = document.getElementById("reviewChoiceReminder");
let btnChoiceOther = document.getElementById("reviewChoiceOther");

btnChoiceDay.addEventListener("click", displayDayReviewForm);
btnChoiceReminder.addEventListener("click", displayReminderChoices);
btnChoiceOther.addEventListener("click", displayOtherReviewForm);
let divDisplayContainer = document.getElementById("currentDisplayContainer");
let newReviewHeader = document.getElementsByClassName("homePageAndListHeader")[0];

function displayDayReviewForm()
{
    for (let child of divDisplayContainer.children)
    {
        child.setAttribute("hidden", "");
    }
    divDisplayContainer.children[1].removeAttribute("hidden");
    newReviewHeader.innerText = "New Day Review";
}

function displayReminderChoices()
{
    for (let child of divDisplayContainer.children)
    {
        child.setAttribute("hidden", "");
    }
    divDisplayContainer.children[2].removeAttribute("hidden");
    newReviewHeader.innerText = "New Reminder Review";
}

function displayOtherReviewForm()
{
    for (let child of divDisplayContainer.children)
    {
        child.setAttribute("hidden", "");
    }
    divDisplayContainer.children[4].removeAttribute("hidden");
    newReviewHeader.innerText = "New Review";
}

let dayCancelButton = document.getElementById("dayCancelButton");
let reminderCancelButton = document.getElementById("reminderCancelButton");
let otherCancelButton = document.getElementById("otherCancelButton");

dayCancelButton.addEventListener("click", () => {
    clearDayReviewFields();
    displayReviewChoiceForm();
});

reminderCancelButton.addEventListener("click", () => {
    clearReminderReviewFields();
    displayReminderChoices();
});

otherCancelButton.addEventListener("click",  () => {
    clearOtherReviewFields();
    displayReviewChoiceForm();
});

function displayReviewChoiceForm()
{
    for (let child of divDisplayContainer.children)
    {
        child.setAttribute("hidden", "");
    }
    divDisplayContainer.children[0].removeAttribute("hidden");
    newReviewHeader.innerText = "New Review";
}

function clearDayReviewFields()
{
    let dayDatePicker = document.getElementById("dayDatePicker");
    dayDatePicker.value = "";
    resetStars("day");
    let dayReviewDescription = document.getElementById("dayReviewDescription");
    dayReviewDescription.value = "";
}

function clearReminderReviewFields()
{
    let reminderDatePicker = document.getElementById("reminderDatePicker");
    reminderDatePicker.value = "";
    if (reminderDatePickerContainer.classList.contains("displayNone"))
    {
        reminderDatePickerContainer.classList.remove("displayNone");
    }
    resetStars("reminder");
    let reminderReviewDescription = document.getElementById("reminderReviewDescription");
    reminderReviewDescription.value = "";
}

function clearOtherReviewFields()
{
    let otherNameInput = document.getElementById("otherNameInput");
    otherNameInput.value = "";
    let otherDatePicker = document.getElementById("otherDatePicker");
    otherDatePicker.value = "";
    resetStars("other");
    let otherReviewDescription = document.getElementById("otherReviewDescription");
    otherReviewDescription.value = "";
}

let chooseReminderBackButton = document.getElementById("chooseReminderBackButton");
chooseReminderBackButton.addEventListener("click", displayReviewChoiceForm);

let reminders = document.getElementsByClassName("tileLink");
for (let reminder of reminders)
{
    reminder.addEventListener("click", displayReminderReviewForm);
}

let currentReminder = null;
let reminderDatePickerContainer = document.getElementById("reminderDatePickerContainer");
function displayReminderReviewForm()
{
    for (let child of divDisplayContainer.children)
    {
        child.setAttribute("hidden", "");
    }
    divDisplayContainer.children[3].removeAttribute("hidden");
    let reminderID = this.id;
    currentReminder = elapsedReminders.find(r => r.id == reminderID);
    newReviewHeader.innerText = "New Review for " + currentReminder.name;
    if (currentReminder.frequency == "oneTime")
    {
        reminderDatePickerContainer.classList.add("displayNone");
    }
}

let starIcons = document.getElementsByClassName("reviewStar");

for (let icon of starIcons)
{
    icon.addEventListener("click", starClicked);
}

function starClicked()
{   
    let clickedStarIndex = 0;
    if (this.id.includes("day"))
    {
        clickedStarIndex = this.id.substring(7);
    }
    else if (this.id.includes("reminder"))
    {
        clickedStarIndex = this.id.substring(12);
    }
    else if (this.id.includes("other"))
    {
        clickedStarIndex = this.id.substring(9);
    }
    let parentContainer = this.parentElement;
    for (let counter = 0; counter < 5; counter++)
    {
        if (counter < clickedStarIndex)
        {
            let newIcon = document.createElement("i");
            newIcon.classList.add("bi");
            newIcon.classList.add("bi-star-fill");
            newIcon.classList.add("reviewStar");
            parentContainer.insertBefore(newIcon, parentContainer.children[counter]);
            newIcon.id = parentContainer.children[counter+1].id;
            parentContainer.removeChild(parentContainer.children[counter+1]);
            newIcon.addEventListener("click", starClicked);
        }
        else
        {
            let newIcon = document.createElement("i");
            newIcon.classList.add("bi");
            newIcon.classList.add("bi-star");
            newIcon.classList.add("reviewStar");
            parentContainer.insertBefore(newIcon, parentContainer.children[counter]);
            newIcon.id = parentContainer.children[counter+1].id;
            parentContainer.removeChild(parentContainer.children[counter+1]);
            newIcon.addEventListener("click", starClicked);
        }
    }
}

function resetStars(form)
{
    let starContainer = null;
    if (form == "day")
    {
        starContainer = document.getElementById("dayStarsContainer");
    }
    else if (form == "reminder")
    {
        starContainer = document.getElementById("reminderStarsContainer");
    }
    else if (form == "other")
    {
        starContainer = document.getElementById("otherStarsContainer");
    }
    for (let counter = 0; counter < 5; counter++)
    {
        starContainer.removeChild(starContainer.children[0]);
    }
    for (let counter = 0; counter < 5; counter++)
    {
        let newIcon = document.createElement("i");
        newIcon.classList.add("bi");
        newIcon.classList.add("bi-star");
        newIcon.classList.add("reviewStar");
        newIcon.id = form + "Star" + (counter+1);
        newIcon.addEventListener("click", starClicked);
        starContainer.appendChild(newIcon);
    }
}

function retrieveStarRating(form)
{
    let starContainer = null;
    if (form == "day")
    {
        starContainer = document.getElementById("dayStarsContainer");
    }
    else if (form == "reminder")
    {
        starContainer = document.getElementById("reminderStarsContainer");
    }
    else if (form == "other")
    {
        starContainer = document.getElementById("otherStarsContainer");
    }
    for (let counter = 0; counter < 5; counter++)
    {
        if (starContainer.children[counter].classList.contains("bi-star"))
        {
            return counter;
        }
    }
    return 5;
}

function verifyDatePicker(form)
{
    var datePicker;
    if (form == "day")
    {
        datePicker = document.getElementById("dayDatePicker");
    }
    else if (form == "reminder")
    {
        datePicker = document.getElementById("reminderDatePicker");
    }
    else if (form == "other")
    {  
        datePicker = document.getElementById("otherDatePicker");
    }
    let today = new Date();
    let currentYear = parseInt(today.getFullYear());
    let currentMonth = parseInt(today.getMonth()+1);
    let currentDate = parseInt(today.getDate());
    
    let datePickerYear = parseInt(datePicker.value.substring(0,4));
    let datePickerMonth = parseInt(datePicker.value.substring(5,7));
    let datePickerDay =  parseInt(datePicker.value.substring(8,10));

    if (datePicker.value == "")
    {
        if (form != "other")
        {
            datePicker.setCustomValidity("Please enter a valid date.");
            datePicker.reportValidity(); 
        }
        return -1;
    }
    else if (datePickerYear == currentYear)
    {
        if (datePickerMonth == currentMonth)
        {
            if (datePickerDay == currentDate)
            {
                return 1;
            }
            else if (datePickerDay > currentDate)
            {
                datePicker.setCustomValidity("Please enter a valid date in the past or today.");
                datePicker.reportValidity();
            }
            else
            {
                return 1;
            }
        }
        else if (datePickerMonth > currentMonth)
        {
            datePicker.setCustomValidity("Please enter a valid date in the past or today.");
            datePicker.reportValidity();
        }
        else
        {
            return 1;
        }
    }
    else if (datePickerYear > currentYear)
    {
        datePicker.setCustomValidity("Please enter a valid date in the past or today.");
        datePicker.reportValidity();
    }
    else 
    {
        return 1;
    }
    return 0;
}

function verifyPastReminderCreationDate()
{
    let datePicker = document.getElementById("reminderDatePicker");
    let datePickerYear = parseInt(datePicker.value.substring(0,4));
    let datePickerMonth = parseInt(datePicker.value.substring(5,7));
    let datePickerDay =  parseInt(datePicker.value.substring(8,10));

    let reminderCreationDate = currentReminder.createdOn.split(' ')[0].split('-');
    let creationYear = parseInt(reminderCreationDate[0]);
    let creationMonth = parseInt(reminderCreationDate[1]);
    let creationDate = parseInt(reminderCreationDate[2]);

    if (datePickerYear == creationYear)
    {
        if (datePickerMonth == creationMonth)
        {
            if (datePickerDay == creationDate)
            {
                return true;
            }
            else if (datePickerDay < creationDate)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        else if (datePickerMonth < creationMonth)
        {
            return false;
        }
        else
        {
            return true;
        }
    }
    else if (datePickerYear < creationYear)
    {
        return false;
    }
    else 
    {
        return true;
    }
}

function verifyCorrectDayInDatePicker()
{
    let datePicker = document.getElementById("reminderDatePicker");
    let datePickerYear = parseInt(datePicker.value.substring(0,4));
    let datePickerMonth = parseInt(datePicker.value.substring(5,7));
    let datePickerDay =  parseInt(datePicker.value.substring(8,10));

    let dayIndex = new Date(datePickerYear, (datePickerMonth-1), datePickerDay).getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let daySelected = days[dayIndex];
    if (!!currentReminder.daysRepeated.find(d => d == daySelected))
    {
        return true;
    }
    else
    {
        return false;
    }
}

let addDayReviewButton = document.getElementById("addDayReviewButton");
let addReminderReviewButton = document.getElementById("addReminderReviewButton");
let addOtherReviewButton = document.getElementById("addOtherReviewButton");

addDayReviewButton.addEventListener("click", submitDayReviewForm);
addReminderReviewButton.addEventListener("click", submitReminderReviewForm);
addOtherReviewButton.addEventListener("click", submitOtherReviewForm);

function submitDayReviewForm()
{
    let dateResult = verifyDatePicker("day");
    let starRating = retrieveStarRating("day");

    if (starRating == 0)
    {
        alert("Please select a rating.");
    }

    if (dateResult == 1 && starRating > 0)
    {
        let dayForm = document.getElementById("dayReviewForm");
        let ratingInput = document.createElement("input");
        ratingInput.type = "hidden";
        ratingInput.name = "rating";
        ratingInput.value = starRating;
        dayForm.appendChild(ratingInput);
        let typeInput = document.createElement("input");
        typeInput.type = "hidden";
        typeInput.name = "type";
        typeInput.value = "day";
        dayForm.appendChild(typeInput);
        dayForm.submit();
    }
}

function submitReminderReviewForm()
{
    let dateResult = 1;
    let correctDay = true;
    let pastNotificationDate = true;
    let datePicker = document.getElementById("reminderDatePicker");
    if (currentReminder.frequency != "oneTime")
    {
        dateResult = verifyDatePicker("reminder");
        pastNotificationDate = verifyPastReminderCreationDate();
        if (!pastNotificationDate)
        {
            datePicker.setCustomValidity("Please select a date on which this reminder had already been created.");
            datePicker.reportValidity();
        }
        if (currentReminder.frequency == "Weekly")
        {
            correctDay = verifyCorrectDayInDatePicker();
            if (!correctDay)
            {
                datePicker.setCustomValidity("Please select a date on which this reminder occurred.");
                datePicker.reportValidity();
            }
        }
    }

    let starRating = retrieveStarRating("reminder");

    if (starRating == 0)
    {
        alert("Please select a rating.");
    }
    if (dateResult == 1 && starRating > 0 && pastNotificationDate && correctDay)
    {
        let reminderForm = document.getElementById("reminderReviewForm");
        let ratingInput = document.createElement("input");
        ratingInput.type = "hidden";
        ratingInput.name = "rating";
        ratingInput.value = starRating;
        reminderForm.appendChild(ratingInput);
        let typeInput = document.createElement("input");
        typeInput.type = "hidden";
        typeInput.name = "type";
        typeInput.value = "reminder";
        reminderForm.appendChild(typeInput);
        let idInput = document.createElement("input");
        idInput.type = "hidden";
        idInput.name = "id";
        idInput.value = currentReminder.id;
        reminderForm.appendChild(idInput);
        reminderForm.submit();
    }
}

function submitOtherReviewForm()
{
    let nameInput = document.getElementById("otherNameInput");

    if (nameInput.value == "")
    {
        nameInput.setCustomValidity("Please enter a name of the review topic.");
        nameInput.reportValidity();
    }

    let dateResult = verifyDatePicker("other");
    let starRating = retrieveStarRating("other");

    if (starRating == 0)
    {
        alert("Please select a rating.");
    }

    if (nameInput.value != "" && starRating > 0)
    {
        let otherForm = document.getElementById("otherReviewForm");
        let ratingInput = document.createElement("input");
        ratingInput.type = "hidden";
        ratingInput.name = "rating";
        ratingInput.value = starRating;
        otherForm.appendChild(ratingInput);
        let typeInput = document.createElement("input");
        typeInput.type = "hidden";
        typeInput.name = "type";
        typeInput.value = "other";
        otherForm.appendChild(typeInput);
        otherForm.submit();
    }
}