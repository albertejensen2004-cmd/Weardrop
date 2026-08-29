// =====================================================
// THE WARDROBE
// SUPABASE CLOUD VERSION
// =====================================================

import {
    createClient
} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// =====================================================
// SUPABASE CONNECTION
// =====================================================

const SUPABASE_URL =
    "https://jppmfciofyhpxzcfcmz.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwcG1mb2Npb2Z5aHB4emNmY216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMTYxNTEsImV4cCI6MjEwMzU5MjE1MX0.zqJQo2MC4P0XNG1mMNFJ2_5_jEeHTsz7cOiTQD2MYw4";

const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


// =====================================================
// SUPABASE SETTINGS
// =====================================================

const CLOTHING_TABLE =
    "clothing_items";

const IMAGE_BUCKET =
    "clothing-images";


// =====================================================
// OLD LOCAL STORAGE
// =====================================================

const OLD_WARDROBE_KEY =
    "closetAI_wardrobe_v2";


// =====================================================
// ELEMENTS
// =====================================================

const $ = id =>
    document.getElementById(id);


const wardrobePage =
    $("wardrobePage");

const dynamicPage =
    $("dynamicPage");

const wardrobeNav =
    $("wardrobeNav");

const outfitsNav =
    $("outfitsNav");

const favoritesNav =
    $("favoritesNav");

const settingsNav =
    $("settingsNav");

const logo =
    $("logo");

const addItemButton =
    $("addItemButton");

const styleOutfitButton =
    $("styleOutfitButton");

const addItemModal =
    $("addItemModal");

const closeModal =
    $("closeModal");

const clothingImage =
    $("clothingImage");

const imagePreview =
    $("imagePreview");

const uploadPlaceholder =
    $("uploadPlaceholder");

const clothingCategory =
    $("clothingCategory");

const clothingColor =
    $("clothingColor");

const clothingFabric =
    $("clothingFabric");

const saveItemButton =
    $("saveItem");

const clothingGrid =
    $("clothingGrid");

const itemCount =
    $("itemCount");


// =====================================================
// STATE
// =====================================================

let selectedImageFile =
    null;

let selectedImagePreview =
    "";

let selectedTypes =
    [];

let currentFilter =
    "all";

let currentPage =
    "wardrobe";

let selectedOutfitItems =
    [];


// =====================================================
// OPEN ADD MODAL
// =====================================================

function openAddModal() {

    resetForm();

    addItemModal?.classList.add(
        "active"
    );

}


// =====================================================
// CLOSE ADD MODAL
// =====================================================

function closeAddModal() {

    addItemModal?.classList.remove(
        "active"
    );

}


addItemButton?.addEventListener(
    "click",
    openAddModal
);


closeModal?.addEventListener(
    "click",
    closeAddModal
);


addItemModal?.addEventListener(
    "click",
    event => {

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
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                event => {

                    const image =
                        new Image();


                    image.onload =
                        () => {

                            const maxSize =
                                1200;


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
                                        maxSize /
                                        width;

                                    width =
                                        maxSize;

                                } else {

                                    width =
                                        width *
                                        maxSize /
                                        height;

                                    height =
                                        maxSize;

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
                                blob => {

                                    if (!blob) {

                                        reject(
                                            new Error(
                                                "Could not process image."
                                            )
                                        );

                                        return;

                                    }


                                    resolve(
                                        blob
                                    );

                                },
                                "image/jpeg",
                                0.82
                            );

                        };


                    image.onerror =
                        () =>
                            reject(
                                new Error(
                                    "Could not read image."
                                )
                            );


                    image.src =
                        event.target.result;

                };


            reader.onerror =
                () =>
                    reject(
                        new Error(
                            "Could not read file."
                        )
                    );


            reader.readAsDataURL(
                file
            );

        }
    );

}


// =====================================================
// IMAGE SELECT
// =====================================================

