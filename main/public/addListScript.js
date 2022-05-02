// This file serves as the backing script for the Add List web page. It facilitates the adding/removing list item functionality and the
// submission of the form to the server. Additionally, it handles all custom item group functionality.

let listItemLink = document.getElementById("addListItem");
let toDoItemsContainer = document.getElementById("toDoItems");
// The Add List Item link is given the event listener on its click event to call the addNewItem function.
listItemLink.addEventListener("click", addNewItem);

// This function, which is called when the Add List Item link is clicked, adds all the elements in a list item row to the form as well as assigns the correct event listeners.
function addNewItem() {
    numberOfItems++;
    // The div that holds all the elements is created.
    var newField = document.createElement("div");
    newField.classList.add("container");
    newField.classList.add("formListItem");
    newField.classList.add("mt-1");
    // The label for the text input for the item is created and added to the div.
    var newLabel = document.createElement("label");
    newLabel.classList.add("formLabel");
    newLabel.htmlFor = "listItem" + numberOfItems.toString();
    newLabel.innerText = "Enter List Item " + numberOfItems + ":";
    newField.appendChild(newLabel);
    // A new div is created to hold the input and icon.
    var newDiv = document.createElement("div");
    newDiv.classList.add("listItemRow");
    // The text input that holds the description for the item is created and added to the div.
    var newInput = document.createElement("input");
    newInput.type = "text";
    newInput.classList.add("form-control");
    newInput.classList.add("me-1");
    newInput.name = "listItem" + numberOfItems;
    newInput.id = "listItem" + numberOfItems;
    newInput.placeholder = "Enter List Item " + numberOfItems;
    newInput.maxLength = "200";
    newDiv.appendChild(newInput);
    // The delete icon for the item is created and added to the div as well as assigned the correct event listener.
    var newIcon = document.createElement("i");
    newIcon.classList.add("bi");
    newIcon.classList.add("bi-trash");
    newIcon.classList.add("reMindLinks");
    newIcon.classList.add("bootstrapIcon");
    newIcon.name = "deleteIcon";
    newIcon.addEventListener("click", deleteItem);
    newDiv.appendChild(newIcon);
    // The field div adds the div holding the input and icon to itself.
    newField.appendChild(newDiv);
    // The new div is added to the form, and the Add List Item link is removed and re-added to the bottom of the form
    toDoItemsContainer.appendChild(newField);
    var self = toDoItemsContainer.children[numberOfItems-1];
    toDoItemsContainer.removeChild(self);
    toDoItemsContainer.appendChild(self);
}

let numberOfItems = 1;

// Each delete icon is given an event listener on its click event to call the deleteItem function.
let deleteIcons = document.getElementsByName("deleteIcon");
for (let icon of deleteIcons)
{
    icon.addEventListener("click", deleteItem);
}

// This function handles the deletion of a list item by using its substring to determine its item number.
// It then updates all the following items to have the correct number and formatting.
function deleteItem() {
    var parent = this.parentElement;
    var itemInput = parent.children[0];
    let index = itemInput.name.substring(8);
    var grandparent = parent.parentElement;
    toDoItemsContainer.removeChild(grandparent);
    numberOfItems--;
    for (let counter = index; counter < toDoItemsContainer.children.length; counter++)
    {
        if (counter == 1)
        {
            toDoItemsContainer.children[counter-1].classList.remove("mt-1");
        }
        toDoItemsContainer.children[counter-1].children[0].htmlFor = "listItem" + counter;
        toDoItemsContainer.children[counter-1].children[0].innerText = "Enter List Item " + counter + ":";
        toDoItemsContainer.children[counter-1].children[1].children[0].name = "listItem" + counter;
        toDoItemsContainer.children[counter-1].children[1].children[0].id = "listItem" + counter;
        toDoItemsContainer.children[counter-1].children[1].children[0].placeholder = "Enter List Item " + counter;
    }
}

