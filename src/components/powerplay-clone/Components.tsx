'use client';

import React, { ReactNode } from 'react';
import { colors, spacing, shadows, typography } from './theme';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   POWERPLAY UI COMPONENT LIBRARY
   Dense, utility-first components for Construction SaaS.
   ═══════════════════════════════════════════════════════════════════ */

// ─── POWER CARD ──────────────────────────────────────────────────
// White card with sharp corners, light border, optional header.
interface PowerCardProps {
    title?: string;
    subtitle?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    noPadding?: boolean;
}

export function PowerCard({ title, subtitle, action, children, className = '', noPadding = false }: PowerCardProps) {
    return (
        <div
            className={`bg-white border overflow-hidden ${className}`}
            style={{
                borderColor: colors.neutral.gray200,
                borderRadius: spacing.card.radius,
                boxShadow: shadows.card,
            }}
        >
            {/* Card Header */}
            {title && (
                <div
                    className="flex items-center justify-between px-4 py-3 border-b"
                    style={{ borderColor: colors.neutral.gray100 }}
                >
                    <div>
                        <h3
                            className="font-semibold"
                            style={{ fontSize: '13px', color: colors.neutral.gray800 }}
                        >
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="mt-0.5" style={{ fontSize: '11px', color: colors.neutral.gray400 }}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}

            {/* Card Body */}
            <div className={noPadding ? '' : 'p-4'}>
                {children}
            </div>
        </div>
    );
}

// ─── POWER STAT ──────────────────────────────────────────────────
// Small dense metric card. Label top, Value center-big, Trend bottom.
interface PowerStatProps {
    label: string;
    value: string | number;
    unit?: string;
    trend?: 'up' | 'down' | 'flat';
    trendValue?: string;
    color?: string;
}

export function PowerStat({ label, value, unit, trend, trendValue, color }: PowerStatProps) {
    const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
    const trendColor = trend === 'up' ? colors.accent.green : trend === 'down' ? colors.accent.red : colors.neutral.gray400;

    return (
        <div
            className="bg-white border p-4 flex flex-col justify-between"
            style={{
                borderColor: colors.neutral.gray200,
                borderRadius: spacing.card.radius,
                boxShadow: shadows.card,
                minHeight: '100px',
                borderTop: color ? `3px solid ${color}` : undefined,
            }}
        >
            <p
                className="uppercase tracking-wider font-medium"
                style={{ fontSize: '10px', color: colors.neutral.gray400 }}
            >
                {label}
            </p>
            <div className="mt-2">
                <span
                    className="font-bold tabular-nums"
                    style={{ fontSize: '24px', color: colors.neutral.gray800, lineHeight: 1 }}
                >
                    {value}
                </span>
                {unit && (
                    <span className="ml-1 font-medium" style={{ fontSize: '12px', color: colors.neutral.gray400 }}>
                        {unit}
                    </span>
                )}
            </div>
            {trendValue && (
                <div className="flex items-center gap-1 mt-2">
                    <TrendIcon size={12} style={{ color: trendColor }} />
                    <span style={{ fontSize: '11px', color: trendColor, fontWeight: 500 }}>
                        {trendValue}
                    </span>
                </div>
            )}
        </div>
    );
}

// ─── POWER TAB ───────────────────────────────────────────────────
// Text-based tabs with thick orange bottom border for active state.
interface PowerTabProps {
    tabs: { id: string; label: string; count?: number }[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export function PowerTab({ tabs, activeTab, onTabChange }: PowerTabProps) {
    return (
        <div className="flex border-b" style={{ borderColor: colors.neutral.gray200 }}>
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className="relative px-4 py-3 transition-colors"
                        style={{
                            color: isActive ? colors.primary.navy : colors.neutral.gray500,
                            fontWeight: isActive ? 600 : 400,
                            fontSize: '13px',
                        }}
                    >
                        {tab.label}
                        {tab.count !== undefined && (
                            <span
                                className="ml-1.5 px-1.5 py-0.5 rounded-full text-white font-bold"
                                style={{
                                    fontSize: '9px',
                                    backgroundColor: isActive ? colors.accent.orange : colors.neutral.gray300,
                                }}
                            >
                                {tab.count}
                            </span>
                        )}
                        {/* Active bottom border */}
                        {isActive && (
                            <div
                                className="absolute bottom-0 left-0 right-0 h-[2px]"
                                style={{ backgroundColor: colors.accent.orange }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

// ─── POWER BUTTON ────────────────────────────────────────────────
// Rectangular, NOT pill-shaped. Uppercase text.
interface PowerButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit';
}

export function PowerButton({
    children, variant = 'primary', size = 'md', fullWidth = false,
    onClick, disabled = false, type = 'button',
}: PowerButtonProps) {
    const styles: Record<string, React.CSSProperties> = {
        primary: {
            backgroundColor: colors.primary.navy,
            color: colors.neutral.white,
            border: 'none',
        },
        secondary: {
            backgroundColor: colors.neutral.white,
            color: colors.primary.navy,
            border: `1px solid ${colors.primary.navy}`,
        },
        danger: {
            backgroundColor: colors.accent.red,
            color: colors.neutral.white,
            border: 'none',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: colors.neutral.gray600,
            border: `1px solid ${colors.neutral.gray200}`,
        },
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
        sm: { padding: '4px 12px', fontSize: '11px' },
        md: { padding: '8px 16px', fontSize: '12px' },
        lg: { padding: '10px 24px', fontSize: '13px' },
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="font-semibold uppercase tracking-wide transition-all duration-150 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
                ...styles[variant],
                ...sizeStyles[size],
                borderRadius: '3px',
                width: fullWidth ? '100%' : undefined,
                letterSpacing: '0.05em',
            }}
        >
            {children}
        </button>
    );
}

// ─── POWER TABLE ─────────────────────────────────────────────────
// High-density, sticky header, professional data table.
interface Column {
    key: string;
    label: string;
    width?: string;
    align?: 'left' | 'right' | 'center';
    render?: (value: any, row: any) => ReactNode;
}

interface PowerTableProps {
    columns: Column[];
    data: any[];
    onRowClick?: (row: any) => void;
    emptyMessage?: string;
}

export function PowerTable({ columns, data, onRowClick, emptyMessage = 'No data available' }: PowerTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr style={{ backgroundColor: colors.neutral.gray100 }}>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="sticky top-0 font-semibold uppercase tracking-wider border-b text-left whitespace-nowrap"
                                style={{
                                    padding: spacing.table.headerPadding,
                                    fontSize: '10px',
                                    color: colors.neutral.gray500,
                                    borderColor: colors.neutral.gray200,
                                    width: col.width,
                                    textAlign: col.align || 'left',
                                    backgroundColor: colors.neutral.gray100,
                                }}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="text-center py-12"
                                style={{ color: colors.neutral.gray400, fontSize: '13px' }}
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, idx) => (
                            <tr
                                key={idx}
                                onClick={() => onRowClick?.(row)}
                                className="border-b transition-colors"
                                style={{
                                    borderColor: colors.neutral.gray100,
                                    cursor: onRowClick ? 'pointer' : undefined,
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = colors.neutral.gray50;
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                }}
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        style={{
                                            padding: spacing.table.cellPadding,
                                            fontSize: '12px',
                                            color: colors.neutral.gray700,
                                            textAlign: col.align || 'left',
                                        }}
                                    >
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

// ─── STATUS BADGE ────────────────────────────────────────────────
export function StatusBadge({ status }: { status: 'todo' | 'inProgress' | 'completed' | 'overdue' | 'onHold' }) {
    const labels: Record<string, string> = {
        todo: 'To Do',
        inProgress: 'In Progress',
        completed: 'Completed',
        overdue: 'Overdue',
        onHold: 'On Hold',
    };

    return (
        <span
            className="inline-flex items-center px-2 py-0.5 rounded-sm font-medium"
            style={{
                fontSize: '10px',
                backgroundColor: colors.status[status] + '20',
                color: colors.status[status],
                border: `1px solid ${colors.status[status]}40`,
            }}
        >
            <span
                className="w-1.5 h-1.5 rounded-full mr-1.5"
                style={{ backgroundColor: colors.status[status] }}
            />
            {labels[status]}
        </span>
    );
}

// ─── PROGRESS BAR ────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color }: { value: number; max?: number; color?: string }) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.neutral.gray200 }}>
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                        width: `${pct}%`,
                        backgroundColor: color || (pct >= 100 ? colors.accent.green : pct >= 60 ? colors.primary.blue : colors.accent.orange),
                    }}
                />
            </div>
            <span className="text-[10px] font-semibold tabular-nums" style={{ color: colors.neutral.gray500, minWidth: '28px', textAlign: 'right' }}>
                {Math.round(pct)}%
            </span>
        </div>
    );
}
