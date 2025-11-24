import React, { useState, useEffect } from 'react';
import { Dream, Section } from '../types';
import { analyzeDreamContent, generateDreamVisual } from '../services/gemini';
import { saveDream, getSections } from '../services/storage';
import { Sparkles, Loader2, Save, Eye, EyeOff, Tag, X, Heart, Folder } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface DreamEntryProps {
  onComplete: () => void;
}

export const DreamEntry: React.FC<DreamEntryProps> = ({ onComplete }) => {
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string>('');
  
  // New features
  const [isLucid, setIsLucid] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentLabel, setCurrentLabel] = useState('');
  const [customLabels, setCustomLabels] = useState<string[]>([]);
  
  // Section handling
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');

  useEffect(() => {
    setSections(getSections());
  }, []);

  const handleAddLabel = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentLabel.trim()) {
      e.preventDefault();
      if (!customLabels.includes(currentLabel.trim())) {
        setCustomLabels([...customLabels, currentLabel.trim()]);
      }
      setCurrentLabel('');
    }
  };

  const removeLabel = (label: string) => {
    setCustomLabels(customLabels.filter(l => l !== label));
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsProcessing(true);
    setStatus('Consulting the oracle...');

    try {
      // 1. Analyze
      const analysis = await analyzeDreamContent(content);
      
      setStatus('Weaving dreamscape...');
      // 2. Generate Image
      let imageUrl: string | undefined;
      try {
        imageUrl = await generateDreamVisual(content, analysis.mood);
      } catch (err) {
        console.warn("Image gen failed, skipping", err);
      }

      // 3. Save
      const newDream: Dream = {
        id: uuidv4(),
        date: new Date().toISOString(),
        content,
        analysis,
        imageUrl,
        isFavorite,
        isLucid,
        customLabels,
        sectionId: selectedSectionId || undefined,
      };

      saveDream(newDream);
      onComplete();
    } catch (error) {
      console.error(error);
      alert('Something went wrong while interpreting your dream. Please check your connection.');
    } finally {
      setIsProcessing(false);
      setStatus('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-float">
      <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
        <h2 className="text-3xl font-serif text-indigo-100 mb-6 flex items-center gap-3">
          <Sparkles className="text-yellow-400" />
          Record Your Dream
        </h2>
        
        {/* Controls Section */}
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
                <button
                    onClick={() => setIsLucid(!isLucid)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                        isLucid 
                        ? 'bg-gradient-to-r from-purple-900 to-indigo-900 border-lucid-500 text-lucid-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                        : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                >
                    {isLucid ? <Eye size={18} /> : <EyeOff size={18} />}
                    <span className="font-bold">{isLucid ? 'Lucid Dream' : 'Regular Dream'}</span>
                </button>

                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                        isFavorite 
                        ? 'bg-pink-900/40 border-pink-500 text-pink-400' 
                        : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                >
                    <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                    <span className="font-bold">Favorite</span>
                </button>

                {sections.length > 0 && (
                  <div className="relative">
                     <Folder size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                     <select
                        value={selectedSectionId}
                        onChange={(e) => setSelectedSectionId(e.target.value)}
                        className="bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-xl py-2 pl-9 pr-8 focus:outline-none focus:border-mystic-500 appearance-none cursor-pointer hover:bg-slate-800"
                     >
                        <option value="">No Collection</option>
                        {sections.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                     </select>
                  </div>
                )}
            </div>

            <div className="flex-1 min-w-[200px] relative">
                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                    type="text" 
                    value={currentLabel}
                    onChange={(e) => setCurrentLabel(e.target.value)}
                    onKeyDown={handleAddLabel}
                    placeholder="Add custom labels (Press Enter)"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-mystic-500 transition-colors"
                />
            </div>
        </div>

        {/* Labels Display */}
        {customLabels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 animate-fadeIn">
                {customLabels.map(label => (
                    <span key={label} className="flex items-center gap-1 px-3 py-1 bg-indigo-900/40 border border-indigo-700/50 rounded-full text-xs text-indigo-200">
                        {label}
                        <button onClick={() => removeLabel(label)} className="hover:text-white"><X size={12} /></button>
                    </span>
                ))}
            </div>
        )}
        
        <div className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="I was floating above a neon city..."
            className="w-full h-64 bg-slate-900/50 border border-slate-700 rounded-xl p-6 text-lg text-slate-200 focus:ring-2 focus:ring-mystic-500 focus:outline-none resize-none transition-all placeholder-slate-600 font-serif leading-relaxed"
            disabled={isProcessing}
          />
        </div>

        <div className="flex items-center justify-between">
            <div className="text-slate-400 text-sm">
                {isProcessing ? (
                    <span className="flex items-center gap-2 text-mystic-400">
                        <Loader2 className="animate-spin" size={16}/>
                        {status}
                    </span>
                ) : (
                    <span>Share as much detail as you can remember.</span>
                )}
            </div>

            <button
                onClick={handleSubmit}
                disabled={!content.trim() || isProcessing}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${
                    !content.trim() || isProcessing
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-mystic-600 to-indigo-600 text-white shadow-lg shadow-mystic-900/50 hover:shadow-mystic-600/50'
                }`}
            >
                {isProcessing ? 'Interpreting...' : 'Interpret Dream'}
                {!isProcessing && <Save size={18} />}
            </button>
        </div>
      </div>
    </div>
  );
};