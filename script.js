/* ============================
   LOAD DATA DARI LOCALSTORAGE
=============================== */
let data = JSON.parse(localStorage.getItem("transaksi")) || [];

/* ============================
   FORMAT UANG (untuk tampilan tabel & saldo)
=============================== */
function formatRupiah(num) {
    return "Rp " + num.toLocaleString("id-ID");
}

/* ============================
   FORMAT INPUT OTOMATIS: Rp 1.000.000
=============================== */
const inputJumlah = document.getElementById("jumlah");

inputJumlah.addEventListener("input", function () {
    let angka = this.value.replace(/[^0-9]/g, ""); 

    if (angka === "") {
        this.value = "";
        return;
    }

    this.value = "Rp " + angka.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

/* ============================
   HITUNG TOTAL SALDO
=============================== */
function hitungSaldo() {
    let saldo = 0;
    data.forEach(t => {
        if (t.tipe === "masuk") saldo += t.jumlah;
        else saldo -= t.jumlah;
    });

    document.getElementById("totalSaldo").innerText = formatRupiah(saldo);
}

/* ============================
   SIMPAN DATA KE LOCALSTORAGE
=============================== */
function saveData() {
    localStorage.setItem("transaksi", JSON.stringify(data));
}

/* ============================
   TAMPILKAN RIWAYAT
=============================== */
function tampilkanData() {
    let tbody = document.querySelector("#tabelTransaksi tbody");
    tbody.innerHTML = "";

    data.forEach((t, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${t.tanggal}</td>
                <td>${t.kategori}</td>
                <td>${t.tipe}</td>
                <td>${formatRupiah(t.jumlah)}</td>
                <td>
                    <span class="hapus-btn" onclick="hapus(${i})">Hapus</span>
                </td>
            </tr>
        `;
    });
}

/* ============================
   TAMBAH TRANSAKSI
=============================== */
function tambah() {
    let tanggal = document.getElementById("tanggal").value;
    let kategori = document.getElementById("kategori").value;
    let tipe = document.getElementById("tipe").value;

    let jumlahRaw = document.getElementById("jumlah").value.replace(/[^0-9]/g, "");
    let jumlah = parseInt(jumlahRaw);

    if (!tanggal || !kategori || !jumlah) {
        alert("Semua data harus diisi!");
        return;
    }

    let item = { tanggal, kategori, tipe, jumlah };
    data.push(item);

    saveData();
    tampilkanData();
    hitungSaldo();

    alert("Transaksi berhasil ditambahkan!");

    document.getElementById("jumlah").value = "";
    document.getElementById("kategori").value = "";
}

/* ============================
   HAPUS TRANSAKSI
=============================== */
function hapus(i) {
    if (confirm("Hapus transaksi ini?")) {
        data.splice(i, 1);
        saveData();
        tampilkanData();
        hitungSaldo();
    }
}

/* ============================
   EXPORT KE FILE CSV
=============================== */
function exportExcel() {
    let csv = "Tanggal,Kategori,Tipe,Jumlah\n";

    data.forEach(t => {
        csv += `${t.tanggal},${t.kategori},${t.tipe},${t.jumlah}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "data_keuangan.csv";
    a.click();
}

/* ============================
   NAVIGASI HALAMAN
=============================== */
function openInput() {
    document.getElementById("inputBox").style.display = "block";
    document.getElementById("riwayatBox").style.display = "none";
}

function openRiwayat() {
    document.getElementById("inputBox").style.display = "none";
    document.getElementById("riwayatBox").style.display = "block";
}

function openHome() {
    document.getElementById("inputBox").style.display = "none";
    document.getElementById("riwayatBox").style.display = "none";
}

/* ============================
   INIT AWAL
=============================== */
tampilkanData();
hitungSaldo();
