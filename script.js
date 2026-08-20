// ========================================
// CLOSET AI
// MAIN APP JAVASCRIPT
// ========================================


// ========================================
// LUNA BACKEND
// ========================================

const CLOSET_AI_SERVER =
    "https://orange-potato-wvr9p9jw79r5cx66-3000.app.github.dev";


// ========================================
// GET ELEMENTS
// ========================================

const wardrobeNav =
    document.getElementById("wardrobeNav");

const outfitsNav =
    document.getElementById("outfitsNav");

const favoritesNav =
    document.getElementById("favoritesNav");

const settingsNav =
    document.getElementById("settingsNav");

const addItemButton =
    document.getElementById("addItemButton");

const addItemModal =
    document.getElementById("addItemModal");

const closeModal =
    document.getElementById("closeModal");

const clothingImageInput =
    document.getElementById("clothingImage");

const styleOutfitButton =
    document.getElementById("styleOutfitButton");


// ========================================
// NAVIGATION
// ========================================

function showPage(page) {

    const pages = {

        wardrobe:
            document.getElementById("wardrobePage"),

        outfits:
            document.getElementById("outfitsPage"),

        favorites:
            document.getElementById("favoritesPage"),

        settings:
            document.getElementById("settingsPage")

    };


    Object.values(pages).forEach(function(section) {

        if (section) {

            section.style.display = "none";

        }

    });


    if (pages[page]) {

        pages[page].style.display = "block";

    }

}


// ========================================
// NAVIGATION BUTTONS
// ========================================

if (wardrobeNav) {

    wardrobeNav.addEventListener("click", function() {

        showPage("wardrobe");

    });

}


if (outfitsNav) {

    outfitsNav.addEventListener("click", function() {

        showPage("outfits");

    });

}


if (favoritesNav) {

    favoritesNav.addEventListener("click", function() {

        showPage("favorites");

    });

}


if (settingsNav) {

    settingsNav.addEventListener("click", function() {

        showPage("settings");

    });

}


// ========================================
// ADD ITEM MODAL
// ========================================

function openAddItemModal() {

    if (!addItemModal) {

        return;

    }


    addItemModal.classList.add("active");

    addItemModal.style.display = "flex";

}


function closeAddItemModal() {

    if (!addItemModal) {

        return;

    }


    addItemModal.classList.remove("active");

    addItemModal.style.display = "none";

}


if (addItemButton) {

    addItemButton.addEventListener("click", function() {

        openAddItemModal();

    });

}


if (closeModal) {

    closeModal.addEventListener("click", function() {

        closeAddItemModal();

    });

}


if (addItemModal) {

    addItemModal.addEventListener("click", function(event) {

        if (event.target === addItemModal) {

            closeAddItemModal();

        }

    });

}


// ========================================
// ESCAPE CLOSES MODAL
// ========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeAddItemModal();

        }

    }
);


// ========================================
// FAVORITES
// ========================================

const favoriteButtons =
    document.querySelectorAll(".heart");


favoriteButtons.forEach(function(button) {

    button.addEventListener("click", function(event) {

        event.preventDefault();

        event.stopPropagation();


        const isFavorite =
            button.classList.toggle("is-favorite");


        if (isFavorite) {

            button.textContent = "♥";

        } else {

            button.textContent = "♡";

        }

    });

});


// ========================================
// MORE BUTTONS
// ========================================

const moreButtons =
    document.querySelectorAll(".more");


moreButtons.forEach(function(button) {

    button.addEventListener("click", function(event) {

        event.preventDefault();

        event.stopPropagation();


        alert(
            "Clothing item options coming soon ✨"
        );

    });

});


// ========================================
// CLOTHING CARDS
// ========================================

const clothingCards =
    document.querySelectorAll(".clothing-card");


clothingCards.forEach(function(card) {

    card.addEventListener("click", function(event) {

        if (
            event.target.classList.contains("heart") ||
            event.target.classList.contains("more")
        ) {

            return;

        }


        console.log(
            "Selected clothing:",
            card.id
        );

    });

});


// ========================================
// FILTERS
// ========================================

const filterButtons =
    document.querySelectorAll("[data-filter]");


filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const filter =
            button.dataset.filter;


        clothingCards.forEach(function(card) {

            if (
                filter === "all" ||
                card.dataset.category === filter
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });


        filterButtons.forEach(function(item) {

            item.classList.remove("active");

        });


        button.classList.add("active");

    });

});


