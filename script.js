/* =========================================================
   CLOSET AI
   SUPABASE VERSION
   ========================================================= */

import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


/* =========================================================
   SUPABASE CONFIG
   ========================================================= */

const SUPABASE_URL =
    "https://jppmfo ciofyhpxzcfcmz.supabase.co"
        .replace(" ", "");

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwcG1mb2Npb2Z5aHB4emNmY216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMTYxNTEsImV4cCI6MjEwMzU5MjE1MX0.zqJQo2MC4P0XNG1mMNFJ2_5_jEeHTsz7cOiTQD2MYw4";


const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


const TABLE_NAME = "wardrobe";
const STORAGE_BUCKET = "wardrobe-images";


/* =========================================================
   APP STATE
   ========================================================= */

let wardrobe = [];

let selectedImageFile = null;
let selectedImagePreview = "";

let selectedTypes = [];

let currentPage = "wardrobe";
let currentFilter = "all";

let selectedOutfitItems = [];


/* =========================================================
   HELPERS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


/* =========================================================
   LABELS
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
    ["statement", "Statement"],
    ["party", "Party"]

];


function colorLabel(value) {

    const match =
        COLOR_OPTIONS.find(
            item => item[0] === value
        );

    return match
        ? match[1]
        : value || "";
}


function fabricLabel(value) {

    const match =
        FABRIC_OPTIONS.find(
            item => item[0] === value
        );

    return match
        ? match[1]
        : value || "";
}


function typeLabel(value) {

    const match =
        TYPE_OPTIONS.find(
            item => item[0] === value
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

    return labels[value] ||
        value ||
        "";
}


function categoryEmoji(value) {

    const icons = {

        top: "👚",
        bottom: "👖",
        dress: "👗",
        shoes: "👟",
        accessory: "👜"

    };

    return icons[value] ||
        "👗";
}


/* =========================================================
   INITIALISE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initApp
);


async function initApp() {

    console.log(
        "✨ Closet AI starting..."
    );


    connectNavigation();

    connectAddItem();

    connectTypeButtons();

    setupWardrobeFilters();


    await loadWardrobe();


    showWardrobe();

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function connectNavigation() {

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


    $("logo")
        ?.addEventListener(
            "click",
            showWardrobe
        );


    $("styleOutfitButton")
        ?.addEventListener(
            "click",
            showOutfitBuilder
        );


    $("profileButton")
        ?.addEventListener(
            "click",
            () => {

                alert(
                    "Profile settings can be added later ✨"
                );

            }
        );

}


function hidePages() {

    $("wardrobePage")
        ?.classList
        .add("hidden");


    $("dynamicPage")
        ?.classList
        .add("hidden");

}


function activateNav(button) {

    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });


    button?.classList.add(
        "active"
    );

}


/* =========================================================
   WARDROBE PAGE
   ========================================================= */

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


/* =========================================================
   SUPABASE — LOAD WARDROBE
   ========================================================= */

async function loadWardrobe() {

    try {

        console.log(
            "☁️ Loading wardrobe from Supabase..."
        );


        const {
            data,
            error
        } = await supabase

            .from(TABLE_NAME)

            .select("*")

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "Supabase load error:",
                error
            );

            showDatabaseError(
                error
            );

            wardrobe = [];

            return;

        }


        wardrobe =
            (data || []).map(
                normaliseItem
            );


        console.log(
            `☁️ Loaded ${wardrobe.length} wardrobe items.`
        );


    } catch (error) {

        console.error(
            "Could not load wardrobe:",
            error
        );

        showDatabaseError(
            error
        );

    }

}


/* =========================================================
   NORMALISE DATABASE ITEM
   ========================================================= */

function normaliseItem(item) {

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

        favorite:
            Boolean(item.favorite),

        wearCount:
            Number(item.wear_count || 0),

        lastWorn:
            item.last_worn || null,

        createdAt:
            item.created_at || null

    };

}


/* =========================================================
   DATABASE ERROR
   ========================================================= */

