// =====================================================
// CLOSET AI
// MANUAL VERSION
// No Luna / No API / No Server Required
// =====================================================


// =====================================================
// STORAGE
// =====================================================

const WARDROBE_KEY = "closetAI_wardrobe";
const OUTFITS_KEY = "closetAI_outfits";


// =====================================================
// GET / SAVE WARDROBE
// =====================================================

function getWardrobe() {

    try {

        return JSON.parse(
            localStorage.getItem(WARDROBE_KEY)
        ) || [];

    } catch (error) {

        console.error(
            "Could not load wardrobe:",
            error
        );

        return [];

    }

}


function saveWardrobe(wardrobe) {

    localStorage.setItem(
        WARDROBE_KEY,
        JSON.stringify(wardrobe)
    );

}


// =====================================================
// GET / SAVE OUTFITS
// =====================================================

function getOutfits() {

    try {

        return JSON.parse(
            localStorage.getItem(OUTFITS_KEY)
        ) || [];

    } catch (error) {

        console.error(
            "Could not load outfits:",
            error
        );

        return [];

    }

}


function saveOutfits(outfits) {

    localStorage.setItem(
        OUTFITS_KEY,
        JSON.stringify(outfits)
    );

}


// =====================================================
// ELEMENTS
// =====================================================

const wardrobeNav =
    document.getElementById("wardrobeNav");

const outfitsNav =
    document.getElementById("outfitsNav");

const favoritesNav =
    document.getElementById("favoritesNav");

const settingsNav =
    document.getElementById("settingsNav");

const logo =
    document.getElementById("logo");

const styleOutfitButton =
    document.getElementById("styleOutfitButton");

const addItemButton =
    document.getElementById("addItemButton");

const addItemModal =
    document.getElementById("addItemModal");

const closeModal =
    document.getElementById("closeModal");

const clothingImage =
    document.getElementById("clothingImage");

const imagePreview =
    document.getElementById("imagePreview");

const uploadPlaceholder =
    document.getElementById("uploadPlaceholder");

const clothingName =
    document.getElementById("clothingName");

const clothingCategory =
    document.getElementById("clothingCategory");

const saveItemButton =
    document.getElementById("saveItem");

const clothingGrid =
    document.getElementById("clothingGrid");

const itemCount =
    document.getElementById("itemCount");

const wardrobeHeader =
    document.querySelector(".wardrobe-header");

const filtersContainer =
    document.querySelector(".filters");

const hero =
    document.querySelector(".hero");


// =====================================================
// CURRENT PAGE
// =====================================================

let currentPage = "wardrobe";


// =====================================================
// TEMPORARY IMAGE
// =====================================================

let selectedImageData = "";


// =====================================================
// MODAL
// =====================================================

function openAddModal() {

    if (!addItemModal) {
        return;
    }

    addItemModal.classList.add("active");

    addItemModal.style.display = "flex";

}


function closeAddModal() {

    if (!addItemModal) {
        return;
    }

    addItemModal.classList.remove("active");

    addItemModal.style.display = "none";

}


// =====================================================
// ADD ITEM BUTTON
// =====================================================

if (addItemButton) {

    addItemButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            openAddModal();

        }
    );

}


// =====================================================
// CLOSE MODAL
// =====================================================

if (closeModal) {

    closeModal.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            closeAddModal();

        }
    );

}


// =====================================================
// CLICK OUTSIDE MODAL
// =====================================================

if (addItemModal) {

    addItemModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === addItemModal
            ) {

                closeAddModal();

            }

        }
    );

}


// =====================================================
// ESCAPE KEY
// =====================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeAddModal();

        }

    }
);


// =====================================================
// IMAGE → SMALLER BASE64 IMAGE
// =====================================================

function resizeImage(file) {

    return new Promise(
        function(resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    const image =
                        new Image();


                    image.onload =
                        function() {

                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            const maxSize = 1000;

                            let width =
                                image.width;

                            let height =
                                image.height;


                            if (
                                width >
                                maxSize ||
                                height >
                                maxSize
                            ) {

                                if (
                                    width >
                                    height
                                ) {

                                    height =
                                        height *
                                        (
                                            maxSize /
                                            width
                                        );

                                    width =
                                        maxSize;

                                } else {

                                    width =
                                        width *
                                        (
                                            maxSize /
                                            height
                                        );

                                    height =
                                        maxSize;

                                }

                            }


                            canvas.width =
                                width;

                            canvas.height =
                                height;


                            const context =
                                canvas.getContext(
                                    "2d"
                                );


                            context.drawImage(
                                image,
                                0,
                                0,
                                width,
                                height
                            );


                            const result =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.8
                                );


                            resolve(result);

                        };


                    image.onerror =
                        reject;


                    image.src =
                        event.target.result;

                };


            reader.onerror =
                reject;


            reader.readAsDataURL(file);

        }
    );

}


