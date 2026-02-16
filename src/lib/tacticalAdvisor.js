/**
 * Tactical Advisor Engine
 * Analyzes state to provide data-driven insights.
 */
export const analyzeTacticalState = (state) => {
    const { tasks, habits, habitLogs, user } = state;

    const insights = [];
    let motivation = "Stand by for tactical alignment.";
    let status = "optimal";

    // 1. Completion Velocity Analysis
    const today = new Date().toISOString().split('T')[0];
    const completedToday = tasks.filter(t => t.completed && t.completed_at?.startsWith(today)).length +
        habits.filter(h => h.completed).length;

    if (completedToday >= 5) {
        motivation = "Exceptional performance detected. System efficiency is at peak levels.";
        insights.push({
            title: "Performance Peak",
            message: "Velocity is exceeding median targets. Maintain this momentum.",
            type: "success"
        });
    } else if (completedToday > 0) {
        motivation = "Sectors clearing. Continue current mission parameters.";
    }

    // 2. Habit Consistency Check
    const activeHabits = habits.length;
    const completedHabits = habits.filter(h => h.completed).length;

    if (activeHabits > 0 && completedHabits === 0) {
        insights.push({
            title: "Neutral Pulse",
            message: "Daily habit protocols are currently inactive. Initiate sector check-in.",
            type: "warning"
        });
        status = "syncing";
    }

    // 3. Project Progress Insight
    const activeProjects = state.projects?.filter(p => !p.completed) || [];
    const stalledProject = activeProjects.find(p => (p.progress || 0) < 20);

    if (stalledProject) {
        insights.push({
            title: "Dormant Objective",
            message: `Project "${stalledProject.name}" requires tactical focus to break inertia.`,
            type: "info"
        });
    }

    // 4. Time Awareness
    const hour = new Date().getHours();
    if (hour > 22 || hour < 5) {
        motivation = "Late-night cycle detected. Optimizating for restorative protocols soon.";
    }

    return {
        motivation,
        insights: insights.length > 0 ? insights : [
            { title: "Grid Optimal", message: "All systems reporting nominal. Operational readiness 100%.", type: "success" }
        ],
        status
    };
};