function showDatabaseError(error) {

    console.error(
        "Database error:",
        error
    );


    const grid =
        $("clothingGrid");


    if (!grid) {
        return;
    }


    grid.innerHTML = `

        <div
            class="empty-state"
            style="grid-column:1/-1;"
        >

            <div
                style="font-size:45px;"
            >
                ⚠️
            </div>

            <h3>
                Could not load wardrobe
            </h3>

            <p>
                ${escapeHTML(
                    error?.message ||
                    "There was a problem connecting to Supabase."
                )}
            </p>

        </div>

    `;

}


/* =========================================================
   ADD ITEM
   ========================================================= */

function connectAddItem() {

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


    $("clothingImage")
        ?.addEventListener(
            "change",
            handleImageUpload
        );


    $("saveItem")
        ?.addEventListener(
            "click",
            saveClothing
        );

}


/* =========================================================
   OPEN / CLOSE MODAL
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


/* =========================================================
   RESET FORM
   ========================================================= */

function resetAddForm() {

    selectedImageFile =
        null;

    selectedImagePreview =
        "";

    selectedTypes =
        [];


    if ($("clothingName")) {

        $("clothingName").value =
            "";

    }


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
        .forEach(button => {

            button.classList.remove(
                "selected"
            );

        });

}


/* =========================================================
   TYPE BUTTONS
   ========================================================= */

function connectTypeButtons() {

    document
        .querySelectorAll(
            "#typePicker .type-option"
        )
        .forEach(button => {

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

        });

}


/* =========================================================
   IMAGE SELECTION
   ========================================================= */

async function handleImageUpload(event) {

    const file =
        event.target.files?.[0];


    if (!file) {
        return;
    }


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        alert(
            "Please choose an image."
        );

        return;

    }


    try {

        console.log(
            "📷 Image selected:",
            file.name,
            file.size
        );


        selectedImageFile =
            file;


        selectedImagePreview =
            await createPreview(
                file
            );


        const preview =
            $("imagePreview");


        const placeholder =
            $("uploadPlaceholder");


        if (preview) {

            preview.src =
                selectedImagePreview;

            preview.style.display =
                "block";

        }


        if (placeholder) {

            placeholder.style.display =
                "none";

        }


    } catch (error) {

        console.error(
            "Image preview error:",
            error
        );


        alert(
            "The photo could not be loaded."
        );

    }

}


/* =========================================================
   IMAGE PREVIEW
   ========================================================= */

function createPreview(file) {

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
   COMPRESS IMAGE FOR STORAGE
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

                            const max =
                                1400;


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
   UPLOAD IMAGE TO SUPABASE STORAGE
   ========================================================= */

async function uploadImage(file) {

    if (!file) {

        return null;

    }


    console.log(
        "☁️ Uploading image..."
    );


    const compressed =
        await compressImage(
            file
        );


    const fileName =

        `${crypto.randomUUID()}.jpg`;


    const filePath =
        `clothing/${fileName}`;


    const {
        error
    } = await supabase

        .storage

        .from(
            STORAGE_BUCKET
        )

        .upload(
            filePath,
            compressed,
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
        data
    } = supabase

        .storage

        .from(
            STORAGE_BUCKET
        )

        .getPublicUrl(
            filePath
        );


    if (!data?.publicUrl) {

        throw new Error(
            "Could not create public image URL."
        );

    }


    console.log(
        "🖼️ Image uploaded."
    );


    return data.publicUrl;

}


/* =========================================================
   SAVE CLOTHING
   ========================================================= */

async function saveClothing() {

    const category =
        $("clothingCategory")
            ?.value || "";


    const color =
        $("clothingColor")
            ?.value || "";


    const fabric =
        $("clothingFabric")
            ?.value || "";


    if (!category) {

        alert(
            "Please choose a category."
        );

        return;

    }


    const button =
        $("saveItem");


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "Saving...";

    }


    try {

        let imageURL =
            null;


        if (
            selectedImageFile
        ) {

            imageURL =
                await uploadImage(
                    selectedImageFile
                );

        }


        const item = {

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
                0,

            last_worn:
                null

        };


        console.log(
            "☁️ Saving clothing:",
            item
        );


        const {
            data,
            error
        } = await supabase

            .from(TABLE_NAME)

            .insert(item)

            .select()

            .single();


        if (error) {

            console.error(
                "Database save error:",
                error
            );


            throw error;

        }


        wardrobe.unshift(
            normaliseItem(
                data
            )
        );


        console.log(
            "✅ Clothing saved."
        );


        closeAddModal();


        renderWardrobe();


    } catch (error) {

        console.error(
            "Could not save clothing:",
            error
        );


        alert(
            "Could not save the clothing item.\n\n" +
            (
                error?.message ||
                "Unknown error"
            )
        );


    } finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "Add to wardrobe";

        }

    }

}


