// ========================================
// CLOSET AI - LUNA BACKEND
// ========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

const PORT = process.env.PORT || 3000;


// ========================================
// OPENAI
// ========================================

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const MODEL =
    process.env.OPENAI_MODEL || "gpt-5";


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(
    express.json({
        limit: "20mb"
    })
);


// ========================================
// BASIC TEST
// ========================================

app.get("/api/test", (req, res) => {

    res.json({
        success: true,
        message: "Closet AI server is working! ✨"
    });

});


// ========================================
// TEST LUNA
// ========================================

app.get("/api/test-ai", async (req, res) => {

    try {

        const response =
            await openai.responses.create({

                model: MODEL,

                input:
                    "Say hello to the Closet AI user and introduce yourself as Luna, their personal fashion assistant."

            });


        res.json({

            success: true,

            message:
                response.output_text

        });

    } catch (error) {

        console.error(
            "❌ TEST AI ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            error:
                error.message ||
                "Luna could not respond."

        });

    }

});


// ========================================
// ANALYZE CLOTHING
// ========================================

app.post(
    "/api/analyze-clothing",
    async (req, res) => {

        try {

            const image =
                req.body.image;


            if (!image) {

                return res.status(400).json({

                    success: false,

                    error:
                        "No clothing image was provided."

                });

            }


            console.log(
                "📸 Luna is analyzing clothing..."
            );


            const response =
                await openai.responses.create({

                    model: MODEL,

                    input: [

                        {
                            role: "system",

                            content:
                                `
You are Luna, a personal fashion assistant.

Analyze the clothing item in the image.

Return ONLY valid JSON.

Use exactly this structure:

{
    "name": "short clothing name",
    "category": "top | bottom | dress | shoes | accessory",
    "subcategory": "specific type",
    "colors": ["color"],
    "material": "best estimate",
    "style": "style",
    "season": "season",
    "formality": "casual | smart-casual | formal",
    "description": "short description"
}

Do not include markdown.
Do not include explanations outside the JSON.
                                `

                        },

                        {
                            role: "user",

                            content: [

                                {
                                    type: "input_text",

                                    text:
                                        "Analyze this clothing item."
                                },

                                {
                                    type: "input_image",

                                    image_url:
                                        image
                                }

                            ]

                        }

                    ]

                });


            const text =
                response.output_text;


            console.log(
                "🤖 Luna clothing result:",
                text
            );


            let clothing;


            try {

                clothing =
                    JSON.parse(text);

            } catch (parseError) {

                console.error(
                    "❌ Could not parse Luna JSON:",
                    text
                );


                return res.status(500).json({

                    success: false,

                    error:
                        "Luna returned an invalid clothing result."

                });

            }


            res.json({

                success: true,

                clothing:
                    clothing

            });


        } catch (error) {

            console.error(
                "❌ CLOTHING ANALYSIS ERROR:",
                error
            );


            res.status(500).json({

                success: false,

                error:
                    error.message ||
                    "Luna could not analyze this clothing."

            });

        }

    }
);


// ========================================
// CREATE OUTFIT
// ========================================

app.post(
    "/api/create-outfit",
    async (req, res) => {

        try {

            const wardrobe =
                req.body.wardrobe;


            if (
                !wardrobe ||
                !Array.isArray(wardrobe)
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "No wardrobe was provided."

                });

            }


            if (wardrobe.length === 0) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Your wardrobe is empty."

                });

            }


            console.log(
                "✨ Luna is creating an outfit from",
                wardrobe.length,
                "items."
            );


            // --------------------------------
            // Prepare wardrobe for Luna
            // --------------------------------

            const wardrobeText =
                wardrobe
                    .map(
                        (item, index) => {

                            return `
ITEM ${index + 1}

ID: ${item.id || ""}
Name: ${item.name || ""}
Category: ${item.category || ""}
`;

                        }
                    )
                    .join("\n");


            // --------------------------------
            // Ask Luna
            // --------------------------------

            const response =
                await openai.responses.create({

                    model: MODEL,

                    input: [

                        {
                            role: "system",

                            content:
                                `
You are Luna, a personal fashion stylist.

The user wants you to create an outfit using ONLY clothing items that exist in their wardrobe.

IMPORTANT:
- Never invent clothing items.
- Only use items provided by the user.
- Try to create a complete and stylish outfit.
- You can choose fewer items if the wardrobe does not contain everything needed.
- Use the exact item names provided.
- Return ONLY valid JSON.

Return exactly:

{
    "name": "outfit name",
    "description": "short explanation of why the outfit works",
    "items": [
        {
            "id": "exact wardrobe item ID",
            "name": "exact wardrobe item name",
            "category": "category"
        }
    ]
}

Do not use markdown.
Do not put anything before or after the JSON.
                                `

                        },

                        {
                            role: "user",

                            content:
                                `
Here is the user's wardrobe:

${wardrobeText}

Create one outfit from these clothes.
                                `

                        }

                    ]

                });


            const text =
                response.output_text;


            console.log(
                "🤖 Luna outfit result:",
                text
            );


            let outfit;


            try {

                outfit =
                    JSON.parse(text);

            } catch (parseError) {

                console.error(
                    "❌ Could not parse outfit JSON:",
                    text
                );


                return res.status(500).json({

                    success: false,

                    error:
                        "Luna returned an invalid outfit."

                });

            }


            res.json({

                success: true,

                outfit:
                    outfit

            });


        } catch (error) {

            console.error(
                "❌ CREATE OUTFIT ERROR:",
                error
            );


            res.status(500).json({

                success: false,

                error:
                    error.message ||
                    "Luna could not create an outfit."

            });

        }

    }
);


// ========================================
// AI ASSISTANT
// ========================================

app.post(
    "/api/assistant",
    async (req, res) => {

        try {

            const message =
                req.body.message;


            const wardrobe =
                req.body.wardrobe || [];


            if (!message) {

                return res.status(400).json({

                    success: false,

                    error:
                        "No message was provided."

                });

            }


            const wardrobeText =
                wardrobe.length > 0

                    ?

                    wardrobe
                        .map(
                            item =>
                                `- ${item.name} (${item.category})`
                        )
                        .join("\n")

                    :

                    "The wardrobe is currently empty.";


            const response =
                await openai.responses.create({

                    model: MODEL,

                    input: [

                        {
                            role: "system",

                            content:
                                `
You are Luna, the user's personal fashion assistant.

You help with:
- outfit ideas
- styling
- clothing combinations
- fashion advice
- wardrobe organization

The user's current wardrobe is:

${wardrobeText}

When recommending clothes from their wardrobe, ONLY recommend items that actually exist in the wardrobe above.

Be friendly, helpful and concise.
                                `

                        },

                        {

                            role: "user",

                            content:
                                message

                        }

                    ]

                });


            res.json({

                success: true,

                message:
                    response.output_text

            });


        } catch (error) {

            console.error(
                "❌ ASSISTANT ERROR:",
                error
            );


            res.status(500).json({

                success: false,

                error:
                    error.message ||
                    "Luna could not answer."

            });

        }

    }
);


// ========================================
// START SERVER
// ========================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");
        console.log(
            "========================================"
        );
        console.log(
            "✨ CLOSET AI SERVER"
        );
        console.log(
            "========================================"
        );
        console.log(
            `🚀 Server running on port ${PORT}`
        );
        console.log(
            `🤖 Luna model: ${MODEL}`
        );
        console.log(
            "========================================"
        );
        console.log("");

    }
);