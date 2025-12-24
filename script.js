// NAVBAR MOBILE
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("mainNav");

if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// ACTIVE MENU ON SCROLL
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");

window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;

    sections.forEach(section => {
        const id = section.getAttribute("id");
        const offsetTop = section.offsetTop - 120;
        const offsetBottom = offsetTop + section.offsetHeight;

        if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${id}`) {
                    link.classList.add("active");
                }
            });
        }
    });
});

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId && targetId.length > 1) {
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: "smooth" });
            }
        }
    });
});

// BACK TO TOP
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (!backToTopBtn) return;
    const y = window.scrollY || document.documentElement.scrollTop;
    if (y > 400) {
        backToTopBtn.classList.add("show");
    } else {
        backToTopBtn.classList.remove("show");
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// BOOKING FORM VALIDATION & ALERT
const bookingForm = document.getElementById("bookingForm");
const bookingAlert = document.getElementById("bookingAlert");

function showAlert(type, message) {
    if (!bookingAlert) return;
    bookingAlert.className = "alert show " + type;
    bookingAlert.textContent = message;
    bookingAlert.scrollIntoView({ behavior: "smooth", block: "center" });
}

if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const fullName = bookingForm.fullName.value.trim();
        const phone = bookingForm.phone.value.trim();
        const vehicleType = bookingForm.vehicleType.value;
        const pickupDate = bookingForm.pickupDate.value;
        const returnDate = bookingForm.returnDate.value;
        const idNumber = bookingForm.idNumber.value.trim();
        const licenseNumber = bookingForm.licenseNumber.value.trim();
        const agreeTerms = document.getElementById("agreeTerms").checked;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const pickup = pickupDate ? new Date(pickupDate) : null;
        const ret = returnDate ? new Date(returnDate) : null;

        let errors = [];

        if (!fullName) {
            errors.push("Nama lengkap wajib diisi.");
        }
        if (!phone || phone.length < 10) {
            errors.push("Nomor WhatsApp tidak valid.");
        }
        if (!vehicleType) {
            errors.push("Pilih tipe kendaraan terlebih dahulu.");
        }
        if (!pickupDate || !returnDate) {
            errors.push("Tanggal mulai dan selesai wajib diisi.");
        } else {
            pickup.setHours(0, 0, 0, 0);
            ret.setHours(0, 0, 0, 0);
            if (pickup < today) {
                errors.push("Tanggal mulai tidak boleh sebelum hari ini.");
            }
            if (ret <= pickup) {
                errors.push("Tanggal selesai harus setelah tanggal mulai.");
            }
        }
        if (!idNumber || idNumber.length < 10) {
            errors.push("Nomor KTP tidak valid.");
        }
        if (!licenseNumber || licenseNumber.length < 6) {
            errors.push("Nomor SIM tidak valid.");
        }
        if (!agreeTerms) {
            errors.push("Anda harus menyetujui syarat & ketentuan sewa.");
        }

        if (errors.length > 0) {
            showAlert("error", errors.join(" "));
            return;
        }

        const days = Math.round((ret - pickup) / (1000 * 60 * 60 * 24));
        let vehicleLabel = "";
        if (vehicleType === "city") vehicleLabel = "City Car";
        if (vehicleType === "van") vehicleLabel = "Family Van";
        if (vehicleType === "scooter") vehicleLabel = "Scooter Matic";

        const confirmMsg =
            `Mohon cek kembali data berikut:\n\n` +
            `Nama: ${fullName}\n` +
            `WhatsApp: ${phone}\n` +
            `Kendaraan: ${vehicleLabel}\n` +
            `Durasi: ${days} hari\n` +
            `Mulai: ${pickupDate}\n` +
            `Selesai: ${returnDate}\n\n` +
            `Apakah data ini sudah benar dan ingin dikirim ke admin?`;

        const ok = window.confirm(confirmMsg);

        if (!ok) {
            showAlert("error", "Pengajuan booking dibatalkan. Silakan perbaiki data jika perlu.");
            return;
        }

        showAlert(
            "success",
            "Booking berhasil diajukan! Admin akan menghubungi Anda via WhatsApp dalam 10–30 menit untuk verifikasi akhir."
        );

        bookingForm.reset();
    });
}
