import { format } from 'date-fns';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Local Heuristic Intelligence (Fallback)
 * Provides basic recommendations without API costs.
 */
const LocalIntelligence = {
    analyze: (tasks, projects, timetable) => {
        const now = new Date();
        const currentHour = now.getHours();

        let insight = {
            message: "Systems Nominal.",
            action: "Maintain Course",
            priority: "Normal"
        };

        const uncompletedTasks = tasks.filter(t => !t.completed);
        const nextTask = uncompletedTasks.length > 0 ? uncompletedTasks[0].text : "Tactical Review";

        if (currentHour < 9) {
            insight = {
                message: "Early morning detected. Initialize startup sequence.",
                action: `Focus on: ${nextTask}`,
                priority: "High"
            };
        } else if (currentHour >= 12 && currentHour < 14) {
            insight = {
                message: "Midday checkpoint. Refuel and recalibrate.",
                action: "Review progress",
                priority: "Medium"
            };
        } else if (currentHour > 18) {
            insight = {
                message: "End of cycle approaching. Finalize objectives.",
                action: "Close pending loops",
                priority: "Medium"
            };
        }

        if (uncompletedTasks.length > 5) {
            insight.message = "Overload warning. Too many active vectors.";
            insight.priority = "Critical";
        }

        return {
            ...insight,
            next_step: nextTask,
            mode: "Local Heuristic"
        };
    },

    chat: (message) => {
        const lower = message.toLowerCase();
        if (lower.includes('hello') || lower.includes('hi')) return "Greetings, Operator. Systems online.";
        if (lower.includes('status')) return "All systems operational. Ready for command.";
        if (lower.includes('help')) return "I can track tasks, monitor habits, and advise on scheduling.";
        if (lower.includes('joke')) return "Why did the developer go broke? Because he used up all his cache.";
        if (lower.includes('inspire') || lower.includes('quote')) return "Consistency is the code to success.";
        return "Command not recognized. Restate query.";
    }
};

/**
 * Gemini Cloud Intelligence
 * Uses Google's Gemini API for generative insights.
 */
const GeminiClient = {
    generate: async (prompt, apiKey) => {
        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Gemini Error:", error);
            return null; // Fallback will be handled by caller
        }
    }
};

