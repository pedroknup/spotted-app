export function setup() {
  const _C = document.querySelector(".nav-container"),
    N = _C.children.length,
    _title = document.querySelector(".title");
  let i = 0,
    x0 = null,
    locked = false,
    w;
  w = window.innerWidth;
  _C.style.setProperty("--n", N);

  addEventListener("resize", size, false);
  _C.addEventListener(
    "mousedown",
    e => {
      x0 = unify(e).clientX;
      const _C = document.querySelector(".nav-container");
      _C.classList.toggle("smooth", !(locked = true));
      //   _title.classList.toggle("invisible");
    },
    false
  );
  _C.addEventListener(
    "touchstart",
    e => {
      x0 = unify(e).clientX;
      const _C = document.querySelector(".nav-container");
      _C.classList.toggle("smooth", !(locked = true));
      //   _title.classList.toggle("invisible");
    },
    false
  );
  _C.addEventListener(
    "mousemove",
    e => {
    //   e.preventDefault();
      const _C = document.querySelector(".nav-container");
      let dx = unify(e).clientX - x0,
        s = Math.sign(dx),
        f = +((s * dx) / w).toFixed(2);
      if (s !== 1) return;
      if (locked) {
        _C.style.setProperty("--tx", `${Math.round(unify(e).clientX - x0)}px`);
      }
    },
    false
  );
  _C.addEventListener(
    "touchmove",
    e => {
    //   e.preventDefault();
      const _C = document.querySelector(".nav-container");
      let dx = unify(e).clientX - x0,
        s = Math.sign(dx),
        f = +((s * dx) / w).toFixed(2);
      if (s !== 1) return;
      if (locked) {
        _C.style.setProperty("--tx", `${Math.round(unify(e).clientX - x0)}px`);
      }
    },
    false
  );
  _C.addEventListener(
    "mouseup",
    e => {
      const _C = document.querySelector(".nav-container");
      if (locked) {
        let dx = unify(e).clientX - x0,
          s = Math.sign(dx),
          f = +((s * dx) / w).toFixed(2);
        if (i > 0 && s == 1 && (i < N - 1 || s > 0) && f > 0.2) {
          _C.style.setProperty("--i", (i -= s));
          f = 1 - f;
        }
        // var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        // const handicap = w / 2;
        _C.style.setProperty("--tx", "0px");
        _C.style.setProperty("--f", f);
        _C.classList.toggle("smooth", !(locked = false));
        setTimeout(() => {
          //   _title.classList.toggle("invisible");
        }, 500);
        x0 = null;
      }
    },
    false
  );
  _C.addEventListener(
    "touchend",
    e => {
      if (locked) {
        let dx = unify(e).clientX - x0,
          s = Math.sign(dx),
          f = +((s * dx) / w).toFixed(2);
        if (i > 0 && s == 1 && (i < N - 1 || s > 0) && f > 0.2) {
          _C.style.setProperty("--i", (i -= s));
          f = 1 - f;
        }
        // var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        // const handicap = w / 2;
        _C.style.setProperty("--tx", "0px");
        _C.style.setProperty("--f", f);
        _C.classList.toggle("smooth", !(locked = false));
        setTimeout(() => {
          _title.classList.toggle("invisible");
        }, 500);
        x0 = null;
      }
    },
    false
  );
}
function unify(e) {
  return e.changedTouches ? e.changedTouches[0] : e;
}
function lock(e) {
  x0 = unify(e).clientX;
  _C.classList.toggle("smooth", !(locked = true));
  _title.classList.toggle("invisible");
}
function size() {
  w = window.innerWidth;
}
