/*
    FILE: tasks.js - Order Management System
    CONTENTS:
    1. TaskManager class for order management
    2. Dummy orders for demonstration
    3. CRUD operations for pizza orders
    4. Real-time order timers
    5. Filtering and sorting functionality
    6. Local storage integration
    7. Form handling and validation
    8. UI updates and notifications
    
    FEATURES:
    - Add, edit, delete, and complete orders
    - Priority system with color coding
    - Real-time countdown timers
    - Filter by status and sort by various criteria
    - Pizza-themed visual indicators
    - Form validation with feedback
    
    AUTHOR: George Papasotiriou
    COURSE: ITC 4214 - Fullstack Web Design
    PROJECT: ToMyPizza! Task Management Application
*/

// ===== TASK MANAGER CLASS =====
class TaskManager {
    constructor() {
        // Load tasks from localStorage or create dummy data
        const storedOrders = localStorage.getItem('pizzaOrders');
        this.tasks = storedOrders ? JSON.parse(storedOrders) : this.createDemoOrders();
        
        this.currentFilter = 'all';
        this.currentSort = 'due';
        this.init();
    }
    
    // ===== INITIALIZATION =====
    init() {
        this.setupEventListeners();
        this.loadTasks();
        this.updateOrderSummary();
        this.startTimers();
        this.showWelcomeNotification();
    }
    
    // ===== DEMO DATA CREATION =====
    createDemoOrders() {
        const now = new Date();
        const demoOrders = [
            {
                id: 1001,
                name: "Large Pepperoni Pizza",
                description: "Extra cheese, double pepperoni, well-done crust",
                due: new Date(now.getTime() + 15 * 60000).toISOString(), // 15 minutes
                priority: "high",
                status: "pending",
                created: new Date(now.getTime() - 5 * 60000).toISOString(),
                location: "Aghia Paraskevi"
            },
            {
                id: 1002,
                name: "Family Size Margherita",
                description: "Fresh basil, extra mozzarella, light sauce",
                due: new Date(now.getTime() + 25 * 60000).toISOString(), // 25 minutes
                priority: "medium",
                status: "pending",
                created: new Date(now.getTime() - 10 * 60000).toISOString(),
                location: "Chalandri"
            },
            {
                id: 1003,
                name: "Medium BBQ Chicken Pizza",
                description: "No onions, extra BBQ sauce, stuffed crust",
                due: new Date(now.getTime() + 35 * 60000).toISOString(), // 35 minutes
                priority: "low",
                status: "pending",
                created: new Date(now.getTime() - 15 * 60000).toISOString(),
                location: "Marousi"
            },
            {
                id: 1004,
                name: "2x Veggie Supreme Pizzas",
                description: "One with gluten-free crust, extra vegetables",
                due: new Date(now.getTime() - 10 * 60000).toISOString(), // Overdue
                priority: "medium",
                status: "pending",
                created: new Date(now.getTime() - 45 * 60000).toISOString(),
                location: "Kifisia"
            },
            {
                id: 1005,
                name: "Hawaiian Pizza",
                description: "Extra ham, light cheese, pineapple on half",
                due: new Date(now.getTime() - 30 * 60000).toISOString(),
                priority: "high",
                status: "completed",
                created: new Date(now.getTime() - 60 * 60000).toISOString(),
                completedAt: new Date(now.getTime() - 25 * 60000).toISOString(),
                location: "Nea Smyrni"
            },
            {
                id: 1006,
                name: "Meat Lovers Pizza",
                description: "All meats, stuffed crust, extra sauce",
                due: new Date(now.getTime() - 45 * 60000).toISOString(),
                priority: "high",
                status: "completed",
                created: new Date(now.getTime() - 90 * 60000).toISOString(),
                completedAt: new Date(now.getTime() - 40 * 60000).toISOString(),
                location: "Aghia Paraskevi"
            },
            {
                id: 1007,
                name: "Four Cheese Pizza",
                description: "Add mushrooms and black olives",
                due: new Date(now.getTime() + 20 * 60000).toISOString(), // 20 minutes
                priority: "medium",
                status: "pending",
                created: new Date(now.getTime() - 8 * 60000).toISOString(),
                location: "Chalandri"
            },
            {
                id: 1008,
                name: "Greek Style Pizza",
                description: "Feta cheese, Kalamata olives, oregano",
                due: new Date(now.getTime() + 40 * 60000).toISOString(), // 40 minutes
                priority: "low",
                status: "pending",
                created: new Date(now.getTime() - 3 * 60000).toISOString(),
                location: "Marousi"
            }
        ];
        
        // Save demo orders to localStorage
        this.saveTasks();
        return demoOrders;
    }
    