/* =========================================================
   FILTERS
   ========================================================= */

function setupWardrobeFilters() {

    document
        .querySelectorAll(
            "#wardrobePage .filter"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            "#wardrobePage .filter"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });


                    button.classList.add(
                        "active"
                    );


                    currentFilter =
                        button.dataset.category ||
                        "all";


                    renderWardrobe();

                }
            );

        });

}


/* =========================================================
   RENDER WARDROBE
   ========================================================= */

function renderWardrobe() {

    const grid =
        $("clothingGrid");


    if (!grid) {
        return;
    }


    const filtered =
        currentFilter === "all"

            ? wardrobe

            : wardrobe.filter(
                item =>
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


    if (!filtered.length) {

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

            grid.appendChild(
                createClothingCard(
                    item
                )
            );

        }
    );

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
                    src="${escapeHTML(item.image)}"
                    alt="${escapeHTML(
                        categoryLabel(
                            item.category
                        )
                    )}"
                    loading="lazy"
                >

            `

            : `

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
   PHOTO MODAL
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

                ${(item.types || [])
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
                    .join("")}

            </div>


            <p
                style="
                    margin-top:15px;
                    color:#8d857e;
                "
            >
                Worn ${
                    item.wearCount || 0
                } ${
                    (item.wearCount || 0) === 1
                        ? "time"
                        : "times"
                }
            </p>


            <button
                class="style-button"
                id="wearItemButton"
                type="button"
                style="margin-top:15px;"
            >
                Mark as worn
            </button>

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


    $("wearItemButton")
        ?.addEventListener(
            "click",
            async () => {

                await markItemWorn(
                    item.id
                );

                modal.remove();

            }
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
   MARK ITEM AS WORN
   ========================================================= */

async function markItemWorn(id) {

    const item =
        wardrobe.find(
            current =>
                current.id ===
                id
        );


    if (!item) {
        return;
    }


    const newWearCount =
        (item.wearCount || 0) + 1;


    const now =
        new Date().toISOString();


    const {
        error
    } = await supabase

        .from(TABLE_NAME)

        .update({

            wear_count:
                newWearCount,

            last_worn:
                now

        })

        .eq(
            "id",
            id
        );


    if (error) {

        console.error(
            "Could not update wear count:",
            error
        );


        alert(
            "Could not update wear count.\n\n" +
            error.message
        );

        return;

    }


    item.wearCount =
        newWearCount;


    item.lastWorn =
        now;


    renderWardrobe();

}


/* =========================================================
   FAVORITES
   ========================================================= */

async function toggleFavorite(id) {

    const item =
        wardrobe.find(
            current =>
                current.id ===
                id
        );


    if (!item) {
        return;
    }


    const newValue =
        !item.favorite;


    const {
        error
    } = await supabase

        .from(TABLE_NAME)

        .update({

            favorite:
                newValue

        })

        .eq(
            "id",
            id
        );


    if (error) {

        console.error(
            "Favorite update error:",
            error
        );


        alert(
            "Could not update favorite.\n\n" +
            error.message
        );

        return;

    }


    item.favorite =
        newValue;


    if (
        currentPage ===
        "favorites"
    ) {

        renderFavorites();

    } else {

        renderWardrobe();

    }

}


/* =========================================================
   EDIT ITEM
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

                    <option
                        value="top"
                    >
                        Tops
                    </option>

                    <option
                        value="bottom"
                    >
                        Bottoms
                    </option>

                    <option
                        value="dress"
                    >
                        Dresses
                    </option>

                    <option
                        value="shoes"
                    >
                        Shoes
                    </option>

                    <option
                        value="accessory"
                    >
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

                    ${COLOR_OPTIONS
                        .map(
                            option => `

                                <option
                                    value="${option[0]}"
                                >
                                    ${option[1]}
                                </option>

                            `
                        )
                        .join("")}

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

                    ${FABRIC_OPTIONS
                        .map(
                            option => `

                                <option
                                    value="${option[0]}"
                                >
                                    ${option[1]}
                                </option>

                            `
                        )
                        .join("")}

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
            () =>
                saveEditedItem(
                    item,
                    modal
                )
        );


    $("deleteEditButton")
        ?.addEventListener(
            "click",
            async () => {

                modal.remove();

                await confirmDeleteItem(
                    item.id
                );

            }
        );

}


/* =========================================================
   SAVE EDITED ITEM
   ========================================================= */

async function saveEditedItem(
    item,
    modal
) {

    const category =
        $("editItemCategory")
            ?.value || "";


    const color =
        $("editItemColor")
            ?.value || null;


    const fabric =
        $("editItemFabric")
            ?.value || null;


    const types =
        [
            ...document.querySelectorAll(
                "#editTypePicker .type-option.selected"
            )
        ].map(
            button =>
                button.dataset.type
        );


    const {
        error
    } = await supabase

        .from(TABLE_NAME)

        .update({

            category:
                category,

            color:
                color,

            fabric:
                fabric,

            types:
                types

        })

        .eq(
            "id",
            item.id
        );


    if (error) {

        console.error(
            "Edit error:",
            error
        );


        alert(
            "Could not save changes.\n\n" +
            error.message
        );

        return;

    }


    item.category =
        category;


    item.color =
        color;


    item.fabric =
        fabric;


    item.types =
        types;


    modal.remove();


    renderWardrobe();

}


/* =========================================================
   DELETE ITEM
   ========================================================= */

async function confirmDeleteItem(id) {

    const item =
        wardrobe.find(
            current =>
                current.id ===
                id
        );


    if (!item) {
        return;
    }


    if (
        !confirm(
            "Are you sure you want to delete this item?"
        )
    ) {

        return;

    }


    const {
        error
    } = await supabase

        .from(TABLE_NAME)

        .delete()

        .eq(
            "id",
            id
        );


    if (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "Could not delete item.\n\n" +
            error.message
        );

        return;

    }


    wardrobe =
        wardrobe.filter(
            current =>
                current.id !==
                id
        );


    renderWardrobe();

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


    hidePages();


    $("dynamicPage")
        ?.classList
        .remove("hidden");


    renderFavorites();

}


