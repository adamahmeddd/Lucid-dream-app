import React, { useState } from 'react';
import { Moon, PlusCircle, BarChart2, BookOpen, Heart, Folder, Plus, Trash2 } from 'lucide-react';
import { ViewState, Section } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  sections: Section[];
  onAddSection: (name: string) => void;
  onDeleteSection: (id: string) => void;
  selectedSectionId?: string;
  onSelectSection: (id: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  setView, 
  sections, 
  onAddSection, 
  onDeleteSection,
  selectedSectionId, 
  onSelectSection 
}) => {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSectionName.trim()) {
      onAddSection(newSectionName.trim());
      setNewSectionName('');
      setIsAddingSection(false);
    }
  };

  const navItemClass = (isActive: boolean) =>
    `flex items-center p-3 mb-2 rounded-xl transition-all cursor-pointer w-full text-left ${
      isActive
        ? 'bg-mystic-600 text-white shadow-lg shadow-mystic-900/50'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`;

  return (
    <div className="w-full md:w-64 flex flex-col p-6 bg-slate-900/50 border-r border-slate-800 h-screen sticky top-0 overflow-y-auto">
      <div className="flex items-center gap-3 mb-10 px-2 shrink-0">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
          <Moon className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-400">
          Dreamscape
        </h1>
      </div>

      <nav className="flex-1 space-y-1">
        <button
          onClick={() => setView(ViewState.DASHBOARD)}
          className={navItemClass(currentView === ViewState.DASHBOARD)}
        >
          <BookOpen size={20} className="mr-3" />
          <span>Journal</span>
        </button>

        <button
          onClick={() => setView(ViewState.FAVORITES)}
          className={navItemClass(currentView === ViewState.FAVORITES)}
        >
          <Heart size={20} className="mr-3" />
          <span>Favorites</span>
        </button>

        <button
          onClick={() => setView(ViewState.NEW_ENTRY)}
          className={navItemClass(currentView === ViewState.NEW_ENTRY)}
        >
          <PlusCircle size={20} className="mr-3" />
          <span>New Dream</span>
        </button>

        <button
          onClick={() => setView(ViewState.STATS)}
          className={navItemClass(currentView === ViewState.STATS)}
        >
          <BarChart2 size={20} className="mr-3" />
          <span>Insights</span>
        </button>

        <div className="pt-6 pb-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 flex justify-between items-center">
            Collections
            <button 
              onClick={() => setIsAddingSection(true)}
              className="hover:text-mystic-400 transition-colors"
            >
              <Plus size={14} />
            </button>
          </h3>
          
          {isAddingSection && (
            <form onSubmit={handleCreateSection} className="px-2 mb-2">
              <input
                autoFocus
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                onBlur={() => !newSectionName && setIsAddingSection(false)}
                placeholder="Name..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-mystic-500 outline-none"
              />
            </form>
          )}

          <div className="space-y-1">
            {sections.map(section => (
              <div 
                key={section.id}
                className={`group flex items-center justify-between pr-1 rounded-xl transition-all ${
                  currentView === ViewState.SECTION && selectedSectionId === section.id 
                  ? 'bg-slate-800' 
                  : 'hover:bg-slate-800/50'
                }`}
              >
                <button
                  onClick={() => onSelectSection(section.id)}
                  className={`flex-1 flex items-center p-3 text-sm ${
                    currentView === ViewState.SECTION && selectedSectionId === section.id
                      ? 'text-mystic-300 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  <Folder size={16} className={`mr-3 ${currentView === ViewState.SECTION && selectedSectionId === section.id ? 'text-mystic-500' : 'text-slate-600'}`} />
                  <span className="truncate">{section.name}</span>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSection(section.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all"
                  title="Delete collection"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            
            {sections.length === 0 && !isAddingSection && (
               <p className="text-xs text-slate-600 px-3 italic mt-2">No collections yet.</p>
            )}
          </div>
        </div>
      </nav>

      <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700 shrink-0">
        <p className="text-xs text-slate-400 italic">
          "Dreams are the touchstones of our characters."
        </p>
        <p className="text-xs text-slate-500 mt-2 text-right">— Thoreau</p>
      </div>
    </div>
  );
};