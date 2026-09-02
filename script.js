/* =========================================================
   CLOSET AI
   Supabase wardrobe + outfit builder
   ========================================================= */

import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


/* =========================================================
   SUPABASE CONFIG
   ========================================================= */

const SUPABASE_URL =
    "https://jppmfociofyhpxzcfcmz.supabase.co";

const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwcG1mb2Npb2Z5aHB4emNmY216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMTYxNTEsImV4cCI6MjEwMzU5MjE1MX0.zqJQo2MC4P0XNG1mMNFJ2_5_jEeHTsz7cOiTQD2MYw4";

const STORAGE_BUCKET =
    "clothing";

const CLOTHING_TABLE =
    "clothing_items";

const OUTFITS_TABLE =
    "outfits";


const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let wardrobe = [];

let outfits = [];

let currentPage = "wardrobe";

let currentWardrobeFilter = "all";

let selectedTypes = [];

let selectedImageFile = null;

let selectedOutfitItems = [];

let builderFilters = {
    category: "all",
    fabric: "all",
    color: "all"
};


/* =========================================================
   HELPERS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function categoryLabel(category) {

    const labels = {

        top:
            "Tops",

        bottom:
            "Bottoms",

        dress:
            "Dresses",

        sweater:
            "Sweaters",

        cardigan:
            "Cardigans / Overtop",

        skirt:
            "Skirts",

        shoes:
            "Shoes",

        accessory:
            "Accessories"
    };

    return labels[category] ||
        category ||
        "Other";
}


function categoryEmoji(category) {

    const emojis = {

        top: "👚",
        bottom: "👖",
        dress: "👗",
        sweater: "🧶",
        cardigan: "🧥",
        skirt: "👗",
        shoes: "👠",
        accessory: "👜"
    };

    return emojis[category] || "👕";
}


function formatLabel(value) {

    if (!value) {
        return "";
    }

    return String(value)
        .replace(/-/g, " ")
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );
}


/* =========================================================
   NORMALISE CLOTHING FROM SUPABASE
   ========================================================= */

function normaliseClothing(item) {

    return {

        id:
            item.id,

        category:
            item.category || "",

        color:
            item.color || "",

        fabric:
            item.fabric || "",

        types:
            Array.isArray(item.types)
                ? item.types
                : [],

        image:
            item.image_url || "",

        image_url:
            item.image_url || "",

        favorite:
            Boolean(item.favorite),

        wear_count:
            Number(item.wear_count || 0),

        last_worn:
            item.last_worn || null,

        created_at:
            item.created_at || null
    };
}


/* =========================================================
   LOAD WARDROBE FROM SUPABASE
   ========================================================= */

async function loadWardrobe() {

    const {
        data,
        error
    } = await supabase
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

        showError(
            "Could not load your wardrobe: " +
            error.message
        );

        return;
    }

    wardrobe =
        (data || [])
            .map(normaliseClothing);

    renderWardrobe();

    updateItemCount();
}


/* =========================================================
   LOAD OUTFITS FROM SUPABASE
   ========================================================= */

async function loadOutfits() {

    const {
        data,
        error
    } = await supabase
        .from(OUTFITS_TABLE)
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );

    if (error) {

        console.error(
            "Could not load outfits:",
            error
        );

        outfits = [];

        return;
    }

    outfits =
        data || [];
}


/* =========================================================
   ERROR MESSAGE
   ========================================================= */

function showError(message) {

    console.error(message);

    const existing =
        document.querySelector(
            ".app-error-message"
        );

    if (existing) {
        existing.remove();
    }

    const errorBox =
        document.createElement("div");

    errorBox.className =
        "app-error-message";

    errorBox.textContent =
        message;

    Object.assign(
        errorBox.style,
        {
            position: "fixed",
            bottom: "20px",
            left: "20px",
            right: "20px",
            zIndex: "9999",
            padding: "14px 18px",
            borderRadius: "12px",
            background: "#f4e8e6",
            color: "#8c514a",
            border: "1px solid #dfc6c1",
            fontSize: "14px"
        }
    );

    document.body.appendChild(
        errorBox
    );

    setTimeout(() => {

        errorBox.remove();

    }, 7000);
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function hidePages() {

    const wardrobePage =
        $("wardrobePage");

    const dynamicPage =
        $("dynamicPage");

    if (wardrobePage) {

        wardrobePage.classList.add(
            "hidden"
        );
    }

    if (dynamicPage) {

        dynamicPage.classList.add(
            "hidden"
        );
    }
}


function showWardrobe() {

    currentPage =
        "wardrobe";

    hidePages();

    $("wardrobePage")
        ?.classList
        .remove("hidden");

    activateNav(
        $("wardrobeNav")
    );

    renderWardrobe();
}


function showDynamicPage() {

    hidePages();

    $("dynamicPage")
        ?.classList
        .remove("hidden");
}


function activateNav(button) {

    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove(
                "active"
            );
        });

    button
        ?.classList
        .add("active");
}


/* =========================================================
   WARDROBE
   ========================================================= */

function updateItemCount() {

    const count =
        $("itemCount");

    if (!count) {
        return;
    }

    count.textContent =
        `${wardrobe.length} ${
            wardrobe.length === 1
                ? "item"
                : "items"
        } in your closet`;
}


function renderWardrobe() {

    const grid =
        $("clothingGrid");

    if (!grid) {
        return;
    }

    const filtered =
        wardrobe.filter(item => {

            if (
                currentWardrobeFilter ===
                "all"
            ) {
                return true;
            }

            return (
                item.category ===
                currentWardrobeFilter
            );
        });

    grid.innerHTML = "";

    if (!filtered.length) {

        grid.innerHTML = `
            <div class="empty-state">

                <div
                    style="font-size:42px;"
                >
                    👗
                </div>

                <h3>
                    No clothing found
                </h3>

                <p>
                    Add something to your wardrobe.
                </p>

            </div>
        `;

        return;
    }

    filtered.forEach(item => {

        grid.appendChild(
            createClothingCard(item)
        );

    });

    updateItemCount();
}