function renderFavorites() {

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
                    style="font-size:50px;"
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
   OUTFITS
   ========================================================= */

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


    renderOutfits();

}


function renderOutfits() {

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
            class="empty-state"
        >

            <div
                style="font-size:45px;"
            >
                ✨
            </div>

            <h3>
                Outfit builder
            </h3>

            <p>
                Choose pieces from your wardrobe
                to create an outfit.
            </p>

            <button
                class="style-button"
                id="createOutfitButton2"
                type="button"
                style="margin-top:15px;"
            >
                Create outfit
            </button>

        </div>

    `;


    $("createOutfitButton")
        ?.addEventListener(
            "click",
            showOutfitBuilder
        );


    $("createOutfitButton2")
        ?.addEventListener(
            "click",
            showOutfitBuilder
        );

}


/* =========================================================
   OUTFIT BUILDER
   ========================================================= */

function showOutfitBuilder() {

    currentPage =
        "outfit-builder";


    selectedOutfitItems =
        [];


    hidePages();


    $("dynamicPage")
        ?.classList
        .remove("hidden");


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
                MANUAL STYLING
            </p>

            <h2>
                Create your outfit
            </h2>

            <p>
                Choose pieces from your wardrobe.
            </p>

        </div>


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


        <div
            id="outfitItems"
            class="clothing-grid"
            style="margin-top:20px;"
        ></div>


        <div
            class="selected-outfit"
            style="margin-top:20px;"
        >

            <strong>
                Selected pieces
            </strong>


            <div
                id="selectedOutfitItems"
                class="selected-outfit-items"
                style="margin-top:10px;"
            >
                <span
                    class="selected-chip"
                >
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
            Save outfit
        </button>


        <button
            class="delete-outfit"
            id="cancelOutfitButton"
            type="button"
            style="margin-top:10px;"
        >
            Cancel
        </button>

    `;


    $("saveOutfitButton")
        ?.addEventListener(
            "click",
            saveOutfit
        );


    $("cancelOutfitButton")
        ?.addEventListener(
            "click",
            showOutfits
        );


    const container =
        $("outfitItems");


    wardrobe.forEach(
        item => {

            const card =
                createOutfitSelectionCard(
                    item
                );


            container.appendChild(
                card
            );

        }
    );

}


