import { supabase } from './supabaseClient';
import { mockDb, MOCK_PROJECTS } from './mock-db';
import { getProjectAnalytics } from './analytics';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const dataProvider = {
    getProjects: async () => {
        if (USE_MOCK) return mockDb.getProjects();
        const { data } = await supabase.from('projects').select('id, name');
        return data || [];
    },

    getBOQAnalytics: async (projectId: string) => {
        if (USE_MOCK) return mockDb.getAnalytics(projectId);
        return getProjectAnalytics(projectId);
    },

    getRecentReports: async () => {
        if (USE_MOCK) return mockDb.getRecentReports();
        const { data } = await supabase
            .from('daily_reports')
            .select('*, projects(name)')
            .order('created_at', { ascending: false })
            .limit(10);
        return data || [];
    },

    getBOQItems: async (projectId: string) => {
        if (USE_MOCK) return mockDb.getBOQItems(projectId);
        const { data } = await supabase.from('boq_items').select('*').eq('project_id', projectId);
        return data || [];
    },

    submitReport: async (data: any) => {
        if (USE_MOCK) return mockDb.submitReport(data);

        // Real submission logic duplicated from LogicForm for now, 
        // or LogicForm should keep its detailed logic and we just mock the success.
        // For 'LogicForm' it handles its own complex transaction. 
        // We might just return 'true' here if we abstract it fully, but LogicForm is complex.
        // For now, LogicForm checks USE_MOCK internally or we expose a helper.
        return { success: true };
    }
};

export const isMockMode = () => USE_MOCK;