/* =========================================================
   CLOTHING CARD
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
            ? `
                <img
                    src="${escapeHTML(
                        item.image
                    )}"
                    alt="${escapeHTML(
                        categoryLabel(
                            item.category
                        )
                    )}"
                >
            `
            : `
                <div class="placeholder">
                    ${categoryEmoji(
                        item.category
                    )}
                </div>
            `;

    const types =
        item.types
            .slice(0, 4)
            .map(type => `
                <span class="item-tag">
                    ${escapeHTML(
                        formatLabel(type)
                    )}
                </span>
            `)
            .join("");

    card.innerHTML = `

        <div
            class="clothing-image"
            data-id="${escapeHTML(item.id)}"
        >

            ${imageHTML}

            <button
                class="heart ${
                    item.favorite
                        ? "active"
                        : ""
                }"
                type="button"
                aria-label="Favourite"
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
                        categoryLabel(
                            item.category
                        )
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        formatLabel(
                            item.color
                        )
                    )}
                    ${
                        item.fabric
                            ? " · " +
                              escapeHTML(
                                  formatLabel(
                                      item.fabric
                                  )
                              )
                            : ""
                    }
                </p>

                ${
                    types
                        ? `
                            <div class="item-tags">
                                ${types}
                            </div>
                        `
                        : ""
                }

            </div>

        </div>
    `;


    card
        .querySelector(".heart")
        ?.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                toggleFavorite(
                    item
                );
            }
        );


    card
        .querySelector(".clothing-image")
        ?.addEventListener(
            "click",
            () => {

                openPhoto(
                    item.image
                );
            }
        );


    return card;
}


/* =========================================================
   FAVOURITE
   ========================================================= */

async function toggleFavorite(item) {

    const newValue =
        !item.favorite;

    const {
        error
    } = await supabase
        .from(CLOTHING_TABLE)
        .update({
            favorite: newValue
        })
        .eq(
            "id",
            item.id
        );

    if (error) {

        showError(
            "Could not update favourite: " +
            error.message
        );

        return;
    }

    item.favorite =
        newValue;

    renderWardrobe();
}


/* =========================================================
   PHOTO VIEW
   ========================================================= */

function openPhoto(image) {

    if (!image) {
        return;
    }

    const modal =
        document.createElement(
            "div"
        );

    modal.className =
        "photo-modal active";

    modal.innerHTML = `

        <div class="photo-modal-content">

            <button
                class="close-modal"
                type="button"
            >
                ×
            </button>

            <img
                src="${escapeHTML(image)}"
                alt="Clothing"
            >

        </div>
    `;

    document.body.appendChild(
        modal
    );

    modal
        .querySelector(".close-modal")
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
   ADD ITEM MODAL
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

    selectedTypes = [];

    selectedImageFile = null;

    const imageInput =
        $("clothingImage");

    const imagePreview =
        $("imagePreview");

    const placeholder =
        $("uploadPlaceholder");

    if (imageInput) {
        imageInput.value = "";
    }

    if (imagePreview) {

        imagePreview.src = "";

        imagePreview.style.display =
            "none";
    }

    if (placeholder) {

        placeholder.style.display =
            "flex";
    }

    const clothingColor = $("clothingColor");
    if (clothingColor) {
        clothingColor.value = "";
    }

    const clothingFabric = $("clothingFabric");
    if (clothingFabric) {
        clothingFabric.value = "";
    }

    document
        .querySelectorAll(
            ".type-option"
        )
        .forEach(button => {

            button.classList.remove(
                "selected"
            );
        });
}


/* =========================================================
   IMAGE COMPRESSION
   ========================================================= */

