import React from 'react';
import { X, Check, Crown, Sparkles, Lock } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  const handlePayment = (plan: 'monthly' | 'yearly') => {
    // 1. Construct PayPal Link
    const email = "adamahmedadelabdelwahab@gmail.com";
    const itemName = plan === 'monthly' ? "Dream Lab Premium (Monthly)" : "Dream Lab Premium (Yearly)";
    const amount = plan === 'monthly' ? "10.00" : "99.00";
    // Using standard PayPal "Buy Now" link structure
    const paypalLink = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${email}&item_name=${encodeURIComponent(itemName)}&amount=${amount}&currency_code=USD`;

    // 2. Open PayPal in new tab
    window.open(paypalLink, '_blank');

    // 3. For this app demo, we simulate immediate activation so the user can use it.
    // In a real backend app, you'd wait for a webhook confirmation.
    onUpgrade(); 
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 max-w-4xl w-full overflow-hidden flex flex-col md:flex-row animate-float">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white z-10 p-2 bg-slate-900/50 rounded-full"
        >
          <X size={20} />
        </button>

        {/* Left Side: Value Prop */}
        <div className="md:w-5/12 bg-gradient-to-br from-indigo-900 to-slate-900 p-8 flex flex-col justify-center relative overflow-hidden">
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
        <div className="md:w-7/12 p-8 bg-slate-800">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white">Choose your journey</h3>
            <p className="text-slate-400 text-sm">Cancel anytime. Secure payment via PayPal.</p>
          </div>

          <div className="grid gap-4">
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
                className="mt-4 w-full py-2 bg-slate-700 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
              >
                Select Monthly
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
                className="mt-4 w-full py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg font-bold transition-colors shadow-lg"
              >
                Select Yearly
              </button>
            </div>
          </div>

          <p className="mt-6 text-xs text-center text-slate-500">
            By subscribing, you agree to our Terms of Service. Payment is processed securely by PayPal.
          </p>
        </div>
      </div>
    </div>
  );
};