// This assigns an event listener to the click event of all of the rows holding custom groups on the initially hidden modal. This listener calls the addSavedGroupToList function.
let customGroupRows = document.getElementsByClassName("customItemGroupRow");
for (let row of customGroupRows)
{
    row.addEventListener("click", addSavedGroupToList);
}
// It then checks if there are any customItemGroups added, and if so it adds the event listener to the last row as well. This needs to be done separately due to the different class on the last row.
if (document.getElementsByClassName("customItemGroupLastRow").length > 0)
{
    document.getElementsByClassName("customItemGroupLastRow")[0].addEventListener("click", addSavedGroupToList);
}

// This function adds the clicked Custom Item Group to the main form's list page as list items. Additionally, it hides the custom groups modal to show the user the changes made.
function addSavedGroupToList()
{
    // The modal holding the custom groups is hidden.
    hideCustomGroupsModal();
    // It first checks if this is a newly created item, as they are handled differently and are not passed by the server.
    if (this.name != -1)
    {
        // If it is not newly created, it simply finds the group from the passed groups and adds each item from the group sequentially.
        let group = passedCustomItemGroups.find(g => g.groupID == this.id.substring(5));
        for (let counter = 0; counter < group.items.length; counter++)
        {
            // It checks whether there are any items added as of yet, and if there are not it simply replaces the first row with the first item in the custom group.
            if (toDoItemsContainer.children.length > 0)
            {
                if (toDoItemsContainer.children[0].children[1].children[0].value == "" && toDoItemsContainer.children.length == 2)
                {
                    toDoItemsContainer.children[0].children[1].children[0].value = group.items[counter][0];
                }
                else
                {
                    addNewItem();
                    toDoItemsContainer.children[toDoItemsContainer.children.length-2].children[1].children[0].value = group.items[counter][0];
                }
            }
            else
            {
                // Otherwise it just adds these new group items after the previously defined items.
                addNewItem();
                toDoItemsContainer.children[toDoItemsContainer.children.length-2].children[1].children[0].value = group.items[counter][0];
            }
        }
    }
    else
    {
        // If it is newly created, it has to determine what items to add, as the only sources of information are the name of the row and the items column of the row.
        // It first gets where any commas are inserted by the user in the items, as this helps parse the information and not split up any items unintentionally - commas are how the form delimits each item.
        let commaPlacements = this.children[1].name.split('-');
        let items = [];
        let lastSegmentCutoff = 0; 
        // It then iterates through each letter in the items section of the custom group row, checking for commas.
        for (let counter = 0; counter < this.children[1].innerText.length; counter++)
        {
            // If a comma is found and our comma placements guide tells us that this is not user-inputted, we add the item to our items array.
            if (this.children[1].innerText[counter] == ',' && !(!!commaPlacements.find(c => c == counter+1)))
            {
                items.push(this.children[1].innerText.substring(lastSegmentCutoff, counter));
                lastSegmentCutoff = counter+2;
            }
        }
        // We then add the last section to our items array.
        items.push(this.children[1].innerText.substring(lastSegmentCutoff));
        // We then add all of the items to our form sequentially, checking the same things as above to determine if it is a new list with no items.
        for (let counter = 0; counter < items.length; counter++)
        {
            if (toDoItemsContainer.children.length > 0)
            {
                if (toDoItemsContainer.children[0].children[1].children[0].value == "" && toDoItemsContainer.children.length == 2)
                {
                    toDoItemsContainer.children[0].children[1].children[0].value = items[counter];
                }
                else
                {
                    addNewItem();
                    toDoItemsContainer.children[toDoItemsContainer.children.length-2].children[1].children[0].value = items[counter];
                }
            }
            else
            {
                addNewItem();
                toDoItemsContainer.children[toDoItemsContainer.children.length-2].children[1].children[0].value = items[counter];
            }
        }
    }
}