function compressImage(file) {

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
                                1000;

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

                            canvas.toBlob(
                                blob => {

                                    if (!blob) {

                                        reject(
                                            new Error(
                                                "Could not compress image."
                                            )
                                        );

                                        return;
                                    }

                                    resolve(
                                        blob
                                    );

                                },
                                "image/jpeg",
                                0.78
                            );
                        };

                    image.onerror =
                        () => reject(
                            new Error(
                                "Could not read image."
                            )
                        );

                    image.src =
                        event.target.result;
                };

            reader.onerror =
                () => reject(
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


/* =========================================================
   IMAGE INPUT
   ========================================================= */

function setupImageInput() {

    const input =
        $("clothingImage");

    if (!input) {
        return;
    }

    input.addEventListener(
        "change",
        async event => {

            const file =
                event.target.files?.[0];

            if (!file) {
                return;
            }

            selectedImageFile =
                file;

            const preview =
                $("imagePreview");

            const placeholder =
                $("uploadPlaceholder");

            if (preview) {

                preview.src =
                    URL.createObjectURL(
                        file
                    );

                preview.style.display =
                    "block";
            }

            if (placeholder) {

                placeholder.style.display =
                    "none";
            }
        }
    );
}


/* =========================================================
   CLOTHING TYPE OPTIONS
   ========================================================= */

const extraTypes = [

    {
        value: "open-back",
        label: "Open Back"
    },

    {
        value: "loose-fit",
        label: "Loose Fit"
    },

    {
        value: "tight-fit",
        label: "Tight Fit"
    },

    {
        value: "cropped",
        label: "Cropped"
    },

    {
        value: "long",
        label: "Long"
    },

    {
        value: "mini",
        label: "Mini"
    },

    {
        value: "glitter",
        label: "Glitter"
    }
];


function setupTypeOptions() {

    const picker =
        $("typePicker");

    if (!picker) {
        return;
    }

    extraTypes.forEach(
        type => {

            const exists =
                picker.querySelector(
                    `[data-type="${type.value}"]`
                );

            if (exists) {
                return;
            }

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "type-option";

            button.dataset.type =
                type.value;

            button.textContent =
                type.label;

            picker.appendChild(
                button
            );
        }
    );

    picker
        .querySelectorAll(
            ".type-option"
        )
        .forEach(button => {

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
                                value =>
                                    value !==
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
        });
}


/* =========================================================
   ADD NEW CATEGORIES / FABRIC
   ========================================================= */

function addOptionIfMissing(
    select,
    value,
    label
) {

    if (!select) {
        return;
    }

    const exists =
        [...select.options]
            .some(
                option =>
                    option.value ===
                    value
            );

    if (exists) {
        return;
    }

    const option =
        document.createElement(
            "option"
        );

    option.value =
        value;

    option.textContent =
        label;

    select.appendChild(
        option
    );
}


function setupNewCategories() {

    const category =
        $("clothingCategory");

    addOptionIfMissing(
        category,
        "sweater",
        "Sweaters"
    );

    addOptionIfMissing(
        category,
        "cardigan",
        "Cardigans / Overtop"
    );

    addOptionIfMissing(
        category,
        "skirt",
        "Skirts"
    );
}


function setupPolyester() {

    const fabric =
        $("clothingFabric");

    addOptionIfMissing(
        fabric,
        "polyester",
        "Polyester"
    );
}


/* =========================================================
   SAVE CLOTHING ITEM
   ========================================================= */

async function saveClothingItem() {

    const category =
        $("clothingCategory")
            ?.value;

    const color =
        $("clothingColor")
            ?.value;

    const fabric =
        $("clothingFabric")
            ?.value;

    if (!selectedImageFile) {

        alert(
            "Please add a photo first."
        );

        return;
    }

    if (!category) {

        alert(
            "Please choose a category."
        );

        return;
    }


    const saveButton =
        $("saveItem");

    if (saveButton) {

        saveButton.disabled =
            true;

        saveButton.textContent =
            "Uploading...";
    }


    try {

        const compressed =
            await compressImage(
                selectedImageFile
            );

        const fileName =
            `${crypto.randomUUID()}.jpg`;

        const storagePath =
            fileName;


        /* -----------------------------------------
           UPLOAD PHOTO
           ----------------------------------------- */

        const {
            error: uploadError
        } = await supabase
            .storage
            .from(STORAGE_BUCKET)
            .upload(
                storagePath,
                compressed,
                {
                    contentType:
                        "image/jpeg",

                    cacheControl:
                        "31536000",

                    upsert:
                        false
                }
            );


        if (uploadError) {

            throw uploadError;
        }


        /* -----------------------------------------
           GET PUBLIC IMAGE URL
           ----------------------------------------- */

        const {
            data: publicData
        } =
            supabase
                .storage
                .from(
                    STORAGE_BUCKET
                )
                .getPublicUrl(
                    storagePath
                );


        const imageURL =
            publicData.publicUrl;


        /* -----------------------------------------
           SAVE DATABASE ROW
           ----------------------------------------- */

        const {
            data,
            error
        } = await supabase
            .from(CLOTHING_TABLE)
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
                    imageURL,

                favorite:
                    false,

                wear_count:
                    0

            })
            .select()
            .single();


        if (error) {

            throw error;
        }


        wardrobe.unshift(
            normaliseClothing(
                data
            )
        );


        closeAddModal();

        renderWardrobe();

        updateItemCount();

        alert(
            "Added to your wardrobe ✨"
        );


    } catch (error) {

        console.error(
            "Save item error:",
            error
        );

        showError(
            "Could not add item: " +
            error.message
        );

    } finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                "Add to wardrobe";
        }
    }
}


/* =========================================================
   OUTFITS PAGE
   ========================================================= */

async function showOutfits() {

    currentPage =
        "outfits";

    activateNav(
        $("outfitsNav")
    );

    showDynamicPage();

    await loadOutfits();

    renderOutfitsPage();
}


function renderOutfitsPage() {

    const dynamic =
        $("dynamicPage");

    if (!dynamic) {
        return;
    }

    dynamic.innerHTML = `

        <div class="outfits-header">

            <div>

                <p class="hero-label">
                    YOUR LOOKS
                </p>

                <h2>
                    My outfits
                </h2>

                <p>
                    Create and save outfits
                    using your wardrobe.
                </p>

            </div>

            <button
                class="style-button"
                id="createOutfitButton"
                type="button"
            >
                + Create outfit
            </button>

        </div>


        <div class="outfit-filter-panel">

            <label
                class="outfit-filter-field"
            >

                <span>
                    Fabric
                </span>

                <select
                    id="outfitFabricFilter"
                >
                    <option value="all">
                        All fabrics
                    </option>
                </select>

            </label>


            <label
                class="outfit-filter-field"
            >

                <span>
                    Colour
                </span>

                <select
                    id="outfitColorFilter"
                >
                    <option value="all">
                        All colours
                    </option>
                </select>

            </label>


            <label
                class="outfit-filter-field"
            >

                <span>
                    Category
                </span>

                <select
                    id="outfitCategoryFilter"
                >
                    <option value="all">
                        All categories
                    </option>
                </select>

            </label>

        </div>


        <div
            id="savedOutfits"
            class="saved-outfits-grid"
        ></div>

    `;


    $("createOutfitButton")
        ?.addEventListener(
            "click",
            showOutfitBuilder
        );


    setupOutfitFilters();

    renderSavedOutfits();
}


/* =========================================================
   OUTFIT FILTERS
   ========================================================= */

