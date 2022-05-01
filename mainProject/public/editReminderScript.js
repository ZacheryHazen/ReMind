// This file serves as the backing script for the Edit Reminder web page. It facilitates the adding/removing of fields for different reminder types and the
// submission of the form to the server.

// It first adds an event listener for the Delete Reminder icon that submits the deleteForm to the server.
let deleteReminder = document.getElementById("deleteReminder");
deleteReminder.addEventListener("click", () => {
    document.getElementById("deleteForm").submit();
});

// It then finds various elements on the page to add functionality and use in functions.
let fieldsContainer = document.getElementById("reminderFields");
let radioOneTime = document.getElementById("frequencyRadioOneTime");
let radioRepeated = document.getElementById("frequencyRadioRepeated");
let submitButton = document.getElementById("addReminderButton");
var timePicker = document.getElementById("timePicker");
var form = document.getElementById("editReminderForm");

// It adds an eventListener to the One Time and Repeated radio buttons to call the displayOneTimeFields and displayRepeatedFields functions respectively on click.
radioOneTime.addEventListener("click", displayOneTimeFields);
radioRepeated.addEventListener("click", displayRepeatedFields);

// It also adds an eventListener to the submit button to call the checkToSubmitForm function on click.
submitButton.addEventListener("click", checkToSubmitForm);

// It then adds an event listener on input to the timePicker element to clear its custom validity message.
var timePicker = document.getElementById('timePicker');
timePicker.addEventListener("input", () => {
    timePicker.setCustomValidity("");
});

// It then checks if the one time fields are being displayed, and if so it sets the same event listener on the datePicker element.
if (radioOneTime.checked)
{
    var datePicker = document.getElementById('datePicker');
    datePicker.addEventListener("input", () => {
        datePicker.setCustomValidity("");
    });
}
// If it is not being displayed, it sets an eventListener on the frequencySelect element to call displayOrRemoveDayOptions on the change event.
else
{
    var newSelect = document.getElementById("frequencySelect");
    newSelect.addEventListener("change", displayOrRemoveDayOptions);
}

// This function displays all fields needed to input data for a one time reminder.
function displayOneTimeFields()
{
    // It first checks if the frequency select and day checkboxes are present in the form, and removes both if need be.
    if (!!document.getElementById("frequencySelectContainer"))
    {
        fieldsContainer.removeChild(document.getElementById("frequencySelectContainer"));
    }
    if (!!document.getElementById("dayCheckBoxesContainer"))
    {
        fieldsContainer.removeChild(document.getElementById("dayCheckBoxesContainer"));
    }
    // It then checks if the datePicker is not present, and if so it adds the datePicker container.
    if (!(!!document.getElementById("datePickerContainer")))
    {
        // It first adds the div that will contain the label and datePicker.
        let newDiv = document.createElement("div");
        newDiv.classList.add("container-fluid");
        newDiv.classList.add("ps-0");
        newDiv.classList.add("pe-1");
        newDiv.classList.add("mb-2");
        newDiv.classList.add("mt-1");
        newDiv.classList.add("d-flex");
        newDiv.id = "datePickerContainer";
        // It then creates the label for the datePicker.
        let newLabel = document.createElement("label");
        newLabel.htmlFor = "datePicker";
        newLabel.innerText = "What date should this reminder notify you?";
        newLabel.id="datePickerLabel";
        newDiv.appendChild(newLabel);
        // Next, it creates the datePicker itself, adding the appropriate eventListener.
        let newInput = document.createElement("input");
        newInput.type = "date";
        newInput.name = "datePicker";
        newInput.id = "datePicker";
        newInput.classList.add("ms-auto");
        newInput.classList.add("datePicker");
        newInput.setAttribute("required", "");
        newDiv.appendChild(newInput);
        newInput.addEventListener("input", () => {
            newInput.setCustomValidity("");
        });
        // This new div is then added to the form before the description element.
        fieldsContainer.insertBefore(newDiv, document.getElementById("reminderDescriptionContainer"));
    }
}

