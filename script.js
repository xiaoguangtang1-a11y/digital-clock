// 时区数据库
const TIMEZONES = [
    // 亚洲
    { name: '北京 (中国)', timezone: 'Asia/Shanghai', region: '亚洲', offset: 'UTC+8' },
    { name: '东京 (日本)', timezone: 'Asia/Tokyo', region: '亚洲', offset: 'UTC+9' },
    { name: '首尔 (韩国)', timezone: 'Asia/Seoul', region: '亚洲', offset: 'UTC+9' },
    { name: '曼谷 (泰国)', timezone: 'Asia/Bangkok', region: '亚洲', offset: 'UTC+7' },
    { name: '新加坡', timezone: 'Asia/Singapore', region: '亚洲', offset: 'UTC+8' },
    { name: '孟买 (印度)', timezone: 'Asia/Kolkata', region: '亚洲', offset: 'UTC+5:30' },
    { name: '迪拜 (阿联酋)', timezone: 'Asia/Dubai', region: '亚洲', offset: 'UTC+4' },
    { name: '伊斯坦布尔 (土耳其)', timezone: 'Europe/Istanbul', region: '亚洲/欧洲', offset: 'UTC+3' },
    { name: '香港', timezone: 'Asia/Hong_Kong', region: '亚洲', offset: 'UTC+8' },
    { name: '台北 (台湾)', timezone: 'Asia/Taipei', region: '亚洲', offset: 'UTC+8' },
    { name: '马尼拉 (菲律宾)', timezone: 'Asia/Manila', region: '亚洲', offset: 'UTC+8' },
    
    // 欧洲
    { name: '伦敦 (英国)', timezone: 'Europe/London', region: '欧洲', offset: 'UTC±0' },
    { name: '巴黎 (法国)', timezone: 'Europe/Paris', region: '欧洲', offset: 'UTC+1' },
    { name: '柏林 (德国)', timezone: 'Europe/Berlin', region: '欧洲', offset: 'UTC+1' },
    { name: '莫斯科 (俄罗斯)', timezone: 'Europe/Moscow', region: '欧洲', offset: 'UTC+3' },
    { name: '阿姆斯特丹 (荷兰)', timezone: 'Europe/Amsterdam', region: '欧洲', offset: 'UTC+1' },
    { name: '罗马 (意大利)', timezone: 'Europe/Rome', region: '欧洲', offset: 'UTC+1' },
    { name: '马德里 (西班牙)', timezone: 'Europe/Madrid', region: '欧洲', offset: 'UTC+1' },
    
    // 北美洲
    { name: '纽约 (美国)', timezone: 'America/New_York', region: '北美', offset: 'UTC-5' },
    { name: '洛杉矶 (美国)', timezone: 'America/Los_Angeles', region: '北美', offset: 'UTC-8' },
    { name: '芝加哥 (美国)', timezone: 'America/Chicago', region: '北美', offset: 'UTC-6' },
    { name: '丹佛 (美国)', timezone: 'America/Denver', region: '北美', offset: 'UTC-7' },
    { name: '多伦多 (加拿大)', timezone: 'America/Toronto', region: '北美', offset: 'UTC-5' },
    { name: '温哥华 (加拿大)', timezone: 'America/Vancouver', region: '北美', offset: 'UTC-8' },
    { name: '墨西哥城 (墨西哥)', timezone: 'America/Mexico_City', region: '北美', offset: 'UTC-6' },
    
    // 南美洲
    { name: '圣保罗 (巴西)', timezone: 'America/Sao_Paulo', region: '南美', offset: 'UTC-3' },
    { name: '布宜诺斯艾利斯 (阿根廷)', timezone: 'America/Argentina/Buenos_Aires', region: '南美', offset: 'UTC-3' },
    { name: '利马 (秘鲁)', timezone: 'America/Lima', region: '南美', offset: 'UTC-5' },
    
    // 非洲
    { name: '开罗 (埃及)', timezone: 'Africa/Cairo', region: '非洲', offset: 'UTC+2' },
    { name: '约翰内斯堡 (南非)', timezone: 'Africa/Johannesburg', region: '非洲', offset: 'UTC+2' },
    { name: '拉各斯 (尼日利亚)', timezone: 'Africa/Lagos', region: '非洲', offset: 'UTC+1' },
    
    // 大洋洲
    { name: '悉尼 (澳大利亚)', timezone: 'Australia/Sydney', region: '大洋洲', offset: 'UTC+10' },
    { name: '墨尔本 (澳大利亚)', timezone: 'Australia/Melbourne', region: '大洋洲', offset: 'UTC+10' },
    { name: '珀斯 (澳大利亚)', timezone: 'Australia/Perth', region: '大洋洲', offset: 'UTC+8' },
    { name: '奥克兰 (新西兰)', timezone: 'Pacific/Auckland', region: '大洋洲', offset: 'UTC+12' },
    { name: '斐济', timezone: 'Pacific/Fiji', region: '大洋洲', offset: 'UTC+12' },
];

