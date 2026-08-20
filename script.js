// =====================================================
// CLOSET AI
// MANUAL WARDROBE VERSION
// =====================================================


// =====================================================
// STORAGE
// =====================================================

const WARDROBE_KEY = "closetAI_wardrobe_v2";
const OUTFITS_KEY = "closetAI_outfits_v2";


// =====================================================
// STORAGE HELPERS
// =====================================================

function getWardrobe() {

    try {

        return JSON.parse(
            localStorage.getItem(WARDROBE_KEY)
        ) || [];

    } catch {

        return [];

    }

}


function saveWardrobe(items) {

    localStorage.setItem(
        WARDROBE_KEY,
        JSON.stringify(items)
    );

}


function getOutfits() {

    try {

        return JSON.parse(
            localStorage.getItem(OUTFITS_KEY)
        ) || [];

    } catch {

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

const wardrobePage =
    document.getElementById("wardrobePage");

const dynamicPage =
    document.getElementById("dynamicPage");

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

const addItemButton =
    document.getElementById("addItemButton");

const styleOutfitButton =
    document.getElementById("styleOutfitButton");

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

const typePicker =
    document.getElementById("typePicker");


// =====================================================
// TEMP IMAGE
// =====================================================

let selectedImage = "";

let selectedTypes = [];

let currentFilter = "all";


// =====================================================
// OPEN MODAL
// =====================================================

function openAddModal() {

    resetForm();

    addItemModal.classList.add("active");

}


// =====================================================
// CLOSE MODAL
// =====================================================

function closeAddModal() {

    addItemModal.classList.remove(
        "active"
    );

}


addItemButton.addEventListener(
    "click",
    openAddModal
);


closeModal.addEventListener(
    "click",
    closeAddModal
);


addItemModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            addItemModal
        ) {

            closeAddModal();

        }

    }
);


// =====================================================
// IMAGE RESIZE
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

                            const max =
                                1000;

                            let width =
                                image.width;

                            let height =
                                image.height;


                            if (
                                width > max ||
                                height > max
                            ) {

                                if (
                                    width >
                                    height
                                ) {

                                    height =
                                        height *
                                        max /
                                        width;

                                    width =
                                        max;

                                } else {

                                    width =
                                        width *
                                        max /
                                        height;

                                    height =
                                        max;

                                }

                            }


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                width;

                            canvas.height =
                                height;


                            canvas
                                .getContext("2d")
                                .drawImage(
                                    image,
                                    0,
                                    0,
                                    width,
                                    height
                                );


                            resolve(
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.78
                                )
                            );

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

clothingImage.addEventListener(
    "change",
    async function(event) {

        const file =
            event.target.files[0];


        if (!file) {

            return;

        }


        try {

            selectedImage =
                await resizeImage(file);


            imagePreview.src =
                selectedImage;


            imagePreview.style.display =
                "block";


            uploadPlaceholder.style.display =
                "none";

        } catch {

            alert(
                "The photo could not be loaded."
            );

        }

    }
);


// =====================================================
// TYPE PICKER
// =====================================================

document
    .querySelectorAll(".type-option")
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const type =
                        button.dataset.type;


                    if (
                        selectedTypes.includes(
                            type
                        )
                    ) {

                        selectedTypes =
                            selectedTypes.filter(
                                function(item) {

                                    return (
                                        item !==
                                        type
                                    );

                                }
                            );


                        button.classList.remove(
                            "selected"
                        );

                    } else {

                        selectedTypes.push(
                            type
                        );


                        button.classList.add(
                            "selected"
                        );

                    }

                }
            );

        }
    );


// =====================================================
// SAVE CLOTHING
// =====================================================

saveItemButton.addEventListener(
    "click",
    function() {

        const name =
            clothingName.value.trim();


        const category =
            clothingCategory.value;


        if (!name) {

            alert(
                "Please give your clothing a name."
            );

            clothingName.focus();

            return;

        }


        const item = {

            id:
                "item-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .slice(2, 8),

            name:
                name,

            category:
                category,

            types:
                [...selectedTypes],

            image:
                selectedImage,

            favorite:
                false,

            createdAt:
                Date.now()

        };


        const wardrobe =
            getWardrobe();


        wardrobe.push(
            item
        );


        try {

            saveWardrobe(
                wardrobe
            );

        } catch {

            alert(
                "The photo is too large to save. Try a smaller photo."
            );

            return;

        }


        closeAddModal();

        renderWardrobe();

    }
);


