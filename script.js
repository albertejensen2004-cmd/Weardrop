// =====================================================
// CLOSET AI
// COMPLETE MANUAL VERSION
// NO LUNA / NO API
// =====================================================


// =====================================================
// STORAGE
// =====================================================

const WARDROBE_KEY = "closetAI_wardrobe_v2";
const OUTFITS_KEY = "closetAI_outfits_v2";


// =====================================================
// APP STATE
// =====================================================

let selectedImage = "";
let selectedTypes = [];
let currentPage = "wardrobe";
let currentFilter = "all";
let selectedOutfitItems = [];


// =====================================================
// HELPER
// =====================================================

function $(id) {
    return document.getElementById(id);
}


function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value || "";

    return div.innerHTML;

}


// =====================================================
// STORAGE
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
// LABELS
// =====================================================

const TYPE_OPTIONS = [

    ["basic", "Basic"],
    ["everyday", "Everyday"],
    ["fine", "Fine"],
    ["summer", "Summer"],
    ["hot", "Hot weather"],
    ["winter", "Winter"],
    ["beach", "Beach"],
    ["party", "Party"],
    ["going-out", "Going out"],
    ["work", "Work"],
    ["cozy", "Cozy"],
    ["sport", "Sport"],
    ["statement", "Statement"]

];


function typeLabel(type) {

    const match =
        TYPE_OPTIONS.find(
            item => item[0] === type
        );

    return match
        ? match[1]
        : type;

}


function categoryLabel(category) {

    const labels = {

        top: "Top",
        bottom: "Bottom",
        dress: "Dress",
        shoes: "Shoes",
        accessory: "Accessory"

    };

    return (
        labels[category] ||
        category
    );

}


function categoryEmoji(category) {

    const emojis = {

        top: "👚",
        bottom: "👖",
        dress: "👗",
        shoes: "👟",
        accessory: "👜"

    };

    return (
        emojis[category] ||
        "👗"
    );

}


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initApp
);


function initApp() {

    // Navigation

    $("wardrobeNav")?.addEventListener(
        "click",
        showWardrobe
    );

    $("outfitsNav")?.addEventListener(
        "click",
        showOutfits
    );

    $("favoritesNav")?.addEventListener(
        "click",
        showFavorites
    );

    $("settingsNav")?.addEventListener(
        "click",
        showSettings
    );

    $("logo")?.addEventListener(
        "click",
        showWardrobe
    );


    // Main buttons

    $("addItemButton")?.addEventListener(
        "click",
        openAddModal
    );

    $("styleOutfitButton")?.addEventListener(
        "click",
        showOutfitBuilder
    );


    $("profileButton")?.addEventListener(
        "click",
        function() {

            alert(
                "Profile settings can be added later ✨"
            );

        }
    );


    // Modal

    $("closeModal")?.addEventListener(
        "click",
        closeAddModal
    );


    $("addItemModal")?.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                $("addItemModal")
            ) {

                closeAddModal();

            }

        }
    );


    // Image

    $("clothingImage")?.addEventListener(
        "change",
        handleImageUpload
    );


    // Save

    $("saveItem")?.addEventListener(
        "click",
        saveClothing
    );


    // Types

    connectTypeButtons();


    // Wardrobe filters

    setupWardrobeFilters();


    // Start

    showWardrobe();


    console.log(
        "✨ Closet AI manual version loaded."
    );

}


// =====================================================
// NAVIGATION ACTIVE STATE
// =====================================================

function activateNav(activeButton) {

    document
        .querySelectorAll(".nav-item")
        .forEach(
            function(button) {

                button.classList.remove(
                    "active"
                );

            }
        );


    if (activeButton) {

        activeButton.classList.add(
            "active"
        );

    }

}


// =====================================================
// SHOW WARDROBE
// =====================================================

function showWardrobe() {

    currentPage =
        "wardrobe";


    activateNav(
        $("wardrobeNav")
    );


    $("dynamicPage")
        ?.classList
        .add(
            "hidden"
        );


    $("wardrobePage")
        ?.classList
        .remove(
            "hidden"
        );


    renderWardrobe();

}


// =====================================================
// ADD ITEM MODAL
// =====================================================

function openAddModal() {

    resetAddForm();


    $("addItemModal")
        ?.classList
        .add(
            "active"
        );

}


function closeAddModal() {

    $("addItemModal")
        ?.classList
        .remove(
            "active"
        );

}


function resetAddForm() {

    selectedImage =
        "";

    selectedTypes =
        [];


    if ($("clothingName")) {

        $("clothingName").value =
            "";

    }


    if ($("clothingCategory")) {

        $("clothingCategory").value =
            "top";

    }


    if ($("clothingColor")) {

        $("clothingColor").value =
            "";

    }


    if ($("clothingImage")) {

        $("clothingImage").value =
            "";

    }


    if ($("imagePreview")) {

        $("imagePreview").src =
            "";

        $("imagePreview").style.display =
            "none";

    }


    if ($("uploadPlaceholder")) {

        $("uploadPlaceholder").style.display =
            "flex";

    }


    document
        .querySelectorAll(
            ".type-option"
        )
        .forEach(
            function(button) {

                button.classList.remove(
                    "selected"
                );

            }
        );

}


// =====================================================
// TYPE BUTTONS
// =====================================================

