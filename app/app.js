// DealHound — search, filter, sort and detail views. No network requests.
// All data lives in data.js. Runs from static files.
(function () {
  "use strict";

  var CATEGORIES = ["Tech", "Gaming", "Toys", "Beauty", "Home & Kitchen", "Appliances"];
  var TILE = { "Tech": "Te", "Gaming": "Ga", "Toys": "To", "Beauty": "Be", "Home & Kitchen": "Ho", "Appliances": "Ap" };
  var TILE_CLASS = { "Tech": "tech", "Gaming": "gaming", "Toys": "toys", "Beauty": "beauty", "Home & Kitchen": "home", "Appliances": "appliances" };
  var VERDICT_CLASS = { "NEW LOW": "v-newlow", "STRONG": "v-strong", "GOOD": "v-good", "ROUTINE": "v-routine" };

  var state = { q: "", category: "All", store: "", minDiscount: 0, sort: "pct" };

  var els = {
    q: document.getElementById("q"),
    cats: document.getElementById("cats"),
    store: document.getElementById("store"),
    discount: document.getElementById("discount"),
    sort: document.getElementById("sort"),
    count: document.getElementById("count"),
    grid: document.getElementById("grid"),
    detail: document.getElementById("detail"),
    cdTime: document.getElementById("cd-time")
  };

  function money(n) {
    var s = n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return "$" + s;
  }
  function pct(d) { return Math.round((d.usual - d.sale) / d.usual * 100); }
  function saved(d) { return d.usual - d.sale; }

  function badge(d) {
    var b = document.createElement("span");
    b.className = "badge " + VERDICT_CLASS[d.verdict];
    b.textContent = d.verdict;
    return b;
  }

  function makeCard(d) {
    var a = document.createElement("a");
    a.className = "card";
    a.href = "#/deal/" + d.id;

    var top = document.createElement("div");
    top.className = "card-top";
    var tile = document.createElement("span");
    tile.className = "tile " + TILE_CLASS[d.category];
    tile.textContent = TILE[d.category];
    tile.setAttribute("aria-hidden", "true");
    var head = document.createElement("div");
    var cat = document.createElement("div");
    cat.className = "card-cat";
    cat.textContent = d.category;
    var h = document.createElement("h3");
    h.textContent = d.name;
    head.appendChild(cat);
    head.appendChild(h);
    top.appendChild(tile);
    top.appendChild(head);
    top.appendChild(badge(d));
    a.appendChild(top);

    var prices = document.createElement("div");
    prices.className = "prices";
    var sale = document.createElement("span");
    sale.className = "sale";
    sale.textContent = money(d.sale);
    var usual = document.createElement("span");
    usual.className = "usual";
    usual.textContent = money(d.usual);
    var save = document.createElement("span");
    save.className = "save";
    save.textContent = "Save " + money(saved(d)) + " (" + pct(d) + "% off)";
    prices.appendChild(sale);
    prices.appendChild(usual);
    prices.appendChild(save);
    a.appendChild(prices);

    var blurb = document.createElement("p");
    blurb.className = "blurb";
    blurb.textContent = d.blurb;
    a.appendChild(blurb);

    var foot = document.createElement("div");
    foot.className = "card-foot";
    var store = document.createElement("span");
    store.className = "store";
    store.textContent = d.store;
    var checked = document.createElement("span");
    checked.className = "checked";
    checked.textContent = "Checked " + d.checked;
    foot.appendChild(store);
    foot.appendChild(checked);
    a.appendChild(foot);

    var view = document.createElement("span");
    view.className = "view";
    view.textContent = "View deal at " + d.store;
    a.appendChild(view);

    return a;
  }

  function filtered() {
    var q = state.q.trim().toLowerCase();
    var list = DEALS.filter(function (d) {
      if (state.category !== "All" && d.category !== state.category) return false;
      if (state.store && d.store !== state.store) return false;
      if (pct(d) < state.minDiscount) return false;
      if (q) {
        var hay = (d.name + " " + d.store + " " + d.category + " " + d.blurb).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
    if (state.sort === "pct") list.sort(function (a, b) { return pct(b) - pct(a); });
    else if (state.sort === "save") list.sort(function (a, b) { return saved(b) - saved(a); });
    else if (state.sort === "price-asc") list.sort(function (a, b) { return a.sale - b.sale; });
    else if (state.sort === "price-desc") list.sort(function (a, b) { return b.sale - a.sale; });
    return list;
  }

  function render() {
    var list = filtered();
    els.grid.textContent = "";
    if (list.length === 0) {
      var empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "No deals match that search. Try a different word, store or discount.";
      els.grid.appendChild(empty);
    } else {
      list.forEach(function (d) { els.grid.appendChild(makeCard(d)); });
    }
    var total = DEALS.length;
    els.count.innerHTML = "";
    var strong = document.createElement("strong");
    strong.textContent = list.length + " of " + total + " deals";
    els.count.appendChild(strong);
    els.count.appendChild(document.createTextNode(
      list.length === total
        ? " — sorted by " + sortLabel() + "."
        : " match your filters — sorted by " + sortLabel() + "."
    ));
  }

  function sortLabel() {
    if (state.sort === "pct") return "biggest % off";
    if (state.sort === "save") return "biggest $ saving";
    if (state.sort === "price-asc") return "lowest price";
    return "highest price";
  }

  function showDetail(id) {
    var d = null;
    DEALS.forEach(function (x) { if (x.id === id) d = x; });
    if (!d) { showGrid(); return; }
    els.grid.hidden = true;
    els.count.hidden = true;
    els.detail.hidden = false;
    els.detail.textContent = "";

    var back = document.createElement("button");
    back.className = "back";
    back.type = "button";
    back.textContent = "← Back to all deals";
    back.addEventListener("click", function () { location.hash = ""; });
    els.detail.appendChild(back);

    var h = document.createElement("h2");
    h.textContent = d.name;
    els.detail.appendChild(h);

    var meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = d.category + " · " + d.store + " · Checked " + d.checked;
    els.detail.appendChild(meta);

    var prices = document.createElement("div");
    prices.className = "prices";
    var sale = document.createElement("span");
    sale.className = "sale";
    sale.textContent = money(d.sale);
    var usual = document.createElement("span");
    usual.className = "usual";
    usual.textContent = "usual " + money(d.usual);
    var save = document.createElement("span");
    save.className = "save";
    save.textContent = "You save " + money(saved(d)) + " (" + pct(d) + "% off)";
    prices.appendChild(sale);
    prices.appendChild(usual);
    prices.appendChild(save);
    els.detail.appendChild(prices);
    els.detail.appendChild(badge(d));

    var blurb = document.createElement("p");
    blurb.textContent = d.blurb;
    els.detail.appendChild(blurb);

    var vb = document.createElement("div");
    vb.className = "verdict-box";
    var vh = document.createElement("h3");
    vh.textContent = "Is it really a deal? " + d.verdict;
    var vp = document.createElement("p");
    vp.textContent = d.verdictNote;
    vb.appendChild(vh);
    vb.appendChild(vp);
    els.detail.appendChild(vb);

    if (d.compare) {
      var cb = document.createElement("div");
      cb.className = "compare";
      var ch = document.createElement("h3");
      ch.textContent = "Same product, another store";
      var cp = document.createElement("p");
      cp.textContent = d.compare;
      cb.appendChild(ch);
      cb.appendChild(cp);
      els.detail.appendChild(cb);
    }

    var cta = document.createElement("div");
    cta.className = "cta";
    var link = document.createElement("a");
    link.href = d.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "View this deal at " + d.store + " ↗";
    cta.appendChild(link);
    els.detail.appendChild(cta);

    var src = document.createElement("p");
    src.className = "src";
    src.textContent = "Price checked " + d.checked + " at " + d.store + ". Source: " + d.source +
      ". Prices can change — the store's price at checkout is the final word.";
    els.detail.appendChild(src);

    window.scrollTo(0, 0);
  }

  function showGrid() {
    els.detail.hidden = true;
    els.grid.hidden = false;
    els.count.hidden = false;
    render();
  }

  function route() {
    var m = location.hash.match(/^#\/deal\/([a-z0-9-]+)$/);
    if (m) showDetail(m[1]);
    else showGrid();
  }

  function buildCats() {
    var all = document.createElement("button");
    all.type = "button";
    all.className = "chip on";
    all.textContent = "All";
    all.addEventListener("click", function () { setCategory("All", all); });
    els.cats.appendChild(all);
    CATEGORIES.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = c;
      b.addEventListener("click", function () { setCategory(c, b); });
      els.cats.appendChild(b);
    });
  }

  function setCategory(c, btn) {
    state.category = c;
    var chips = els.cats.querySelectorAll(".chip");
    for (var i = 0; i < chips.length; i++) chips[i].classList.remove("on");
    btn.classList.add("on");
    render();
  }

  function buildStores() {
    var seen = {};
    DEALS.forEach(function (d) {
      if (!seen[d.store]) {
        seen[d.store] = true;
        var o = document.createElement("option");
        o.value = d.store;
        o.textContent = d.store;
        els.store.appendChild(o);
      }
    });
  }

  // Countdown to the end of Cyber Monday (midnight EST, 1 Dec 2026).
  var CYBER_END = new Date("2026-12-01T05:00:00Z").getTime();
  function tick() {
    var diff = CYBER_END - Date.now();
    if (diff <= 0) { els.cdTime.textContent = "Sale over — check back next year"; return; }
    var days = Math.floor(diff / 86400000);
    var hrs = Math.floor(diff % 86400000 / 3600000);
    var min = Math.floor(diff % 3600000 / 60000);
    var sec = Math.floor(diff % 60000 / 1000);
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    els.cdTime.textContent = days + "d " + pad(hrs) + "h " + pad(min) + "m " + pad(sec) + "s";
  }

  els.q.addEventListener("input", function () { state.q = els.q.value; render(); });
  els.store.addEventListener("change", function () { state.store = els.store.value; render(); });
  els.discount.addEventListener("change", function () { state.minDiscount = parseInt(els.discount.value, 10); render(); });
  els.sort.addEventListener("change", function () { state.sort = els.sort.value; render(); });
  window.addEventListener("hashchange", route);

  buildCats();
  buildStores();
  tick();
  setInterval(tick, 1000);
  route();
})();