// =====================================================
// IMAGE UPLOAD
// =====================================================

if (clothingImage) {

    clothingImage.addEventListener(
        "change",
        async function(event) {

            const file =
                event.target.files[0];


            if (!file) {
                return;
            }


            console.log(
                "📸 Photo selected:",
                file.name
            );


            try {

                selectedImageData =
                    await resizeImage(file);


                // Show preview

                if (imagePreview) {

                    imagePreview.src =
                        selectedImageData;

                    imagePreview.style.display =
                        "block";

                }


                if (uploadPlaceholder) {

                    uploadPlaceholder.style.display =
                        "none";

                }


                console.log(
                    "✅ Image ready"
                );

            } catch (error) {

                console.error(
                    "Image error:",
                    error
                );


                alert(
                    "Sorry, we couldn't load that photo."
                );

            }

        }
    );

}


// =====================================================
// SAVE CLOTHING
// =====================================================

if (saveItemButton) {

    saveItemButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            const name =
                clothingName
                    ? clothingName.value.trim()
                    : "";


            const category =
                clothingCategory
                    ? clothingCategory.value
                    : "top";


            // -----------------------------
            // CHECK NAME
            // -----------------------------

            if (!name) {

                alert(
                    "Please enter a name for your clothing item."
                );


                if (clothingName) {

                    clothingName.focus();

                }


                return;

            }


            // -----------------------------
            // CREATE ITEM
            // -----------------------------

            const item = {

                id:
                    "item-" +
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .substring(2, 8),

                name:
                    name,

                category:
                    category,

                image:
                    selectedImageData || "",

                favorite:
                    false,

                createdAt:
                    new Date().toISOString()

            };


            // -----------------------------
            // GET CURRENT WARDROBE
            // -----------------------------

            const wardrobe =
                getWardrobe();


            wardrobe.push(item);


            // -----------------------------
            // SAVE
            // -----------------------------

            try {

                saveWardrobe(
                    wardrobe
                );

            } catch (error) {

                console.error(
                    "Storage error:",
                    error
                );


                alert(
                    "The photo is too large to save. Try another photo."
                );


                return;

            }


            console.log(
                "👗 Added:",
                item
            );


            // -----------------------------
            // UPDATE SCREEN
            // -----------------------------

            renderWardrobe();


            // -----------------------------
            // RESET
            // -----------------------------

            resetAddForm();


            // -----------------------------
            // CLOSE
            // -----------------------------

            closeAddModal();


            alert(
                "✨ " +
                name +
                " was added to your wardrobe!"
            );

        }
    );

}


// =====================================================
// RESET ADD FORM
// =====================================================

function resetAddForm() {

    selectedImageData =
        "";


    if (clothingImage) {

        clothingImage.value =
            "";

    }


    if (clothingName) {

        clothingName.value =
            "";

    }


    if (clothingCategory) {

        clothingCategory.value =
            "top";

    }


    if (imagePreview) {

        imagePreview.src =
            "";

        imagePreview.style.display =
            "none";

    }


    if (uploadPlaceholder) {

        uploadPlaceholder.style.display =
            "";

    }

}


// =====================================================
// CATEGORY NAME
// =====================================================