// =====================================================
// RESET FORM
// =====================================================

function resetForm() {

    selectedImage = "";

    selectedTypes = [];


    clothingName.value =
        "";


    clothingCategory.value =
        "top";


    clothingImage.value =
        "";


    imagePreview.src =
        "";


    imagePreview.style.display =
        "none";


    uploadPlaceholder.style.display =
        "flex";


    document
        .querySelectorAll(".type-option")
        .forEach(
            function(button) {

                button.classList.remove(
                    "selected"
                );

            }
        );

}


// =====================================================
// TYPE LABEL
// =====================================================

function typeLabel(type) {

    const labels = {

        basic:
            "Basic",

        everyday:
            "Everyday",

        fine:
            "Fine",

        summer:
            "Summer",

        hot:
            "Hot weather",

        winter:
            "Winter",

        beach:
            "Beach",

        party:
            "Party",

        "going-out":
            "Going out",

        work:
            "Work",

        cozy:
            "Cozy",

        sport:
            "Sport",

        statement:
            "Statement"

    };


    return (
        labels[type] ||
        type
    );

}


// =====================================================
// CATEGORY LABEL
// =====================================================

function categoryLabel(category) {

    const labels = {

        top:
            "Top",

        bottom:
            "Bottom",

        dress:
            "Dress",

        shoes:
            "Shoes",

        accessory:
            "Accessory"

    };


    return (
        labels[category] ||
        category
    );

}


// =====================================================
// EMOJI
// =====================================================

function categoryEmoji(category) {

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

    const wardrobe =
        getWardrobe();


    clothingGrid.innerHTML =
        "";


    itemCount.textContent =
        `${wardrobe.length} ${
            wardrobe.length === 1
                ? "item"
                : "items"
        } in your closet`;


    const filtered =
        currentFilter === "all"

            ? wardrobe

            : wardrobe.filter(
                function(item) {

                    return (
                        item.category ===
                        currentFilter
                    );

                }
            );


    if (
        filtered.length === 0
    ) {

        clothingGrid.innerHTML = `

            <div class="empty-state">

                <div style="font-size:50px;">
                    ${wardrobe.length
                        ? "🔎"
                        : "👗"}
                </div>

                <h3>
                    ${
                        wardrobe.length
                            ? "No items here"
                            : "Your wardrobe is empty"
                    }
                </h3>

                <p>
                    ${
                        wardrobe.length
                            ? "Try another category."
                            : "Add your first clothing item."
                    }
                </p>

            </div>

        `;

        return;

    }


    filtered.forEach(
        function(item) {

            clothingGrid.appendChild(
                createClothingCard(item)
            );

        }
    );


    attachCardButtons();

}


// =====================================================
// CLOTHING CARD
// =====================================================

function createClothingCard(item) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "clothing-card";


    card.dataset.category =
        item.category;


    card.dataset.id =
        item.id;


    const image =
        item.image

            ?

            `<img
                src="${item.image}"
                alt="${escapeHTML(item.name)}"
            >`

            :

            `<div class="placeholder">
                ${categoryEmoji(item.category)}
            </div>`;


    const tags =
        (item.types || [])
            .map(
                function(type) {

                    return `
                        <span class="item-tag">
                            ${typeLabel(type)}
                        </span>
                    `;

                }
            )
            .join("");


    card.innerHTML = `

        <div class="clothing-image">

            ${image}

            <button
                class="heart ${
                    item.favorite
                        ? "active"
                        : ""
                }"
                data-action="favorite"
                type="button"
            >
                ${
                    item.favorite
                        ? "♥"
                        : "♡"
                }
            </button>

        </div>


        <div class="clothing-info">

            <div>

                <h3>
                    ${escapeHTML(item.name)}
                </h3>

                <p>
                    ${categoryLabel(item.category)}
                </p>

                <div class="item-tags">
                    ${tags}
                </div>

            </div>


            <button
                class="more"
                data-action="delete"
                type="button"
            >
                •••
            </button>

        </div>

    `;


    return card;

}


