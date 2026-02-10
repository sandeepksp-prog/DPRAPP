'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { dataProvider } from '@/lib/data-provider'
import { MapPin, Send, AlertTriangle, CheckCircle, Construction, ArrowRight, Zap, Droplets } from 'lucide-react'
import { cn } from '@/lib/utils'

type LogicFormData = {
    project_id: string
    report_date: string
    location_gps: string
    discipline: 'Pipeline' | 'Civil' | 'E&M' | 'Boundary Wall'

    // Pipeline Specific
    boq_item_id?: string // Selected from dropdown
    pipe_diameter?: string
    pipe_length?: number
    pipe_soil?: string

    // Civil Specific
    civil_component?: string // OHT, Pump House
    civil_stage_percent?: number // Slider

    work_summary: string
}

export default function LogicForm() {
    const { register, handleSubmit, watch, setValue, reset } = useForm<LogicFormData>({
        defaultValues: {
            discipline: 'Pipeline',
            report_date: new Date().toISOString().split('T')[0],
            civil_stage_percent: 0,
            work_summary: ''
        }
    })

    const [projects, setProjects] = useState<{ id: string, name: string }[]>([])
    const [boqItems, setBoqItems] = useState<{ id: string, description: string, item_code: string }[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

    // Watchers
    const projectId = watch('project_id')
    const discipline = watch('discipline')
    const boqItemId = watch('boq_item_id')
    const pipeLength = watch('pipe_length')
    const civilComponent = watch('civil_component')
    const civilStage = watch('civil_stage_percent')
    const reportDate = watch('report_date')

    // 1. Load Projects
    useEffect(() => {
        async function loadProjects() {
            const data = await dataProvider.getProjects()
            setProjects(data)
        }
        loadProjects()
    }, [])

    // 2. Load BOQ Items when Project/Discipline changes (Mocking filter by discipline for now)
    useEffect(() => {
        async function loadBoq() {
            if (!projectId) return
            const items = await dataProvider.getBOQItems(projectId)
            // Filter BOQ items based on discipline if possible, or just show all relevant
            // For Pipeline, filter for pipes. For Civil, filter for structures?
            // Existing BOQ data might not have 'category' strictly filled in mock, let's filter by heuristic if needed
            // or just show all for the "Item Description" dropdown
            setBoqItems(items)
        }
        loadBoq()
    }, [projectId, discipline])

    // 3. Auto-Summarizer (The "User's Excel Formula")
    useEffect(() => {
        if (!projectId) return

        const projectName = projects.find(p => p.id === projectId)?.name || 'Unknown Project'
        let summary = ''

        if (discipline === 'Pipeline') {
            const item = boqItems.find(i => i.id === boqItemId)
            const desc = item ? item.description : 'Pipeline'
            const length = pipeLength || 0
            summary = `${discipline} Work: Laid ${length}m of ${desc} at ${projectName}`
        } else if (discipline === 'Civil') {
            const comp = civilComponent || 'Structure'
            const stage = civilStage || 0
            summary = `${discipline} Work: ${comp} at ${stage}% completion at ${projectName}`
        } else {
            summary = `${discipline} Work: Activity reported at ${projectName}`
        }

        setValue('work_summary', summary)
    }, [discipline, boqItemId, pipeLength, civilComponent, civilStage, projectId, projects, boqItems, setValue])


    const onSubmit = async (data: LogicFormData) => {
        setIsSubmitting(true)
        setStatus('idle')
        try {
            // Mock submission using data provider
            await dataProvider.submitReport({
                project_id: data.project_id,
                user_id: 'user_mobile', // Mock user
                report_date: data.report_date,
                work_summary_text: data.work_summary,
                discipline: data.discipline,
                report_entries: [
                    {
                        // Map form data to generic entry
                        boq_item_id: data.boq_item_id, // Might be undefined for Civil
                        quantity: Number(data.pipe_length || 0),
                        stage_percentage: Number(data.civil_stage_percent || 0),
                        meta_data: {
                            civil_component: data.civil_component,
                            diameter: data.pipe_diameter, // Redundant if mapped to BOQ, but good for backup
                            soil: data.pipe_soil
                        }
                    }
                ]
            } as any)

            setStatus('success')
            // Don't reset everything, just values, keep project/date potentially? 
            // Resetting for clean slate:
            reset({
                project_id: data.project_id, // Keep project
                report_date: data.report_date, // Keep date
                discipline: 'Pipeline',
                civil_stage_percent: 0,
                work_summary: ''
            })

            setTimeout(() => setStatus('idle'), 3000)
        } catch (e) {
            console.error(e)
            setStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-slate-50 rounded-2xl overflow-hidden shadow-2xl border border-slate-200">

                {/* Header - Professional Dark Blue */}
                <div className="bg-blue-900 p-6 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <Construction className="text-sky-400" size={20} />
                            Infra-OS Field
                        </h1>
                        <p className="text-blue-200 text-xs mt-1">Daily Progress Report (DPR)</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-mono text-blue-200">{new Date().toDateString()}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                    {/* Step 1: Project Scope */}
                    <div className="space-y-4 pt-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">1. Project Details</label>
                        <div className="grid grid-cols-1 gap-4">
                            <select
                                {...register('project_id', { required: true })}
                                className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                            >
                                <option value="">Select Project Scheme...</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <input
                                type="date"
                                {...register('report_date')}
                                className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-900 outline-none"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-slate-200 w-full" />

                    {/* Step 2: Discipline Selector */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">2. Select Discipline</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['Pipeline', 'Civil', 'E&M', 'Boundary Wall'] as const).map(d => (
                                <label key={d} className={cn(
                                    "cursor-pointer text-center p-3 rounded-lg border text-sm font-semibold transition-all",
                                    discipline === d
                                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                )}>
                                    <input type="radio" value={d} {...register('discipline')} className="hidden" />
                                    {d}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-200 w-full" />

                    {/* Step 3: Branching Logic */}
                    <div className="space-y-4 min-h-[120px]">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">3. Activity Details</label>

                        {discipline === 'Pipeline' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Item Description</label>
                                    <select {...register('boq_item_id')} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm">
                                        <option value="">Select Pipe / Valve...</option>
                                        {boqItems.map(i => (
                                            <option key={i.id} value={i.id}>{i.item_code} - {i.description}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs text-slate-500 mb-1 block">Length (m)</label>
                                        <input
                                            type="number"
                                            {...register('pipe_length')}
                                            placeholder="0.00"
                                            className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs text-slate-500 mb-1 block">Diameter</label>
                                        <select {...register('pipe_diameter')} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm">
                                            <option value="">Size...</option>
                                            <option value="63mm">63mm</option>
                                            <option value="90mm">90mm</option>
                                            <option value="110mm">110mm</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Soil Type</label>
                                    <select {...register('pipe_soil')} className="w-full p-3 border border-slate-300 bg-white rounded-lg">
                                        <option value="Normal">Normal Soil</option>
                                        <option value="Hard">Hard Rock</option>
                                        <option value="Soft">Soft Rock</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {discipline === 'Civil' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Structure Component</label>
                                    <select {...register('civil_component')} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm">
                                        <option value="">Select Component...</option>
                                        <option value="OHT">Overhead Tank (OHT)</option>
                                        <option value="Pump House">Pump House</option>
                                        <option value="Staff Quarters">Staff Quarters</option>
                                        <option value="Chlorination Room">Chlorination Room</option>
                                    </select>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs text-slate-500">Progress Stage (%)</label>
                                        <span className="text-sm font-bold text-blue-700">{civilStage}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        {...register('civil_stage_percent')}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                        <span>Excavation</span>
                                        <span>Raft</span>
                                        <span>Lintel</span>
                                        <span>Finishing</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(discipline === 'E&M' || discipline === 'Boundary Wall') && (
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-slate-400">
                                <Zap className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Standard Checklist enabled for {discipline}.</p>
                            </div>
                        )}
                    </div>

                    {/* Step 4: Summary & Submit */}
                    <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Generated Log Summary</label>
                        <textarea
                            readOnly
                            {...register('work_summary')}
                            className="w-full bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-700 italic resize-none focus:outline-none"
                            rows={2}
                        />
                    </div>

                    <button
                        disabled={isSubmitting}
                        className={cn(
                            "w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]",
                            isSubmitting ? "bg-slate-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800 shadow-blue-900/20"
                        )}
                    >
                        {isSubmitting ? 'Syncing...' : 'Submit Report'}
                        {!isSubmitting && <ArrowRight size={18} />}
                    </button>

                    {status === 'success' && (
                        <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-2 text-sm justify-center animate-in slide-in-from-bottom-2">
                            <CheckCircle size={16} /> Record Saved Successfully.
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
