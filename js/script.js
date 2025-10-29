// URL Web App Google Apps Script (Ganti dengan URL Web App Anda)
const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbyAWSqtsuL1U50vULFKkG8UxXAXA3zbECW1PNMEpuwMRZTr4LLFf6JiXtF-dOrstUBviQ/exec';

// Global variables
let allData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 4; // 4 rows × 4 columns = 16 items per page (desktop)

// Parse tanggal dari format Indonesia ke Date object
function parseIndonesianDate(dateStr) {
    if (!dateStr) return null;
    
    const monthMap = {
        'januari': 0, 'februari': 1, 'maret': 2, 'april': 3,
        'mei': 4, 'juni': 5, 'juli': 6, 'agustus': 7,
        'september': 8, 'oktober': 9, 'november': 10, 'desember': 11
    };
    
    // Format: "15 Desember 2024" atau "15 Des 2024"
    const parts = dateStr.toLowerCase().trim().split(' ');
    if (parts.length >= 3) {
        const day = parseInt(parts[0]);
        const monthStr = parts[1];
        const year = parseInt(parts[2]);
        
        // Cari bulan yang cocok
        for (let key in monthMap) {
            if (key.startsWith(monthStr.substring(0, 3))) {
                return new Date(year, monthMap[key], day);
            }
        }
    }
    return null;
}