clothingImage?.addEventListener(
    "change",
    async event => {

        const file =
            event.target.files?.[0];


        if (!file) {
            return;
        }


        try {

            selectedImageFile =
                await resizeImage(
                    file
                );


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
                error
            );


            alert(
                "The photo could not be loaded."
            );

        }

    }
);


// =====================================================
// TYPE BUTTONS
// =====================================================

document
    .querySelectorAll(
        "#typePicker .type-option"
    )
    .forEach(
        button => {

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
                                    item !==
                                    type
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
// GET CLOTHING FROM SUPABASE
// =====================================================

async function getWardrobe() {

    const {
        data,
        error
    } =
        await supabase
            .from(
                CLOTHING_TABLE
            )
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Supabase wardrobe error:",
            error
        );

        throw error;

    }


    return data || [];

}


// =====================================================
// UPLOAD IMAGE
// =====================================================

async function uploadImage(
    file
) {

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
            .from(
                IMAGE_BUCKET
            )
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
            "Image upload error:",
            error
        );

        throw error;

    }


    const {
        data: publicUrlData
    } =
        supabase.storage
            .from(
                IMAGE_BUCKET
            )
            .getPublicUrl(
                data.path
            );


    return (
        publicUrlData.publicUrl
    );

}


// =====================================================
// SAVE CLOTHING ITEM
// =====================================================

saveItemButton?.addEventListener(
    "click",
    saveClothing
);


