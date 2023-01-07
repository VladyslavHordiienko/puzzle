const shuffle = ([...arr]) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
};

function timer3(h) {
  var j, k, i = h,
    g = setInterval(function () {
      (j = parseInt(i / 60, 10)),
        (k = parseInt(i % 60, 10)),
        (k = 10 > k ? "0" + k : k),
        $("#timer3").text(j + ":" + k),
        --i < 0 && clearInterval(g);
    }, 1000);
}

function d(h) {
  var j, k, i = h,
    g = setInterval(function () {
      j = parseInt(i / 60, 10), k = parseInt(i % 60, 10), k = 10 > k ? "0" + k : k, $("#timer2").text(j + " " + minutos_y + k + " " + segundos), --i < 0 && (clearInterval(g));
    }, 1000);
}

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

let firstTry = false;
let documentWidth = (document.body.clientWidth - 55);
if (documentWidth > 420) {
  documentWidth = 420;
}

class Puzzle {
  constructor(el, row = 3, col = 3, width = documentWidth, height = documentWidth, gap = 1) {
    this.el = el;
    this.fragments = el.children;
    this.width = width;
    this.height = height;
    this.row = row;
    this.col = col;
    this.gap = gap;
  }

  // 创建拼图
  create() {
    this.ids = [...Array(this.row * this.col).keys()];
    const puzzle = this.el;
    const fragments = this.fragments;
    if (fragments.length) {
      Array.from(fragments).forEach((item) => item.remove());
    }
    puzzle.style.setProperty("--puzzle-width", this.width + "px");
    puzzle.style.setProperty("--puzzle-height", this.height + "px");
    puzzle.style.setProperty("--puzzle-row", this.row);
    puzzle.style.setProperty("--puzzle-col", this.col);
    puzzle.style.setProperty("--puzzle-gap", this.gap + "px");
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        const fragment = document.createElement("div");
        fragment.className = "fragment";
        fragment.style.setProperty("--x", j);
        fragment.style.setProperty("--y", i);
        fragment.style.setProperty("--i", j + i * this.col);
        puzzle.appendChild(fragment);
      }
    }
  }

  // 碎片重新排序
  reorder(newIds) {
    const fragments = this.fragments;
    for (let id = 0; id < this.ids.length; id++) {
      fragments[id].style.setProperty("--order", newIds[id]);
    }
  }

  // 打乱拼图
  shuffle() {
    const shuffledIds = shuffle(this.ids);
    this.reorder(shuffledIds);
  }
}

class Sortable {
  constructor(el, total) {
    let that = this;
    this.el = el;
    this.total = total;
    this.riseAnime = gsap.to(el, {
      boxShadow: "0 16px 32px rgba(0,0,0,0.3)",
      scale: 1.1,
      duration: 0.3,
      paused: true,
    });
    this.draggie = new Draggable(el, {
      onDragStart: function () {
        that.riseAnime.play();
        if (!firstTry) {
          timer3(60);
          firstTry = true;
        }
      },
      onRelease: function () {
        that.riseAnime.reverse();
        const total = that.total;
        let hitTargets = [];
        for (const item of total) {
          if (this.hitTest(item, "70%")) {
            hitTargets.push(item);
          }
        }
        if (hitTargets.length === 1) {
          const target = this.target;
          const hitTarget = hitTargets[0];
          const targetOrder = target.style.getPropertyValue("--order");
          const hitTargetOrder = hitTarget.style.getPropertyValue("--order");
          target.style.setProperty("--order", hitTargetOrder);
          hitTarget.style.setProperty("--order", targetOrder);
          gsap.to(target, {
            x: 0,
            y: 0,
            duration: 0,
          });
        } else {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.3,
          });
        }
        const orders = Array.from(that.total).map((item) => item.style.getPropertyValue("--order"));
        const ids = Array.from(that.total).map((item) => item.style.getPropertyValue("--i"));
        if (orders.toString() === ids.toString()) {
          document.querySelector(".puzzle").style.setProperty("border-color", "#00ff00");
          document.getElementById("firework").style.display = "block";
          setTimeout(() => {
            jQuery("#p_modal3").modal(modalOptions);
            document.getElementById("firework").style.display = "none";
            if (jQuery("#timer2").length >= 1) { d(2 * 60); }
          }, 3000);
        }
      },
    });
  }
}
// const puzzle = new Puzzle(document.querySelector(".puzzle"));

const start = (puzzle) => {
  puzzle.create();
  puzzle.shuffle();
  const fragments = puzzle.fragments;
  const sortables = Array.from(fragments).map((item) => new Sortable(item, fragments));


};

// start();
