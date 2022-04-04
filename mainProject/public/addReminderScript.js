let fieldsContainer = document.getElementById("reminderFields");
let radioOneTime = document.getElementById("frequencyRadioOneTime");
let radioRepeated = document.getElementById("frequencyRadioRepeated");


radioOneTime.addEventListener("click", displayOneTimeFields);
radioRepeated.addEventListener("click", displayRepeatedFields);


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
        newInput.classList.add("ms-auto");
        newInput.classList.add("datePicker");
        newDiv.appendChild(newInput);
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
        option1.id = "optionDaily";
        option1.innerText = "Daily";
        newSelect.appendChild(option1);
        let option2 = document.createElement("option");
        option2.value = "Weekly";
        option2.id = "optionWeekly";
        option2.innerText = "Weekly";
        newSelect.appendChild(option2);
        let option3 = document.createElement("option");
        option3.value = "Biweekly"
        option3.id = "optionBiweekly";
        option3.innerText = "Biweekly";
        newSelect.appendChild(option3);
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
        console.log("1");
        displayDayOptions();
    }
    else
    {
        console.log("2");
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
            newCheckBox.name = days[counter].toLowerCase + "CheckBox";
            newDiv.appendChild(newCheckBox);
            let newLabel = document.createElement("label");
            newLabel.classList.add("form-check-label");
            newLabel.htmlFor = days[counter].toLowerCase + "CheckBox";
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