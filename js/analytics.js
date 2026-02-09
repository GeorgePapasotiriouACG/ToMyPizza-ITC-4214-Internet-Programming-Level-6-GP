/*
    FILE: analytics.js - Analytics Dashboard
    CONTENTS:
    1. AnalyticsDashboard class for data visualization
    2. Chart.js integration for data charts
    3. Athens delivery zone heat map
    4. Real-time order timeline
    5. Pizza popularity meter
    6. Interactive dashboard components
    
    FEATURES:
    - Interactive charts (status, priority, delivery, trends)
    - Athens delivery zone visualization
    - Real-time timeline with refresh
    - Pizza popularity progress bars
    - Statistics cards with Greek data
    - Dark mode compatible charts
    
    AUTHOR: George Papasotiriou
    COURSE: ITC 4214 - Fullstack Web Design
    PROJECT: ToMyPizza! Task Management Application
*/


// Analytics Dashboard for ToMyPizza! Corp

class AnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.init();
    }
    
    init() {
        this.loadData();
        this.createCharts();
        this.setupEventListeners();
        this.updateStats();
    }
    
    loadData() {
        // In a real app, this would fetch from an API
        // For demo, me use sample data and localStorage
        this.tasks = JSON.parse(localStorage.getItem('pizzaOrders')) || this.getSampleData();
    }
    
    getSampleData() {
        // Generate sample data for demo
        const pizzaTypes = ['Pepperoni', 'Margherita', 'BBQ Chicken', 'Veggie Supreme', 'Hawaiian', 'Meat Lovers'];
        const statuses = ['pending', 'completed'];
        const priorities = ['low', 'medium', 'high'];
        
        const sampleData = [];
        const now = new Date();
        
        for (let i = 0; i < 20; i++) {
            const randomDate = new Date();
            randomDate.setDate(now.getDate() - Math.floor(Math.random() * 30));
            randomDate.setHours(Math.floor(Math.random() * 24));
            
            sampleData.push({
                id: i + 1,
                name: `${pizzaTypes[Math.floor(Math.random() * pizzaTypes.length)]} Pizza`,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                due: randomDate.toISOString(),
                created: randomDate.toISOString(),
                completedAt: Math.random() > 0.5 ? new Date(randomDate.getTime() + 30 * 60000).toISOString() : null
            });
        }
        
        return sampleData;
    }
    
    createCharts() {
        this.createStatusChart();
        this.createPriorityChart();
        this.createDeliveryChart();
        this.createTrendChart();
    }
    
    createStatusChart() {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;
        
        const pending = this.tasks.filter(t => t.status === 'pending').length;
        const completed = this.tasks.filter(t => t.status === 'completed').length;
        
        this.charts.status = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['In Progress', 'Delivered'],
                datasets: [{
                    data: [pending, completed],
                    backgroundColor: [
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(40, 167, 69, 0.8)'
                    ],
                    borderColor: [
                        'rgb(255, 193, 7)',
                        'rgb(40, 167, 69)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw} orders`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    createPriorityChart() {
        const ctx = document.getElementById('priorityChart');
        if (!ctx) return;
        
        const high = this.tasks.filter(t => t.priority === 'high').length;
        const medium = this.tasks.filter(t => t.priority === 'medium').length;
        const low = this.tasks.filter(t => t.priority === 'low').length;
        
        this.charts.priority = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['High', 'Medium', 'Low'],
                datasets: [{
                    label: 'Number of Orders',
                    data: [high, medium, low],
                    backgroundColor: [
                        'rgba(220, 53, 69, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(40, 167, 69, 0.8)'
                    ],
                    borderColor: [
                        'rgb(220, 53, 69)',
                        'rgb(255, 193, 7)',
                        'rgb(40, 167, 69)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    createDeliveryChart() {
        const ctx = document.getElementById('deliveryChart');
        if (!ctx) return;
        
        // Sample delivery performance data
        const deliveryData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'On Time (<25 min)',
                data: [15, 12, 18, 14, 22, 25, 20],
                backgroundColor: 'rgba(40, 167, 69, 0.8)'
            }, {
                label: 'Late (25-35 min)',
                data: [3, 2, 4, 5, 2, 1, 3],
                backgroundColor: 'rgba(255, 193, 7, 0.8)'
            }, {
                label: 'Very Late (>35 min)',
                data: [1, 0, 2, 1, 0, 0, 1],
                backgroundColor: 'rgba(220, 53, 69, 0.8)'
            }]
        };
        
        this.charts.delivery = new Chart(ctx, {
            type: 'bar',
            data: deliveryData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Update percentages
        const total = 150; // Sample total
        const onTime = 126;
        const late = 20;
        const veryLate = 4;
        
        document.getElementById('on-time-percent').textContent = Math.round((onTime / total) * 100) + '%';
        document.getElementById('late-percent').textContent = Math.round((late / total) * 100) + '%';
        document.getElementById('very-late-percent').textContent = Math.round((veryLate / total) * 100) + '%';
    }
    
    createTrendChart() {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;
        
        // Generate sample trend data
        const weekData = [15, 18, 22, 25, 30, 35, 28];
        const monthData = Array.from({length: 30}, () => Math.floor(Math.random() * 40) + 10);
        
        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: weekData.map((_, i) => `Day ${i + 1}`),
                datasets: [{
                    label: 'Daily Orders',
                    data: weekData,
                    borderColor: 'rgb(255, 107, 0)',
                    backgroundColor: 'rgba(255, 107, 0, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Store both datasets for toggling
        this.trendData = {
            week: weekData,
            month: monthData
        };
    }
    
    updateStats() {
        // Today's orders
        const today = new Date().toDateString();
        const todaysOrders = this.tasks.filter(task => {
            const taskDate = new Date(task.created).toDateString();
            return taskDate === today;
        }).length;
        
        document.getElementById('total-orders-today').textContent = todaysOrders || '0';
        
        // Average delivery time (sample data)
        document.getElementById('avg-delivery-time').textContent = '23.4';
        
        // Peak hour (sample data)
        document.getElementById('peak-hour').textContent = '7:30 PM';
        
        // Top pizza (from sample data)
        const pizzaCounts = {};
        this.tasks.forEach(task => {
            const pizzaName = task.name.split(' ')[0]; // Get first word (pizza type)
            pizzaCounts[pizzaName] = (pizzaCounts[pizzaName] || 0) + 1;
        });
        
        let topPizza = 'N/A';
        let maxCount = 0;
        for (const [pizza, count] of Object.entries(pizzaCounts)) {
            if (count > maxCount) {
                maxCount = count;
                topPizza = pizza;
            }
        }
        
        document.getElementById('top-pizza').textContent = topPizza;
    }
    
    setupEventListeners() {
        // Trend chart period toggle
        document.querySelectorAll('[data-period]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.target.dataset.period;
                
                // Update active button
                document.querySelectorAll('[data-period]').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
                
                // Update chart data
                if (this.charts.trend) {
                    const labels = period === 'week' 
                        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        : Array.from({length: 30}, (_, i) => `Day ${i + 1}`);
                    
                    this.charts.trend.data.labels = labels;
                    this.charts.trend.data.datasets[0].data = this.trendData[period];
                    this.charts.trend.update();
                }
            });
        });
        
        // Heat map zone interactions
        document.querySelectorAll('.zone').forEach(zone => {
            zone.addEventListener('click', () => {
                const orders = zone.dataset.orders;
                const zoneNum = zone.classList[1].split('-')[1];
                
                const details = document.getElementById('zone-details');
                details.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5>Zone ${zoneNum}</h5>
                            <p><strong>Orders this week:</strong> ${orders}</p>
                            <p><strong>Avg delivery time:</strong> ${25 + parseInt(zoneNum)} minutes</p>
                            <p><strong>Popular pizza:</strong> ${zoneNum === '3' ? 'Pepperoni' : zoneNum === '1' ? 'Margherita' : 'BBQ Chicken'}</p>
                            <div class="pizza-decoration mt-2">
                                <i class="fas fa-pizza-slice text-warning"></i>
                                <i class="fas fa-truck text-success mx-2"></i>
                                <i class="fas fa-pizza-slice text-warning"></i>
                            </div>
                        </div>
                    </div>
                `;
                
                // Highlight clicked zone
                document.querySelectorAll('.zone').forEach(z => {
                    z.style.boxShadow = 'none';
                });
                zone.style.boxShadow = '0 0 0 3px rgba(255, 107, 0, 0.5)';
            });
        });
        
        // Refresh timeline button
        document.getElementById('refresh-timeline')?.addEventListener('click', () => {
            this.refreshTimeline();
        });
        
        // Auto refresh charts every 30 seconds (simulated real-time updates)
        setInterval(() => {
            this.simulateRealTimeUpdate();
        }, 30000);
    }
    
    refreshTimeline() {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;
        
        // Sample timeline items
        const activities = [
            {
                title: "New Order: Hawaiian Pizza",
                time: "Just now",
                icon: "fa-plus-circle",
                color: "primary",
                marker: "bg-primary",
                decorations: ['fa-pineapple', 'fa-plus-circle', 'fa-clock']
            },
            {
                title: "Pepperoni Pizza in Oven",
                time: "3 minutes in oven",
                icon: "fa-fire",
                color: "danger",
                marker: "bg-warning",
                decorations: ['fa-pepper-hot', 'fa-fire', 'fa-clock']
            },
            {
                title: "2x Margherita Pizzas Delivered",
                time: "2 minutes ago",
                icon: "fa-check-circle",
                color: "success",
                marker: "bg-success",
                decorations: ['fa-leaf', 'fa-check-circle', 'fa-truck']
            }
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        
        // Shift existing items downwards
        const items = timeline.querySelectorAll('.timeline-item');
        for (let i = items.length - 1; i > 0; i--) {
            items[i].innerHTML = items[i-1].innerHTML;
        }
        
        // Update first item
        if (items.length > 0) {
            items[0].innerHTML = `
                <div class="timeline-marker ${randomActivity.marker}"></div>
                <div class="timeline-content">
                    <h6>${randomActivity.title}</h6>
                    <p class="text-muted mb-0">Order #${460 + Math.floor(Math.random() * 10)} • ${randomActivity.time}</p>
                    <div class="pizza-decoration">
                        <i class="fas ${randomActivity.decorations[0]} text-${randomActivity.color}"></i>
                        <i class="fas ${randomActivity.decorations[1]} text-${randomActivity.color} mx-1"></i>
                        <i class="fas ${randomActivity.decorations[2]} text-warning"></i>
                    </div>
                </div>
            `;
        }
        
        // Show refresh notification
        this.showNotification('Timeline refreshed with latest orders', 'info');
    }
    
    simulateRealTimeUpdate() {
        //Simulate new data coming in
        if (this.charts.status) {
            //Randomly update one data point
            const newPending = Math.max(0, this.charts.status.data.datasets[0].data[0] + (Math.random() > 0.5 ? 1 : -1));
            const newCompleted = Math.max(0, this.charts.status.data.datasets[0].data[1] + (Math.random() > 0.5 ? 1 : -1));
            
            this.charts.status.data.datasets[0].data = [newPending, newCompleted];
            this.charts.status.update('none');
        }
        
        //Update today's orders count
        const currentCount = parseInt(document.getElementById('total-orders-today').textContent) || 0;
        document.getElementById('total-orders-today').textContent = currentCount + (Math.random() > 0.7 ? 1 : 0);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 1050;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'sync-alt'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize analytics dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('statusChart')) {
        window.analyticsDashboard = new AnalyticsDashboard();
    }
});