// =====================================================
// CARD BUTTONS
// =====================================================

function attachCardButtons() {

    document
        .querySelectorAll(
            '[data-action="favorite"]'
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.stopPropagation();

                        const card =
                            button.closest(
                                ".clothing-card"
                            );


                        toggleFavorite(
                            card.dataset.id
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            '[data-action="delete"]'
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.stopPropagation();

                        const card =
                            button.closest(
                                ".clothing-card"
                            );


                        deleteItem(
                            card.dataset.id
                        );

                    }
                );

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


    if (
        currentPage ===
        "favorites"
    ) {

        showFavorites();

    } else {

        renderWardrobe();

    }

}


// =====================================================
// DELETE ITEM
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


    if (
        !confirm(
            `Delete "${item.name}"?`
        )
    ) {

        return;

    }


    saveWardrobe(
        wardrobe.filter(
            function(item) {

                return item.id !== id;

            }
        )
    );


    renderWardrobe();

}


// =====================================================
// FILTERS
// =====================================================

document
    .querySelectorAll(".filter")
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    document
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


                    currentFilter =
                        button.dataset.category;


                    renderWardrobe();

                }
            );

        }
    );


// =====================================================
// PAGE HELPERS
// =====================================================

let currentPage =
    "wardrobe";


function activateNav(button) {

    document
        .querySelectorAll(".nav-item")
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


function showDynamicPage() {

    wardrobePage.classList.add(
        "hidden"
    );

    dynamicPage.classList.remove(
        "hidden"
    );

}


function showWardrobe() {

    currentPage =
        "wardrobe";


    activateNav(
        wardrobeNav
    );


    dynamicPage.classList.add(
        "hidden"
    );


    wardrobePage.classList.remove(
        "hidden"
    );


    renderWardrobe();

}


// =====================================================
// OUTFITS PAGE
// =====================================================

function showOutfits() {

    currentPage =
        "outfits";


    activateNav(
        outfitsNav
    );


    showDynamicPage();


    const outfits =
        getOutfits();


    dynamicPage.innerHTML = `

        <div class="dynamic-page-header">

            <p class="hero-label">
                YOUR LOOKS
            </p>

            <h2>
                My outfits
            </h2>

            <p>
                Create and save outfits using your own clothes.
            </p>

        </div>


        <button
            class="style-button"
            id="newOutfitButton"
            type="button"
        >
            ＋ Create outfit
        </button>


        <div id="savedOutfits"></div>

    `;


    document
        .getElementById(
            "newOutfitButton"
        )
        .addEventListener(
            "click",
            showOutfitBuilder
        );


    renderSavedOutfits();

}


// =====================================================
// OUTFIT BUILDER
// =====================================================

function showOutfitBuilder() {

    showDynamicPage();


    const wardrobe =
        getWardrobe();


    dynamicPage.innerHTML = `

        <div class="dynamic-page-header">

            <p class="hero-label">
                MANUAL STYLING
            </p>

            <h2>
                Create your outfit
            </h2>

            <p>
                Swipe through your clothes and tap
                the pieces you want to wear.
            </p>

        </div>


        <div class="outfit-builder">

            <label class="input-label">

                Outfit name

                <input
                    type="text"
                    id="outfitName"
                    placeholder="e.g. Summer dinner"
                >

            </label>


            <div id="outfitCategories"></div>


            <div class="selected-outfit">

                <strong>
                    Your selected outfit
                </strong>

                <div
                    class="selected-outfit-items"
                    id="selectedOutfitItems"
                >
                    <span class="selected-chip">
                        Nothing selected yet
                    </span>
                </div>

            </div>


            <button
                class="save-item"
                id="saveOutfitButton"
                type="button"
                style="margin-top:20px;"
            >
                Save outfit!
            </button>

        </div>

    `;


    if (
        wardrobe.length === 0
    ) {

        document
            .getElementById(
                "outfitCategories"
            )
            .innerHTML = `

                <div class="empty-state">

                    <div style="font-size:45px;">
                        👗
                    </div>

                    <h3>
                        Add clothes first
                    </h3>

                    <p>
                        Your outfit creator uses
                        the clothes in your wardrobe.
                    </p>

                </div>

            `;


        return;

    }


    const categories = [

        {
            key:
                "top",

            name:
                "Tops",

            multiple:
                false

        },

        {
            key:
                "bottom",

            name:
                "Bottoms",

            multiple:
                false

        },

        {
            key:
                "dress",

            name:
                "Dresses",

            multiple:
                false

        },

        {
            key:
                "shoes",

            name:
                "Shoes",

            multiple:
                false

        },

        {
            key:
                "accessory",

            name:
                "Accessories",

            multiple:
                true

        }

    ];


    const container =
        document.getElementById(
            "outfitCategories"
        );


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


            const section =
                document.createElement(
                    "section"
                );


            section.className =
                "outfit-section";


            section.innerHTML = `

                <div
                    class="outfit-section-header"
                >

                    <h3>
                        ${category.name}
                    </h3>

                    <span>
                        ${
                            category.multiple
                                ? "Choose multiple"
                                : "Choose one"
                        }
                    </span>

                </div>


                <div
                    class="swipe-row"
                    data-category-row="${category.key}"
                ></div>

            `;


            const row =
                section.querySelector(
                    ".swipe-row"
                );


            items.forEach(
                function(item) {

                    row.appendChild(
                        createOutfitItem(
                            item,
                            category.multiple
                        )
                    );

                }
            );


            container.appendChild(
                section
            );

        }
    );


    document
        .getElementById(
            "saveOutfitButton"
        )
        .addEventListener(
            "click",
            saveCurrentOutfit
        );

}