function setupOutfitFilters() {

    const fabrics =
        [...new Set(
            wardrobe
                .map(
                    item =>
                        item.fabric
                )
                .filter(Boolean)
        )]
        .sort();

    const colors =
        [...new Set(
            wardrobe
                .map(
                    item =>
                        item.color
                )
                .filter(Boolean)
        )]
        .sort();

    const categories =
        [...new Set(
            wardrobe
                .map(
                    item =>
                        item.category
                )
                .filter(Boolean)
        )]
        .sort();


    const fabricSelect =
        $("outfitFabricFilter");

    const colorSelect =
        $("outfitColorFilter");

    const categorySelect =
        $("outfitCategoryFilter");


    fabrics.forEach(
        fabric => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                fabric;

            option.textContent =
                formatLabel(
                    fabric
                );

            fabricSelect
                ?.appendChild(
                    option
                );
        }
    );


    colors.forEach(
        color => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                color;

            option.textContent =
                formatLabel(
                    color
                );

            colorSelect
                ?.appendChild(
                    option
                );
        }
    );


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category;

            option.textContent =
                categoryLabel(
                    category
                );

            categorySelect
                ?.appendChild(
                    option
                );
        }
    );


    [
        fabricSelect,
        colorSelect,
        categorySelect
    ]
    .forEach(select => {

        select?.addEventListener(
            "change",
            renderSavedOutfits
        );

    });
}


/* =========================================================
   FILTER SAVED OUTFITS
   ========================================================= */

function outfitMatchesFilters(
    outfit
) {

    const fabric =
        $("outfitFabricFilter")
            ?.value || "all";

    const color =
        $("outfitColorFilter")
            ?.value || "all";

    const category =
        $("outfitCategoryFilter")
            ?.value || "all";


    const items =
        Array.isArray(
            outfit.items
        )
            ? outfit.items
            : [];


    if (
        fabric !== "all" &&
        !items.some(
            item =>
                item.fabric ===
                fabric
        )
    ) {
        return false;
    }


    if (
        color !== "all" &&
        !items.some(
            item =>
                item.color ===
                color
        )
    ) {
        return false;
    }


    if (
        category !== "all" &&
        !items.some(
            item =>
                item.category ===
                category
        )
    ) {
        return false;
    }


    return true;
}


/* =========================================================
   SAVED OUTFITS
   ========================================================= */

function renderSavedOutfits() {

    const container =
        $("savedOutfits");

    if (!container) {
        return;
    }


    const filtered =
        outfits.filter(
            outfitMatchesFilters
        );


    container.innerHTML =
        "";


    if (!filtered.length) {

        container.innerHTML = `

            <div class="empty-state">

                <div
                    style="font-size:42px;"
                >
                    ✨
                </div>

                <h3>
                    No saved outfits
                </h3>

                <p>
                    Create your first
                    outfit above.
                </p>

            </div>

        `;

        return;
    }


    filtered.forEach(
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
   SAVED OUTFIT CARD
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


    const items =
        Array.isArray(
            outfit.items
        )
            ? outfit.items
            : [];


    const images =
        items
            .filter(
                item =>
                    item.image
            )
            .slice(0, 4);


    let imageHTML =
        "";


    if (images.length) {

        imageHTML =
            images
                .map(
                    item => `
                        <img
                            src="${escapeHTML(
                                item.image
                            )}"
                            alt="${escapeHTML(
                                categoryLabel(
                                    item.category
                                )
                            )}"
                        >
                    `
                )
                .join("");

    } else {

        imageHTML = `

            <div
                style="
                    grid-column:1/-1;
                    grid-row:1/-1;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:42px;
                "
            >
                ✨
            </div>

        `;
    }


    const name =
        outfit.name?.trim()
            ? outfit.name
            : "Untitled outfit";


    card.innerHTML = `

        <div
            class="saved-outfit-thumb-row"
        >
            ${imageHTML}
        </div>

        <h3>
            ${escapeHTML(name)}
        </h3>

        <p
            class="saved-outfit-description"
        >
            ${items.length}
            ${
                items.length === 1
                    ? "piece"
                    : "pieces"
            }
        </p>

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
   CREATE OUTFIT
   ========================================================= */

function showOutfitBuilder() {

    currentPage =
        "outfit-builder";

    selectedOutfitItems =
        [];


    showDynamicPage();


    const dynamic =
        $("dynamicPage");

    if (!dynamic) {
        return;
    }


    dynamic.innerHTML = `

        <div class="outfits-header">

            <div>

                <button
                    class="secondary-button"
                    id="backToOutfitsButton"
                    type="button"
                >
                    ← Back to outfits
                </button>

                <p
                    class="hero-label"
                    style="margin-top:14px;"
                >
                    MANUAL STYLING
                </p>

                <h2>
                    Create your outfit
                </h2>

                <p>
                    Choose the pieces
                    you want to wear.
                </p>

            </div>

        </div>


        <div class="outfit-builder">

            <div
                class="outfit-filter-panel"
                style="margin-bottom:28px;"
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
                    </select>

                </label>

            </div>


            <div
                id="outfitCategories"
                class="outfit-categories"
            ></div>


            <section
                class="outfit-stage"
                id="outfitStage"
            >

                <div class="outfit-stage-title">
                    YOUR OUTFIT
                </div>

                <div
                    id="outfitStageContent"
                    class="outfit-stage-layout"
                >
                    <div
                        class="outfit-stage-center"
                    >
                        <div
                            class="outfit-empty-piece"
                        >
                            Select clothing
                            pieces above
                        </div>
                    </div>
                </div>

            </section>


            <div class="outfit-name-bottom">

                <label class="input-label">

                    Outfit name
                    <span
                        style="
                            color:var(--muted);
                            font-weight:400;
                        "
                    >
                        optional
                    </span>

                    <input
                        type="text"
                        id="outfitName"
                        placeholder="e.g. Summer dinner"
                    >

                </label>


                <button
                    class="save-item"
                    id="saveOutfitButton"
                    type="button"
                >
                    Save outfit
                </button>

            </div>

        </div>

    `;


    $("backToOutfitsButton")
        ?.addEventListener(
            "click",
            showOutfits
        );


    $("saveOutfitButton")
        ?.addEventListener(
            "click",
            saveOutfit
        );


    setupBuilderFilters();

    renderOutfitCategories();

    updateOutfitStage();
}


/* =========================================================
   BUILDER FILTERS
   ========================================================= */

function setupBuilderFilters() {

    const categories =
        [...new Set(
            wardrobe
                .map(
                    item =>
                        item.category
                )
                .filter(Boolean)
        )]
        .sort();

    const fabrics =
        [...new Set(
            wardrobe
                .map(
                    item =>
                        item.fabric
                )
                .filter(Boolean)
        )]
        .sort();

    const colors =
        [...new Set(
            wardrobe
                .map(
                    item =>
                        item.color
                )
                .filter(Boolean)
        )]
        .sort();


    const categorySelect =
        $("builderCategoryFilter");

    const fabricSelect =
        $("builderFabricFilter");

    const colorSelect =
        $("builderColorFilter");


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category;

            option.textContent =
                categoryLabel(
                    category
                );

            categorySelect
                ?.appendChild(
                    option
                );
        }
    );


    fabrics.forEach(
        fabric => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                fabric;

            option.textContent =
                formatLabel(
                    fabric
                );

            fabricSelect
                ?.appendChild(
                    option
                );
        }
    );


    colors.forEach(
        color => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                color;

            option.textContent =
                formatLabel(
                    color
                );

            colorSelect
                ?.appendChild(
                    option
                );
        }
    );


    [
        categorySelect,
        fabricSelect,
        colorSelect
    ]
    .forEach(select => {

        select?.addEventListener(
            "change",
            () => {

                builderFilters = {

                    category:
                        categorySelect
                            ?.value ||
                        "all",

                    fabric:
                        fabricSelect
                            ?.value ||
                        "all",

                    color:
                        colorSelect
                            ?.value ||
                        "all"
                };

                renderOutfitCategories();
            }
        );
    });
}


/* =========================================================
   OUTFIT CATEGORY ROWS
   ========================================================= */

const outfitSections = [

    {
        key: "top",
        label: "Tops"
    },

    {
        key: "sweater",
        label: "Sweaters"
    },

    {
        key: "cardigan",
        label: "Cardigans / Overtop"
    },

    {
        key: "bottom",
        label: "Bottoms"
    },

    {
        key: "skirt",
        label: "Skirts"
    },

    {
        key: "dress",
        label: "Dresses"
    },

    {
        key: "shoes",
        label: "Shoes"
    },

    {
        key: "accessory",
        label: "Accessories"
    }
];


function renderOutfitCategories() {

    const container =
        $("outfitCategories");

    if (!container) {
        return;
    }


    container.innerHTML = "";


    const filteredWardrobe =
        wardrobe.filter(
            item => {

                if (
                    builderFilters.category !==
                    "all" &&
                    item.category !==
                    builderFilters.category
                ) {
                    return false;
                }


                if (
                    builderFilters.fabric !==
                    "all" &&
                    item.fabric !==
                    builderFilters.fabric
                ) {
                    return false;
                }


                if (
                    builderFilters.color !==
                    "all" &&
                    item.color !==
                    builderFilters.color
                ) {
                    return false;
                }


                return true;
            }
        );


    let visibleSectionCount =
        0;


    outfitSections.forEach(
        section => {

            const items =
                filteredWardrobe.filter(
                    item =>
                        item.category ===
                        section.key
                );


            if (!items.length) {
                return;
            }


            visibleSectionCount++;


            const sectionElement =
                createOutfitSection(
                    section,
                    items
                );


            container.appendChild(
                sectionElement
            );
        }
    );


    if (
        visibleSectionCount === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div
                    style="font-size:42px;"
                >
                    👗
                </div>

                <h3>
                    No clothing matches
                </h3>

                <p>
                    Try changing your filters.
                </p>

            </div>

        `;
    }
}


