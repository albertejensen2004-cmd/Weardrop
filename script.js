// =====================================================
// CLOSET AI
// SUPABASE CLOUD VERSION
// =====================================================

import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// =====================================================
// SUPABASE
// =====================================================

const SUPABASE_URL =
    "https://jppmfciofyhpxzcfcmz.supabase.co";

const SUPABASE_ANON_KEY =
    "PASTE_YOUR_ANON_KEY_HERE";

const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


// =====================================================
// SETTINGS
// =====================================================

const CLOTHING_TABLE = "clothing";
const IMAGE_BUCKET = "clothing-images";


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


// =====================================================
// STATE
// =====================================================

let selectedImageFile = null;
let selectedImagePreview = "";
let selectedTypes = [];

let currentFilter = "all";
let currentPage = "wardrobe";

let selectedOutfitItems = [];


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

    addItemModal.classList.remove("active");
}


if (addItemButton) {

    addItemButton.addEventListener(
        "click",
        openAddModal
    );

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeAddModal
    );

}


if (addItemModal) {

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

}


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
                                1200;

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


                            const context =
                                canvas.getContext(
                                    "2d"
                                );

                            context.drawImage(
                                image,
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );


                            canvas.toBlob(
                                function(blob) {

                                    if (!blob) {

                                        reject(
                                            new Error(
                                                "Could not resize image."
                                            )
                                        );

                                        return;

                                    }

                                    resolve(blob);

                                },
                                "image/jpeg",
                                0.82
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
// IMAGE SELECT
// =====================================================

if (clothingImage) {

    clothingImage.addEventListener(
        "change",
        async function(event) {

            const file =
                event.target.files?.[0];

            if (!file) {
                return;
            }


            try {

                selectedImageFile =
                    await resizeImage(file);


                selectedImagePreview =
                    URL.createObjectURL(
                        selectedImageFile
                    );


                if (imagePreview) {

                    imagePreview.src =
                        selectedImagePreview;

                    imagePreview.style.display =
                        "block";

                }


                if (uploadPlaceholder) {

                    uploadPlaceholder.style.display =
                        "none";

                }

            } catch (error) {

                console.error(
                    "Image error:",
                    error
                );

                alert(
                    "The photo could not be loaded."
                );

            }

        }
    );

}


// =====================================================
// UPLOAD IMAGE TO SUPABASE STORAGE
// =====================================================

async function uploadImage(file) {

    if (!file) {

        return null;

    }


    const fileName =
        `${crypto.randomUUID()}.jpg`;


    const filePath =
        `clothing/${fileName}`;


    const {
        data,
        error
    } =
        await supabase.storage
            .from(IMAGE_BUCKET)
            .upload(
                filePath,
                file,
                {
                    contentType:
                        "image/jpeg",

                    upsert:
                        false
                }
            );


    if (error) {

        console.error(
            "Storage upload error:",
            error
        );

        throw error;

    }


    const {
        data: publicData
    } =
        supabase.storage
            .from(IMAGE_BUCKET)
            .getPublicUrl(
                data.path
            );


    return publicData.publicUrl;

}


// =====================================================
// DELETE IMAGE FROM STORAGE
// =====================================================

async function deleteImage(imageUrl) {

    if (!imageUrl) {
        return;
    }


    try {

        const marker =
            `/storage/v1/object/public/${IMAGE_BUCKET}/`;

        const index =
            imageUrl.indexOf(marker);


        if (index === -1) {
            return;
        }


        const path =
            imageUrl.substring(
                index +
                marker.length
            );


        await supabase.storage
            .from(IMAGE_BUCKET)
            .remove([
                path
            ]);

    } catch (error) {

        console.error(
            "Could not delete image:",
            error
        );

    }

}


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
// LOAD WARDROBE FROM SUPABASE
// =====================================================

async function getWardrobe() {

    const {
        data,
        error
    } =
        await supabase
            .from(CLOTHING_TABLE)
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Could not load wardrobe:",
            error
        );

        throw error;

    }


    return data || [];

}


