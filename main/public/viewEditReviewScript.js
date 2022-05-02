// This file serves as the backend script for the view/edit review web page. It facilitates the display of the three separate forms used for different review types as well as
// provides functionality for the five star rating elements, and finally validates form submission for each of the three forms.

// First we get the containers for each form and create the event listener for the 'delete review' functionality.
let dayFormContainer = document.getElementById("dayReviewContainer");
let reminderFormContainer = document.getElementById("reminderFormContainer");
let otherFormContainer = document.getElementById("otherReviewContainer");
let deleteReview = document.getElementById("deleteReview");
deleteReview.addEventListener("click", () => {
    document.getElementById("deleteForm").submit();
})

// We then check what type of review is being viewed and display the appropriate form based on this, hiding all other forms from view with the 'hidden' attribute
let currentReminder;
let reviewTitle = document.getElementById("reviewTitle");
if (review.type == "day")
{
    reminderFormContainer.setAttribute("hidden", "");
    otherFormContainer.setAttribute("hidden", "");
}
else if (review.type == "reminder")
{
    dayFormContainer.setAttribute("hidden", "");
    otherFormContainer.setAttribute("hidden", "");
    currentReminder = elapsedReminders.find(r => r.reminderID == review.reminderID);
    reviewTitle.innerHTML = "Edit Review - " + currentReminder.name;
    // Depending on the type of reminder the review is focused on, the date picker may or may not be visible.
    let reminderDatePickerContainer = document.getElementById("reminderDatePickerContainer");
    if (currentReminder.frequency == "oneTime")
    {
        reminderDatePickerContainer.classList.add("displayNone");
    }
}
else if (review.type == "other")
{
    dayFormContainer.setAttribute("hidden", "");
    reminderFormContainer.setAttribute("hidden", "");
    reviewTitle.innerHTML = "Edit Review - " + review.name;
}

// This provides the functionality for the five star rating elements, adding the event listener for the icons to call starClicked.
let starIcons = document.getElementsByClassName("reviewStar");

for (let icon of starIcons)
{
    icon.addEventListener("click", starClicked);
}