function categoryName(category) {

    const names = {

        top:
            "Tops",

        bottom:
            "Bottoms",

        dress:
            "Dresses",

        shoes:
            "Shoes",

        accessory:
            "Accessories"

    };


    return (
        names[category] ||
        "Clothing"
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value || "";


    return div.innerHTML;

}


// =====================================================
// RENDER WARDROBE
// =====================================================

function renderWardrobe() {

    if (!clothingGrid) {
        return;
    }


    const wardrobe =
        getWardrobe();


    // --------------------------------
    // REMOVE CARDS CREATED BY JS
    // --------------------------------

    clothingGrid
        .querySelectorAll(
            ".manual-item"
        )
        .forEach(
            function(card) {

                card.remove();

            }
        );


    // --------------------------------
    // UPDATE COUNT
    // --------------------------------

    if (itemCount) {

        itemCount.textContent =
            wardrobe.length +
            (
                wardrobe.length === 1
                    ? " item in your closet"
                    : " items in your closet"
            );

    }


    // --------------------------------
    // ADD USER ITEMS
    // --------------------------------

    wardrobe.forEach(
        function(item) {

            const card =
                createClothingCard(
                    item
                );


            clothingGrid.appendChild(
                card
            );

        }
    );


    attachClothingButtons();

}


// =====================================================
// CREATE CLOTHING CARD
// =====================================================

function createClothingCard(item) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "clothing-card manual-item";


    article.dataset.category =
        item.category;


    article.dataset.itemId =
        item.id;


    const imageHTML =
        item.image

            ?

            `
            <img
                src="${item.image}"
                alt="${escapeHTML(item.name)}"
            >
            `

            :

            `
            <div class="placeholder">
                ${getCategoryEmoji(item.category)}
            </div>
            `;


    article.innerHTML = `

        <div class="clothing-image">

            ${imageHTML}

            <button
                class="heart"
                data-action="favorite"
                data-id="${item.id}"
                type="button"
            >
                ${item.favorite ? "♥" : "♡"}
            </button>

        </div>


        <div class="clothing-info">

            <div>

                <h3>
                    ${escapeHTML(item.name)}
                </h3>

                <p>
                    ${categoryName(item.category)}
                </p>

            </div>


            <button
                class="more"
                data-action="delete"
                data-id="${item.id}"
                type="button"
            >
                •••
            </button>

        </div>

    `;


    return article;

}


// =====================================================
// EMOJI
// =====================================================

function getCategoryEmoji(category) {

    const emojis = {

        top:
            "👚",

        bottom:
            "👖",

        dress:
            "👗",

        shoes:
            "👟",

        accessory:
            "👜"

    };


    return (
        emojis[category] ||
        "👗"
    );

}


// =====================================================
// CLOTHING BUTTONS
// =====================================================

function attachClothingButtons() {

    document
        .querySelectorAll(
            '[data-action="favorite"]'
        )
        .forEach(
            function(button) {

                button.onclick =
                    function(event) {

                        event.preventDefault();

                        event.stopPropagation();


                        toggleFavorite(
                            button.dataset.id
                        );

                    };

            }
        );


    document
        .querySelectorAll(
            '[data-action="delete"]'
        )
        .forEach(
            function(button) {

                button.onclick =
                    function(event) {

                        event.preventDefault();

                        event.stopPropagation();


                        deleteItem(
                            button.dataset.id
                        );

                    };

            }
        );

}


// =====================================================
// FAVORITE
// =====================================================

function toggleFavorite(id) {

    const wardrobe =
        getWardrobe();


    const item =
        wardrobe.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!item) {
        return;
    }


    item.favorite =
        !item.favorite;


    saveWardrobe(
        wardrobe
    );


    renderWardrobe();


    if (
        currentPage ===
        "favorites"
    ) {

        showFavorites();

    }

}


// =====================================================
// DELETE
// =====================================================

function deleteItem(id) {

    const wardrobe =
        getWardrobe();


    const item =
        wardrobe.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!item) {
        return;
    }


    const confirmed =
        confirm(
            `Remove "${item.name}" from your wardrobe?`
        );


    if (!confirmed) {
        return;
    }


    const updated =
        wardrobe.filter(
            function(item) {

                return item.id !== id;

            }
        );


    saveWardrobe(
        updated
    );


    renderWardrobe();


    if (
        currentPage ===
        "favorites"
    ) {

        showFavorites();

    }

}


// =====================================================
// FILTERS
// =====================================================

if (filtersContainer) {

    filtersContainer
        .querySelectorAll(
            ".filter"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        const category =
                            button.dataset.category;


                        filtersContainer
                            .querySelectorAll(
                                ".filter"
                            )
                            .forEach(
                                function(btn) {

                                    btn.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        button.classList.add(
                            "active"
                        );


                        applyFilter(
                            category
                        );

                    }
                );

            }
        );

}


function applyFilter(category) {

    if (!clothingGrid) {
        return;
    }


    const cards =
        clothingGrid.querySelectorAll(
            ".clothing-card"
        );


    cards.forEach(
        function(card) {

            if (
                category === "all" ||
                card.dataset.category ===
                    category
            ) {

                card.style.display =
                    "";

            } else {

                card.style.display =
                    "none";

            }

        }
    );

}