/* =========================================================
   CREATE SWIPE ROW
   ========================================================= */

function createOutfitSection(
    section,
    items
) {

    const wrapper =
        document.createElement(
            "section"
        );

    wrapper.className =
        "outfit-section";


    const selectedCount =
        selectedOutfitItems.filter(
            item =>
                item.category ===
                section.key
        ).length;


    wrapper.innerHTML = `

        <div
            class="outfit-section-header"
        >

            <h3>
                ${escapeHTML(
                    section.label
                )}
            </h3>

            <span>
                ${
                    selectedCount
                        ? `${selectedCount} selected`
                        : `${items.length} pieces`
                }
            </span>

        </div>


        <div class="outfit-carousel">

            <button
                class="outfit-carousel-button"
                type="button"
                aria-label="Previous"
            >
                ‹
            </button>


            <div
                class="swipe-row"
            ></div>


            <button
                class="outfit-carousel-button"
                type="button"
                aria-label="Next"
            >
                ›
            </button>

        </div>

    `;


    const row =
        wrapper.querySelector(
            ".swipe-row"
        );


    items.forEach(
        item => {

            row.appendChild(
                createOutfitItemCard(
                    item
                )
            );

        }
    );


    const buttons =
        wrapper.querySelectorAll(
            ".outfit-carousel-button"
        );


    buttons[0]?.addEventListener(
        "click",
        () => {

            row.scrollBy({
                left: -350,
                behavior: "smooth"
            });
        }
    );


    buttons[1]?.addEventListener(
        "click",
        () => {

            row.scrollBy({
                left: 350,
                behavior: "smooth"
            });
        }
    );


    return wrapper;
}


/* =========================================================
   OUTFIT ITEM CARD
   ========================================================= */