function connectTypeButtons() {

    document
        .querySelectorAll(
            ".type-option"
        )
        .forEach(
            function(button) {

                if (
                    button.dataset.connected ===
                    "true"
                ) {

                    return;

                }


                button.dataset.connected =
                    "true";


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
                                    item =>
                                        item !== type
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

}


// =====================================================
// IMAGE UPLOAD
// =====================================================

async function handleImageUpload(event) {

    const file =
        event.target.files?.[0];


    if (!file) {

        return;

    }


    try {

        selectedImage =
            await resizeImage(
                file
            );


        const preview =
            $("imagePreview");


        if (preview) {

            preview.src =
                selectedImage;

            preview.style.display =
                "block";

        }


        if (
            $("uploadPlaceholder")
        ) {

            $("uploadPlaceholder").style.display =
                "none";

        }

    } catch (error) {

        console.error(
            error
        );


        alert(
            "The photo could not be loaded."
        );

    }

}


// =====================================================
// RESIZE IMAGE
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
                                900;


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
                                Math.round(
                                    width
                                );


                            canvas.height =
                                Math.round(
                                    height
                                );


                            const ctx =
                                canvas.getContext(
                                    "2d"
                                );


                            ctx.drawImage(
                                image,
                                0,
                                0,
                                canvas.width,
                                canvas.height
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


            reader.readAsDataURL(
                file
            );

        }
    );

}


// =====================================================
// SAVE CLOTHING
// =====================================================

function saveClothing() {

    const name =
        $("clothingName")
            ?.value
            .trim();


    if (!name) {

        alert(
            "Please give your clothing a name."
        );


        $("clothingName")
            ?.focus();


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
            $("clothingCategory")
                ?.value ||
            "top",

        color:
            $("clothingColor")
                ?.value
                .trim() ||
            "",

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

    } catch (error) {

        console.error(
            error
        );


        alert(
            "The photo is too large. Try a smaller image."
        );


        return;

    }


    closeAddModal();


    renderWardrobe();

}


// =====================================================
// WARDROBE FILTERS
// =====================================================

function setupWardrobeFilters() {

    document
        .querySelectorAll(
            ".filter"
        )
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
                            button.dataset.category ||
                            "all";


                        renderWardrobe();

                    }
                );

            }
        );

}


// =====================================================
// WARDROBE FILTER MATCH
// =====================================================

function wardrobeItemMatches(item) {

    if (
        currentFilter !==
        "all" &&
        item.category !==
        currentFilter
    ) {

        return false;

    }


    const search =
        $("wardrobeSearch")
            ?.value
            .trim()
            .toLowerCase() ||
        "";


    if (search) {

        const text = [

            item.name,

            item.color,

            item.category,

            ...(item.types || [])
                .map(typeLabel)

        ]
            .join(" ")
            .toLowerCase();


        if (
            !text.includes(
                search
            )
        ) {

            return false;

        }

    }


    return true;

}


// =====================================================
// RENDER WARDROBE
// =====================================================

function renderWardrobe() {

    const grid =
        $("clothingGrid");


    if (!grid) {

        return;

    }


    const wardrobe =
        getWardrobe();


    const filtered =
        wardrobe.filter(
            wardrobeItemMatches
        );


    const count =
        $("itemCount");


    if (count) {

        count.textContent =
            `${wardrobe.length} ${
                wardrobe.length === 1
                    ? "item"
                    : "items"
            } in your closet`;

    }


    grid.innerHTML =
        "";


    if (
        filtered.length ===
        0
    ) {

        grid.innerHTML = `

            <div class="empty-state">

                <div style="font-size:50px;">

                    ${
                        wardrobe.length
                            ? "🔎"
                            : "👗"
                    }

                </div>


                <h3>

                    ${
                        wardrobe.length
                            ? "No matching items"
                            : "Your wardrobe is empty"
                    }

                </h3>


                <p>

                    ${
                        wardrobe.length
                            ? "Try another filter."
                            : "Add your first clothing item."
                    }

                </p>

            </div>

        `;


        return;

    }


    filtered.forEach(
        function(item) {

            grid.appendChild(
                createClothingCard(
                    item
                )
            );

        }
    );

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


    card.dataset.id =
        item.id;


    const image =
        item.image

            ?

            `
            <img
                src="${item.image}"
                alt="${escapeHTML(
                    item.name
                )}"
            >
            `

            :

            `
            <div class="placeholder">

                ${categoryEmoji(
                    item.category
                )}

            </div>
            `;


    const tags =
        (item.types || [])
            .map(
                function(type) {

                    return `

                        <span
                            class="item-tag"
                        >

                            ${escapeHTML(
                                typeLabel(
                                    type
                                )
                            )}

                        </span>

                    `;

                }
            )
            .join("");


    card.innerHTML = `

        <div
            class="clothing-image"
        >

            ${image}


            <button
                class="heart ${
                    item.favorite
                        ? "active"
                        : ""
                }"
                type="button"
                data-action="favorite"
            >

                ${
                    item.favorite
                        ? "♥"
                        : "♡"
                }

            </button>

        </div>


        <div
            class="clothing-info"
        >

            <div>

                <h3>

                    ${escapeHTML(
                        item.name
                    )}

                </h3>


                <p>

                    ${escapeHTML(
                        categoryLabel(
                            item.category
                        )
                    )}

                    ${
                        item.color
                            ? " · " +
                              escapeHTML(
                                  item.color
                              )
                            : ""
                    }

                </p>


                <div
                    class="item-tags"
                >

                    ${tags}

                </div>

            </div>


            <button
                class="more"
                type="button"
                data-action="edit"
            >

                •••

            </button>

        </div>

    `;


    // Photo

    card
        .querySelector(
            ".clothing-image"
        )
        .addEventListener(
            "click",
            function(event) {

                if (
                    event.target.closest(
                        ".heart"
                    )
                ) {

                    return;

                }


                openPhotoModal(
                    item
                );

            }
        );


    // Favourite

    card
        .querySelector(
            '[data-action="favorite"]'
        )
        ?.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();


                toggleFavorite(
                    item.id
                );

            }
        );


    // Edit

    card
        .querySelector(
            '[data-action="edit"]'
        )
        ?.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();


                openEditModal(
                    item
                );

            }
        );


    return card;

}