// =====================================================
// PAGE NAVIGATION
// =====================================================

function activateNav(button) {

    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            function(nav) {

                nav.classList.remove(
                    "active"
                );

            }
        );


    if (button) {

        button.classList.add(
            "active"
        );

    }

}


// =====================================================
// HIDE ORIGINAL WARDROBE
// =====================================================

function hideWardrobe() {

    if (hero) {

        hero.style.display =
            "none";

    }


    if (wardrobeHeader) {

        wardrobeHeader.style.display =
            "none";

    }


    if (filtersContainer) {

        filtersContainer.style.display =
            "none";

    }


    if (clothingGrid) {

        clothingGrid.style.display =
            "none";

    }

}


// =====================================================
// SHOW ORIGINAL WARDROBE
// =====================================================

function showWardrobe() {

    currentPage =
        "wardrobe";


    activateNav(
        wardrobeNav
    );


    removeDynamicPage();


    if (hero) {

        hero.style.display =
            "";

    }


    if (wardrobeHeader) {

        wardrobeHeader.style.display =
            "";

    }


    if (filtersContainer) {

        filtersContainer.style.display =
            "";

    }


    if (clothingGrid) {

        clothingGrid.style.display =
            "";

    }


    renderWardrobe();

}


// =====================================================
// DYNAMIC PAGE
// =====================================================

function createPage(title, subtitle) {

    removeDynamicPage();


    const main =
        document.querySelector(
            ".main"
        );


    const page =
        document.createElement(
            "section"
        );


    page.id =
        "dynamicPage";


    page.innerHTML = `

        <div class="dynamic-page-header">

            <p class="hero-label">
                CLOSET AI
            </p>

            <h2>
                ${title}
            </h2>

            <p>
                ${subtitle}
            </p>

        </div>

    `;


    main.appendChild(
        page
    );


    return page;

}


// =====================================================
// REMOVE DYNAMIC PAGE
// =====================================================

function removeDynamicPage() {

    const page =
        document.getElementById(
            "dynamicPage"
        );


    if (page) {

        page.remove();

    }

}


// =====================================================
// OUTFITS
// =====================================================

function showOutfits() {

    currentPage =
        "outfits";


    activateNav(
        outfitsNav
    );


    hideWardrobe();


    const page =
        createPage(
            "My outfits",
            "Create outfits manually using the clothes in your wardrobe."
        );


    const outfits =
        getOutfits();


    const createButton =
        document.createElement(
            "button"
        );


    createButton.className =
        "style-button";


    createButton.textContent =
        "＋ Create new outfit";


    createButton.type =
        "button";


    createButton.onclick =
        showOutfitBuilder;


    page.appendChild(
        createButton
    );


    // --------------------------------
    // SAVED OUTFITS
    // --------------------------------

    if (
        outfits.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "empty-state";


        empty.innerHTML = `

            <div style="font-size:48px;">
                ✨
            </div>

            <h3>
                No outfits yet
            </h3>

            <p>
                Create your first outfit using your wardrobe.
            </p>

        `;


        page.appendChild(
            empty
        );


        return;

    }


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        "Saved outfits";


    title.style.marginTop =
        "35px";


    page.appendChild(
        title
    );


    outfits.forEach(
        function(outfit) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "outfit-card";


            card.innerHTML = `

                <h3>
                    ${escapeHTML(
                        outfit.name
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        outfit.description ||
                        "My saved outfit"
                    )}
                </p>

                <div
                    style="
                        display:flex;
                        flex-wrap:wrap;
                        gap:8px;
                        margin-top:12px;
                    "
                >

                    ${
                        outfit.items
                            .map(
                                function(item) {

                                    return `
                                        <span
                                            style="
                                                padding:7px 10px;
                                                border-radius:10px;
                                                background:#f2eee9;
                                                font-size:13px;
                                            "
                                        >
                                            ${escapeHTML(
                                                item.name
                                            )}
                                        </span>
                                    `;

                                }
                            )
                            .join("")
                    }

                </div>


                <button
                    class="more"
                    data-outfit-id="${outfit.id}"
                    type="button"
                    style="margin-top:15px;"
                >
                    Delete
                </button>

            `;


            const deleteButton =
                card.querySelector(
                    ".more"
                );


            deleteButton.onclick =
                function() {

                    deleteOutfit(
                        outfit.id
                    );

                };


            page.appendChild(
                card
            );

        }
    );

}


// =====================================================
// MANUAL OUTFIT BUILDER
// =====================================================

