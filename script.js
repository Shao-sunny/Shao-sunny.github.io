const appMain = document.querySelector("#app-main");
const tabButtons = Array.from(document.querySelectorAll(".tab-button"));
const lightbox = document.querySelector("#poster-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxClose = document.querySelector("#lightbox-close");

let currentTab = "home";
let snapTimeout;

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderAboutInfoRows(items) {
  return items
    .map(
      (item) => `
        <li><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></li>
      `
    )
    .join("");
}

function renderEducationItems(items) {
  return items
    .map(
      (item) => `
        <div class="timeline-item">
          <div class="timeline-head">
            <h3>${escapeHtml(item.title)}</h3>
            <span>${escapeHtml(item.time)}</span>
          </div>
          ${item.meta ? `<p class="meta">${escapeHtml(item.meta)}</p>` : ""}
          ${(item.details || []).map((detail) => `<p>${escapeHtml(detail)}</p>`).join("")}
        </div>
      `
    )
    .join("");
}

function renderInternshipDetails(items) {
  return items
    .map(
      (item) => `
        <div class="detail-block">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </div>
      `
    )
    .join("");
}

function renderInternshipResults(items) {
  return items
    .map((item) => {
      if (item.action_type === "internal") {
        return `
          <button class="result-card result-button" data-target-tab="${escapeHtml(item.action_tab)}" data-target-subtab-group="${escapeHtml(item.action_subtab_group)}" data-target-subtab="${escapeHtml(item.action_subtab)}">
            <span class="result-label">${escapeHtml(item.label)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </button>
        `;
      }

      return `
        <a class="result-card" href="${escapeHtml(item.action_value)}" target="_blank" rel="noreferrer">
          <span class="result-label">${escapeHtml(item.label)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </a>
      `;
    })
    .join("");
}

function renderSopSections(items) {
  return items
    .map((section, index) => `
      <section class="sop-block ${index === items.length - 1 ? "wide-sop" : ""}">
        <h3>${escapeHtml(section.title)}</h3>
        ${section.pills && section.pills.length ? `<div class="sop-pill-row">${section.pills.map((pill) => `<span class="glass-pill">${escapeHtml(pill)}</span>`).join("")}</div>` : ""}
        <ul class="sop-list">
          ${(section.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </section>
    `)
    .join("");
}

function renderProjects(items) {
  return items
    .map(
      (item) => `
        <section class="project-entry">
          <div class="project-head">
            <h3>${escapeHtml(item.title)}</h3>
            <div class="project-meta">
              ${item.role ? `<span>${escapeHtml(item.role)}</span>` : ""}
              ${item.time ? `<span>${escapeHtml(item.time)}</span>` : ""}
            </div>
          </div>
          ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
          <ul class="project-list">
            ${(item.bullets || []).map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
          </ul>
        </section>
      `
    )
    .join("");
}

function renderVideos(items) {
  return items
    .map(
      (item) => `
        <div class="video-work">
          <h3>${escapeHtml(item.title)}</h3>
          <video controls preload="metadata" class="portfolio-video">
            <source src="${escapeHtml(item.file)}" type="video/mp4">
          </video>
        </div>
      `
    )
    .join("");
}

function renderPosters(items) {
  return items
    .map(
      (item) => `
        <article class="poster-card" data-fullsrc="${escapeHtml(item.file)}" data-title="${escapeHtml(item.title)}" tabindex="0">
          <h4>${escapeHtml(item.title)}</h4>
          <img src="${escapeHtml(item.file)}" alt="${escapeHtml(item.title)}">
        </article>
      `
    )
    .join("");
}

function renderOffline(items) {
  return items
    .map(
      (item) => `
        <figure class="offline-card">
          <img src="${escapeHtml(item.file)}" alt="${escapeHtml(item.title)}">
          <figcaption>${escapeHtml(item.title)}</figcaption>
        </figure>
      `
    )
    .join("");
}

function renderSite(data) {
  appMain.innerHTML = `
    <section class="tab-panel active" id="home">
      <header class="hero hero-home">
        <div class="hero-copy">
          <p class="eyebrow">${escapeHtml(data.settings.home_eyebrow)}</p>
          <h1>${escapeHtml(data.settings.name)}</h1>
          ${data.home.cn_lines.map((line) => `<p class="hero-tagline">${escapeHtml(line)}</p>`).join("")}
          ${data.home.en_lines.map((line) => `<p class="hero-tagline en">${escapeHtml(line)}</p>`).join("")}
          <div class="hero-actions">
            <button class="jump-button" data-target="${escapeHtml(data.settings.home_button_target)}">${escapeHtml(data.settings.home_button_label)}</button>
          </div>
        </div>
      </header>
    </section>

    <section class="tab-panel" id="about">
      <div class="section-grid">
        <article class="card">
          <div class="card-title-group">
            <p class="section-index">01</p>
            <h2>基础信息</h2>
          </div>
          <div class="about-inline-photo">
            <div class="about-inline-photo-frame">
              <img src="${escapeHtml(data.settings.about_photo)}" alt="${escapeHtml(data.settings.name)}照片">
            </div>
          </div>
          <ul class="info-list">${renderAboutInfoRows(data.about.info)}</ul>
        </article>

        <article class="card wide-card">
          <div class="card-title-group">
            <p class="section-index">02</p>
            <h2>教育经历</h2>
          </div>
          <div class="timeline">${renderEducationItems(data.about.education)}</div>
        </article>

        <article class="card wide-card">
          <div class="card-title-group">
            <p class="section-index">03</p>
            <h2>实习经历概览</h2>
          </div>
          <div class="timeline-item compact">
            <div class="timeline-head">
              <h3>${escapeHtml(data.internship.company)}</h3>
              <span>${escapeHtml(data.internship.time)}</span>
            </div>
            <p class="meta">${escapeHtml(data.internship.role)}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="tab-panel" id="internship">
      <article class="card feature-card">
        <div class="card-title-group">
          <p class="section-index">Internship</p>
          <h2>${escapeHtml(data.internship.company)}</h2>
        </div>

        <div class="subtab-nav section-subtabs" aria-label="实习内容分类">
          <button class="subtab-button active" data-subtab-group="internship" data-subtab="internship-overview">${escapeHtml(data.internship.overview_label)}</button>
          <button class="subtab-button" data-subtab-group="internship" data-subtab="internship-sop">${escapeHtml(data.internship.sop_label)}</button>
        </div>

        <div class="subtab-panel active" data-subtab-group="internship" id="internship-overview">
          <div class="feature-topline">
            <span>岗位：${escapeHtml(data.internship.role)}</span>
            <span>时间：${escapeHtml(data.internship.time)}</span>
          </div>
          ${renderInternshipDetails(data.internship.details)}
          <div class="result-links">${renderInternshipResults(data.internship.results)}</div>
        </div>

        <div class="subtab-panel" data-subtab-group="internship" id="internship-sop">
          <p class="sop-intro">${escapeHtml(data.internship.sop_intro)}</p>
          <div class="sop-grid">${renderSopSections(data.internship.sop_sections)}</div>
        </div>
      </article>
    </section>

    <section class="tab-panel" id="projects">
      <article class="card project-card">
        <div class="card-title-group">
          <p class="section-index">03</p>
          <h2>项目经历</h2>
        </div>
        <div class="project-stack">${renderProjects(data.projects)}</div>
      </article>
    </section>

    <section class="tab-panel" id="works">
      <article class="card works-card">
        <div class="card-title-group">
          <p class="section-index">04</p>
          <h2>个人作品</h2>
        </div>

        <div class="subtab-nav" aria-label="作品分类">
          <button class="subtab-button active" data-subtab-group="works" data-subtab="video-works">${escapeHtml(data.works.video_label)}</button>
          <button class="subtab-button" data-subtab-group="works" data-subtab="graphic-works">${escapeHtml(data.works.graphic_label)}</button>
        </div>

        <div class="subtab-panel active" data-subtab-group="works" id="video-works">
          ${renderVideos(data.works.videos)}
        </div>

        <div class="subtab-panel" data-subtab-group="works" id="graphic-works">
          <section class="graphic-section">
            <h3 class="graphic-title">${escapeHtml(data.works.poster_title)}</h3>
            <p class="poster-hint">${escapeHtml(data.settings.poster_hint)}</p>
            <div class="poster-fade poster-fade-left" aria-hidden="true"></div>
            <div class="poster-fade poster-fade-right" aria-hidden="true"></div>
            <div class="poster-rail" id="poster-rail">${renderPosters(data.works.posters)}</div>
          </section>

          <section class="graphic-section">
            <h3 class="graphic-title">${escapeHtml(data.works.wechat.title)}</h3>
            <p class="graphic-note">${escapeHtml(data.works.wechat.note)}</p>
            <a class="wechat-cover" href="${escapeHtml(data.works.wechat.url)}" target="_blank" rel="noreferrer">
              <img src="${escapeHtml(data.works.wechat.image)}" alt="${escapeHtml(data.works.wechat.title)}">
            </a>
          </section>

          <section class="graphic-section">
            <h3 class="graphic-title">${escapeHtml(data.works.offline_title)}</h3>
            <div class="offline-grid">${renderOffline(data.works.offline)}</div>
          </section>
        </div>
      </article>
    </section>
  `;
}

function activateTab(tabId) {
  currentTab = tabId;
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabId);
  });

  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabId);
  });
}

