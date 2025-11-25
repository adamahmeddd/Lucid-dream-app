import React from 'react';
import { Dream } from '../types';
import { Calendar, Tag, Sparkles, Heart, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface DreamCardProps {
  dream: Dream;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export const DreamCard: React.FC<DreamCardProps> = ({ dream, onClick, onDelete }) => {
  const { analysis, date, imageUrl, isLucid, customLabels, isFavorite } = dream;
  
  // Default values if analysis failed but saved
  const title = analysis?.title || "Untitled Dream";
  const summary = analysis?.summary || dream.content.substring(0, 100) + "...";
  const mood = analysis?.mood || "Neutral";
  const color = analysis?.colorHex || "#64748b";

  return (
    <div 
        onClick={onClick}
        className={`group relative bg-slate-800/30 hover:bg-slate-800/60 border rounded-2xl p-0 cursor-pointer transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-mystic-900/20 ${
            isLucid ? 'border-lucid-500/30 hover:border-lucid-500/60' : 'border-slate-700/50 hover:border-mystic-500/50'
        }`}
    >
        <div className="flex flex-col md:flex-row h-full">
            {/* Image Section */}
            <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0 bg-slate-900 relative overflow-hidden">
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt="Dream visualization" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
                        <span className="text-4xl opacity-20">?</span>
                    </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                   {mood}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col justify-between flex-1 relative">
                {isFavorite && (
                    <div className="absolute top-4 right-4 text-pink-500 z-10 bg-slate-900/50 p-1.5 rounded-full backdrop-blur-sm">
                        <Heart size={16} fill="currentColor" />
                    </div>
                )}
                
                {isLucid && (
                    <div className="absolute top-0 right-0 p-2 z-10">
                        <div className="lucid-gradient animate-shimmer text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-lg">
                            <span className="flex items-center gap-1"><Sparkles size={10} /> Lucid</span>
                        </div>
                    </div>
                )}

                <div>
                    <div className="flex items-center justify-between mb-2 pr-20">
                        <h3 className="text-xl font-serif font-bold text-slate-100 group-hover:text-mystic-300 transition-colors truncate">
                            {title}
                        </h3>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {format(new Date(date), 'MMM d, yyyy')}
                        </span>
                        {customLabels && customLabels.map(label => (
                            <span key={label} className="text-indigo-300 bg-indigo-900/30 px-2 py-0.5 rounded border border-indigo-500/30">
                                {label}
                            </span>
                        ))}
                    </div>

                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4">
                        {summary}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto items-center justify-between">
                    <div className="flex gap-2">
                        {analysis?.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300 flex items-center gap-1">
                                <Tag size={10} /> {tag}
                            </span>
                        ))}
                    </div>
                    
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(dream.id);
                        }}
                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-slate-800 rounded-full transition-colors z-20"
                        title="Delete dream"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};