const sites = [
  {
    title: "Example Site 1",
    description: "An example website showcasing domain info and testing tools.",
    url: "https://example.com"
  },
  {
    title: "Wikipedia Main Page",
    description: "The free encyclopedia that anyone can edit.",
    url: "https://www.wikipedia.org"
  }
];

const container = document.getElementById("cards-container");

sites.forEach(site => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="preview-container">
      <iframe src="${site.url}" title="Preview of ${site.title}"></iframe>
    </div>
    <div class="card-content">
      <h2 class="card-title">${site.title}</h2>
      <p class="card-description">${site.description}</p>
      <a href="${site.url}" target="_blank" rel="noopener noreferrer" class="card-link">Visit Site</a>
    </div>
  `;

  container.appendChild(card);
});
