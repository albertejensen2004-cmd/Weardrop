/* =========================================================
   CLOSET AI
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   DATA
========================================================= */

// Get saved clothing from the browser
let clothingItems =
    JSON.parse(localStorage.getItem("clothingItems")) || [];

// Get saved outfits from the browser
let savedOutfits =
    JSON.parse(localStorage.getItem("savedOutfits")) || [];

// Current page
let currentPage = "wardrobe";

// Currently selected clothing category
let currentCategory = "all";

// Currently selected items for a custom outfit
let selectedOutfitItems = [];


/* =========================================================
   HTML ELEMENTS
========================================================= */

const clothingGrid =
    document.getElementById("clothingGrid");

const itemCount =
    document.getElementById("itemCount");

const addItemButton =
    document.getElementById("addItemButton");

const addItemModal =
    document.getElementById("addItemModal");

const closeModal =
    document.getElementById("closeModal");

const saveItem =
    document.getElementById("saveItem");

const clothingImage =
    document.getElementById("clothingImage");

const imagePreview =
    document.getElementById("imagePreview");

const uploadBox =
    document.getElementById("uploadBox");

const clothingName =
    document.getElementById("clothingName");

const clothingCategory =
    document.getElementById("clothingCategory");

const uploadPlaceholder =
    document.getElementById("uploadPlaceholder");


/* NAVIGATION */

const wardrobeNav =
    document.getElementById("wardrobeNav");

const outfitsNav =
    document.getElementById("outfitsNav");

const favoritesNav =
    document.getElementById("favoritesNav");

const settingsNav =
    document.getElementById("settingsNav");


/* HERO */

const styleOutfitButton =
    document.getElementById("styleOutfitButton");


/* FILTERS */

const filterButtons =
    document.querySelectorAll(".filter");


/* =========================================================
   INITIALIZE APP
========================================================= */

renderWardrobe();

updateItemCount();


/* =========================================================
   NAVIGATION
========================================================= */

wardrobeNav.addEventListener("click", function() {

    showPage("wardrobe");

});


outfitsNav.addEventListener("click", function() {

    showPage("outfits");

});


favoritesNav.addEventListener("click", function() {

    showPage("favorites");

});


settingsNav.addEventListener("click", function() {

    showPage("settings");

});


/* =========================================================
   PAGE SWITCHING
========================================================= */

function showPage(page) {

    currentPage = page;


    /* Remove active state */

    document
        .querySelectorAll(".nav-item")
        .forEach(function(button) {

            button.classList.remove("active");

        });


    /* Add active state */

    if (page === "wardrobe") {

        wardrobeNav.classList.add("active");

        renderWardrobe();

    }


    if (page === "outfits") {

        outfitsNav.classList.add("active");

        renderOutfitsPage();

    }


    if (page === "favorites") {

        favoritesNav.classList.add("active");

        renderFavorites();

    }


    if (page === "settings") {

        settingsNav.classList.add("active");

        renderSettings();

    }

}


/* =========================================================
   ADD ITEM MODAL
========================================================= */

addItemButton.addEventListener("click", function() {

    openAddItemModal();

});


function openAddItemModal() {

    addItemModal.classList.add("show");

}


closeModal.addEventListener("click", function() {

    closeAddItemModal();

});


function closeAddItemModal() {

    addItemModal.classList.remove("show");

}


/* Close when clicking outside modal */

addItemModal.addEventListener("click", function(event) {

    if (event.target === addItemModal) {

        closeAddItemModal();

    }

});


/* =========================================================
   IMAGE UPLOAD
========================================================= */

clothingImage.addEventListener("change", function() {

    const file = clothingImage.files[0];


    if (!file) {

        return;

    }


    /* Check that it is an image */

    if (!file.type.startsWith("image/")) {

        alert("Please choose an image.");

        return;

    }


    /* Create temporary image URL */

    const imageURL =
        URL.createObjectURL(file);


    /* Show preview */

    imagePreview.src = imageURL;

    uploadBox.classList.add("has-image");

});


/* =========================================================
   SAVE NEW CLOTHING
========================================================= */

saveItem.addEventListener("click", function() {

    addClothingItem();

});