// =====================================================
// CREATE OUTFIT ITEM
// =====================================================

function createOutfitItem(
    item,
    multiple
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "outfit-item";


    element.dataset.id =
        item.id;


    element.dataset.multiple =
        multiple;


    const image =
        item.image

            ?

            `<img
                src="${item.image}"
                alt="${escapeHTML(item.name)}"
            >`

            :

            `<div
                class="placeholder"
                style="font-size:50px;"
            >
                ${categoryEmoji(item.category)}
            </div>`;


    const tags =
        (item.types || [])
            .slice(0, 3)
            .map(
                function(type) {

                    return `
                        <span class="item-tag">
                            ${typeLabel(type)}
                        </span>
                    `;

                }
            )
            .join("");


    element.innerHTML = `

        <div class="outfit-item-image">
            ${image}
        </div>

        <div class="outfit-item-info">

            <strong>
                ${escapeHTML(item.name)}
            </strong>

            <span>
                ${categoryLabel(item.category)}
            </span>

            <div class="outfit-item-tags">
                ${tags}
            </div>

        </div>

    `;


    element.addEventListener(
        "click",
        function() {

            handleOutfitSelection(
                element,
                item,
                multiple
            );

        }
    );


    return element;

}


// =====================================================
// OUTFIT SELECTION
// =====================================================

let selectedOutfitItems = [];


function handleOutfitSelection(
    element,
    item,
    multiple
) {

    const alreadySelected =
        selectedOutfitItems.some(
            function(selected) {

                return (
                    selected.id ===
                    item.id
                );

            }
        );


    if (
        alreadySelected
    ) {

        selectedOutfitItems =
            selectedOutfitItems.filter(
                function(selected) {

                    return (
                        selected.id !==
                        item.id
                    );

                }
            );


        element.classList.remove(
            "selected"
        );


        updateSelectedOutfit();

        return;

    }


    // -----------------------------------------
    // Accessories can be multiple.
    // Other categories only one.
    // -----------------------------------------

    if (!multiple) {

        const sameCategory =
            selectedOutfitItems.find(
                function(selected) {

                    return (
                        selected.category ===
                        item.category
                    );

                }
            );


        if (sameCategory) {

            selectedOutfitItems =
                selectedOutfitItems.filter(
                    function(selected) {

                        return (
                            selected.category !==
                            item.category
                        );

                    }
                );


            document
                .querySelectorAll(
                    `.outfit-item[data-id="${sameCategory.id}"]`
                )
                .forEach(
                    function(card) {

                        card.classList.remove(
                            "selected"
                        );

                    }
                );

        }

    }


    selectedOutfitItems.push(
        item
    );


    element.classList.add(
        "selected"
    );


    updateSelectedOutfit();

}


