import React, { useEffect, useRef } from 'react';

interface PanicOverlayProps {
  onClose: () => void;
}

const PanicOverlay: React.FC<PanicOverlayProps> = ({ onClose }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Trap focus since we only have one interactive element
      if (e.key === 'Tab') {
        e.preventDefault();
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus the button on mount
    // Use timeout to ensure DOM is ready and prevent potential conflicts
    const timeoutId = setTimeout(() => {
      buttonRef.current?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="panic-title"
    >
      <div className="w-full max-w-2xl border-4 border-red-600 bg-black p-8 text-center shadow-[0_0_50px_rgba(220,38,38,0.5)]">
        <h1 id="panic-title" className="mb-8 text-4xl font-bold uppercase tracking-widest text-red-500 animate-pulse">
          Crisis Resources
        </h1>

        <div className="mb-8 space-y-6 text-xl text-white">
          <div className="rounded border border-red-800 bg-red-900/20 p-4">
            <h2 className="mb-2 font-bold text-red-400">Suicide & Crisis Lifeline</h2>
            <p className="text-3xl font-bold tracking-widest">988</p>
            <p className="text-sm opacity-80">(Call or Text in US/Canada)</p>
          </div>

          <div className="rounded border border-red-800 bg-red-900/20 p-4">
            <h2 className="mb-2 font-bold text-red-400">Crisis Text Line</h2>
            <p className="text-2xl">Text <span className="font-bold">HOME</span> to <span className="font-bold">741741</span></p>
          </div>

          <div className="rounded border border-red-800 bg-red-900/20 p-4">
            <h2 className="mb-2 font-bold text-red-400">Emergency Services</h2>
            <p className="text-3xl font-bold tracking-widest">911</p>
          </div>
        </div>

        <p className="mb-8 text-lg text-gray-300">
          You are not alone. Help is available 24/7.
        </p>

        <button
          ref={buttonRef}
          onClick={onClose}
          className="rounded border-2 border-white bg-transparent px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
        >
          RETURN TO TERMINAL
        </button>
      </div>
    </div>
  );
};

export default PanicOverlay;