// We now define various elements to easily give them eventListeners and use them in our functions throughout the list.
let customItemGroupsModal = document.getElementById("customItemGroupsModal");
let newCustomGroupModal = document.getElementById("createNewCustomGroupModal");
let cancelCustomGroups = document.getElementById("customItemGroupsCancel");
let closeCustomGroups = document.getElementById("customItemGroupsClose");
let cancelNewItemsGroup = document.getElementById("newItemGroupCancel");
let closeNewItemsGroup = document.getElementById("newItemsGroupClose");
let addNewGroupLink = document.getElementById("addGroupListLink");
let createNewGroupItemsLink = document.getElementById("createNewCustomGroup");

// This adds the functionality to the Add New Group link to display the customItemsGroupModal.
addNewGroupLink.addEventListener("click", function() {
    customItemGroupsModal.removeAttribute("hidden");
});

// This adds the functionality to the Create New Group link to display the newCustomGroupModal.
createNewGroupItemsLink.addEventListener("click", function() {
    newCustomGroupModal.removeAttribute("hidden");
});

// We then add various functions to the elements defined above - the cancel and close buttons for the first modal call the hideCustomGroupsModal button.
cancelCustomGroups.addEventListener("click", hideCustomGroupsModal);
closeCustomGroups.addEventListener("click", hideCustomGroupsModal);
// The cancel and close buttons for the newCustomGroupModal get assigned two functions on click - hideNewItemsGroupModal and resetNewItemGroupForm.
cancelNewItemsGroup.addEventListener("click", hideNewItemsGroupModal);
cancelNewItemsGroup.addEventListener("click", resetNewItemGroupForm);
closeNewItemsGroup.addEventListener("click", hideNewItemsGroupModal);
closeNewItemsGroup.addEventListener("click", resetNewItemGroupForm);

// This function simply hides the customItemGroupsModal.
function hideCustomGroupsModal() {
    customItemGroupsModal.setAttribute("hidden", "");
}

// This function simply hides the newCustomGroupModal.
function hideNewItemsGroupModal() {
    newCustomGroupModal.setAttribute("hidden", "")
}

let groupToDoItemsContainer = document.getElementById("groupItems");
let groupNumberOfItems = 1;
// The Add Group Item link is then given an event listener for the addNewGroupItem function.
addGroupItem = document.getElementById("addGroupItem");
addGroupItem.addEventListener("click", AddNewGroupItem);

// This function, which is called when the Add Group Item link is clicked, adds all the elements in a group item row to the form as well as assigns the correct event listeners.
function AddNewGroupItem() {
    groupNumberOfItems++;
    // It first creates the div that holds the elements of the new row.
    var newField = document.createElement("div");
    newField.classList.add("container");
    newField.classList.add("formListItem");
    // It then creates the label for the group item row and appends it to the div.
    var newLabel = document.createElement("label");
    newLabel.classList.add("formLabel");
    newLabel.htmlFor = "groupItem" + groupNumberOfItems.toString();
    newLabel.innerText = "Enter Group Item " + groupNumberOfItems + ":";
    newField.appendChild(newLabel);
    // Next, it creates the div that holds the text input and the delete icon.
    var newDiv = document.createElement("div");
    newDiv.classList.add("groupItemRow");
    // Then the new input is created and added to the second div.
    var newInput = document.createElement("input");
    newInput.type = "text";
    newInput.classList.add("form-control");
    newInput.classList.add("me-1");
    newInput.name = "groupItem" + groupNumberOfItems;
    newInput.id = "groupItem" + groupNumberOfItems;
    newInput.placeholder = "Enter Group Item " + groupNumberOfItems;
    newInput.maxLength = "200";
    newDiv.appendChild(newInput);
    // The delete icon is created next and assigned the correct event listener. It is also added to the second div.
    var newIcon = document.createElement("i");
    newIcon.classList.add("bi");
    newIcon.classList.add("bi-trash");
    newIcon.classList.add("reMindLinks");
    newIcon.classList.add("bootstrapIcon");
    newIcon.name = "deleteIcon";
    newIcon.addEventListener("click", deleteGroupItem);
    newDiv.appendChild(newIcon);
    // The second div is then added to the first.
    newField.appendChild(newDiv);
    // This div is then added to the modal and displayed to the user.
    groupToDoItemsContainer.appendChild(newField);
    // The Add Group Item link is removed and re-added to the bottom of the form.
    var self = groupToDoItemsContainer.children[groupNumberOfItems-1];
    groupToDoItemsContainer.removeChild(self);
    groupToDoItemsContainer.appendChild(self);
}

