'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '@/lib/supabaseClient'
import { MapPin, FileText, Send, Calendar, Construction, Droplets, ArrowRight } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

type DPRFormData = {
    project_id: string
    discipline: 'Pipeline' | 'Civil' | 'E&M'
    report_date: string
    location_gps: string // Ideally JSON/Point, simplify to string for form

    // Pipeline specific
    pipe_diameter?: string
    pipe_length?: number

    // Civil specific
    civil_component?: string
    civil_progress?: number

    work_summary: string
}

export default function DPRForm() {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DPRFormData>({
        defaultValues: {
            discipline: 'Pipeline',
            report_date: new Date().toISOString().split('T')[0],
            work_summary: ''
        }
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const discipline = watch('discipline')
    const pipeDiameter = watch('pipe_diameter')
    const pipeLength = watch('pipe_length')
    const civilComponent = watch('civil_component')
    const civilProgress = watch('civil_progress')
    const location = watch('location_gps')

    // Auto-generate summary
    useEffect(() => {
        let summary = ''
        if (discipline === 'Pipeline' && pipeDiameter && pipeLength) {
            summary = `Laid ${pipeLength}m of ${pipeDiameter} pipe`
        } else if (discipline === 'Civil' && civilComponent && civilProgress) {
            summary = `Completed ${civilProgress}% of ${civilComponent}`
        } else if (discipline === 'E&M') {
            summary = 'E&M Work in progress'
        }

        if (location) {
            summary += ` at ${location}`
        }

        setValue('work_summary', summary)
    }, [discipline, pipeDiameter, pipeLength, civilComponent, civilProgress, location, setValue])

    const onSubmit = async (data: DPRFormData) => {
        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
            // 1. Get current user (mock if not auth)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('User not authenticated')

            // 2. Insert Daily Report
            const { data: report, error: reportError } = await supabase
                .from('daily_reports')
                .insert({
                    project_id: data.project_id, // Needs to be real UUID
                    user_id: user.id,
                    report_date: data.report_date,
                    // location_gps: { lat: ..., lng: ... }, // Simplify
                    work_summary_text: data.work_summary,
                    discipline: data.discipline
                })
                .select()
                .single()

            if (reportError) throw reportError

            // 3. Insert Line Item (Generic mapping to BOQ is complex without real BOQ data, simplifying)
            // Here we store the specific data in metadata or use a placeholder BOQ item
            const { error: lineItemError } = await supabase
                .from('report_line_items')
                .insert({
                    report_id: report.id,
                    // boq_item_id: '...', // Need to fetch or select BOQ item
                    quantity_today: data.discipline === 'Pipeline' ? data.pipe_length : data.civil_progress,
                    metadata: {
                        diameter: data.pipe_diameter,
                        component: data.civil_component,
                        progress_percent: data.civil_progress
                    }
                })

            if (lineItemError) throw lineItemError

            setSubmitStatus('success')
        } catch (error) {
            console.error('Submission error:', error)
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex items-center justify-center font-sans">
            {/* Starry Night Background Effect (CSS/SVG needed for full effect, using radial gradient for now) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 pointer-events-none" />

            <div className="relative z-10 w-full max-w-lg bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-white/5 p-6 border-b border-white/5">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                        Daily Progress Report
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Submit your daily construction updates.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                    {/* Project & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Project ID</label>
                            <input
                                {...register('project_id')}
                                placeholder="UUID..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder:text-slate-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                <input
                                    type="date"
                                    {...register('report_date')}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Discipline Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Discipline</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['Pipeline', 'Civil', 'E&M'] as const).map((d) => (
                                <label key={d} className={cn(
                                    "cursor-pointer text-center py-3 rounded-lg border text-sm font-medium transition-all duration-200",
                                    discipline === d
                                        ? "bg-blue-600/20 border-blue-500 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                        : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                                )}>
                                    <input type="radio" value={d} {...register('discipline')} className="hidden" />
                                    {d}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Conditional Logic Fields */}
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">

                        {discipline === 'Pipeline' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-blue-300/80">Pipe Diameter</label>
                                        <select {...register('pipe_diameter')} className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500/50 appearance-none">
                                            <option value="">Select Dia</option>
                                            <option value="100mm">100mm</option>
                                            <option value="200mm">200mm</option>
                                            <option value="300mm">300mm</option>
                                            <option value="450mm">450mm</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-blue-300/80">Length (meters)</label>
                                        <input
                                            type="number"
                                            inputMode="decimal"
                                            pattern="[0-9]*"
                                            {...register('pipe_length')}
                                            placeholder="0.00"
                                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500/50"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {discipline === 'Civil' && (
                            <>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-blue-300/80">Component</label>
                                        <select {...register('civil_component')} className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500/50 appearance-none">
                                            <option value="">Select Component</option>
                                            <option value="Boundary Wall">Boundary Wall</option>
                                            <option value="Pump House">Pump House</option>
                                            <option value="OHT Foundation">OHT Foundation</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-blue-300/80">
                                            <span>Progress</span>
                                            <span>{civilProgress || 0}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            {...register('civil_progress')}
                                            className="w-full h-4 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {discipline === 'E&M' && (
                            <div className="text-center text-sm text-slate-500 italic py-2">
                                Standard E&M logging fields will appear here.
                            </div>
                        )}
                    </div>

                    {/* Location & Summary */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-emerald-500" />
                                <input
                                    {...register('location_gps')}
                                    placeholder="Auto-detected or manual entry"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-16 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                                />
                                <button type="button" className="absolute right-2 top-2 px-3 py-1.5 bg-white/10 text-xs font-medium rounded hover:bg-white/20 transition-colors">
                                    Detect
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Generated Summary</label>
                            <textarea
                                {...register('work_summary')}
                                readOnly
                                className="w-full h-20 bg-slate-950/50 border border-white/10 rounded-lg p-3 text-sm text-slate-300 resize-none focus:ring-1 focus:ring-white/20"
                            />
                        </div>
                    </div>

                    {/* Submit Action */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                        {isSubmitting ? (
                            <span className="animate-pulse">Submitting...</span>
                        ) : (
                            <>
                                <span>Submit Report</span>
                                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    {submitStatus === 'success' && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center rounded-lg">
                            Report submitted successfully!
                        </div>
                    )}
                    {submitStatus === 'error' && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center rounded-lg">
                            Failed to submit report. check console.
                        </div>
                    )}

                </form>
            </div>
        </div>
    )
}
