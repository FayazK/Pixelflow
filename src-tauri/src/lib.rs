// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use reqwest::{Client, header};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::fs;
use chrono::prelude::*;
use tauri::api::path::app_data_dir;
use tauri::Context;


#[derive(Debug, Serialize, Deserialize, Clone)]
struct ReplicateResponse {
    // Adjust these fields based on the actual response structure
    id: String,
    output: Option<Vec<String>>,
    status: String,
    // Add other fields as needed
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    created_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    started_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    completed_at: Option<String>,
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
async fn generate_image(api_key: String, input: ApiInput, app_handle: tauri::AppHandle) -> Result<ReplicateResponse, String> {
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

        // Save the response and download the image
        if let Err(e) = save_generation(&app_handle, &replicate_response, &input).await {
            eprintln!("Error saving generation: {}", e);
            // Continue anyway to return the response to the frontend
        }

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
// Ensures generations directory exists
async fn ensure_generations_dir(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app_handle.path().app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    let generations_dir = app_data_dir.join("generations");
    
    if !generations_dir.exists() {
        fs::create_dir_all(&generations_dir)
            .map_err(|e| format!("Failed to create generations directory: {}", e))?;
    }
    
    Ok(generations_dir)
}

// Save generation response and download the image
async fn save_generation(
    app_handle: &tauri::AppHandle,
    response: &ReplicateResponse,
    input: &ApiInput
) -> Result<(), String> {
    // Create the generations directory if it doesn't exist
    let generations_dir = ensure_generations_dir(app_handle).await?;
    
    // Create a timestamped directory for this generation
    let now = Local::now();
    let timestamp = now.format("%Y%m%d_%H%M%S").to_string();
    let generation_dir = generations_dir.join(&timestamp);
    
    fs::create_dir_all(&generation_dir)
        .map_err(|e| format!("Failed to create generation directory: {}", e))?;
    
    // Save the API response as JSON
    let response_json = serde_json::to_string_pretty(response)
        .map_err(|e| format!("Failed to serialize response: {}", e))?;
    
    fs::write(
        generation_dir.join("response.json"),
        response_json
    ).map_err(|e| format!("Failed to write response.json: {}", e))?;
    
    // Save the input parameters as JSON
    let input_json = serde_json::to_string_pretty(input)
        .map_err(|e| format!("Failed to serialize input: {}", e))?;
    
    fs::write(
        generation_dir.join("input.json"),
        input_json
    ).map_err(|e| format!("Failed to write input.json: {}", e))?;
    
    // Download the image if available
    if let Some(output) = &response.output {
        if !output.is_empty() {
            let image_url = &output[0];
            download_image(image_url, &generation_dir, input.output_format.as_deref().unwrap_or("jpeg")).await?
        }
    }
    
    Ok(())
}

// Download an image from a URL
async fn download_image(url: &str, dir: &Path, format: &str) -> Result<(), String> {
    let client = Client::new();
    
    // Fetch the image data
    let response = client.get(url)
        .send()
        .await
        .map_err(|e| format!("Failed to download image: {}", e))?;
    
    if !response.status().is_success() {
        return Err(format!("Failed to download image, status: {}", response.status()));
    }
    
    let image_data = response.bytes()
        .await
        .map_err(|e| format!("Failed to read image data: {}", e))?;
    
    // Save the image to disk
    let file_path = dir.join(format!("image.{}", format));
    fs::write(&file_path, image_data)
        .map_err(|e| format!("Failed to save image: {}", e))?;
    
    Ok(())
}

// Initialize the app, creating necessary folders
async fn initialize_app(app_handle: &tauri::AppHandle) -> Result<(), String> {
    ensure_generations_dir(app_handle).await?;
    Ok(())
}

#[tauri::command]
async fn get_generations_path(app_handle: tauri::AppHandle) -> Result<String, String> {
    let generations_dir = ensure_generations_dir(&app_handle).await?;
    generations_dir.to_str()
        .map(String::from)
        .ok_or_else(|| "Failed to convert path to string".to_string())
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            generate_image,
            validate_api_key,
            get_generations_path
        ])
        .setup(|app| {
            // Initialize app in a separate task to avoid blocking startup
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = initialize_app(&app_handle).await {
                    eprintln!("Error initializing app: {}", e);
                }
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}



#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}