function showOutfitBuilder() {

    const page =
        createPage(
            "Create an outfit",
            "Choose pieces from your own wardrobe."
        );


    const wardrobe =
        getWardrobe();


    if (
        wardrobe.length === 0
    ) {

        page.innerHTML += `

            <div class="empty-state">

                <div style="font-size:48px;">
                    👗
                </div>

                <h3>
                    Your wardrobe is empty
                </h3>

                <p>
                    Add some clothes before creating an outfit.
                </p>

            </div>

        `;


        return;

    }


    const builder =
        document.createElement(
            "div"
        );


    builder.className =
        "outfit-builder";


    builder.innerHTML = `

        <label
            class="input-label"
        >

            Outfit name

            <input
                type="text"
                id="manualOutfitName"
                placeholder="e.g. Dinner outfit"
            >

        </label>

    `;


    // --------------------------------
    // CATEGORY SELECTS
    // --------------------------------

    const categories = [

        {
            key:
                "top",

            label:
                "Top"

        },

        {
            key:
                "bottom",

            label:
                "Bottom"

        },

        {
            key:
                "dress",

            label:
                "Dress"

        },

        {
            key:
                "shoes",

            label:
                "Shoes"

        },

        {
            key:
                "accessory",

            label:
                "Accessory"

        }

    ];


    categories.forEach(
        function(category) {

            const items =
                wardrobe.filter(
                    function(item) {

                        return (
                            item.category ===
                            category.key
                        );

                    }
                );


            if (
                items.length === 0
            ) {

                return;

            }


            const label =
                document.createElement(
                    "label"
                );


            label.className =
                "input-label";


            label.innerHTML = `

                ${category.label}

                <select
                    data-outfit-category="${category.key}"
                >

                    <option value="">
                        Don't use one
                    </option>

                    ${
                        items
                            .map(
                                function(item) {

                                    return `
                                        <option
                                            value="${item.id}"
                                        >
                                            ${escapeHTML(
                                                item.name
                                            )}
                                        </option>
                                    `;

                                }
                            )
                            .join("")
                    }

                </select>

            `;


            builder.appendChild(
                label
            );

        }
    );


    // --------------------------------
    // SAVE BUTTON
    // --------------------------------

    const saveButton =
        document.createElement(
            "button"
        );


    saveButton.className =
        "save-item";


    saveButton.type =
        "button";


    saveButton.textContent =
        "Save outfit";


    saveButton.onclick =
        saveManualOutfit;


    builder.appendChild(
        saveButton
    );


    page.appendChild(
        builder
    );

}


// =====================================================
// SAVE MANUAL OUTFIT
// =====================================================

function saveManualOutfit() {

    const nameInput =
        document.getElementById(
            "manualOutfitName"
        );


    const name =
        nameInput
            ? nameInput.value.trim()
            : "";


    if (!name) {

        alert(
            "Please give your outfit a name."
        );


        return;

    }


    const wardrobe =
        getWardrobe();


    const selectedItems = [];


    document
        .querySelectorAll(
            "[data-outfit-category]"
        )
        .forEach(
            function(select) {

                const id =
                    select.value;


                if (!id) {
                    return;
                }


                const item =
                    wardrobe.find(
                        function(item) {

                            return item.id === id;

                        }
                    );


                if (item) {

                    selectedItems.push({

                        id:
                            item.id,

                        name:
                            item.name,

                        category:
                            item.category,

                        image:
                            item.image

                    });

                }

            }
        );


    if (
        selectedItems.length === 0
    ) {

        alert(
            "Choose at least one clothing item."
        );


        return;

    }


    const outfit = {

        id:
            "outfit-" +
            Date.now(),

        name:
            name,

        description:
            "A manually created outfit from my wardrobe.",

        items:
            selectedItems,

        createdAt:
            new Date().toISOString()

    };


    const outfits =
        getOutfits();


    outfits.push(
        outfit
    );


    saveOutfits(
        outfits
    );


    alert(
        "Your outfit has been saved!✨"
    );


    showOutfits();

}


// =====================================================
// DELETE OUTFIT
// =====================================================

function deleteOutfit(id) {

    const confirmed =
        confirm(
            "Delete this outfit?"
        );


    if (!confirmed) {
        return;
    }


    const outfits =
        getOutfits();


    const updated =
        outfits.filter(
            function(outfit) {

                return outfit.id !== id;

            }
        );


    saveOutfits(
        updated
    );


    showOutfits();

}