// ========================================
// FILE TO BASE64
// ========================================

function fileToBase64(file) {

    return new Promise(function(resolve, reject) {

        const reader =
            new FileReader();


        reader.onload = function() {

            resolve(reader.result);

        };


        reader.onerror = function(error) {

            reject(error);

        };


        reader.readAsDataURL(file);

    });

}


// ========================================
// LUNA CLOTHING ANALYSIS
// ========================================

async function analyzeClothingWithAI(imageFile) {

    try {

        console.log(
            "📸 Sending clothing photo to Luna..."
        );


        const imageBase64 =
            await fileToBase64(imageFile);


        const response = await fetch(

            `${CLOSET_AI_SERVER}/api/analyze-clothing`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    image: imageBase64

                })

            }

        );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(

                data.error ||
                "Luna could not analyze this clothing."

            );

        }


        console.log(
            "🤖 Luna identified:",
            data.clothing
        );


        return data.clothing;


    } catch (error) {

        console.error(
            "Luna analysis failed:",
            error
        );


        // IMPORTANT:
        // Return null instead of stopping the app.
        // This activates manual entry.

        return null;

    }

}


// ========================================
// SHOW AI / MANUAL STATUS
// ========================================

function showManualMode() {

    const message =
        document.getElementById("aiStatus");


    if (message) {

        message.textContent =
            "Luna couldn't identify this item. No worries — you can enter the details manually.";

        message.style.display = "block";

    } else {

        console.log(
            "✏️ Manual clothing entry available."
        );

    }

}


function showAIStatus() {

    const message =
        document.getElementById("aiStatus");


    if (message) {

        message.textContent =
            "✨ Luna identified your clothing. You can edit anything before saving.";

        message.style.display = "block";

    }

}


// ========================================
// FIND FORM FIELD
// ========================================

function findField(ids) {

    for (let i = 0; i < ids.length; i++) {

        const element =
            document.getElementById(ids[i]);


        if (element) {

            return element;

        }

    }


    return null;

}


// ========================================
// FILL FORM WITH LUNA
// ========================================

function fillClothingForm(clothing) {

    const nameInput =
        findField([
            "itemName",
            "clothingName",
            "nameInput"
        ]);


    const categoryInput =
        findField([
            "itemCategory",
            "clothingCategory",
            "categoryInput"
        ]);


    const materialInput =
        findField([
            "itemMaterial",
            "clothingMaterial",
            "materialInput"
        ]);


    const descriptionInput =
        findField([
            "itemDescription",
            "clothingDescription",
            "descriptionInput"
        ]);


    if (nameInput) {

        nameInput.value =
            clothing.name || "";

    }


    if (categoryInput) {

        categoryInput.value =
            clothing.category || "";

    }


    if (materialInput) {

        materialInput.value =
            clothing.material || "";

    }


    if (descriptionInput) {

        descriptionInput.value =
            clothing.description || "";

    }


    showAIStatus();


    console.log(
        "✨ Clothing form filled by Luna."
    );

}


// ========================================
// PHOTO UPLOAD
// ========================================

if (clothingImageInput) {

    clothingImageInput.addEventListener(
        "change",
        async function(event) {

            const file =
                event.target.files[0];


            if (!file) {

                return;

            }


            console.log(
                "📸 Selected:",
                file.name
            );


            // ====================================
            // PHOTO PREVIEW
            // ====================================

            const imageURL =
                URL.createObjectURL(file);


            const preview =
                document.getElementById(
                    "clothingPreview"
                );


            if (preview) {

                preview.src = imageURL;

                preview.style.display =
                    "block";

            }


            // ====================================
            // TRY LUNA
            // ====================================

            const clothing =
                await analyzeClothingWithAI(file);


            // ====================================
            // LUNA FAILED
            // ====================================

            if (!clothing) {

                console.log(
                    "⚠️ Luna failed — manual mode."
                );


                showManualMode();


                return;

            }


            // ====================================
            // LUNA SUCCESS
            // ====================================

            fillClothingForm(clothing);

        }

    );

}


// ========================================
// CREATE OUTFIT
// ========================================

if (styleOutfitButton) {

    styleOutfitButton.addEventListener(
        "click",
        function() {

            alert(
                "✨ Luna outfit styling is coming next!"
            );

        }
    );

}


// ========================================
// APP START
// ========================================

showPage("wardrobe");


console.log(
    "✨ Closet AI loaded successfully!"
);