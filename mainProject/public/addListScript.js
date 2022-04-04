let listItemLink = document.getElementById("addListItem");
let toDoItemsContainer = document.getElementById("toDoItems");
listItemLink.addEventListener("click", function() {
    numberOfItems++;
    var newField = document.createElement("div");
    newField.classList.add("container");
    newField.classList.add("formListItem");
    newField.classList.add("mt-1");
    var newLabel = document.createElement("label");
    newLabel.classList.add("formLabel");
    newLabel.htmlFor = "listItem" + numberOfItems.toString();
    newLabel.innerText = "Enter List Item " + numberOfItems + ":";
    newField.appendChild(newLabel);
    var newDiv = document.createElement("div");
    newDiv.classList.add("listItemRow");
    var newInput = document.createElement("input");
    newInput.type = "text";
    newInput.classList.add("form-control");
    newInput.classList.add("me-1");
    newInput.name = "listItem" + numberOfItems;
    newInput.id = "listItem" + numberOfItems;
    newInput.placeholder = "Enter List Item " + numberOfItems;
    newDiv.appendChild(newInput);
    var newIcon = document.createElement("i");
    newIcon.classList.add("bi");
    newIcon.classList.add("bi-trash");
    newIcon.classList.add("reMindLinks")
    newIcon.classList.add("bootstrapIcon");
    newIcon.name = "deleteIcon";
    newIcon.addEventListener("click", deleteItem);
    newDiv.appendChild(newIcon);
    newField.appendChild(newDiv);
    toDoItemsContainer.appendChild(newField);
    var self = toDoItemsContainer.children[numberOfItems-1];
    toDoItemsContainer.removeChild(self);
    toDoItemsContainer.appendChild(self);
})  

let numberOfItems = 1;

let deleteIcons = document.getElementsByName("deleteIcon");
for (let icon of deleteIcons)
{
    icon.addEventListener("click", deleteItem);
}

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