// This function displays all fields needed to input data for a repeated reminder.
function displayRepeatedFields()
{
    // It first checks if the datePicker is present, and if so it removes it from the form.
    if (!!document.getElementById("datePickerContainer"))
    {
        fieldsContainer.removeChild(document.getElementById("datePickerContainer"));
    }
    // It then checks if the frequencySelect is not present, and if so it adds the frequencySelect container.
    if (!(!!document.getElementById("frequencySelectContainer")))
    {
        // It first creates the div that will hold the label and frequencySelect.
        let newDiv = document.createElement("div");
        newDiv.classList.add("ps-0");
        newDiv.classList.add("pe-1");
        newDiv.classList.add("mb-2");
        newDiv.classList.add("d-flex");
        newDiv.id = "frequencySelectContainer";
        // It then creates the label and adds it to the div.
        let newLabel = document.createElement("label");
        newLabel.htmlFor = "frequencySelect";
        newLabel.innerText = "How frequently would you like to be notified by this reminder?";
        newLabel.id="frequencySelectLabel";
        newDiv.appendChild(newLabel);
        // It then creates the frequencySelect and its options.
        let newSelect = document.createElement("select");
        newSelect.classList.add("form-select");
        newSelect.classList.add("frequencySelect");
        newSelect.classList.add("ms-auto");
        newSelect.name = "frequencySelect";
        newSelect.id = "frequencySelect";
        let option1 = document.createElement("option");
        option1.value = "Daily";
        option1.name = "optionDaily";
        option1.id = "optionDaily";
        option1.innerText = "Daily";
        newSelect.appendChild(option1);
        let option2 = document.createElement("option");
        option2.value = "Weekly";
        option2.name = "optionWeekly";
        option2.id = "optionWeekly";
        option2.innerText = "Weekly";
        newSelect.appendChild(option2);
        // It then adds the frequencySelect to the div, adds the appropriate eventListener, and adds the div to the form.
        newDiv.appendChild(newSelect);
        fieldsContainer.insertBefore(newDiv, document.getElementById("timePickerContainer"));
        newSelect.addEventListener("change", displayOrRemoveDayOptions);
    }
}

// This function handles whether to call displayDayOptions or removeDayOptions based on the value of the frequencySelect.
function displayOrRemoveDayOptions()
{
    let select = document.getElementById("frequencySelect");
    if (select.value != "Daily")
    {
        displayDayOptions();
    }
    else
    {
        removeDayOptions();
    }
}

// This function displays all checkBox day options on the main form.
function displayDayOptions()
{
    // It first checks whether the day checkBoxes have already been added, and if they haven't it creates all of the checkboxes.
    if (!(!!document.getElementById("dayCheckBoxesContainer")))
    {
        // It next creates the div that will hold all of the checkBoxes for the days.
        let newDiv = document.createElement("div");
        newDiv.classList.add("ps-0");
        newDiv.classList.add("pe-0");
        newDiv.classList.add("mb-2");
        newDiv.classList.add("d-flex");
        newDiv.classList.add("justify-content-between");
        newDiv.id = "dayCheckBoxesContainer";
        let days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
        // It then iterates through each day, adding a checkBox and a label for each and adding them to the parent div.
        for (let counter = 0; counter < 7; counter++)
        {
            let newCheckBox = document.createElement("input");
            newCheckBox.classList.add("form-check-input");
            newCheckBox.type = "checkbox";
            newCheckBox.name = days[counter].toLowerCase() + "CheckBox";
            newCheckBox.id = days[counter].toLowerCase() + "CheckBox";
            newDiv.appendChild(newCheckBox);
            let newLabel = document.createElement("label");
            newLabel.classList.add("form-check-label");
            newLabel.htmlFor = days[counter].toLowerCase() + "CheckBox";
            newLabel.innerHTML = days[counter];
            newDiv.appendChild(newLabel);
        }
        // It then adds this new div to the main form.
        fieldsContainer.insertBefore(newDiv, document.getElementById("timePickerContainer"));
    }
}

// This function removes all day checkBoxes from the main form.
function removeDayOptions()
{
    if (!!document.getElementById("dayCheckBoxesContainer"))
    {
        fieldsContainer.removeChild(document.getElementById("dayCheckBoxesContainer"));
    }
}

