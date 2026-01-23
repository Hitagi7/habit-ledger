const fs = require('fs');
const path = require('path');

// Load .env.local
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.error("Could not read .env.local");
}

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.log("No API Key found");
        return;
    }

    try {
        // console.log(`Fetching models...`); 
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error.message);
            return;
        }

        if (data.models) {
            // console.log("Gemini Models:");
            data.models.forEach(m => {
                const name = m.name.replace('models/', '');
                if (name.startsWith('gemini')) {
                    console.log(name);
                }
            });
        } else {
            console.log("No models found.");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

listModels();