// This adds an event listener to every delete icon that calls the deleteGroupItem function on click.
let groupDeleteIcons = document.getElementsByName("groupDeleteIcon");
for (let icon of groupDeleteIcons)
{
    icon.addEventListener("click", deleteGroupItem);        
}

// This function handles the deletion of a group item by using its substring to determine its item number.
// It then updates all the following items to have the correct number in their various elements.
function deleteGroupItem() {
    var parent = this.parentElement;
    var itemInput = parent.children[0];
    let index = itemInput.name.substring(9);
    var grandparent = parent.parentElement;
    groupToDoItemsContainer.removeChild(grandparent);
    groupNumberOfItems--;          
    for (let counter = index; counter < groupToDoItemsContainer.children.length; counter++)
    {
        if (counter == 1)
        {
            groupToDoItemsContainer.children[counter-1].classList.remove("mt-1");
        }
        groupToDoItemsContainer.children[counter-1].children[0].htmlFor = "groupItem" + counter;
        groupToDoItemsContainer.children[counter-1].children[0].innerText = "Enter Group Item " + counter + ":";
        groupToDoItemsContainer.children[counter-1].children[1].children[0].name = "groupItem" + counter;
        groupToDoItemsContainer.children[counter-1].children[1].children[0].id = "groupItem" + counter;
        groupToDoItemsContainer.children[counter-1].children[1].children[0].placeholder = "Enter Group Item " + counter;
    }
}

// This then initializes more elements and adds an event listener to the saveNewItemGroup button.
var form = document.getElementById("newItemGroupForm");
let saveNewGroupItem = document.getElementById("addNewItemGroup");
let groupName = document.getElementById("groupName");
saveNewGroupItem.addEventListener("click", () => {
    // This function checks whether the name is empty, if it is not it submits asynchronously the new group to the server using a FormData object.
    // It then adds the created group to the Custom Groups modal and resets and hides the current modal.
    if (groupName.value != "")
    {
        var request = new XMLHttpRequest();
        formData = new FormData(form);
        request.open("POST", "/itemGroups");
        request.send(formData);
        addCreatedGroupToCustomGroupsModal();
        resetNewItemGroupForm();
        hideNewItemsGroupModal();
    }
    else
    {
        // If the name has not been entered, it reports the validity of the input to the user.
        groupName.reportValidity();
    }
})

// This function resets all fields in the New Item Group form so opening the modal again will show an empty form.
function resetNewItemGroupForm()
{
    let numberOfChildrenToRemove = groupToDoItemsContainer.children.length-2;
    // It first removes all added items.
    for (let counter = 0; counter < numberOfChildrenToRemove; counter++)
    {
        groupToDoItemsContainer.removeChild(groupToDoItemsContainer.children[1]);
    }
    // It then checks if there are any items, and sets any possible values to blank.
    if (!!document.getElementsByClassName("groupItemRow"))
    {
        groupToDoItemsContainer.children[0].children[1].children[0].value = "";
    }
    else
    {  
        listItemLink.click();
    }
    // It also clears the name field.
    groupName.value = "";
    groupNumberOfItems = 1;
}

