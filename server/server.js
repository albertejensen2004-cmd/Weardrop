require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();
const PORT = 3000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


// ========================================
// MIDDLEWARE
// ========================================

app.use(express.json({
    limit: "10mb"
}));


// ========================================
// TEST BACKEND
// ========================================

app.get("/", function(req, res) {

    res.send("Closet AI backend is working! 👗✨");

});


// ========================================
// TEST LUNA
// ========================================

app.get("/api/test-ai", async function(req, res) {

    try {

        const response = await client.responses.create({

            model: "gpt-5.6-luna",

            input: "Say hello! You are the AI stylist for Closet AI."

        });

        res.json({

            success: true,
            model: "gpt-5.6-luna",
            message: response.output_text

        });

    } catch (error) {

        console.error("OPENAI ERROR:", error);

        res.status(500).json({

            success: false,
            error: error.message

        });

    }

});


// ========================================
// ANALYZE CLOTHING PHOTO
// ========================================

app.post("/api/analyze-clothing", async function(req, res) {

    try {

        const image = req.body.image;


        if (!image) {

            return res.status(400).json({

                success: false,
                error: "No clothing image was provided."

            });

        }


        console.log("📸 Clothing image received");


        const response = await client.responses.create({

            model: "gpt-5.6-luna",

            input: [

                {

                    role: "user",

                    content: [

                        {

                            type: "input_text",

                            text: `
You are the AI fashion stylist inside an app
called Closet AI.

Look carefully at the clothing item in this image.

Identify the clothing as accurately as possible.

Return ONLY valid JSON.

Use exactly this structure:

{
    "name": "short clothing name",
    "category": "top",
    "subcategory": "specific type",
    "colors": ["color"],
    "material": "best estimate",
    "style": ["style"],
    "season": ["season"],
    "formality": "casual",
    "description": "short description"
}

Category must be one of:

top
bottom
dress
outerwear
shoes
bag
accessory
activewear
other

Season must be one or more of:

spring
summer
autumn
winter
all-season

Formality must be one of:

casual
smart-casual
formal

If you cannot determine something exactly,
make your best reasonable estimate.

Return ONLY the JSON object.
Do not use markdown.
Do not use code blocks.
                            `

                        },

                        {

                            type: "input_image",

                            image_url: image

                        }

                    ]

                }

            ]

        });


        const aiText = response.output_text.trim();

        console.log("🤖 Luna response:");
        console.log(aiText);


        let clothingData;


        try {

            clothingData = JSON.parse(aiText);

        } catch (parseError) {

            console.error("JSON parsing failed:", parseError);

            return res.status(500).json({

                success: false,
                error: "Luna returned an invalid JSON response.",
                rawResponse: aiText

            });

        }


        res.json({

            success: true,
            model: "gpt-5.6-luna",
            clothing: clothingData

        });


    } catch (error) {

        console.error("CLOTHING ANALYSIS ERROR:", error);

        res.status(500).json({

            success: false,
            error: error.message

        });

    }

});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, function() {

    console.log(
        `Closet AI backend running on port ${PORT}`
    );

});