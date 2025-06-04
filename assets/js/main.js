
// Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade In Animation - Fixed to prevent disappearing text
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
        // Don't remove visible class when out of view to prevent disappearing
    });
}, observerOptions);

// Auto-add fade-in class only to specific elements, not hero content
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.tool-card, .about-content .about-text, .about-content .stats-card');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Make hero content immediately visible
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(22, 33, 62, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(22, 33, 62, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Tool Functions
class ToolManager {
    constructor() {
        this.apiEndpoints = {
            ipLookup: 'http://ip-api.com/json/',
            whois: 'https://api.whoisjson.com/v1/',
            dns: 'https://dns.google/resolve'
        };
    }

    async lookupIP(ip) {
        try {
            const response = await fetch(`${this.apiEndpoints.ipLookup}${ip}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                return {
                    success: true,
                    data: {
                        ip: data.query,
                        country: data.country,
                        region: data.regionName,
                        city: data.city,
                        isp: data.isp,
                        org: data.org,
                        timezone: data.timezone,
                        lat: data.lat,
                        lon: data.lon,
                        zip: data.zip
                    }
                };
            } else {
                return { success: false, error: 'Invalid IP address' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    async lookupDomain(domain) {
        try {
            // Simulate domain lookup (replace with actual API)
            const mockData = {
                domain: domain,
                registrar: 'Example Registrar',
                creation_date: '2020-01-01',
                expiration_date: '2025-01-01',
                name_servers: ['ns1.example.com', 'ns2.example.com'],
                status: 'active'
            };
            
            return {
                success: true,
                data: mockData
            };
        } catch (error) {
            return { success: false, error: 'Domain lookup failed' };
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        
        return {
            success: true,
            data: {
                email: email,
                valid: isValid,
                domain: email.split('@')[1],
                format: isValid ? 'Valid format' : 'Invalid format'
            }
        };
    }

    validatePhone(phone) {
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        const isValid = phoneRegex.test(phone);
        
        return {
            success: true,
            data: {
                phone: phone,
                valid: isValid,
                formatted: phone.replace(/\D/g, ''),
                type: 'Unknown',
                carrier: 'Unknown'
            }
        };
    }

    async portScan(host, ports) {
        // Simulate port scanning (client-side limitation)
        const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995];
        const openPorts = [];
        
        for (let port of ports) {
            if (commonPorts.includes(parseInt(port))) {
                openPorts.push({
                    port: port,
                    status: 'open',
                    service: this.getServiceName(port)
                });
            }
        }
        
        return {
            success: true,
            data: {
                host: host,
                ports: openPorts
            }
        };
    }

    getServiceName(port) {
        const services = {
            21: 'FTP',
            22: 'SSH',
            23: 'Telnet',
            25: 'SMTP',
            53: 'DNS',
            80: 'HTTP',
            110: 'POP3',
            143: 'IMAP',
            443: 'HTTPS',
            993: 'IMAPS',
            995: 'POP3S'
        };
        return services[port] || 'Unknown';
    }

    displayResult(container, result) {
        if (!container) return;
        
        if (result.success) {
            let html = '';
            for (const [key, value] of Object.entries(result.data)) {
                const formattedKey = key.replace(/_/g, ' ').toUpperCase();
                if (Array.isArray(value)) {
                    html += `<div class="result-item">
                        <span class="result-label">${formattedKey}:</span>
                        <span class="result-value">${value.join(', ')}</span>
                    </div>`;
                } else if (typeof value === 'object') {
                    html += `<div class="result-item">
                        <span class="result-label">${formattedKey}:</span>
                        <span class="result-value">${JSON.stringify(value, null, 2)}</span>
                    </div>`;
                } else {
                    html += `<div class="result-item">
                        <span class="result-label">${formattedKey}:</span>
                        <span class="result-value">${value || 'N/A'}</span>
                    </div>`;
                }
            }
            container.innerHTML = html;
        } else {
            container.innerHTML = `<div class="result-item" style="border-left-color: #ff6b6b;">
                <span class="result-label" style="color: #ff6b6b;">ERROR:</span>
                <span class="result-value" style="color: #ff6b6b;">${result.error}</span>
            </div>`;
        }
        container.style.display = 'block';
    }

    showLoading(button) {
        const originalText = button.textContent;
        button.innerHTML = '<span class="loading"></span> Processing...';
        button.disabled = true;
        
        return () => {
            button.textContent = originalText;
            button.disabled = false;
        };
    }
}

// Initialize Tool Manager
const toolManager = new ToolManager();

// Export for use in other pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ToolManager, toolManager };
}

// Console welcome message
console.log('%cOSINT Hub', 'color: #8b5fbf; font-size: 24px; font-weight: bold;');
console.log('%cProfessional OSINT Tools for Security Research', 'color: #b794c6; font-size: 14px;');
console.log('%cFor educational and authorized security research only.', 'color: #6a4c93; font-size: 12px;');
