import { TrainingConfig } from './types';

export const BASE_MODELS = ['Flux.1 (Dev-fp8)', 'Flux.1-sde', 'Flux.1-dev'];
export const NETWORK_MODULES = ['LoRA'];
export const RESOLUTIONS = ['1024x1024', '768x1024', '1024x768'];
export const CLIP_SKIPS = ['1', '2', '3'];
export const LR_SCHEDULERS = ['constant', 'cosine', 'linear'];
export const OPTIMIZERS = ['AdamW8bit', 'AdamW', 'SGD'];
export const SAMPLERS = ['euler', 'euler_a', 'dpm++'];
export const SAMPLE_IMAGE_SIZES = ['768x1024', '1024x1024', '1024x768'];

export const MODEL_THEMES = [
  { name: 'Fast', imageUrl: 'https://placehold.co/150x200/0d0f1e/7e8aff.png?text=Flux' },
  { name: 'Anime', imageUrl: 'https://placehold.co/150x200/2a2a32/ff9e8a.png?text=Anime' },
  { name: 'Realistic', imageUrl: 'https://placehold.co/150x200/3c3836/e8d8c4.png?text=Realistic' },
  { name: '2.5D', imageUrl: 'https://placehold.co/150x200/1e293b/a7f3d0.png?text=2.5D' },
  { name: 'Standard', imageUrl: 'https://placehold.co/150x200/1e1b4b/6d28d9.png?text=SD3' },
];

export const DEFAULT_TRAINING_CONFIG: TrainingConfig = {
  modelTheme: 'Fast',
  baseModel: BASE_MODELS[0],
  networkModule: NETWORK_MODULES[0],
  triggerWords: '',

  // Image Processing
  repeat: 20,
  epoch: 10,
  saveEveryNEpochs: 1,
  resolution: RESOLUTIONS[0],

  // Training Parameters
  seed: 0,
  clipSkip: CLIP_SKIPS[0],
  textEncoderLearningRate: '0.00001',
  unetLearningRate: '0.0001',
  lrScheduler: LR_SCHEDULERS[0],
  lrSchedulerNumCycles: 1,
  numWarmupSteps: 0,
  optimizer: OPTIMIZERS[0],
  networkDim: 64,
  networkAlpha: 32,
  gradientAccumulationSteps: 1,

  // Label Parameters
  shuffleCaption: false,
  keepNTokens: 0,

  // Advanced Parameters
  noiseOffset: 0.03,
  multiresNoiseDiscount: 0.1,
  multiresNoiseIterations: 10,
  convDim: 0,
  convAlpha: 0,

  // Sample Image Settings
  samplePrompt: '1girl',
  sampleImageSize: SAMPLE_IMAGE_SIZES[0],
  sampleSampler: SAMPLERS[0],
};