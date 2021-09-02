// PRELOADER
var animation = bodymovin.loadAnimation({
  container: document.getElementById("bm"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "./data.json",
});

const images = document.querySelectorAll("img");
let isLoaded = false;
let isLoadingAnimationEnd = false;
const imgLoad = imagesLoaded(images);

const entranceAnimation = () => {
  const tl = gsap.timeline();
  tl.to("#bm", {
    y: -100,
    duration: 1,
    ease: "power2.inOut",
  })
    .to(
      ".loading",
      {
        yPercent: -100,
        duration: 1.25,
        ease: "power4.inOut",
      },
      0
    )
    .to(
      ".content",
      {
        duration: 1,
        opacity: 1,
        y: 0,
        stagger: 0.1,
        ease: "power2.out",
      },
      0.6
    );
};

const loadingAnimation = () => {
  const tl = gsap
    .timeline({
      onComplete: () => {
        isLoadingAnimationEnd = true;
        if (isLoaded) entranceAnimation();
      },
    })
    .from(
      "#bm",
      {
        y: 80,
        duration: 1,
        ease: "power2.out",
      },
      0.5
    );
};

loadingAnimation();
imgLoad.on("always", function () {
  isLoaded = true;
  if (isLoadingAnimationEnd) entranceAnimation();

  gsap.registerPlugin(ScrollTrigger);

  const pageContainer = document.querySelector(".container");
  pageContainer.setAttribute("data-scroll-container", "");

  const scroller = new LocomotiveScroll({
    el: pageContainer,
    inertia: 0.8,
    smooth: true,
    getDirection: true,
    smartphone: {
      smooth: true,
      getDirection: true,
      inertia: 0.8,
    },
    tablet: {
      breakpoint: 0,
      smooth: false,
      getDirection: true,
    },
  });

  scroller.on("scroll", function (t) {
    document.documentElement.setAttribute("data-direction", t.direction);
  });

  scroller.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(pageContainer, {
    scrollTop(value) {
      return arguments.length
        ? scroller.scrollTo(value, 0, 0)
        : scroller.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: pageContainer.style.transform ? "transform" : "fixed",
  });

  // Pinning and horizontal scrolling

  let horizontalSections = document.querySelectorAll(".horizontal-scroll");

  horizontalSections.forEach((horizontalSection) => {
    let pinWrap = horizontalSection.querySelector(".pin-wrap");
    let pinWrapWidth = pinWrap.offsetWidth;
    let horizontalScrollLength = pinWrapWidth - window.innerWidth;
    gsap.to(pinWrap, {
      scrollTrigger: {
        scroller: "[data-scroll-container]",
        scrub: true,
        trigger: horizontalSection,
        pin: true,
        start: "top top",
        end: () => `+=${pinWrapWidth}`,
        invalidateOnRefresh: true,
      },

      x: -horizontalScrollLength,
      ease: "none",
    });
  });

  /* COLOR CHANGER */

  const scrollColorElems = document.querySelectorAll("[data-bgcolor]");
  scrollColorElems.forEach((colorSection, i) => {
    const prevBg = i === 0 ? "" : scrollColorElems[i - 1].dataset.bgcolor;
    const prevText = i === 0 ? "" : scrollColorElems[i - 1].dataset.textcolor;

    ScrollTrigger.create({
      trigger: colorSection,
      scroller: "[data-scroll-container]",
      start: "top 50%",
      onEnter: () =>
        gsap.to("body", {
          backgroundColor: colorSection.dataset.bgcolor,
          color: colorSection.dataset.textcolor,
          overwrite: "auto",
        }),

      onLeaveBack: () =>
        gsap.to("body", {
          backgroundColor: prevBg,
          color: prevText,
          overwrite: "auto",
        }),
    });
  });

  ScrollTrigger.addEventListener("refresh", () => scroller.update());

  ScrollTrigger.refresh();

  update();
});

// SLIDER FOR SCREENSHOT SECTION ON MOBILE
const slider = document.querySelector(".items");
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener("mousedown", (e) => {
  isDown = true;
  slider.classList.add("active");
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});
slider.addEventListener("mouseleave", () => {
  isDown = false;
  slider.classList.remove("active");
});
slider.addEventListener("mouseup", () => {
  isDown = false;
  slider.classList.remove("active");
});
slider.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 3; //scroll-fast
  slider.scrollLeft = scrollLeft - walk;
});

// Desktop View

// Adding scene to a app
const app = new SpeRuntime.Application();
app.start("../scene.json");

// Disable Scroll on container of scene and on scene
const disableScroll = () => {
  const mockupContainer = document.querySelector("#mockup-container");
  mockupContainer.scrollTo(0, 0);
  mockupContainer.style.overflow = "hidden";
};

disableScroll();

// Add Year Automatically To Footer
const d = new Date();
const n = d.getFullYear();
document.getElementById("date").innerHTML = n;
