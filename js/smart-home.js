// js/smart-home.js
class SmartHomeManager {
    constructor() {
        this.devices = [];
        this.currentRoom = 'living-room';
        this.energyUsage = 45.2;
        
        this.init();
    }

    init() {
        this.loadDevices();
        this.setupEventListeners();
        this.renderDevices();
        this.setupAutomations();
    }

    loadDevices() {
        this.devices = [
            {
                id: 1,
                name: "Living Room Lights",
                type: "light",
                room: "living-room",
                status: "on",
                value: "75%",
                icon: "fas fa-lightbulb",
                controls: ["on", "off", "dim"]
            },
            {
                id: 2,
                name: "Main AC",
                type: "climate",
                room: "living-room",
                status: "on",
                value: "22°C",
                icon: "fas fa-thermometer-half",
                controls: ["on", "off", "cool", "heat"]
            },
            {
                id: 3,
                name: "Smart TV",
                type: "entertainment",
                room: "living-room",
                status: "off",
                value: "Netflix",
                icon: "fas fa-tv",
                controls: ["on", "off", "input"]
            },
            {
                id: 4,
                name: "Sound System",
                type: "audio",
                room: "living-room",
                status: "on",
                value: "Spotify",
                icon: "fas fa-speaker",
                controls: ["on", "off", "volume"]
            },
            {
                id: 5,
                name: "Bedroom Lights",
                type: "light",
                room: "bedroom",
                status: "off",
                value: "0%",
                icon: "fas fa-lightbulb",
                controls: ["on", "off", "dim"]
            },
            {
                id: 6,
                name: "Bed Heater",
                type: "climate",
                room: "bedroom",
                status: "on",
                value: "20°C",
                icon: "fas fa-bed",
                controls: ["on", "off", "temp"]
            },
            {
                id: 7,
                name: "Smart Alarm",
                type: "security",
                room: "bedroom",
                status: "on",
                value: "7:00 AM",
                icon: "fas fa-clock",
                controls: ["on", "off", "time"]
            },
            {
                id: 8,
                name: "Kitchen Lights",
                type: "light",
                room: "kitchen",
                status: "on",
                value: "100%",
                icon: "fas fa-lightbulb",
                controls: ["on", "off", "dim"]
            },
            {
                id: 9,
                name: "Smart Fridge",
                type: "appliance",
                room: "kitchen",
                status: "on",
                value: "4°C",
                icon: "fas fa-refrigerator",
                controls: ["on", "off", "temp"]
            },
            {
                id: 10,
                name: "Security Camera",
                type: "security",
                room: "living-room",
                status: "on",
                value: "Recording",
                icon: "fas fa-camera",
                controls: ["on", "off", "record"]
            }
        ];
    }

