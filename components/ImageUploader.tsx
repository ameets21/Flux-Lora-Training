
import React, { useState, useCallback, useEffect } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onNext: (files: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onNext }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setFiles(Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/')));
      event.dataTransfer.clearData();
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);
  
  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);


  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-sm">
      <h2 className="text-2xl font-semibold mb-4 text-slate-100">1. Upload Your Dataset</h2>
      <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors duration-300 ${isDragging ? 'border-blue-400 bg-slate-700/50' : 'border-slate-600 hover:border-blue-500'}`}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
          <UploadIcon className="w-12 h-12 text-slate-400 mb-4" />
          <span className="font-semibold text-blue-400">Click to upload</span>
          <span className="text-slate-400">or drag and drop</span>
          <span className="text-xs text-slate-500 mt-2">PNG, JPG, WEBP recommended</span>
        </label>
      </div>

      {previews.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-3">{previews.length} image(s) selected</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-60 overflow-y-auto p-2 bg-slate-900/50 rounded-lg">
            {previews.map((preview, index) => (
              <img key={index} src={preview} alt={`preview ${index}`} className="w-full h-full object-cover rounded-md aspect-square" />
            ))}
          </div>
          <button
            onClick={() => onNext(files)}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Next: Configure Training
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
