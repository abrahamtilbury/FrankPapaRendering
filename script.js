const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQIPZ5ZkneAlqm-gf_rAaMCSC4X8RoXImDJ70R6njYvppXHDItVpQrH500aHwJUAy1jypGjfUPsBQce/pub?output=csv";

async function loadContentFromSheet() {
  try {
    const response = await fetch(SHEET_CSV_URL);
    const csvText = await response.text();

    // Simple CSV parse (handles quoted fields)
    const rows = csvText
      .trim()
      .split("\n")
      .map(row => {
        const values = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < row.length; i++) {
          const char = row[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            values.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        values.push(current.trim());
        return values;
      });

    // Skip header row
    const data = {};
    for (let i = 1; i < rows.length; i++) {
      const [page, section, field, content] = rows[i];
      if (page && section && field) {
        const key = `${page}.${section}.${field}`;
        data[key] = content || "";
      }
    }

    // Inject into the page
    document.querySelectorAll("[data-content]").forEach(el => {
      const key = el.getAttribute("data-content");
      if (data[key]) {
        el.textContent = data[key];
      }
    });

  } catch (err) {
    console.error("Failed to load content from Google Sheet:", err);
  }
}

// Run when page loads
document.addEventListener("DOMContentLoaded", loadContentFromSheet);

function initBeforeAfter() {
  document.querySelectorAll(".ba-images").forEach(el => {
    const slider = el.querySelector(".ba-slider");
    if (!slider) return;

    const setPos = (clientX) => {
      const rect = el.getBoundingClientRect();
      let p = ((clientX - rect.left) / rect.width) * 100;
      p = Math.max(5, Math.min(95, p));
      el.style.setProperty("--pos", p + "%");
      slider.style.setProperty("--pos", p + "%");
    };

    const onMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(x);
    };

    const stop = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
    };

    el.addEventListener("mousedown", (e) => {
      setPos(e.clientX);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", stop, { once: true });
    });

    el.addEventListener("touchstart", (e) => {
      setPos(e.touches[0].clientX);
      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("touchend", stop, { once: true });
    }, { passive: true });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadContentFromSheet();
  initBeforeAfter();
});
