
import React from 'react';
import { FluxIcon } from './icons/FluxIcon';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl text-center">
      <div className="flex items-center justify-center gap-4 mb-2">
        <FluxIcon className="w-12 h-12 text-blue-400" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Flux LoRA Trainer
        </h1>
      </div>
      <p className="text-slate-400">Fine-tune your vision. Upload a dataset, configure, and train your custom LoRA model.</p>
    </header>
  );
};

export default Header;
