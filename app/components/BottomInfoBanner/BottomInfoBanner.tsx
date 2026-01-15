'use client'

import { useEffect, useState } from "react";

export default function BottomInfoBanner()
{
    const [isBannerVisible, setBannerVisible] = useState(false);

    useEffect( () => {
        const hasSeenBanner = sessionStorage.getItem('hasSeenBanner');

        if(!hasSeenBanner)
            {
                setBannerVisible(true);
            }
    },[]);

    const dismiss = () => 
        {
            setBannerVisible(false);
            sessionStorage.setItem('hasSeenBanner','true');
        }

        if (!isBannerVisible) return null;

        return(<>
        <div className="fixed bottom-0 left-0 right-0 z-100 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="mx-auto max-w-xl bg-neutral-900 border border-neutral-700 rounded-xl p-4 shadow-2xl flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-white">
            Performance Warning
          </p>
          <p className="text-xs text-neutral-400">
            WebGL performance varies by hardware. We recommend a desktop environment for real-time shader development and high-fidelity previews.
          </p>
        </div>
        
        <button 
          onClick={dismiss}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
        </>)

}