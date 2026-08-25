/* =========================================================
   CLOSET AI — MANUAL VERSION
   =========================================================
   Features:
   - Wardrobe
   - Add clothing
   - Colour dropdown
   - Optional fabric
   - Clothing type tags
   - Photo upload
   - Edit item
   - Delete confirmation
   - Favorites
   - Saved outfits
   - Outfit filters
   - Create outfit
   - Category / Fabric / Colour filters
   - Outfit carousels
   - Multiple accessories
   - Outfit preview
   - Delete outfit from opened outfit
   - No Luna / no AI backend
========================================================= */


/* =========================================================
   01. STORAGE
========================================================= */

const WARDROBE_KEY = "closetAI_wardrobe_v2";
const OUTFITS_KEY = "closetAI_outfits_v2";


/* =========================================================
   02. APP STATE
========================================================= */

let selectedImage = "";
let selectedTypes = [];

let currentPage = "wardrobe";
let currentFilter = "all";

let selectedOutfitItems = [];


/* =========================================================
   03. HELPER
========================================================= */

function $(id) {
    return document.getElementById(id);
}


function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value || "";

    return div.innerHTML;
}


/* =========================================================
   04. STORAGE
========================================================= */

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


/* =========================================================
   05. OPTIONS
========================================================= */

const COLOR_OPTIONS = [

    ["black", "Black"],
    ["white", "White"],
    ["beige", "Beige"],
    ["cream", "Cream"],
    ["brown", "Brown"],
    ["blue", "Blue"],
    ["navy", "Navy"],
    ["light-blue", "Light blue"],
    ["red", "Red"],
    ["pink", "Pink"],
    ["green", "Green"],
    ["grey", "Grey"],
    ["yellow", "Yellow"],
    ["orange", "Orange"],
    ["purple", "Purple"],
    ["gold", "Gold"],
    ["silver", "Silver"],
    ["multicolour", "Multicolour"]

];


const FABRIC_OPTIONS = [

    ["denim", "Denim"],
    ["cotton", "Cotton"],
    ["wool", "Wool"],
    ["knit", "Knit"],
    ["satin", "Satin"],
    ["leather", "Leather"],
    ["other", "Other"]

];


const TYPE_OPTIONS = [

    ["basic", "Basic"],
    ["everyday", "Everyday"],
    ["fine", "Fine"],
    ["summer", "Summer"],
    ["winter", "Winter"],
    ["beach", "Beach"],
    ["going-out", "Going out"],
    ["work", "Work"],
    ["cozy", "Cozy"],
    ["sport", "Sport"],
    ["statement", "Statement"]

];


/* =========================================================
   06. LABEL HELPERS
========================================================= */

function colorLabel(value) {

    const match =
        COLOR_OPTIONS.find(
            option => option[0] === value
        );

    return match
        ? match[1]
        : value || "";
}


function fabricLabel(value) {

    const match =
        FABRIC_OPTIONS.find(
            option => option[0] === value
        );

    return match
        ? match[1]
        : value || "";
}


function typeLabel(value) {

    const match =
        TYPE_OPTIONS.find(
            option => option[0] === value
        );

    return match
        ? match[1]
        : value || "";
}


function categoryLabel(value) {

    const labels = {

        top: "Top",
        bottom: "Bottom",
        dress: "Dress",
        shoes: "Shoes",
        accessory: "Accessory"

    };

    return labels[value] || value || "";
}


function categoryEmoji(value) {

    const icons = {

        top: "👚",
        bottom: "👖",
        dress: "👗",
        shoes: "👟",
        accessory: "👜"

    };

    return icons[value] || "👗";
}


/* =========================================================
   07. APP INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initApp
);


function initApp() {

    /* Navigation */

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


    /* Main buttons */

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
        () => {

            alert(
                "Profile settings can be added later ✨"
            );

        }
    );


    /* Add item */

    $("closeModal")?.addEventListener(
        "click",
        closeAddModal
    );


    $("addItemModal")?.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("addItemModal")
            ) {

                closeAddModal();

            }

        }
    );


    $("clothingImage")?.addEventListener(
        "change",
        handleImageUpload
    );


    $("saveItem")?.addEventListener(
        "click",
        saveClothing
    );


    /* Type buttons */

    connectTypeButtons();


    /* Wardrobe filters */

    setupWardrobeFilters();


    /* Start */

    showWardrobe();


    console.log(
        "✨ Closet AI manual version loaded."
    );
}


