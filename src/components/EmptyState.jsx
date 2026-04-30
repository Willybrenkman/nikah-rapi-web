// src/components/EmptyState.jsx
import React from 'react'

export default function EmptyState({ icon, title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-ivory/50 flex items-center justify-center text-4xl mb-6 shadow-inner-white border border-ivory">
        {icon}
      </div>
      <h3 className="font-playfair text-2xl font-bold text-brown mb-2">{title}</h3>
      <p className="text-sm text-brown-muted max-w-xs mx-auto mb-8 leading-relaxed">
        {subtitle}
      </p>
      {onAction && (
        <button 
          onClick={onAction}
          className="btn-rose px-8 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
