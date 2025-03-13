// Configuration file for supported text-to-image models
export const models = [
  {
    id: 'nvidia/sana',
    name: 'NVIDIA Sana',
    description: 'High-quality text-to-image model from NVIDIA',
    version: 'c6b5d2b7459910fec94432e9e1203c3cdce92d6db20f714f1355747990b52fa6',
    endpoint: 'https://api.replicate.com/v1/predictions',
    parameters: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: 'text',
        required: true,
        description: 'Input prompt',
        default: 'a cyberpunk cat with a neon sign that says "Sana"',
        order: 0
      },
      {
        id: 'negative_prompt',
        name: 'Negative Prompt',
        type: 'text',
        required: false,
        description: 'Specify things to not see in the output',
        default: '',
        order: 1
      },
      {
        id: 'model_variant',
        name: 'Model Variant',
        type: 'select',
        required: false,
        description: 'Model variant. 1600M variants are slower but produce higher quality than 600M, 1024px variants are optimized for 1024x1024px images, 512px variants are optimized for 512x512px images, "multilang" variants can be prompted in both English and Chinese',
        default: '1600M-1024px',
        options: [
          '1600M-1024px',
          '1600M-1024px-multilang',
          '1600M-512px',
          '600M-1024px-multilang',
          '600M-512px-multilang'
        ],
        order: 2
      },
      {
        id: 'width',
        name: 'Width',
        type: 'number',
        required: false,
        description: 'Width of output image',
        default: 1024,
        min: 512,
        max: 2048,
        step: 8,
        order: 3
      },
      {
        id: 'height',
        name: 'Height',
        type: 'number',
        required: false,
        description: 'Height of output image',
        default: 1024,
        min: 512,
        max: 2048,
        step: 8,
        order: 4
      },
      {
        id: 'num_inference_steps',
        name: 'Num Inference Steps',
        type: 'number',
        required: false,
        description: 'Number of denoising steps',
        default: 18,
        min: 1,
        max: 50,
        order: 5
      },
      {
        id: 'guidance_scale',
        name: 'Guidance Scale',
        type: 'number',
        required: false,
        description: 'Classifier-free guidance scale',
        default: 5,
        min: 1,
        max: 20,
        step: 0.1,
        order: 6
      },
      {
        id: 'pag_guidance_scale',
        name: 'PAG Guidance Scale',
        type: 'number',
        required: false,
        description: 'PAG Guidance scale',
        default: 2,
        min: 1,
        max: 20,
        step: 0.1,
        order: 7
      },
      {
        id: 'seed',
        name: 'Seed',
        type: 'number',
        required: false,
        description: 'Random seed. Leave blank to randomize the seed',
        default: '',
        order: 8
      }
    ]
  },
  {
    id: 'black-forest-labs/flux-1.1-pro-ultra',
    name: 'Flux 1.1 Pro Ultra',
    description: 'High-quality professional image generation model',
    endpoint: 'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro-ultra/predictions',
    parameters: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: 'text',
        required: true,
        description: 'Text prompt for image generation',
        default: 'a majestic snow-capped mountain peak bathed in a warm glow of the setting sun',
        order: 0
      },
      {
        id: 'aspect_ratio',
        name: 'Aspect Ratio',
        type: 'select',
        required: false,
        description: 'Aspect ratio for the generated image',
        default: '1:1',
        options: [
          '21:9',
          '16:9',
          '3:2',
          '4:3',
          '5:4',
          '1:1',
          '4:5',
          '3:4',
          '2:3',
          '9:16',
          '9:21'
        ],
        order: 1
      },
      {
        id: 'safety_tolerance',
        name: 'Safety Tolerance',
        type: 'number',
        required: false,
        description: 'Safety tolerance, 1 is most strict and 6 is most permissive',
        default: 2,
        min: 1,
        max: 6,
        step: 1,
        order: 2
      },
      {
        id: 'seed',
        name: 'Seed',
        type: 'number',
        required: false,
        description: 'Random seed. Set for reproducible generation',
        default: '',
        order: 3
      },
      {
        id: 'raw',
        name: 'Raw',
        type: 'checkbox',
        required: false,
        description: 'Generate less processed, more natural-looking images',
        default: false,
        order: 4
      },
      {
        id: 'output_format',
        name: 'Output Format',
        type: 'select',
        required: false,
        description: 'Format of the output images.',
        default: 'jpg',
        options: ['jpg', 'png'],
        order: 5
      }
    ]
  },
  {
    id: 'black-forest-labs/flux-dev',
    name: 'Flux Dev',
    description: 'Experimental version of Flux with additional features',
    endpoint: 'https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions',
    parameters: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: 'text',
        required: true,
        description: 'Prompt for generated image',
        default: 'black forest gateau cake spelling out the words "FLUX DEV", tasty, food photography, dynamic shot',
        order: 0
      },
      {
        id: 'aspect_ratio',
        name: 'Aspect Ratio',
        type: 'select',
        required: false,
        description: 'Aspect ratio for the generated image',
        default: '1:1',
        options: [
          '1:1',
          '16:9',
          '21:9',
          '3:2',
          '2:3',
          '4:5',
          '5:4',
          '3:4',
          '4:3',
          '9:16',
          '9:21'
        ],
        order: 1
      },
      {
        id: 'guidance',
        name: 'Guidance',
        type: 'number',
        required: false,
        description: 'Guidance for generated image',
        default: 3,
        min: 0,
        max: 10,
        step: 0.1,
        order: 2
      },
      {
        id: 'num_inference_steps',
        name: 'Inference Steps',
        type: 'number',
        required: false,
        description: 'Number of denoising steps. Recommended range is 28-50, and lower number of steps produce lower quality outputs, faster.',
        default: 28,
        min: 1,
        max: 50,
        step: 1,
        order: 3
      },
      {
        id: 'seed',
        name: 'Seed',
        type: 'number',
        required: false,
        description: 'Random seed. Set for reproducible generation',
        default: '',
        order: 4
      },
      {
        id: 'output_format',
        name: 'Output Format',
        type: 'select',
        required: false,
        description: 'Format of the output images',
        default: 'webp',
        options: ['webp', 'jpg', 'png'],
        order: 5
      }
    ]
  },
  {
    id: 'black-forest-labs/flux-1.1-pro',
    name: 'Flux 1.1 Pro',
    description: 'Professional version of Flux for high-quality image generation',
    endpoint: 'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions',
    parameters: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: 'text',
        required: true,
        description: 'Text prompt for image generation',
        default: 'black forest gateau cake spelling out the words "FLUX 1 . 1 Pro", tasty, food photography',
        order: 0
      },
      {
        id: 'aspect_ratio',
        name: 'Aspect Ratio',
        type: 'select',
        required: false,
        description: 'Aspect ratio for the generated image',
        default: '1:1',
        options: [
          'custom',
          '1:1',
          '16:9',
          '3:2',
          '2:3',
          '4:5',
          '5:4',
          '9:16',
          '3:4',
          '4:3'
        ],
        order: 1
      },
      {
        id: 'width',
        name: 'Width',
        type: 'number',
        required: false,
        description: 'Width of the generated image in text-to-image mode. Only used when aspect_ratio=custom. Must be a multiple of 32.',
        default: 1024,
        min: 256,
        max: 1440,
        step: 32,
        order: 2,
        conditionalOn: { field: 'aspect_ratio', value: 'custom' }
      },
      {
        id: 'height',
        name: 'Height',
        type: 'number',
        required: false,
        description: 'Height of the generated image in text-to-image mode. Only used when aspect_ratio=custom. Must be a multiple of 32.',
        default: 1024,
        min: 256,
        max: 1440,
        step: 32,
        order: 3,
        conditionalOn: { field: 'aspect_ratio', value: 'custom' }
      },
      {
        id: 'safety_tolerance',
        name: 'Safety Tolerance',
        type: 'number',
        required: false,
        description: 'Safety tolerance, 1 is most strict and 6 is most permissive',
        default: 2,
        min: 1,
        max: 6,
        step: 1,
        order: 4
      },
      {
        id: 'seed',
        name: 'Seed',
        type: 'number',
        required: false,
        description: 'Random seed. Set for reproducible generation',
        default: '',
        order: 5
      },
      {
        id: 'prompt_upsampling',
        name: 'Prompt Upsampling',
        type: 'checkbox',
        required: false,
        description: 'Automatically modify the prompt for more creative generation',
        default: false,
        order: 6
      },
      {
        id: 'output_format',
        name: 'Output Format',
        type: 'select',
        required: false,
        description: 'Format of the output images.',
        default: 'webp',
        options: ['webp', 'jpg', 'png'],
        order: 7
      }
    ]
  },
  {
    id: 'black-forest-labs/flux-pro',
    name: 'Flux Pro',
    description: 'Professional version of Flux for high-quality image generation',
    endpoint: 'https://api.replicate.com/v1/models/black-forest-labs/flux-pro/predictions',
    parameters: [
      {
        id: 'prompt',
        name: 'Prompt',
        type: 'text',
        required: true,
        description: 'Text prompt for image generation',
        default: "The world's largest black forest cake, the size of a building, surrounded by trees of the black forest",
        order: 0
      },
      {
        id: 'aspect_ratio',
        name: 'Aspect Ratio',
        type: 'select',
        required: false,
        description: 'Aspect ratio for the generated image',
        default: '1:1',
        options: [
          'custom',
          '1:1',
          '16:9',
          '3:2',
          '2:3',
          '4:5',
          '5:4',
          '9:16',
          '3:4',
          '4:3'
        ],
        order: 1
      },
      {
        id: 'width',
        name: 'Width',
        type: 'number',
        required: false,
        description: 'Width of the generated image in text-to-image mode. Only used when aspect_ratio=custom. Must be a multiple of 32.',
        default: 1024,
        min: 256,
        max: 1440,
        step: 32,
        order: 2,
        conditionalOn: { field: 'aspect_ratio', value: 'custom' }
      },
      {
        id: 'height',
        name: 'Height',
        type: 'number',
        required: false,
        description: 'Height of the generated image in text-to-image mode. Only used when aspect_ratio=custom. Must be a multiple of 32.',
        default: 1024,
        min: 256,
        max: 1440,
        step: 32,
        order: 3,
        conditionalOn: { field: 'aspect_ratio', value: 'custom' }
      },
      {
        id: 'steps',
        name: 'Steps',
        type: 'number',
        required: false,
        description: 'Number of diffusion steps',
        default: 25,
        min: 1,
        max: 50,
        step: 1,
        order: 4
      },
      {
        id: 'guidance',
        name: 'Guidance',
        type: 'number',
        required: false,
        description: 'Controls the balance between adherence to the text prompt and image quality/diversity.',
        default: 3,
        min: 2,
        max: 5,
        step: 0.1,
        order: 5
      },
      {
        id: 'interval',
        name: 'Interval',
        type: 'number',
        required: false,
        description: 'Increases the variance in possible outputs letting the model be more dynamic.',
        default: 2,
        min: 1,
        max: 4,
        step: 0.1,
        order: 6
      },
      {
        id: 'safety_tolerance',
        name: 'Safety Tolerance',
        type: 'number',
        required: false,
        description: 'Safety tolerance, 1 is most strict and 6 is most permissive',
        default: 2,
        min: 1,
        max: 6,
        step: 1,
        order: 7
      },
      {
        id: 'seed',
        name: 'Seed',
        type: 'number',
        required: false,
        description: 'Random seed. Set for reproducible generation',
        default: '',
        order: 8
      },
      {
        id: 'output_format',
        name: 'Output Format',
        type: 'select',
        required: false,
        description: 'Format of the output images.',
        default: 'webp',
        options: ['webp', 'jpg', 'png'],
        order: 9
      }
    ]
  }
];

// Helper function to find a model by ID
export function getModelById(modelId) {
  return models.find(model => model.id === modelId) || null;
}

// Helper function to get all model options for dropdowns
export function getModelOptions() {
  return models.map(model => ({
    id: model.id,
    name: model.name,
    description: model.description
  }));
}

// Get default model
export function getDefaultModel() {
  return models[0];
}