// This function facilitates the functionality of adding a new group to the Custom Groups modal. It takes all of its value from the New Item Group form.
function addCreatedGroupToCustomGroupsModal()
{
    // It first iterates through all of the Group Item rows in the New Item Group form, checking if any values are null, and if they are not it pushes them to the items array.
    let groupItemRows = document.getElementsByClassName("groupItemRow");
    let itemValues = [];
    for (let row of groupItemRows)
    {
        if (row.children[0].value != "")
        {
            itemValues.push(row.children[0].value);
        }
    }
    // It then reads the group name value and checks if any groups already exist, and if so it removes the customItemGroupLastRow class from the last element and adds the customItemGroupRow instead.
    let groupNameValue = groupName.value;
    let customItemGroupTable = document.getElementsByClassName("customItemGroupTable")[0];
    if(!!customItemGroupTable && customItemGroupTable.children.length != 0)
    {
        customItemGroupTable.children[customItemGroupTable.children.length-1].classList.remove("customItemGroupLastRow");
        customItemGroupTable.children[customItemGroupTable.children.length-1].classList.add("customItemGroupRow");
    }

    // It then creates an entirely new row to hold the newly created group.
    // It first creates the div that will hold the new data.
    let rowContainer = document.createElement("div");
    rowContainer.classList.add("row");
    rowContainer.classList.add("customItemGroupLastRow");
    rowContainer.classList.add("ms-0");
    rowContainer.classList.add("me-0");
    rowContainer.name = -1;
    // It then creates the div that will hold the title of the group and appends this to the parent div.
    let titleDiv = document.createElement("div");
    titleDiv.classList.add("col-3");
    titleDiv.classList.add("customItemGroupTitle");
    titleDiv.innerText = groupNameValue;
    rowContainer.appendChild(titleDiv);
    // It then creates the div that will hold the items of the group and begins populating it with values.
    let itemsDiv = document.createElement("div");
    itemsDiv.classList.add("col-9");
    itemsDiv.classList.add("customItemGroupItems");
    let itemString = "";
    let commaPlacements = "";
    // As items are delimited by commas, we need to differentiate for ourselves which commas are created be users in the items, so we iterate through each item and check each character 
    // to find if there's a user-defined comma. If there is, we add its index position to the commaPlacements string, which we will use later to retrieve the items and place them on the main list.
    for (let valueCounter = 0; valueCounter < itemValues.length -1; valueCounter++)
    {
        if (itemValues[valueCounter] != "")
        {
            for (let counter = 0; counter < itemValues[valueCounter].length; counter++)
            {
                if (itemValues[valueCounter][counter] == ',')
                {
                    let commaPlacement = counter + itemString.length + 1;
                    commaPlacements += commaPlacement + "-";
                }
            }
            // It then adds each item to itemString, delineating by a comma as mentioned above.
            itemString += itemValues[valueCounter] + ", ";
        }        
    }
    // It then goes through the above process for the last item, which is handled seperately to ensure no extra commas are displayed on the user's end.
    let lastString = itemValues[itemValues.length-1];
    if (lastString != "" && lastString != undefined)
    {
        for (let counter = 0; counter < lastString.length; counter++)
        {
            if (lastString[counter] == ',')
            {
                let commaPlacement = counter + itemString.length + 1;
                commaPlacements += commaPlacement + "-";
            }
        }
    }
    if (lastString == undefined)
    {
        lastString = "";
    }
    // It then adds this string to itemString as well.
    itemString += lastString;
    // itemString is then displayed to the user in the itemsDiv, which is added to the parent div. The commaPlacements string is inputted as the name of this element as well for accessing in other functions.
    itemsDiv.innerText = itemString;
    itemsDiv.name = commaPlacements;
    rowContainer.appendChild(itemsDiv);
    // The event listener is added to each row to call addSavedGroupToList on click.
    rowContainer.addEventListener("click", addSavedGroupToList);
    // It then checks if there are any elements added, and if there are not it reveals the customItemGroupTable and hides the message stating that no groups have been added.
    if (customItemGroupTable.children.length == 0)
    {
        customItemGroupTable.removeAttribute("hidden");
        document.getElementById("noGroupsMessage").setAttribute("hidden", "");
    }
    // The new row is then added to the customItemGroupTable.
    customItemGroupTable.appendChild(rowContainer);
}