// =====================================================
// SELECTED OUTFIT PREVIEW
// =====================================================

function updateSelectedOutfit() {

    const container =
        document.getElementById(
            "selectedOutfitItems"
        );


    if (!container) {

        return;

    }


    if (
        selectedOutfitItems.length === 0
    ) {

        container.innerHTML = `

            <span class="selected-chip">
                Nothing selected yet
            </span>

        `;

        return;

    }


    container.innerHTML =
        selectedOutfitItems
            .map(
                function(item) {

                    return `
                        <span class="selected-chip">
                            ${escapeHTML(item.name)}
                        </span>
                    `;

                }
            )
            .join("");

}


// =====================================================
// SAVE CURRENT OUTFIT
// =====================================================

function saveCurrentOutfit() {

    const nameInput =
        document.getElementById(
            "outfitName"
        );


    const name =
        nameInput.value.trim();


    if (!name) {

        alert(
            "Please give your outfit a name."
        );

        nameInput.focus();

        return;

    }


    if (
        selectedOutfitItems.length === 0
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

        items:
            selectedOutfitItems.map(
                function(item) {

                    return {

                        id:
                            item.id,

                        name:
                            item.name,

                        category:
                            item.category,

                        types:
                            item.types || [],

                        image:
                            item.image

                    };

                }
            ),

        createdAt:
            Date.now()

    };


    const outfits =
        getOutfits();


    outfits.unshift(
        outfit
    );


    saveOutfits(
        outfits
    );


    selectedOutfitItems = [];


    alert(
        "Outfit saved!✨ "
    );


    showOutfits();

}


// =====================================================
// SAVED OUTFITS
// =====================================================

function renderSavedOutfits() {

    const container =
        document.getElementById(
            "savedOutfits"
        );


    if (!container) {

        return;

    }


    const outfits =
        getOutfits();


    if (
        outfits.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div style="font-size:48px;">
                    ✨
                </div>

                <h3>
                    No saved outfits
                </h3>

                <p>
                    Create your first outfit above.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        outfits
            .map(
                function(outfit) {

                    const images =
                        outfit.items
                            .filter(
                                function(item) {

                                    return item.image;

                                }
                            )
                            .map(
                                function(item) {

                                    return `
                                        <img
                                            src="${item.image}"
                                            alt="${escapeHTML(item.name)}"
                                        >
                                    `;

                                }
                            )
                            .join("");


                    const names =
                        outfit.items
                            .map(
                                function(item) {

                                    return `
                                        <span class="selected-chip">
                                            ${escapeHTML(item.name)}
                                        </span>
                                    `;

                                }
                            )
                            .join("");


                    return `

                        <article
                            class="saved-outfit"
                        >

                            <h3>
                                ${escapeHTML(
                                    outfit.name
                                )}
                            </h3>

                            <p
                                class="saved-outfit-description"
                            >
                                ${outfit.items.length}
                                pieces
                            </p>


                            <div
                                class="saved-outfit-images"
                            >
                                ${images}
                            </div>


                            <div
                                class="selected-outfit-items"
                            >
                                ${names}
                            </div>


                            <button
                                class="delete-outfit"
                                data-outfit-id="${outfit.id}"
                                type="button"
                            >
                                Delete outfit
                            </button>

                        </article>

                    `;

                }
            )
            .join("");


    container
        .querySelectorAll(
            ".delete-outfit"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        deleteOutfit(
                            button.dataset.outfitId
                        );

                    }
                );

            }
        );

}


// =====================================================
// DELETE OUTFIT
// =====================================================

