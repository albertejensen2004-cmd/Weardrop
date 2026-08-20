const addItemButton = document.getElementById("addItemButton");
const addItemModal = document.getElementById("addItemModal");
const closeModal = document.getElementById("closeModal");

addItemButton.addEventListener("click", function() {

    addItemModal.classList.add("show");

});

closeModal.addEventListener("click", function() {

    addItemModal.classList.remove("show");

});