    setupEventListeners() {
        // Room selection
        document.querySelectorAll('.room-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.room-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.currentRoom = card.dataset.room;
                this.renderDevices();
            });
        });

        // Device controls
        document.addEventListener('click', (e) => {
            if (e.target.closest('.control-btn')) {
                const btn = e.target.closest('.control-btn');
                const deviceId = parseInt(btn.dataset.deviceId);
                const action = btn.dataset.action;
                
                this.controlDevice(deviceId, action);
            }
            
            if (e.target.closest('.device-card')) {
                const card = e.target.closest('.device-card');
                const deviceId = parseInt(card.dataset.deviceId);
                this.showDeviceDetails(deviceId);
            }
        });

        // Automation switches
        document.querySelectorAll('.automation-switch input').forEach(switchEl => {
            switchEl.addEventListener('change', (e) => {
                const automation = e.target.closest('.automation-card').querySelector('h3').textContent;
                const enabled = e.target.checked;
                
                this.toggleAutomation(automation, enabled);
            });
        });

        // Add device button
        const addDeviceBtn = document.querySelector('.btn-secondary');
        if (addDeviceBtn && addDeviceBtn.innerHTML.includes('Add Device')) {
            addDeviceBtn.addEventListener('click', () => this.showAddDeviceModal());
        }
    }

    renderDevices() {
        const devicesGrid = document.getElementById('devicesGrid');
        if (!devicesGrid) return;

        // Filter devices by current room
        const roomDevices = this.devices.filter(device => device.room === this.currentRoom);

        // Clear grid
        devicesGrid.innerHTML = '';

        // Render devices
        roomDevices.forEach(device => {
            const deviceElement = this.createDeviceElement(device);
            devicesGrid.appendChild(deviceElement);
        });

        // Update device count
        this.updateDeviceCount();
    }

    createDeviceElement(device) {
        const div = document.createElement('div');
        div.className = 'device-card fade-in';
        div.dataset.deviceId = device.id;
        div.innerHTML = `
            <div class="device-header">
                <div class="device-name">
                    <i class="${device.icon} device-icon"></i>
                    <h4>${device.name}</h4>
                </div>
                <span class="device-status ${device.status}"></span>
            </div>
            
            <div style="margin: 1rem 0;">
                <div style="font-size: 2rem; font-weight: 700; color: ${device.status === 'on' ? 'var(--primary)' : 'var(--gray-500)'};">
                    ${device.value}
                </div>
                <div style="color: var(--gray-400); font-size: 0.9rem; margin-top: 0.25rem;">
                    ${this.getDeviceTypeLabel(device.type)}
                </div>
            </div>
            
            <div class="device-controls">
                ${device.controls.map((control, index) => `
                    <button class="control-btn ${index === 0 ? 'active' : ''}" 
                            data-device-id="${device.id}" 
                            data-action="${control}">
                        ${this.getControlLabel(control)}
                    </button>
                `).join('')}
            </div>
        `;

        return div;
    }

    getDeviceTypeLabel(type) {
        const labels = {
            light: "Lighting",
            climate: "Climate Control",
            entertainment: "Entertainment",
            audio: "Audio System",
            security: "Security",
            appliance: "Appliance"
        };
        return labels[type] || type;
    }

    getControlLabel(control) {
        const labels = {
            on: "On",
            off: "Off",
            dim: "Dim",
            cool: "Cool",
            heat: "Heat",
            temp: "Temp",
            input: "Input",
            volume: "Vol",
            time: "Time",
            record: "Record"
        };
        return labels[control] || control;
    }

    controlDevice(deviceId, action) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        // Update device status
        if (action === 'on') {
            device.status = 'on';
            if (device.type === 'light') device.value = '75%';
            if (device.type === 'climate') device.value = '22°C';
        } else if (action === 'off') {
            device.status = 'off';
            if (device.type === 'light') device.value = '0%';
        } else if (action === 'dim' && device.type === 'light') {
            device.value = device.value === '100%' ? '75%' : device.value === '75%' ? '50%' : '100%';
        } else if (action === 'cool' && device.type === 'climate') {
            const temp = parseInt(device.value);
            device.value = `${temp - 1}°C`;
        } else if (action === 'heat' && device.type === 'climate') {
            const temp = parseInt(device.value);
            device.value = `${temp + 1}°C`;
        }

        // Update UI
        this.renderDevices();
        
        // Show notification
        window.TechVision.showNotification(`${device.name} ${action}`, 'success');
        
        // Update energy usage
        this.updateEnergyUsage(device, action);
    }

    updateEnergyUsage(device, action) {
        if (action === 'on') {
            this.energyUsage += 0.5;
        } else if (action === 'off') {
            this.energyUsage -= 0.5;
        }
        
        // Update energy display
        const energyValue = document.querySelector('.energy-value');
        if (energyValue) {
            energyValue.textContent = `${this.energyUsage.toFixed(1)} kWh`;
        }
    }

    toggleAutomation(automation, enabled) {
        const message = enabled 
            ? `${automation} automation enabled` 
            : `${automation} automation disabled`;
        
        window.TechVision.showNotification(message, enabled ? 'success' : 'info');
        
        // If enabling "Energy Saver", turn off some devices
        if (automation === 'Energy Saver' && enabled) {
            this.enableEnergySaver();
        }
    }

    enableEnergySaver() {
        // Turn off non-essential devices
        const nonEssential = ['Smart TV', 'Sound System', 'Kitchen Lights'];
        this.devices.forEach(device => {
            if (nonEssential.includes(device.name) && device.status === 'on') {
                device.status = 'off';
                if (device.type === 'light') device.value = '0%';
            }
        });
        
        this.renderDevices();
        window.TechVision.showNotification('Energy saver mode activated', 'success');
    }

    showDeviceDetails(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'tool-modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${device.name}</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="card-body">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                        <div style="width: 80px; height: 80px; background: var(--gradient-primary); border-radius: var(--radius-md); 
                             display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                            <i class="${device.icon}"></i>
                        </div>
                        <div>
                            <h3>${device.name}</h3>
                            <div style="color: var(--gray-400);">${this.getDeviceTypeLabel(device.type)} • ${device.room}</div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <h4 style="margin-bottom: 1rem;">Current Status</h4>
                        <div style="display: flex; align-items: center; gap: 2rem;">
                            <div>
                                <div style="font-size: 3rem; font-weight: 700; color: ${device.status === 'on' ? 'var(--primary)' : 'var(--danger)'};">${device.value}</div>
                                <div style="color: var(--gray-400);">Current Value</div>
                            </div>
                            <div>
                                <div style="font-size: 2rem; font-weight: 700; color: ${device.status === 'on' ? 'var(--success)' : 'var(--danger)'};">
                                    ${device.status.toUpperCase()}
                                </div>
                                <div style="color: var(--gray-400);">Status</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <h4 style="margin-bottom: 1rem;">Controls</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${device.controls.map(control => `
                                <button class="control-btn" style="padding: 0.75rem 1.5rem;" 
                                        onclick="window.smartHomeManager.controlDevice(${device.id}, '${control}')">
                                    ${this.getControlLabel(control)}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h4 style="margin-bottom: 1rem;">Schedule</h4>
                        <div style="background: rgba(255, 255, 255, 0.03); padding: 1rem; border-radius: var(--radius-md);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <span>Turn on at 7:00 AM</span>
                                <span class="badge badge-success">Active</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span>Turn off at 11:00 PM</span>
                                <span class="badge badge-success">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add close functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    showAddDeviceModal() {
        const modal = document.createElement('div');
        modal.className = 'tool-modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add New Device</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="card-body">
                    <form id="addDeviceForm">
                        <div class="form-group">
                            <label class="form-label">Device Name</label>
                            <input type="text" class="form-control" placeholder="e.g., Bedroom Lamp" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Device Type</label>
                            <select class="form-control" required>
                                <option value="">Select type</option>
                                <option value="light">Light</option>
                                <option value="climate">Climate Control</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="security">Security</option>
                                <option value="appliance">Appliance</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Room</label>
                            <select class="form-control" required>
                                <option value="living-room">Living Room</option>
                                <option value="bedroom">Bedroom</option>
                                <option value="kitchen">Kitchen</option>
                                <option value="bathroom">Bathroom</option>
                                <option value="office">Office</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Connection Type</label>
                            <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                                <label style="display: flex; align-items: center; gap: 0.5rem;">
                                    <input type="radio" name="connection" value="wifi" checked>
                                    <span>Wi-Fi</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 0.5rem;">
                                    <input type="radio" name="connection" value="bluetooth">
                                    <span>Bluetooth</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 0.5rem;">
                                    <input type="radio" name="connection" value="zigbee">
                                    <span>Zigbee</span>
                                </label>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                            <button type="submit" class="btn btn-primary" style="flex: 1;">
                                <i class="fas fa-plus"></i> Add Device
                            </button>
                            <button type="button" class="btn btn-secondary" id="cancelAdd">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Form submission
        const form = modal.querySelector('#addDeviceForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            window.TechVision.showNotification('Device added successfully!', 'success');
            modal.remove();
        });
        
        // Close buttons
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('#cancelAdd');
        
        closeBtn.addEventListener('click', () => modal.remove());
        cancelBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    updateDeviceCount() {
        const roomDevices = this.devices.filter(device => device.room === this.currentRoom);
        const onlineDevices = roomDevices.filter(device => device.status === 'on').length;
        
        // Update room card device count
        const roomCard = document.querySelector(`.room-card[data-room="${this.currentRoom}"]`);
        if (roomCard) {
            const deviceCount = roomCard.querySelector('p');
            if (deviceCount) {
                deviceCount.textContent = `${roomDevices.length} devices • ${onlineDevices} online`;
            }
        }
    }

    setupAutomations() {
        // Simulate automatic actions
        setInterval(() => {
            this.simulateAutomations();
        }, 30000); // Every 30 seconds
    }

    simulateAutomations() {
        const now = new Date();
        const hour = now.getHours();
        
        // Good Morning automation (7 AM)
        if (hour === 7) {
            const morningAutomation = document.querySelector('.automation-card:nth-child(1) input[type="checkbox"]');
            if (morningAutomation && morningAutomation.checked) {
                this.executeMorningAutomation();
            }
        }
        
        // Energy monitoring
        this.monitorEnergy();
    }

    executeMorningAutomation() {
        // Turn on bedroom lights and adjust temperature
        this.devices.forEach(device => {
            if (device.room === 'bedroom' && device.type === 'light') {
                device.status = 'on';
                device.value = '50%';
            }
            if (device.name === 'Smart Alarm') {
                device.value = 'Alarm triggered';
            }
        });
        
        this.renderDevices();
    }

    monitorEnergy() {
        // Simulate energy usage changes
        const change = (Math.random() - 0.5) * 0.2; // Random change between -0.1 and +0.1
        this.energyUsage = Math.max(0, this.energyUsage + change);
        
        // Update display
        const energyValue = document.querySelector('.energy-value');
        if (energyValue) {
            energyValue.textContent = `${this.energyUsage.toFixed(1)} kWh`;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.smartHomeManager = new SmartHomeManager();
});