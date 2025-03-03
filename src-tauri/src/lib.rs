// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use reqwest::{Client, header};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
struct ReplicateResponse {
    // Adjust these fields based on the actual response structure
    id: String,
    output: Option<Vec<String>>,
    status: String,
    // Add other fields as needed
}

#[derive(Debug, Serialize, Deserialize)]
struct ApiInput {
    prompt: String,
    aspect_ratio: String,
    image_prompt: Option<String>,
    image_prompt_strength: Option<f32>,
    safety_tolerance: Option<i32>,
    seed: Option<i32>,
    raw: Option<bool>,
    output_format: Option<String>,
}

#[tauri::command]
async fn generate_image(api_key: String, input: ApiInput) -> Result<ReplicateResponse, String> {
    let client = Client::new();

    // Build request body
    let mut request_input = HashMap::new();
    request_input.insert("prompt", input.prompt);
    request_input.insert("aspect_ratio", input.aspect_ratio);

    if let Some(img_prompt) = input.image_prompt {
        if !img_prompt.is_empty() {
            request_input.insert("image_prompt", img_prompt);
        }
    }

    if let Some(strength) = input.image_prompt_strength {
        request_input.insert("image_prompt_strength", strength.to_string());
    }

    if let Some(tolerance) = input.safety_tolerance {
        request_input.insert("safety_tolerance", tolerance.to_string());
    }

    if let Some(seed) = input.seed {
        request_input.insert("seed", seed.to_string());
    }

    if let Some(raw) = input.raw {
        request_input.insert("raw", raw.to_string());
    }

    if let Some(format) = input.output_format {
        request_input.insert("output_format", format);
    }

    let mut request_body = HashMap::new();
    request_body.insert("input", request_input);

    // Make the API request
    let response = client
        .post("https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro-ultra/predictions")
        .header(header::AUTHORIZATION, format!("Bearer {}", api_key))
        .header(header::CONTENT_TYPE, "application/json")
        .header("Prefer", "wait")
        .json(&request_body)
        .send()
        .await
        .map_err(|e| format!("API request failed: {}", e))?;

    // Check if the request was successful
    if response.status().is_success() {
        let replicate_response = response
            .json::<ReplicateResponse>()
            .await
            .map_err(|e| format!("Failed to parse API response: {}", e))?;

        Ok(replicate_response)
    } else {
        let error_text = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());

        Err(format!("API error: {}", error_text))
    }
}

#[tauri::command]
async fn validate_api_key(api_key: String) -> Result<bool, String> {
    let client = Client::new();

    let response = client
        .get("https://api.replicate.com/v1/models")
        .header(header::AUTHORIZATION, format!("Bearer {}", api_key))
        .send()
        .await
        .map_err(|e| format!("API request failed: {}", e))?;

    Ok(response.status().is_success())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            generate_image,
            validate_api_key
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn enhance_prompt(prompt: String) -> Result<String, String> {
    // Configuration for Gemini API
    let api_key = std::env::var("GEMINI_API_KEY").map_err(|_| "GEMINI_API_KEY not set".to_string())?;
    let client = reqwest::Client::new();

    // Create request body for Gemini
    let request_body = serde_json::json!({
        "contents": [
            {
                "parts": [
                    {
                        "text": format!("Enhance this prompt for AI image generation, adding more details about style, lighting, composition, and visual elements without changing the core idea: '{}'", prompt)
                    }
                ]
            }
        ]
    });

    // Send request to Gemini API
    let response = client.post(format!("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={}", api_key))
        .json(&request_body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    // Parse response
    let response_json: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;

    // Extract enhanced prompt
    let enhanced_prompt = response_json["candidates"][0]["content"]["parts"][0]["text"]
        .as_str()
        .ok_or("Failed to parse response".to_string())?
        .to_string();

    Ok(enhanced_prompt)
}

#[tauri::command]
async fn get_available_models() -> Result<Vec<Model>, String> {
    // Define the model structure
    #[derive(serde::Serialize, serde::Deserialize)]
    struct Model {
        id: String,
        name: String,
        description: String,
    }

    // List of available flux models
    let models = vec![
        Model {
            id: "stability-ai/sdxl".to_string(),
            name: "Stable Diffusion XL".to_string(),
            description: "Stability AI's SDXL text-to-image model".to_string(),
        },
        Model {
            id: "lucataco/animate-diff".to_string(),
            name: "Animate Diff".to_string(),
            description: "Video generation model by Animate Anyone".to_string(),
        },
        Model {
            id: "fofr/sd-turbo".to_string(),
            name: "SD Turbo".to_string(),
            description: "Fast real-time text to image generation".to_string(),
        },
        Model {
            id: "lucataco/prisma-render".to_string(),
            name: "Prisma Render".to_string(),
            description: "Text to 3D model generation".to_string(),
        },
        // Add more models as needed
    ];

    Ok(models)
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}