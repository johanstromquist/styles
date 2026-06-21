// Result Calculations and Visualizations
// Manages outcome display, dashboard updates, and citizen stories

class OutcomeManager {
    constructor() {
        this.gameState = null;
        this.scoringSystem = null;
    }
    
    // Initialize outcome manager
    async init(gameState) {
        this.gameState = gameState;
        console.log('Outcome manager initialized');
    }
    
    // Set scoring system reference for accessing metrics
    setScoringSystem(scoringSystem) {
        this.scoringSystem = scoringSystem;
    }
    
    // Show immediate outcome of a decision
    async showDecisionOutcome(choice, question) {
        // Create outcome display
        const outcomeHtml = this.generateOutcomeDisplay(choice, question);
        
        // Show temporary outcome notification
        this.showOutcomeNotification(outcomeHtml);
    }
    
    // Show outcome of a crisis response
    async showCrisisOutcome(response, crisis) {
        const outcomeHtml = this.generateCrisisOutcomeDisplay(response, crisis);
        this.showOutcomeNotification(outcomeHtml);
    }
    
    // Generate outcome display HTML
    generateOutcomeDisplay(choice, question) {
        let html = `<div class="outcome-display">`;
        html += `<h4>Decision Impact: ${question.title}</h4>`;
        html += `<p><strong>Your Choice:</strong> ${choice.text}</p>`;
        
        // Show metric impacts
        if (choice.metricImpacts && Object.keys(choice.metricImpacts).length > 0) {
            html += `<div class="metric-impacts">`;
            html += `<h5>National Impact:</h5><ul>`;
            
            for (const [metric, impact] of Object.entries(choice.metricImpacts)) {
                const direction = impact > 0 ? 'increased' : 'decreased';
                const color = impact > 0 ? 'green' : 'red';
                const metricName = this.getMetricDisplayName(metric);
                html += `<li style="color: ${color}">${metricName} ${direction} by ${Math.abs(impact)}</li>`;
            }
            html += `</ul></div>`;
        }
        
        // Show immediate consequences
        if (choice.consequences && choice.consequences.length > 0) {
            html += `<div class="immediate-consequences">`;
            html += `<h5>Immediate Results:</h5>`;
            html += `<p>${choice.consequences[0]}</p>`;
            html += `</div>`;
        }
        
        html += `</div>`;
        return html;
    }
    
    // Generate crisis outcome display
    generateCrisisOutcomeDisplay(response, crisis) {
        let html = `<div class="crisis-outcome-display">`;
        html += `<h4>Crisis Resolution: ${crisis.title}</h4>`;
        html += `<p><strong>Your Response:</strong> ${response.text}</p>`;
        
        // Show enhanced impacts (crises have larger effects)
        if (response.metricImpacts && Object.keys(response.metricImpacts).length > 0) {
            html += `<div class="crisis-impacts">`;
            html += `<h5>Crisis Impact on Nation:</h5><ul>`;
            
            for (const [metric, impact] of Object.entries(response.metricImpacts)) {
                const direction = impact > 0 ? 'improved' : 'worsened';
                const color = impact > 0 ? 'green' : 'red';
                const metricName = this.getMetricDisplayName(metric);
                const enhancedImpact = Math.abs(impact * 1.5); // Crisis impacts are larger
                html += `<li style="color: ${color}"><strong>${metricName} ${direction} significantly (${enhancedImpact.toFixed(1)})</strong></li>`;
            }
            html += `</ul></div>`;
        }
        
        html += `<p><em>Crisis responses often have long-term consequences that will unfold over time.</em></p>`;
        html += `</div>`;
        return html;
    }
    
    // Show outcome notification
    showOutcomeNotification(html) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'outcome-notification';
        notification.innerHTML = html;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #3498db;
            border-radius: 10px;
            padding: 20px;
            max-width: 500px;
            z-index: 1001;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Continue';
        closeBtn.style.cssText = `
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 15px;
            cursor: pointer;
        `;
        closeBtn.onclick = () => notification.remove();
        
