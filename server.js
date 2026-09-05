require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test
app.get("/", (req, res) => {
  res.json({
    app: "Mywallpaper AI",
    status: "running",
  });
});

// Generate wallpaper
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        error: "Wallpaper prompt is required",
      });
    }

    const result = await client.images.generate({
      model: "gpt-image-2",
      prompt: `Create a beautiful high-quality smartphone wallpaper.
      Vertical composition, clean details, visually attractive,
      suitable for a modern mobile phone.
      
      User request: ${prompt}`,
    });

    res.json({
      success: true,
      image: result.data[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to generate wallpaper",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Mywallpaper AI server running on port ${PORT}`);
});