export const AiService = {
    /**
     * Main entry point for AI insights.
     */
    generateInsight: async (context) => {
        const apiKey = localStorage.getItem('g_gemini_key');
        const useCloud = localStorage.getItem('g_use_cloud') === 'true';

        // 1. Prepare Context Data
        const dataSummary = `
            Current Time: ${format(new Date(), 'HH:mm')}
            Uncompleted Tasks: ${context.tasks.filter(t => !t.completed).map(t => t.text).join(', ')}
            Active Projects: ${context.projects.length}
            Habit Completion: ${Math.round((context.habits.filter(h => h.completed).length / (context.habits.length || 1)) * 100)}%
        `;

        // 2. Try Cloud if enabled
        if (apiKey && useCloud) {
            const prompt = `
                You are a tactical command assistant for a high-performance dashboard.
                Analyze this user status:
                ${dataSummary}
                
                Respond in valid JSON format ONLY with this structure:
                {
                    "message": "Short, punchy tactical status update (max 15 words)",
                    "action": "Specific recommended next action",
                    "priority": "High/Medium/Low",
                    "motivation": "A very short, intense motivational quote"
                }
                Keep the tone: Military / Sci-Fi / Professional / "Goat Mode".
            `;
            try {
                const text = await GeminiClient.generate(prompt, apiKey);
                // Clean markdown code blocks if present
                const jsonStr = text.replace(/```json|```/g, '').trim();
                const result = JSON.parse(jsonStr);
                return { ...result, mode: "Gemini Neural" };
            } catch (e) {
                console.warn("Cloud failed, switching to local.");
            }
        }

        // 3. Fallback to Local
        return LocalIntelligence.analyze(context.tasks, context.projects, context.timetable);
    },

    /**
     * Chat Functionality
     */
    chat: async (message, context) => {
        const apiKey = localStorage.getItem('g_gemini_key');
        const useCloud = localStorage.getItem('g_use_cloud') === 'true';

        if (apiKey && useCloud) {
            const prompt = `
                System: You are "Cortex", a tactical AI assistant. 
                Context provided:
                Tasks: ${context?.tasks?.length || 0} active.
                User: ${message}
                
                Respond briefly and helpfuly. Tone: Professional, slightly futuristic.
            `;
            const response = await GeminiClient.generate(prompt, apiKey);
            if (response) return response;
        }

        return LocalIntelligence.chat(message);
    },

    /**
     * Project Research Generation
     * Categorizes projects into domains (hardware, software, information)
     * and generates relevant tactical intelligence.
     */
    generateProjectResearch: async (name, description) => {
        const apiKey = localStorage.getItem('g_gemini_key');
        const useCloud = localStorage.getItem('g_use_cloud') === 'true';

        // 1. Determine Domain (Heuristic)
        const lowerName = name.toLowerCase();
        const lowerDesc = description.toLowerCase();
        let domain = 'hardware'; // Default

        const infoKeywords = ['math', 'science', 'theory', 'research', 'paper', 'equation', 'physics', 'study', 'learn', 'differential', 'academic', 'philosophy', 'logic'];
        const softwareKeywords = ['app', 'software', 'code', 'website', 'api', 'server', 'database', 'frontend', 'backend', 'fullstack', 'js', 'react', 'python', 'docker'];

        if (infoKeywords.some(kw => lowerName.includes(kw) || lowerDesc.includes(kw))) {
            domain = 'information';
        } else if (softwareKeywords.some(kw => lowerName.includes(kw) || lowerDesc.includes(kw))) {
            domain = 'software';
        }

        // 2. Try Cloud if enabled
        if (apiKey && useCloud) {
            const prompt = `
                You are a tactical research AI. Generate a research protocol for this project:
                Name: ${name}
                Description: ${description}
                Detected Domain: ${domain}

                Respond in valid JSON ONLY with this structure:
                {
                    "domain": "${domain}",
                    "brief": "One-sentence strategic summary",
                    "primary_list_label": "Label for the first list (e.g., Required Materials / Core Concepts / Tech Stack)",
                    "primary_list": ["item 1", "item 2", "item 3", "item 4", "item 5"],
                    "secondary_list_label": "Label for the second list (e.g., Implementation Steps / Research Plan / Development Phases)",
                    "secondary_list": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
                    "tactical_intel": ["Key tip 1", "Key tip 2"],
                    "difficulty": "Advanced/Intermediate/Basic",
                    "estTime": "Short estimate (e.g., 10-15 Hours)"
                }
                Tweak labels based on the domain.
            `;
            try {
                const text = await GeminiClient.generate(prompt, apiKey);
                const jsonStr = text.replace(/```json|```/g, '').trim();
                return JSON.parse(jsonStr);
            } catch (e) {
                console.warn("Project Research Cloud Failed", e);
            }
        }

        // 3. Local Fallback logic
        if (domain === 'information') {
            if (lowerName.includes('math')) {
                return {
                    domain: 'information',
                    brief: `Mathematical modeling and analytical derivation for ${name}.`,
                    primary_list_label: "Core Mathematical Concepts",
                    primary_list: ["Foundational Theorems", "Higher-Order Logic", "Computational Methods", "Reference Manuals", "Data Models"],
                    secondary_list_label: "Analysis & Proof Plan",
                    secondary_list: ["Define constraints", "Formulate equations", "Execute derivation", "Verify proof of concept", "Formal documentation"],
                    tactical_intel: ["Verify first principles before complex derivation.", "Maintain strict notation consistency."],
                    difficulty: "Advanced",
                    estTime: "10-20 Hours"
                };
            }
            return {
                domain: 'information',
                brief: `Theoretical analysis and conceptual modeling of ${name}.`,
                primary_list_label: "Core Concepts & References",
                primary_list: ["Foundational Theorems", "Academic Journals", "Reference Manuals", "Data Models", "Peer Reviews"],
                secondary_list_label: "Research & Analysis Plan",
                secondary_list: ["Literature review", "Hypothesis formulation", "Mathematical derivation", "Proof of concept", "Formal documentation"],
                tactical_intel: ["Cross-reference multiple sources for accuracy.", "Verify first principles before complex derivation."],
                difficulty: "Variable",
                estTime: "10-20 Hours"
            };
        }

        if (domain === 'software') {
            return {
                domain: 'software',
                brief: `Digital architecture and implementation protocol for ${name}.`,
                primary_list_label: "Technology Stack",
                primary_list: ["Framework Core", "State Management", "API Interface", "Database Schema", "Auth Protocols"],
                secondary_list_label: "Development Phases",
                secondary_list: ["Repo initialization", "Architecture design", "Core logic implementation", "Integration testing", "Deployment audit"],
                tactical_intel: ["Prioritize atomic component design.", "Implement robust error handling."],
                difficulty: "Intermediate",
                estTime: "20-40 Hours"
            };
        }

        // Hardware Fallback (Legacy)
        if (lowerName.includes('drone')) {
            return {
                domain: 'hardware',
                brief: "Next-gen aerial platform focused on high-thrust-to-weight ratios and low latency telemetry.",
                primary_list_label: "Required Materials",
                primary_list: ["Carbon Fiber Frame", "High-KV Brushless Motors", "4S LiPo Battery", "F4 Flight Controller", "Propellers"],
                secondary_list_label: "Implementation Steps",
                secondary_list: ["Assemble frame modules", "Mount tactical motors", "Configure PID tuning", "Calibrate IMU sensor", "Flight envelope test"],
                tactical_intel: ["Vibration isolation is critical for IMU stability.", "Use blue Loctite on all metal-to-metal screws."],
                difficulty: "Advanced",
                estTime: "12-18 Hours"
            };
        }

        return {
            domain: 'hardware',
            brief: `Physical assembly and engineering protocol for ${name}.`,
            primary_list_label: "Required Materials",
            primary_list: ["Structure Modules", "Power Systems", "Control Logic", "Interface Ports", "Fasteners"],
            secondary_list_label: "Implementation Steps",
            secondary_list: ["Chassis assembly", "Circuit integration", "Firmware calibration", "Stress testing", "Operational verify"],
            tactical_intel: ["Verify tolerances before assembly.", "Ensure proper thermal management."],
            difficulty: "Advanced",
            estTime: "15-25 Hours"
        };
    }
};
