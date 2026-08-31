fetch('data.json')
  .then(response => response.json())
  .then(sites => {
    const container = document.getElementById("cards-container");
    container.innerHTML = "";

    sites.forEach(site => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="preview-container">
          <img src="${site.screenshot}" alt="Preview of ${site.title}" loading="lazy">
        </div>
        <div class="card-content">
          <h2 class="card-title">${site.title}</h2>
          <p class="card-description">${site.description}</p>
          <a href="${site.url}" target="_blank" rel="noopener noreferrer" class="card-link">Visit Site</a>
        </div>
      `;

      container.appendChild(card);
    });
  });
