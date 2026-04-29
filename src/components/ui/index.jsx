// ============================================================
// Button.jsx
// ============================================================
export function Button({ children, variant = 'primary', size = 'md', onClick, className = '', disabled = false, type = 'button' }) {
  const base = 'inline-flex items-center gap-1.5 font-dm font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:  'bg-rose-gold text-white hover:bg-rose-dark',
    outline:  'bg-transparent border-[1.5px] border-border-soft text-brown-muted hover:border-rose-gold hover:text-rose-gold',
    danger:   'bg-transparent border-[1.5px] border-danger text-danger hover:bg-danger hover:text-white',
    ghost:    'bg-transparent text-brown-muted hover:bg-rose-light hover:text-brown-main',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-[12px]',
    md: 'px-4 py-2 text-[13px]',
    lg: 'px-5 py-2.5 text-[14px]',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}


// ============================================================
// Badge.jsx
// ============================================================
export function Badge({ children, variant = 'grey' }) {
  const variants = {
    green:  'bg-sage-light text-[#3a7a3a]',
    yellow: 'bg-[#FEF9E7] text-[#906000]',
    red:    'bg-[rgba(212,117,107,0.15)] text-[#b04040]',
    grey:   'bg-[rgba(155,128,112,0.12)] text-brown-muted',
    blue:   'bg-[rgba(100,140,200,0.15)] text-[#4060a0]',
    rose:   'bg-rose-light text-rose-dark',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${variants[variant]}`}>
      {children}
    </span>
  )
}


// ============================================================
// Card.jsx
// ============================================================
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-border-soft shadow-card p-6 ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex justify-between items-center mb-5">
      <div>
        <h3 className="font-playfair text-base text-brown-main">{title}</h3>
        {subtitle && <p className="text-[12px] text-brown-muted mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}


// ============================================================
// StatCard.jsx
// ============================================================
export function StatCard({ icon, value, label, sub, iconBg = 'bg-rose-light' }) {
  return (
    <div className="bg-white rounded-2xl border border-border-soft p-5 shadow-card">
      <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center text-lg mb-3 ${iconBg}`}>
        {icon}
      </div>
      <div className="font-playfair text-[22px] font-bold text-brown-main leading-none">{value}</div>
      <div className="text-[12px] text-brown-muted mt-1">{label}</div>
      {sub && <div className="text-[11px] font-semibold mt-1.5 text-sage">{sub}</div>}
    </div>
  )
}


// ============================================================
// Modal.jsx
// ============================================================
export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-brown-main/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[20px] w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-modal animate-[fadeUp_0.3s_ease]">
        {/* Header */}
        <div className="flex justify-between items-center p-8 pb-6">
          <h2 className="font-playfair text-[18px]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-ivory flex items-center justify-center text-brown-muted hover:bg-rose-light transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-8 pb-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex gap-2.5 justify-end px-8 py-5 border-t border-border-soft">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}


// ============================================================
// ProgressBar.jsx
// ============================================================
export function ProgressBar({ value, max = 100, label, sublabel, variant = 'rose', height = 7 }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0

  const variants = {
    rose: 'from-rose-gold to-dusty-pink',
    sage: 'from-sage to-[#a8c8a8]',
  }

  return (
    <div className="w-full">
      {(label || sublabel) && (
        <div className="flex justify-between text-[12px] text-brown-muted mb-1.5">
          <span>{label}</span>
          <span>{sublabel || `${pct}%`}</span>
        </div>
      )}
      <div className="w-full bg-border-soft rounded-full overflow-hidden" style={{ height }}>
        <div
          className={`h-full bg-gradient-to-r ${variants[variant]} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}


// ============================================================
// Input.jsx (form elements)
// ============================================================
export function Input({ label, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-[13px] font-medium text-brown-main mb-1.5">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="
          w-full px-3.5 py-2.5 rounded-lg text-[14px] text-brown-main
          border-[1.5px] border-dusty-pink bg-white outline-none
          focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/10
          transition-all placeholder:text-brown-muted/50
        "
      />
    </div>
  )
}

export function Select({ label, value, onChange, children, required }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-[13px] font-medium text-brown-main mb-1.5">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="
          w-full px-3.5 py-2.5 rounded-lg text-[14px] text-brown-main
          border-[1.5px] border-dusty-pink bg-white outline-none
          focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/10
          transition-all
        "
      >
        {children}
      </select>
    </div>
  )
}

export function Textarea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-[13px] font-medium text-brown-main mb-1.5">{label}</label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="
          w-full px-3.5 py-2.5 rounded-lg text-[14px] text-brown-main
          border-[1.5px] border-dusty-pink bg-white outline-none resize-none
          focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/10
          transition-all placeholder:text-brown-muted/50
        "
      />
    </div>
  )
}


// ============================================================
// Alert.jsx
// ============================================================
export function Alert({ children, variant = 'warning' }) {
  const variants = {
    warning: 'bg-[rgba(232,168,124,0.15)] border-[rgba(232,168,124,0.3)] text-[#8a5a20]',
    success: 'bg-sage-light border-[rgba(139,175,139,0.3)] text-[#3a6a3a]',
    info:    'bg-rose-light border-[rgba(201,149,108,0.2)] text-rose-dark',
  }

  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-[13px] border mb-4 ${variants[variant]}`}>
      {children}
    </div>
  )
}


// ============================================================
// SectionHeader.jsx
// ============================================================
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="font-playfair text-[22px] text-brown-main">{title}</h2>
        {subtitle && <p className="text-[13px] text-brown-muted mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}


// ============================================================
// Table.jsx - wrapper tabel responsif
// ============================================================
export function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-brown-muted bg-ivory border-b border-border-soft"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Tr({ children, onClick }) {
  return (
    <tr
      onClick={onClick}
      className="border-b border-[#FAF4F0] last:border-b-0 hover:bg-ivory transition-colors"
    >
      {children}
    </tr>
  )
}

export function Td({ children, className = '' }) {
  return (
    <td className={`px-3.5 py-2.5 text-brown-main ${className}`}>
      {children}
    </td>
  )
}
