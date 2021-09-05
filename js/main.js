gsap.registerPlugin(ScrollTrigger);

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
      "#scroller",
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

// Desktop View
const phoneMockup = () => {
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
};

loadingAnimation();
imgLoad.on("always", function () {
  isLoaded = true;
  if (isLoadingAnimationEnd) entranceAnimation();
  phoneMockup();

  // PRELOADER
  var animation = bodymovin.loadAnimation({
    container: document.getElementById("bm"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "./data.json",
  });

  const scroller = document.querySelector("#scroller");

  const locoScroll = new LocomotiveScroll({
    el: scroller,
    smooth: true,
  });
  // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
  locoScroll.on("scroll", ScrollTrigger.update());

  // tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
  ScrollTrigger.scrollerProxy(scroller, {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },

    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: scroller.style.transform ? "transform" : "fixed",
  });

  ScrollTrigger.defaults({
    scroller: scroller,
  });

  const horizontalSections = gsap.utils.toArray("section.horizontal");

  horizontalSections.forEach(function (sec, i) {
    let thisPinWrap = sec.querySelector(".pin-wrap");
    let thisAnimWrap = thisPinWrap.querySelector(".animation-wrap");

    let getToValue = () => -(thisAnimWrap.scrollWidth - window.innerWidth);

    gsap.fromTo(
      thisAnimWrap,
      {
        x: () =>
          thisAnimWrap.classList.contains(".to-right") ? 0 : getToValue(),
      },
      {
        x: () =>
          thisAnimWrap.classList.contains(".to-right") ? getToValue() : 0,
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          scroller: scroller,
          start: "top top",
          end: () => "+=" + thisAnimWrap.scrollWidth,
          pin: thisPinWrap,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          scrub: true,
        },
      }
    );
  });

  // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
  ScrollTrigger.refresh();

  // const pageContainer = document.querySelector(".container");
  // pageContainer.setAttribute("data-scroll-container", "");

  // const scroller = new LocomotiveScroll({
  //   el: pageContainer,
  //   inertia: 0.8,
  //   smooth: true,
  //   getDirection: true,
  //   mobile: {
  //     smooth: false,
  //     getDirection: true,
  //     inertia: 0,
  //   },
  //   tablet: {
  //     breakpoint: 0,
  //     smooth: false,
  //     getDirection: true,
  //   },
  // });

  // scroller.on("scroll", function (t) {
  //   document.documentElement.setAttribute("data-direction", t.direction);
  // });

  // scroller.on("scroll", ScrollTrigger.update);

  // ScrollTrigger.scrollerProxy(pageContainer, {
  //   scrollTop(value) {
  //     return arguments.length
  //       ? scroller.scrollTo(value, 0, 0)
  //       : scroller.scroll.instance.scroll.y;
  //   },
  //   getBoundingClientRect() {
  //     return {
  //       left: 0,
  //       top: 0,
  //       width: window.innerWidth,
  //       height: window.innerHeight,
  //     };
  //   },
  //   pinType: pageContainer.style.transform ? "transform" : "fixed",
  // });

  // // Pinning and horizontal scrolling

  // let horizontalSections = document.querySelectorAll(".horizontal-scroll");

  // horizontalSections.forEach((horizontalSection) => {
  //   let pinWrap = horizontalSection.querySelector(".pin-wrap");
  //   let pinWrapWidth = pinWrap.offsetWidth;
  //   let horizontalScrollLength = pinWrapWidth - window.innerWidth;
  //   gsap.to(pinWrap, {
  //     scrollTrigger: {
  //       scroller: "[data-scroll-container]",
  //       scrub: true,
  //       trigger: horizontalSection,
  //       pin: true,
  //       start: "top top",
  //       end: () => `+=${pinWrapWidth}`,
  //       invalidateOnRefresh: true,
  //     },

  //     x: -horizontalScrollLength,
  //     ease: "none",
  //   });
  // });

  // /* COLOR CHANGER */

  // const scrollColorElems = document.querySelectorAll("[data-bgcolor]");
  // scrollColorElems.forEach((colorSection, i) => {
  //   const prevBg = i === 0 ? "" : scrollColorElems[i - 1].dataset.bgcolor;
  //   const prevText = i === 0 ? "" : scrollColorElems[i - 1].dataset.textcolor;

  //   ScrollTrigger.create({
  //     trigger: colorSection,
  //     scroller: "[data-scroll-container]",
  //     start: "top 50%",
  //     onEnter: () =>
  //       gsap.to("body", {
  //         backgroundColor: colorSection.dataset.bgcolor,
  //         color: colorSection.dataset.textcolor,
  //         overwrite: "auto",
  //       }),

  //     onLeaveBack: () =>
  //       gsap.to("body", {
  //         backgroundColor: prevBg,
  //         color: prevText,
  //         overwrite: "auto",
  //       }),
  //   });
  // });

  // ScrollTrigger.addEventListener("refresh", () => scroller.update());

  // ScrollTrigger.refresh();
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

// Add Year Automatically To Footer
const d = new Date();
const n = d.getFullYear();
document.getElementById("date").innerHTML = n;