// =====================================================
// PHOTO POPUP
// =====================================================

function openPhotoModal(item) {

    removeTemporaryModals();


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "photo-modal active";


    modal.innerHTML = `

        <div
            class="photo-modal-content"
        >

            <button
                class="close-modal"
                type="button"
                id="closePhotoViewer"
            >

                ×

            </button>


            ${
                item.image

                    ?

                    `
                    <img
                        src="${item.image}"
                        alt="${escapeHTML(
                            item.name
                        )}"
                    >
                    `

                    :

                    `
                    <div
                        class="placeholder"
                        style="
                            height:400px;
                            background:#f3efeb;
                        "
                    >

                        ${categoryEmoji(
                            item.category
                        )}

                    </div>
                    `
            }


            <h2
                style="
                    margin-top:18px;
                "
            >

                ${escapeHTML(
                    item.name
                )}

            </h2>


            <p
                style="
                    margin-top:6px;
                    color:#999;
                "
            >

                ${categoryLabel(
                    item.category
                )}

                ${
                    item.color
                        ? " · " +
                          escapeHTML(
                              item.color
                          )
                        : ""
                }

            </p>


            <div
                class="item-tags"
                style="
                    margin-top:12px;
                "
            >

                ${
                    (item.types || [])
                        .map(
                            type =>
                                `
                                <span
                                    class="item-tag"
                                >

                                    ${escapeHTML(
                                        typeLabel(
                                            type
                                        )
                                    )}

                                </span>
                                `
                        )
                        .join("")
                }

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    $("closePhotoViewer")
        .addEventListener(
            "click",
            function() {

                modal.remove();

            }
        );


    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                modal
            ) {

                modal.remove();

            }

        }
    );

}


// =====================================================
// EDIT ITEM
// =====================================================

function openEditModal(item) {

    removeTemporaryModals();


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "edit-modal active";


    modal.innerHTML = `

        <div
            class="edit-modal-content"
        >

            <button
                class="close-modal"
                type="button"
                id="closeEditModal"
            >

                ×

            </button>


            <h2>
                Edit clothing
            </h2>


            <label
                class="input-label"
                style="
                    margin-top:20px;
                "
            >

                Name

                <input
                    type="text"
                    id="editItemName"
                >

            </label>


            <label
                class="input-label"
            >

                Category

                <select
                    id="editItemCategory"
                >

                    <option value="top">
                        Tops
                    </option>

                    <option value="bottom">
                        Bottoms
                    </option>

                    <option value="dress">
                        Dresses
                    </option>

                    <option value="shoes">
                        Shoes
                    </option>

                    <option value="accessory">
                        Accessories
                    </option>

                </select>

            </label>


            <label
                class="input-label"
            >

                Colour

                <input
                    type="text"
                    id="editItemColor"
                >

            </label>


            <div
                class="input-label"
            >

                Tags

                <div
                    class="tag-picker"
                    id="editTypePicker"
                ></div>

            </div>


            <div
                class="item-action-row"
            >

                <button
                    class="edit-save-button"
                    id="saveEditButton"
                    type="button"
                >

                    Save changes

                </button>


                <button
                    class="delete-item-button"
                    id="deleteEditButton"
                    type="button"
                >

                    Delete item

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    $("editItemName").value =
        item.name;


    $("editItemCategory").value =
        item.category;


    $("editItemColor").value =
        item.color ||
        "";


    TYPE_OPTIONS.forEach(
        function([value, label]) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "type-option";


            button.dataset.type =
                value;


            button.textContent =
                label;


            if (
                (item.types || [])
                    .includes(value)
            ) {

                button.classList.add(
                    "selected"
                );

            }


            button.addEventListener(
                "click",
                function() {

                    button.classList.toggle(
                        "selected"
                    );

                }
            );


            $("editTypePicker")
                .appendChild(
                    button
                );

        }
    );


    $("closeEditModal")
        .addEventListener(
            "click",
            function() {

                modal.remove();

            }
        );


    $("saveEditButton")
        .addEventListener(
            "click",
            function() {

                const wardrobe =
                    getWardrobe();


                const existing =
                    wardrobe.find(
                        current =>
                            current.id ===
                            item.id
                    );


                if (!existing) {

                    return;

                }


                existing.name =
                    $("editItemName")
                        .value
                        .trim();


                existing.category =
                    $("editItemCategory")
                        .value;


                existing.color =
                    $("editItemColor")
                        .value
                        .trim();


                existing.types =
                    [
                        ...$("editTypePicker")
                            .querySelectorAll(
                                ".type-option.selected"
                            )
                    ]
                        .map(
                            button =>
                                button.dataset.type
                        );


                if (
                    !existing.name
                ) {

                    alert(
                        "Please give the item a name."
                    );


                    return;

                }


                saveWardrobe(
                    wardrobe
                );


                modal.remove();


                renderWardrobe();

            }
        );


    $("deleteEditButton")
        .addEventListener(
            "click",
            function() {

                modal.remove();


                confirmDeleteItem(
                    item.id
                );

            }
        );

}