function createOutfitSelectionCard(
    item
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "clothing-card";


    card.innerHTML = `

        <div
            class="clothing-image"
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
                        >
                            ${categoryEmoji(
                                item.category
                            )}
                        </div>

                    `
            }

        </div>


        <div
            class="clothing-info"
        >

            <strong>
                ${escapeHTML(
                    categoryLabel(
                        item.category
                    )
                )}
            </strong>

        </div>

    `;


    if (
        selectedOutfitItems
            .includes(item.id)
    ) {

        card.classList.add(
            "selected"
        );

    }


    card.addEventListener(
        "click",
        () => {

            if (
                selectedOutfitItems
                    .includes(item.id)
            ) {

                selectedOutfitItems =
                    selectedOutfitItems.filter(
                        id =>
                            id !==
                            item.id
                    );

            } else {

                selectedOutfitItems.push(
                    item.id
                );

            }


            card.classList.toggle(
                "selected"
            );


            renderSelectedOutfitItems();

        }
    );


    return card;

}


function renderSelectedOutfitItems() {

    const container =
        $("selectedOutfitItems");


    if (!container) {
        return;
    }


    const selected =
        wardrobe.filter(
            item =>
                selectedOutfitItems
                    .includes(item.id)
        );


    if (!selected.length) {

        container.innerHTML = `

            <span
                class="selected-chip"
            >
                Nothing selected yet
            </span>

        `;

        return;

    }


    container.innerHTML =
        selected
            .map(
                item => `

                    <span
                        class="selected-chip"
                    >
                        ${escapeHTML(
                            categoryLabel(
                                item.category
                            )
                        )}
                    </span>

                `
            )
            .join("");

}


/* =========================================================
   SAVE OUTFIT
   ========================================================= */

async function saveOutfit() {

    const name =
        $("outfitName")
            ?.value
            .trim();


    if (!name) {

        alert(
            "Please give your outfit a name."
        );

        return;

    }


    if (
        !selectedOutfitItems.length
    ) {

        alert(
            "Please select at least one clothing item."
        );

        return;

    }


    /*
       NOTE:

       Your current Supabase setup only has
       the wardrobe table.

       Therefore outfits are kept locally
       for now.

       We can create a separate Supabase
       outfits table next.
    */


    const outfits =
        JSON.parse(
            localStorage.getItem(
                "closetAI_outfits"
            ) || "[]"
        );


    const items =
        wardrobe.filter(
            item =>
                selectedOutfitItems
                    .includes(item.id)
        );


    outfits.push({

        id:
            crypto.randomUUID(),

        name:
            name,

        items:
            items,

        createdAt:
            new Date().toISOString()

    });


    localStorage.setItem(
        "closetAI_outfits",
        JSON.stringify(
            outfits
        )
    );


    alert(
        "Outfit saved ✨"
    );


    showOutfits();

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


    hidePages();


    $("dynamicPage")
        ?.classList
        .remove("hidden");


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
                APP SETTINGS
            </p>

            <h2>
                Settings
            </h2>

            <p>
                Your wardrobe is stored in the cloud.
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
                clothing items.
            </p>

        </div>


        <div
            class="settings-card"
        >

            <h3>
                Cloud storage
            </h3>

            <p>
                Your clothing data and photos
                are stored in Supabase.
            </p>

        </div>

    `;

}


/* =========================================================
   CLEANUP
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