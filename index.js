require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("Facts").select("*");
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    const randomFact = data[randomIndex];
    return res.status(200).json(randomFact);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get("/:animalType", async (req, res) => {
  try {
    const { animalType } = req.params;

    const { data, error } = await supabase
      .from("Facts")
      .select("*")
      .eq("animal_name", animalType);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ error: `No facts found for ${animalType}` });
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    const randomFact = data[randomIndex];

    res.status(200).json(randomFact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