function addClothingItem() {

    const name =
        clothingName.value.trim();

    const category =
        clothingCategory.value;

    const file =
        clothingImage.files[0];


    /* Check name */

    if (!name) {

        alert("Please give your clothing item a name.");

        return;

    }


    /* Check image */

    if (!file) {

        alert("Please upload a photo.");

        return;

    }


    /* Convert image to Base64 */

    const reader =
        new FileReader();


    reader.onload = function(event) {

        const newItem = {

            id:
                Date.now().toString(),

            name:
                name,

            category:
                category,

            image:
                event.target.result,

            favorite:
                false,

            createdAt:
                new Date().toISOString()

        };


        /* Add to array */

        clothingItems.push(newItem);


        /* Save */

        localStorage.setItem(
            "clothingItems",
            JSON.stringify(clothingItems)
        );


        /* Refresh wardrobe */

        renderWardrobe();

        updateItemCount();


        /* Close popup */

        closeAddItemModal();


        /* Reset form */

        resetAddItemForm();

    };


    reader.readAsDataURL(file);

}


/* =========================================================
   RESET ADD ITEM FORM
========================================================= */

function resetAddItemForm() {

    clothingName.value = "";

    clothingCategory.value = "top";

    clothingImage.value = "";

    imagePreview.src = "";

    uploadBox.classList.remove("has-image");

}


/* =========================================================
   UPDATE ITEM COUNT
========================================================= */

function updateItemCount() {

    itemCount.textContent =
        `${clothingItems.length} items in your closet`;

}


/* =========================================================
   RENDER WARDROBE
========================================================= */

function renderWardrobe() {

    clothingGrid.innerHTML = "";


    let items =
        clothingItems;


    /* Filter */

    if (currentCategory !== "all") {

        items =
            clothingItems.filter(function(item) {

                return item.category === currentCategory;

            });

    }


    /* Empty state */

    if (items.length === 0) {

        clothingGrid.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    👗
                </div>

                <h3>
                    Nothing here yet
                </h3>

                <p>
                    Add some clothes to your wardrobe.
                </p>

            </div>

        `;

        return;

    }


    /* Create cards */

    items.forEach(function(item) {

        const card =
            createClothingCard(item);

        clothingGrid.appendChild(card);

    });

}


/* =========================================================
   CREATE CLOTHING CARD
========================================================= */

function createClothingCard(item) {

    const card =
        document.createElement("article");


    card.className =
        "clothing-card";


    card.id =
        `clothingItem-${item.id}`;


    card.dataset.category =
        item.category;


    /* Image */

    const imageArea =
        document.createElement("div");


    imageArea.className =
        "clothing-image";


    const image =
        document.createElement("img");


    image.src =
        item.image;


    image.alt =
        item.name;


    image.style.width =
        "100%";


    image.style.height =
        "100%";


    image.style.objectFit =
        "contain";


    imageArea.appendChild(image);


    /* Favorite */

    const heart =
        document.createElement("button");


    heart.className =
        "heart";


    heart.textContent =
        item.favorite ? "♥" : "♡";


    heart.style.color =
        item.favorite ? "#a77b88" : "";


    heart.addEventListener("click", function(event) {

        event.stopPropagation();

        toggleFavorite(item.id);

    });


    imageArea.appendChild(heart);


    /* Info */

    const info =
        document.createElement("div");


    info.className =
        "clothing-info";


    const details =
        document.createElement("div");


    const title =
        document.createElement("h3");


    title.textContent =
        item.name;


    const category =
        document.createElement("p");


    category.textContent =
        formatCategory(item.category);


    details.appendChild(title);

    details.appendChild(category);


    /* More button */

    const more =
        document.createElement("button");


    more.className =
        "more";


    more.textContent =
        "•••";


    more.addEventListener("click", function(event) {

        event.stopPropagation();

        openItemMenu(item.id);

    });


    info.appendChild(details);

    info.appendChild(more);


    card.appendChild(imageArea);

    card.appendChild(info);


    /* Click clothing card */

    card.addEventListener("click", function() {

        openClothingDetails(item.id);

    });


    return card;

}


/* =========================================================
   CATEGORY FORMAT
========================================================= */

function formatCategory(category) {

    const categories = {

        top: "Top",

        bottom: "Bottom",

        dress: "Dress",

        shoes: "Shoes",

        accessory: "Accessory"

    };


    return categories[category] || category;

}


/* =========================================================
   FAVORITES
========================================================= */

function toggleFavorite(id) {

    const item =
        clothingItems.find(function(item) {

            return item.id === id;

        });


    if (!item) {

        return;

    }


    item.favorite =
        !item.favorite;


    localStorage.setItem(
        "clothingItems",
        JSON.stringify(clothingItems)
    );


    if (currentPage === "favorites") {

        renderFavorites();

    }
    else {

        renderWardrobe();

    }

}


/* =========================================================
   FAVORITES PAGE
========================================================= */

function renderFavorites() {

    clothingGrid.innerHTML = "";


    const favorites =
        clothingItems.filter(function(item) {

            return item.favorite === true;

        });


    if (favorites.length === 0) {

        clothingGrid.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ♡
                </div>

                <h3>
                    No favorites yet
                </h3>

                <p>
                    Tap the heart on clothing you love.
                </p>

            </div>

        `;

        return;

    }


    favorites.forEach(function(item) {

        clothingGrid.appendChild(
            createClothingCard(item)
        );

    });

}