// =====================================================
// DELETE ITEM CONFIRMATION
// =====================================================

function confirmDeleteItem(id) {

    const wardrobe =
        getWardrobe();


    const item =
        wardrobe.find(
            current =>
                current.id === id
        );


    if (!item) {

        return;

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "delete-modal active";


    modal.innerHTML = `

        <div
            class="delete-modal-content"
        >

            <h2>
                Delete item?
            </h2>


            <p
                style="
                    margin-top:10px;
                    color:#888;
                    line-height:1.5;
                "
            >

                Are you sure you want to delete

                <strong>
                    ${escapeHTML(
                        item.name
                    )}
                </strong>

                from your wardrobe?

            </p>


            <div
                class="item-action-row"
            >

                <button
                    class="delete-item-button"
                    id="confirmDelete"
                    type="button"
                >

                    Yes, delete

                </button>


                <button
                    class="cancel-button"
                    id="cancelDelete"
                    type="button"
                >

                    Cancel

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    $("cancelDelete")
        .addEventListener(
            "click",
            function() {

                modal.remove();

            }
        );


    $("confirmDelete")
        .addEventListener(
            "click",
            function() {

                saveWardrobe(

                    wardrobe.filter(
                        current =>
                            current.id !==
                            id
                    )

                );


                modal.remove();


                renderWardrobe();

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
            current =>
                current.id ===
                id
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
// OUTFITS PAGE
// =====================================================

function showOutfits() {

    currentPage =
        "outfits";


    activateNav(
        $("outfitsNav")
    );


    $("wardrobePage")
        ?.classList
        .add(
            "hidden"
        );


    $("dynamicPage")
        ?.classList
        .remove(
            "hidden"
        );


    const dynamic =
        $("dynamicPage");


    if (!dynamic) {

        return;

    }


    dynamic.innerHTML = `

        <div
            class="dynamic-page-header"
        >

            <p
                class="hero-label"
            >
                YOUR SAVED LOOKS
            </p>


            <h2>
                My outfits
            </h2>


            <p>
                Your saved outfits live here.
            </p>

        </div>


        <button
            class="style-button"
            id="createOutfitButton"
            type="button"
        >

            ＋ Create outfit

        </button>


        <div
            id="savedOutfits"
        ></div>

    `;


    $("createOutfitButton")
        ?.addEventListener(
            "click",
            showOutfitBuilder
        );


    renderSavedOutfits();

}


// =====================================================
// CREATE OUTFIT
// =====================================================

function showOutfitBuilder() {

    currentPage =
        "outfit-builder";


    selectedOutfitItems =
        [];


    $("wardrobePage")
        ?.classList
        .add(
            "hidden"
        );


    $("dynamicPage")
        ?.classList
        .remove(
            "hidden"
        );


    const dynamic =
        $("dynamicPage");


    dynamic.innerHTML = `

        <div
            class="dynamic-page-header"
        >

            <p
                class="hero-label"
            >
                BUILD YOUR LOOK
            </p>


            <h2>
                Create an outfit
            </h2>


            <p>
                Filter your wardrobe and
                swipe through your clothes.
            </p>

        </div>


        <!-- OUTFIT FILTERS -->

        <div
            class="closet-filter-panel"
            id="outfitFilterPanel"
        >

            <div
                class="closet-filter-row"
            >

                <div
                    style="
                        flex:2;
                        min-width:180px;
                    "
                >

                    <span
                        class="closet-filter-label"
                    >
                        Search
                    </span>


                    <input
                        id="outfitSearch"
                        type="text"
                        placeholder="Black, white, summer..."
                    >

                </div>


                <div>

                    <span
                        class="closet-filter-label"
                    >
                        Category
                    </span>


                    <select
                        id="outfitCategoryFilter"
                    >

                        <option value="all">
                            All
                        </option>

                        <option value="top">
                            Tops
                        </option>

                        <option value="bottom">
                            Bottoms
                        </option>

                        <option value="dress">
                            Dresses
                        </option>

                        <option value="shoes">
                            Shoes
                        </option>

                        <option value="accessory">
                            Accessories
                        </option>

                    </select>

                </div>


                <div>

                    <span
                        class="closet-filter-label"
                    >
                        Type
                    </span>


                    <select
                        id="outfitTypeFilter"
                    >

                        <option value="all">
                            All types
                        </option>


                        ${
                            TYPE_OPTIONS
                                .map(
                                    function(
                                        [
                                            value,
                                            label
                                        ]
                                    ) {

                                        return `

                                            <option
                                                value="${value}"
                                            >

                                                ${label}

                                            </option>

                                        `;

                                    }
                                )
                                .join("")
                        }

                    </select>

                </div>


                <div>

                    <span
                        class="closet-filter-label"
                    >
                        Colour
                    </span>


                    <input
                        id="outfitColorFilter"
                        type="text"
                        placeholder="Black"
                    >

                </div>

            </div>

        </div>


        <!-- OUTFIT BUILDER -->

        <div
            class="outfit-builder"
        >

            <!-- CLOTHING ROWS -->

            <div
                id="outfitCategories"
            ></div>


            <!-- PREVIEW -->

            <div
                class="outfit-stage"
            >

                <div
                    class="outfit-stage-title"
                >

                    Outfit preview

                </div>


                <div
                    class="outfit-stage-layout"
                >

                    <div
                        id="outfitStageLeft"
                    ></div>


                    <div
                        class="outfit-stage-center"
                        id="outfitStageCenter"
                    ></div>


                    <div
                        class="outfit-stage-accessories"
                        id="outfitStageAccessories"
                    ></div>

                </div>

            </div>


            <!-- OUTFIT NAME MOVED TO BOTTOM -->

            <div
                class="outfit-name-bottom"
            >

                <label
                    class="input-label"
                >

                    Outfit name

                    <input
                        type="text"
                        id="outfitName"
                        placeholder="e.g. Summer dinner"
                    >

                </label>

            </div>


            <!-- SAVE -->

            <button
                class="save-item"
                id="saveOutfitButton"
                type="button"
                style="margin-top:22px;"
            >

                Save outfit

            </button>


            <!-- CANCEL -->

            <button
                class="delete-outfit"
                id="cancelOutfitButton"
                type="button"
            >

                Cancel

            </button>

        </div>

    `;


    // Save

    $("saveOutfitButton")
        .addEventListener(
            "click",
            saveCurrentOutfit
        );


    // Cancel

    $("cancelOutfitButton")
        .addEventListener(
            "click",
            showOutfits
        );


    // Filters

    $("outfitSearch")
        .addEventListener(
            "input",
            renderOutfitRows
        );


    $("outfitCategoryFilter")
        .addEventListener(
            "change",
            renderOutfitRows
        );


    $("outfitTypeFilter")
        .addEventListener(
            "change",
            renderOutfitRows
        );


    $("outfitColorFilter")
        .addEventListener(
            "input",
            renderOutfitRows
        );


    renderOutfitRows();


    updateOutfitPreview();

}


// =====================================================
// OUTFIT FILTER
// =====================================================

function outfitMatchesFilter(item) {

    const search =
        $("outfitSearch")
            ?.value
            .trim()
            .toLowerCase() ||
        "";


    const category =
        $("outfitCategoryFilter")
            ?.value ||
        "all";


    const type =
        $("outfitTypeFilter")
            ?.value ||
        "all";


    const color =
        $("outfitColorFilter")
            ?.value
            .trim()
            .toLowerCase() ||
        "";


    if (
        category !==
        "all" &&
        item.category !==
        category
    ) {

        return false;

    }


    if (
        type !==
        "all" &&
        !(item.types || [])
            .includes(type)
    ) {

        return false;

    }


    if (
        color &&
        !String(
            item.color ||
            ""
        )
            .toLowerCase()
            .includes(
                color
            )
    ) {

        return false;

    }


    if (search) {

        const searchText = [

            item.name,

            item.color,

            item.category,

            ...(item.types || [])
                .map(typeLabel)

        ]
            .join(" ")
            .toLowerCase();


        if (
            !searchText.includes(
                search
            )
        ) {

            return false;

        }

    }


    return true;

}


// =====================================================
// OUTFIT ROWS + ARROWS
// =====================================================

function renderOutfitRows() {

    const container =
        $("outfitCategories");


    if (!container) {

        return;

    }


    const wardrobe =
        getWardrobe();


    const filtered =
        wardrobe.filter(
            outfitMatchesFilter
        );


    container.innerHTML =
        "";


    if (
        !filtered.length
    ) {

        container.innerHTML = `

            <div
                class="empty-state"
            >

                <div
                    style="
                        font-size:45px;
                    "
                >
                    🔎
                </div>


                <h3>
                    No clothes match
                </h3>


                <p>
                    Try a different filter.
                </p>

            </div>

        `;


        updateOutfitPreview();


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


    categories.forEach(
        function(category) {

            const items =
                filtered.filter(
                    item =>
                        item.category ===
                        category.key
                );


            if (
                !items.length
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
                    class="outfit-carousel"
                >

                    <button
                        type="button"
                        class="outfit-carousel-button outfit-prev"
                        aria-label="Previous ${category.name}"
                    >

                        ‹

                    </button>


                    <div
                        class="swipe-row"
                    ></div>


                    <button
                        type="button"
                        class="outfit-carousel-button outfit-next"
                        aria-label="Next ${category.name}"
                    >

                        ›

                    </button>

                </div>

            `;


            const row =
                section.querySelector(
                    ".swipe-row"
                );


            const previous =
                section.querySelector(
                    ".outfit-prev"
                );


            const next =
                section.querySelector(
                    ".outfit-next"
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


            setupCarouselButtons(
                row,
                previous,
                next
            );

        }
    );


    // Keep selected items visually selected

    selectedOutfitItems.forEach(
        function(selected) {

            const card =
                container.querySelector(
                    `.outfit-item[data-id="${selected.id}"]`
                );


            card?.classList.add(
                "selected"
            );

        }
    );

}