function deleteOutfit(id) {

    if (
        !confirm(
            "Delete this outfit?"
        )
    ) {

        return;

    }


    const outfits =
        getOutfits();


    saveOutfits(
        outfits.filter(
            function(outfit) {

                return (
                    outfit.id !== id
                );

            }
        )
    );


    renderSavedOutfits();

}


// =====================================================
// FAVORITES PAGE
// =====================================================

function showFavorites() {

    currentPage =
        "favorites";


    activateNav(
        favoritesNav
    );


    showDynamicPage();


    const wardrobe =
        getWardrobe();


    const favorites =
        wardrobe.filter(
            function(item) {

                return item.favorite;

            }
        );


    dynamicPage.innerHTML = `

        <div class="dynamic-page-header">

            <p class="hero-label">
                YOUR PICKS
            </p>

            <h2>
                Favorites
            </h2>

            <p>
                The pieces you love most.
            </p>

        </div>


        <div
            class="clothing-grid"
            id="favoritesGrid"
        ></div>

    `;


    const grid =
        document.getElementById(
            "favoritesGrid"
        );


    if (
        favorites.length === 0
    ) {

        grid.innerHTML = `

            <div class="empty-state">

                <div style="font-size:50px;">
                    ♡
                </div>

                <h3>
                    No favorites yet
                </h3>

                <p>
                    Tap the heart on any clothing item.
                </p>

            </div>

        `;

        return;

    }


    favorites.forEach(
        function(item) {

            grid.appendChild(
                createClothingCard(item)
            );

        }
    );


    attachCardButtons();

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


    showDynamicPage();


    const wardrobe =
        getWardrobe();


    const outfits =
        getOutfits();


    dynamicPage.innerHTML = `

        <div class="dynamic-page-header">

            <p class="hero-label">
                APP SETTINGS
            </p>

            <h2>
                Settings
            </h2>

            <p>
                Manage your manual wardrobe.
            </p>

        </div>


        <div class="settings-card">

            <h3>
                Wardrobe
            </h3>

            <p>
                You currently have
                <strong>
                    ${wardrobe.length}
                </strong>
                clothing items and
                <strong>
                    ${outfits.length}
                </strong>
                saved outfits.
            </p>

        </div>


        <div class="settings-card">

            <h3>
                AI Stylist
            </h3>

            <p>
                Luna is currently switched off.
                We're building the manual wardrobe
                first. AI styling can be added later.
            </p>

        </div>


        <div class="settings-card">

            <h3>
                Reset wardrobe
            </h3>

            <p>
                This will delete all clothes and
                saved outfits from this browser.
            </p>

            <button
                class="danger-button"
                id="clearDataButton"
                type="button"
            >
                Delete all data
            </button>

        </div>

    `;


    document
        .getElementById(
            "clearDataButton"
        )
        .addEventListener(
            "click",
            function() {

                if (
                    !confirm(
                        "Are you absolutely sure? This cannot be undone."
                    )
                ) {

                    return;

                }


                localStorage.removeItem(
                    WARDROBE_KEY
                );


                localStorage.removeItem(
                    OUTFITS_KEY
                );


                alert(
                    "All wardrobe data has been deleted."
                );


                showWardrobe();

            }
        );

}


// =====================================================
// NAVIGATION
// =====================================================

wardrobeNav.addEventListener(
    "click",
    function() {

        showWardrobe();

    }
);


outfitsNav.addEventListener(
    "click",
    function() {

        showOutfits();

    }
);


favoritesNav.addEventListener(
    "click",
    function() {

        showFavorites();

    }
);


settingsNav.addEventListener(
    "click",
    function() {

        showSettings();

    }
);


logo.addEventListener(
    "click",
    function() {

        showWardrobe();

    }
);


styleOutfitButton.addEventListener(
    "click",
    function() {

        showOutfitBuilder();

    }
);


// =====================================================
// PROFILE
// =====================================================

document
    .getElementById("profileButton")
    .addEventListener(
        "click",
        function() {

            alert(
                "Profile settings can be added later✨"
            );

        }
    );


// =====================================================
// INITIAL LOAD
// =====================================================

selectedOutfitItems = [];

renderWardrobe();

showWardrobe();


console.log(
    "Closet manual wardrobe loaded! "
);