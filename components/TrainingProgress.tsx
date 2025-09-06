
import React, { useState, useEffect } from 'react';

const trainingSteps = [
    "Initializing training environment...",
    "Loading dataset into memory...",
    "Compiling model architecture...",
    "Starting epoch 1/10...",
    "Optimizing... loss: 0.1234",
    "Epoch 5/10 complete...",
    "Calculating validation accuracy...",
    "Almost there... finalizing layers...",
    "Generating sample images..."
];


const TrainingProgress: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(trainingSteps[0]);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 1;
            });
        }, 120);

        const stepInterval = setInterval(() => {
            setCurrentStep(prev => {
                const currentIndex = trainingSteps.indexOf(prev);
                if (currentIndex < trainingSteps.length - 1) {
                    return trainingSteps[currentIndex + 1];
                }
                clearInterval(stepInterval);
                return prev;
            });
        }, 1500);


        return () => {
            clearInterval(progressInterval);
            clearInterval(stepInterval);
        };
    }, []);

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 shadow-lg backdrop-blur-sm flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4 text-slate-100">3. Training in Progress</h2>
            <p className="text-slate-400 mb-8">Please wait while your LoRA model is being trained...</p>

            <div className="w-full max-w-md">
                <div className="w-full bg-slate-700 rounded-full h-4 mb-4 overflow-hidden border border-slate-600">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="text-center font-mono text-sm text-blue-300 tracking-wider">
                    <p>{currentStep}</p>
                </div>
            </div>
        </div>
    );
};

export default TrainingProgress;
