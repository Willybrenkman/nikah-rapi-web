import { Component } from 'react'

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#FDFAF6',
                    fontFamily: "'DM Sans', sans-serif",
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: 64, marginBottom: 24 }}>😔</div>
                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 24,
                        color: '#5C3D2E',
                        marginBottom: 8
                    }}>
                        Oops, terjadi kesalahan
                    </h2>
                    <p style={{
                        fontSize: 14,
                        color: '#8B7B6B',
                        maxWidth: 400,
                        lineHeight: 1.6,
                        marginBottom: 24
                    }}>
                        Halaman ini mengalami gangguan. Coba muat ulang halaman atau kembali ke beranda.
                    </p>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                background: '#C9956C',
                                color: '#fff',
                                border: 'none',
                                padding: '12px 28px',
                                borderRadius: 12,
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: 'pointer',
                                letterSpacing: '0.05em'
                            }}
                        >
                            🔄 Muat Ulang
                        </button>
                        <button
                            onClick={() => { window.location.href = '/dashboard' }}
                            style={{
                                background: 'transparent',
                                color: '#C9956C',
                                border: '2px solid #C9956C',
                                padding: '12px 28px',
                                borderRadius: 12,
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: 'pointer',
                                letterSpacing: '0.05em'
                            }}
                        >
                            🏠 Dashboard
                        </button>
                    </div>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <pre style={{
                            marginTop: 32,
                            padding: 16,
                            background: '#FFF5F5',
                            border: '1px solid #FED7D7',
                            borderRadius: 8,
                            fontSize: 11,
                            color: '#C53030',
                            maxWidth: '90vw',
                            overflow: 'auto',
                            textAlign: 'left'
                        }}>
                            {this.state.error.toString()}
                        </pre>
                    )}
                </div>
            )
        }

        return this.props.children
    }
}
