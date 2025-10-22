
$(".slick-end").slick({
  lazyLoad: "ondemand",
  arrows: false,
  dots: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
});

document.addEventListener("DOMContentLoaded", function () {
  const lazyImages = document.querySelectorAll("img[data-src]");
  const slides = document.querySelectorAll(".slick-slide img");
  const dots = document.querySelectorAll(".slick-dots li");

  // Função que carrega uma imagem
  const loadImage = (img) => {
    const src = img.getAttribute("data-src");
    if (!src) return;
    img.src = src;
    img.removeAttribute("data-src");
  };

  // Lazy load automático (IntersectionObserver)
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage(entry.target);
          obs.unobserve(entry.target);
        }
      });
    });
    lazyImages.forEach(img => observer.observe(img));
  } else {
    lazyImages.forEach(img => loadImage(img));
  }

  // Função para mostrar imagem pelo índice
  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      const parent = slide.closest(".slick-slide");
      if (i === index) {
        // Carrega imagem se ainda estiver em data-src
        if (slide.dataset.src) loadImage(slide);
        parent.classList.add("slick-active", "slick-current");
        parent.setAttribute("aria-hidden", "false");
        slide.style.display = "inline-block";
      } else {
        parent.classList.remove("slick-active", "slick-current");
        parent.setAttribute("aria-hidden", "true");
        slide.style.display = "none";
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("slick-active", i === index);
    });
  };

  // Inicializa na primeira imagem
  let currentIndex = 0;
  showSlide(currentIndex);

  // Clique nos dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      showSlide(currentIndex);
    });
  });
});