// =====================================================
// CAROUSEL BUTTONS
// =====================================================

function setupCarouselButtons(
    row,
    previousButton,
    nextButton
) {

    function updateButtons() {

        const maxScroll =
            row.scrollWidth -
            row.clientWidth;


        previousButton.disabled =
            row.scrollLeft <= 5;


        nextButton.disabled =
            row.scrollLeft >=
            maxScroll - 5;

    }


    previousButton.addEventListener(
        "click",
        function() {

            row.scrollBy({

                left:
                    -(
                        row.clientWidth *
                        0.8
                    ),

                behavior:
                    "smooth"

            });

        }
    );


    nextButton.addEventListener(
        "click",
        function() {

            row.scrollBy({

                left:
                    row.clientWidth *
                    0.8,

                behavior:
                    "smooth"

            });

        }
    );


    row.addEventListener(
        "scroll",
        updateButtons
    );


    setTimeout(
        updateButtons,
        100
    );

}


// =====================================================
// OUTFIT ITEM
// =====================================================

function createOutfitItem(
    item,
    multiple
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "outfit-item";


    card.dataset.id =
        item.id;


    const image =
        item.image

            ?

            `
            <img
                src="${item.image}"
                alt="${escapeHTML(
                    item.name
                )}"
            >
            `

            :

            `
            <div
                class="placeholder"
            >

                ${categoryEmoji(
                    item.category
                )}

            </div>
            `;


    const tags =
        (item.types || [])
            .slice(
                0,
                3
            )
            .map(
                function(type) {

                    return `

                        <span
                            class="item-tag"
                        >

                            ${escapeHTML(
                                typeLabel(
                                    type
                                )
                            )}

                        </span>

                    `;

                }
            )
            .join("");


    card.innerHTML = `

        <div
            class="outfit-item-image"
        >

            ${image}

        </div>


        <div
            class="outfit-item-info"
        >

            <strong>

                ${escapeHTML(
                    item.name
                )}

            </strong>


            <span>

                ${categoryLabel(
                    item.category
                )}

            </span>


            <div
                class="outfit-item-tags"
            >

                ${tags}

            </div>

        </div>

    `;


    card.addEventListener(
        "click",
        function() {

            selectOutfitItem(
                card,
                item,
                multiple
            );

        }
    );


    return card;

}