function activateSubtab(groupName, subtabId) {
  document.querySelectorAll(".subtab-button").forEach((button) => {
    if (button.dataset.subtabGroup === groupName) {
      button.classList.toggle("active", button.dataset.subtab === subtabId);
    }
  });

  document.querySelectorAll(".subtab-panel").forEach((panel) => {
    if (panel.dataset.subtabGroup === groupName) {
      panel.classList.toggle("active", panel.id === subtabId);
    }
  });
}

function bindPrimaryTabs() {
  tabButtons.forEach((button) => {
    button.onclick = () => activateTab(button.dataset.tab);
  });
}

function bindTargets() {
  document.querySelectorAll("[data-target]").forEach((button) => {
    button.onclick = () => activateTab(button.dataset.target);
  });

  document.querySelectorAll("[data-target-tab]").forEach((button) => {
    button.onclick = () => {
      activateTab(button.dataset.targetTab);
      activateSubtab(button.dataset.targetSubtabGroup, button.dataset.targetSubtab);
    };
  });
}

function bindSubtabs() {
  document.querySelectorAll(".subtab-button").forEach((button) => {
    button.onclick = () => activateSubtab(button.dataset.subtabGroup, button.dataset.subtab);
  });
}

function openLightbox(card) {
  if (!lightbox || !lightboxImage || !lightboxTitle) {
    return;
  }

  lightboxImage.src = card.dataset.fullsrc;
  lightboxImage.alt = card.dataset.title || "";
  lightboxTitle.textContent = card.dataset.title || "";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

function bindPosterRail() {
  const posterRail = document.querySelector("#poster-rail");
  const posterCards = posterRail ? Array.from(posterRail.querySelectorAll(".poster-card")) : [];

  function updatePosterFocus() {
    if (!posterRail || posterCards.length === 0) {
      return;
    }

    const railRect = posterRail.getBoundingClientRect();
    const railCenter = railRect.left + railRect.width / 2;
    let closestCard = posterCards[0];
    let closestDistance = Number.POSITIVE_INFINITY;

    posterCards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - railCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
      }
    });

    posterCards.forEach((card) => {
      card.classList.toggle("is-active", card === closestCard);
    });

    window.clearTimeout(snapTimeout);
    snapTimeout = window.setTimeout(() => {
      closestCard.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }, 120);
  }

  if (posterRail) {
    posterRail.addEventListener("scroll", updatePosterFocus, { passive: true });
    window.addEventListener("resize", updatePosterFocus);
    updatePosterFocus();
  }

  posterCards.forEach((card) => {
    card.addEventListener("click", () => openLightbox(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(card);
      }
    });
  });
}

function bindLightbox() {
  if (!lightbox || !lightboxClose) {
    return;
  }

  lightboxClose.onclick = closeLightbox;
  lightbox.onclick = (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  };

  document.onkeydown = (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  };
}

function bindInteractions() {
  bindPrimaryTabs();
  bindTargets();
  bindSubtabs();
  bindPosterRail();
  bindLightbox();
  activateTab(currentTab);
}

function showError(message) {
  appMain.innerHTML = `
    <section class="tab-panel active">
      <article class="card">
        <p class="sop-intro">${escapeHtml(message)}</p>
      </article>
    </section>
  `;
}

async function loadSiteData() {
  try {
    const response = await fetch(`/api/site-data?ts=${Date.now()}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    renderSite(data);
    bindInteractions();
  } catch (error) {
    showError(`内容加载失败，请通过本地服务打开网站。${error.message}`);
  }
}

bindPrimaryTabs();
loadSiteData();