// =====================================================
// SAVE CLOTHING
// =====================================================

if (saveItemButton) {

    saveItemButton.addEventListener(
        "click",
        saveClothing
    );

}


async function saveClothing() {

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


    if (!category) {

        alert(
            "Please choose a category."
        );

        return;

    }


    saveItemButton.disabled =
        true;

    saveItemButton.textContent =
        "Saving...";


    try {

        let imageUrl =
            null;


        // Upload image first

        if (selectedImageFile) {

            imageUrl =
                await uploadImage(
                    selectedImageFile
                );

        }


        // Insert clothing record

        const {
            data,
            error
        } =
            await supabase
                .from(CLOTHING_TABLE)
                .insert({
                    name:
                        name,

                    category:
                        category,

                    color:
                        document.getElementById(
                            "clothingColor"
                        )?.value ||
                        null,

                    fabric:
                        document.getElementById(
                            "clothingFabric"
                        )?.value ||
                        null,

                    types:
                        selectedTypes,

                    image_url:
                        imageUrl,

                    favorite:
                        false,

                    wear_count:
                        0,

                    last_worn:
                        null
                })
                .select()
                .single();


        if (error) {

            console.error(
                "Database error:",
                error
            );

            // Remove uploaded image if DB failed

            if (imageUrl) {

                await deleteImage(
                    imageUrl
                );

            }

            throw error;

        }


        console.log(
            "Clothing saved:",
            data
        );


        closeAddModal();

        await renderWardrobe();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "Could not save the clothing item.\n\n" +
            error.message
        );

    } finally {

        saveItemButton.disabled =
            false;

        saveItemButton.textContent =
            "Add to wardrobe";

    }

}


// =====================================================
// RESET FORM
// =====================================================