function createOutfitItemCard(
    item
) {

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "outfit-item";

    card.dataset.id =
        item.id;


    const selected =
        selectedOutfitItems.some(
            selectedItem =>
                selectedItem.id ===
                item.id
        );


    if (selected) {

        card.classList.add(
            "selected"
        );
    }


    const types =
        item.types
            .slice(0, 2)
            .map(
                type => `
                    <span>
                        ${escapeHTML(
                            formatLabel(type)
                        )}
                    </span>
                `
            )
            .join("");


    card.innerHTML = `

        <div
            class="outfit-item-image"
        >

            ${
                item.image
                    ? `
                        <img
                            src="${escapeHTML(
                                item.image
                            )}"
                            alt=""
                        >
                    `
                    : `
                        <div class="placeholder">
                            ${categoryEmoji(
                                item.category
                            )}
                        </div>
                    `
            }

        </div>


        <div
            class="outfit-item-info"
        >

            <strong>
                ${escapeHTML(
                    categoryLabel(
                        item.category
                    )
                )}
            </strong>

            <span>
                ${escapeHTML(
                    formatLabel(
                        item.color
                    )
                )}
                ${
                    item.fabric
                        ? " · " +
                          escapeHTML(
                              formatLabel(
                                  item.fabric
                              )
                          )
                        : ""
                }
            </span>

            ${
                types
                    ? `
                        <div
                            class="outfit-item-tags"
                        >
                            ${types}
                        </div>
                    `
                    : ""
            }

        </div>

    `;


    card.addEventListener(
        "click",
        () => {

            toggleOutfitItem(
                item,
                card
            );

        }
    );


    return card;
}


/* =========================================================
   SELECT OUTFIT ITEM
   ========================================================= */

function toggleOutfitItem(
    item,
    card
) {

    const existingIndex =
        selectedOutfitItems.findIndex(
            selected =>
                selected.id ===
                item.id
        );


    if (
        existingIndex !== -1
    ) {

        selectedOutfitItems.splice(
            existingIndex,
            1
        );

        card.classList.remove(
            "selected"
        );

        updateOutfitStage();

        renderOutfitCategories();

        return;
    }


    /*
       Allow multiple accessories.

       Other clothing categories only
       allow one selected piece.
    */

    if (
        item.category !==
        "accessory"
    ) {

        const existing =
            selectedOutfitItems.find(
                selected =>
                    selected.category ===
                    item.category
            );


        if (existing) {

            selectedOutfitItems =
                selectedOutfitItems.filter(
                    selected =>
                        selected.category !==
                        item.category
                );


            document
                .querySelectorAll(
                    `.outfit-item[data-id="${existing.id}"]`
                )
                .forEach(
                    element =>
                        element.classList.remove(
                            "selected"
                        )
                );
        }
    }


    selectedOutfitItems.push(
        item
    );


    card.classList.add(
        "selected"
    );


    updateOutfitStage();

    renderOutfitCategories();
}


/* =========================================================
   OUTFIT PREVIEW
   ========================================================= */