/* =========================================================
   08. PAGE NAVIGATION
========================================================= */

function hidePages() {

    $("wardrobePage")
        ?.classList
        .add("hidden");


    $("dynamicPage")
        ?.classList
        .add("hidden");
}


function activateNav(activeButton) {

    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            button =>
                button.classList.remove(
                    "active"
                )
        );


    activeButton?.classList.add(
        "active"
    );
}


function showWardrobe() {

    currentPage =
        "wardrobe";


    activateNav(
        $("wardrobeNav")
    );


    hidePages();


    $("wardrobePage")
        ?.classList
        .remove("hidden");


    renderWardrobe();
}


function showOutfits() {

    currentPage =
        "outfits";


    activateNav(
        $("outfitsNav")
    );


    hidePages();


    $("dynamicPage")
        ?.classList
        .remove("hidden");


    renderOutfitsPage();
}


function showOutfitBuilder() {

    currentPage =
        "outfit-builder";


    selectedOutfitItems =
        [];


    hidePages();


    $("dynamicPage")
        ?.classList
        .remove("hidden");


    renderCreateOutfitPage();
}


function showFavorites() {

    currentPage =
        "favorites";


    activateNav(
        $("favoritesNav")
    );


    hidePages();


    $("dynamicPage")
        ?.classList
        .remove("hidden");


    renderFavoritesPage();
}


function showSettings() {

    currentPage =
        "settings";


    activateNav(
        $("settingsNav")
    );


    hidePages();


    $("dynamicPage")
        ?.classList
        .remove("hidden");


    renderSettingsPage();
}


/* =========================================================
   09. ADD ITEM MODAL
========================================================= */

function openAddModal() {

    resetAddForm();


    $("addItemModal")
        ?.classList
        .add("active");
}


function closeAddModal() {

    $("addItemModal")
        ?.classList
        .remove("active");
}


function resetAddForm() {

    selectedImage =
        "";

    selectedTypes =
        [];


    if ($("clothingCategory")) {

        $("clothingCategory").value =
            "";

    }


    if ($("clothingColor")) {

        $("clothingColor").value =
            "";

    }


    if ($("clothingFabric")) {

        $("clothingFabric").value =
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
            "#typePicker .type-option"
        )
        .forEach(
            button =>
                button.classList.remove(
                    "selected"
                )
        );
}