/* =========================================================
   FILTER BUTTONS
========================================================= */

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        /* Remove active */

        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        /* Activate clicked */

        button.classList.add("active");


        /* Get category */

        currentCategory =
            button.dataset.category;


        renderWardrobe();

    });

});


/* =========================================================
   OUTFITS PAGE
========================================================= */

function renderOutfitsPage() {

    clothingGrid.innerHTML = "";


    const page =
        document.createElement("div");


    page.className =
        "outfits-page";


    page.innerHTML = `

        <div class="outfits-header">

            <div>

                <p class="hero-label">
                    YOUR STYLE
                </p>

                <h2>
                    My outfits
                </h2>

                <p>
                    Create outfits from your wardrobe
                    and save your favorites.
                </p>

            </div>


            <button
                class="style-button"
                id="createOutfitButton"
            >

                + Create outfit

            </button>

        </div>


        <div
            class="saved-outfits"
            id="savedOutfits"
        >

        </div>

    `;


    clothingGrid.appendChild(page);


    renderSavedOutfits();


    document
        .getElementById("createOutfitButton")
        .addEventListener("click", function() {

            openOutfitBuilder();

        });

}


/* =========================================================
   OUTFIT BUILDER
========================================================= */

function openOutfitBuilder() {

    selectedOutfitItems = [];


    const modal =
        document.createElement("div");


    modal.className =
        "modal show";


    modal.id =
        "outfitBuilderModal";


    modal.innerHTML = `

        <div class="modal-content outfit-builder">


            <button
                class="close-modal"
                id="closeOutfitBuilder"
            >
                ×
            </button>


            <p class="hero-label">
                CREATE YOUR LOOK
            </p>


            <h2>
                Build an outfit
            </h2>


            <p class="modal-subtitle">
                Select the pieces you want to wear.
            </p>


            <div
                class="outfit-selection"
                id="outfitSelection"
            >

            </div>


            <button
                class="save-item"
                id="saveOutfit"
            >

                Save outfit

            </button>


        </div>

    `;


    document.body.appendChild(modal);


    renderOutfitSelection();


    document
        .getElementById("closeOutfitBuilder")
        .addEventListener("click", function() {

            modal.remove();

        });


    modal.addEventListener("click", function(event) {

        if (event.target === modal) {

            modal.remove();

        }

    });


    document
        .getElementById("saveOutfit")
        .addEventListener("click", function() {

            saveCustomOutfit(modal);

        });

}


/* =========================================================
   OUTFIT SELECTION
========================================================= */

