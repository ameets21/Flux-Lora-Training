import React, { useState, PropsWithChildren } from 'react';
import { TrainingConfig } from '../types';
import { DEFAULT_TRAINING_CONFIG, BASE_MODELS, NETWORK_MODULES, RESOLUTIONS, CLIP_SKIPS, LR_SCHEDULERS, OPTIMIZERS, SAMPLERS, SAMPLE_IMAGE_SIZES, MODEL_THEMES } from '../constants';
import { InfoIcon } from './icons/InfoIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ShuffleIcon } from './icons/ShuffleIcon';
import { ResolutionIcon } from './icons/ResolutionIcon';

interface TrainingConfigProps {
  onStartTraining: (config: TrainingConfig) => void;
  onBack: () => void;
}

// Helper components scoped to this file
const Section: React.FC<PropsWithChildren<{ title: string, initialOpen?: boolean }>> = ({ title, children, initialOpen = true }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  return (
    <div className="border-t border-slate-700 pt-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left text-lg font-semibold text-slate-300 hover:text-white">
        {title}
        {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
      </button>
      {isOpen && <div className="mt-4 space-y-6">{children}</div>}
    </div>
  );
};

// FIX: Made htmlFor optional to allow the Label component to be used for general purposes.
const Label: React.FC<PropsWithChildren<{ htmlFor?: string, tooltip?: string }>> = ({ htmlFor, tooltip, children }) => (
    <label htmlFor={htmlFor} className="flex items-center text-sm font-medium text-slate-300 mb-2">
        {children}
        {tooltip && <InfoIcon className="w-4 h-4 ml-1.5 text-slate-500" title={tooltip} />}
    </label>
);

const SliderInput: React.FC<{ label: string, name: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, min?: number, max?: number, step?: number, tooltip?: string }> = 
({ label, name, value, onChange, min = 0, max = 128, step = 1, tooltip }) => (
    <div>
        <Label htmlFor={name} tooltip={tooltip}>{label}</Label>
        <div className="flex items-center gap-4">
            <input type="range" name={name} value={value} onChange={onChange} min={min} max={max} step={step} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            <input type="number" name={name} value={value} onChange={onChange} min={min} max={max} step={step} className="w-24 bg-slate-900/80 border border-slate-700 rounded-md py-1.5 px-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
    </div>
);

const TextInput: React.FC<{ label: string, name: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, type?: string }> =
({ label, name, value, onChange, placeholder, type = 'text' }) => (
    <div>
        <Label htmlFor={name}>{label}</Label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-slate-900/80 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
);

const SelectInput: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[] }> =
({ label, name, value, onChange, options }) => (
    <div>
        <Label htmlFor={name}>{label}</Label>
        <select id={name} name={name} value={value} onChange={onChange} className="w-full bg-slate-900/80 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-chevron-down">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);


