import React, { useState } from 'react';
import { Moon, PlusCircle, BarChart2, BookOpen, Heart, Folder, Plus, Trash2, Crown, Lock, Menu, X } from 'lucide-react';
import { ViewState, Section } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  sections: Section[];
  onAddSection: (name: string) => void;
  onDeleteSection: (id: string) => void;
  selectedSectionId?: string;
  onSelectSection: (id: string) => void;
  isPremium: boolean;
  onOpenPremium: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  setView, 
  sections, 
  onAddSection, 
  onDeleteSection,
  selectedSectionId, 
  onSelectSection,
  isPremium,
  onOpenPremium
}) => {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSectionName.trim()) {
      onAddSection(newSectionName.trim());
      setNewSectionName('');
      setIsAddingSection(false);
    }
  };

  const handleAddClick = () => {
      if (!isPremium) {
          onOpenPremium();
          return;
      }
      setIsAddingSection(true);
  }

  const handleNavClick = (view: ViewState) => {
    setView(view);
    setIsMobileMenuOpen(false);
  }

  const handleSectionClick = (id: string) => {
    onSelectSection(id);
    setIsMobileMenuOpen(false);
  }

  const navItemClass = (isActive: boolean) =>
    `flex items-center p-3 mb-2 rounded-xl transition-all cursor-pointer w-full text-left ${
      isActive
        ? 'bg-mystic-600 text-white shadow-lg shadow-mystic-900/50'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`;

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-30 shrink-0 h-16">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <Moon className="text-white" size={18} />
          </div>
          <span className="font-serif font-bold text-lg text-slate-100">Dream Lab</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar / Drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 h-[100dvh] flex flex-col transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        md:static md:translate-x-0 md:w-64 md:h-full
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6 overflow-y-auto">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-8 shrink-0">
             <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg hidden md:block">
                <Moon className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-400 hidden md:block">
                Dream Lab
              </h1>
              {/* Mobile Only Logo in Drawer */}
              <h1 className="text-xl font-serif font-bold text-slate-200 md:hidden">
                Menu
              </h1>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            <button
              onClick={() => handleNavClick(ViewState.DASHBOARD)}
              className={navItemClass(currentView === ViewState.DASHBOARD)}
            >
              <BookOpen size={20} className="mr-3" />
              <span>Journal</span>
            </button>

            <button
              onClick={() => handleNavClick(ViewState.FAVORITES)}
              className={navItemClass(currentView === ViewState.FAVORITES)}
            >
              <Heart size={20} className="mr-3" />
              <span>Favorites</span>
            </button>

            <button
              onClick={() => handleNavClick(ViewState.NEW_ENTRY)}
              className={navItemClass(currentView === ViewState.NEW_ENTRY)}
            >
              <PlusCircle size={20} className="mr-3" />
              <span>New Dream</span>
            </button>

            <button
              onClick={() => handleNavClick(ViewState.STATS)}
              className={navItemClass(currentView === ViewState.STATS)}
            >
              <BarChart2 size={20} className="mr-3" />
              <span>Insights</span>
            </button>

            <div className="pt-6 pb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 flex justify-between items-center">
                Collections
                <button 
                  onClick={handleAddClick}
                  className="hover:text-mystic-400 transition-colors p-1"
                >
                  {isPremium ? <Plus size={14} /> : <Lock size={12} className="text-amber-500" />}
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base md:text-sm text-white focus:border-mystic-500 outline-none"
                  />
                </form>
              )}

              <div className="space-y-2">
                {sections.map(section => (
                  <div 
                    key={section.id}
                    className={`group flex items-center justify-between pl-0 rounded-xl transition-all overflow-hidden ${
                      currentView === ViewState.SECTION && selectedSectionId === section.id 
                      ? 'bg-slate-800' 
                      : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <button
                      onClick={() => handleSectionClick(section.id)}
                      className={`flex-1 flex items-center p-3 text-sm text-left truncate ${
                        currentView === ViewState.SECTION && selectedSectionId === section.id
                          ? 'text-mystic-300 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      <Folder size={16} className={`mr-3 shrink-0 ${currentView === ViewState.SECTION && selectedSectionId === section.id ? 'text-mystic-500' : 'text-slate-600'}`} />
                      <span className="truncate">{section.name}</span>
                    </button>
                    
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Only stop bubbling, do not prevent default
                        onDeleteSection(section.id);
                      }}
                      className="p-3 bg-slate-800/80 text-slate-500 hover:bg-red-900/50 hover:text-red-400 transition-colors cursor-pointer shrink-0 border-l border-slate-700/50"
                      title="Delete collection"
                      aria-label="Delete collection"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                
                {sections.length === 0 && !isAddingSection && (
                  <p className="text-xs text-slate-600 px-3 italic mt-2">
                    {isPremium ? "No collections yet." : "Upgrade to create collections."}
                  </p>
                )}
              </div>
            </div>
          </nav>

          {/* Premium CTA */}
          {!isPremium && (
              <div className="mb-6 mt-auto mx-2 shrink-0">
                <button 
                    onClick={() => {
                        onOpenPremium();
                        setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 p-3 rounded-xl shadow-lg shadow-amber-900/30 group hover:scale-[1.02] transition-transform"
                >
                    <div className="flex items-center justify-center gap-2 text-white font-bold text-sm mb-1">
                        <Crown size={16} className="text-yellow-200" />
                        Go Premium
                    </div>
                    <p className="text-xs text-amber-100 text-center opacity-90">Unlock interpretation & more</p>
                </button>
              </div>
          )}

          {isPremium && (
              <div className="mb-6 mt-auto mx-2 flex items-center justify-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-widest bg-amber-950/30 p-2 rounded-lg border border-amber-900/50 shrink-0">
                  <Crown size={12} /> Premium Active
              </div>
          )}

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 shrink-0">
            <p className="text-xs text-slate-400 italic">
              "Dreams are the touchstones of our characters."
            </p>
            <p className="text-xs text-slate-500 mt-2 text-right">— Thoreau</p>
          </div>
        </div>
      </div>
    </>
  );
};