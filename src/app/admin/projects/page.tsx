'use client';

import { useEffect, useState } from 'react';
import { dataProvider } from '@/lib/data-provider';
import { Map, Calendar, IndianRupee, ArrowUpRight } from 'lucide-react';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            const data = await dataProvider.getProjects();
            setProjects(data);
        }
        load();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Projects Scheme</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                    + New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Map size={20} />
                            </div>
                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Active
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {project.name}
                        </h3>
                        <p className="text-xs text-slate-500 mb-6 line-clamp-2">
                            JJM Scheme Implementation for {project.location || 'Rural District'}
                        </p>

                        <div className="space-y-3 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Calendar size={16} className="text-slate-400" />
                                <span>Start: {new Date(project.start_date || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <IndianRupee size={16} className="text-slate-400" />
                                <span>Limit: ₹{(project.financial_limit / 100000).toFixed(2)} Lakhs</span>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center gap-1">
                            View Details <ArrowUpRight size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