function updateOutfitStage() {

    const container =
        $("outfitStageContent");

    if (!container) {
        return;
    }


    if (
        selectedOutfitItems.length ===
        0
    ) {

        container.innerHTML = `

            <div
                class="outfit-stage-center"
            >

                <div
                    class="outfit-empty-piece"
                >
                    Select clothing pieces
                    above to build your outfit.
                </div>

            </div>

        `;

        return;
    }


    const mainItems =
        selectedOutfitItems.filter(
            item =>
                item.category !==
                "accessory"
        );


    const accessories =
        selectedOutfitItems.filter(
            item =>
                item.category ===
                "accessory"
        );


    const mainHTML =
        mainItems.length
            ? mainItems
                .map(
                    item => `

                        <div
                            class="outfit-piece"
                        >

                            ${
                                item.image
                                    ? `
                                        <img
                                            src="${escapeHTML(
                                                item.image
                                            )}"
                                            alt=""
                                        >
                                    `
                                    : `
                                        <div
                                            class="placeholder"
                                            style="
                                                height:115px;
                                                font-size:36px;
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
                                )}
                            </div>

                        </div>

                    `
                )
                .join("")
            : `
                <div
                    class="outfit-empty-piece"
                >
                    Add clothing
                </div>
            `;


    const accessoryHTML =
        accessories.length
            ? accessories
                .map(
                    item => `

                        <div
                            class="outfit-piece"
                        >

                            ${
                                item.image
                                    ? `
                                        <img
                                            src="${escapeHTML(
                                                item.image
                                            )}"
                                            alt=""
                                        >
                                    `
                                    : `
                                        <div
                                            class="placeholder"
                                            style="
                                                height:80px;
                                                font-size:28px;
                                            "
                                        >
                                            👜
                                        </div>
                                    `
                            }

                            <div
                                class="outfit-piece-name"
                            >
                                Accessory
                            </div>

                        </div>

                    `
                )
                .join("")
            : "";


    container.innerHTML = `

        <div></div>

        <div
            class="outfit-stage-center"
        >

            ${mainHTML}

        </div>


        <div
            class="outfit-stage-accessories"
        >

            ${accessoryHTML}

        </div>

    `;
}


/* =========================================================
   SAVE OUTFIT TO SUPABASE
   ========================================================= */

async function saveOutfit() {

    if (
        selectedOutfitItems.length ===
        0
    ) {

        alert(
            "Please select at least one clothing item."
        );

        return;
    }


    const name =
        $("outfitName")
            ?.value
            .trim() || null;


    const saveButton =
        $("saveOutfitButton");


    if (saveButton) {

        saveButton.disabled =
            true;

        saveButton.textContent =
            "Saving...";
    }


    try {

        const items =
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

                    types:
                        item.types || [],

                    image:
                        item.image || ""
                })
            );


        const {
            data,
            error
        } = await supabase
            .from(OUTFITS_TABLE)
            .insert({

                name:
                    name,

                comment:
                    null,

                items:
                    items,

                wear_count:
                    0,

                last_worn:
                    null

            })
            .select()
            .single();


        if (error) {

            throw error;
        }


        outfits.unshift(
            data
        );


        selectedOutfitItems =
            [];


        alert(
            "Outfit saved ✨"
        );


        await showOutfits();


    } catch (error) {

        console.error(
            "Save outfit error:",
            error
        );

        showError(
            "Could not save outfit: " +
            error.message
        );

    } finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                "Save outfit";
        }
    }
}


/* =========================================================
   SAVED OUTFIT DETAIL
   ========================================================= */

function showSavedOutfit(
    outfitId
) {

    const outfit =
        outfits.find(
            item =>
                item.id ===
                outfitId
        );


    if (!outfit) {
        return;
    }


    showDynamicPage();


    const dynamic =
        $("dynamicPage");

    if (!dynamic) {
        return;
    }


    const items =
        Array.isArray(
            outfit.items
        )
            ? outfit.items
            : [];


    const images =
        items
            .filter(
                item =>
                    item.image
            );


    const imageHTML =
        images.length
            ? images
                .map(
                    item => `

                        <div
                            class="saved-outfit-detail-image"
                        >

                            <img
                                src="${escapeHTML(
                                    item.image
                                )}"
                                alt="${escapeHTML(
                                    categoryLabel(
                                        item.category
                                    )
                                )}"
                            >

                            <span>
                                ${escapeHTML(
                                    categoryLabel(
                                        item.category
                                    )
                                )}
                            </span>

                        </div>

                    `
                )
                .join("")
            : `

                <div
                    class="empty-state"
                >
                    No photos available.
                </div>

            `;


    dynamic.innerHTML = `

        <div
            class="outfits-header"
        >

            <div>

                <button
                    class="secondary-button"
                    id="backFromOutfitButton"
                    type="button"
                >
                    ← Back to outfits
                </button>

                <p
                    class="hero-label"
                    style="margin-top:16px;"
                >
                    SAVED LOOK
                </p>

                <h2>
                    ${
                        outfit.name
                            ? escapeHTML(
                                outfit.name
                            )
                            : "Untitled outfit"
                    }
                </h2>

                <p>
                    ${items.length}
                    ${
                        items.length === 1
                            ? "piece"
                            : "pieces"
                    }
                </p>

            </div>

        </div>


        <div
            class="saved-outfit-detail-gallery"
        >
            ${imageHTML}
        </div>


        <div
            class="settings-card"
            style="margin-top:24px;"
        >

            <h3>
                Comment
            </h3>

            <textarea
                id="outfitComment"
                placeholder="Add a note about this outfit..."
                rows="4"
                style="
                    width:100%;
                    margin-top:12px;
                    padding:12px;
                    border:1px solid var(--line);
                    border-radius:12px;
                    resize:vertical;
                    font:inherit;
                "
            >${escapeHTML(
                outfit.comment || ""
            )}</textarea>


            <button
                class="save-item"
                id="saveOutfitComment"
                type="button"
                style="margin-top:14px;"
            >
                Save comment
            </button>

        </div>


        <div
            class="settings-card"
            style="margin-top:14px;"
        >

            <h3>
                Wear tracking
            </h3>

            <p>
                Worn
                <strong>
                    ${Number(
                        outfit.wear_count || 0
                    )}
                </strong>
                ${
                    Number(
                        outfit.wear_count || 0
                    ) === 1
                        ? "time"
                        : "times"
                }.
            </p>


            <button
                class="secondary-button"
                id="wearOutfitButton"
                type="button"
                style="margin-top:12px;"
            >
                I wore this outfit
            </button>

        </div>


        <div
            style="
                margin-top:24px;
            "
        >

            <button
                class="danger-button"
                id="deleteOutfitButton"
                type="button"
            >
                Delete outfit
            </button>

        </div>

    `;


    $("backFromOutfitButton")
        ?.addEventListener(
            "click",
            showOutfits
        );


    $("saveOutfitComment")
        ?.addEventListener(
            "click",
            () =>
                saveOutfitComment(
                    outfit
                )
        );


    $("wearOutfitButton")
        ?.addEventListener(
            "click",
            () =>
                markOutfitWorn(
                    outfit
                )
        );


    $("deleteOutfitButton")
        ?.addEventListener(
            "click",
            () =>
                deleteOutfit(
                    outfit
                )
        );
}


/* =========================================================
   SAVE OUTFIT COMMENT
   ========================================================= */

async function saveOutfitComment(
    outfit
) {

    const comment =
        $("outfitComment")
            ?.value
            .trim() || null;


    const {
        error
    } = await supabase
        .from(OUTFITS_TABLE)
        .update({
            comment:
                comment
        })
        .eq(
            "id",
            outfit.id
        );


    if (error) {

        showError(
            "Could not save comment: " +
            error.message
        );

        return;
    }


    outfit.comment =
        comment;


    alert(
        "Comment saved ✨"
    );
}


/* =========================================================
   MARK OUTFIT AS WORN
   ========================================================= */

async function markOutfitWorn(
    outfit
) {

    const newCount =
        Number(
            outfit.wear_count || 0
        ) + 1;


    const now =
        new Date()
            .toISOString();


    const {
        error
    } = await supabase
        .from(OUTFITS_TABLE)
        .update({

            wear_count:
                newCount,

            last_worn:
                now

        })
        .eq(
            "id",
            outfit.id
        );


    if (error) {

        showError(
            "Could not update wear count: " +
            error.message
        );

        return;
    }


    outfit.wear_count =
        newCount;

    outfit.last_worn =
        now;


    showSavedOutfit(
        outfit.id
    );
}


/* =========================================================
   DELETE OUTFIT
   ========================================================= */

async function deleteOutfit(
    outfit
) {

    const confirmed =
        confirm(
            "Delete this outfit?"
        );


    if (!confirmed) {
        return;
    }


    const {
        error
    } = await supabase
        .from(OUTFITS_TABLE)
        .delete()
        .eq(
            "id",
            outfit.id
        );


    if (error) {

        showError(
            "Could not delete outfit: " +
            error.message
        );

        return;
    }


    outfits =
        outfits.filter(
            item =>
                item.id !==
                outfit.id
        );


    await showOutfits();
}


/* =========================================================
   FAVORITES PAGE
   ========================================================= */

function showFavorites() {

    currentPage =
        "favorites";

    activateNav(
        $("favoritesNav")
    );

    showDynamicPage();


    const dynamic =
        $("dynamicPage");

    if (!dynamic) {
        return;
    }


    const favorites =
        wardrobe.filter(
            item =>
                item.favorite
        );


    dynamic.innerHTML = `

        <div
            class="outfits-header"
        >

            <div>

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

            <div class="empty-state">

                <div
                    style="font-size:42px;"
                >
                    ♡
                </div>

                <h3>
                    No favorites yet
                </h3>

                <p>
                    Tap the heart on
                    any clothing item.
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
   SETTINGS
   ========================================================= */

