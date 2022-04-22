if (!!!document.getElementById("errorMessageContainer"))
{
    let deleteList = document.getElementById("deleteList");
    deleteList.addEventListener("click", () => {
        document.getElementById("deleteForm").submit();
    })
    let toDoItemsContainer = document.getElementById("toDoItems");
    let deleteIcons = document.getElementsByName("deleteIcon");
    let editIcons = document.getElementsByName("editIcon");
    let listItemLink = document.getElementById("addListItem");
    let checkBoxes = document.getElementsByClassName("form-check-input");
    let numberOfItems = toDoItemsContainer.children.length - 1;


    for (let icon of deleteIcons)
    {
        icon.addEventListener("click", deleteItem);
    }

    for (let icon of editIcons)
    {
        icon.addEventListener("click", editItem);
    }

    for (let checkBox of checkBoxes)
    {
        checkBox.addEventListener("click", checkUnCheckItem);
    }


listItemLink.addEventListener("click", addNewItem);

function addNewItem() {
    numberOfItems++;
    var newField = document.createElement("div");
    newField.classList.add("container");
    newField.classList.add("editViewItemRow");
    newField.classList.add("d-flex");
    newField.classList.add("pt-2");
    var newCheckBox = document.createElement("input");
    newCheckBox.type = "checkbox";
    newCheckBox.classList.add("form-check-input");
    newCheckBox.classList.add("me-2");
    newCheckBox.classList.add("pb-1");
    newCheckBox.name = "checkBox" + numberOfItems;
    newCheckBox.addEventListener("click", checkUnCheckItem);
    newField.appendChild(newCheckBox);
    var newTextBox = document.createElement("input");
    newTextBox.type = "text";
    newTextBox.classList.add("form-control");
    newTextBox.classList.add("me-2");
    newTextBox.name = "text" + numberOfItems;
    newTextBox.placeholder = "Enter List Item " + numberOfItems;
    newField.appendChild(newTextBox);
    var finishIcon = document.createElement("i");
    finishIcon.classList.add("bi");
    finishIcon.classList.add("bi-check2");
    finishIcon.classList.add("ms-auto");
    finishIcon.classList.add("bootstrapIcon");
    finishIcon.classList.add("reMindLinks");
    finishIcon.classList.add("finishIcon");
    finishIcon.name = "finishIcon";
    finishIcon.addEventListener("click", finishEditingItem);
    newField.appendChild(finishIcon);
    var trashIcon = document.createElement("i");
    trashIcon.classList.add("bi");
    trashIcon.classList.add("bi-trash");
    trashIcon.classList.add("bootstrapIcon");
    trashIcon.classList.add("reMindLinks");
    trashIcon.classList.add("ms-2");
    trashIcon.name = "deleteIcon";
    trashIcon.addEventListener("click", deleteItem);
    newField.appendChild(trashIcon);
    toDoItemsContainer.appendChild(newField);
    toDoItemsContainer.removeChild(listItemLink.parentElement);
    toDoItemsContainer.appendChild(listItemLink.parentElement);
}

function deleteItem()
{
    let parent = this.parentElement;
    var itemInput = parent.children[1];
    let index = parseInt(itemInput.placeholder.substring(16));
    toDoItemsContainer.removeChild(parent);
    numberOfItems--;
    for (let counter = index; counter < toDoItemsContainer.children.length; counter++)
    {
        toDoItemsContainer.children[counter-1].children[1].placeholder = "Enter List Item " + counter;
        toDoItemsContainer.children[counter-1].children[0].name = "checkBox" + counter;
        toDoItemsContainer.children[counter-1].children[1].name = "text" + counter;
    }
}

function editItem()
{
    let parent = this.parentElement;
    let textInput = parent.children[1];
    textInput.removeAttribute("readonly");
    textInput.classList.remove("editViewItemInputReadonly");
    var finishIcon = document.createElement('i');
    finishIcon.classList.add("bi");
    finishIcon.classList.add("bi-check2");
    finishIcon.classList.add("ms-auto");
    finishIcon.classList.add("bootstrapIcon");
    finishIcon.classList.add("reMindLinks");
    finishIcon.classList.add("finishIcon");
    finishIcon.name = "finishIcon";
    parent.removeChild(this);
    parent.insertBefore(finishIcon, parent.children[2]);
    finishIcon.addEventListener("click", finishEditingItem);
}

function finishEditingItem()
{
    let parent = this.parentElement;
    let textInput = parent.children[1];
    textInput.setAttribute("readonly", "")
    textInput.classList.add("editViewItemInputReadonly");
    var editIcon = document.createElement('i');
    editIcon.classList.add("bi");
    editIcon.classList.add("bi-pencil");
    editIcon.classList.add("ms-auto");
    editIcon.classList.add("bootstrapIcon");
    editIcon.classList.add("reMindLinks");
    editIcon.name = "editIcon";
    parent.removeChild(this);
    parent.insertBefore(editIcon, parent.children[2]);
    editIcon.addEventListener("click", editItem);
}

function checkUnCheckItem()
{
    let parent = this.parentElement;
    let text = parent.children[1];
    if (text.classList.contains("checkedItem"))
    {
        text.classList.remove("checkedItem");
    }
    else
    {
        text.classList.add("checkedItem");
    }
}


let customGroupRows = document.getElementsByClassName("customItemGroupRow");
for (let row of customGroupRows)
{
    row.addEventListener("click", addSavedGroupToList);
}
document.getElementsByClassName("customItemGroupLastRow")[0].addEventListener("click", addSavedGroupToList);

function addSavedGroupToList()
{
    hideCustomGroupsModal();
    if (this.name != -1)
    {
        let group = customItemGroups.find(g => g.id == this.id.substring(5));
        for (let counter = 0; counter < group.items.length; counter++)
        {
            addNewItem();
            toDoItemsContainer.children[toDoItemsContainer.children.length-2].children[1].value = group.items[counter][0];
            toDoItemsContainer.children[toDoItemsContainer.children.length-2].children[2].click();
        }
    }
    else
    {
        let commaPlacements = this.children[1].name.split('-');
        let items = [];
        let lastSegmentCutoff = 0; 
        for (let counter = 0; counter < this.children[1].innerText.length; counter++)
        {
            if (this.children[1].innerText[counter] == ',' && !(!!commaPlacements.find(c => c == counter+1)))
            {
                items.push(this.children[1].innerText.substring(lastSegmentCutoff, counter));
                lastSegmentCutoff = counter+2;
            }
        }
        items.push(this.children[1].innerText.substring(lastSegmentCutoff));
        for (let counter = 0; counter < items.length; counter++)
        {
            addNewItem();
            toDoItemsContainer.children[toDoItemsContainer.children.length-2].children[1].value = items[counter];
            toDoItemsContainer.children[toDoItemsContainer.children.length-2].children[2].click();
        }
    }
}

let customItemGroupsModal = document.getElementById("customItemGroupsModal");
let newCustomGroupModal = document.getElementById("createNewCustomGroupModal");
let cancelCustomGroups = document.getElementById("customItemGroupsCancel");
let closeCustomGroups = document.getElementById("customItemGroupsClose");
let cancelNewItemsGroup = document.getElementById("newItemGroupCancel");
let closeNewItemsGroup = document.getElementById("newItemsGroupClose");
let addNewGroupLink = document.getElementById("addGroupListLink");
let createNewGroupItemsLink = document.getElementById("createNewCustomGroup");

addNewGroupLink.addEventListener("click", function() {
    customItemGroupsModal.removeAttribute("hidden");
})

createNewGroupItemsLink.addEventListener("click", function() {
    newCustomGroupModal.removeAttribute("hidden");
})

cancelCustomGroups.addEventListener("click", hideCustomGroupsModal);
closeCustomGroups.addEventListener("click", hideCustomGroupsModal);
cancelNewItemsGroup.addEventListener("click", hideNewItemsGroupModal);
cancelNewItemsGroup.addEventListener("click", resetNewItemGroupForm);
closeNewItemsGroup.addEventListener("click", hideNewItemsGroupModal);
closeNewItemsGroup.addEventListener("click", resetNewItemGroupForm);

function hideCustomGroupsModal() {
    customItemGroupsModal.setAttribute("hidden", "");
}

function hideNewItemsGroupModal() {
    newCustomGroupModal.setAttribute("hidden", "")
}

let groupToDoItemsContainer = document.getElementById("groupItems");
let groupNumberOfItems = 1;
addGroupItem = document.getElementById("addGroupItem");
addGroupItem.addEventListener("click", AddNewGroupItem);

function AddNewGroupItem() {
    groupNumberOfItems++;
    var newField = document.createElement("div");
    newField.classList.add("container");
    newField.classList.add("formListItem");
    var newLabel = document.createElement("label");
    newLabel.classList.add("formLabel");
    newLabel.htmlFor = "groupItem" + groupNumberOfItems.toString();
    newLabel.innerText = "Enter Group Item " + groupNumberOfItems + ":";
    newField.appendChild(newLabel);
    var newDiv = document.createElement("div");
    newDiv.classList.add("groupItemRow");
    var newInput = document.createElement("input");
    newInput.type = "text";
    newInput.classList.add("form-control");
    newInput.classList.add("me-1");
    newInput.name = "groupItem" + groupNumberOfItems;
    newInput.id = "groupItem" + groupNumberOfItems;
    newInput.placeholder = "Enter Group Item " + groupNumberOfItems;
    newDiv.appendChild(newInput);
    var newIcon = document.createElement("i");
    newIcon.classList.add("bi");
    newIcon.classList.add("bi-trash");
    newIcon.classList.add("reMindLinks");
    newIcon.classList.add("bootstrapIcon");
    newIcon.name = "deleteIcon";
    newIcon.addEventListener("click", deleteGroupItem);
    newDiv.appendChild(newIcon);
    newField.appendChild(newDiv);
    groupToDoItemsContainer.appendChild(newField);
    var self = groupToDoItemsContainer.children[groupNumberOfItems-1];
    groupToDoItemsContainer.removeChild(self);
    groupToDoItemsContainer.appendChild(self);
}

let groupDeleteIcons = document.getElementsByName("groupDeleteIcon");
for (let icon of groupDeleteIcons)
{
    icon.addEventListener("click", deleteGroupItem);        
}

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

var form = document.getElementById("newItemGroupForm");
let saveNewGroupItem = document.getElementById("addNewItemGroup");
let groupName = document.getElementById("groupName");
saveNewGroupItem.addEventListener("click", () => {
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
        groupName.reportValidity();
    }
})

