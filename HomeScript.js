document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("GSAP o ScrollTrigger no están cargados.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

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
              { layer: "1", yPercent: 14 },
              { layer: "2", yPercent: 8 },
              { layer: "3", yPercent: 5 },
              { layer: "4", yPercent: 3 }
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