function showSettings() {

    currentPage =
        "settings";

    activateNav(
        $("settingsNav")
    );

    showDynamicPage();


    const dynamic =
        $("dynamicPage");

    if (!dynamic) {
        return;
    }


    dynamic.innerHTML = `

        <div
            class="outfits-header"
        >

            <div>

                <p class="hero-label">
                    APP SETTINGS
                </p>

                <h2>
                    Settings
                </h2>

                <p>
                    Your wardrobe is stored
                    in the cloud.
                </p>

            </div>

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
                clothing items.
            </p>

        </div>


        <div class="settings-card">

            <h3>
                Outfits
            </h3>

            <p>
                You currently have
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
                Your clothing photos and
                wardrobe data are stored
                in Supabase.
            </p>

        </div>

    `;
}


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */
function setupMobileSidebar() {

    const sidebar = document.querySelector(".sidebar");

    if (!sidebar) {
        return;
    }

    // Create mobile menu button
    let menuButton = document.querySelector(".mobile-menu-button");

    if (!menuButton) {

        menuButton = document.createElement("button");

        menuButton.className = "mobile-menu-button";
        menuButton.type = "button";
        menuButton.innerHTML = "☰";
        menuButton.setAttribute("aria-label", "Open menu");

        document.body.appendChild(menuButton);
    }

    // Create close button inside sidebar
    let closeButton = sidebar.querySelector(".mobile-sidebar-close");

    if (!closeButton) {

        closeButton = document.createElement("button");

        closeButton.className = "mobile-sidebar-close";
        closeButton.type = "button";
        closeButton.innerHTML = "×";
        closeButton.setAttribute("aria-label", "Close menu");

        sidebar.insertBefore(
            closeButton,
            sidebar.firstElementChild
        );
    }

    // Open sidebar
    menuButton.addEventListener("click", () => {

        sidebar.classList.add("mobile-open");

    });

    // Close sidebar
    closeButton.addEventListener("click", () => {

        sidebar.classList.remove("mobile-open");

    });

    // Close sidebar when clicking a navigation item
    sidebar.querySelectorAll(".nav-item").forEach(item => {

        item.addEventListener("click", () => {

            if (window.innerWidth <= 820) {

                sidebar.classList.remove("mobile-open");

            }

        });

    });

    function updateMobileSidebar() {

        if (window.innerWidth <= 820) {

            menuButton.style.display = "flex";

        } else {

            menuButton.style.display = "none";

            sidebar.classList.remove("mobile-open");

        }

    }

    updateMobileSidebar();

    window.addEventListener(
        "resize",
        updateMobileSidebar
    );
}

/* =========================================================
   EVENT LISTENERS
   ========================================================= */

function setupNavigation() {

    $("wardrobeNav")
        ?.addEventListener(
            "click",
            showWardrobe
        );


    $("outfitsNav")
        ?.addEventListener(
            "click",
            showOutfits
        );


    $("favoritesNav")
        ?.addEventListener(
            "click",
            showFavorites
        );


    $("settingsNav")
        ?.addEventListener(
            "click",
            showSettings
        );


    $("styleOutfitButton")
        ?.addEventListener(
            "click",
            showOutfitBuilder
        );


    $("addItemButton")
        ?.addEventListener(
            "click",
            openAddModal
        );


    $("closeModal")
        ?.addEventListener(
            "click",
            closeAddModal
        );


    $("addItemModal")
        ?.addEventListener(
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


    $("saveItem")
        ?.addEventListener(
            "click",
            saveClothingItem
        );


    document
        .querySelectorAll(
            ".filter"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".filter"
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

                    currentWardrobeFilter =
                        button.dataset.category ||
                        "all";

                    renderWardrobe();
                }
            );
        });
}


/* =========================================================
   ADD NEW WARDROBE FILTER BUTTONS
   ========================================================= */

function setupWardrobeCategoryButtons() {

    const filters =
        document.querySelector(
            ".filters"
        );

    if (!filters) {
        return;
    }


    const wanted = [

        {
            value: "sweater",
            label: "Sweaters"
        },

        {
            value: "cardigan",
            label: "Cardigans / Overtop"
        },

        {
            value: "skirt",
            label: "Skirts"
        }
    ];


    wanted.forEach(
        category => {

            if (
                filters.querySelector(
                    `[data-category="${category.value}"]`
                )
            ) {
                return;
            }


            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "filter";

            button.type =
                "button";

            button.dataset.category =
                category.value;

            button.textContent =
                category.label;


            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".filter"
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

                    currentWardrobeFilter =
                        category.value;

                    renderWardrobe();
                }
            );


            filters.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   START APP
   ========================================================= */

async function startApp() {

    console.log(
        "Closet AI starting..."
    );


    setupNavigation();

    setupImageInput();

    setupTypeOptions();

    setupNewCategories();

    setupPolyester();

    setupWardrobeCategoryButtons();

    setupMobileSidebar();


    await loadWardrobe();

    await loadOutfits();


    showWardrobe();


    console.log(
        "Closet AI ready.",
        wardrobe.length,
        "clothing items loaded."
    );
}


startApp();