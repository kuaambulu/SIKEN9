// ============================================
// SIKEN9 Admin Panel Script
// dengan Filter Status & Arsip
// ============================================

import { db, auth } from './firebase-config.js';
import { 
    collection, 
    doc, 
    setDoc, 
    getDocs, 
    deleteDoc, 
    onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

let currentEditId = null;
let unsubscribe = null;
let allDataAdmin = [];
let currentFilter = 'aktif'; // aktif | arsip | semua

// Parse Indonesian date
function parseIndonesianDate(dateStr) {
    if (!dateStr) return null;
    const monthMap = {
        'januari': 0, 'februari': 1, 'maret': 2, 'april': 3,
        'mei': 4, 'juni': 5, 'juli': 6, 'agustus': 7,
        'september': 8, 'oktober': 9, 'november': 10, 'desember': 11
    };
    const parts = dateStr.toLowerCase().trim().split(' ');
    if (parts.length >= 3) {
        const day = parseInt(parts[0]);
        const monthStr = parts[1];
        const year = parseInt(parts[2]);
        for (let key in monthMap) {
            if (key.startsWith(monthStr.substring(0, 3))) {
                return new Date(year, monthMap[key], day);
            }
        }
    }
    return null;
}

// Cek apakah acara sudah selesai
function isEventFinished(tanggalNikah) {
    const weddingDate = parseIndonesianDate(tanggalNikah);
    if (!weddingDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    weddingDate.setHours(0, 0, 0, 0);
    
    return weddingDate < today;
}

// Get status otomatis
function getAutoStatus(tanggalNikah) {
    const weddingDate = parseIndonesianDate(tanggalNikah);
    if (!weddingDate) return 'Unknown';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    weddingDate.setHours(0, 0, 0, 0);
    
    if (weddingDate < today) return 'Arsip';
    if (weddingDate.getTime() === today.getTime()) return 'Hari Ini';
    return 'Aktif';
}

// Check auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        showDashboard();
        loadData();
    } else {
        showLogin();
    }
});

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').classList.remove('show');
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').classList.add('show');
}

// Handle Login
window.handleLogin = async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        errorDiv.classList.remove('show');
    } catch (error) {
        errorDiv.textContent = '❌ Email atau password salah!';
        errorDiv.classList.add('show');
        console.error('Login error:', error);
    }
};

