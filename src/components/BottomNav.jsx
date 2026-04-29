// src/components/BottomNav.jsx
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
    { to: "/",            icon: "🏠", label: "Utama" },
    { to: "/budget",     icon: "💰", label: "Anggaran" },
    { to: "/checklist",  icon: "✅", label: "Tugas" },
    { to: "/guest-list", icon: "👥", label: "Tamu" },
    { to: "/pengaturan", icon: "⚙️", label: "Aturan" },
];

export default function BottomNav() {
    const { pathname } = useLocation();

    return (
        <nav style={S.nav}>
            {NAV_ITEMS.map(({ to, icon, label }) => {
                const active = pathname === to || pathname.startsWith(to + "/");
                return (
                    <Link key={to} to={to} style={S.item}>
                        <div style={{ ...S.iconWrap, background: active ? "rgba(201, 149, 108, 0.1)" : "transparent" }}>
                            <span style={S.icon}>{icon}</span>
                        </div>
                        <span style={{ ...S.label, color: active ? "#C9956C" : "#9B8070", fontWeight: active ? 700 : 500 }}>
                            {label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}

const S = {
    nav: {
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        background: "#fff",
        borderTop: "1px solid #F0E6DF",
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "8px 0 calc(8px + env(safe-area-inset-bottom))",
        boxShadow: "0 -4px 20px rgba(44,24,16,0.08)",
    },
    item: {
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 4, flex: 1, textDecoration: "none",
        padding: "4px 0",
    },
    iconWrap: {
        width: 36, height: 36, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
    },
    icon: { fontSize: 18 },
    label: { fontSize: 9, letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase' },
};
