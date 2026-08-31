document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cards-container");

  // Show a basic loading state while data is fetched
  container.innerHTML = `<p class="status-message">Loading site showcase...</p>`;

  fetch("data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((sites) => {
      if (!sites || sites.length === 0) {
        container.innerHTML = `<p class="status-message">No sites found in urls.json.</p>`;
        return;
      }

      container.innerHTML = ""; // Clear loading message

      sites.forEach((site) => {
        const card = document.createElement("article");
        card.className = "card";

        // Fallback placeholder image if screenshot fails to load
        const fallbackImage = `https://placehold.co/600x400/1e293b/ffffff?text=${encodeURIComponent(
          site.title || "No Preview"
        )}`;

        card.innerHTML = `
          <div class="preview-container">
            <img 
              src="${site.screenshot}" 
              alt="Screenshot preview of ${site.title}" 
              loading="lazy" 
              onerror="this.onerror=null; this.src='${fallbackImage}';"
            />
          </div>
          <div class="card-content">
            <h2 class="card-title">${escapeHTML(site.title)}</h2>
            <p class="card-description">${escapeHTML(site.description)}</p>
            <a href="${site.url}" target="_blank" rel="noopener noreferrer" class="card-link">
              Visit Website &rarr;
            </a>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error loading site data:", error);
      container.innerHTML = `<p class="status-message error">Failed to load site data. Ensure data.json exists.</p>`;
    });
});

// Helper function to sanitize text input and prevent XSS
function escapeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