function resetForm() {

    selectedImageFile =
        null;

    selectedImagePreview =
        "";

    selectedTypes =
        [];


    if (clothingName) {

        clothingName.value =
            "";

    }


    if (clothingCategory) {

        clothingCategory.value =
            "top";

    }


    const color =
        document.getElementById(
            "clothingColor"
        );

    if (color) {

        color.value =
            "";

    }


    const fabric =
        document.getElementById(
            "clothingFabric"
        );

    if (fabric) {

        fabric.value =
            "";

    }


    if (clothingImage) {

        clothingImage.value =
            "";

    }


    if (imagePreview) {

        imagePreview.src =
            "";

        imagePreview.style.display =
            "none";

    }


    if (uploadPlaceholder) {

        uploadPlaceholder.style.display =
            "flex";

    }


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
// CATEGORY EMOJI
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

async function renderWardrobe() {

    if (!clothingGrid) {
        return;
    }


    clothingGrid.innerHTML = `
        <div class="empty-state">
            <div style="font-size:45px;">
                ⏳
            </div>
            <p>Loading your wardrobe...</p>
        </div>
    `;


    try {

        const wardrobe =
            await getWardrobe();


        clothingGrid.innerHTML =
            "";


        if (itemCount) {

            itemCount.textContent =
                `${wardrobe.length} ${
                    wardrobe.length === 1
                        ? "item"
                        : "items"
                } in your closet`;

        }


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
                        ${
                            wardrobe.length
                                ? "🔎"
                                : "👗"
                        }
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
                    createClothingCard(
                        item
                    )
                );

            }
        );


        attachCardButtons();


    } catch (error) {

        console.error(
            error
        );


        clothingGrid.innerHTML = `
            <div class="empty-state">
                <div style="font-size:45px;">
                    ⚠️
                </div>

                <h3>
                    Could not load wardrobe
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>
            </div>
        `;

    }

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


    const imageUrl =
        item.image_url ||
        item.image ||
        "";


    const image =
        imageUrl

            ?

            `<img
                src="${escapeHTML(imageUrl)}"
                alt="${escapeHTML(item.name)}"
                loading="lazy"
            >`

            :

            `<div class="placeholder">
                ${categoryEmoji(
                    item.category
                )}
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


    const wearCount =
        Number(
            item.wear_count || 0
        );


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
                    ${escapeHTML(
                        item.name
                    )}
                </h3>

                <p>
                    ${categoryLabel(
                        item.category
                    )}
                </p>

                <div class="item-tags">
                    ${tags}
                </div>

                <small
                    style="
                        display:block;
                        margin-top:8px;
                        opacity:.65;
                    "
                >
                    Worn ${wearCount} ${
                        wearCount === 1
                            ? "time"
                            : "times"
                    }
                </small>

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
                    async function(event) {

                        event.stopPropagation();


                        const card =
                            button.closest(
                                ".clothing-card"
                            );


                        await toggleFavorite(
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
                    async function(event) {

                        event.stopPropagation();


                        const card =
                            button.closest(
                                ".clothing-card"
                            );


                        await deleteItem(
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

async function toggleFavorite(id) {

    try {

        const {
            data: item,
            error: findError
        } =
            await supabase
                .from(CLOTHING_TABLE)
                .select("*")
                .eq(
                    "id",
                    id
                )
                .single();


        if (findError) {
            throw findError;
        }


        const {
            error
        } =
            await supabase
                .from(CLOTHING_TABLE)
                .update({
                    favorite:
                        !item.favorite
                })
                .eq(
                    "id",
                    id
                );


        if (error) {
            throw error;
        }


        if (
            currentPage ===
            "favorites"
        ) {

            await showFavorites();

        } else {

            await renderWardrobe();

        }

    } catch (error) {

        console.error(
            error
        );

        alert(
            "Could not update favorite."
        );

    }

}


// =====================================================
// DELETE ITEM
// =====================================================

async function deleteItem(id) {

    try {

        const {
            data: item,
            error: findError
        } =
            await supabase
                .from(CLOTHING_TABLE)
                .select("*")
                .eq(
                    "id",
                    id
                )
                .single();


        if (findError) {
            throw findError;
        }


        if (
            !confirm(
                `Delete "${item.name}"?`
            )
        ) {

            return;

        }


        const {
            error
        } =
            await supabase
                .from(CLOTHING_TABLE)
                .delete()
                .eq(
                    "id",
                    id
                );


        if (error) {
            throw error;
        }


        await deleteImage(
            item.image_url
        );


        await renderWardrobe();


    } catch (error) {

        console.error(
            error
        );

        alert(
            "Could not delete item."
        );

    }

}


// =====================================================
// MARK ITEM AS WORN
// =====================================================

async function markItemAsWorn(id) {

    try {

        const {
            data: item,
            error: findError
        } =
            await supabase
                .from(CLOTHING_TABLE)
                .select(
                    "wear_count"
                )
                .eq(
                    "id",
                    id
                )
                .single();


        if (findError) {
            throw findError;
        }


        const {
            error
        } =
            await supabase
                .from(CLOTHING_TABLE)
                .update({

                    wear_count:
                        Number(
                            item.wear_count ||
                            0
                        ) + 1,

                    last_worn:
                        new Date()
                            .toISOString()

                })
                .eq(
                    "id",
                    id
                );


        if (error) {
            throw error;
        }


        await renderWardrobe();


    } catch (error) {

        console.error(
            error
        );

        alert(
            "Could not update wear count."
        );

    }

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
                async function() {

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


                    await renderWardrobe();

                }
            );

        }
    );


// =====================================================
// PAGE HELPERS
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


function showDynamicPage() {

    wardrobePage.classList.add(
        "hidden"
    );

    dynamicPage.classList.remove(
        "hidden"
    );

}


async function showWardrobe() {

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


    await renderWardrobe();

}


// =====================================================
// FAVORITES PAGE
// =====================================================

async function showFavorites() {

    currentPage =
        "favorites";


    activateNav(
        favoritesNav
    );


    showDynamicPage();


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


    try {

        const {
            data,
            error
        } =
            await supabase
                .from(CLOTHING_TABLE)
                .select("*")
                .eq(
                    "favorite",
                    true
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {
            throw error;
        }


        const favorites =
            data || [];


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
                    createClothingCard(
                        item
                    )
                );

            }
        );


        attachCardButtons();


    } catch (error) {

        console.error(
            error
        );

        grid.innerHTML = `
            <div class="empty-state">
                ⚠️
                <p>
                    Could not load favorites.
                </p>
            </div>
        `;

    }

}


// =====================================================
// OUTFITS
// =====================================================

async function showOutfits() {

    currentPage =
        "outfits";


    activateNav(
        outfitsNav
    );


    showDynamicPage();


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


    // For now outfits stay in localStorage.
    // We will move them to Supabase after
    // the wardrobe system is confirmed working.

    renderSavedOutfits();

}


// =====================================================
// OUTFIT BUILDER
// =====================================================

async function showOutfitBuilder() {

    showDynamicPage();


    const wardrobe =
        await getWardrobe();


    selectedOutfitItems =
        [];


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
// OUTFIT ITEM
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


    const imageUrl =
        item.image_url ||
        item.image ||
        "";


    const image =
        imageUrl

            ?

            `<img
                src="${escapeHTML(imageUrl)}"
                alt="${escapeHTML(item.name)}"
                loading="lazy"
            >`

            :

            `<div
                class="placeholder"
                style="font-size:50px;"
            >
                ${categoryEmoji(
                    item.category
                )}
            </div>`;


    element.innerHTML = `

        <div class="outfit-item-image">

            ${image}

        </div>


        <div class="outfit-item-info">

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
                            ${escapeHTML(
                                item.name
                            )}
                        </span>

                    `;

                }
            )
            .join("");

}


// =====================================================
// OUTFIT LOCAL STORAGE
// =====================================================

const OUTFITS_KEY =
    "closetAI_outfits_v2";


function getOutfits() {

    try {

        return JSON.parse(
            localStorage.getItem(
                OUTFITS_KEY
            )
        ) || [];

    } catch {

        return [];

    }

}


function saveOutfits(outfits) {

    localStorage.setItem(
        OUTFITS_KEY,
        JSON.stringify(
            outfits
        )
    );

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
                            item.image_url ||
                            item.image ||
                            ""

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
                                            src="${escapeHTML(item.image)}"
                                            alt="${escapeHTML(item.name)}"
                                            loading="lazy"
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
                                            ${escapeHTML(
                                                item.name
                                            )}
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
                    outfit.id !==
                    id
                );

            }
        )
    );


    renderSavedOutfits();

}


// =====================================================
// SETTINGS
// =====================================================

async function showSettings() {

    currentPage =
        "settings";


    activateNav(
        settingsNav
    );


    showDynamicPage();


    const wardrobe =
        await getWardrobe();


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
                Manage your wardrobe.
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
                Cloud storage
            </h3>

            <p>
                Your clothing and images are stored
                securely in Supabase.
            </p>

        </div>


        <div class="settings-card">

            <h3>
                AI Stylist
            </h3>

            <p>
                Luna is currently switched off.
                We're building the manual wardrobe first.
            </p>

        </div>

    `;

}


// =====================================================
// NAVIGATION
// =====================================================

if (wardrobeNav) {

    wardrobeNav.addEventListener(
        "click",
        showWardrobe
    );

}


if (outfitsNav) {

    outfitsNav.addEventListener(
        "click",
        showOutfits
    );

}


if (favoritesNav) {

    favoritesNav.addEventListener(
        "click",
        showFavorites
    );

}


if (settingsNav) {

    settingsNav.addEventListener(
        "click",
        showSettings
    );

}


if (logo) {

    logo.addEventListener(
        "click",
        showWardrobe
    );

}


if (styleOutfitButton) {

    styleOutfitButton.addEventListener(
        "click",
        showOutfitBuilder
    );

}


const profileButton =
    document.getElementById(
        "profileButton"
    );


if (profileButton) {

    profileButton.addEventListener(
        "click",
        function() {

            alert(
                "Profile settings can be added later ✨"
            );

        }
    );

}


// =====================================================
// START APP
// =====================================================

console.log(
    "Closet AI Supabase version starting..."
);


showWardrobe();