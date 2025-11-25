import React, { useState } from 'react';
import { X, Check, Crown, Sparkles, Lock, ExternalLink, Gift } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void; // Optional callback for instant upgrades
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const [showRedeem, setShowRedeem] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handlePayment = (plan: 'monthly' | 'yearly') => {
    // 1. Configuration
    const email = "adamahmedadelabdelwahab@gmail.com";
    const itemName = plan === 'monthly' ? "Dream Lab Premium (Monthly)" : "Dream Lab Premium (Yearly)";
    const amount = plan === 'monthly' ? "10.00" : "99.00";
    
    // 2. Redirect Logic
    const paypalLink = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${email}&item_name=${encodeURIComponent(itemName)}&amount=${amount}&currency_code=USD`;

    // 3. Open PayPal
    window.location.href = paypalLink;
  };

  const handleRedeem = () => {
      if (promoCode.trim().toUpperCase() === 'FRIEND') {
          if (onUpgrade) {
              onUpgrade();
              onClose();
          }
      } else {
          setErrorMsg("Invalid code. Please try again.");
      }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/95 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Flex container to center content but allow scrolling on small screens/keyboard open */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        
        {/* Modal Content - Added animate-float back */}
        <div className="relative bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 max-w-4xl w-full flex flex-col md:flex-row text-left z-10 my-8 animate-float">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white z-20 p-2 bg-slate-900/50 rounded-full"
          >
            <X size={20} />
          </button>

          {/* Left Side: Value Prop */}
          <div className="md:w-5/12 bg-gradient-to-br from-indigo-900 to-slate-900 p-8 flex flex-col justify-center relative overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
               <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-[80px]"></div>
               <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-500 rounded-full blur-[80px]"></div>
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-amber-900/40">
                  <Crown className="text-white" size={24} />
              </div>
              <h2 className="text-3xl font-serif font-bold text-white mb-4">Unlock the<br/>Oracle</h2>
              <p className="text-indigo-200 mb-8 leading-relaxed">
                Dive deeper into your subconscious with Dream Lab Premium. Reveal hidden meanings and organize your inner world.
              </p>

              <ul className="space-y-4">
                <li className="flex items-center text-slate-200">
                  <div className="mr-3 p-1 bg-indigo-500/20 rounded-full text-indigo-300"><Sparkles size={14} /></div>
                  <span>AI Dream Interpretation</span>
                </li>
                <li className="flex items-center text-slate-200">
                  <div className="mr-3 p-1 bg-indigo-500/20 rounded-full text-indigo-300"><Crown size={14} /></div>
                  <span>Unlimited Collections</span>
                </li>
                <li className="flex items-center text-slate-200">
                  <div className="mr-3 p-1 bg-indigo-500/20 rounded-full text-indigo-300"><Check size={14} /></div>
                  <span>Favorites & Organization</span>
                </li>
                <li className="flex items-center text-slate-200">
                  <div className="mr-3 p-1 bg-indigo-500/20 rounded-full text-indigo-300"><Lock size={14} /></div>
                  <span>Secure Cloud Sync (Soon)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side: Pricing */}
          <div className="md:w-7/12 p-8 bg-slate-800 flex flex-col h-full rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-white">Choose your journey</h3>
              <p className="text-slate-400 text-sm">Cancel anytime. Secure payment via PayPal.</p>
            </div>

            <div className="grid gap-4 flex-1">
              {/* Monthly Plan */}
              <div className="border border-slate-600 rounded-2xl p-4 hover:border-mystic-500 transition-all cursor-pointer bg-slate-800/50 hover:bg-slate-700/50 group relative">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white group-hover:text-mystic-300">Monthly Traveler</h4>
                    <p className="text-slate-400 text-sm">Flexible exploration</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white">$10</span>
                    <span className="text-slate-500 text-sm">/mo</span>
                  </div>
                </div>
                <button 
                  onClick={() => handlePayment('monthly')}
                  className="mt-4 w-full py-2 bg-slate-700 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Select Monthly <ExternalLink size={14} />
                </button>
              </div>

              {/* Yearly Plan */}
              <div className="border-2 border-amber-500/50 rounded-2xl p-4 hover:border-amber-400 transition-all cursor-pointer bg-gradient-to-r from-slate-800 to-amber-900/10 group relative shadow-lg shadow-amber-900/10">
                <div className="absolute -top-3 right-4 bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                  Best Value
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white group-hover:text-amber-200">Yearly Visionary</h4>
                    <p className="text-slate-400 text-sm">Commit to your dreams</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-amber-400">$99</span>
                    <span className="text-slate-500 text-sm">/yr</span>
                  </div>
                </div>
                <button 
                  onClick={() => handlePayment('yearly')}
                  className="mt-4 w-full py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg font-bold transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  Select Yearly <ExternalLink size={14} />
                </button>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-700">
                {showRedeem ? (
                    <div className="animate-fadeIn">
                        <p className="text-xs text-slate-400 mb-2">Enter secret code:</p>
                        <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={promoCode}
                              onChange={(e) => {
                                  setPromoCode(e.target.value);
                                  setErrorMsg('');
                              }}
                              onFocus={(e) => {
                                // Scroll element into view when keyboard opens
                                setTimeout(() => {
                                  e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }, 300);
                              }}
                              placeholder="Code..."
                              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-mystic-500"
                            />
                            <button 
                              onClick={handleRedeem}
                              className="bg-mystic-600 hover:bg-mystic-500 text-white px-4 py-2 rounded-lg text-sm font-bold"
                            >
                                Apply
                            </button>
                        </div>
                        {errorMsg && <p className="text-red-400 text-xs mt-1">{errorMsg}</p>}
                    </div>
                ) : (
                  <button 
                      onClick={() => setShowRedeem(true)}
                      className="flex items-center gap-2 text-xs text-slate-500 hover:text-mystic-400 transition-colors mx-auto"
                  >
                      <Gift size={12} /> Have a code?
                  </button>
                )}
                
                <p className="mt-4 text-[10px] text-center text-slate-600">
                  Secure payment handling. By subscribing, you support independent development.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};