function resetNewItemGroupForm()
{
    let numberOfChildrenToRemove = groupToDoItemsContainer.children.length-2 
    for (let counter = 0; counter < numberOfChildrenToRemove; counter++)
    {
        groupToDoItemsContainer.removeChild(groupToDoItemsContainer.children[1]);
    }
    if (!!document.getElementsByClassName("groupItemRow"))
    {
        groupToDoItemsContainer.children[0].children[1].children[0].value = "";
    }
    else
    {  
        listItemLink.click();
    }
    groupName.value = "";
    groupNumberOfItems = 1;
}


function addCreatedGroupToCustomGroupsModal()
{
    let groupItemRows = document.getElementsByClassName("groupItemRow");
    let itemValues = [];
    for (let row of groupItemRows)
    {
        if (row.children[0].value != "")
        {
            itemValues.push(row.children[0].value);
        }
    }
    let groupNameValue = groupName.value;
    let customItemGroupTable = document.getElementsByClassName("customItemGroupTable")[0];
    customItemGroupTable.children[customItemGroupTable.children.length-1].classList.remove("customItemGroupLastRow");
    customItemGroupTable.children[customItemGroupTable.children.length-1].classList.add("customItemGroupRow");
    let rowContainer = document.createElement("div");
    rowContainer.classList.add("row");
    rowContainer.classList.add("customItemGroupLastRow");
    rowContainer.classList.add("ms-0");
    rowContainer.classList.add("me-0");
    rowContainer.name = -1;
    let titleDiv = document.createElement("div");
    titleDiv.classList.add("col-3");
    titleDiv.classList.add("customItemGroupTitle");
    titleDiv.innerText = groupNameValue;
    rowContainer.appendChild(titleDiv);
    let itemsDiv = document.createElement("div");
    itemsDiv.classList.add("col-9");
    itemsDiv.classList.add("customItemGroupItems");
    let itemString = "";
    let commaPlacements = "";
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
            itemString += itemValues[valueCounter] + ", ";
        }        
    }
    let lastString = itemValues[itemValues.length-1];
    if (lastString != "")
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
    
    itemString += lastString;
    itemsDiv.innerText = itemString;
    itemsDiv.name = commaPlacements;
    rowContainer.appendChild(itemsDiv);
    rowContainer.addEventListener("click", addSavedGroupToList);
    customItemGroupTable.appendChild(rowContainer);
}
}