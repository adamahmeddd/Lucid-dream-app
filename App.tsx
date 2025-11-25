import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { DreamEntry } from './components/DreamEntry';
import { DreamCard } from './components/DreamCard';
import { DreamDetail } from './components/DreamDetail';
import { Stats } from './components/Stats';
import { SubscriptionModal } from './components/SubscriptionModal';
import { getDreams, getSections, saveSection, deleteSection, getPremiumStatus, savePremiumStatus, deleteDream } from './services/storage';
import { Dream, ViewState, Section } from './types';
import { Plus, Heart, Folder, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(undefined);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  
  // Premium State
  const [isPremium, setIsPremium] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    console.log("Dream Lab v2.0 Initializing...");

    // 1. Check for API Key
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
    }

    // 2. Load Data
    loadData();
    setIsPremium(getPremiumStatus());

    // 3. CHECK FOR PAYMENT SUCCESS (The Secret Link Logic)
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success') === 'true') {
        console.log("Payment successful! Unlocking Premium...");
        handleUpgrade();
        setShowSuccessMessage(true);
        // Clean the URL so they don't see the messy code
        window.history.replaceState({}, document.title, "/");
        // Hide success message after 5 seconds
        setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, []);

  const loadData = () => {
    setDreams(getDreams());
    setSections(getSections());
  };

  const handleUpgrade = () => {
      setIsPremium(true);
      savePremiumStatus(true);
  };

  const handleAddSection = (name: string) => {
    saveSection({ id: uuidv4(), name });
    loadData();
  };

  const handleDeleteSection = (id: string) => {
      deleteSection(id);
      if (selectedSectionId === id) {
          setView(ViewState.DASHBOARD);
          setSelectedSectionId(undefined);
      }
      loadData();
  };

  const handleDeleteDream = (id: string) => {
      deleteDream(id);
      loadData();
  };

  const handleDreamClick = (dream: Dream) => {
    setSelectedDream(dream);
    setView(ViewState.DREAM_DETAIL);
  };

  const handleBackToDashboard = () => {
    setSelectedDream(null);
    if (view !== ViewState.SECTION && view !== ViewState.FAVORITES) {
        setView(ViewState.DASHBOARD);
    }
    loadData();
  };

  const getFilteredDreams = () => {
      switch (view) {
          case ViewState.FAVORITES:
              return dreams.filter(d => d.isFavorite);
          case ViewState.SECTION:
              return dreams.filter(d => d.sectionId === selectedSectionId);
          case ViewState.DASHBOARD:
          default:
              return dreams;
      }
  };

  const renderContent = () => {
    if (apiKeyMissing) {
      return (
        <div className="flex items-center justify-center h-full text-red-400">
          <div className="text-center p-8 bg-slate-800 rounded-xl border border-red-900">
            <h2 className="text-xl font-bold mb-2">Configuration Error</h2>
            <p>API_KEY environment variable is missing.</p>
            <p className="text-sm text-slate-500 mt-2">Please configure your Gemini API Key in Vercel.</p>
          </div>
        </div>
      );
    }

    switch (view) {
      case ViewState.NEW_ENTRY:
        return <DreamEntry 
            onComplete={() => {
                loadData();
                setView(ViewState.DASHBOARD);
            }} 
            isPremium={isPremium}
            onOpenPremium={() => setIsSubscriptionModalOpen(true)}
        />;
      
      case ViewState.DREAM_DETAIL:
        return selectedDream ? (
            <DreamDetail 
                dream={selectedDream} 
                onBack={handleBackToDashboard} 
                onDelete={() => {
                    setSelectedDream(null);
                    setView(ViewState.DASHBOARD);
                    loadData();
                }}
                isPremium={isPremium}
                onOpenPremium={() => setIsSubscriptionModalOpen(true)}
            />
        ) : (
            <div onClick={handleBackToDashboard}>Error: Dream not found. Click to go back.</div>
        );

      case ViewState.STATS:
        return <Stats dreams={dreams} />;

      case ViewState.DASHBOARD:
      case ViewState.FAVORITES:
      case ViewState.SECTION:
        const filteredDreams = getFilteredDreams();
        const sectionName = view === ViewState.SECTION ? sections.find(s => s.id === selectedSectionId)?.name : '';
        
        return (
          <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-slate-100 flex items-center gap-3">
                        {view === ViewState.FAVORITES && <Heart className="text-pink-500" fill="currentColor"/>}
                        {view === ViewState.SECTION && <Folder className="text-mystic-500" fill="currentColor"/>}
                        
                        {view === ViewState.DASHBOARD && 'Dream Journal'}
                        {view === ViewState.FAVORITES && 'Favorites'}
                        {view === ViewState.SECTION && (sectionName || 'Collection')}
                    </h2>
                    <p className="text-slate-400 mt-1">
                        {view === ViewState.DASHBOARD && 'Explore your subconscious mind.'}
                        {view === ViewState.FAVORITES && 'Your most treasured night visions.'}
                        {view === ViewState.SECTION && `Dreams collected in "${sectionName}".`}
                    </p>
                </div>
                <button 
                onClick={() => setView(ViewState.NEW_ENTRY)}
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-colors shadow-lg shadow-indigo-900/20"
                >
                    <Plus size={16} /> New Dream
                </button>
            </div>
            
            {filteredDreams.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500 bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-700 p-6 text-center">
                   <p className="mb-4 text-lg">No dreams found here.</p>
                   {view === ViewState.DASHBOARD && (
                        <button 
                        onClick={() => setView(ViewState.NEW_ENTRY)}
                        className="px-6 py-3 bg-mystic-600 text-white rounded-full hover:bg-mystic-500 transition-all shadow-lg shadow-mystic-900/50 font-bold"
                        >
                            Record Your First Dream
                        </button>
                   )}
               </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 pb-20 md:pb-0">
                {filteredDreams.map((dream) => (
                  <DreamCard 
                    key={dream.id} 
                    dream={dream} 
                    onClick={() => handleDreamClick(dream)} 
                    onDelete={handleDeleteDream}
                  />
                ))}
              </div>
            )}
          </div>
        );
      
      default:
          return <div>Unknown View</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-screen bg-slate-900 text-slate-200 font-sans selection:bg-mystic-500 selection:text-white overflow-hidden">
      <SubscriptionModal 
        isOpen={isSubscriptionModalOpen} 
        onClose={() => setIsSubscriptionModalOpen(false)}
      />

      {/* Payment Success Toast */}
      {showSuccessMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-float font-bold">
              <CheckCircle size={20} />
              Premium Activated! Thank you for your support.
          </div>
      )}
      
      <Navigation 
        currentView={view} 
        setView={(v) => {
            if (v === ViewState.DASHBOARD) loadData();
            setView(v);
        }} 
        sections={sections}
        onAddSection={handleAddSection}
        onDeleteSection={handleDeleteSection}
        selectedSectionId={selectedSectionId}
        onSelectSection={(id) => {
            setSelectedSectionId(id);
            setView(ViewState.SECTION);
        }}
        isPremium={isPremium}
        onOpenPremium={() => setIsSubscriptionModalOpen(true)}
      />

      <main className="flex-1 p-4 md:p-12 overflow-y-auto min-h-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;