// Handle Logout
window.handleLogout = async function() {
    if (confirm('Yakin ingin logout?')) {
        try {
            await signOut(auth);
            if (unsubscribe) unsubscribe();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
};

// Load data with real-time listener - SEMUA DATA (termasuk arsip)
function loadData() {
    const q = collection(db, 'announcements');
    
    unsubscribe = onSnapshot(q, (snapshot) => {
        allDataAdmin = [];
        snapshot.forEach((doc) => {
            allDataAdmin.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Sort by tanggal nikah (terbaru dulu untuk admin)
        allDataAdmin.sort((a, b) => {
            const dateA = parseIndonesianDate(a.tanggalNikah);
            const dateB = parseIndonesianDate(b.tanggalNikah);
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;
            return dateB - dateA; // Descending (terbaru dulu)
        });
        
        renderTable();
        updateStats();
    });
}

// Update stats
function updateStats() {
    const aktif = allDataAdmin.filter(item => !isEventFinished(item.tanggalNikah)).length;
    const arsip = allDataAdmin.filter(item => isEventFinished(item.tanggalNikah)).length;
    
    document.getElementById('statsAktif').textContent = aktif;
    document.getElementById('statsArsip').textContent = arsip;
    document.getElementById('statsTotal').textContent = allDataAdmin.length;
}

// Filter data berdasarkan status
function getFilteredData() {
    if (currentFilter === 'aktif') {
        return allDataAdmin.filter(item => !isEventFinished(item.tanggalNikah));
    } else if (currentFilter === 'arsip') {
        return allDataAdmin.filter(item => isEventFinished(item.tanggalNikah));
    } else {
        return allDataAdmin;
    }
}

// Change filter
window.changeFilter = function(filter) {
    currentFilter = filter;
    
    // Update button styles
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('filter-' + filter).classList.add('active');
    
    renderTable();
};

// Render table
function renderTable() {
    const tbody = document.getElementById('tableBody');
    const data = getFilteredData();
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Tidak ada data</td></tr>';
        return;
    }
    
    let html = '';
    data.forEach(item => {
        const autoStatus = getAutoStatus(item.tanggalNikah);
        const isArsip = isEventFinished(item.tanggalNikah);
        
        html += `
            <tr ${isArsip ? 'style="background: #f5f5f5; opacity: 0.8;"' : ''}>
                <td>${item.nomorPemeriksaan}</td>
                <td>${item.namaLakiLaki}</td>
                <td>${item.namaPerempuan}</td>
                <td>${item.tanggalNikah}</td>
                <td>
                    <span style="padding: 5px 10px; border-radius: 5px; font-size: 0.85em; font-weight: 600; background: ${
                        autoStatus === 'Aktif' ? '#d4edda' : 
                        autoStatus === 'Hari Ini' ? '#fff3cd' : '#e8e8e8'
                    }; color: ${
                        autoStatus === 'Aktif' ? '#155724' : 
                        autoStatus === 'Hari Ini' ? '#856404' : '#666'
                    };">
                        ${autoStatus === 'Arsip' ? '📦 ' : autoStatus === 'Hari Ini' ? '🔔 ' : '✅ '}${autoStatus}
                    </span>
                </td>
                <td>
                    <button class="btn-edit" onclick="editData('${item.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteData('${item.id}', '${item.nomorPemeriksaan}')">Hapus</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Open Add Modal
window.openAddModal = function() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Tambah Pengumuman';
    document.getElementById('dataForm').reset();
    document.getElementById('editId').value = '';
    
    // Set default values
    document.getElementById('kewarganegaraanLakiLaki').value = 'WNI';
    document.getElementById('agamaLakiLaki').value = 'Islam';
    document.getElementById('kewarganegaraanPerempuan').value = 'WNI';
    document.getElementById('agamaPerempuan').value = 'Islam';
    document.getElementById('kewarganegaraanWali').value = 'WNI';
    document.getElementById('agamaWali').value = 'Islam';
    
    document.getElementById('formModal').classList.add('show');
};

// Close Modal
window.closeModal = function() {
    document.getElementById('formModal').classList.remove('show');
};

// Toggle Wali Fields
window.toggleWaliFields = function() {
    const jenisWali = document.getElementById('jenisWali').value;
    const hubunganGroup = document.getElementById('hubunganWaliGroup');
    const sebabGroup = document.getElementById('sebabWaliGroup');
    
    if (jenisWali === 'Nasab') {
        hubunganGroup.style.display = 'block';
        sebabGroup.style.display = 'none';
        document.getElementById('hubunganWali').required = true;
        document.getElementById('sebabWali').required = false;
    } else {
        hubunganGroup.style.display = 'none';
        sebabGroup.style.display = 'block';
        document.getElementById('hubunganWali').required = false;
        document.getElementById('sebabWali').required = true;
    }
};

// Edit Data
window.editData = async function(id) {
    try {
        const snapshot = await getDocs(collection(db, 'announcements'));
        let itemData = null;
        
        snapshot.forEach((doc) => {
            if (doc.id === id) {
                itemData = { id: doc.id, ...doc.data() };
            }
        });
        
        if (!itemData) {
            alert('Data tidak ditemukan!');
            return;
        }
        
        currentEditId = id;
        document.getElementById('modalTitle').textContent = 'Edit Pengumuman';
        document.getElementById('editId').value = id;
        
        // Fill form
        document.getElementById('nomorPemeriksaan').value = itemData.nomorPemeriksaan;
        document.getElementById('namaLakiLaki').value = itemData.namaLakiLaki;
        document.getElementById('binLakiLaki').value = itemData.binLakiLaki;
        document.getElementById('ttlLakiLaki').value = itemData.ttlLakiLaki;
        document.getElementById('kewarganegaraanLakiLaki').value = itemData.kewarganegaraanLakiLaki;
        document.getElementById('agamaLakiLaki').value = itemData.agamaLakiLaki;
        document.getElementById('pekerjaanLakiLaki').value = itemData.pekerjaanLakiLaki;
        document.getElementById('alamatLakiLaki').value = itemData.alamatLakiLaki;
        
        document.getElementById('namaPerempuan').value = itemData.namaPerempuan;
        document.getElementById('bintiPerempuan').value = itemData.bintiPerempuan;
        document.getElementById('ttlPerempuan').value = itemData.ttlPerempuan;
        document.getElementById('kewarganegaraanPerempuan').value = itemData.kewarganegaraanPerempuan;
        document.getElementById('agamaPerempuan').value = itemData.agamaPerempuan;
        document.getElementById('pekerjaanPerempuan').value = itemData.pekerjaanPerempuan;
        document.getElementById('alamatPerempuan').value = itemData.alamatPerempuan;
        
        document.getElementById('jenisWali').value = itemData.jenisWali;
        toggleWaliFields();
        document.getElementById('hubunganWali').value = itemData.hubunganWali || '';
        document.getElementById('sebabWali').value = itemData.sebabWali || '';
        document.getElementById('namaWali').value = itemData.namaWali;
        document.getElementById('binWali').value = itemData.binWali;
        document.getElementById('ttlWali').value = itemData.ttlWali;
        document.getElementById('kewarganegaraanWali').value = itemData.kewarganegaraanWali;
        document.getElementById('agamaWali').value = itemData.agamaWali;
        document.getElementById('pekerjaanWali').value = itemData.pekerjaanWali;
        document.getElementById('alamatWali').value = itemData.alamatWali;
        
        document.getElementById('hariNikah').value = itemData.hariNikah;
        document.getElementById('tanggalNikah').value = itemData.tanggalNikah;
        document.getElementById('tempatNikah').value = itemData.tempatNikah;
        
        document.getElementById('formModal').classList.add('show');
        
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Gagal memuat data!');
    }
};

// Delete Data
window.deleteData = async function(id, nomorPemeriksaan) {
    if (!confirm(`Yakin ingin menghapus data ${nomorPemeriksaan}?`)) {
        return;
    }
    
    try {
        await deleteDoc(doc(db, 'announcements', id));
        alert('✅ Data berhasil dihapus!');
    } catch (error) {
        console.error('Error deleting:', error);
        alert('❌ Gagal menghapus data!');
    }
};

// Handle Submit
window.handleSubmit = async function(e) {
    e.preventDefault();
    
    const data = {
        nomorPemeriksaan: document.getElementById('nomorPemeriksaan').value,
        namaLakiLaki: document.getElementById('namaLakiLaki').value,
        binLakiLaki: document.getElementById('binLakiLaki').value,
        ttlLakiLaki: document.getElementById('ttlLakiLaki').value,
        kewarganegaraanLakiLaki: document.getElementById('kewarganegaraanLakiLaki').value,
        agamaLakiLaki: document.getElementById('agamaLakiLaki').value,
        pekerjaanLakiLaki: document.getElementById('pekerjaanLakiLaki').value,
        alamatLakiLaki: document.getElementById('alamatLakiLaki').value,
        
        namaPerempuan: document.getElementById('namaPerempuan').value,
        bintiPerempuan: document.getElementById('bintiPerempuan').value,
        ttlPerempuan: document.getElementById('ttlPerempuan').value,
        kewarganegaraanPerempuan: document.getElementById('kewarganegaraanPerempuan').value,
        agamaPerempuan: document.getElementById('agamaPerempuan').value,
        pekerjaanPerempuan: document.getElementById('pekerjaanPerempuan').value,
        alamatPerempuan: document.getElementById('alamatPerempuan').value,
        
        jenisWali: document.getElementById('jenisWali').value,
        hubunganWali: document.getElementById('hubunganWali').value,
        sebabWali: document.getElementById('sebabWali').value,
        namaWali: document.getElementById('namaWali').value,
        binWali: document.getElementById('binWali').value,
        ttlWali: document.getElementById('ttlWali').value,
        kewarganegaraanWali: document.getElementById('kewarganegaraanWali').value,
        agamaWali: document.getElementById('agamaWali').value,
        pekerjaanWali: document.getElementById('pekerjaanWali').value,
        alamatWali: document.getElementById('alamatWali').value,
        
        hariNikah: document.getElementById('hariNikah').value,
        tanggalNikah: document.getElementById('tanggalNikah').value,
        tempatNikah: document.getElementById('tempatNikah').value,
        
        updatedAt: new Date().toISOString()
    };
    
    if (!currentEditId) {
        data.createdAt = new Date().toISOString();
    }
    
    try {
        const docId = currentEditId || data.nomorPemeriksaan.replace(/[^a-zA-Z0-9]/g, '_');
        await setDoc(doc(db, 'announcements', docId), data);
        
        alert(currentEditId ? '✅ Data berhasil diupdate!' : '✅ Data berhasil ditambahkan!');
        closeModal();
        document.getElementById('dataForm').reset();
        
    } catch (error) {
        console.error('Error saving:', error);
        alert('❌ Gagal menyimpan data!');
    }
};
