let toDoItemsContainer = document.getElementById("toDoItems");
let deleteIcons = document.getElementsByName("deleteIcon");
let editIcons = document.getElementsByName("editIcon");
let listItemLink = document.getElementById("addListItem");
let numberOfItems = toDoItemsContainer.children.length - 1;

listItemLink.addEventListener("click", function() {
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
    newField.appendChild(newCheckBox);
    var newTextBox = document.createElement("input");
    newTextBox.type = "text";
    newTextBox.classList.add("form-control");
    newTextBox.classList.add("me-2");
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
    toDoItemsContainer.removeChild(this);
    toDoItemsContainer.appendChild(this);
})  


for (let icon of deleteIcons)
{
    icon.addEventListener("click", deleteItem);
}

for (let icon of editIcons)
{
    icon.addEventListener("click", editItem);
}

function deleteItem()
{
    let parent = this.parentElement;
    var itemInput = parent.children[1];
    let index = parseInt(itemInput.placeholder.substring(16));
    console.log(index);
    toDoItemsContainer.removeChild(parent);
    numberOfItems--;
    for (let counter = index; counter < toDoItemsContainer.children.length; counter++)
    {
        toDoItemsContainer.children[counter-1].children[1].placeholder = "Enter List Item " + parseInt(parseInt(counter-1)+1);
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