// This function checks all fields in the form before submitting the form, and if all fields are valid it submits the form's data back to the server.
function checkToSubmitForm()
{
    // It first checks if the timePicker has a value, and if it does not it reports the validity of the element.
    if (timePicker.value == "")
    {
        timePicker.reportValidity();
    }
    // It then checks whether the datePicker has been added, and if it does it then finds the current time as well as the chosen time.
    else if (!!document.getElementById("datePickerContainer"))
    {
        let today = new Date();
        let currentYear = parseInt(today.getFullYear());
        let currentMonth = parseInt(today.getMonth()+1);
        let currentDate = parseInt(today.getDate());
        let currentHour = parseInt(today.getHours());
        let currentMinute = parseInt(today.getMinutes());
        var datePicker = document.getElementById("datePicker");
        let datePickerYear = parseInt(datePicker.value.substring(0,4));
        let datePickerMonth = parseInt(datePicker.value.substring(5,7));
        let datePickerDay =  parseInt(datePicker.value.substring(8,10));
        let timePickerHour = parseInt(timePicker.value.substring(0,2));
        let timePickerMinute = parseInt(timePicker.value.substring(3,5));
        
        // It then checks whether the datePicker value is blank, and if it is it reports its validity.
        if (datePicker.value == "")
        {
            datePicker.reportValidity();
        }
        // It then checks if the inputted date matches the current year, month, and date, hour, and has a minute value that is less or equal to the current. 
        // If it does, it sets a custom validity message and reports it to the user.
        else if (datePickerYear == currentYear)
        {
            if (datePickerMonth == currentMonth)
            {
                if (datePickerDay == currentDate)
                {
                    if (timePickerHour == currentHour)
                    {
                        if (timePickerMinute <= currentMinute)
                        {
                            timePicker.setCustomValidity("Please enter a valid time in the future.");
                            timePicker.reportValidity();
                        }
                        // If the minute value is later than the current minute, it submits the form data.
                        else
                        {
                            form.submit();
                        }
                    }
                    // If the hour value is earlier than the current hour, it sets a custom validity message and reports it to the user.
                    else if (timePickerHour < currentHour)
                    {
                        timePicker.setCustomValidity("Please enter a valid time in the future.");
                        timePicker.reportValidity();
                    }
                    // If the hour value is later than the current hour, it submits the form data.
                    else
                    {
                        form.submit();
                    }
                }
                // If the chosen day is earlier than the current day, it sets a custom validity message and reports it to the user.
                else if (datePickerDay < currentDate)
                {
                    datePicker.setCustomValidity("Please enter a valid date in the future.");
                    datePicker.reportValidity();
                }
                // If the day value is less than the current day, it submits the form data.
                else
                {
                    form.submit();
                }
            }
            // If the chosen month is earlier than the current month, it sets a custom validity message and reports it to the user.
            else if (datePickerMonth < currentMonth)
            {
                datePicker.setCustomValidity("Please enter a valid date in the future.");
                datePicker.reportValidity();
            }
            // If the chosen month is later than the current month, it submits the form data.
            else
            {
                form.submit();
            }
        }
        // If the chosen year is earlier than the current year, it sets a custom validity message and reports it to the user.
        else if (datePickerYear < currentYear)
        {
            datePicker.setCustomValidity("Please enter a valid date in the future.");
            datePicker.reportValidity();
        }
        // If the chosen year is later than the current year, it submits the form data.
        else 
        {
            form.submit();
        }
    }
    // If the datePicker is not present, but the day checkBoxes are, it then determines each checkBoxes value.
    else if (!!document.getElementById("dayCheckBoxesContainer"))
    {
        var sundayBox = document.getElementById("sundayCheckBox");
        var mondayBox = document.getElementById("mondayCheckBox");
        var tuesdayBox = document.getElementById("tuesdayCheckBox");
        var wednesdayBox = document.getElementById("wednesdayCheckBox");
        var thursdayBox = document.getElementById("thursdayCheckBox");
        var fridayBox = document.getElementById("fridayCheckBox");
        var saturdayBox = document.getElementById("saturdayCheckBox");

        if (!sundayBox.checked && !mondayBox.checked && !tuesdayBox.checked && !wednesdayBox.checked && !thursdayBox.checked && !fridayBox.checked && !saturdayBox.checked)
        {
            // It then checks if all seven checkBoxes are unchecked, and if so it sets a custom validity message and reports it to the user.
            let frequencySelect = document.getElementById("frequencySelect");
            frequencySelect.setCustomValidity("Please select a day(s) of the week or change to a different notification frequency for the reminder to notify you.");
            frequencySelect.reportValidity();
        }
        // If at least one checkBox is checked, the form is submitted.
        else
        {
            form.submit();
        }
    }
    // If neither the datePicker or the day checkBoxes are present, it submits the form's data.
    else 
    {
        form.submit();
    }
}