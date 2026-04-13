document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("GSAP o ScrollTrigger no están cargados.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  function setRealViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  function refreshLayout() {
    setRealViewportHeight();
    ScrollTrigger.refresh();
  }

  setRealViewportHeight();

  const mm = gsap.matchMedia();

  mm.add(
    {
      mobile: "(max-width: 768px)",
      desktop: "(min-width: 769px)",
    },
    (context) => {
      const { mobile } = context.conditions;

      document.querySelectorAll("[data-parallax-layers]").forEach((triggerElement) => {
        const layers = mobile
          ? [
              { layer: "1", yPercent: 10 },
              { layer: "2", yPercent: 6 },
              { layer: "3", yPercent: 4 },
              { layer: "4", yPercent: 2.5 }
            ]
          : [
              { layer: "1", yPercent: 24 },
              { layer: "2", yPercent: 14 },
              { layer: "3", yPercent: 8 },
              { layer: "4", yPercent: 5 }
            ];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true
          }
        });

        layers.forEach((layerObj, index) => {
          const elements = triggerElement.querySelectorAll(
            `[data-parallax-layer="${layerObj.layer}"]`
          );

          if (!elements.length) return;

          tl.to(
            elements,
            {
              yPercent: layerObj.yPercent,
              ease: "none"
            },
            index === 0 ? 0 : "<"
          );
        });
      });
    }
  );

  const images = Array.from(document.querySelectorAll(".parallax__layer-img"));

  Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();

      return new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    })
  ).then(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        refreshLayout();
      });
    });
  });

  window.addEventListener("load", refreshLayout);
  window.addEventListener("resize", refreshLayout);
  window.addEventListener("pageshow", refreshLayout);
  window.addEventListener("orientationchange", () => {
    setTimeout(refreshLayout, 150);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refreshLayout);
  }

  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      smoothWheel: true,
      syncTouch: true
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }
});