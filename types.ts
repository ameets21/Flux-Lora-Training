export enum AppState {
  UPLOADING = 'UPLOADING',
  CONFIGURING = 'CONFIGURING',
  TRAINING = 'TRAINING',
  RESULTS = 'RESULTS',
}

export interface TrainingConfig {
  modelTheme: string;
  baseModel: string;
  networkModule: string;
  triggerWords: string;
  
  // Image Processing
  repeat: number;
  epoch: number;
  saveEveryNEpochs: number;
  resolution: string;

  // Training Parameters
  seed: number;
  clipSkip: string;
  textEncoderLearningRate: string;
  unetLearningRate: string;
  lrScheduler: string;
  lrSchedulerNumCycles: number;
  numWarmupSteps: number;
  optimizer: string;
  networkDim: number;
  networkAlpha: number;
  gradientAccumulationSteps: number;

  // Label Parameters
  shuffleCaption: boolean;
  keepNTokens: number;

  // Advanced Parameters
  noiseOffset: number;
  multiresNoiseDiscount: number;
  multiresNoiseIterations: number;
  convDim: number;
  convAlpha: number;

  // Sample Image Settings
  samplePrompt: string;
  sampleImageSize: string;
  sampleSampler: string;
}


export interface TrainingResult {
  modelName: string;
  sampleImages: string[];
}