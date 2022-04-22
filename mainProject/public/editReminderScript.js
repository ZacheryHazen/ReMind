if (!!!document.getElementById("errorMessageContainer"))
{
    let deleteReminder = document.getElementById("deleteReminder");
    deleteReminder.addEventListener("click", () => {
        document.getElementById("deleteForm").submit();
    })
    let fieldsContainer = document.getElementById("reminderFields");
    let radioOneTime = document.getElementById("frequencyRadioOneTime");
    let radioRepeated = document.getElementById("frequencyRadioRepeated");
    let submitButton = document.getElementById("addReminderButton");
    var timePicker = document.getElementById("timePicker");
    
    radioOneTime.addEventListener("click", displayOneTimeFields);
    radioRepeated.addEventListener("click", displayRepeatedFields);
    submitButton.addEventListener("click", checkToSubmitForm);
    var form = document.getElementById("editReminderForm");
    
    var timePicker = document.getElementById('timePicker');
    timePicker.addEventListener("input", () => {
        timePicker.setCustomValidity("");
    })

    if (radioOneTime.checked)
    {
        var datePicker = document.getElementById('datePicker');
        datePicker.addEventListener("input", () => {
            datePicker.setCustomValidity("");
        });
    }
    else
    {
        var newSelect = document.getElementById("frequencySelect");
        newSelect.addEventListener("change", displayOrRemoveDayOptions);
    }




function displayOneTimeFields()
{
    if (!!document.getElementById("frequencySelectContainer"))
    {
        fieldsContainer.removeChild(document.getElementById("frequencySelectContainer"));
    }
    if (!!document.getElementById("dayCheckBoxesContainer"))
    {
        fieldsContainer.removeChild(document.getElementById("dayCheckBoxesContainer"));
    }
    if (!(!!document.getElementById("datePickerContainer")))
    {
        let newDiv = document.createElement("div");
        newDiv.classList.add("container-fluid");
        newDiv.classList.add("ps-0");
        newDiv.classList.add("pe-1");
        newDiv.classList.add("mb-2");
        newDiv.classList.add("mt-1");
        newDiv.classList.add("d-flex");
        newDiv.id = "datePickerContainer";
        let newLabel = document.createElement("label");
        newLabel.htmlFor = "datePicker";
        newLabel.innerText = "What date should this reminder notify you?";
        newLabel.id="datePickerLabel";
        newDiv.appendChild(newLabel);
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
        })
        fieldsContainer.insertBefore(newDiv, document.getElementById("reminderDescriptionContainer"));
    }
}

function displayRepeatedFields()
{
    if (!!document.getElementById("datePickerContainer"))
    {
        fieldsContainer.removeChild(document.getElementById("datePickerContainer"));
    }
    if (!(!!document.getElementById("frequencySelectContainer")))
    {
        let newDiv = document.createElement("div");
        newDiv.classList.add("ps-0");
        newDiv.classList.add("pe-1");
        newDiv.classList.add("mb-2");
        newDiv.classList.add("d-flex");
        newDiv.id = "frequencySelectContainer";
        let newLabel = document.createElement("label");
        newLabel.htmlFor = "frequencySelect";
        newLabel.innerText = "How frequently would you like to be notified by this reminder?";
        newLabel.id="frequencySelectLabel";
        newDiv.appendChild(newLabel);
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
        newDiv.appendChild(newSelect);
        fieldsContainer.insertBefore(newDiv, document.getElementById("timePickerContainer"));
        newSelect.addEventListener("change", displayOrRemoveDayOptions);
    }
}

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

function displayDayOptions()
{
    if (!(!!document.getElementById("dayCheckBoxesContainer")))
    {
        let newDiv = document.createElement("div");
        newDiv.classList.add("ps-0");
        newDiv.classList.add("pe-0");
        newDiv.classList.add("mb-2");
        newDiv.classList.add("d-flex");
        newDiv.classList.add("justify-content-between");
        newDiv.id = "dayCheckBoxesContainer";
        let days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
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
        fieldsContainer.insertBefore(newDiv, document.getElementById("timePickerContainer"));
    }
}

function removeDayOptions()
{
    if (!!document.getElementById("dayCheckBoxesContainer"))
    {
        fieldsContainer.removeChild(document.getElementById("dayCheckBoxesContainer"));
    }
}

function checkToSubmitForm()
{
    if (timePicker.value =="")
    {
        timePicker.reportValidity();
    }
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

        if (datePicker.value == "")
        {
            datePicker.reportValidity();
        }
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
                        else
                        {
                            form.submit();
                        }
                    }
                    else if (timePickerHour < currentHour)
                    {
                        timePicker.setCustomValidity("Please enter a valid time in the future.");
                        timePicker.reportValidity();
                    }
                    else
                    {
                        form.submit();
                    }
                }
                else if (datePickerDay < currentDate)
                {
                    datePicker.setCustomValidity("Please enter a valid date in the future.");
                    datePicker.reportValidity();
                }
                else
                {
                    form.submit();
                }
            }
            else if (datePickerMonth < currentMonth)
            {
                datePicker.setCustomValidity("Please enter a valid date in the future.");
                datePicker.reportValidity();
            }
            else
            {
                form.submit();
            }
        }
        else if (datePickerYear < currentYear)
        {
            datePicker.setCustomValidity("Please enter a valid date in the future.");
            datePicker.reportValidity();
        }
        else 
        {
            form.submit();
        }
    }
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
            let frequencySelect = document.getElementById("frequencySelect");
            frequencySelect.setCustomValidity("Please select a day(s) of the week or change to a different notification frequency for the reminder to notify you.");
            frequencySelect.reportValidity();
        }
        else
        {
            form.submit();
        }
    }
    else 
    {
        form.submit();
    }
}
}