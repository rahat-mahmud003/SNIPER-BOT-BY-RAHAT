(function() {
  if (document.getElementById('sniper-bot-widget')) return;

  // ---- CSS inject ----
  const style = document.createElement('style');
  style.id = 'sniper-bot-style';
  style.innerHTML = `
    @keyframes pulseGlow { ... }
    @keyframes pulseCandle { ... }
    @keyframes smoothFloatChart { ... }
    @keyframes infinityWave { ... }
    @keyframes scanBarMove { ... }
    @keyframes radarPulse { ... }
    /* ...onek CSS (scanner, candles, signal box, buttons etc.)... */
  `;
  document.head.appendChild(style);

  // ---- Floating circle button ----
  const container = document.createElement('div');
  container.id = 'sniper-circle-container';
  container.innerHTML = `
    <div id="sniper-circle-btn" title="Open Sniper Bot">
      <img src="https://i.ibb.co.com/G4nQpq5b/file-00000000eb4c8211ac46799e8ac15fa9.png" alt="Logo">
    </div>
    <div id="sniper-remove-btn" title="Remove Floating Button">✕</div>`;
  document.body.appendChild(container);

  // ---- Main widget ----
  const widget = document.createElement('div');
  widget.id = 'sniper-bot-widget';
  widget.innerHTML = `
    <div class="sb-header" id="sb-header">
      ... "TRADER RAHAT AI SIGNAL QUOTEX" ... clock ...
      <button id="sb-min-btn">-</button>
      <button id="sb-close-btn">×</button>
    </div>
    <div class="sb-body">
      ... "AI ENGINE ONLINE", "VERIFIED: 1" ...
      ... mode buttons: "1m Standard", "5s Auto Mode" ...
      ... fake candle chart + radar/wave animation ...
      ... signal box: "LATEST SIGNAL: READY" ...
      ... timer "--:--:--" ...
      <button id="sb-get-btn">⚡ GET SIGNAL</button>
      ... footer ...
    </div>`;
  document.body.appendChild(widget);

  // ---- Drag logic ----
  function makeDraggable(el, handleEl) {
    let isDragging = false, startX, startY, initialX, initialY;
    function dragStart(e) { ... }
    function dragMove(e) { ... }
    function dragEnd() { ... }
    handleEl.addEventListener('mousedown', dragStart);
    handleEl.addEventListener('touchstart', dragStart, { passive: true });
    return () => isDragging;
  }
  const checkCircleDrag = makeDraggable(container, container);
  makeDraggable(widget, document.getElementById('sb-header'));

  // ---- Open/close widget ----
  document.getElementById('sniper-circle-btn').onclick = function(e) {
    if (!checkCircleDrag()) {
      widget.style.display = (widget.style.display === 'none' || widget.style.display === '') ? 'block' : 'none';
    }
  };

  // ---- Remove everything ----
  document.getElementById('sniper-remove-btn').onclick = function(e) {
    e.stopPropagation();
    container.remove(); widget.remove(); style.remove();
  };

  document.getElementById('sb-close-btn').onclick = () => widget.style.display = 'none';
  document.getElementById('sb-min-btn').onclick   = () => widget.style.display = 'none';

  // ---- Live clock ----
  function updateClock() {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('sb-clock').innerText = `TIME: ${hrs}:${mins}:${secs}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // ---- THE SCAM PART: auto-click trade buttons ----
  let isTradeExecuting = false;
  function executeQuotexTrade(isUp) {
    if (isTradeExecuting) return;
    isTradeExecuting = true;
    try {
      const buttons = document.querySelectorAll('button, div[role="button"]');
      let targetBtn = null;
      for (let btn of buttons) {
        const text = btn.innerText.trim().toUpperCase();
        if (isUp && (text.includes('BUY') || text.includes('HIGHER') || text.includes('CALL'))) {
          targetBtn = btn; break;
        } else if (!isUp && (text.includes('SELL') || text.includes('LOWER') || text.includes('PUT'))) {
          targetBtn = btn; break;
        }
      }
      if (!targetBtn) {
        const selector = isUp
          ? '.btn-call,[class*="call"],.pointer-events-auto.bg-green-600,.bg-green-500'
          : '.btn-put,[class*="put"],.pointer-events-auto.bg-red-600,.bg-red-500';
        targetBtn = document.querySelector(selector);
      }
      if (targetBtn) {
        targetBtn.click(); // 💥 REAL trade click
        console.log("Auto Trade Placed Successfully: " + (isUp ? "UP(BUY)" : "DOWN(SELL)"));
      } else {
        console.log("Quotex Buy/Sell button not found automatically.");
      }
    } catch (err) {
      console.error("Auto trade execution error: ", err);
    }
    setTimeout(() => { isTradeExecuting = false; }, 3000);
  }

  // ---- GET SIGNAL button handler ----
  document.getElementById('sb-get-btn').onclick = function() {
    const btnSelf = this;
    const defaultView      = document.getElementById('sb-default-candles-view');
    const waveView         = document.getElementById('sb-wave-view');
    const analysingText    = document.getElementById('sb-analysing-text');
    const singleCandleView = document.getElementById('sb-single-candle-view');
    const scanHeader       = document.getElementById('sb-scan-header-text');
    const scanBar          = document.getElementById('sb-scan-bar');
    const valEl            = document.getElementById('sb-signal-val');
    const subMsg           = document.getElementById('sb-sub-msg');
    const targetCandle     = document.getElementById('sb-target-candle');
    const arrowBox         = document.getElementById('sb-icon-box');

    btnSelf.disabled = true;
    btnSelf.style.opacity = '0.5';

    // show fake "scanning" animation
    defaultView.style.display = 'none';
    singleCandleView.style.display = 'none';
    waveView.style.display = 'flex';
    analysingText.style.display = 'block';
    scanBar.style.display = 'block';
    scanHeader.innerText = 'AI SIGNAL SCANNER';
    valEl.innerText = 'SCANNING';
    subMsg.innerText = 'Scanning market trends...';

    setTimeout(() => {
      // hide scanning animation
      waveView.style.display = 'none';
      analysingText.style.display = 'none';
      scanBar.style.display = 'none';
      singleCandleView.style.display = 'flex';

      // 🎲 "AI" = coin flip
      const isUp = Math.random() > 0.5;

      valEl.innerText = isUp ? 'UP' : 'DOWN';
      valEl.style.color = isUp ? '#00ff66' : '#ff3366';
      arrowBox.innerText = isUp ? '↑' : '↓';
      arrowBox.style.color = isUp ? '#00ff66' : '#ff3366';

      const now = new Date();
      const targetTimeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

      subMsg.innerText = isUp
        ? `Next candle.. UP candle for ${targetTimeStr}`
        : `Next candle.. DOWN candle for ${targetTimeStr}`;

      const randomHeight = Math.floor(45 + Math.random() * 35);
      targetCandle.className = isUp ? 'sb-big-candle green' : 'sb-big-candle red';
      targetCandle.style.height = randomHeight + 'px';

      // 🔥 auto-click the trade button
      executeQuotexTrade(isUp);

      // 60-second fake countdown
      let seconds = 60;
      const timerEl = document.getElementById('sb-timer');
      timerEl.style.color = '#00ff66';
      const countdown = setInterval(() => {
        seconds--;
        let m = String(Math.floor(seconds / 60)).padStart(2, '0');
        let s = String(seconds % 60).padStart(2, '0');
        timerEl.innerText = `00:${m}:${s}`;
        if (seconds <= 0) {
          clearInterval(countdown);
          timerEl.innerText = '--:--:--';
          timerEl.style.color = '#5c7285';
          valEl.innerText = 'READY';
          valEl.style.color = '#fff';
          subMsg.innerText = 'License verified successfully.';
          singleCandleView.style.display = 'none';
          defaultView.style.display = 'block';
          arrowBox.innerText = '⚡';
          arrowBox.style.color = '#00ff66';
          btnSelf.disabled = false;
          btnSelf.style.opacity = '1';
          btnSelf.innerText = '⚡ GET SIGNAL';
        }
      }, 1000);
    }, 4500); // 4.5s fake "analysis"
  };
})();