async function saveClothing() {

    const category =
        clothingCategory?.value ||
        "";

    const color =
        clothingColor?.value ||
        "";

    const fabric =
        clothingFabric?.value ||
        "";


    // -------------------------------
    // VALIDATION
    // -------------------------------

    if (!category) {

        alert(
            "Please choose a category."
        );

        return;

    }


    if (!selectedImageFile) {

        alert(
            "Please add a photo first."
        );

        return;

    }


    // -------------------------------
    // BUTTON STATE
    // -------------------------------

    saveItemButton.disabled =
        true;

    saveItemButton.textContent =
        "Saving...";


    try {

        // ---------------------------
        // UPLOAD PHOTO
        // ---------------------------

        const imageUrl =
            await uploadImage(
                selectedImageFile
            );


        // ---------------------------
        // DATABASE RECORD
        // ---------------------------

        const {
            data,
            error
        } =
            await supabase
                .from(
                    CLOTHING_TABLE
                )
                .insert({

                    category:
                        category,

                    color:
                        color || null,

                    fabric:
                        fabric || null,

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
                "Database save error:",
                error
            );

            throw error;

        }


        console.log(
            "Clothing saved:",
            data
        );


        // ---------------------------
        // CLOSE + REFRESH
        // ---------------------------

        closeAddModal();

        resetForm();

        await renderWardrobe();


    } catch (error) {

        console.error(
            "SAVE ERROR:",
            error
        );


        alert(
            "Could not save the item.\n\n" +
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


    if (clothingCategory) {

        clothingCategory.value =
            "top";

    }


    if (clothingColor) {

        clothingColor.value =
            "";

    }


    if (clothingFabric) {

        clothingFabric.value =
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


// =====================================================
// LABEL HELPERS
// =====================================================

function categoryLabel(
    category
) {

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


function colorLabel(
    color
) {

    const labels = {

        black:
            "Black",

        white:
            "White",

        beige:
            "Beige",

        cream:
            "Cream",

        brown:
            "Brown",

        blue:
            "Blue",

        navy:
            "Navy",

        "light-blue":
            "Light blue",

        red:
            "Red",

        pink:
            "Pink",

        green:
            "Green",

        grey:
            "Grey",

        yellow:
            "Yellow",

        orange:
            "Orange",

        purple:
            "Purple",

        gold:
            "Gold",

        silver:
            "Silver",

        multicolour:
            "Multicolour"

    };


    return (
        labels[color] ||
        color
    );

}


function fabricLabel(
    fabric
) {

    const labels = {

        denim:
            "Denim",

        cotton:
            "Cotton",

        wool:
            "Wool",

        knit:
            "Knit",

        satin:
            "Satin",

        leather:
            "Leather",

        other:
            "Other"

    };


    return (
        labels[fabric] ||
        fabric
    );

}


function typeLabel(
    type
) {

    const labels = {

        basic:
            "Basic",

        everyday:
            "Everyday",

        fine:
            "Fine",

        summer:
            "Summer",

        winter:
            "Winter",

        beach:
            "Beach",

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


function categoryEmoji(
    category
) {

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

function escapeHTML(
    value
) {

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

            <p>
                Loading your wardrobe...
            </p>

        </div>

    `;


    try {

        const wardrobe =
            await getWardrobe();


        const filtered =
            currentFilter === "all"

                ?

                wardrobe

                :

                wardrobe.filter(
                    item =>
                        item.category ===
                        currentFilter
                );


        if (itemCount) {

            itemCount.textContent =
                `${wardrobe.length} ${
                    wardrobe.length === 1
                        ? "item"
                        : "items"
                } in your closet`;

        }


        clothingGrid.innerHTML =
            "";


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
            item => {

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

function createClothingCard(
    item
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "clothing-card";


    card.dataset.id =
        item.id;


    card.dataset.category =
        item.category;


    const imageUrl =
        item.image_url ||
        item.image ||
        "";


    const imageHTML =
        imageUrl

            ?

            `
            <img
                src="${escapeHTML(
                    imageUrl
                )}"
                alt="${escapeHTML(
                    categoryLabel(
                        item.category
                    )
                )}"
                loading="lazy"
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

                    <span class="item-tag">
                        ${escapeHTML(
                            typeLabel(
                                type
                            )
                        )}
                    </span>

                `
            )
            .join("");


    const wearCount =
        Number(
            item.wear_count || 0
        );


    card.innerHTML = `

        <div class="clothing-image">

            ${imageHTML}

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
                    ${categoryLabel(
                        item.category
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

                <div class="item-tags">
                    ${tags}
                </div>

                <small
                    style="
                        display:block;
                        margin-top:8px;
                        opacity:.6;
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
            button => {

                button.addEventListener(
                    "click",
                    event => {

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
            button => {

                button.addEventListener(
                    "click",
                    event => {

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

async function toggleFavorite(
    id
) {

    try {

        const {
            data: item,
            error: findError
        } =
            await supabase
                .from(
                    CLOTHING_TABLE
                )
                .select(
                    "favorite"
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
                .from(
                    CLOTHING_TABLE
                )
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


        await renderWardrobe();

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

async function deleteItem(
    id
) {

    try {

        const {
            data: item,
            error: findError
        } =
            await supabase
                .from(
                    CLOTHING_TABLE
                )
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
                "Delete this clothing item?"
            )
        ) {

            return;

        }


        const {
            error
        } =
            await supabase
                .from(
                    CLOTHING_TABLE
                )
                .delete()
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
            "Could not delete item."
        );

    }

}


// =====================================================
// WARDROBE FILTERS
// =====================================================

document
    .querySelectorAll(
        "#wardrobePage .filter"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                async () => {

                    document
                        .querySelectorAll(
                            "#wardrobePage .filter"
                        )
                        .forEach(
                            filter =>
                                filter.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    currentFilter =
                        button.dataset.category ||
                        "all";


                    await renderWardrobe();

                }
            );

        }
    );


// =====================================================
// PAGE NAVIGATION
// =====================================================

function hidePages() {

    wardrobePage?.classList.add(
        "hidden"
    );

    dynamicPage?.classList.add(
        "hidden"
    );

}


function activateNav(
    activeButton
) {

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
        wardrobeNav
    );


    hidePages();


    wardrobePage?.classList.remove(
        "hidden"
    );


    renderWardrobe();

}


function showDynamicPage() {

    hidePages();


    dynamicPage?.classList.remove(
        "hidden"
    );

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
        $("favoritesGrid");


    try {

        const {
            data,
            error
        } =
            await supabase
                .from(
                    CLOTHING_TABLE
                )
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


        if (
            !data ||
            data.length === 0
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
                        Tap the heart on a clothing item.
                    </p>

                </div>

            `;

            return;

        }


        data.forEach(
            item =>
                grid.appendChild(
                    createClothingCard(
                        item
                    )
                )
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


function saveOutfits(
    outfits
) {

    localStorage.setItem(
        OUTFITS_KEY,
        JSON.stringify(
            outfits
        )
    );

}


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
                Outfits
            </h2>

            <p>
                Create outfits from your wardrobe.
            </p>

        </div>


        <div class="outfit-filter-panel">

            <label class="outfit-filter-field">

                <span>
                    Fabric
                </span>

                <select id="savedOutfitFabricFilter">

                    <option value="all">
                        All fabrics
                    </option>

                    <option value="denim">
                        Denim
                    </option>

                    <option value="cotton">
                        Cotton
                    </option>

                    <option value="wool">
                        Wool
                    </option>

                    <option value="knit">
                        Knit
                    </option>

                    <option value="satin">
                        Satin
                    </option>

                    <option value="leather">
                        Leather
                    </option>

                    <option value="other">
                        Other
                    </option>

                </select>

            </label>

        </div>


        <button
            class="style-button"
            id="createOutfitButton"
            type="button"
        >
            + Create outfit
        </button>


        <div id="savedOutfits"></div>

    `;


    $("createOutfitButton")
        ?.addEventListener(
            "click",
            showOutfitBuilder
        );


    renderSavedOutfits();

}


// =====================================================
// OUTFIT BUILDER
// =====================================================

async function showOutfitBuilder() {

    currentPage =
        "outfit-builder";


    selectedOutfitItems =
        [];


    showDynamicPage();


    const wardrobe =
        await getWardrobe();


    dynamicPage.innerHTML = `

        <div class="dynamic-page-header">

            <p class="hero-label">
                MANUAL STYLING
            </p>

            <h2>
                Create your outfit
            </h2>

            <p>
                Choose pieces from your wardrobe.
            </p>

        </div>


        <div class="outfit-builder">

            <div id="outfitCategories"></div>


            <div class="selected-outfit">

                <strong>
                    Selected pieces
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
            >
                Save outfit!
            </button>

        </div>

    `;


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
        $("outfitCategories");


    categories.forEach(
        category => {

            const items =
                wardrobe.filter(
                    item =>
                        item.category ===
                        category.key
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
                item => {

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


    $("saveOutfitButton")
        ?.addEventListener(
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


    const image =
        item.image_url

            ?

            `
            <img
                src="${escapeHTML(
                    item.image_url
                )}"
                alt=""
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


    element.innerHTML = `

        <div class="outfit-item-image">

            ${image}

        </div>


        <div class="outfit-item-info">

            <strong>
                ${categoryLabel(
                    item.category
                )}
            </strong>

            <span>
                ${
                    [
                        item.color
                            ? colorLabel(
                                item.color
                            )
                            : "",
                        item.fabric
                            ? fabricLabel(
                                item.fabric
                            )
                            : ""
                    ]
                    .filter(Boolean)
                    .join(" · ")
                }
            </span>

        </div>

    `;


    element.addEventListener(
        "click",
        () => {

            const exists =
                selectedOutfitItems.some(
                    selected =>
                        selected.id ===
                        item.id
                );


            if (exists) {

                selectedOutfitItems =
                    selectedOutfitItems.filter(
                        selected =>
                            selected.id !==
                            item.id
                    );


                element.classList.remove(
                    "selected"
                );

            } else {

                if (!multiple) {

                    selectedOutfitItems =
                        selectedOutfitItems.filter(
                            selected =>
                                selected.category !==
                                item.category
                        );


                    document
                        .querySelectorAll(
                            `.outfit-item`
                        )
                        .forEach(
                            card => {

                                if (
                                    card.dataset.id !==
                                    item.id
                                ) {

                                    const cardItem =
                                        wardrobeItemById(
                                            card.dataset.id
                                        );

                                    if (
                                        cardItem?.category ===
                                        item.category
                                    ) {

                                        card.classList.remove(
                                            "selected"
                                        );

                                    }

                                }

                            }
                        );

                }


                selectedOutfitItems.push(
                    item
                );


                element.classList.add(
                    "selected"
                );

            }


            updateSelectedOutfit();

        }
    );


    return element;

}


function wardrobeItemById(
    id
) {

    const cards =
        document.querySelectorAll(
            ".outfit-item"
        );


    for (
        const card of cards
    ) {

        if (
            card.dataset.id ===
            id
        ) {

            return {
                category:
                    card.dataset.category
            };

        }

    }


    return null;

}


// =====================================================
// SELECTED OUTFIT
// =====================================================

function updateSelectedOutfit() {

    const container =
        $("selectedOutfitItems");


    if (!container) {
        return;
    }


    if (
        selectedOutfitItems.length ===
        0
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
                item => `

                    <span class="selected-chip">

                        ${
                            colorLabel(
                                item.color ||
                                ""
                            ) ||
                            categoryLabel(
                                item.category
                            )
                        }

                    </span>

                `
            )
            .join("");

}


// =====================================================
// SAVE OUTFIT
// =====================================================

function saveCurrentOutfit() {

    if (
        selectedOutfitItems.length ===
        0
    ) {

        alert(
            "Choose at least one piece."
        );

        return;

    }


    const outfit = {

        id:
            "outfit-" +
            Date.now(),

        items:
            selectedOutfitItems.map(
                item => ({

                    id:
                        item.id,

                    category:
                        item.category,

                    color:
                        item.color,

                    fabric:
                        item.fabric,

                    image_url:
                        item.image_url,

                    types:
                        item.types || []

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
                    Create your first outfit.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        outfits
            .map(
                outfit => {

                    const images =
                        outfit.items
                            .filter(
                                item =>
                                    item.image_url
                            )
                            .map(
                                item => `

                                    <img
                                        src="${escapeHTML(
                                            item.image_url
                                        )}"
                                        alt=""
                                        loading="lazy"
                                    >

                                `
                            )
                            .join("");


                    return `

                        <article
                            class="saved-outfit-card"
                        >

                            <div
                                class="saved-outfit-thumb-row"
                            >

                                ${images}

                            </div>


                            <h3>
                                Outfit
                            </h3>


                            <p
                                class="saved-outfit-description"
                            >

                                ${
                                    outfit.items.length
                                }
                                pieces

                            </p>


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
            button => {

                button.addEventListener(
                    "click",
                    () => {

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

function deleteOutfit(
    id
) {

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
            outfit =>
                outfit.id !==
                id
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


    let wardrobe = [];


    try {

        wardrobe =
            await getWardrobe();

    } catch {

        wardrobe =
            [];

    }


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
                Manage your digital wardrobe.
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
                Your clothing photos are stored
                in Supabase Storage.
            </p>

        </div>

    `;

}


// =====================================================
// NAVIGATION
// =====================================================

wardrobeNav?.addEventListener(
    "click",
    showWardrobe
);


outfitsNav?.addEventListener(
    "click",
    showOutfits
);


favoritesNav?.addEventListener(
    "click",
    showFavorites
);


settingsNav?.addEventListener(
    "click",
    showSettings
);


logo?.addEventListener(
    "click",
    showWardrobe
);


styleOutfitButton?.addEventListener(
    "click",
    showOutfitBuilder
);


// =====================================================
// START
// =====================================================

console.log(
    "The Wardrobe + Supabase loaded."
);


showWardrobe();