// 默认时区（首次加载）
const DEFAULT_TIMEZONES = ['Asia/Shanghai', 'Europe/London', 'America/New_York'];

class WorldClock {
    constructor() {
        this.selectedTimezones = [];
        this.modal = document.getElementById('modal');
        this.clocksContainer = document.getElementById('clocksContainer');
        this.emptyState = document.getElementById('emptyState');
        this.addClockBtn = document.getElementById('addClockBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.closeBtn = document.querySelector('.close');
        this.timezoneSearch = document.getElementById('timezoneSearch');
        this.timezoneList = document.getElementById('timezoneList');

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromLocalStorage();
        if (this.selectedTimezones.length === 0) {
            this.selectedTimezones = DEFAULT_TIMEZONES;
        }
        this.render();
        this.updateClocks();
        setInterval(() => this.updateClocks(), 1000);
    }

    setupEventListeners() {
        this.addClockBtn.addEventListener('click', () => this.showModal());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.closeBtn.addEventListener('click', () => this.hideModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hideModal();
        });
        this.timezoneSearch.addEventListener('input', () => this.filterTimezones());
    }

    showModal() {
        this.modal.classList.add('show');
        this.populateTimezoneList();
        this.timezoneSearch.focus();
    }

    hideModal() {
        this.modal.classList.remove('show');
        this.timezoneSearch.value = '';
    }

    populateTimezoneList() {
        this.timezoneList.innerHTML = '';
        const searchTerm = this.timezoneSearch.value.toLowerCase();

        let filtered = TIMEZONES;
        if (searchTerm) {
            filtered = TIMEZONES.filter(tz =>
                tz.name.toLowerCase().includes(searchTerm) ||
                tz.timezone.toLowerCase().includes(searchTerm) ||
                tz.region.toLowerCase().includes(searchTerm)
            );
        }

        if (filtered.length === 0) {
            this.timezoneList.innerHTML = '<div class="no-results">未找到匹配的时区</div>';
            return;
        }

        filtered.forEach(tz => {
            const item = document.createElement('div');
            item.className = 'timezone-item';
            if (this.selectedTimezones.includes(tz.timezone)) {
                item.classList.add('selected');
            }

            const time = this.getTimeInTimezone(tz.timezone);
            item.innerHTML = `
                <div class="timezone-item-name">
                    <div class="timezone-item-main">${tz.name}</div>
                    <div class="timezone-item-info">${tz.timezone}</div>
                </div>
                <div class="timezone-item-time">${time}</div>
                <div class="timezone-item-check">✓</div>
            `;

            item.addEventListener('click', () => this.toggleTimezone(tz.timezone));
            this.timezoneList.appendChild(item);
        });
    }

    filterTimezones() {
        this.populateTimezoneList();
    }

    toggleTimezone(timezone) {
        const index = this.selectedTimezones.indexOf(timezone);
        if (index > -1) {
            this.selectedTimezones.splice(index, 1);
        } else {
            this.selectedTimezones.push(timezone);
        }
        this.populateTimezoneList();
        this.render();
        this.saveToLocalStorage();
    }

