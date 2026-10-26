/* ---------- Data ---------- */
const PRODUCTS = [
  { id: 1, name: "CüS Velocity Runner", price: 8999,  img: "assets/img/footwear.jpg",  tag: "Bestseller" },
  { id: 2, name: "CüS Chrono Classic",  price: 14999, img: "assets/img/watch.jpg",     tag: "Limited" },
  { id: 3, name: "CüS Leather Bomber",  price: 12999, img: "assets/img/outerwear.jpg", tag: "New" },
  { id: 4, name: "CüS Luxe Dress",      price: 7999,  img: "assets/img/women.jpg",     tag: "Trending" },
];
const inr = n => "₹" + n.toLocaleString("en-IN");
let cart = [];

/* ---------- Render products ---------- */
const grid = document.getElementById("products");
grid.innerHTML = PRODUCTS.map(p => `
  <article class="card glass tilt reveal">
    <span class="tag glass">${p.tag}</span>
    <div class="img" style="--img:url(${p.img})"></div>
    <h4>${p.name}</h4>
    <div class="price">${inr(p.price)}</div>
    <button class="add" data-id="${p.id}">Add to bag</button>
  </article>`).join("");

/* ---------- Cart ---------- */
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const toggleCart = open => {
  drawer.classList.toggle("open", open);
  overlay.classList.toggle("open", open);
};
document.getElementById("cartBtn").onclick = () => toggleCart(true);
document.getElementById("closeCart").onclick = () => toggleCart(false);
overlay.onclick = () => toggleCart(false);

function renderCart() {
  const box = document.getElementById("cartItems");
  box.innerHTML = cart.length
    ? cart.map((p, i) => `
      <div class="ci">
        <div class="t" style="--img:url(${p.img})"></div>
        <div><h5>${p.name}</h5><small>${inr(p.price)}</small></div>
        <button data-rm="${i}">Remove</button>
      </div>`).join("")
    : `<p class="empty">Your bag is empty.</p>`;
  document.getElementById("cartCount").textContent = cart.length;
  document.getElementById("cartTotal").textContent = inr(cart.reduce((s, p) => s + p.price, 0));
  if (window.gsap) gsap.fromTo(".ci", { x: 30, opacity: 0 }, { x: 0, opacity: 1, stagger: .08, duration: .5 });
}
grid.addEventListener("click", e => {
  const b = e.target.closest(".add"); if (!b) return;
  cart.push(PRODUCTS.find(p => p.id == b.dataset.id));
  renderCart(); toggleCart(true);
});
document.getElementById("cartItems").addEventListener("click", e => {
  const r = e.target.closest("[data-rm]"); if (!r) return;
  cart.splice(r.dataset.rm, 1); renderCart();
});
renderCart();

/* ---------- Mobile menu ---------- */
const burger = document.getElementById("burger"), mm = document.getElementById("mobileMenu");
burger.onclick = () => { burger.classList.toggle("open"); mm.classList.toggle("open"); };
mm.querySelectorAll("a").forEach(a => a.onclick = () => { burger.classList.remove("open"); mm.classList.remove("open"); });

/* ---------- Newsletter ---------- */
document.getElementById("newsForm").addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("newsMsg").textContent = "Welcome to the inner circle ✦";
  e.target.reset();
});

/* ---------- Split text into characters ---------- */
document.querySelectorAll(".split .ln").forEach(line => {
  line.innerHTML = [...line.textContent].map(c => `<span class="ch">${c}</span>`).join("");
});

/* ---------- Animations ---------- */
if (!window.gsap) {
  document.body.classList.add("no-js");
  document.querySelector(".loader").remove();
} else {
  gsap.registerPlugin(ScrollTrigger);

  // Loader → hero intro
  const intro = gsap.timeline();
  intro
    .to(".loader-bar span", { scaleX: 1, duration: 1.1, ease: "power2.inOut" })
    .to(".loader-logo", { y: -20, opacity: 0, duration: .5 })
    .to(".loader", { yPercent: -100, duration: .9, ease: "power4.inOut" })
    .from(".nav", { y: -80, opacity: 0, duration: .8, ease: "power3.out" }, "-=.3")
    .from(".hero-bg", { scale: 1.25, duration: 2, ease: "power2.out" }, "<")
    .to(".hero .eyebrow", { opacity: 1, y: 0, duration: .6 }, "-=1.5")
    .to(".hero .ch", { y: 0, duration: 1, stagger: .035, ease: "power4.out" }, "-=1.2")
    .to(".hero .lead, .hero .btn", { opacity: 1, y: 0, duration: .8, stagger: .15 }, "-=.6")
    .from(".hero-card", { x: 80, opacity: 0, duration: .9, ease: "power3.out" }, "-=.6");

  // Scroll reveals (skip hero ones, handled above)
  gsap.utils.toArray(".reveal").forEach(el => {
    if (el.closest(".hero")) return;
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
      delay: (el.parentElement.children && [...el.parentElement.children].indexOf(el)) * 0.08 || 0
    });
  });

  // Parallax backgrounds
  document.querySelectorAll("[data-parallax]").forEach(el => {
    gsap.to(el, {
      yPercent: parseFloat(el.dataset.parallax) * 40, ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    });
  });

  // Counters
  document.querySelectorAll("[data-count]").forEach(el => {
    const end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: () => gsap.to(o, {
        v: end, duration: 2, ease: "power2.out",
        onUpdate: () => el.textContent = o.v.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec })
      })
    });
  });

  // Story heading line-by-line feel
  gsap.from(".story-card h2", {
    clipPath: "inset(0 0 100% 0)", y: 30, duration: 1.2, ease: "power4.out",
    scrollTrigger: { trigger: ".story", start: "top 60%" }
  });
}

/* ---------- Navbar scroll state ---------- */
const nav = document.getElementById("nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 40), { passive: true });

/* ---------- 3D tilt cards ---------- */
document.addEventListener("mousemove", e => {
  document.querySelectorAll(".tilt:hover").forEach(card => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
  });
});
document.querySelectorAll(".tilt").forEach(c =>
  c.addEventListener("mouseleave", () => c.style.transform = ""));

/* ---------- Magnetic buttons ---------- */
document.querySelectorAll(".magnetic").forEach(btn => {
  btn.addEventListener("mousemove", e => {
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
  });
  btn.addEventListener("mouseleave", () => btn.style.transform = "");
});

/* ---------- Custom cursor ---------- */
const cur = document.querySelector(".cursor");
let cx = 0, cy = 0, tx = 0, ty = 0;
addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; });
(function loop() {
  cx += (tx - cx) * .18; cy += (ty - cy) * .18;
  cur.style.left = cx + "px"; cur.style.top = cy + "px";
  requestAnimationFrame(loop);
})();
document.querySelectorAll("a,button,.tilt,input").forEach(el => {
  el.addEventListener("mouseenter", () => cur.classList.add("hover"));
  el.addEventListener("mouseleave", () => cur.classList.remove("hover"));
});