function connectTypeButtons() {

    document
        .querySelectorAll(
            "#typePicker .type-option"
        )
        .forEach(
            button => {

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
                    () => {

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


/* =========================================================
   10. IMAGE UPLOAD
========================================================= */

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


        if ($("imagePreview")) {

            $("imagePreview").src =
                selectedImage;

            $("imagePreview").style.display =
                "block";
        }


        if ($("uploadPlaceholder")) {

            $("uploadPlaceholder").style.display =
                "none";
        }

    } catch (error) {

        console.error(
            "Image upload error:",
            error
        );


        alert(
            "The photo could not be loaded."
        );
    }
}


function resizeImage(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                event => {

                    const image =
                        new Image();


                    image.onload =
                        () => {

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
                                Math.round(width);

                            canvas.height =
                                Math.round(height);


                            canvas
                                .getContext("2d")
                                .drawImage(
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


/* =========================================================
   11. SAVE CLOTHING
========================================================= */

function saveClothing() {

    const category =
        $("clothingCategory")
            ?.value ||
        "";


    if (!category) {

        alert(
            "Please choose a category."
        );

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

        category,

        color:
            $("clothingColor")
                ?.value ||
            "",

        fabric:
            $("clothingFabric")
                ?.value ||
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


/* =========================================================
   12. WARDROBE FILTERS
========================================================= */

function setupWardrobeFilters() {

    document
        .querySelectorAll(
            "#wardrobePage .filter"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                "#wardrobePage .filter"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "active"
                                    )
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


function renderWardrobe() {

    const grid =
        $("clothingGrid");


    if (!grid) {

        return;
    }


    const wardrobe =
        getWardrobe();


    const items =
        wardrobe.filter(
            item =>
                currentFilter ===
                "all" ||
                item.category ===
                currentFilter
        );


    if ($("itemCount")) {

        $("itemCount").textContent =
            `${wardrobe.length} ${
                wardrobe.length === 1
                    ? "item"
                    : "items"
            } in your closet`;
    }


    grid.innerHTML =
        "";


    if (!items.length) {

        grid.innerHTML = `

            <div
                class="empty-state"
            >

                <div
                    style="font-size:45px;"
                >
                    👗
                </div>


                <h3>
                    No items here
                </h3>


                <p>
                    Add something to your wardrobe.
                </p>

            </div>

        `;


        return;
    }


    items.forEach(
        item =>
            grid.appendChild(
                createClothingCard(
                    item
                )
            )
    );
}


/* =========================================================
   13. CLOTHING CARD
========================================================= */

function createClothingCard(item) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "clothing-card";


    const imageHTML =
        item.image

            ?

            `
            <img
                src="${item.image}"
                alt="${escapeHTML(
                    categoryLabel(
                        item.category
                    )
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


    const details = [];


    if (item.color) {

        details.push(
            colorLabel(
                item.color
            )
        );
    }


    if (item.fabric) {

        details.push(
            fabricLabel(
                item.fabric
            )
        );
    }


    const tags =
        (item.types || [])
            .map(
                type => `
                    <span
                        class="item-tag"
                    >
                        ${escapeHTML(
                            typeLabel(type)
                        )}
                    </span>
                `
            )
            .join("");


    card.innerHTML = `

        <div
            class="clothing-image"
        >

            ${imageHTML}


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
                        categoryLabel(
                            item.category
                        )
                    ).toUpperCase()}

                </h3>


                <p>

                    ${
                        details.length
                            ? escapeHTML(
                                details.join(
                                    " · "
                                )
                            )
                            : "No details selected"
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


    card
        .querySelector(
            ".clothing-image"
        )
        ?.addEventListener(
            "click",
            event => {

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


    card
        .querySelector(
            '[data-action="favorite"]'
        )
        ?.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                toggleFavorite(
                    item.id
                );
            }
        );


    card
        .querySelector(
            '[data-action="edit"]'
        )
        ?.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                openEditModal(
                    item
                );
            }
        );


    return card;
}


/* =========================================================
   14. PHOTO MODAL
========================================================= */

function openPhotoModal(item) {

    removeTemporaryModals();


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "photo-modal active";


    const details = [];


    if (item.color) {

        details.push(
            colorLabel(
                item.color
            )
        );
    }


    if (item.fabric) {

        details.push(
            fabricLabel(
                item.fabric
            )
        );
    }


    modal.innerHTML = `

        <div
            class="photo-modal-content"
        >

            <button
                class="close-modal"
                id="closePhotoViewer"
                type="button"
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
                            categoryLabel(
                                item.category
                            )
                        )}"
                    >
                    `

                    :

                    `
                    <div
                        class="placeholder"
                        style="
                            height:400px;
                            background:#f2eeea;
                        "
                    >

                        ${categoryEmoji(
                            item.category
                        )}

                    </div>
                    `
            }


            <h2
                style="margin-top:18px;"
            >

                ${escapeHTML(
                    categoryLabel(
                        item.category
                    )
                ).toUpperCase()}

            </h2>


            <p
                style="
                    margin-top:7px;
                    color:#8d857e;
                "
            >

                ${
                    details.length
                        ? escapeHTML(
                            details.join(
                                " · "
                            )
                        )
                        : "No details selected"
                }

            </p>


            <div
                class="item-tags"
            >

                ${
                    (item.types || [])
                        .map(
                            type => `
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
        ?.addEventListener(
            "click",
            () => modal.remove()
        );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modal
            ) {

                modal.remove();
            }
        }
    );
}


/* =========================================================
   15. EDIT ITEM
========================================================= */

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
                id="closeEditModal"
                type="button"
            >

                ×

            </button>


            <h2>
                Edit clothing
            </h2>


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

                <select
                    id="editItemColor"
                >

                    <option value="">
                        Choose colour
                    </option>

                    ${
                        COLOR_OPTIONS
                            .map(
                                option => `
                                    <option
                                        value="${option[0]}"
                                    >
                                        ${option[1]}
                                    </option>
                                `
                            )
                            .join("")
                    }

                </select>

            </label>


            <label
                class="input-label"
            >

                Fabric

                <select
                    id="editItemFabric"
                >

                    <option value="">
                        No fabric selected
                    </option>

                    ${
                        FABRIC_OPTIONS
                            .map(
                                option => `
                                    <option
                                        value="${option[0]}"
                                    >
                                        ${option[1]}
                                    </option>
                                `
                            )
                            .join("")
                    }

                </select>

            </label>


            <div
                class="input-label"
            >

                Clothing type

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


    $("editItemCategory").value =
        item.category;


    $("editItemColor").value =
        item.color || "";


    $("editItemFabric").value =
        item.fabric || "";


    TYPE_OPTIONS.forEach(
        ([value, label]) => {

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
                () => {

                    button.classList.toggle(
                        "selected"
                    );
                }
            );


            $("editTypePicker")
                ?.appendChild(
                    button
                );
        }
    );


    $("closeEditModal")
        ?.addEventListener(
            "click",
            () => modal.remove()
        );


    $("saveEditButton")
        ?.addEventListener(
            "click",
            () => {

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


                existing.category =
                    $("editItemCategory")
                        .value;


                existing.color =
                    $("editItemColor")
                        .value;


                existing.fabric =
                    $("editItemFabric")
                        .value;


                existing.types =
                    [
                        ...$(
                            "editTypePicker"
                        )
                            .querySelectorAll(
                                ".type-option.selected"
                            )
                    ]
                        .map(
                            button =>
                                button.dataset.type
                        );


                saveWardrobe(
                    wardrobe
                );


                modal.remove();


                renderWardrobe();
            }
        );


    $("deleteEditButton")
        ?.addEventListener(
            "click",
            () => {

                modal.remove();

                confirmDeleteItem(
                    item.id
                );
            }
        );
}


/* =========================================================
   16. DELETE ITEM
========================================================= */

function confirmDeleteItem(id) {

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
                    color:#8d857e;
                    line-height:1.5;
                "
            >

                Are you sure you want to
                delete this item?

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
        ?.addEventListener(
            "click",
            () => modal.remove()
        );


    $("confirmDelete")
        ?.addEventListener(
            "click",
            () => {

                saveWardrobe(

                    getWardrobe().filter(
                        item =>
                            item.id !== id
                    )

                );


                modal.remove();


                renderWardrobe();
            }
        );
}


/* =========================================================
   17. FAVORITES
========================================================= */

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

        renderFavoritesPage();

    } else {

        renderWardrobe();
    }
}


/* =========================================================
   18. OUTFITS PAGE
========================================================= */

function renderOutfitsPage() {

    const dynamic =
        $("dynamicPage");


    if (!dynamic) {

        return;
    }


    dynamic.innerHTML = `

        <div
            class="outfits-header"
        >

            <h2>
                Outfits
            </h2>


            <button
                class="style-button"
                id="createOutfitButton"
                type="button"
            >

                + Create outfit

            </button>

        </div>


        <div
            class="outfit-filter-panel"
        >

            <label
                class="outfit-filter-field"
            >

                <span>
                    Fabric
                </span>


                <select
                    id="savedOutfitFabricFilter"
                >

                    <option value="all">
                        All fabrics
                    </option>

                    ${
                        FABRIC_OPTIONS
                            .map(
                                option => `
                                    <option
                                        value="${option[0]}"
                                    >
                                        ${option[1]}
                                    </option>
                                `
                            )
                            .join("")
                    }

                </select>

            </label>


            <label
                class="outfit-filter-field"
            >

                <span>
                    Colour
                </span>


                <select
                    id="savedOutfitColorFilter"
                >

                    <option value="all">
                        All colours
                    </option>

                    ${
                        COLOR_OPTIONS
                            .map(
                                option => `
                                    <option
                                        value="${option[0]}"
                                    >
                                        ${option[1]}
                                    </option>
                                `
                            )
                            .join("")
                    }

                </select>

            </label>


            <label
                class="outfit-filter-field"
            >

                <span>
                    Category
                </span>


                <select
                    id="savedOutfitCategoryFilter"
                >

                    <option value="all">
                        All categories
                    </option>

                    <option value="top">
                        Contains a top
                    </option>

                    <option value="bottom">
                        Contains bottoms
                    </option>

                    <option value="dress">
                        Contains a dress
                    </option>

                    <option value="shoes">
                        Contains shoes
                    </option>

                    <option value="accessory">
                        Contains accessories
                    </option>

                </select>

            </label>

        </div>


        <div
            id="savedOutfits"
        ></div>
    `;


    $("createOutfitButton")
        ?.addEventListener(
            "click",
            showOutfitBuilder
        );


    $("savedOutfitFabricFilter")
        ?.addEventListener(
            "change",
            renderSavedOutfits
        );


    $("savedOutfitColorFilter")
        ?.addEventListener(
            "change",
            renderSavedOutfits
        );


    $("savedOutfitCategoryFilter")
        ?.addEventListener(
            "change",
            renderSavedOutfits
        );


    renderSavedOutfits();
}


function savedOutfitMatchesFilters(
    outfit
) {

    const fabric =
        $("savedOutfitFabricFilter")
            ?.value ||
        "all";


    const color =
        $("savedOutfitColorFilter")
            ?.value ||
        "all";


    const category =
        $("savedOutfitCategoryFilter")
            ?.value ||
        "all";


    if (
        fabric !== "all" &&
        !outfit.items.some(
            item =>
                item.fabric ===
                fabric
        )
    ) {

        return false;
    }


    if (
        color !== "all" &&
        !outfit.items.some(
            item =>
                item.color ===
                color
        )
    ) {

        return false;
    }


    if (
        category !== "all" &&
        !outfit.items.some(
            item =>
                item.category ===
                category
        )
    ) {

        return false;
    }


    return true;
}


function renderSavedOutfits() {

    const container =
        $("savedOutfits");


    if (!container) {

        return;
    }


    const outfits =
        getOutfits()
            .filter(
                savedOutfitMatchesFilters
            );


    container.innerHTML =
        "";


    if (!outfits.length) {

        container.innerHTML = `

            <div
                class="empty-state"
            >

                <div
                    style="font-size:42px;"
                >
                    ✨
                </div>


                <h3>
                    No outfits found
                </h3>


                <p>
                    Try another filter or
                    create a new outfit.
                </p>

            </div>
        `;


        return;
    }


    outfits.forEach(
        outfit => {

            container.appendChild(
                createSavedOutfitCard(
                    outfit
                )
            );

        }
    );
}


/* =========================================================
   19. SAVED OUTFIT CARD
   ---------------------------------------------------------
   Delete button is intentionally NOT shown here.
   The card opens the outfit instead.
========================================================= */

function createSavedOutfitCard(
    outfit
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "saved-outfit-card";


    const imageItems =
        outfit.items
            .filter(
                item =>
                    item.image
            )
            .slice(
                0,
                4
            );


    const imageHTML =
        imageItems.length

            ?

            imageItems
                .map(
                    item => `

                        <img
                            src="${item.image}"
                            alt="${escapeHTML(
                                categoryLabel(
                                    item.category
                                )
                            )}"
                        >

                    `
                )
                .join("")

            :

            `
                <div
                    style="
                        width:100%;
                        height:100%;
                        grid-column:1/-1;
                        grid-row:1/-1;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:40px;
                    "
                >

                    ✨

                </div>
            `;


    card.innerHTML = `

        <div
            class="saved-outfit-thumb-row"
        >

            ${imageHTML}

        </div>


        <h3>

            ${escapeHTML(
                outfit.name
            )}

        </h3>

    `;


    card.addEventListener(
        "click",
        () => {

            showSavedOutfit(
                outfit.id
            );

        }
    );


    return card;
}


/* =========================================================
   20. CREATE OUTFIT PAGE
========================================================= */

function renderCreateOutfitPage() {

    const dynamic =
        $("dynamicPage");


    if (!dynamic) {

        return;
    }


    dynamic.innerHTML = `

        <div
            class="outfits-header"
        >

            <h2>
                Create outfit
            </h2>


            <button
                class="secondary-button"
                id="backToOutfitsButton"
                type="button"
            >

                ← Back

            </button>

        </div>


        <div
            class="outfit-filter-panel"
        >

            <label
                class="outfit-filter-field"
            >

                <span>
                    Category
                </span>


                <select
                    id="builderCategoryFilter"
                >

                    <option value="all">
                        All categories
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

            </label>


            <label
                class="outfit-filter-field"
            >

                <span>
                    Fabric
                </span>


                <select
                    id="builderFabricFilter"
                >

                    <option value="all">
                        All fabrics
                    </option>

                    ${
                        FABRIC_OPTIONS
                            .map(
                                option => `

                                    <option
                                        value="${option[0]}"
                                    >

                                        ${option[1]}

                                    </option>

                                `
                            )
                            .join("")
                    }

                </select>

            </label>


            <label
                class="outfit-filter-field"
            >

                <span>
                    Colour
                </span>


                <select
                    id="builderColorFilter"
                >

                    <option value="all">
                        All colours
                    </option>

                    ${
                        COLOR_OPTIONS
                            .map(
                                option => `

                                    <option
                                        value="${option[0]}"
                                    >

                                        ${option[1]}

                                    </option>

                                `
                            )
                            .join("")
                    }

                </select>

            </label>

        </div>


        <div
            id="outfitCategories"
            class="outfit-categories"
        ></div>


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
                    id="outfitStageCenter"
                    class="outfit-stage-center"
                ></div>


                <div
                    id="outfitStageAccessories"
                    class="outfit-stage-accessories"
                ></div>

            </div>

        </div>


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


        <button
            class="save-item"
            id="saveOutfitButton"
            type="button"
            style="margin-top:20px;"
        >

            Save outfit

        </button>
    `;


    $("backToOutfitsButton")
        ?.addEventListener(
            "click",
            showOutfits
        );


    $("builderCategoryFilter")
        ?.addEventListener(
            "change",
            renderOutfitRows
        );


    $("builderFabricFilter")
        ?.addEventListener(
            "change",
            renderOutfitRows
        );


    $("builderColorFilter")
        ?.addEventListener(
            "change",
            renderOutfitRows
        );


    $("saveOutfitButton")
        ?.addEventListener(
            "click",
            saveCurrentOutfit
        );


    renderOutfitRows();

    updateOutfitPreview();
}


function builderItemMatches(
    item
) {

    const category =
        $("builderCategoryFilter")
            ?.value ||
        "all";


    const fabric =
        $("builderFabricFilter")
            ?.value ||
        "all";


    const color =
        $("builderColorFilter")
            ?.value ||
        "all";


    if (
        category !== "all" &&
        item.category !== category
    ) {

        return false;
    }


    if (
        fabric !== "all" &&
        item.fabric !== fabric
    ) {

        return false;
    }


    if (
        color !== "all" &&
        item.color !== color
    ) {

        return false;
    }


    return true;
}


/* =========================================================
   21. OUTFIT CLOTHING ROWS
========================================================= */

function renderOutfitRows() {

    const container =
        $("outfitCategories");


    if (!container) {

        return;
    }


    const wardrobe =
        getWardrobe()
            .filter(
                builderItemMatches
            );


    container.innerHTML =
        "";


    const sections = [

        {
            key: "top",
            name: "Tops",
            multiple: false
        },

        {
            key: "bottom",
            name: "Bottoms",
            multiple: false
        },

        {
            key: "dress",
            name: "Dresses",
            multiple: false
        },

        {
            key: "shoes",
            name: "Shoes",
            multiple: false
        },

        {
            key: "accessory",
            name: "Accessories",
            multiple: true
        }

    ];


    sections.forEach(
        sectionData => {

            const items =
                wardrobe.filter(
                    item =>
                        item.category ===
                        sectionData.key
                );


            if (!items.length) {

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
                        ${sectionData.name}
                    </h3>


                    <span>

                        ${
                            sectionData.multiple
                                ? "Choose multiple"
                                : "Choose one"
                        }

                    </span>

                </div>


                <div
                    class="outfit-carousel"
                >

                    <button
                        class="
                            outfit-carousel-button
                            outfit-prev
                        "
                        type="button"
                    >

                        ‹

                    </button>


                    <div
                        class="swipe-row"
                    ></div>


                    <button
                        class="
                            outfit-carousel-button
                            outfit-next
                        "
                        type="button"
                    >

                        ›

                    </button>

                </div>
            `;


            const row =
                section.querySelector(
                    ".swipe-row"
                );


            items.forEach(
                item => {

                    row.appendChild(
                        createOutfitItem(
                            item
                        )
                    );
                }
            );


            const previous =
                section.querySelector(
                    ".outfit-prev"
                );


            const next =
                section.querySelector(
                    ".outfit-next"
                );


            container.appendChild(
                section
            );


            setupCarousel(
                row,
                previous,
                next
            );
        }
    );


    selectedOutfitItems.forEach(
        selected => {

            container
                .querySelector(
                    `.outfit-item[data-id="${selected.id}"]`
                )
                ?.classList.add(
                    "selected"
                );
        }
    );


    if (!wardrobe.length) {

        container.innerHTML = `

            <div
                class="empty-state"
            >

                <div
                    style="font-size:42px;"
                >
                    🔎
                </div>


                <h3>
                    No clothing matches
                </h3>


                <p>
                    Try another category,
                    fabric or colour.
                </p>

            </div>
        `;
    }
}


function createOutfitItem(
    item
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "outfit-item";


    card.dataset.id =
        item.id;


    const imageHTML =
        item.image

            ?

            `
            <img
                src="${item.image}"
                alt="${escapeHTML(
                    categoryLabel(
                        item.category
                    )
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


    const details = [];


    if (item.color) {

        details.push(
            colorLabel(
                item.color
            )
        );
    }


    if (item.fabric) {

        details.push(
            fabricLabel(
                item.fabric
            )
        );
    }


    card.innerHTML = `

        <div
            class="outfit-item-image"
        >

            ${imageHTML}

        </div>


        <div
            class="outfit-item-info"
        >

            <strong>

                ${escapeHTML(
                    categoryLabel(
                        item.category
                    )
                ).toUpperCase()}

            </strong>


            <span>

                ${
                    details.length
                        ? escapeHTML(
                            details.join(
                                " · "
                            )
                        )
                        : ""
                }

            </span>

        </div>
    `;


    card.addEventListener(
        "click",
        () => {

            selectOutfitItem(
                card,
                item
            );
        }
    );


    return card;
}


/* =========================================================
   22. OUTFIT CAROUSEL
========================================================= */

function setupCarousel(
    row,
    previous,
    next
) {

    function updateButtons() {

        const max =
            row.scrollWidth -
            row.clientWidth;


        previous.disabled =
            row.scrollLeft <= 5;


        next.disabled =
            row.scrollLeft >=
            max - 5;
    }


    previous.addEventListener(
        "click",
        () => {

            row.scrollBy({

                left:
                    -(row.clientWidth * 0.8),

                behavior:
                    "smooth"
            });
        }
    );


    next.addEventListener(
        "click",
        () => {

            row.scrollBy({

                left:
                    row.clientWidth * 0.8,

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


/* =========================================================
   23. SELECT OUTFIT ITEMS
========================================================= */

function selectOutfitItem(
    card,
    item
) {

    const alreadySelected =
        selectedOutfitItems.some(
            current =>
                current.id ===
                item.id
        );


    if (alreadySelected) {

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


    /* Dress replaces top and bottom */

    if (
        item.category ===
        "dress"
    ) {

        selectedOutfitItems =
            selectedOutfitItems.filter(
                current =>
                    current.category !== "dress" &&
                    current.category !== "top" &&
                    current.category !== "bottom"
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


    /* Top / bottom replaces itself */

    if (
        item.category === "top" ||
        item.category === "bottom"
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


    /* Only one pair of shoes */

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
                element => {

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
            );
    }


    /* Accessories can be multiple */

    selectedOutfitItems.push(
        item
    );


    card.classList.add(
        "selected"
    );


    updateOutfitPreview();
}


/* =========================================================
   24. OUTFIT PREVIEW
========================================================= */

function updateOutfitPreview() {

    const center =
        $("outfitStageCenter");


    const accessories =
        $("outfitStageAccessories");


    const left =
        $("outfitStageLeft");


    if (
        !center ||
        !accessories ||
        !left
    ) {

        return;
    }


    center.innerHTML =
        "";


    accessories.innerHTML =
        "";


    left.innerHTML =
        "";


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
                ? makeOutfitPiece(top)
                : makeEmptyPiece(
                    "Choose a top"
                )
        );


        center.appendChild(

            bottom
                ? makeOutfitPiece(bottom)
                : makeEmptyPiece(
                    "Choose a bottom"
                )
        );
    }


    const shoes =
        selectedOutfitItems.find(
            item =>
                item.category ===
                "shoes"
        );


    center.appendChild(

        shoes
            ? makeOutfitPiece(
                shoes
            )
            : makeEmptyPiece(
                "Choose shoes"
            )
    );


    const accessoriesSelected =
        selectedOutfitItems.filter(
            item =>
                item.category ===
                "accessory"
        );


    if (
        !accessoriesSelected.length
    ) {

        accessories.appendChild(
            makeEmptyPiece(
                "Add accessories"
            )
        );

    } else {

        accessoriesSelected.forEach(
            item => {

                accessories.appendChild(
                    makeOutfitPiece(
                        item
                    )
                );
            }
        );
    }
}


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
                        categoryLabel(
                            item.category
                        )
                    )}"
                >
                `

                :

                `
                <div
                    class="placeholder"
                    style="
                        height:115px;
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
                categoryLabel(
                    item.category
                )
            ).toUpperCase()}

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


/* =========================================================
   25. SAVE OUTFIT
========================================================= */

function saveCurrentOutfit() {

    const name =
        $("outfitName")
            ?.value
            .trim();


    if (!name) {

        alert(
            "Please give your outfit a name."
        );


        $("outfitName")?.focus();


        return;
    }


    if (
        !selectedOutfitItems.length
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

        name,

        items:
            selectedOutfitItems.map(
                item => ({

                    id:
                        item.id,

                    category:
                        item.category,

                    color:
                        item.color ||
                        "",

                    fabric:
                        item.fabric ||
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


    showOutfits();
}


/* =========================================================
   26. OPEN SAVED OUTFIT
   ---------------------------------------------------------
   Delete button lives HERE,
   not on the outfit card.
========================================================= */

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


    const dynamic =
        $("dynamicPage");


    if (!dynamic) {

        return;
    }


    dynamic.innerHTML = `

        <div
            class="outfits-header"
        >

            <h2>

                ${escapeHTML(
                    outfit.name
                )}

            </h2>


            <button
                class="secondary-button"
                id="backFromSavedOutfit"
                type="button"
            >

                ← Back

            </button>

        </div>


        <div
            class="outfit-stage"
        >

            <div
                class="outfit-stage-layout"
            >

                <div></div>


                <div
                    class="outfit-stage-center"
                    id="savedOutfitCenter"
                ></div>


                <div
                    class="outfit-stage-accessories"
                    id="savedOutfitAccessories"
                ></div>

            </div>

        </div>


        <div
            class="saved-outfit-actions"
        >

            <button
                class="delete-item-button"
                id="deleteSavedOutfit"
                type="button"
            >

                Delete outfit

            </button>

        </div>
    `;


    const center =
        $("savedOutfitCenter");


    const accessories =
        $("savedOutfitAccessories");


    /* Dress */

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

        /* Top */

        const top =
            outfit.items.find(
                item =>
                    item.category ===
                    "top"
            );


        /* Bottom */

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


    /* Shoes */

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


    /* Accessories */

    outfit.items
        .filter(
            item =>
                item.category ===
                "accessory"
        )
        .forEach(
            item => {

                accessories.appendChild(
                    makeOutfitPiece(
                        item
                    )
                );
            }
        );


    /* Back */

    $("backFromSavedOutfit")
        ?.addEventListener(
            "click",
            showOutfits
        );


    /* Delete */

    $("deleteSavedOutfit")
        ?.addEventListener(
            "click",
            () => {

                if (
                    !confirm(
                        "Are you sure you want to delete this outfit?"
                    )
                ) {

                    return;
                }


                saveOutfits(

                    getOutfits().filter(
                        current =>
                            current.id !==
                            outfit.id
                    )

                );


                showOutfits();
            }
        );
}


/* =========================================================
   27. FAVORITES PAGE
========================================================= */

function renderFavoritesPage() {

    const dynamic =
        $("dynamicPage");


    if (!dynamic) {

        return;
    }


    dynamic.innerHTML = `

        <div
            class="outfits-header"
        >

            <h2>
                Favorites
            </h2>

        </div>


        <div
            class="clothing-grid"
            id="favoritesGrid"
        ></div>
    `;


    const grid =
        $("favoritesGrid");


    const favorites =
        getWardrobe()
            .filter(
                item =>
                    item.favorite
            );


    if (!favorites.length) {

        grid.innerHTML = `

            <div
                class="empty-state"
            >

                <div
                    style="font-size:44px;"
                >
                    ♡
                </div>


                <h3>
                    No favorites yet
                </h3>


                <p>
                    Tap the heart on a clothing item.
                </p>

            </div>
        `;


        return;
    }


    favorites.forEach(
        item => {

            grid.appendChild(
                createClothingCard(
                    item
                )
            );
        }
    );
}


/* =========================================================
   28. SETTINGS
========================================================= */

function renderSettingsPage() {

    const dynamic =
        $("dynamicPage");


    if (!dynamic) {

        return;
    }


    dynamic.innerHTML = `

        <div
            class="outfits-header"
        >

            <h2>
                Settings
            </h2>

        </div>


        <div
            class="settings-card"
        >

            <h3>
                Wardrobe
            </h3>


            <p>

                ${getWardrobe().length}
                clothing items.

                ${getOutfits().length}
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
            () => {

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


/* =========================================================
   29. CLEANUP
========================================================= */

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