
var CONFIG = {
  whatsapp: "5542999837545", 
  hours: " Segunda a Sexta-feira: 08:00 às 18:00ㅤㅤㅤㅤㅤㅤSábado: 08:00 às 12:00" ,
  address: " R. João Betega, 1896 - Centro,ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤSão Mateus do Sul - PR",  
  cro: "",       
  instagram: "https://www.instagram.com/aura.clinica/"
};

(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };


  function fmtPhone(n) {
    var d = String(n).replace(/\D/g, "");
    if (d.length === 13) return "+" + d.slice(0, 2) + " (" + d.slice(2, 4) + ") " + d.slice(4, 9) + "-" + d.slice(9);
    return n;
  }
  ["whatsapp", "hours",  "address", "cro"].forEach(function (k) {
    if (!CONFIG[k]) return;
    $$('[data-cfg="' + k + '"]').forEach(function (el) { el.hidden = false; });
    $$('[data-fill="' + k + '"]').forEach(function (el) { el.textContent = k === "whatsapp" ? fmtPhone(CONFIG[k]) : CONFIG[k]; });
  });
  $("#year").textContent = new Date().getFullYear();

  /* Menu mobile */
  var menuBtn = $("#menuBtn"), nav = $("#nav");
  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }); });

  /* Tratamentos: marca o interesse e leva ao formulário */
  $$(".treat button").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-interest");
      $$('#interestChips input').forEach(function (i) { if (i.value === v) i.checked = true; });
      $("#agendar").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      setTimeout(function () { var n = $("#nome"); if (n) n.focus({ preventScroll: true }); }, 450);
    });
  });

  /* Mensagem de agendamento */
  function buildMessage() {
    var nome = $("#nome").value.trim();
    var obs = $("#obs").value.trim();
    var periodo = $("#periodo").value;
    var interests = $$('#interestChips input:checked').map(function (i) { return i.value; });
    var m = "Olá, equipe da Aura! " + (nome ? "Meu nome é " + nome + ". " : "") +
      "Gostaria de agendar uma avaliação" +
      (interests.length ? " e tenho interesse em: " + interests.join(", ") : "") + ". " +
      "Prefiro atendimento no período da " + (periodo === "qualquer período" ? "manhã ou da tarde" : periodo) + "." +
      (obs ? " " + obs + (/[.!?]$/.test(obs) ? "" : ".") : "") +
      " Pode me informar os horários disponíveis?";
    return { text: m, count: interests.length };
  }
  function chatUrl(text) {
    var n = String(CONFIG.whatsapp || "").replace(/\D/g, "");
    if (n) return "https://wa.me/" + n + "?text=" + encodeURIComponent(text);
    return CONFIG.instagram;
  }

  var form = $("#leadForm"), result = $("#result"), err = $("#formErr"), status = $("#copyStatus");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var built = buildMessage();
    if (!built.count) { err.textContent = "Marque pelo menos um tratamento para continuarmos."; return; }
    err.textContent = "";
    $("#msgPreview").textContent = built.text;
    var link = $("#openChat");
    link.href = chatUrl(built.text);
    link.textContent = CONFIG.whatsapp ? "Abrir WhatsApp" : "Abrir Instagram da Aura";
    status.textContent = CONFIG.whatsapp ? "" : "Copie a mensagem e cole no direct do Instagram.";
    result.hidden = false;
    result.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
  $$("#interestChips input").forEach(function (i) { i.addEventListener("change", function () { if ($$('#interestChips input:checked').length) err.textContent = ""; }); });

  $("#copyMsg").addEventListener("click", function () {
    var text = $("#msgPreview").textContent;
    function fallback() {
      var r = document.createRange(); r.selectNodeContents($("#msgPreview"));
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      status.textContent = "Mensagem selecionada. Copie e cole na conversa.";
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { status.textContent = "Mensagem copiada."; }, fallback);
    } else { fallback(); }
  });

  /* Botão flutuante aparece depois da abertura e some no formulário */
  var floatCta = $("#floatCta"), hero = $(".band-hero"), book = $("#agendar");
  function updateFloat() {
    var pastHero = hero.getBoundingClientRect().bottom < 0;
    var br = book.getBoundingClientRect();
    var inBook = br.top < window.innerHeight * 0.8 && br.bottom > 0;
    floatCta.hidden = !(pastHero && !inBook);
  }
  window.addEventListener("scroll", updateFloat, { passive: true });
  window.addEventListener("resize", updateFloat);
  updateFloat();
})();
