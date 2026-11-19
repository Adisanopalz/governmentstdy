/* LAPISAN LAYANAN (service layer) - terinspirasi pendekatan SOA (Widodo, 2016; Setiawan & Yulianto, 2018).
   UI hanya memanggil fungsi di sini. Untuk produksi, ganti isi fungsi dengan fetch() ke API/SPBE nyata
   tanpa mengubah kode antarmuka. */
(function(w){
const LAYANAN=[
{id:"ktp",kat:"kependudukan",nama:"Pengajuan KTP Elektronik",nama_en:"Electronic ID Card Application",ds:"Pembuatan atau penggantian KTP karena hilang, rusak, atau perubahan data.",ds_en:"New or replacement ID card for loss, damage, or data changes.",sy:["Surat pengantar RT/RW","Kartu Keluarga","Surat kehilangan (jika hilang)"],wkt:"3 hari kerja"},
{id:"kk",kat:"kependudukan",nama:"Perubahan Kartu Keluarga",nama_en:"Family Card Update",ds:"Penambahan anggota, perubahan data, atau pecah KK.",ds_en:"Adding members, changing data, or splitting a family card.",sy:["KK lama","Akta/surat terkait","KTP pemohon"],wkt:"3 hari kerja"},
{id:"akta",kat:"kependudukan",nama:"Akta Kelahiran",nama_en:"Birth Certificate",ds:"Penerbitan akta kelahiran anak.",ds_en:"Issuance of a child's birth certificate.",sy:["Surat keterangan lahir","KK","KTP orang tua"],wkt:"5 hari kerja"},
{id:"imb",kat:"perizinan",nama:"Persetujuan Bangunan Gedung",nama_en:"Building Approval",ds:"Permohonan persetujuan mendirikan atau mengubah bangunan.",ds_en:"Approval to build or modify a building.",sy:["Gambar rencana","Bukti kepemilikan tanah","KTP pemohon"],wkt:"14 hari kerja"},
{id:"nib",kat:"perizinan",nama:"Izin Usaha Mikro",nama_en:"Micro Business Permit",ds:"Pendaftaran usaha mikro dan kecil.",ds_en:"Registration of micro and small businesses.",sy:["KTP","Alamat usaha","Jenis usaha"],wkt:"2 hari kerja"},
{id:"pajak",kat:"pajak",nama:"Cek dan Bayar Pajak Bumi dan Bangunan",nama_en:"Property Tax Check and Payment",ds:"Cek tagihan dan metode pembayaran pajak daerah.",ds_en:"Check bills and payment methods for local property tax.",sy:["NOP","Nama wajib pajak"],wkt:"Langsung"},
{id:"bansos",kat:"sosial",nama:"Pendaftaran Bantuan Sosial",nama_en:"Social Assistance Registration",ds:"Pengajuan atau pengecekan status penerima bantuan.",ds_en:"Apply for or check social assistance status.",sy:["KTP","KK","Surat keterangan tidak mampu"],wkt:"7 hari kerja"},
{id:"sehat",kat:"kesehatan",nama:"Pendaftaran Layanan Puskesmas",nama_en:"Community Health Center Booking",ds:"Pendaftaran antrean dan informasi jadwal puskesmas.",ds_en:"Queue booking and clinic schedule information.",sy:["KTP/Kartu BPJS"],wkt:"Langsung"},
{id:"pendidikan",kat:"pendidikan",nama:"Informasi Pendaftaran Sekolah",nama_en:"School Enrollment Information",ds:"Jadwal, zonasi, dan persyaratan pendaftaran sekolah negeri.",ds_en:"Schedules, zoning, and requirements for public schools.",sy:["Akta kelahiran","KK"],wkt:"Sesuai jadwal"}];
const KAT={kependudukan:["Kependudukan","Civil Registry"],perizinan:["Perizinan","Permits"],pajak:["Pajak","Tax"],sosial:["Sosial","Social"],kesehatan:["Kesehatan","Health"],pendidikan:["Pendidikan","Education"]};
const BERITA=[
{t:"Loket layanan terpadu kini buka hingga pukul 16.00",d:"2026-11-10",r:"Warga dapat menjadwalkan kunjungan secara online agar tidak antre lama."},
{t:"Portal kini mendukung mode kontras tinggi dan huruf besar",d:"2026-11-05",r:"Pembaruan aksesibilitas untuk lansia dan penyandang disabilitas penglihatan."},
{t:"Panduan singkat: cara melacak pengaduan",d:"2026-10-28",r:"Gunakan kode tiket di halaman Lacak untuk melihat tahapan penanganan."}];
const KEY="portal_pengaduan_v1";
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}};
const write=a=>{try{localStorage.setItem(KEY,JSON.stringify(a));return true}catch(e){return false}};
const DEMO={kode:"PGD-2026-0001",kategori:"Infrastruktur",judul:"Lampu jalan mati (contoh)",tgl:"2026-11-12",status:3};
const TAHAP=["Diterima","Diverifikasi","Diproses petugas","Selesai"];
const delay=ms=>new Promise(r=>setTimeout(r,ms));
w.Svc={
 TAHAP,KAT,
 async getLayanan({q="",kat=""}={}){await delay(60);q=q.trim().toLowerCase();
  return LAYANAN.filter(l=>(!kat||l.kat===kat)&&(!q||(l.nama+l.nama_en+l.ds+l.ds_en).toLowerCase().includes(q)));},
 async getBerita(){await delay(30);return BERITA;},
 async kirimPengaduan(d){await delay(300);const a=read();
  const kode="PGD-2026-"+String(a.length+2).padStart(4,"0");
  a.push({kode,kategori:d.kategori,judul:d.judul,isi:d.isi,tgl:new Date().toISOString().slice(0,10),status:0});
  if(!write(a))throw new Error("storage");return{kode};},
 async lacak(kode){await delay(200);kode=(kode||"").trim().toUpperCase();
  if(kode===DEMO.kode)return DEMO;return read().find(x=>x.kode===kode)||null;}
};})(window);