// =====================================================
// SELECT OUTFIT ITEM
// =====================================================

function selectOutfitItem(
    card,
    item,
    multiple
) {

    const alreadySelected =
        selectedOutfitItems.some(
            current =>
                current.id ===
                item.id
        );


    if (
        alreadySelected
    ) {

        selectedOutfitItems =
            selectedOutfitItems.filter(
                current =>
                    current.id !==
                    item.id
            );


        card.classList.remove(
            "selected"
        );


        updateOutfitPreview();


        return;

    }


    // Dress removes top and bottom.

    if (
        item.category ===
        "dress"
    ) {

        selectedOutfitItems =
            selectedOutfitItems.filter(
                current =>
                    current.category !==
                    "dress" &&
                    current.category !==
                    "top" &&
                    current.category !==
                    "bottom"
            );


        document
            .querySelectorAll(
                ".outfit-item"
            )
            .forEach(
                element =>
                    element.classList.remove(
                        "selected"
                    )
            );

    }


    // Top or bottom removes dress.

    if (
        item.category ===
            "top" ||
        item.category ===
            "bottom"
    ) {

        selectedOutfitItems =
            selectedOutfitItems.filter(
                current =>
                    current.category !==
                    item.category &&
                    current.category !==
                    "dress"
            );


        document
            .querySelectorAll(
                ".outfit-item"
            )
            .forEach(
                element => {

                    const selected =
                        selectedOutfitItems.some(
                            current =>
                                current.id ===
                                element.dataset.id
                        );


                    if (!selected) {

                        element.classList.remove(
                            "selected"
                        );

                    }

                }
            );

    }


    // Shoes = one.

    if (
        item.category ===
        "shoes"
    ) {

        selectedOutfitItems =
            selectedOutfitItems.filter(
                current =>
                    current.category !==
                    "shoes"
            );


        document
            .querySelectorAll(
                ".outfit-item"
            )
            .forEach(
                function(element) {

                    if (
                        element.dataset.id !==
                        item.id
                    ) {

                        const currentItem =
                            getWardrobe().find(
                                current =>
                                    current.id ===
                                    element.dataset.id
                            );


                        if (
                            currentItem &&
                            currentItem.category ===
                                "shoes"
                        ) {

                            element.classList.remove(
                                "selected"
                            );

                        }

                    }

                }
            );

    }


    // Add selected item.

    selectedOutfitItems.push(
        item
    );


    card.classList.add(
        "selected"
    );


    updateOutfitPreview();

}


// =====================================================
// OUTFIT PREVIEW
// =====================================================