const TrainingConfigForm: React.FC<TrainingConfigProps> = ({ onStartTraining, onBack }) => {
  const [config, setConfig] = useState<TrainingConfig>(DEFAULT_TRAINING_CONFIG);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number | boolean = value;

    if (type === 'number' || type === 'range') {
        processedValue = value === '' ? 0 : parseFloat(value);
    }
    
    if (type === 'checkbox') {
        processedValue = (e.target as HTMLInputElement).checked;
    }

    setConfig(prev => ({ ...prev, [name]: processedValue }));
  };
  
  const handleRandomizeSeed = () => {
      setConfig(prev => ({ ...prev, seed: Math.floor(Math.random() * 1000000) }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartTraining(config);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-sm text-slate-300">
      <style>{`
        .bg-chevron-down {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
        }
      `}</style>
      <h2 className="text-2xl font-semibold mb-6 text-slate-100">2. Configure Training Parameters</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Model Theme */}
        <div>
            <Label htmlFor="modelTheme">Model Theme</Label>
            <div className="flex space-x-2 overflow-x-auto pb-2 -mx-2 px-2">
                {MODEL_THEMES.map(theme => (
                    <div key={theme.name} onClick={() => setConfig(prev => ({...prev, modelTheme: theme.name}))}
                        className={`cursor-pointer rounded-lg border-2 p-1 transition-all ${config.modelTheme === theme.name ? 'border-blue-500' : 'border-transparent hover:border-slate-600'}`}>
                        <img src={theme.imageUrl} alt={theme.name} className="w-24 h-32 object-cover rounded-md" />
                        <p className="text-center text-sm mt-1">{theme.name}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectInput label="Use Base Model" name="baseModel" value={config.baseModel} onChange={handleChange} options={BASE_MODELS} />
            <SelectInput label="Network Module" name="networkModule" value={config.networkModule} onChange={handleChange} options={NETWORK_MODULES} />
        </div>
        <TextInput label="Trigger words" name="triggerWords" value={config.triggerWords} onChange={handleChange} placeholder="e.g., ohwx style" />

        <Section title="Image Processing Parameters">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <SliderInput label="Repeat" name="repeat" value={config.repeat} onChange={handleChange} min={1} max={50} tooltip="Number of times to repeat the training images per epoch." />
                <SliderInput label="Epoch" name="epoch" value={config.epoch} onChange={handleChange} min={1} max={50} tooltip="Number of full training cycles through the dataset." />
            </div>
            <SliderInput label="Save Every N Epochs" name="saveEveryNEpochs" value={config.saveEveryNEpochs} onChange={handleChange} min={1} max={config.epoch} />
            <SelectInput label="Resolution" name="resolution" value={config.resolution} onChange={handleChange} options={RESOLUTIONS} />
        </Section>
        
        <Section title="Training Parameters">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <Label htmlFor="seed">Seed</Label>
                    <div className="flex">
                        <input type="number" id="seed" name="seed" value={config.seed} onChange={handleChange} className="w-full bg-slate-900/80 border border-slate-700 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button type="button" onClick={handleRandomizeSeed} className="bg-slate-700 hover:bg-slate-600 px-3 rounded-r-md border border-l-0 border-slate-700"><ShuffleIcon className="w-5 h-5" /></button>
                    </div>
                </div>
                <SelectInput label="Clip Skip" name="clipSkip" value={config.clipSkip} onChange={handleChange} options={CLIP_SKIPS} />
                <TextInput label="Text Encoder learning rate" name="textEncoderLearningRate" value={config.textEncoderLearningRate} onChange={handleChange} />
                <TextInput label="Unet/DiT learning rate" name="unetLearningRate" value={config.unetLearningRate} onChange={handleChange} />
                <SelectInput label="LR Scheduler" name="lrScheduler" value={config.lrScheduler} onChange={handleChange} options={LR_SCHEDULERS} />
                <SelectInput label="Optimizer" name="optimizer" value={config.optimizer} onChange={handleChange} options={OPTIMIZERS} />
                <SliderInput label="lr_scheduler_num_cycles" name="lrSchedulerNumCycles" value={config.lrSchedulerNumCycles} onChange={handleChange} min={1} max={20}/>
                <SliderInput label="num_warmup_steps" name="numWarmupSteps" value={config.numWarmupSteps} onChange={handleChange} min={0} max={500}/>
                <SliderInput label="Network Dim" name="networkDim" value={config.networkDim} onChange={handleChange} min={4} max={128} step={4} />
                <SliderInput label="Network Alpha" name="networkAlpha" value={config.networkAlpha} onChange={handleChange} min={1} max={64} />
                <div>
                    <Label htmlFor="gradientAccumulationSteps">Gradient Accumulation Steps</Label>
                    <input type="number" id="gradientAccumulationSteps" name="gradientAccumulationSteps" value={config.gradientAccumulationSteps} onChange={handleChange} className="w-full bg-slate-900/80 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
        </Section>
        
        <Section title="Label Parameters" initialOpen={false}>
            <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-md border border-slate-700">
              <Label htmlFor="shuffleCaption">Shuffle caption</Label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="shuffleCaption" checked={config.shuffleCaption} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <SliderInput label="Keep n tokens" name="keepNTokens" value={config.keepNTokens} onChange={handleChange} min={0} max={10} />
        </Section>
        
        <Section title="Advanced Parameters" initialOpen={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <SliderInput label="Noise offset" name="noiseOffset" value={config.noiseOffset} onChange={handleChange} min={0} max={0.2} step={0.01} />
                <SliderInput label="Multires noise discount" name="multiresNoiseDiscount" value={config.multiresNoiseDiscount} onChange={handleChange} min={0} max={1} step={0.1} />
                <SliderInput label="Multires noise iterations" name="multiresNoiseIterations" value={config.multiresNoiseIterations} onChange={handleChange} min={0} max={20} />
                 <TextInput label="conv_dim" name="convDim" value={config.convDim} onChange={handleChange} type="number" />
                <TextInput label="conv_alpha" name="convAlpha" value={config.convAlpha} onChange={handleChange} type="number" />
            </div>
        </Section>

        <Section title="Sample Image Settings">
            <div>
              <Label htmlFor="samplePrompt">Prompt</Label>
              <div className="relative">
                <input type="text" id="samplePrompt" name="samplePrompt" value={config.samplePrompt} onChange={handleChange} className="w-full bg-slate-900/80 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" onClick={() => setConfig(prev => ({...prev, samplePrompt: ''}))} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-white">&times;</button>
              </div>
            </div>
            <div>
              <Label>Image Size</Label>
              <div className="flex items-center gap-2">
                  {SAMPLE_IMAGE_SIZES.map(size => {
                    const [w, h] = size.split('x');
                    const isPortrait = parseInt(h) > parseInt(w);
                    const isLandscape = parseInt(w) > parseInt(h);
                    return (
                      <button key={size} type="button" onClick={() => setConfig(prev => ({...prev, sampleImageSize: size}))}
                        className={`flex items-center gap-2 py-2 px-4 rounded-md transition-colors text-sm ${config.sampleImageSize === size ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                      >
                        <ResolutionIcon landscape={isLandscape} portrait={isPortrait} />
                        {size}
                      </button>
                    )
                  })}
              </div>
            </div>
            <SelectInput label="Sampler" name="sampleSampler" value={config.sampleSampler} onChange={handleChange} options={SAMPLERS} />
        </Section>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-700">
          <button type="button" onClick={onBack} className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">Back</button>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Start Training</button>
        </div>
      </form>
    </div>
  );
};

export default TrainingConfigForm;