        notification.appendChild(closeBtn);
        document.body.appendChild(notification);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 8000);
    }
    
    // Update the dashboard with current metrics
    updateDashboard() {
        if (!this.scoringSystem) {
            console.warn('Scoring system not available for dashboard update');
            return;
        }
        
        // Update overview stats
        this.updateOverviewStats();
        
        // Update all metric categories
        this.updateAllMetricCategories();
        
        // Update trend indicators
        this.updateTrendIndicators();
        
        // Update performance summary
        this.updatePerformanceSummary();
    }
    
    // Update overview statistics
    updateOverviewStats() {
        const metrics = this.scoringSystem.getCurrentMetrics();
        const avgScore = Object.values(metrics).reduce((sum, val) => sum + val, 0) / Object.keys(metrics).length;
        
        const overviewElement = document.getElementById('metrics-overview');
        if (overviewElement) {
            overviewElement.innerHTML = `
                <div class="overview-stat">
                    <span class="stat-label">Overall Performance</span>
                    <span class="stat-value ${this.getPerformanceClass(avgScore)}">${avgScore.toFixed(1)}</span>
                </div>
                <div class="overview-stat">
                    <span class="stat-label">Year</span>
                    <span class="stat-value">${this.gameState.currentYear}/20</span>
                </div>
                <div class="overview-stat">
                    <span class="stat-label">Phase</span>
                    <span class="stat-value">${this.gameState.currentPhase}</span>
                </div>
                <div class="overview-stat">
                    <span class="stat-label">Decisions Made</span>
                    <span class="stat-value">${this.gameState.totalDecisions}</span>
                </div>
            `;
        }
    }
    
    // Update all metric categories with enhanced visualization
    updateAllMetricCategories() {
        const categories = ['economic', 'social', 'governance', 'security', 'environmental', 'qualityOfLife'];
        
        for (const category of categories) {
            this.updateEnhancedMetricCategory(category);
        }
    }
    
    // Update enhanced metric category with full dashboard features
    updateEnhancedMetricCategory(category) {
        const categoryElement = document.getElementById(`${category}-category`);
        if (!categoryElement) return;
        
        const categoryMetrics = this.scoringSystem.getCategoryMetrics(category);
        const categoryAvg = Object.values(categoryMetrics).reduce((sum, val) => sum + val, 0) / Object.keys(categoryMetrics).length;
        const categoryTrend = this.scoringSystem.getCategoryTrend(category);
        
        // Update category header
        const headerElement = categoryElement.querySelector('.category-header');
        if (headerElement) {
            headerElement.innerHTML = `
                <h3>${this.getCategoryDisplayName(category)}</h3>
                <div class="category-stats">
                    <span class="category-average ${this.getPerformanceClass(categoryAvg)}">${categoryAvg.toFixed(1)}</span>
                    <span class="category-trend ${this.getTrendClass(categoryTrend)}">${this.getTrendIcon(categoryTrend)}</span>
                </div>
                <button class="category-toggle" onclick="this.parentElement.parentElement.classList.toggle('collapsed')">
                    <span class="toggle-icon">▼</span>
                </button>
            `;
        }
        
        // Update metrics grid
        const metricsGrid = categoryElement.querySelector('.metrics-grid');
        if (metricsGrid) {
            metricsGrid.innerHTML = '';
            
            for (const [metricName, value] of Object.entries(categoryMetrics)) {
                const metricElement = this.createEnhancedMetricElement(metricName, value);
                metricsGrid.appendChild(metricElement);
            }
        }
    }
    
    // Create enhanced metric display element with full dashboard features
    createEnhancedMetricElement(metricName, value) {
        const trend = this.scoringSystem.getMetricTrend(metricName);
        const displayName = this.getMetricDisplayName(metricName);
        const description = this.getMetricDescription(metricName);
        
        const element = document.createElement('div');
        element.className = 'metric-item';
        element.setAttribute('data-metric', metricName);
        
        // Color coding based on value ranges
        const colorClass = this.getMetricColorClass(value);
        
        element.innerHTML = `
            <div class="metric-header">
                <span class="metric-label">${displayName}</span>
                <div class="metric-indicators">
                    <span class="metric-value ${colorClass}">${Math.round(value)}</span>
                    ${trend.change !== 0 ? `<span class="metric-trend ${trend.change > 0 ? 'positive' : 'negative'}" title="Change: ${trend.change > 0 ? '+' : ''}${trend.change.toFixed(1)}">${trend.change > 0 ? '↗' : '↘'}</span>` : '<span class="metric-trend stable">→</span>'}
                </div>
            </div>
            <div class="metric-bar-container">
                <div class="metric-bar">
                    <div class="metric-fill ${colorClass}" style="width: ${Math.max(0, Math.min(100, value))}%"></div>
                </div>
                <div class="metric-scale">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                </div>
            </div>
            <div class="metric-details" style="display: none;">
                <p class="metric-description">${description}</p>
                <div class="metric-history">
                    <span>Recent trend: ${trend.trend}</span>
                    <span>Change: ${trend.change > 0 ? '+' : ''}${trend.change.toFixed(1)}</span>
                </div>
            </div>
        `;
        
        // Add click handler for expandable details
        element.addEventListener('click', () => {
            const details = element.querySelector('.metric-details');
            const isVisible = details.style.display !== 'none';
            details.style.display = isVisible ? 'none' : 'block';
            element.classList.toggle('expanded', !isVisible);
        });
        
        // Add hover effects
        element.addEventListener('mouseenter', () => {
            this.showMetricTooltip(element, metricName, value, trend);
        });
        
        element.addEventListener('mouseleave', () => {
            this.hideMetricTooltip();
        });
        
        return element;
    }
    
    // Update trend indicators for the dashboard
    updateTrendIndicators() {
        const trendElement = document.getElementById('trend-indicators');
        if (!trendElement) return;
        
        const trendAnalysis = this.scoringSystem.generateTrendAnalysis();
        
        trendElement.innerHTML = `
            <div class="trend-summary">
                <div class="trend-item">
                    <span class="trend-label">Overall Direction</span>
                    <span class="trend-value ${trendAnalysis.overallDirection}">${trendAnalysis.overallDirection}</span>
                </div>
                <div class="trend-item">
                    <span class="trend-label">Volatility</span>
                    <span class="trend-value ${trendAnalysis.volatility}">${trendAnalysis.volatility}</span>
                </div>
            </div>
            <div class="significant-trends">
                <h4>Significant Changes</h4>
                ${trendAnalysis.significantTrends.slice(0, 3).map(trend => `
                    <div class="trend-change ${trend.trend}">
                        <span>${this.getMetricDisplayName(trend.metric)}</span>
                        <span>${trend.change > 0 ? '+' : ''}${trend.change.toFixed(1)}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Update performance summary
    updatePerformanceSummary() {
        const summaryElement = document.getElementById('performance-summary');
        if (!summaryElement) return;
        
        const performanceAnalysis = this.scoringSystem.generatePerformanceAnalysis();
        
        summaryElement.innerHTML = `
            <div class="performance-categories">
                ${Object.entries(performanceAnalysis).map(([category, data]) => `
                    <div class="performance-category">
                        <h4>${this.getCategoryDisplayName(category)}</h4>
                        <div class="performance-score ${this.getPerformanceClass(data.averageScore)}">${data.averageScore.toFixed(1)}</div>
                        <div class="performance-trend ${data.trend}">${this.getTrendIcon(data.trend)}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Show metric tooltip on hover
    showMetricTooltip(element, metricName, value, trend) {
        const tooltip = document.getElementById('metric-tooltip') || this.createTooltip();
        const description = this.getMetricDescription(metricName);
        
        tooltip.innerHTML = `
            <div class="tooltip-header">
                <strong>${this.getMetricDisplayName(metricName)}</strong>
                <span class="tooltip-value">${Math.round(value)}/100</span>
            </div>
            <div class="tooltip-content">
                <p>${description}</p>
                <div class="tooltip-trend">
                    <span>Recent change: ${trend.change > 0 ? '+' : ''}${trend.change.toFixed(1)}</span>
                    <span>Trend: ${trend.trend}</span>
                </div>
            </div>
        `;
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.display = 'block';
    }
    
    // Hide metric tooltip
    hideMetricTooltip() {
        const tooltip = document.getElementById('metric-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
    
    // Create tooltip element
    createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.id = 'metric-tooltip';
        tooltip.className = 'metric-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            max-width: 250px;
            z-index: 1000;
            display: none;
            transform: translateX(-50%) translateY(-100%);
            pointer-events: none;
        `;
        document.body.appendChild(tooltip);
        return tooltip;
    }
    
    // Utility methods for dashboard styling and display
    getPerformanceClass(score) {
        if (score >= 75) return 'excellent';
        if (score >= 60) return 'good';
        if (score >= 40) return 'fair';
        return 'poor';
    }
    
    getMetricColorClass(value) {
        if (value >= 75) return 'high';
        if (value >= 50) return 'medium';
        if (value >= 25) return 'low';
        return 'critical';
    }
    
    getTrendClass(trend) {
        if (trend === 'improving') return 'positive';
        if (trend === 'declining') return 'negative';
        return 'stable';
    }
    
    getTrendIcon(trend) {
        if (trend === 'improving') return '📈';
        if (trend === 'declining') return '📉';
        return '➡️';
    }
    
    getCategoryDisplayName(category) {
        const names = {
            economic: 'Economic Performance',
            social: 'Social Development',
            governance: 'Governance Quality',
            security: 'Security & Stability',
            environmental: 'Environmental Health',
            qualityOfLife: 'Quality of Life'
        };
        return names[category] || category;
    }
    
    getMetricDescription(metricName) {
        const metricInfo = this.scoringSystem.getMetricInfo();
        return metricInfo[metricName]?.description || `Measures the nation's performance in ${metricName.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
    }
    
    // Generate citizen stories based on recent decisions
    async generateCitizenStories(choice) {
        // Simple story generation based on choice impacts
        const stories = [];
        
        if (choice.metricImpacts) {
            // Generate stories based on significant impacts
            for (const [metric, impact] of Object.entries(choice.metricImpacts)) {
                if (Math.abs(impact) >= 5) {
                    const story = this.generateStoryForMetric(metric, impact);
                    if (story) {
                        stories.push(story);
                    }
                }
            }
        }
        
        // Limit to 1-2 stories per decision to avoid fatigue
        return stories.slice(0, Math.random() > 0.7 ? 2 : 1);
    }
    
    // Generate a citizen story for a specific metric impact
    generateStoryForMetric(metric, impact) {
        const storyTemplates = {
            educationQuality: {
                positive: {
                    profile: `<h4>Maria Santos, Elementary Teacher</h4><p>Age 34, Mother of two</p>`,
                    text: `"The new education policies have made such a difference in my classroom. We finally have the resources we need, and I can see my students thriving. My own children are getting opportunities I never had."`
                },
                negative: {
                    profile: `<h4>David Kim, High School Student</h4><p>Age 17, College-bound</p>`,
                    text: `"The cuts to education are really scary. Our textbooks are outdated, class sizes are huge, and I'm worried about getting into university. It feels like our future is being sacrificed."`
                }
            },
            healthOutcomes: {
                positive: {
                    profile: `<h4>Ahmed Hassan, Factory Worker</h4><p>Age 42, Father of three</p>`,
                    text: `"When my daughter got sick, we didn't have to choose between her health and our savings. The healthcare system actually worked for us. That's peace of mind I never had before."`
                },
                negative: {
                    profile: `<h4>Elena Rodriguez, Single Mother</h4><p>Age 29, Retail Worker</p>`,
                    text: `"I had to skip my own doctor's appointment again because I can't afford it. How am I supposed to take care of my son if I can't take care of myself? The system is failing families like mine."`
                }
            },
            incomeEquality: {
                positive: {
                    profile: `<h4>James Mitchell, Construction Worker</h4><p>Age 38, Union Member</p>`,
                    text: `"For the first time in years, I feel like hard work is actually paying off. The gap between us and the wealthy is shrinking, and my family has real opportunities now."`
                },
                negative: {
                    profile: `<h4>Sarah Chen, Nurse</h4><p>Age 31, Essential Worker</p>`,
                    text: `"I work double shifts saving lives, but I still can't afford to buy a house while my boss just bought his third vacation home. The inequality is getting worse every year."`
                }
            },
            environmentalHealth: {
                positive: {
                    profile: `<h4>Green Valley Resident</h4><p>Community of 2,500</p>`,
                    text: `"Our children can play outside again without worry. The air is cleaner, the water is safer, and we're seeing wildlife return to our area. It's like our community has been reborn."`
                },
                negative: {
                    profile: `<h4>River District Resident</h4><p>Industrial area</p>`,
                    text: `"The pollution keeps getting worse. My kids have asthma, the river smells terrible, and nobody seems to care about our neighborhood. We feel forgotten and poisoned."`
                }
            }
        };
        
        const template = storyTemplates[metric];
        if (!template) return null;
        
        const storyType = impact > 0 ? 'positive' : 'negative';
        const story = template[storyType];
        
        if (!story) return null;
        
        return {
            profile: story.profile,
            text: story.text,
            metric: metric,
            impact: impact
        };
    }
    
    // Get display name for a metric
    getMetricDisplayName(metricName) {
        if (this.scoringSystem) {
            const metricInfo = this.scoringSystem.getMetricInfo();
            if (metricInfo && metricInfo[metricName]) {
                return metricInfo[metricName].name;
            }
        }
        
        // Fallback: convert camelCase to readable format
        return metricName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
    
    // Generate summary statistics for display
    generateSummaryStats() {
        if (!this.scoringSystem) return null;
        
        return this.scoringSystem.getSummaryStats();
    }
    
    // Create a detailed metrics report
    generateMetricsReport() {
        if (!this.scoringSystem) return 'Scoring system not available';
        
        const performance = this.scoringSystem.calculateSocietalPerformance();
        
        let html = '<div class="metrics-report">';
        html += `<h3>National Performance Report - Year ${this.gameState.currentYear}</h3>`;
        html += `<p><strong>Overall Score:</strong> ${performance.overall.toFixed(1)}/100</p>`;
        
        html += '<h4>Category Performance:</h4>';
        html += '<div class="category-grid">';
        
        for (const [categoryName, categoryData] of Object.entries(performance.categories)) {
            const grade = this.getPerformanceGrade(categoryData.average);
            html += `<div class="category-summary">`;
            html += `<h5>${categoryData.title}</h5>`;
            html += `<div class="score">${categoryData.average.toFixed(1)}</div>`;
            html += `<div class="grade">${grade}</div>`;
            html += `</div>`;
        }
        
        html += '</div></div>';
        return html;
    }
    
    // Get performance grade
    getPerformanceGrade(score) {
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        if (score >= 50) return 'D';
        return 'F';
    }
    
    // Show mid-game reflection (years 5, 10, 15)
    showMidGameReflection() {
        const year = this.gameState.currentYear;
        
        if ([5, 10, 15].includes(year)) {
            const reflection = this.generateMidGameReflection();
            this.showReflectionModal(reflection);
        }
    }
    
    // Generate mid-game reflection content
    generateMidGameReflection() {
        const stats = this.generateSummaryStats();
        const year = this.gameState.currentYear;
        
        let html = `<div class="mid-game-reflection">`;
        html += `<h3>Year ${year} Leadership Reflection</h3>`;
        
        if (stats) {
            html += `<p>You have made <strong>${stats.totalDecisions}</strong> major decisions and navigated <strong>${stats.crises}</strong> crises.</p>`;
            
            if (stats.dominantIdeology) {
                html += `<p>Your leadership style most closely aligns with <strong>${stats.dominantIdeology}</strong> principles (${stats.ideologyPercentage.toFixed(1)}%).</p>`;
            } else {
                html += `<p>Your leadership shows a <strong>pragmatic, mixed approach</strong> drawing from multiple governing philosophies.</p>`;
            }
            
            html += `<p>Your national performance score is <strong>${stats.overallScore.toFixed(1)}/100</strong>.</p>`;
        }
        
        html += '<h4>Reflection Questions:</h4>';
        html += '<ul>';
        html += '<li>How have your decisions reflected your personal values?</li>';
        html += '<li>What has been your most challenging decision so far?</li>';
        html += '<li>Are you satisfied with your nation\'s progress?</li>';
        html += '<li>What would you do differently if you could start over?</li>';
        html += '</ul>';
        
        html += `</div>`;
        return html;
    }
    
    // Show reflection modal
    showReflectionModal(content) {
        const modal = document.createElement('div');
        modal.className = 'reflection-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        modalContent.innerHTML = content;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Continue Leadership';
        closeBtn.style.cssText = `
            background: #3498db;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            margin-top: 20px;
            cursor: pointer;
            font-size: 16px;
        `;
        closeBtn.onclick = () => modal.remove();
        
        modalContent.appendChild(closeBtn);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }
}

export { OutcomeManager }; 