function updateOutfitPreview() {

    const center =
        $("outfitStageCenter");


    const left =
        $("outfitStageLeft");


    const accessories =
        $("outfitStageAccessories");


    if (
        !center ||
        !left ||
        !accessories
    ) {

        return;

    }


    center.innerHTML =
        "";


    left.innerHTML =
        "";


    accessories.innerHTML =
        "";


    // Dress

    const dress =
        selectedOutfitItems.find(
            item =>
                item.category ===
                "dress"
        );


    if (dress) {

        center.appendChild(
            makeOutfitPiece(
                dress
            )
        );

    } else {

        const top =
            selectedOutfitItems.find(
                item =>
                    item.category ===
                    "top"
            );


        const bottom =
            selectedOutfitItems.find(
                item =>
                    item.category ===
                    "bottom"
            );


        center.appendChild(

            top

                ?

                makeOutfitPiece(
                    top
                )

                :

                makeEmptyPiece(
                    "Choose a top"
                )

        );


        center.appendChild(

            bottom

                ?

                makeOutfitPiece(
                    bottom
                )

                :

                makeEmptyPiece(
                    "Choose a bottom"
                )

        );

    }


    // Shoes

    const shoes =
        selectedOutfitItems.find(
            item =>
                item.category ===
                "shoes"
        );


    left.appendChild(

        shoes

            ?

            makeOutfitPiece(
                shoes
            )

            :

            makeEmptyPiece(
                "Choose shoes"
            )

    );


    // Accessories

    const selectedAccessories =
        selectedOutfitItems.filter(
            item =>
                item.category ===
                "accessory"
        );


    if (
        !selectedAccessories.length
    ) {

        accessories.appendChild(
            makeEmptyPiece(
                "Add accessories"
            )
        );

    } else {

        selectedAccessories.forEach(
            function(item) {

                accessories.appendChild(
                    makeOutfitPiece(
                        item
                    )
                );

            }
        );

    }

}


// =====================================================
// OUTFIT PIECE
// =====================================================

function makeOutfitPiece(item) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "outfit-piece";


    element.innerHTML = `

        ${
            item.image

                ?

                `
                <img
                    src="${item.image}"
                    alt="${escapeHTML(
                        item.name
                    )}"
                >
                `

                :

                `
                <div
                    class="placeholder"
                    style="
                        height:125px;
                        font-size:40px;
                    "
                >

                    ${categoryEmoji(
                        item.category
                    )}

                </div>
                `
        }


        <div
            class="outfit-piece-name"
        >

            ${escapeHTML(
                item.name
            )}

        </div>

    `;


    return element;

}


function makeEmptyPiece(text) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "outfit-empty-piece";


    element.textContent =
        text;


    return element;

}


// =====================================================
// SAVE OUTFIT
// =====================================================