function renderOutfitSelection() {

    const container =
        document.getElementById("outfitSelection");


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (clothingItems.length === 0) {

        container.innerHTML = `

            <p>
                Add some clothing first.
            </p>

        `;

        return;

    }


    clothingItems.forEach(function(item) {

        const piece =
            document.createElement("button");


        piece.className =
            "outfit-piece";


        if (
            selectedOutfitItems.includes(item.id)
        ) {

            piece.classList.add("selected");

        }


        piece.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <span>
                ${item.name}
            </span>

        `;


        piece.addEventListener("click", function() {

            toggleOutfitItem(item.id);

        });


        container.appendChild(piece);

    });

}


/* =========================================================
   TOGGLE OUTFIT ITEM
========================================================= */

function toggleOutfitItem(id) {

    if (
        selectedOutfitItems.includes(id)
    ) {

        selectedOutfitItems =
            selectedOutfitItems.filter(function(itemId) {

                return itemId !== id;

            });

    }
    else {

        selectedOutfitItems.push(id);

    }


    renderOutfitSelection();

}


/* =========================================================
   SAVE CUSTOM OUTFIT
========================================================= */

function saveCustomOutfit(modal) {

    if (selectedOutfitItems.length === 0) {

        alert("Choose at least one clothing item.");

        return;

    }


    const outfit = {

        id:
            Date.now().toString(),

        items:
            [...selectedOutfitItems],

        createdAt:
            new Date().toISOString()

    };


    savedOutfits.push(outfit);


    localStorage.setItem(
        "savedOutfits",
        JSON.stringify(savedOutfits)
    );


    modal.remove();


    renderOutfitsPage();

}


/* =========================================================
   DISPLAY SAVED OUTFITS
========================================================= */

function renderSavedOutfits() {

    const container =
        document.getElementById("savedOutfits");


    if (!container) {

        return;

    }


    if (savedOutfits.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ✨
                </div>

                <h3>
                    No outfits yet
                </h3>

                <p>
                    Create your first outfit.
                </p>

            </div>

        `;

        return;

    }


    savedOutfits.forEach(function(outfit) {

        const card =
            document.createElement("div");


        card.className =
            "saved-outfit-card";


        const title =
            document.createElement("h3");


        title.textContent =
            "My outfit";


        const images =
            document.createElement("div");


        images.className =
            "outfit-images";


        outfit.items.forEach(function(itemId) {

            const item =
                clothingItems.find(function(item) {

                    return item.id === itemId;

                });


            if (!item) {

                return;

            }


            const image =
                document.createElement("img");


            image.src =
                item.image;


            image.alt =
                item.name;


            images.appendChild(image);

        });


        const deleteButton =
            document.createElement("button");


        deleteButton.className =
            "more";


        deleteButton.textContent =
            "Delete";


        deleteButton.addEventListener("click", function() {

            deleteOutfit(outfit.id);

        });


        card.appendChild(title);

        card.appendChild(images);

        card.appendChild(deleteButton);


        container.appendChild(card);

    });

}


/* =========================================================
   DELETE OUTFIT
========================================================= */

function deleteOutfit(id) {

    savedOutfits =
        savedOutfits.filter(function(outfit) {

            return outfit.id !== id;

        });


    localStorage.setItem(
        "savedOutfits",
        JSON.stringify(savedOutfits)
    );


    renderOutfitsPage();

}


/* =========================================================
   STYLE MY OUTFIT
========================================================= */

styleOutfitButton.addEventListener("click", function() {

    if (clothingItems.length === 0) {

        alert(
            "Add some clothes first and I'll style you."
        );

        return;

    }


    showPage("outfits");

    openOutfitBuilder();

});


/* =========================================================
   CLOTHING DETAILS
========================================================= */

function openClothingDetails(id) {

    const item =
        clothingItems.find(function(item) {

            return item.id === id;

        });


    if (!item) {

        return;

    }


    alert(
        `${item.name}\nCategory: ${formatCategory(item.category)}`
    );

}


/* =========================================================
   MORE MENU
========================================================= */

function openItemMenu(id) {

    const item =
        clothingItems.find(function(item) {

            return item.id === id;

        });


    if (!item) {

        return;

    }


    const deleteItem =
        confirm(
            `Do you want to delete "${item.name}"?`
        );


    if (deleteItem) {

        clothingItems =
            clothingItems.filter(function(item) {

                return item.id !== id;

            });


        localStorage.setItem(
            "clothingItems",
            JSON.stringify(clothingItems)
        );


        renderWardrobe();

        updateItemCount();

    }

}


/* =========================================================
   SETTINGS
========================================================= */

function renderSettings() {

    clothingGrid.innerHTML = `

        <div class="settings-page">

            <p class="hero-label">
                YOUR ACCOUNT
            </p>

            <h2>
                Settings
            </h2>

            <p>
                Your wardrobe is currently stored
                locally in this browser.
            </p>


            <button
                class="save-item"
                id="clearWardrobeButton"
            >

                Clear wardrobe

            </button>

        </div>

    `;


    document
        .getElementById("clearWardrobeButton")
        .addEventListener("click", function() {

            const confirmed =
                confirm(
                    "Are you sure you want to delete all clothing?"
                );


            if (!confirmed) {

                return;

            }


            clothingItems = [];


            savedOutfits = [];


            localStorage.removeItem(
                "clothingItems"
            );


            localStorage.removeItem(
                "savedOutfits"
            );


            updateItemCount();

            showPage("wardrobe");

        });

}