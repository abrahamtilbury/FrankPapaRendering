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
