// ... (Existing code) ...

export const getLiveAlerts = async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
        { id: 1, source: 'Alpha Vantage', type: 'FINANCE', msg: 'NVDA crossed $900 (RSI: 72)', time: 'Just now', priority: 'HIGH' },
        { id: 2, source: 'OpenWeatherMap', type: 'WEATHER', msg: 'Heavy Rain Alert for San Francisco', time: '5m ago', priority: 'MEDIUM' },
        { id: 3, source: 'NewsAPI', type: 'NEWS', msg: 'Breaking: Open Source AI Alliance announces new standards', time: '12m ago', priority: 'LOW' },
        { id: 4, source: 'Pathway', type: 'SYSTEM', msg: 'Real-time stream processing latency < 2ms', time: '15m ago', priority: 'INFO' }
    ];
}

// --- BADAL MAIL SIMULATION ---

export const analyzeSubjectLine = async (subject: string): Promise<{score: number, suggestions: string[]}> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const score = Math.floor(Math.random() * 30) + 70;
    const suggestions = [
        "Include a number to increase click-through rate.",
        "Use power words like 'Exclusive' or 'Now'.",
        "Keep it under 50 characters for mobile optimization."
    ];
    return { score, suggestions };
};

export const calculateSpamScore = async (content: string): Promise<{score: number, issues: string[]}> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const issues = [];
    if (content.toLowerCase().includes('free')) issues.push("Word 'FREE' detected (high spam trigger).");
    if (content.toUpperCase() === content && content.length > 10) issues.push("Excessive capitalization detected.");
    if (content.includes('$$$')) issues.push("Currency symbols may trigger filters.");
    
    return { 
        score: issues.length * 2.5, // 0 is best
        issues: issues.length > 0 ? issues : ["No critical spam triggers found."]
    };
};

export const simulateCampaignSend = async (campaignId: string, totalRecipients: number): Promise<{sent: number, bounced: number, time: string}> => {
    // This function will be called repeatedly by the UI to update progress
    // Just return a snapshot, state logic is better in component for smooth progress bar
    return {
        sent: 0,
        bounced: 0,
        time: new Date().toLocaleTimeString()
    };
};