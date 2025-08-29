// Notification system
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    const icon = notification.querySelector('i');
    
    notificationText.textContent = message;
    
    // Remove all previous classes
    notification.className = 'notification';
    
    if (type === 'success') {
        notification.classList.add('show');
        icon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        notification.classList.add('show', 'error');
        icon.className = 'fas fa-exclamation-circle';
    } else if (type === 'warning') {
        notification.classList.add('show', 'warning');
        icon.className = 'fas fa-exclamation-triangle';
    }
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Get IP information from multiple sources
async function getIPInfo() {
    try {
        // Try first API
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        document.getElementById('ipAddress').textContent = data.ip;
        document.getElementById('country').textContent = data.country_name;
        document.getElementById('region').textContent = data.region;
        document.getElementById('city').textContent = data.city;
        document.getElementById('postal').textContent = data.postal;
        document.getElementById('location').textContent = `${data.latitude}, ${data.longitude}`;
        document.getElementById('org').textContent = data.org;
        document.getElementById('timezone').textContent = data.timezone;
        
        showNotification('Informasi IP berhasil diperbarui!');
    } catch (error) {
        console.error('Error fetching IP data:', error);
        
        // Fallback to second API if first fails
        try {
            const response = await fetch('https://ipwhois.app/json/');
            const data = await response.json();
            
            document.getElementById('ipAddress').textContent = data.ip;
            document.getElementById('country').textContent = data.country;
            document.getElementById('region').textContent = data.region;
            document.getElementById('city').textContent = data.city;
            document.getElementById('postal').textContent = data.postal || 'Tidak tersedia';
            document.getElementById('location').textContent = `${data.latitude}, ${data.longitude}`;
            document.getElementById('org').textContent = data.isp;
            document.getElementById('timezone').textContent = data.timezone;
            
            showNotification('Informasi IP berhasil diperbarui (sumber alternatif)!');
        } catch (secondError) {
            console.error('Error fetching from second API:', secondError);
            
            // Use simulated data as last resort
            document.getElementById('ipAddress').textContent = '192.168.1.1';
            document.getElementById('country').textContent = 'Indonesia';
            document.getElementById('region').textContent = 'DKI Jakarta';
            document.getElementById('city').textContent = 'Jakarta Selatan';
            document.getElementById('postal').textContent = '12345';
            document.getElementById('location').textContent = '-6.2088, 106.8456';
            document.getElementById('org').textContent = 'PT. Contoh Internet';
            document.getElementById('timezone').textContent = 'Asia/Jakarta';
            
            showNotification('Gagal mengambil data IP. Menggunakan data simulasi.', 'warning');
        }
    }
}

// Send NGL spam using API
async function sendNGLSpam(target, message, count, delay) {
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('sendProgress');
    const progressText = document.getElementById('progressText');
    
    progressContainer.style.display = 'block';
    
    let successCount = 0;
    let failedCount = 0;
    
    for (let i = 0; i < count; i++) {
        // Update progress
        const progress = ((i + 1) / count) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Mengirim pesan ${i + 1}/${count}`;
        
        try {
            // Send request to our API endpoint
            const response = await fetch('api/ngl-spam.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: target,
                    message: message
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                successCount++;
                console.log(`Pesan ${i + 1} berhasil dikirim ke ${target}`);
            } else {
                failedCount++;
                console.error(`Gagal mengirim pesan ${i + 1}:`, result.error);
                showNotification(`Gagal mengirim pesan ${i + 1}: ${result.error}`, 'error');
            }
        } catch (error) {
            failedCount++;
            console.error(`Gagal mengirim pesan ${i + 1}:`, error);
            showNotification(`Gagal mengirim pesan ${i + 1}: Koneksi error`, 'error');
        }
        
        // Wait for the specified delay before sending the next message
        if (i < count - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    // Show final result
    if (failedCount === 0) {
        showNotification(`Berhasil mengirim ${successCount} pesan ke ${target}!`);
    } else {
        showNotification(`Berhasil mengirim ${successCount} pesan, gagal ${failedCount} pesan ke ${target}`, 
                         failedCount === count ? 'error' : 'warning');
    }
    
    // Reset progress
    progressBar.style.width = '0%';
    progressContainer.style.display = 'none';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get IP info on page load
    getIPInfo();
    
    // Refresh IP info button
    document.getElementById('refreshIp').addEventListener('click', getIPInfo);
    
    // NGL Form submission
    document.getElementById('nglForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const target = document.getElementById('targetUsername').value;
        const message = document.getElementById('message').value;
        const count = parseInt(document.getElementById('messageCount').value);
        const delay = parseInt(document.getElementById('delay').value);
        
        if (!target || !message) {
            showNotification('Harap isi semua field yang diperlukan!', 'error');
            return;
        }
        
        if (count > 100) {
            showNotification('Maksimal pengiriman adalah 100 pesan!', 'error');
            return;
        }
        
        if (count < 1) {
            showNotification('Jumlah pesan minimal 1!', 'error');
            return;
        }
        
        showNotification(`Memulai pengiriman ${count} pesan ke ${target}...`);
        
        // Start sending messages
        sendNGLSpam(target, message, count, delay);
    });
});