// Hitung hari tersisa hingga akad nikah
function getDaysUntilWedding(tanggalNikah) {
    const weddingDate = parseIndonesianDate(tanggalNikah);
    if (!weddingDate) return null;
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    weddingDate.setHours(0, 0, 0, 0);
    
    const diffTime = weddingDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

// Format countdown badge
function getCountdownBadge(tanggalNikah) {
    const days = getDaysUntilWedding(tanggalNikah);
    
    if (days === null) return '';
    if (days < 0) return '<div class="countdown-badge" style="background: linear-gradient(135deg, #9e9e9e 0%, #757575 100%);">Sudah Dilaksanakan</div>';
    if (days === 0) return '<div class="countdown-badge" style="background: linear-gradient(135deg, #e53935 0%, #d32f2f 100%);">🔔 HARI INI</div>';
    if (days === 1) return '<div class="countdown-badge" style="background: linear-gradient(135deg, #ff7043 0%, #ff5722 100%);">⏰ Besok</div>';
    if (days <= 7) return `<div class="countdown-badge" style="background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);">⏱️ ${days} Hari Lagi</div>`;
    if (days <= 30) return `<div class="countdown-badge" style="background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);">📅 ${days} Hari Lagi</div>`;
    return `<div class="countdown-badge" style="background: linear-gradient(135deg, #42a5f5 0%, #2196f3 100%);">📆 ${days} Hari Lagi</div>`;
}

// Load dan sort data berdasarkan tanggal terdekat
async function loadAnnouncements() {
    try {
        const response = await fetch(WEBAPP_URL);
        const data = await response.json();
        
        // Simpan data asli
        allData = data;
        
        // Sort berdasarkan tanggal akad terdekat (ascending)
        allData.sort((a, b) => {
            const dateA = parseIndonesianDate(a.tanggalNikah);
            const dateB = parseIndonesianDate(b.tanggalNikah);
            
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;
            
            return dateA - dateB;
        });
        
        // Set filtered data ke semua data
        filteredData = [...allData];
        
        // Update stats
        updateStats();
        
        // Render halaman pertama
        currentPage = 1;
        renderPage();
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('content').innerHTML = `
            <div class="no-data">
                <div class="no-data-icon">⚠️</div>
                <h3>Terjadi Kesalahan</h3>
                <p>Tidak dapat memuat data. Pastikan URL Web App sudah dikonfigurasi dengan benar.</p>
            </div>
        `;
    }
}

// Update statistik
function updateStats() {
    document.getElementById('totalData').textContent = allData.length;
    document.getElementById('displayedData').textContent = filteredData.length;
}

// Render halaman dengan pagination
function renderPage() {
    const contentDiv = document.getElementById('content');
    const paginationDiv = document.getElementById('pagination');
    
    if (filteredData.length === 0) {
        contentDiv.innerHTML = `
            <div class="no-data">
                <div class="no-data-icon">🔍</div>
                <h3>Tidak Ada Data Ditemukan</h3>
                <p>Tidak ada pengumuman yang sesuai dengan pencarian Anda.</p>
            </div>
        `;
        paginationDiv.style.display = 'none';
        return;
    }

    // Hitung jumlah halaman
    const itemsPerPageActual = window.innerWidth <= 768 ? 4 : 16; // 4 untuk mobile, 16 untuk desktop
    const totalPages = Math.ceil(filteredData.length / itemsPerPageActual);
    
    // Batasi halaman yang valid
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    
    // Ambil data untuk halaman saat ini
    const startIndex = (currentPage - 1) * itemsPerPageActual;
    const endIndex = startIndex + itemsPerPageActual;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    // Render cards
    let html = '<div class="announcements-grid">';
    
    pageData.forEach(item => {
        const daysUntil = getDaysUntilWedding(item.tanggalNikah);
        const countdownBadge = getCountdownBadge(item.tanggalNikah);
        
        html += `
            <div class="announcement-card">
                <div class="card-header">
                    <div class="card-number">
                        <span>${item.nomorPemeriksaan}</span>
                    </div>
                    ${countdownBadge}
                </div>

                <div class="section gender-male">
                    <div class="section-title">Calon Pengantin Laki-Laki</div>
                    <div class="data-row">
                        <div class="data-label">Nama</div>
                        <div class="data-value">${item.namaLakiLaki}</div>
                    </div>
                    <div class="data-row">
                        <div class="data-label">Bin</div>
                        <div class="data-value">${item.binLakiLaki}</div>
                    </div>
                    <div class="data-row">
                        <div class="data-label">TTL</div>
                        <div class="data-value">${item.ttlLakiLaki}</div>
                    </div>
                    <div class="data-row">
                        <div class="data-label">Alamat</div>
                        <div class="data-value">${item.alamatLakiLaki}</div>
                    </div>
                </div>

                <div class="section gender-female">
                    <div class="section-title">Calon Pengantin Perempuan</div>
                    <div class="data-row">
                        <div class="data-label">Nama</div>
                        <div class="data-value">${item.namaPerempuan}</div>
                    </div>
                    <div class="data-row">
                        <div class="data-label">Binti</div>
                        <div class="data-value">${item.bintiPerempuan}</div>
                    </div>
                    <div class="data-row">
                        <div class="data-label">TTL</div>
                        <div class="data-value">${item.ttlPerempuan}</div>
                    </div>
                    <div class="data-row">
                        <div class="data-label">Alamat</div>
                        <div class="data-value">${item.alamatPerempuan}</div>
                    </div>
                </div>

                <div class="section">
                    <div class="schedule-highlight">
                        <div class="day">${item.hariNikah}</div>
                        <div class="date">${item.tanggalNikah}</div>
                        <div class="location" title="${item.tempatNikah}">📍 ${item.tempatNikah}</div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    contentDiv.innerHTML = html;
    
    // Update pagination
    if (totalPages > 1) {
        paginationDiv.style.display = 'flex';
        document.getElementById('currentPage').textContent = currentPage;
        document.getElementById('totalPages').textContent = totalPages;
        document.getElementById('prevBtn').disabled = currentPage === 1;
        document.getElementById('nextBtn').disabled = currentPage === totalPages;
    } else {
        paginationDiv.style.display = 'none';
    }
}

// Ganti halaman
function changePage(direction) {
    currentPage += direction;
    renderPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Search function
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredData = [...allData];
    } else {
        filteredData = allData.filter(item => {
            return (
                item.namaLakiLaki.toLowerCase().includes(searchTerm) ||
                item.namaPerempuan.toLowerCase().includes(searchTerm) ||
                item.nomorPemeriksaan.toLowerCase().includes(searchTerm) ||
                item.tanggalNikah.toLowerCase().includes(searchTerm) ||
                item.hariNikah.toLowerCase().includes(searchTerm)
            );
        });
    }
    
    updateStats();
    currentPage = 1;
    renderPage();
}

// Event listener untuk search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    
    // Real-time search saat mengetik
    searchInput.addEventListener('input', function() {
        performSearch();
    });
    
    // Search saat Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});

// Load data saat halaman dimuat
loadAnnouncements();

// Auto refresh setiap 5 menit
setInterval(loadAnnouncements, 300000);

// Re-render saat resize untuk adjust pagination
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        renderPage();
    }, 250);
});