function saveCurrentOutfit() {

    const name =
        $("outfitName")
            ?.value
            .trim();


    if (!name) {

        alert(
            "Please give your outfit a name."
        );


        $("outfitName")
            ?.focus();


        return;

    }


    if (
        selectedOutfitItems.length ===
        0
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
                item => ({

                    id:
                        item.id,

                    name:
                        item.name,

                    category:
                        item.category,

                    color:
                        item.color ||
                        "",

                    types:
                        item.types ||
                        [],

                    image:
                        item.image ||
                        ""

                })
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


    selectedOutfitItems =
        [];


    alert(
        "Outfit saved! ✨"
    );


    showOutfits();

}


// =====================================================
// SAVED OUTFITS
// =====================================================

function renderSavedOutfits() {

    const container =
        $("savedOutfits");


    if (!container) {

        return;

    }


    const outfits =
        getOutfits();


    if (
        !outfits.length
    ) {

        container.innerHTML = `

            <div
                class="empty-state"
            >

                <div
                    style="
                        font-size:48px;
                    "
                >
                    ✨
                </div>


                <h3>
                    No saved outfits
                </h3>


                <p>
                    Click Create outfit
                    to make your first look.
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
                                item =>
                                    item.image
                            )
                            .map(
                                item =>
                                    `

                                    <img
                                        src="${item.image}"
                                        alt="${escapeHTML(
                                            item.name
                                        )}"
                                    >

                                    `
                            )
                            .join("");


                    return `

                        <article
                            class="saved-outfit-card"
                            data-outfit-id="${outfit.id}"
                        >


                            <div
                                class="saved-outfit-thumb-row"
                            >

                                ${
                                    images ||
                                    `
                                    <span
                                        class="selected-chip"
                                    >

                                        No photos

                                    </span>
                                    `
                                }

                            </div>


                            <h3>
                                ${escapeHTML(
                                    outfit.name
                                )}
                            </h3>


                            <p
                                class="saved-outfit-description"
                            >

                                ${
                                    outfit.items.length
                                }

                                ${
                                    outfit.items.length === 1
                                        ? "piece"
                                        : "pieces"
                                }

                            </p>


                            <div
                                class="selected-outfit-items"
                            >

                                ${
                                    outfit.items
                                        .map(
                                            item =>
                                                `

                                                <span
                                                    class="selected-chip"
                                                >

                                                    ${escapeHTML(
                                                        item.name
                                                    )}

                                                </span>

                                                `
                                        )
                                        .join("")
                                }

                            </div>


                            <button
                                class="delete-outfit"
                                type="button"
                                data-delete-outfit="${outfit.id}"
                            >

                                Delete outfit

                            </button>

                        </article>

                    `;

                }
            )
            .join("");


    // Open saved outfit

    container
        .querySelectorAll(
            ".saved-outfit-card"
        )
        .forEach(
            function(card) {

                card.addEventListener(
                    "click",
                    function() {

                        showSavedOutfit(
                            card.dataset.outfitId
                        );

                    }
                );

            }
        );


    // Delete

    container
        .querySelectorAll(
            "[data-delete-outfit]"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.stopPropagation();


                        deleteOutfit(
                            button.dataset.deleteOutfit
                        );

                    }
                );

            }
        );

}


// =====================================================
// SHOW SAVED OUTFIT
// =====================================================

function showSavedOutfit(id) {

    const outfit =
        getOutfits().find(
            item =>
                item.id ===
                id
        );


    if (!outfit) {

        return;

    }


    $("wardrobePage")
        ?.classList
        .add(
            "hidden"
        );


    $("dynamicPage")
        ?.classList
        .remove(
            "hidden"
        );


    const dynamic =
        $("dynamicPage");


    dynamic.innerHTML = `

        <div
            class="dynamic-page-header"
        >

            <p
                class="hero-label"
            >
                SAVED OUTFIT
            </p>


            <h2>
                ${escapeHTML(
                    outfit.name
                )}
            </h2>


            <p>
                ${outfit.items.length}
                ${
                    outfit.items.length === 1
                        ? "piece"
                        : "pieces"
                }
            </p>

        </div>


        <div
            class="outfit-stage"
        >

            <div
                class="outfit-stage-title"
            >

                Your saved look

            </div>


            <div
                class="outfit-stage-layout"
            >

                <div></div>


                <div
                    class="outfit-stage-center"
                    id="savedCenter"
                ></div>


                <div
                    class="outfit-stage-accessories"
                    id="savedAccessories"
                ></div>

            </div>

        </div>


        <button
            class="delete-outfit"
            id="backToOutfits"
            type="button"
            style="
                margin-top:18px;
            "
        >

            ← Back to outfits

        </button>

    `;


    const center =
        $("savedCenter");


    const accessories =
        $("savedAccessories");


    const dress =
        outfit.items.find(
            item =>
                item.category ===
                "dress"
        );


    if (dress) {

        center.appendChild(
            makeOutfitPiece(
                dress
            )
        );

    } else {

        const top =
            outfit.items.find(
                item =>
                    item.category ===
                    "top"
            );


        const bottom =
            outfit.items.find(
                item =>
                    item.category ===
                    "bottom"
            );


        if (top) {

            center.appendChild(
                makeOutfitPiece(
                    top
                )
            );

        }


        if (bottom) {

            center.appendChild(
                makeOutfitPiece(
                    bottom
                )
            );

        }

    }


    const shoes =
        outfit.items.find(
            item =>
                item.category ===
                "shoes"
        );


    if (shoes) {

        center.appendChild(
            makeOutfitPiece(
                shoes
            )
        );

    }


    outfit.items
        .filter(
            item =>
                item.category ===
                "accessory"
        )
        .forEach(
            function(item) {

                accessories.appendChild(
                    makeOutfitPiece(
                        item
                    )
                );

            }
        );


    $("backToOutfits")
        ?.addEventListener(
            "click",
            showOutfits
        );

}


// =====================================================
// DELETE OUTFIT
// =====================================================

function deleteOutfit(id) {

    if (
        !confirm(
            "Are you sure you want to delete this outfit?"
        )
    ) {

        return;

    }


    const outfits =
        getOutfits();


    saveOutfits(

        outfits.filter(
            outfit =>
                outfit.id !==
                id
        )

    );


    renderSavedOutfits();

}


// =====================================================
// FAVORITES
// =====================================================

function showFavorites() {

    currentPage =
        "favorites";


    activateNav(
        $("favoritesNav")
    );


    $("wardrobePage")
        ?.classList
        .add(
            "hidden"
        );


    $("dynamicPage")
        ?.classList
        .remove(
            "hidden"
        );


    const dynamic =
        $("dynamicPage");


    const favorites =
        getWardrobe().filter(
            item =>
                item.favorite
        );


    dynamic.innerHTML = `

        <div
            class="dynamic-page-header"
        >

            <p
                class="hero-label"
            >
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
        $("favoritesGrid");


    if (!favorites.length) {

        grid.innerHTML = `

            <div
                class="empty-state"
            >

                <div
                    style="
                        font-size:50px;
                    "
                >
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
                createClothingCard(
                    item
                )
            );

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
        $("settingsNav")
    );


    $("wardrobePage")
        ?.classList
        .add(
            "hidden"
        );


    $("dynamicPage")
        ?.classList
        .remove(
            "hidden"
        );


    const wardrobe =
        getWardrobe();


    const outfits =
        getOutfits();


    $("dynamicPage").innerHTML = `

        <div
            class="dynamic-page-header"
        >

            <p
                class="hero-label"
            >
                APP SETTINGS
            </p>


            <h2>
                Settings
            </h2>


            <p>
                Manage your manual wardrobe.
            </p>

        </div>


        <div
            class="settings-card"
        >

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


        <div
            class="settings-card"
        >

            <h3>
                AI Stylist
            </h3>


            <p>

                Luna is currently switched off.
                We'll add her later after the
                manual wardrobe and phone version
                are ready.

            </p>

        </div>


        <div
            class="settings-card"
        >

            <h3>
                Reset wardrobe
            </h3>


            <button
                class="danger-button"
                id="clearDataButton"
                type="button"
            >

                Delete all data

            </button>

        </div>

    `;


    $("clearDataButton")
        ?.addEventListener(
            "click",
            function() {

                if (
                    !confirm(
                        "Are you sure? This cannot be undone."
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


                showWardrobe();

            }
        );

}


// =====================================================
// TEMPORARY MODALS
// =====================================================

function removeTemporaryModals() {

    document
        .querySelectorAll(
            ".photo-modal, .edit-modal, .delete-modal"
        )
        .forEach(
            modal =>
                modal.remove()
        );

}