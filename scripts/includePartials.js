// Loads shared HTML modules declared with data-include.
// Supported placeholders:
// - %BASE%: replaced with the include element's data-base value.
// - <!--VIEW_COUNT-->: rendered only when data-view-count="true".
(function () {
  const includeTargets = document.querySelectorAll("[data-include]");

  function renderPartial(target, html) {
    const base = target.dataset.base || "";
    const viewCounter = target.dataset.viewCount === "true"
      ? '<p id="viewCount">載入中...</p>'
      : "";

    target.outerHTML = html
      .split("%BASE%").join(base)
      .replace("<!--VIEW_COUNT-->", viewCounter);
  }

  window.partialsReady = Promise.all(
    Array.from(includeTargets, async (target) => {
      const response = await fetch(target.dataset.include);

      if (!response.ok) {
        throw new Error(`Unable to load partial: ${target.dataset.include}`);
      }

      renderPartial(target, await response.text());
    })
  ).then(() => {
    document.dispatchEvent(new CustomEvent("partials:loaded"));
  }).catch((error) => {
    console.error(error);
    document.dispatchEvent(new CustomEvent("partials:error", { detail: error }));
  });
}());