    // ===== TASK LOADING AND DISPLAY =====
    loadTasks() {
        const tasksContainer = document.getElementById('tasks-list');
        if (!tasksContainer) return;
        
        if (this.tasks.length === 0) {
            this.showEmptyState(tasksContainer);
            return;
        }
        
        // Filter and sort tasks
        let filteredTasks = this.filterTasks(this.tasks);
        filteredTasks = this.sortTasks(filteredTasks);
        
        // Render tasks
        tasksContainer.innerHTML = filteredTasks.map(task => this.createTaskRow(task)).join('');
        document.getElementById('order-count').textContent = `${filteredTasks.length} orders`;
    }
    
    createTaskRow(task) {
        const dueDate = new Date(task.due);
        const now = new Date();
        const timeDiff = dueDate - now;
        const isOverdue = timeDiff <= 0 && task.status !== 'completed';
        
        // Calculate time display
        const timerDisplay = this.createTimerDisplay(task, timeDiff);
        
        // Priority styling
        const priorityInfo = this.getPriorityInfo(task.priority);
        
        // Status badge
        const statusBadge = task.status === 'completed' 
            ? '<span class="badge bg-success">Delivered</span>'
            : '<span class="badge bg-warning text-dark">In Progress</span>';
        
        // Pizza decoration based on type
        const pizzaDecoration = this.getPizzaDecoration(task.name);
        
        // Format due date
        const formattedDue = dueDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Row styling for overdue tasks
        const rowClass = isOverdue ? 'table-danger' : '';
        
        return `
            <tr data-id="${task.id}" class="${rowClass}">
                <td>
                    <div class="d-flex align-items-center">
                        ${pizzaDecoration}
                        <div class="ms-2">
                            <div class="fw-medium">${task.name}</div>
                            <small class="text-muted">${task.location || 'Athens'}</small>
                        </div>
                    </div>
                </td>
                <td>${task.description || 'No special instructions'}</td>
                <td>
                    <div class="small text-muted">${formattedDue}</div>
                </td>
                <td><span class="badge ${priorityInfo.class}">${priorityInfo.text}</span></td>
                <td>${statusBadge}</td>
                <td>${timerDisplay}</td>
                <td>
                    <div class="btn-group btn-group-sm" role="group" aria-label="Order actions">
                        <button class="btn btn-outline-warning btn-edit" 
                                title="Edit Order" aria-label="Edit order">
                            <i class="fas fa-edit" aria-hidden="true"></i>
                        </button>
                        <button class="btn btn-outline-success btn-complete" 
                                title="Mark as Delivered" aria-label="Mark as delivered">
                            <i class="fas fa-check" aria-hidden="true"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-delete" 
                                title="Delete Order" aria-label="Delete order">
                            <i class="fas fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    createTimerDisplay(task, timeDiff) {
        if (task.status === 'completed') {
            return '<span class="badge bg-success">Delivered</span>';
        }
        
        if (timeDiff <= 0) {
            const overdueMinutes = Math.abs(Math.floor(timeDiff / (1000 * 60)));
            return `<span class="badge bg-danger">Overdue ${overdueMinutes}m</span>`;
        }
        
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        let displayText = '';
        if (hours > 0) {
            displayText = `${hours}h ${minutes}m`;
        } else {
            displayText = `${minutes}m`;
        }
        
        return `<span class="task-timer">${displayText}</span>`;
    }
    
    getPriorityInfo(priority) {
        const priorities = {
            high: { class: 'bg-danger', text: 'High' },
            medium: { class: 'bg-warning text-dark', text: 'Medium' },
            low: { class: 'bg-success', text: 'Low' }
        };
        return priorities[priority] || priorities.medium;
    }
    
    getPizzaDecoration(pizzaName) {
        const lowerName = pizzaName.toLowerCase();
        
        if (lowerName.includes('pepperoni')) {
            return '<i class="fas fa-pepper-hot text-danger"></i>';
        } else if (lowerName.includes('margherita') || lowerName.includes('veggie')) {
            return '<i class="fas fa-leaf text-success"></i>';
        } else if (lowerName.includes('bbq') || lowerName.includes('chicken')) {
            return '<i class="fas fa-drumstick-bite text-danger"></i>';
        } else if (lowerName.includes('cheese')) {
            return '<i class="fas fa-cheese text-warning"></i>';
        } else if (lowerName.includes('hawaiian')) {
            return '<i class="fas fa-pineapple text-warning"></i>';
        } else if (lowerName.includes('greek')) {
            return '<i class="fas fa-flag text-blue"></i>';
        } else {
            return '<i class="fas fa-pizza-slice text-warning"></i>';
        }
    }
    
    showEmptyState(container) {
        container.innerHTML = `
            <tr class="text-center">
                <td colspan="7" class="py-5">
                    <i class="fas fa-pizza-slice fa-3x text-warning mb-3"></i>
                    <h4 class="fw-bold mb-2">No Pizza Orders Yet!</h4>
                    <p class="text-muted">Place your first order to get started.</p>
                    <button class="btn btn-warning mt-2" id="create-first-order">
                        <i class="fas fa-plus me-2"></i>Create First Order
                    </button>
                </td>
            </tr>
        `;
        
        // Add event listener for creating first order
        document.getElementById('create-first-order')?.addEventListener('click', () => {
            this.prefillFirstOrder();
        });
    }
    
    // ===== FILTERING AND SORTING =====
    filterTasks(tasks) {
        switch(this.currentFilter) {
            case 'pending':
                return tasks.filter(task => task.status === 'pending');
            case 'completed':
                return tasks.filter(task => task.status === 'completed');
            default:
                return tasks;
        }
    }
    
    sortTasks(tasks) {
        return [...tasks].sort((a, b) => {
            switch(this.currentSort) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'due':
                default:
                    return new Date(a.due) - new Date(b.due);
            }
        });
    }
    
    // ===== CRUD OPERATIONS =====
    addTask(taskData) {
        const newTask = {
            id: Date.now(),
            name: taskData.name.trim(),
            description: taskData.description?.trim() || '',
            due: taskData.due,
            priority: taskData.priority || 'medium',
            status: 'pending',
            created: new Date().toISOString(),
            location: this.getRandomAthensLocation()
        };
        
        this.tasks.push(newTask);
        this.saveTasks();
        this.loadTasks();
        this.updateOrderSummary();
        
        // Show success notification
        this.showNotification(`Order added: ${newTask.name}`, 'success');
        
        // Scroll to new task
        setTimeout(() => {
            const newRow = document.querySelector(`[data-id="${newTask.id}"]`);
            if (newRow) {
                newRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                newRow.classList.add('highlight-new');
                setTimeout(() => newRow.classList.remove('highlight-new'), 2000);
            }
        }, 100);
    }
    
    editTask(taskId, updatedData) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedData };
            this.saveTasks();
            this.loadTasks();
            this.updateOrderSummary();
            this.showNotification('Order updated successfully', 'info');
        }
    }
    
    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this pizza order? This action cannot be undone.')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasks();
            this.loadTasks();
            this.updateOrderSummary();
            this.showNotification('Order deleted', 'warning');
        }
    }
    
    markAsCompleted(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task && task.status !== 'completed') {
            task.status = 'completed';
            task.completedAt = new Date().toISOString();
            this.saveTasks();
            this.loadTasks();
            this.updateOrderSummary();
            this.showNotification(`Order delivered: ${task.name}`, 'success');
        }
    }
    
    // ===== LOCAL STORAGE =====
    saveTasks() {
        try {
            localStorage.setItem('pizzaOrders', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
            this.showNotification('Error saving orders', 'danger');
        }
    }
    
    // ===== ORDER SUMMARY =====
    updateOrderSummary() {
        const total = this.tasks.length;
        const pending = this.tasks.filter(task => task.status === 'pending').length;
        const completed = this.tasks.filter(task => task.status === 'completed').length;
        
        // Update DOM elements
        document.getElementById('total-orders').textContent = total;
        document.getElementById('pending-orders').textContent = pending;
        document.getElementById('completed-orders').textContent = completed;
    }
    
    // ===== EVENT HANDLERS =====
    setupEventListeners() {
        this.setupFormHandler();
        this.setupFilterHandlers();
        this.setupSortHandlers();
        this.setupActionHandlers();
        this.setupClearAllHandler();
        this.setupKeyboardShortcuts();
    }
    
    setupFormHandler() {
        const orderForm = document.getElementById('task-form');
        if (!orderForm) return;
        
        // Set default due date to 30 minutes from now
        this.setDefaultDueDate();
        
        orderForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            if (!this.validateOrderForm(orderForm)) return;
            
            const formData = this.getFormData(orderForm);
            this.addTask(formData);
            orderForm.reset();
            this.setDefaultDueDate();
        });
        
        // Add real-time validation
        orderForm.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
        });
    }
    
    setDefaultDueDate() {
        const dueInput = document.getElementById('task-due');
        if (dueInput) {
            const defaultDue = new Date();
            defaultDue.setMinutes(defaultDue.getMinutes() + 30);
            dueInput.value = defaultDue.toISOString().slice(0, 16);
            dueInput.min = new Date().toISOString().slice(0, 16);
        }
    }
    
    validateOrderForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        field.classList.remove('is-invalid', 'is-valid');
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            field.classList.add('is-invalid');
            return false;
        }
        
        if (field.type === 'datetime-local') {
            const selectedDate = new Date(field.value);
            const now = new Date();
            
            if (selectedDate < now) {
                field.classList.add('is-invalid');
                field.nextElementSibling.textContent = 'Please select a future date and time';
                return false;
            }
        }
        
        if (field.value.trim()) {
            field.classList.add('is-valid');
        }
        
        return true;
    }
    
    getFormData(form) {
        return {
            name: document.getElementById('task-name').value,
            description: document.getElementById('task-description').value,
            due: document.getElementById('task-due').value,
            priority: document.getElementById('task-priority').value
        };
    }
    
    setupFilterHandlers() {
        document.querySelectorAll('input[name="status-filter"]').forEach(radio => {
            radio.addEventListener('change', (event) => {
                this.currentFilter = event.target.id.replace('filter-', '');
                this.loadTasks();
            });
        });
    }
    
    setupSortHandlers() {
        document.querySelectorAll('input[name="sort-by"]').forEach(radio => {
            radio.addEventListener('change', (event) => {
                this.currentSort = event.target.id.replace('sort-', '');
                this.loadTasks();
            });
        });
    }
    
    setupActionHandlers() {
        // Event delegation for action buttons
        document.getElementById('tasks-list')?.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            if (!row || !row.dataset.id) return;
            
            const taskId = parseInt(row.dataset.id);
            
            if (event.target.closest('.btn-edit')) {
                this.handleEdit(taskId);
            } else if (event.target.closest('.btn-complete')) {
                this.markAsCompleted(taskId);
            } else if (event.target.closest('.btn-delete')) {
                this.deleteTask(taskId);
            }
        });
    }
    
    setupClearAllHandler() {
        const clearButton = document.getElementById('clear-all');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                if (this.tasks.length === 0) {
                    this.showNotification('No orders to clear', 'info');
                    return;
                }
                
                if (confirm('Are you sure you want to delete ALL pizza orders? This action cannot be undone.')) {
                    this.tasks = [];
                    this.saveTasks();
                    this.loadTasks();
                    this.updateOrderSummary();
                    this.showNotification('All orders cleared', 'warning');
                }
            });
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl/Cmd + N: New order
            if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
                event.preventDefault();
                document.getElementById('task-name')?.focus();
            }
            
            // Escape: Close modals or clear focus
            if (event.key === 'Escape') {
                const activeElement = document.activeElement;
                if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                    activeElement.blur();
                }
            }
        });
    }
    
    // ===== EDIT HANDLING =====
    handleEdit(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        // Simple inline edit for demo purposes
        // In a real app, you would use a modal
        const newName = prompt('Edit pizza type:', task.name);
        if (newName && newName.trim() && newName !== task.name) {
            this.editTask(taskId, { name: newName.trim() });
        }
    }
    
    // ===== TIMER SYSTEM =====
    startTimers() {
        // Update timers every minute
        setInterval(() => {
            this.updateTimers();
        }, 60000);
    }
    
    updateTimers() {
        let needsRefresh = false;
        
        this.tasks.forEach(task => {
            if (task.status === 'pending') {
                const dueDate = new Date(task.due);
                const now = new Date();
                const timeDiff = dueDate - now;
                
                // Auto-mark as completed if overdue by more than 60 minutes
                if (timeDiff <= 0) {
                    const overdueTime = Math.abs(timeDiff) / (1000 * 60);
                    if (overdueTime > 60) {
                        this.markAsCompleted(task.id);
                        needsRefresh = true;
                    }
                }
            }
        });
        
        // Refresh display if any changes
        if (needsRefresh || this.tasks.some(t => t.status === 'pending')) {
            this.loadTasks();
        }
    }
    
    // ===== NOTIFICATION SYSTEM =====
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 1050;
            min-width: 300px;
            max-width: 500px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        const icons = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            danger: 'fa-times-circle',
            info: 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas ${icons[type] || 'fa-info-circle'} fa-2x me-3 text-${type}"></i>
                <div class="flex-grow-1">
                    <h6 class="mb-1">${type.charAt(0).toUpperCase() + type.slice(1)}</h6>
                    <p class="mb-0">${message}</p>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" 
                        aria-label="Close"></button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        // Add click to dismiss
        notification.querySelector('.btn-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }
    
    showWelcomeNotification() {
        setTimeout(() => {
            if (this.tasks.length > 0) {
                this.showNotification(
                    `Welcome! ${this.tasks.length} demo orders loaded. Try adding, editing, or completing orders.`,
                    'info'
                );
            }
        }, 1000);
    }
    
    // ===== HELPER FUNCTIONS =====
    getRandomAthensLocation() {
        const locations = [
            'Aghia Paraskevi',
            'Chalandri',
            'Marousi',
            'Kifisia',
            'Nea Smyrni',
            'Glyfada',
            'Piraeus',
            'Athens Center'
        ];
        return locations[Math.floor(Math.random() * locations.length)];
    }
    
    prefillFirstOrder() {
        document.getElementById('task-name').value = 'Large Pepperoni Pizza';
        document.getElementById('task-description').value = 'Extra cheese, well done';
        document.getElementById('task-priority').value = 'medium';
        this.setDefaultDueDate();
        
        // Scroll to form
        document.getElementById('task-form').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('task-name').focus();
        
        this.showNotification('Form prefilled! Click "Place Order Now" to add your first order.', 'info');
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tasks-list')) {
        window.taskManager = new TaskManager();
    }
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskManager;
}