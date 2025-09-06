import React, { useState, useCallback, useEffect } from 'react';
import { AppState, TrainingConfig, TrainingResult } from './types';
import { DEFAULT_TRAINING_CONFIG } from './constants';
import { generateSampleImages } from './services/geminiService';

import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import TrainingConfigForm from './components/TrainingConfig';
import TrainingProgress from './components/TrainingProgress';
import ResultsDisplay from './components/ResultsDisplay';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOADING);
  const [trainingFiles, setTrainingFiles] = useState<File[]>([]);
  const [trainingConfig, setTrainingConfig] = useState<TrainingConfig>(DEFAULT_TRAINING_CONFIG);
  const [trainingResult, setTrainingResult] = useState<TrainingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleDatasetSelected = (files: File[]) => {
    setTrainingFiles(files);
    setAppState(AppState.CONFIGURING);
  };

  const handleConfigSubmitted = async (config: TrainingConfig) => {
    if (trainingFiles.length === 0) {
      setError("No images were selected for training.");
      setAppState(AppState.UPLOADING);
      return;
    }

    setTrainingConfig(config);
    setAppState(AppState.TRAINING);
    setIsGenerating(true);
    setError(null);
    try {
      const baseImage = trainingFiles[0]; // Use the first uploaded image as the base
      const prompt = config.samplePrompt || `cinematic photo of a ${config.triggerWords} character, epic fantasy, high detail, masterpiece`;
      
      const images = await generateSampleImages(prompt, baseImage);
      
      if (images.length === 0) {
          throw new Error("The model did not return any images. This could be due to a safety policy or an API issue.");
      }

      setTrainingResult({
        modelName: config.modelTheme,
        sampleImages: images,
      });

      // Delay transition to results to make the training process feel more substantial
      setTimeout(() => {
        setAppState(AppState.RESULTS);
        setIsGenerating(false);
      }, 2000); // Wait 2 seconds after images are generated
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate sample images. ${errorMessage}`);
      setAppState(AppState.CONFIGURING); // Go back to config on error
      setIsGenerating(false);
    }
  };

  const handleGenerateMore = async (prompt: string): Promise<string[]> => {
    if (trainingFiles.length === 0) {
      setError("Base image for generation is missing. Please start over.");
      return [];
    }
    
    setIsGenerating(true);
    setError(null);
    try {
      const baseImage = trainingFiles[0];
      const newImages = await generateSampleImages(prompt, baseImage);
      setTrainingResult(prev => prev ? { ...prev, sampleImages: [...newImages, ...prev.sampleImages] } : null);
      return newImages;
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate more images. ${errorMessage}`);
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setAppState(AppState.UPLOADING);
    setTrainingFiles([]);
    setTrainingConfig(DEFAULT_TRAINING_CONFIG);
    setTrainingResult(null);
    setError(null);
  };
  
  const handleBackToConfig = () => {
    setAppState(AppState.CONFIGURING);
  }

  const renderContent = () => {
    switch (appState) {
      case AppState.UPLOADING:
        return <ImageUploader onNext={handleDatasetSelected} />;
      case AppState.CONFIGURING:
        return <TrainingConfigForm onStartTraining={handleConfigSubmitted} onBack={() => setAppState(AppState.UPLOADING)} />;
      case AppState.TRAINING:
        return <TrainingProgress />;
      case AppState.RESULTS:
        if (trainingResult) {
          return <ResultsDisplay result={trainingResult} config={trainingConfig} onGenerateMore={handleGenerateMore} onReset={handleReset} isGenerating={isGenerating} />;
        }
        return null; // Should not happen
      default:
        return <ImageUploader onNext={handleDatasetSelected} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-4xl mt-8">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;