// =====================================================
// FAVORITES
// =====================================================

function showFavorites() {

    currentPage =
        "favorites";


    activateNav(
        favoritesNav
    );


    hideWardrobe();


    const page =
        createPage(
            "Favorites",
            "Your favorite clothing pieces."
        );


    const wardrobe =
        getWardrobe();


    const favorites =
        wardrobe.filter(
            function(item) {

                return item.favorite;

            }
        );


    if (
        favorites.length === 0
    ) {

        page.innerHTML += `

            <div class="empty-state">

                <div style="font-size:50px;">
                    ♡
                </div>

                <h3>
                    No favorites yet
                </h3>

                <p>
                    Tap the heart on a clothing item
                    to add it here.
                </p>

            </div>

        `;


        return;

    }


    const grid =
        document.createElement(
            "div"
        );


    grid.className =
        "clothing-grid";


    favorites.forEach(
        function(item) {

            const card =
                createClothingCard(
                    item
                );


            grid.appendChild(
                card
            );

        }
    );


    page.appendChild(
        grid
    );


    // Reconnect buttons

    grid
        .querySelectorAll(
            '[data-action="favorite"]'
        )
        .forEach(
            function(button) {

                button.onclick =
                    function() {

                        toggleFavorite(
                            button.dataset.id
                        );

                    };

            }
        );


    grid
        .querySelectorAll(
            '[data-action="delete"]'
        )
        .forEach(
            function(button) {

                button.onclick =
                    function() {

                        deleteItem(
                            button.dataset.id
                        );

                    };

            }
        );

}


// =====================================================
// SETTINGS
// =====================================================

function showSettings() {

    currentPage =
        "settings";


    activateNav(
        settingsNav
    );


    hideWardrobe();


    const page =
        createPage(
            "Settings",
            "Manage your Closet AI."
        );


    const wardrobe =
        getWardrobe();


    page.innerHTML += `

        <div class="settings-card">

            <h3>
                Your wardrobe
            </h3>

            <p>
                ${wardrobe.length}
                ${
                    wardrobe.length === 1
                        ? "item"
                        : "items"
                }
                saved in this browser.
            </p>

            <p>
                Your clothing photos are stored
                locally in this browser for now.
            </p>

        </div>


        <div class="settings-card">

            <h3>
                AI Stylist
            </h3>

            <p>
                Luna is currently disabled.
                We'll add her after your wardrobe
                is fully set up.
            </p>

        </div>


        <button
            class="more"
            id="clearAllButton"
            type="button"
            style="margin-top:20px;"
        >
            Clear entire wardrobe
        </button>

    `;


    const clearButton =
        document.getElementById(
            "clearAllButton"
        );


    if (clearButton) {

        clearButton.onclick =
            function() {

                const confirmed =
                    confirm(
                        "This will delete all clothing saved in this browser. Are you sure?"
                    );


                if (!confirmed) {
                    return;
                }


                localStorage.removeItem(
                    WARDROBE_KEY
                );


                localStorage.removeItem(
                    OUTFITS_KEY
                );


                alert(
                    "Your wardrobe has been cleared."
                );


                showWardrobe();

            };

    }

}


// =====================================================
// STYLE MY OUTFIT
// =====================================================

if (styleOutfitButton) {

    styleOutfitButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            showOutfitBuilder();

        }
    );

}


// =====================================================
// NAVIGATION
// =====================================================

if (wardrobeNav) {

    wardrobeNav.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            showWardrobe();

        }
    );

}


if (outfitsNav) {

    outfitsNav.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            showOutfits();

        }
    );

}


if (favoritesNav) {

    favoritesNav.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            showFavorites();

        }
    );

}


if (settingsNav) {

    settingsNav.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            showSettings();

        }
    );

}


// =====================================================
// LOGO → WARDROBE
// =====================================================

if (logo) {

    logo.addEventListener(
        "click",
        function() {

            showWardrobe();

        }
    );

}


// =====================================================
// PROFILE BUTTON
// =====================================================

const profileButton =
    document.getElementById(
        "profileButton"
    );


if (profileButton) {

    profileButton.addEventListener(
        "click",
        function() {

            alert(
                "Profile settings will come later."
            );

        }
    );

}


// =====================================================
// INITIAL LOAD
// =====================================================

renderWardrobe();


// Make sure we start on wardrobe

showWardrobe();


console.log(
    "Closet AI manual version loaded successfully!"
);