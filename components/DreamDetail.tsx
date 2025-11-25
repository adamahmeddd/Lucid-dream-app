import React, { useState, useEffect, useRef } from 'react';
import { Dream, Section } from '../types';
import { format } from 'date-fns';
import { ArrowLeft, MessageCircle, Send, Trash2, Download, Sparkles, Tag, Heart, Folder, Lock, Edit2, X, Save } from 'lucide-react';
import { createDreamChat } from '../services/gemini';
import { deleteDream, updateDream, getSections } from '../services/storage';

interface DreamDetailProps {
  dream: Dream;
  onBack: () => void;
  onDelete: () => void;
  isPremium: boolean;
  onOpenPremium: () => void;
}

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export const DreamDetail: React.FC<DreamDetailProps> = ({ dream, onBack, onDelete, isPremium, onOpenPremium }) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  
  // UI State
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(dream.content);
  const [editDate, setEditDate] = useState(dream.date);
  const [editLabels, setEditLabels] = useState<string[]>(dream.customLabels || []);
  const [newLabel, setNewLabel] = useState('');

  // Local state for instant UI updates
  const [isFavorite, setIsFavorite] = useState(dream.isFavorite);
  const [currentSectionId, setCurrentSectionId] = useState(dream.sectionId || '');

  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    try {
        const session = createDreamChat(dream.content);
        chatRef.current = session;
        setSections(getSections());
    } catch (e) {
        console.error("Failed to init chat", e);
    }
  }, [dream.content]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleToggleFavorite = () => {
    if (!isPremium) {
        onOpenPremium();
        return;
    }
    const newVal = !isFavorite;
    setIsFavorite(newVal);
    updateDream({ ...dream, isFavorite: newVal });
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newId = e.target.value;
      setCurrentSectionId(newId);
      updateDream({ ...dream, sectionId: newId || undefined });
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !chatRef.current) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatting(true);

    try {
        const result = await chatRef.current.sendMessageStream({ message: userMsg });
        
        let fullResponse = "";
        setMessages(prev => [...prev, { role: 'model', text: "" }]); // Placeholder

        for await (const chunk of result) {
            const text = chunk.text;
            if (text) {
                fullResponse += text;
                setMessages(prev => {
                    const newArr = [...prev];
                    newArr[newArr.length - 1] = { role: 'model', text: fullResponse };
                    return newArr;
                });
            }
        }
    } catch (e) {
        console.error("Chat error", e);
        setMessages(prev => [...prev, { role: 'model', text: "The oracle is silent right now. Please try again later." }]);
    } finally {
        setIsChatting(false);
    }
  };

  const handleDelete = () => {
      // Direct delete without native confirm to avoid mobile issues
      deleteDream(dream.id);
      onDelete();
  }

  const handleSaveEdit = () => {
      const updatedDream = {
          ...dream,
          content: editContent,
          date: editDate,
          customLabels: editLabels
      };
      updateDream(updatedDream);
      setIsEditing(false);
      // Re-init chat context with new content if needed, though usually not critical for small edits
  };

  const handleAddLabel = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newLabel.trim()) {
        e.preventDefault();
        if (!editLabels.includes(newLabel.trim())) {
            setEditLabels([...editLabels, newLabel.trim()]);
        }
        setNewLabel('');
    }
  };

  const removeLabel = (label: string) => {
      setEditLabels(editLabels.filter(l => l !== label));
  };

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn pb-12">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <div className="flex items-center gap-4">
            {!isEditing && (
                 <div className="text-slate-500 text-sm hidden md:block">
                    {format(new Date(dream.date), 'MMMM do, yyyy • h:mm a')}
                </div>
            )}
           
            <button 
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full transition-colors relative group ${isFavorite ? 'bg-pink-900/40 text-pink-500' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                title="Toggle Favorite"
            >
                {isFavorite ? <Heart size={20} fill="currentColor" /> : isPremium ? <Heart size={20} /> : <Lock size={16} className="text-amber-500" />}
            </button>
            
            {sections.length > 0 && (
                <div className="relative group">
                    <div className="flex items-center gap-2 bg-slate-800 text-slate-400 px-3 py-2 rounded-full text-xs cursor-pointer hover:bg-slate-700">
                        <Folder size={14} />
                        <span>{sections.find(s => s.id === currentSectionId)?.name || 'Collection...'}</span>
                    </div>
                    <select 
                        value={currentSectionId}
                        onChange={handleSectionChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    >
                        <option value="">No Collection</option>
                        {sections.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-2 rounded-full transition-colors ${isEditing ? 'bg-mystic-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                title="Edit Dream"
            >
                <Edit2 size={18} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Visuals & Original Content */}
        <div className="space-y-6">
          {!isEditing && dream.imageUrl && (
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/30 border border-slate-700/50 relative group">
              <img src={dream.imageUrl} alt={dream.analysis?.title} className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>
              
              {dream.isLucid && (
                  <div className="absolute top-4 left-4 lucid-gradient px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg animate-shimmer">
                      <Sparkles size={14} /> Lucid Dream
                  </div>
              )}

              <a 
                href={dream.imageUrl} 
                download={`somnium-${dream.id}.png`}
                className="absolute bottom-4 right-4 p-2 bg-black/50 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 text-white"
                title="Download Dreamscape"
              >
                  <Download size={20} />
              </a>
            </div>
          )}

          <div className="bg-slate-800/40 backdrop-blur p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
            {!isEditing && (
                <div className="absolute -right-10 -top-10 text-slate-700/20 rotate-12 pointer-events-none">
                    <MessageCircle size={150} />
                </div>
            )}
            
            <div className="flex items-center justify-between mb-3 relative z-10">
                <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider">
                    {isEditing ? 'Edit Entry' : 'Original Entry'}
                </h3>
            </div>

            {isEditing ? (
                <div className="space-y-4">
                     <div>
                        <label className="text-xs text-slate-500 mb-1 block">Date</label>
                        <input 
                            type="datetime-local" 
                            value={editDate.substring(0, 16)}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:border-mystic-500 outline-none"
                        />
                     </div>
                     
                     <div>
                        <label className="text-xs text-slate-500 mb-1 block">Content</label>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 text-base focus:border-mystic-500 outline-none resize-none font-serif"
                        />
                     </div>

                     <div>
                         <label className="text-xs text-slate-500 mb-1 block">Custom Labels</label>
                         <div className="flex flex-wrap gap-2 mb-2">
                            {editLabels.map(label => (
                                <span key={label} className="flex items-center gap-1 px-2 py-1 bg-indigo-900/40 border border-indigo-700/50 rounded-full text-xs text-indigo-200">
                                    {label}
                                    <button onClick={() => removeLabel(label)} className="hover:text-white"><X size={12} /></button>
                                </span>
                            ))}
                         </div>
                         <input 
                            type="text" 
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            onKeyDown={handleAddLabel}
                            placeholder="Type label and press Enter..."
                            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:border-mystic-500 outline-none"
                        />
                     </div>

                     <div className="flex gap-2 pt-2">
                         <button onClick={handleSaveEdit} className="flex-1 bg-mystic-600 hover:bg-mystic-500 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2">
                             <Save size={16} /> Save Changes
                         </button>
                         <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">
                             Cancel
                         </button>
                     </div>
                </div>
            ) : (
                <>
                    <p className="text-slate-200 text-lg leading-relaxed font-serif italic relative z-10 whitespace-pre-wrap">
                    "{dream.content}"
                    </p>
                    
                    {dream.customLabels && dream.customLabels.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-700/50">
                            {dream.customLabels.map(label => (
                                <span key={label} className="flex items-center gap-1 text-sm text-indigo-300 bg-indigo-900/20 px-3 py-1 rounded-full border border-indigo-500/20">
                                    <Tag size={12} /> {label}
                                </span>
                            ))}
                        </div>
                    )}
                </>
            )}
          </div>
        </div>

        {/* Right Column: Analysis & Chat */}
        <div className="space-y-6">
          
          {/* Analysis Card */}
          <div className={`p-8 rounded-2xl border shadow-xl relative overflow-hidden ${
              dream.isLucid 
              ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-lucid-500/30' 
              : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
          }`}>
             <div className="flex justify-between items-start mb-4 relative z-10">
                 <h1 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200 leading-tight">
                    {dream.analysis?.title || "Untitled"}
                 </h1>
                 <button 
                    onClick={handleDelete} 
                    className="text-slate-600 hover:text-red-400 transition-colors p-2 hover:bg-slate-800 rounded-full"
                    title="Delete permanently"
                 >
                     <Trash2 size={18} />
                 </button>
             </div>
             
             <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                 <span className="px-3 py-1 rounded-full bg-slate-700/50 text-xs text-slate-300 border border-slate-600">
                    Mood: {dream.analysis?.mood}
                 </span>
                 <span className="px-3 py-1 rounded-full bg-slate-700/50 text-xs text-slate-300 border border-slate-600">
                    Intensity: {dream.analysis?.sentimentScore}/100
                 </span>
             </div>

             <div className="prose prose-invert prose-slate relative z-10">
                 <h4 className="text-mystic-400 font-bold mb-2">Interpretation</h4>
                 <p className="text-slate-300 leading-relaxed">
                     {dream.analysis?.interpretation}
                 </p>
             </div>
          </div>

          {/* Dream Oracle Chat */}
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col h-[50vh] md:h-[450px] shadow-lg">
              <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center gap-2 backdrop-blur-sm shrink-0">
                  <div className="p-1.5 bg-mystic-600 rounded-lg">
                    <MessageCircle size={16} className="text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-200 block text-sm">Dream Oracle</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">Interactive Interpretation</span>
                  </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                  {messages.length === 0 && (
                      <div className="text-center text-slate-500 mt-10 md:mt-20 text-sm px-10">
                          <p className="mb-2">"Ask me about the symbols in your dream..."</p>
                          <p className="text-xs opacity-60">Possible questions: What does the water represent? Why was I flying?</p>
                      </div>
                  )}
                  {messages.map((m, idx) => (
                      <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${
                              m.role === 'user' 
                              ? 'bg-mystic-600 text-white rounded-br-none shadow-lg shadow-mystic-900/20' 
                              : 'bg-slate-700 text-slate-200 rounded-bl-none shadow'
                          }`}>
                              {m.text}
                          </div>
                      </div>
                  ))}
                  <div ref={messagesEndRef} />
              </div>

              <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2 shrink-0">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask deeper questions..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-mystic-500 transition-colors"
                    disabled={isChatting}
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isChatting || !chatInput.trim()}
                    className="p-3 bg-mystic-600 text-white rounded-xl hover:bg-mystic-500 disabled:opacity-50 transition-colors"
                  >
                      <Send size={18} />
                  </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};