// This function determines which stars have been clicked (on which form) and then shades in the appropriate amount of stars so the display
// reflects a '4 star rating' if they click the 4th star, a '3 star rating' if they click the 3rd star, etc.
function starClicked()
{   
    let clickedStarIndex = 0;
    // It first detects which form's stars were selected to ensure the appropriate elements are updated.
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
    // It then iterates through each star elment on the appropriate form, checking first whether the star clicked was before or after the currently being checked star.
    for (let counter = 0; counter < 5; counter++)
    {
        // If it is before the (or the same) star being clicked, it replaces the star with a filled star icon from Bootstrap. It then adds an event listener to this star so a user can change the rating at will. 
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
            // If it is after the star being clicked it replaces the element with an empty star icon from Bootstrap. It then adds the same event listener to ensure the user can change the rating at will.
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

// It then determines which rating was set for the review being edited and clicks the appropriate star so the previous rating is shown on the page on load.
let rating = review.rating;
if (review.type == "day")
{
    let dayStarContainer = document.getElementById("dayStarsContainer");
    dayStarContainer.children[rating-1].click();
}
else if (review.type == "reminder")
{
    let reminderStarContainer = document.getElementById("reminderStarsContainer");
    reminderStarContainer.children[rating-1].click();
}
else if (review.type == "other")
{
    let otherStarContainer = document.getElementById("otherStarsContainer");
    otherStarContainer.children[rating-1].click();
}

// This function retrieves the star rating (0-5) for whichever form is passed into it, and is vital for the form submission data.
function retrieveStarRating(form)
{
    let starContainer = null;
    // It first determines which form needs to be checked.
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
    // It then iterates through each star on that form, checking when the first unfilled star is found.
    for (let counter = 0; counter < 5; counter++)
    {
        if (starContainer.children[counter].classList.contains("bi-star"))
        {
            // It then returns however many stars are filled, which is the rating.
            return counter;
        }
    }
    // If no empty stars are found, it returns five as it must be a five star rating.
    return 5;
}

// This function checks to see whether the date inputted into the datePicker for the form passed in is a valid date for a review to take place. 
// It returns whether the date inputted is valid: -1 if there is no input, 0 if there is an invalid input, 1 if the date is valid.
function verifyDatePicker(form)
{
    var datePicker;
    // It first determines which form needs to be checked.
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
    // It then calculates the current time and the time chosen in the datePicker.
    let today = new Date();
    let currentYear = parseInt(today.getFullYear());
    let currentMonth = parseInt(today.getMonth()+1);
    let currentDate = parseInt(today.getDate());
    
    let datePickerYear = parseInt(datePicker.value.substring(0,4));
    let datePickerMonth = parseInt(datePicker.value.substring(5,7));
    let datePickerDay =  parseInt(datePicker.value.substring(8,10));
    // If there is no input in the datePicker, it displays a validity message for the datePicker (unless it is an other form, which has an optional datePicker).
    if (datePicker.value == "")
    {
        if (form != "other")
        {
            datePicker.setCustomValidity("Please enter a valid date.");
            datePicker.reportValidity(); 
        }
        return -1;
    }
    // As the server does not handle values before the year 1900, it then checks whether the inputted date is past 1900.
    else if (datePickerYear < 1900)
    {
        datePicker.setCustomValidity("Please enter a valid date past 1899.");
        datePicker.reportValidity();
    }
    // It then checks if the inputted date matches the current year, month, and date. If it does, it returns a valid number.
    else if (datePickerYear == currentYear)
    {
        if (datePickerMonth == currentMonth)
        {
            if (datePickerDay == currentDate)
            {
                return 1;
            }
            // If it matches the year and month but the date is in the future, it displays a validity message for the datePicker.
            else if (datePickerDay > currentDate)
            {
                datePicker.setCustomValidity("Please enter a valid date in the past or today.");
                datePicker.reportValidity();
            }
            // If the date is in the past it returns a valid number.
            else
            {
                return 1;
            }
        }
        // If the year is the same, but the month is in the future it displays a validity message for the datePicker.
        else if (datePickerMonth > currentMonth)
        {
            datePicker.setCustomValidity("Please enter a valid date in the past or today.");
            datePicker.reportValidity();
        }
        // If the month is in the past it returns a valid number.
        else
        {
            return 1;
        }
    }
    // If the year is in the future, it displays a validity message for the datePicker.
    else if (datePickerYear > currentYear)
    {
        datePicker.setCustomValidity("Please enter a valid date in the past or today.");
        datePicker.reportValidity();
    }
    // If the year is in the past (but later than 1900 as detailed above) it returns a valid number.
    else 
    {
        return 1;
    }
    // If any of the above checks did not return a valid number, it returns the invalid date number.
    return 0;
}

// This function determines whether the date inputted in the datePicker would actually be possible given the creation date of the reminder.
// If it is possible, it returns true, otherwise it returns false.
function verifyPastReminderCreationDate()
{
    // It first determines the date inputted into the datePicker and then determines the creation date of the reminder.
    let datePicker = document.getElementById("reminderDatePicker");
    let datePickerYear = parseInt(datePicker.value.substring(0,4));
    let datePickerMonth = parseInt(datePicker.value.substring(5,7));
    let datePickerDay =  parseInt(datePicker.value.substring(8,10));

    let reminderCreationDate = currentReminder.createdOn.split(' ')[0].split('-');
    let creationYear = parseInt(reminderCreationDate[0]);
    let creationMonth = parseInt(reminderCreationDate[1]);
    let creationDate = parseInt(reminderCreationDate[2]);

    // It then checks if the inputted date matches the creation year, month, and date. If it does, it returns a valid number.
    if (datePickerYear == creationYear)
    {
        if (datePickerMonth == creationMonth)
        {
            if (datePickerDay == creationDate)
            {
                return true;
            }
            // If it matches the year and month but the date inputted is before the creation date it returns false.
            else if (datePickerDay < creationDate)
            {
                return false;
            }
            // If the date of the month is past the creation date it returns true.
            else
            {
                return true;
            }
        }
        // If it matches the year but the month inputted is before the creation date it returns false.
        else if (datePickerMonth < creationMonth)
        {
            return false;
        }
        // If the the month is past the creation date it returns true.
        else
        {
            return true;
        }
    }
    // If the year inputted is before the creation date it returns false.
    else if (datePickerYear < creationYear)
    {
        return false;
    }
    // If the year inputted is past the creation date it returns true.
    else 
    {
        return true;
    }
}

// This function determines whether the date inputted in the datePicker is a valid day on which the reminder would have occured in the case of a weekly reminder.
// If it is, it returns true, otherwise it returns false.
function verifyCorrectDayInDatePicker()
{
    // It first determines what day of the week the inputted date would fall on.
    let datePicker = document.getElementById("reminderDatePicker");
    let datePickerYear = parseInt(datePicker.value.substring(0,4));
    let datePickerMonth = parseInt(datePicker.value.substring(5,7));
    let datePickerDay =  parseInt(datePicker.value.substring(8,10));

    let dayIndex = new Date(datePickerYear, (datePickerMonth-1), datePickerDay).getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let daySelected = days[dayIndex];
    // If this day is one of the days that the reminder is set to occur it returns true, otherwise it returns false.
    if (!!currentReminder.daysRepeated.find(d => d == daySelected))
    {
        return true;
    }
    else
    {
        return false;
    }
}

// It then adds event listeners for each 'submit' button's click event to call functions that check whether to submit the form's data or display invalid flags. 
let addDayReviewButton = document.getElementById("addDayReviewButton");
let addReminderReviewButton = document.getElementById("addReminderReviewButton");
let addOtherReviewButton = document.getElementById("addOtherReviewButton");

addDayReviewButton.addEventListener("click", submitDayReviewForm);
addReminderReviewButton.addEventListener("click", submitReminderReviewForm);
addOtherReviewButton.addEventListener("click", submitOtherReviewForm);

// This function checks the inputs on the Day Review form to determine whether they are valid, if so it submits the Day Review form data to the server after appending additional information.
// If not, it displays the relevant message to the client so they can correct their inputs.
function submitDayReviewForm()
{
    // It first checks the validity of the datePicker and the star ratings.
    let dateResult = verifyDatePicker("day");
    let starRating = retrieveStarRating("day");
    // If no rating has been chosen, it alerts the user with a message to select a rating.
    if (starRating == 0)
    {
        alert("Please select a rating.");
    }

    // If all inputs are valid it appends the data of the star rating and the type of the review to the form and submits it to the server.
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

// This function checks the inputs on the Reminder Review form to determine whether they are valid, if so it submits the Reminder Review form data to the server after appending additional information.
// If not, it displays the relevant message to the client so they can correct their inputs.
function submitReminderReviewForm()
{
    // It first determines whether the datePicker's input is valid.
    let dateResult = 1;
    let correctDay = true;
    let pastNotificationDate = true;
    let datePicker = document.getElementById("reminderDatePicker");
    // As different things need to be checked for each reminder type, it first determines which functions need to be run. In the case of a one time reminder there is no datePicker, so this process can be skipped.
    if (currentReminder.frequency != "oneTime")
    {
        // If it is not a one time reminder, it then determines whether the inputted date is in the past and then whether it is after the creation date of the reminder.
        dateResult = verifyDatePicker("reminder");
        pastNotificationDate = verifyPastReminderCreationDate();
        // If it is before the creation date of the reminder it displays a validity message.
        if (!pastNotificationDate)
        {
            datePicker.setCustomValidity("Please select a date on which this reminder had already been created.");
            datePicker.reportValidity();
        }
        // If it is a weekly reminder, it needs to be checked whether the date inputted is a day of the week that matches the days chosen to occur in the reminder. 
        if (currentReminder.frequency == "Weekly")
        {
            // If it is not a valid day, it displays a validity message.
            correctDay = verifyCorrectDayInDatePicker();
            if (!correctDay)
            {
                datePicker.setCustomValidity("Please select a date on which this reminder occurred.");
                datePicker.reportValidity();
            }
        }
    }

    // If no rating has been chosen, it alerts the user with a message to select a rating.
    let starRating = retrieveStarRating("reminder");

    if (starRating == 0)
    {
        alert("Please select a rating.");
    }

    // It then checks the results of the verification functions run above and determines whether all data inputted is valid.
    // If it is, it appends hidden inputs to the form that hold the rating values, the type of the review, and the reminder ID that is associated with the review. It then submits the form.
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
        idInput.value = currentReminder.reminderID;
        reminderForm.appendChild(idInput);
        reminderForm.submit();
    }
}

// This function checks the inputs on the Other Review form to determine whether they are valid, if so it submits the Other Review form data to the server after appending additional information.
// If not, it displays the relevant message to the client so they can correct their inputs.
function submitOtherReviewForm()
{
    // It first checks whether a name value has been inputted, and if it has not it displays a validity message to the user.
    let nameInput = document.getElementById("otherNameInput");

    if (nameInput.value == "")
    {
        nameInput.setCustomValidity("Please enter a name of the review topic.");
        nameInput.reportValidity();
    }

    // If no rating has been chosen, it alerts the user with a message to select a rating.
    let dateResult = verifyDatePicker("other");
    let starRating = retrieveStarRating("other");

    if (starRating == 0)
    {
        alert("Please select a rating.");
    }
    
    // It then checks whether the date inputted is valid, as well as if there was a date inputted. 
    if (dateResult != 1)
    {
        let datePicker = document.getElementById("otherDatePicker");
        // If there was an invalid date inputted, it lets the user know that they do not have to input a date, but if they do it must be correct.
        if (datePicker.value != "")
        {
            datePicker.setCustomValidity("If an invalid date is picked, no date will be saved. If you'd like to input a date for this reminder, please enter a valid date later than 1899 in the past.");
            datePicker.reportValidity();
        }
        else
        {
            // As the datePicker is not required, if the input data is empty it simply sets the result to be valid as the user must not want to input a value.
            dateResult = 1;
        }
    }

    // It then checks the results of the verification functions run above and determines whether all data inputted is valid.
    // If it is, it appends hidden inputs to the form that hold the rating values and the type of the review. It then submits the form.
    if (nameInput.value != "" && starRating > 0 && dateResult == 1)
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