import LogicForm from '@/components/forms/LogicForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewReportPage() {
    return (
        <div className="min-h-screen bg-slate-900 pb-20">
            {/* Simple Mobile Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center gap-4 sticky top-0 z-10 border-b border-slate-800">
                <Link href="/" className="p-2 rounded-full hover:bg-slate-800 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="font-bold text-lg">New Daily Report</h1>
            </div>

            <LogicForm />
        </div>
    );
}