    render() {
        if (this.selectedTimezones.length === 0) {
            this.clocksContainer.innerHTML = '';
            this.emptyState.style.display = 'block';
            return;
        }

        this.emptyState.style.display = 'none';
        this.clocksContainer.innerHTML = '';

        this.selectedTimezones.forEach(timezone => {
            const tzData = TIMEZONES.find(tz => tz.timezone === timezone);
            if (!tzData) return;

            const card = document.createElement('div');
            card.className = 'clock-card';
            card.innerHTML = `
                <button class="remove-btn" data-timezone="${timezone}">×</button>
                <div class="timezone-label">
                    <div class="timezone-name">${tzData.name.split(' ')[0]}</div>
                    <div class="timezone-offset">${tzData.offset}</div>
                </div>
                <div class="time-display" data-timezone="${timezone}">--:--:--</div>
                <div class="date-display" data-timezone="${timezone}">加载中...</div>
                <div class="time-details">
                    <div class="detail-item">
                        <span class="detail-label">时区</span>
                        <div class="detail-value">${timezone}</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">地区</span>
                        <div class="detail-value">${tzData.region}</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">12小时制</span>
                        <div class="detail-value" data-12hour="${timezone}">-</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">周几</span>
                        <div class="detail-value" data-dayname="${timezone}">-</div>
                    </div>
                </div>
            `;

            card.querySelector('.remove-btn').addEventListener('click', () => {
                const index = this.selectedTimezones.indexOf(timezone);
                if (index > -1) {
                    this.selectedTimezones.splice(index, 1);
                }
                this.render();
                this.saveToLocalStorage();
            });

            this.clocksContainer.appendChild(card);
        });
    }

    updateClocks() {
        this.selectedTimezones.forEach(timezone => {
            const time = this.getTimeInTimezone(timezone);
            const timeDisplay = document.querySelector(`[data-timezone="${timezone}"][data-timezone]`);
            
            if (timeDisplay) {
                const elements = document.querySelectorAll(`[data-timezone="${timezone}"]`);
                elements.forEach(el => {
                    if (el.classList.contains('time-display')) {
                        el.textContent = time;
                    }
                });
            }

            // 更新日期
            const dateDisplay = document.querySelector(`[data-timezone="${timezone}"][data-timezone]`);
            const date = this.getDateInTimezone(timezone);
            const dateElements = document.querySelectorAll(`[data-timezone="${timezone}"]`);
            dateElements.forEach(el => {
                if (el.classList.contains('date-display')) {
                    el.textContent = `📅 ${date}`;
                }
            });

            // 更新12小时制时间
            const time12h = this.getTimeInTimezone12h(timezone);
            const elem12h = document.querySelector(`[data-12hour="${timezone}"]`);
            if (elem12h) {
                elem12h.textContent = time12h;
            }

            // 更新星期几
            const dayName = this.getDayNameInTimezone(timezone);
            const elemDay = document.querySelector(`[data-dayname="${timezone}"]`);
            if (elemDay) {
                elemDay.textContent = dayName;
            }
        });
    }

    getTimeInTimezone(timezone) {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        return formatter.format(new Date());
    }

    getTimeInTimezone12h(timezone) {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return formatter.format(new Date());
    }

    getDateInTimezone(timezone) {
        const formatter = new Intl.DateTimeFormat('zh-CN', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        return formatter.format(new Date());
    }

    getDayNameInTimezone(timezone) {
        const formatter = new Intl.DateTimeFormat('zh-CN', {
            timeZone: timezone,
            weekday: 'long'
        });
        return formatter.format(new Date());
    }

    reset() {
        if (confirm('确定要重置为默认时区吗？')) {
            this.selectedTimezones = DEFAULT_TIMEZONES.slice();
            this.render();
            this.saveToLocalStorage();
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('selectedTimezones', JSON.stringify(this.selectedTimezones));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('selectedTimezones');
        if (saved) {
            try {
                this.selectedTimezones = JSON.parse(saved);
            } catch (e) {
                this.selectedTimezones = [];
            }
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new WorldClock();
});