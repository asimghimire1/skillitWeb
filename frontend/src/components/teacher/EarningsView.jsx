import React from 'react';
import { Wallet, SquarePlay, CalendarDays, Users, TrendingUp, ShoppingBag } from 'lucide-react';

export default function EarningsView({ earnings, loading }) {
    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Loading earnings...</div>
            </div>
        );
    }

    const {
        totalEarnings = 0,
        contentEarnings = 0,
        sessionEarnings = 0,
        contentBreakdown = [],
        sessionBreakdown = []
    } = earnings || {};

    const fmt = (n) => Number(n || 0).toLocaleString('en-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const summaryCards = [
        {
            label: 'Total Earnings',
            value: `NPR ${fmt(totalEarnings)}`,
            icon: <Wallet size={22} />,
            color: '#ea2a33',
            bg: 'rgba(234,42,51,0.08)'
        },
        {
            label: 'Content Sales',
            value: `NPR ${fmt(contentEarnings)}`,
            icon: <SquarePlay size={22} />,
            color: '#2563eb',
            bg: 'rgba(37,99,235,0.08)'
        },
        {
            label: 'Session Earnings',
            value: `NPR ${fmt(sessionEarnings)}`,
            icon: <CalendarDays size={22} />,
            color: '#07885d',
            bg: 'rgba(7,136,93,0.08)'
        }
    ];

    const totalBuyers = contentBreakdown.reduce((s, c) => s + (c.buyerCount || 0), 0);
    const totalEnrollees = sessionBreakdown.reduce((s, c) => s + (c.enrolleeCount || 0), 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'page-fade-in 0.4s ease-out' }}>

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                {summaryCards.map((card) => (
                    <div key={card.label} className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '0.75rem', background: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {card.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.2rem' }}>{card.label}</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-light)' }}>{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Earnings */}
            <div className="dashboard-card" style={{ borderRadius: '1rem' }}>
                <div className="dashboard-card-header" style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <SquarePlay size={18} color="var(--primary)" />
                        <span className="dashboard-card-title" style={{ fontSize: '1rem' }}>Content Earnings</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <Users size={14} />
                        <span>{totalBuyers} total student{totalBuyers !== 1 ? 's' : ''} bought</span>
                    </div>
                </div>

                {contentBreakdown.length === 0 ? (
                    <div className="empty-state" style={{ padding: '3rem' }}>
                        <div className="empty-state-icon"><ShoppingBag size={28} color="var(--primary)" /></div>
                        <p className="empty-state-title" style={{ fontSize: '1rem' }}>No content sales yet</p>
                        <p className="empty-state-text">Upload paid content and watch your earnings grow.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-light)', background: '#fafafa' }}>
                                    <th style={thStyle}>Post / Content</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Students Bought</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Unit Price</th>
                                    <th style={{ ...thStyle, textAlign: 'right' }}>Total Earned</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contentBreakdown.map((item, i) => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--text-light)' }}>{item.title || '—'}</span>
                                                {item.category && (
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>{item.category}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            <span style={badgeStyle('#2563eb', 'rgba(37,99,235,0.08)')}>
                                                {item.buyerCount} student{item.buyerCount !== 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            {item.price > 0 ? `NPR ${fmt(item.price)}` : <span style={{ color: '#07885d', fontWeight: 600 }}>Free</span>}
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: item.totalEarned > 0 ? '#07885d' : 'var(--text-secondary)' }}>
                                            NPR {fmt(item.totalEarned)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ borderTop: '2px solid var(--border-light)', background: 'rgba(234,42,51,0.04)' }}>
                                    <td style={{ ...tdStyle, fontWeight: 700 }}>Total</td>
                                    <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700 }}>{totalBuyers} student{totalBuyers !== 1 ? 's' : ''}</td>
                                    <td style={tdStyle}></td>
                                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>
                                        NPR {fmt(contentEarnings)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>

            {/* Session Earnings */}
            <div className="dashboard-card" style={{ borderRadius: '1rem' }}>
                <div className="dashboard-card-header" style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <CalendarDays size={18} color="var(--primary)" />
                        <span className="dashboard-card-title" style={{ fontSize: '1rem' }}>Session Earnings</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <Users size={14} />
                        <span>{totalEnrollees} total student{totalEnrollees !== 1 ? 's' : ''} enrolled</span>
                    </div>
                </div>

                {sessionBreakdown.length === 0 ? (
                    <div className="empty-state" style={{ padding: '3rem' }}>
                        <div className="empty-state-icon"><CalendarDays size={28} color="var(--primary)" /></div>
                        <p className="empty-state-title" style={{ fontSize: '1rem' }}>No session enrollments yet</p>
                        <p className="empty-state-text">Create paid sessions to start earning from live teaching.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-light)', background: '#fafafa' }}>
                                    <th style={thStyle}>Session</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Students Enrolled</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Unit Price</th>
                                    <th style={{ ...thStyle, textAlign: 'right' }}>Total Earned</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessionBreakdown.map((item, i) => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--text-light)' }}>{item.title || 'Untitled Session'}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                                                    {item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' }) : item.category || '—'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            <span style={badgeStyle('#07885d', 'rgba(7,136,93,0.08)')}>
                                                {item.enrolleeCount} student{item.enrolleeCount !== 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            {item.price > 0 ? `NPR ${fmt(item.price)}` : <span style={{ color: '#07885d', fontWeight: 600 }}>Free</span>}
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: item.totalEarned > 0 ? '#07885d' : 'var(--text-secondary)' }}>
                                            NPR {fmt(item.totalEarned)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ borderTop: '2px solid var(--border-light)', background: 'rgba(234,42,51,0.04)' }}>
                                    <td style={{ ...tdStyle, fontWeight: 700 }}>Total</td>
                                    <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700 }}>{totalEnrollees} student{totalEnrollees !== 1 ? 's' : ''}</td>
                                    <td style={tdStyle}></td>
                                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>
                                        NPR {fmt(sessionEarnings)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}

// Table style helpers
const thStyle = {
    padding: '0.75rem 1.25rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    textAlign: 'left'
};

const tdStyle = {
    padding: '1rem 1.25rem',
    color: 'var(--text-light)',
    verticalAlign: 'middle'
};

const badgeStyle = (color, bg) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.25rem 0.6rem',
    borderRadius: '9999px',
    background: bg,
    color: color,
    fontWeight: 700,
    fontSize: '0.75rem',
    whiteSpace: 'nowrap'
});
