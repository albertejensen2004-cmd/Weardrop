// ========================================
// CLOSET AI - LUNA CLOTHING ANALYZER
// ========================================

const CLOSET_AI_SERVER =
    "https://orange-potato-wvr9p9jw79r5cx66-3000.app.github.dev";


// ========================================
// CONVERT IMAGE TO BASE64
// ========================================

function fileToBase64(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

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
// SEND CLOTHING PHOTO TO LUNA
// ========================================

async function analyzeClothingWithAI(imageFile) {

    try {

        console.log("📸 Sending clothing photo to Luna...");


        // Convert the image
        const imageBase64 =
            await fileToBase64(imageFile);


        // Send it to our backend
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


        const data = await response.json();


        if (!response.ok || !data.success) {

            throw new Error(

                data.error ||
                "Luna could not analyze this clothing."

            );

        }


        console.log("🤖 Luna identified:", data.clothing);


        return data.clothing;


    } catch (error) {

        console.error(
            "❌ CLOTHING ANALYSIS ERROR:",
            error
        );


        alert(
            "Sorry! Luna couldn't analyze this clothing. 😭\n\n" +
            error.message
        );


        return null;

    }

}


// ========================================
// CONNECT PHOTO UPLOAD TO LUNA
// ========================================

// IMPORTANT:
// This ID needs to match the file input
// in your HTML.

const clothingImageInput =
    document.getElementById("clothingImage");


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


            // Send photo to Luna
            const clothing =
                await analyzeClothingWithAI(file);


            if (!clothing) {

                return;

            }


            // ====================================
            // SHOW RESULT FOR NOW
            // ====================================

            console.log(
                "================================"
            );

            console.log(
                "🤖 LUNA CLOTHING RESULT"
            );

            console.log(
                "Name:",
                clothing.name
            );

            console.log(
                "Category:",
                clothing.category
            );

            console.log(
                "Subcategory:",
                clothing.subcategory
            );

            console.log(
                "Colours:",
                clothing.colors
            );

            console.log(
                "Material:",
                clothing.material
            );

            console.log(
                "Style:",
                clothing.style
            );

            console.log(
                "Season:",
                clothing.season
            );

            console.log(
                "Formality:",
                clothing.formality
            );

            console.log(
                "Description:",
                clothing.description
            );

            console.log(
                "================================"
            );


            // Simple test message
            alert(

                "✨ Luna analyzed your clothing!\n\n" +

                clothing.name +

                "\n\nCategory: " +

                clothing.category

            );

        }

    );

}