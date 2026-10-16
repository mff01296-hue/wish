/* ===================================================
   TINY BIRTHDAY SURPRISE - LOGIC & INTERACTION
   Accurately recreating the @template_diary viral reel
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const screens = {
    screenCupid: document.getElementById('screenCupid'),
    screen1: document.getElementById('screen1'),
    screenAngry: document.getElementById('screenAngry'),
    screenGood: document.getElementById('screenGood'),
    screenBday: document.getElementById('screenBday'),
    screenEnvelope: document.getElementById('screenEnvelope'),
    screenLetter: document.getElementById('screenLetter'),
    screenPolaroids: document.getElementById('screenPolaroids'),
    screenSurprise: document.getElementById('screenSurprise'),
    screenForever: document.getElementById('screenForever'),
    screenVirtualHug: document.getElementById('screenVirtualHug'),
  };

  // Audio Elements
  const bgMusic = document.getElementById('bgMusic');
  const audioControl = document.getElementById('audioControl');
  const musicDisc = document.getElementById('musicDisc');
  const musicLabel = document.getElementById('musicLabel');
  const welcomeToast = document.getElementById('welcomeToast');
  const toastClose = document.getElementById('toastClose');
  const sfxBtn = document.getElementById('sfxBtn');

  let isMusicPlaying = false;
  let sfxEnabled = true;
  let candlesBlown = false;
  let activeBoxIndex = 1;
  const openedBoxes = { 1: false, 2: false, 3: false };

  // Sound Effects Synthesis via Web Audio API
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function initAudioCtx() {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playPopSfx() {
    if (!sfxEnabled) return;
    initAudioCtx();
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  function playWhooshSfx() {
    if (!sfxEnabled) return;
    initAudioCtx();
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {}
  }

  function playChimeSfx() {
    if (!sfxEnabled) return;
    initAudioCtx();
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 0.4);
      });
    } catch (e) {}
  }

  function playBoingSfx() {
    if (!sfxEnabled) return;
    initAudioCtx();
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  function playCheerSfx() {
    if (!sfxEnabled) return;
    initAudioCtx();
    try {
      playChimeSfx();
      // gentle celebratory noise burst
      const bufferSize = audioCtx.sampleRate * 0.4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      noise.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch (e) {}
  }

  // Toggle Background Music
  function toggleMusic() {
    initAudioCtx();
    if (!isMusicPlaying) {
      bgMusic.play().then(() => {
        isMusicPlaying = true;
        musicDisc.classList.add('playing');
        musicLabel.textContent = 'Music On 🎵';
        if (welcomeToast) welcomeToast.classList.add('hidden');
      }).catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    } else {
      bgMusic.pause();
      isMusicPlaying = false;
      musicDisc.classList.remove('playing');
      musicLabel.textContent = 'Music Off ⏸️';
    }
  }

  audioControl.addEventListener('click', toggleMusic);

  if (toastClose) {
    toastClose.addEventListener('click', () => {
      welcomeToast.classList.add('hidden');
      if (!isMusicPlaying) toggleMusic();
    });
  }

  sfxBtn.addEventListener('click', () => {
    sfxEnabled = !sfxEnabled;
    sfxBtn.innerHTML = sfxEnabled ? '<span>🔊</span>' : '<span>🔇</span>';
    playPopSfx();
  });

  // ---------------------------------------------------
  // STATE PERSISTENCE (RESUME EXACTLY WHERE LEFT OFF)
  // ---------------------------------------------------
  function saveAppState(overrideScreen) {
    try {
      let activeScreenKey = overrideScreen;
      if (!activeScreenKey) {
        activeScreenKey = Object.keys(screens).find(k => screens[k] && screens[k].classList.contains('active')) || 'screenCupid';
      }
      const state = {
        screen: activeScreenKey,
        activeBoxIndex: (typeof activeBoxIndex !== 'undefined') ? activeBoxIndex : 1,
        openedBoxes: (typeof openedBoxes !== 'undefined') ? openedBoxes : { 1: false, 2: false, 3: false },
        candlesBlown: !!candlesBlown,
        isEnvelopeOpen: typeof isEnvelopeOpen !== 'undefined' ? isEnvelopeOpen : false,
        currentLetterPage: typeof currentLetterPage !== 'undefined' ? currentLetterPage : 0,
        savedAt: Date.now()
      };
      localStorage.setItem('birthday_gift_saved_state', JSON.stringify(state));
      sessionStorage.setItem('birthday_gift_saved_state', JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save state:', e);
    }
  }

  function restoreAppState() {
    try {
      let targetScreen = null;
      let state = null;

      // 1. Check URL hash first (e.g. #screenSurprise)
      const hashScreen = window.location.hash ? window.location.hash.replace(/^#/, '') : null;
      const isReturnFromDownload = sessionStorage.getItem('return_from_download') === 'true';
      const sessionRaw = sessionStorage.getItem('birthday_gift_saved_state');
      const localRaw = localStorage.getItem('birthday_gift_saved_state');

      if (hashScreen && screens[hashScreen]) {
        targetScreen = hashScreen;
        if (localRaw) try { state = JSON.parse(localRaw); } catch (e) {}
      } else if (isReturnFromDownload || sessionRaw) {
        // Returning from video download in active session
        const raw = sessionRaw || localRaw;
        if (raw) {
          try { state = JSON.parse(raw); } catch (e) {}
          if (state && state.screen && screens[state.screen] && state.screen !== 'screenCupid') {
            targetScreen = state.screen;
          }
        }
      }

      // If someone scans or clicks the link fresh (new tab/session, no hash):
      // ALWAYS start on screenCupid ("a little something, for you")!
      if (!targetScreen) {
        Object.values(screens).forEach(s => {
          if (s) s.classList.remove('active');
        });
        if (screens.screenCupid) {
          screens.screenCupid.classList.add('active');
        }
        return false;
      }

      // 1. Restore candle blown state on cake
      if (state && state.candlesBlown) {
        candlesBlown = true;
        if (interactiveCake) {
          interactiveCake.classList.add('blown');
          if (cakeHint) {
            cakeHint.textContent = 'Wish made! ✨💖';
            cakeHint.style.color = '#c83259';
          }
        }
      }

      // 2. Restore opened mystery gift boxes
      if (state && state.openedBoxes) {
        Object.assign(openedBoxes, state.openedBoxes);
        const allBoxes = document.querySelectorAll('.mystery-box-card');
        allBoxes.forEach(box => {
          const bNum = parseInt(box.dataset.box, 10);
          const hint = box.querySelector('.box-tap-hint');
          if (openedBoxes[bNum]) {
            box.classList.add('is-open');
            if (hint) hint.textContent = 'Opened! ✨';
          } else {
            box.classList.remove('is-open');
            if (hint) hint.textContent = 'Tap to open 🎁';
          }
        });
      }

      // 3. Restore active gift box index (1, 2, or 3)
      if (state && typeof state.activeBoxIndex === 'number' && state.activeBoxIndex >= 1 && state.activeBoxIndex <= 3) {
        activeBoxIndex = state.activeBoxIndex;
      }

      if (typeof renderActiveBoxSlide === 'function') {
        renderActiveBoxSlide();
      }

      // 4. Restore envelope state if applicable
      if (targetScreen === 'screenEnvelope') {
        if (state && state.isEnvelopeOpen && typeof openEnvelope === 'function') {
          openEnvelope();
          if (typeof renderLetterPage === 'function' && typeof state.currentLetterPage === 'number') {
            renderLetterPage(state.currentLetterPage, false);
          }
        }
      }

      // 5. Activate the saved target screen
      if (targetScreen && screens[targetScreen]) {
        goToScreen(targetScreen);
        return true;
      }
    } catch (e) {
      console.warn('Could not restore state:', e);
    }
    return false;
  }

  // Screen Switcher
  function goToScreen(screenName) {
    playPopSfx();
    if (screenName === 'screenLetter') {
      screenName = 'screenEnvelope';
      setTimeout(() => {
        if (typeof openEnvelope === 'function') openEnvelope();
      }, 150);
    }
    Object.values(screens).forEach(screen => {
      if (screen) screen.classList.remove('active');
    });
    if (screens[screenName]) {
      screens[screenName].classList.add('active');
    }

    // Trigger sweet rope drawing animation and fairy light chimes when entering screenPolaroids
    if (screenName === 'screenPolaroids') {
      const clotheslineStage = document.getElementById('clotheslineStage');
      if (clotheslineStage) {
        clotheslineStage.style.animation = 'none';
        void clotheslineStage.offsetWidth;
        clotheslineStage.style.animation = '';
      }
      playWhooshSfx();
      setTimeout(() => {
        playChimeSfx();
        triggerConfetti(0.4);
      }, 850);
    }

    // Automatically trigger hug animation once when arriving on the virtual hug finale page
    if (screenName === 'screenVirtualHug') {
      setTimeout(() => {
        if (typeof triggerHugBurst === 'function') {
          triggerHugBurst();
        }
      }, 400);
    }

    saveAppState(screenName);
    try {
      history.replaceState(null, '', '#' + screenName);
    } catch (e) {}
  }
  window.goToScreen = goToScreen;

  // React to URL hash navigation dynamically
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash && screens[hash]) {
      goToScreen(hash);
    }
  });

  // ---------------------------------------------------
  // SCREEN 0: CUPID BOW & ARROW HEART INTRO INTERACTION
  // Accurately recreating @code_wars_official reel
  // ---------------------------------------------------
  const screenCupid = document.getElementById('screenCupid');
  const cupidBowArena = document.getElementById('cupidBowArena');
  const cupidHeartTarget = document.getElementById('cupidHeartTarget');
  const bowString = document.getElementById('bowString');
  const bowArrowGroup = document.getElementById('bowArrowGroup');
  const flyingArrowProjectile = document.getElementById('flyingArrowProjectile');
  const cupidStruckArrow = document.getElementById('cupidStruckArrow');
  const cupidBloomFlash = document.getElementById('cupidBloomFlash');
  const cupidPullHint = document.getElementById('cupidPullHint');

  let isPullingBow = false;
  let pullStartX = 0;
  let pullStartY = 0;
  let currentPullDist = 0;
  let isArrowShot = false;

  function updateBowPull(dx, dy) {
    // Project delta along pull direction (pulling down-left gives positive tension)
    const pullDistance = Math.min(Math.max(-dx - dy * 0.7, 0), 45);
    currentPullDist = pullDistance;

    const pullX = 32 - pullDistance * 0.9;
    const pullY = 80;
    if (bowString) {
      bowString.setAttribute('d', `M 32,22 Q ${pullX},${pullY} 32,138`);
    }
    if (bowArrowGroup) {
      bowArrowGroup.style.transform = `translateX(${-pullDistance}px)`;
    }
    if (cupidPullHint && pullDistance > 10) {
      cupidPullHint.textContent = 'RELEASE TO SHOOT! 🏹💖';
      cupidPullHint.style.color = '#c41e45';
    }
  }

  function resetBowString() {
    if (bowString) {
      bowString.setAttribute('d', 'M 32,22 Q 32,80 32,138');
    }
    if (bowArrowGroup) {
      bowArrowGroup.style.transform = '';
    }
    if (cupidPullHint) {
      cupidPullHint.textContent = 'PULL & RELEASE';
      cupidPullHint.style.color = '';
    }
  }

  function shootArrowAtHeart() {
    if (isArrowShot) return;
    isArrowShot = true;

    initAudioCtx();
    playWhooshSfx();
    resetBowString();

    if (bowArrowGroup) bowArrowGroup.style.opacity = '0';

    if (!cupidBowArena || !cupidHeartTarget) {
      goToScreen('screen1');
      return;
    }

    const bowRect = cupidBowArena.getBoundingClientRect();
    const heartRect = cupidHeartTarget.getBoundingClientRect();
    const stage = document.getElementById('cupidStage') || document.body;
    const stageRect = stage.getBoundingClientRect();

    const startX = bowRect.left + bowRect.width * 0.5 - stageRect.left;
    const startY = bowRect.top + bowRect.height * 0.5 - stageRect.top;
    const targetX = heartRect.left + heartRect.width * 0.5 - stageRect.left;
    const targetY = heartRect.top + heartRect.height * 0.5 - stageRect.top;

    const angleDeg = Math.atan2(targetY - startY, targetX - startX) * 180 / Math.PI;

    if (flyingArrowProjectile) {
      flyingArrowProjectile.style.left = `${startX}px`;
      flyingArrowProjectile.style.top = `${startY}px`;
      flyingArrowProjectile.style.transform = `translate(0, 0) rotate(${angleDeg}deg) scale(0.9)`;
      flyingArrowProjectile.classList.add('is-flying');
      flyingArrowProjectile.style.opacity = '1';
      flyingArrowProjectile.style.transition = 'transform 0.38s cubic-bezier(0.2, 0.85, 0.35, 1.15), opacity 0.1s ease';

      requestAnimationFrame(() => {
        flyingArrowProjectile.style.transform = `translate(${targetX - startX}px, ${targetY - startY}px) rotate(${angleDeg}deg) scale(1)`;
      });
    }

    // Impact timing
    setTimeout(() => {
      if (flyingArrowProjectile) flyingArrowProjectile.style.opacity = '0';
      if (cupidStruckArrow) cupidStruckArrow.classList.add('struck');
      if (cupidHeartTarget) cupidHeartTarget.classList.add('hit-impact');

      playCheerSfx();
      triggerConfetti(0.85);
      spawnCupidSparkles(heartRect);

      // Start romantic music on successful arrow hit
      if (!isMusicPlaying) {
        try {
          toggleMusic();
        } catch (e) {}
      }

      // "AFTER HEART BURST SLOWLY COVER FULL PAGE"
      const cupidHeartCoverExpansion = document.getElementById('cupidHeartCoverExpansion');
      setTimeout(() => {
        if (cupidHeartCoverExpansion) {
          cupidHeartCoverExpansion.classList.remove('fade-out');
          cupidHeartCoverExpansion.classList.add('expanding');
        }
        if (cupidBloomFlash) cupidBloomFlash.classList.add('active');

        // Once the rose blanket has slowly and fully covered the screen (~1.45s)
        setTimeout(() => {
          goToScreen('screen1');

          // Smoothly dissolve the rose overlay to reveal Screen 1
          if (cupidHeartCoverExpansion) cupidHeartCoverExpansion.classList.add('fade-out');
          if (cupidBloomFlash) cupidBloomFlash.classList.remove('active');

          setTimeout(() => {
            if (cupidHeartCoverExpansion) {
              cupidHeartCoverExpansion.classList.remove('expanding', 'fade-out');
            }
          }, 900);
        }, 1450);
      }, 200);
    }, 380);
  }

  function spawnCupidSparkles(rect) {
    const symbols = ['✨', '💖', '⭐', '💕', '🌸', '🤍', '💛'];
    for (let i = 0; i < 14; i++) {
      const sp = document.createElement('span');
      sp.className = 'cupid-sparkle-dot';
      sp.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      const tx = (Math.random() - 0.5) * 160;
      const ty = (Math.random() - 0.5) * 160;
      const rot = (Math.random() - 0.5) * 180;
      sp.style.setProperty('--tx', `${tx}px`);
      sp.style.setProperty('--ty', `${ty}px`);
      sp.style.setProperty('--rot', `${rot}deg`);
      sp.style.left = `${rect.left + rect.width / 2}px`;
      sp.style.top = `${rect.top + rect.height / 2}px`;
      document.body.appendChild(sp);
      setTimeout(() => {
        if (sp.parentNode) sp.parentNode.removeChild(sp);
      }, 950);
    }
  }

  // Pointer / Touch drag events for bow
  if (cupidBowArena) {
    cupidBowArena.addEventListener('pointerdown', (e) => {
      if (isArrowShot) return;
      isPullingBow = true;
      pullStartX = e.clientX;
      pullStartY = e.clientY;
      cupidBowArena.classList.add('is-pulling');
      try {
        cupidBowArena.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    cupidBowArena.addEventListener('pointermove', (e) => {
      if (!isPullingBow) return;
      const dx = e.clientX - pullStartX;
      const dy = e.clientY - pullStartY;
      updateBowPull(dx, dy);
    });

    const finishPull = (e) => {
      if (!isPullingBow) return;
      isPullingBow = false;
      cupidBowArena.classList.remove('is-pulling');
      try {
        cupidBowArena.releasePointerCapture(e.pointerId);
      } catch (err) {}

      // Release shoots arrow (both pull-release and tap work!)
      shootArrowAtHeart();
    };

    cupidBowArena.addEventListener('pointerup', finishPull);
    cupidBowArena.addEventListener('pointercancel', finishPull);
  }

  // Also tapping heart or pull hint triggers the bow shot
  if (cupidHeartTarget) {
    cupidHeartTarget.addEventListener('click', () => {
      if (!isArrowShot) shootArrowAtHeart();
    });
  }
  if (cupidPullHint) {
    cupidPullHint.addEventListener('click', () => {
      if (!isArrowShot) shootArrowAtHeart();
    });
  }

  // ---------------------------------------------------
  // SCREEN 1: "HEY!! I made something for you"
  // ---------------------------------------------------
  const btnYes1 = document.getElementById('btnYes1');
  const btnNo1 = document.getElementById('btnNo1');

  btnYes1.addEventListener('click', () => {
    if (!isMusicPlaying) toggleMusic();
    goToScreen('screenGood');
  });

  btnNo1.addEventListener('click', () => {
    goToScreen('screenAngry');
  });

  // Easter egg: No button slight runaway on hover
  let noHoverCount = 0;
  btnNo1.addEventListener('mouseenter', () => {
    if (noHoverCount < 2) {
      btnNo1.style.transform = `translateX(${noHoverCount % 2 === 0 ? 15 : -15}px)`;
      noHoverCount++;
    }
  });

  // ---------------------------------------------------
  // SCREEN ANGRY: "HOW DARE YOU"
  // ---------------------------------------------------
  const btnGoBack = document.getElementById('btnGoBack');
  btnGoBack.addEventListener('click', () => {
    btnNo1.style.transform = '';
    goToScreen('screen1');
  });

  // ---------------------------------------------------
  // SCREEN 2: "That's a good Gurlll 💋"
  // ---------------------------------------------------
  const btnClickGood = document.getElementById('btnClickGood');
  btnClickGood.addEventListener('click', () => {
    goToScreen('screenBday');
    triggerConfetti(0.4);
  });

  // ---------------------------------------------------
  // SCREEN 3: "HAPPY BIRTHDAY BBG 💗"
  // ---------------------------------------------------
  const btnNextBday = document.getElementById('btnNextBday');
  btnNextBday.addEventListener('click', () => {
    closeEnvelope();
    goToScreen('screenEnvelope');
  });

  // ---------------------------------------------------
  // SCREEN 4: ANIMATED 3D ENVELOPE, MULTI-PAGE SWIPE & TYPEWRITER LETTER
  // ---------------------------------------------------
  const envelopeMainStage = document.getElementById('envelopeMainStage');
  const envelopeScreenContent = document.getElementById('envelopeScreenContent');
  const envelopeTapHint = document.getElementById('envelopeTapHint');
  const btnClickCamera = document.getElementById('btnClickCamera');
  const heartLocket = document.getElementById('heartLocket');
  const letterStationeryCard = document.getElementById('letterStationeryCard');
  const letterTextViewport = document.getElementById('letterTextViewport');
  const displayLetterText = document.getElementById('displayLetterText');
  const letterSwipeActionBtn = document.getElementById('letterSwipeActionBtn');
  const actionBtnArrow = document.getElementById('actionBtnArrow');
  const actionBtnLabel = document.getElementById('actionBtnLabel');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const letterPageCounter = document.getElementById('letterPageCounter');
  const letterDotsBar = document.getElementById('letterDotsBar');

  let isEnvelopeOpen = false;

  // Default Multi-Page Letters
  const DEFAULT_PAGES = [
    `To my favorite Idiot 🌸<br><br>Before you started talking to me, my life was as exciting as plain boiled rice without salt. Just peaceful and extremely boring and low-key cursed.<br><br>Then <span class="highlight-pink">YOU showed up</span> with your mood swings, anger issues, and non-stop Nepali chilli spice! And honestly? My life finally got interesting. Even when you're glaring at me like you want to throw a slipper, <span class="highlight-pink">you're the brightest light in my life. ✨</span><br><br>&nbsp;`,
    `Now listen to me, idiot: 🙄❤️<br><br>If you want to explore different hobbies, then go for it! Exploring new things is the most interesting hobby in itself. So don't you dare think: 'Oh, I'm just average at everything.' Excuse me?! The only thing you're average at is realizing how amazing you actually are.<br><br>And what is this nonsense about quitting dancing?! You're out here planning your retirement like an 80-year-old! Don't you dare quit. <span class="highlight-pink">You're magic when you dance</span>, and whether you like it or not, I'm signed up as your permanent #1 cheerleader for life.<br><br>Besides, you have to play TT with me lifelong—you can't retire from getting smashed by my serves anyway! 🏓😂💃<br><br>&nbsp;`,
    `At the end of the day, you're the one person who can annoy me and make my whole day happy at the exact same time. 🥰<br><br><span class="highlight-pink">"May today bring you pure happiness, endless blessings, and maximum peace of mind!"</span><br><br>Janmadin ko dherai dherai shubhakamana, idiot! Keep dancing, keep throwing cute tantrums, and never stop shining. 💖✨<br><br><span class="highlight-pink">I'll always be in your corner! 💫</span><br><br>&nbsp;`
  ];

  let letterPages = [...DEFAULT_PAGES];
  let currentLetterPage = 0;
  let activeTypingCancel = null;

  // Floating Memory Photos mapped per letter page with unique posture & pins
  const ENVELOPE_PAGE_PHOTOS = [
    {
      tl: 'assets/envelope_photo_p1_tl.jpg',
      br: 'assets/envelope_photo_p1_br.jpg',
      tlAlt: 'Memory with pink cap',
      brAlt: 'Memory in traditional dress',
      pinTL: '🌸',
      pinBR: '✨'
    },
    {
      tl: 'assets/envelope_photo_p2_tl.jpg',
      br: 'assets/envelope_photo_p2_br.jpg',
      tlAlt: 'Memory petting puppy',
      brAlt: 'Memory in pink saree',
      pinTL: '🐾',
      pinBR: '☀️'
    },
    {
      tl: 'assets/envelope_photo_p3_tl.jpg',
      br: 'assets/envelope_photo_p3_br.jpg',
      tlAlt: 'Memory under moonlight',
      brAlt: 'Memory smiling in blue saree',
      pinTL: '🌙',
      pinBR: '💃'
    }
  ];

  function updateFloatingPhotos(pageIdx) {
    const photoData = ENVELOPE_PAGE_PHOTOS[pageIdx] || ENVELOPE_PAGE_PHOTOS[0];
    const imgTL = document.getElementById('envPhotoImgTL');
    const imgBR = document.getElementById('envPhotoImgBR');
    const cardTL = document.getElementById('envPhotoTopLeft');
    const cardBR = document.getElementById('envPhotoBottomRight');
    const pinTL = document.getElementById('envPinTL');
    const pinBR = document.getElementById('envPinBR');

    // Smoothly shift posture (angle & tilt) per page
    if (cardTL && cardBR) {
      cardTL.classList.remove('posture-p0', 'posture-p1', 'posture-p2');
      cardBR.classList.remove('posture-p0', 'posture-p1', 'posture-p2');
      cardTL.classList.add(`posture-p${pageIdx}`);
      cardBR.classList.add(`posture-p${pageIdx}`);
    }

    if (!imgTL || !imgBR) return;

    // Skip photo swap if already showing the correct photos
    if (imgTL.getAttribute('src') === photoData.tl && imgBR.getAttribute('src') === photoData.br) {
      return;
    }

    // Elegant, smooth crossfade dissolve
    imgTL.classList.add('img-fading');
    imgBR.classList.add('img-fading');

    setTimeout(() => {
      imgTL.src = photoData.tl;
      imgTL.alt = photoData.tlAlt;
      imgBR.src = photoData.br;
      imgBR.alt = photoData.brAlt;

      if (pinTL && photoData.pinTL) pinTL.textContent = photoData.pinTL;
      if (pinBR && photoData.pinBR) pinBR.textContent = photoData.pinBR;

      // Ensure the browser has applied the new image, then softly dissolve in
      requestAnimationFrame(() => {
        setTimeout(() => {
          imgTL.classList.remove('img-fading');
          imgBR.classList.remove('img-fading');
        }, 30);
      });
    }, 220);
  }

  // Typewriter Animation that preserves HTML tags (<br>, <span>)
  function typewriteHtml(element, htmlContent, onComplete, speed = 25) {
    if (activeTypingCancel) {
      activeTypingCancel();
      activeTypingCancel = null;
    }

    // Tokenize string into HTML tags, HTML entities, and regular characters
    const tokens = [];
    let i = 0;
    while (i < htmlContent.length) {
      if (htmlContent[i] === '<') {
        const closeIdx = htmlContent.indexOf('>', i);
        if (closeIdx !== -1) {
          tokens.push({ type: 'tag', val: htmlContent.slice(i, closeIdx + 1) });
          i = closeIdx + 1;
          continue;
        }
      }
      if (htmlContent[i] === '&') {
        const semiIdx = htmlContent.indexOf(';', i);
        if (semiIdx !== -1 && semiIdx - i < 10) {
          tokens.push({ type: 'entity', val: htmlContent.slice(i, semiIdx + 1) });
          i = semiIdx + 1;
          continue;
        }
      }
      tokens.push({ type: 'char', val: htmlContent[i] });
      i++;
    }

    element.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    element.appendChild(cursor);

    let tokenIdx = 0;
    let isCancelled = false;

    function finishImmediately() {
      if (isCancelled) return;
      isCancelled = true;
      if (typeInterval) clearInterval(typeInterval);
      element.innerHTML = htmlContent;
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      activeTypingCancel = null;
      if (onComplete) onComplete();
    }

    const typeInterval = setInterval(() => {
      if (isCancelled) return;

      if (tokenIdx >= tokens.length) {
        clearInterval(typeInterval);
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        activeTypingCancel = null;
        if (onComplete) onComplete();
        return;
      }

      let token = tokens[tokenIdx];
      // Append all consecutive HTML tags and entities instantly without delay
      while (token && (token.type === 'tag' || token.type === 'entity')) {
        cursor.insertAdjacentHTML('beforebegin', token.val);
        tokenIdx++;
        token = tokens[tokenIdx];
      }

      if (token && token.type === 'char') {
        cursor.insertAdjacentText('beforebegin', token.val);
        tokenIdx++;
      }
    }, speed);

    activeTypingCancel = finishImmediately;
    return finishImmediately;
  }

  // Render a specific letter page with typewriter animation
  function renderLetterPage(pageIdx, animate = true) {
    if (letterPages.length === 0) letterPages = [...DEFAULT_PAGES];
    currentLetterPage = Math.max(0, Math.min(pageIdx, letterPages.length - 1));

    // Update Counter & Arrow Button states
    if (letterPageCounter) {
      letterPageCounter.textContent = `Page ${currentLetterPage + 1} of ${letterPages.length}`;
    }
    if (prevPageBtn) prevPageBtn.disabled = (currentLetterPage === 0);
    if (nextPageBtn) nextPageBtn.disabled = (currentLetterPage === letterPages.length - 1);

    // Update Pagination Dots
    if (letterDotsBar) {
      letterDotsBar.innerHTML = '';
      letterPages.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = `letter-dot ${idx === currentLetterPage ? 'active' : ''}`;
        dot.setAttribute('data-page', idx);
        dot.title = `Page ${idx + 1}`;
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          if (idx !== currentLetterPage) {
            playPopSfx();
            renderLetterPage(idx, true);
          }
        });
        letterDotsBar.appendChild(dot);
      });
    }

    // Run Typewriter Effect
    if (displayLetterText) {
      if (letterTextViewport) letterTextViewport.scrollTop = 0;
      if (animate) {
        typewriteHtml(displayLetterText, letterPages[currentLetterPage], () => {
          updateSwipeActionBtn();
        }, 24);
      } else {
        displayLetterText.innerHTML = letterPages[currentLetterPage];
        updateSwipeActionBtn();
      }
    }

    // Smoothly update floating memory photos to match current page
    updateFloatingPhotos(currentLetterPage);
  }

  function updateSwipeActionBtn() {
    if (!letterTextViewport || !letterSwipeActionBtn) return;
    const maxScroll = letterTextViewport.scrollHeight - letterTextViewport.clientHeight;
    const isLongMessage = (letterPages[currentLetterPage] && letterPages[currentLetterPage].length > 180);
    if (maxScroll <= 10 && !isLongMessage) {
      letterSwipeActionBtn.classList.add('hidden');
      return;
    }
    letterSwipeActionBtn.classList.remove('hidden');
    const isNearBottom = (letterTextViewport.scrollTop + letterTextViewport.clientHeight) >= (letterTextViewport.scrollHeight - 25);
    if (isNearBottom) {
      letterSwipeActionBtn.classList.add('is-at-bottom');
      if (actionBtnLabel) actionBtnLabel.textContent = 'Back to top 👆';
    } else {
      letterSwipeActionBtn.classList.remove('is-at-bottom');
      if (actionBtnLabel) actionBtnLabel.textContent = 'Swipe / Tap for lower message 👇';
    }
  }

  if (letterTextViewport) {
    letterTextViewport.addEventListener('scroll', () => {
      updateSwipeActionBtn();
    }, { passive: true });
  }

  if (letterSwipeActionBtn) {
    letterSwipeActionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playPopSfx();
      if (activeTypingCancel) {
        activeTypingCancel();
        activeTypingCancel = null;
      }
      if (!letterTextViewport) return;
      const isNearBottom = (letterTextViewport.scrollTop + letterTextViewport.clientHeight) >= (letterTextViewport.scrollHeight - 25);
      if (isNearBottom) {
        letterTextViewport.scrollTo({ top: 0, behavior: 'smooth' });
        if (envelopeMainStage) envelopeMainStage.classList.remove('is-expanded');
      } else {
        letterTextViewport.scrollBy({ top: 140, behavior: 'smooth' });
        if (envelopeMainStage) envelopeMainStage.classList.add('is-expanded');
      }
      setTimeout(updateSwipeActionBtn, 350);
    });
  }

  // Allow clicking anywhere on the letter text during typing to finish typing immediately
  if (displayLetterText) {
    displayLetterText.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeTypingCancel) {
        activeTypingCancel();
        activeTypingCancel = null;
        updateSwipeActionBtn();
      }
    });
  }

  // Prev / Next Page Buttons
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentLetterPage > 0) {
        playPopSfx();
        renderLetterPage(currentLetterPage - 1, true);
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentLetterPage < letterPages.length - 1) {
        playPopSfx();
        renderLetterPage(currentLetterPage + 1, true);
      }
    });
  }

  // Touch Swipe & Mouse Drag on the Letter Card (Horizontal to turn pages, Vertical to reveal lower message)
  let swipeStartX = 0;
  let swipeStartY = 0;
  let isMouseDragging = false;
  let mouseStartX = 0;
  let mouseStartY = 0;

  if (letterStationeryCard) {
    // Touch swipe
    letterStationeryCard.addEventListener('touchstart', (e) => {
      swipeStartX = e.touches[0].clientX;
      swipeStartY = e.touches[0].clientY;
    }, { passive: true });

    letterStationeryCard.addEventListener('touchend', (e) => {
      if (!isEnvelopeOpen) return;
      const swipeEndX = e.changedTouches[0].clientX;
      const swipeEndY = e.changedTouches[0].clientY;
      const diffX = swipeEndX - swipeStartX;
      const diffY = swipeEndY - swipeStartY;

      // Horizontal swipe: Flip letter pages
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0 && currentLetterPage < letterPages.length - 1) {
          playPopSfx();
          renderLetterPage(currentLetterPage + 1, true);
        } else if (diffX > 0 && currentLetterPage > 0) {
          playPopSfx();
          renderLetterPage(currentLetterPage - 1, true);
        }
      }
      // Vertical swipe: Reveal lower message in envelope
      else if (Math.abs(diffY) > 28 && Math.abs(diffY) > Math.abs(diffX)) {
        if (diffY < 0) {
          // Swiped UP -> Scroll down to read lower message
          if (letterTextViewport) {
            letterTextViewport.scrollBy({ top: 130, behavior: 'smooth' });
          }
          if (envelopeMainStage) {
            envelopeMainStage.classList.add('is-expanded');
          }
        } else if (diffY > 0) {
          // Swiped DOWN -> Scroll back up
          if (letterTextViewport) {
            letterTextViewport.scrollBy({ top: -130, behavior: 'smooth' });
          }
        }
        setTimeout(updateSwipeActionBtn, 300);
      }
    }, { passive: true });

    // Wheel event to scroll letter text viewport easily
    letterStationeryCard.addEventListener('wheel', (e) => {
      if (!isEnvelopeOpen || !letterTextViewport) return;
      letterTextViewport.scrollTop += e.deltaY;
      updateSwipeActionBtn();
    }, { passive: true });

    // Mouse drag swipe
    letterStationeryCard.addEventListener('mousedown', (e) => {
      if (!isEnvelopeOpen) return;
      if (e.target.closest('button') || e.target.closest('.letter-dot') || e.target.closest('#heartLocket')) return;
      isMouseDragging = true;
      mouseStartX = e.clientX;
      mouseStartY = e.clientY;
    });

    window.addEventListener('mouseup', (e) => {
      if (!isMouseDragging || !isEnvelopeOpen) return;
      isMouseDragging = false;
      const diffX = e.clientX - mouseStartX;
      const diffY = e.clientY - mouseStartY;

      // Horizontal mouse swipe
      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0 && currentLetterPage < letterPages.length - 1) {
          playPopSfx();
          renderLetterPage(currentLetterPage + 1, true);
        } else if (diffX > 0 && currentLetterPage > 0) {
          playPopSfx();
          renderLetterPage(currentLetterPage - 1, true);
        }
      }
      // Vertical mouse swipe: Reveal lower message
      else if (Math.abs(diffY) > 30 && Math.abs(diffY) > Math.abs(diffX)) {
        if (diffY < 0) {
          // Dragged UP
          if (letterTextViewport) {
            letterTextViewport.scrollBy({ top: 130, behavior: 'smooth' });
          }
          if (envelopeMainStage) {
            envelopeMainStage.classList.add('is-expanded');
          }
        } else if (diffY > 0) {
          // Dragged DOWN
          if (letterTextViewport) {
            letterTextViewport.scrollBy({ top: -130, behavior: 'smooth' });
          }
        }
        setTimeout(updateSwipeActionBtn, 300);
      }
    });
  }

  function openEnvelope() {
    if (isEnvelopeOpen) return;
    isEnvelopeOpen = true;
    playWhooshSfx();

    if (envelopeMainStage) envelopeMainStage.classList.add('is-open');

    // Trigger sweet paper chime & romantic confetti hearts
    setTimeout(() => {
      playChimeSfx();
      triggerConfetti(0.45);
    }, 450);

    // Begin typewriter animation on Page 1 as letter card finishes sliding up
    setTimeout(() => {
      renderLetterPage(0, true);
    }, 600);

    // Reveal Camera button and update hint text
    setTimeout(() => {
      if (envelopeScreenContent) envelopeScreenContent.classList.add('envelope-revealed');
      if (envelopeTapHint) envelopeTapHint.textContent = 'Tap envelope to fold back 💌';
    }, 750);
  }

  function closeEnvelope() {
    if (!isEnvelopeOpen) return;
    isEnvelopeOpen = false;
    playPopSfx();

    if (activeTypingCancel) {
      activeTypingCancel();
      activeTypingCancel = null;
    }

    if (envelopeScreenContent) envelopeScreenContent.classList.remove('envelope-revealed');
    if (envelopeMainStage) {
      envelopeMainStage.classList.remove('is-open');
      envelopeMainStage.classList.remove('is-expanded');
    }
    if (letterTextViewport) letterTextViewport.scrollTop = 0;
    if (envelopeTapHint) envelopeTapHint.textContent = 'Tap the envelope to open 💌';
  }

  function toggleEnvelope() {
    if (isEnvelopeOpen) {
      closeEnvelope();
    } else {
      openEnvelope();
    }
  }

  if (envelopeMainStage) {
    envelopeMainStage.addEventListener('click', (e) => {
      // Don't toggle envelope if clicking inside letter controls, heart locket, photos, or camera button
      if (
        e.target.closest('#heartLocket') ||
        e.target.closest('.envelope-floating-photo') ||
        e.target.closest('#btnClickCamera') ||
        e.target.closest('#letterPageControls') ||
        e.target.closest('#letterPaginationFooter') ||
        e.target.closest('#displayLetterText')
      ) return;
      toggleEnvelope();
    });
  }

  // Interactive Floating Memory Photos sparkle pop
  document.querySelectorAll('.envelope-floating-photo').forEach(photo => {
    photo.addEventListener('click', (e) => {
      e.stopPropagation();
      playChimeSfx();
      photo.classList.add('pulse-action');
      triggerConfetti(0.25);
      setTimeout(() => photo.classList.remove('pulse-action'), 600);
    });
  });

  if (btnClickCamera) {
    btnClickCamera.addEventListener('click', (e) => {
      e.stopPropagation();
      goToScreen('screenPolaroids');
    });
  }

  // Double Heart Locket Interactive Heart Flutter
  if (heartLocket) {
    heartLocket.addEventListener('click', (e) => {
      e.stopPropagation();
      playChimeSfx();
      heartLocket.classList.add('pulse-action');
      spawnLocketHearts(e);
      triggerConfetti(0.3);
      setTimeout(() => {
        heartLocket.classList.remove('pulse-action');
      }, 650);
    });
  }

  function spawnLocketHearts(e) {
    if (!heartLocket) return;
    const rect = heartLocket.getBoundingClientRect();
    const heartSymbols = ['💖', '💕', '💗', '✨', '🌸', '🤍'];
    for (let i = 0; i < 7; i++) {
      const heartEl = document.createElement('span');
      heartEl.className = 'floating-locket-heart';
      heartEl.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      const tx = (Math.random() - 0.5) * 110;
      const ty = -(Math.random() * 70 + 40);
      heartEl.style.setProperty('--tx', `${tx}px`);
      heartEl.style.setProperty('--ty', `${ty}px`);
      heartEl.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 30}px`;
      heartEl.style.top = `${rect.top + rect.height / 2}px`;
      document.body.appendChild(heartEl);
      setTimeout(() => {
        if (heartEl.parentNode) heartEl.parentNode.removeChild(heartEl);
      }, 1250);
    }
  }

  // ---------------------------------------------------
  // SCREEN 6: ROSE THEME & CLOTHESLINE POLAROIDS
  // ---------------------------------------------------
  const btnClickGift = document.getElementById('btnClickGift');
  btnClickGift.addEventListener('click', () => {
    goToScreen('screenSurprise');
  });

  // Interactive Cake Candle (Code Buzz Style Vector Animation)
  const interactiveCake = document.getElementById('interactiveCake');
  const cakeHint = document.getElementById('cakeHint');

  if (interactiveCake) {
    interactiveCake.addEventListener('click', () => {
      if (!candlesBlown) {
        candlesBlown = true;
        interactiveCake.classList.add('blown');
        if (cakeHint) {
          cakeHint.textContent = 'Wish made! ✨💖';
          cakeHint.style.color = '#c83259';
        }
        playCheerSfx();
        triggerConfetti(0.85);
        saveAppState();
      } else {
        // Only blow option - cannot relight; extra sparkles on tap
        playChimeSfx();
        triggerConfetti(0.3);
      }
    });
  }

  // Polaroid tilt interactions
  document.querySelectorAll('.hanging-polaroid').forEach(card => {
    card.addEventListener('click', () => {
      playPopSfx();
      card.style.transform = 'translateY(-15px) scale(1.15) rotate(0deg)';
      triggerConfetti(0.25);
      setTimeout(() => {
        card.style.transform = '';
      }, 700);
    });
  });

  // ---------------------------------------------------
  // SCREEN 7: SINGLE BOX SHOWCASE (ONE BOX AT A TIME + NEXT BUTTON)
  // ---------------------------------------------------
  const mysteryBoxes = document.querySelectorAll('.mystery-box-card');
  const btnPrevBox = document.getElementById('btnPrevBox');
  const btnToHug = document.getElementById('btnToHug');
  const btnNextText = document.getElementById('btnNextText');
  const giftStepBadge = document.getElementById('giftStepBadge');
  const giftDots = document.querySelectorAll('.gift-dot');
  const surpriseSubtitle = document.getElementById('surpriseSubtitle');
  const box3TeaserModal = document.getElementById('box3TeaserModal');
  const btnRevealBox3 = document.getElementById('btnRevealBox3');
  const box3TeaserBackdrop = document.getElementById('box3TeaserBackdrop');


  function renderActiveBoxSlide() {
    // 1. Show only the active box card on the single page
    mysteryBoxes.forEach(box => {
      const bNum = parseInt(box.dataset.box, 10);
      if (bNum === activeBoxIndex) {
        box.classList.add('is-active-slide');
      } else {
        box.classList.remove('is-active-slide');
      }
    });

    // 2. Update step badge
    if (giftStepBadge) {
      giftStepBadge.textContent = `Gift ${activeBoxIndex} of 3 🎁`;
    }

    // 3. Update dots
    giftDots.forEach(dot => {
      const step = parseInt(dot.dataset.step, 10);
      dot.classList.toggle('active', step === activeBoxIndex);
      dot.classList.toggle('opened', !!openedBoxes[step]);
    });

    // 4. Update Previous Box button (hidden on box 1)
    if (btnPrevBox) {
      btnPrevBox.style.display = (activeBoxIndex > 1) ? 'inline-flex' : 'none';
    }

    // 5. Update Next / Finale Action Button
    const isCurrentOpened = !!openedBoxes[activeBoxIndex];

    if (!btnToHug || !btnNextText) return;

    if (activeBoxIndex < 3) {
      if (!isCurrentOpened) {
        btnToHug.classList.add('is-disabled');
        btnToHug.classList.remove('is-ready');
        btnToHug.setAttribute('aria-disabled', 'true');
        btnNextText.textContent = `Open Box ${activeBoxIndex} 🎁`;
        if (surpriseSubtitle) {
          surpriseSubtitle.textContent = (activeBoxIndex === 1)
            ? 'Tap the gift box to open! 🎁✨'
            : `Tap Gift Box #${activeBoxIndex} to open! 😎✨`;
        }
      } else {
        btnToHug.classList.remove('is-disabled');
        btnToHug.classList.add('is-ready');
        btnToHug.removeAttribute('aria-disabled');
        btnNextText.textContent = 'Next Box 🎁 ➔';
        if (surpriseSubtitle) {
          surpriseSubtitle.textContent = `Gift #${activeBoxIndex} revealed! Click Next ➔`;
        }
      }
    } else {
      // Box 3 (Final Box)
      if (!isCurrentOpened) {
        btnToHug.classList.add('is-disabled');
        btnToHug.classList.remove('is-ready');
        btnToHug.setAttribute('aria-disabled', 'true');
        btnNextText.textContent = 'Open Box 3 🎁';
        if (surpriseSubtitle) {
          surpriseSubtitle.textContent = 'Tap the final gift box to open! 😝✨';
        }
      } else {
        btnToHug.classList.remove('is-disabled');
        btnToHug.classList.add('is-ready');
        btnToHug.removeAttribute('aria-disabled');
        btnNextText.textContent = 'Continue 💖 ➔';
        if (surpriseSubtitle) {
          surpriseSubtitle.textContent = 'All gifts opened! Tap Continue 💖 ➔';
        }
      }
    }
  }

  function openBox3Directly() {
    const box3 = document.getElementById('mysteryBox3');
    if (!box3) return;
    const hint = box3.querySelector('.box-tap-hint');
    box3.classList.add('is-open');
    openedBoxes[3] = true;
    playCheerSfx();
    triggerConfetti(0.95);
    if (hint) hint.textContent = 'Opened! ✨';
    renderActiveBoxSlide();
    saveAppState();
  }

  // Tapping the box on the single page
  mysteryBoxes.forEach(box => {
    box.addEventListener('click', (e) => {
      // Don't toggle box if clicking download video button
      if (e.target.closest('#btnDownloadVideo1')) return;

      const boxNum = parseInt(box.dataset.box, 10);
      const hint = box.querySelector('.box-tap-hint');
      const isOpen = box.classList.contains('is-open');

      if (!isOpen) {
        // Special flow for Box 3: Show Teaser Pop-up first!
        if (boxNum === 3 && !openedBoxes[3]) {
          playChimeSfx();
          if (box3TeaserModal) {
            box3TeaserModal.classList.add('open');
            box3TeaserModal.setAttribute('aria-hidden', 'false');
          }
          return;
        }

        box.classList.add('is-open');
        openedBoxes[boxNum] = true;

        playWhooshSfx();
        setTimeout(playChimeSfx, 180);
        triggerConfetti(0.6);

        if (hint) hint.textContent = 'Opened! ✨';
        renderActiveBoxSlide();
        saveAppState();
      } else {
        // Toggle lid
        box.classList.remove('is-open');
        playPopSfx();
        if (hint) hint.textContent = `Tap to peek 🎁`;
        saveAppState();
      }
    });
  });

  // Box 3 Teaser Reveal Button
  if (btnRevealBox3) {
    btnRevealBox3.addEventListener('click', () => {
      if (box3TeaserModal) {
        box3TeaserModal.classList.remove('open');
        box3TeaserModal.setAttribute('aria-hidden', 'true');
      }
      playWhooshSfx();
      setTimeout(openBox3Directly, 250);
    });
  }

  if (box3TeaserBackdrop) {
    box3TeaserBackdrop.addEventListener('click', () => {
      if (box3TeaserModal) {
        box3TeaserModal.classList.remove('open');
        box3TeaserModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Next / Finale Button Click
  if (btnToHug) {
    btnToHug.addEventListener('click', () => {
      const isCurrentOpened = !!openedBoxes[activeBoxIndex];

      if (!isCurrentOpened) {
        playPopSfx();
        if (activeBoxIndex === 3 && box3TeaserModal) {
          box3TeaserModal.classList.add('open');
          box3TeaserModal.setAttribute('aria-hidden', 'false');
          return;
        }
        if (surpriseSubtitle) {
          surpriseSubtitle.textContent = `Please tap and open Box #${activeBoxIndex} first! 🎁`;
        }
        return;
      }

      if (activeBoxIndex < 3) {
        // Go to next box
        activeBoxIndex++;
        playPopSfx();
        renderActiveBoxSlide();
        saveAppState();
      } else {
        // On Box 3 and opened -> go to Screen 8: "Could you be with me forever?"
        playPopSfx();
        goToScreen('screenForever');
      }
    });
  }

  // Previous Box Button Click
  if (btnPrevBox) {
    btnPrevBox.addEventListener('click', () => {
      if (activeBoxIndex > 1) {
        activeBoxIndex--;
        playPopSfx();
        renderActiveBoxSlide();
        saveAppState();
      }
    });
  }

  // Clicking dots to navigate between opened boxes
  giftDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetStep = parseInt(dot.dataset.step, 10);
      // Can jump if already reached/opened
      if (openedBoxes[targetStep] || targetStep <= activeBoxIndex) {
        activeBoxIndex = targetStep;
        playPopSfx();
        renderActiveBoxSlide();
        saveAppState();
      }
    });
  });

  // Initial call to set up the single box slide
  renderActiveBoxSlide();

  // ---------------------------------------------------
  // SCREEN 8: "COULD YOU BE WITH ME FOREVER?"
  // Interactive Proposal with Evasive Runaway "No" Button
  // ---------------------------------------------------
  const btnForeverYes = document.getElementById('btnForeverYes');
  const btnForeverNo = document.getElementById('btnForeverNo');
  const foreverNoText = document.getElementById('foreverNoText');
  const foreverSubtitle = document.getElementById('foreverSubtitle');
  const foreverArena = document.getElementById('foreverArena');

  let noTriesCount = 0;

  function dodgeNoButton(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    noTriesCount++;
    playBoingSfx();

    const screenContainer = screens.screenForever;
    if (!screenContainer || !btnForeverNo) return;

    // Attach to screen container so it can roam freely across the whole screen
    if (btnForeverNo.parentElement !== screenContainer) {
      screenContainer.appendChild(btnForeverNo);
    }
    btnForeverNo.classList.add('teleporting');

    const containerW = screenContainer.clientWidth || 800;
    const containerH = screenContainer.clientHeight || 550;
    const btnW = btnForeverNo.offsetWidth || 95;
    const btnH = btnForeverNo.offsetHeight || 44;

    // Safe boundaries across the whole screen
    const padX = 28;
    const padTop = 40; // below top widgets
    const padBottom = 28;

    const minX = padX;
    const maxX = Math.max(minX + 40, containerW - btnW - padX);
    const minY = padTop;
    const maxY = Math.max(minY + 40, containerH - btnH - padBottom);

    const currentX = parseFloat(btnForeverNo.style.left) || (containerW / 2 + 50);
    const currentY = parseFloat(btnForeverNo.style.top) || (containerH / 2 + 100);

    // Get Yes button bounding area to prevent overlapping it
    const yesRect = btnForeverYes ? btnForeverYes.getBoundingClientRect() : null;
    const contRect = screenContainer.getBoundingClientRect();
    const yesRel = yesRect ? {
      left: yesRect.left - contRect.left - 25,
      right: yesRect.right - contRect.left + 25,
      top: yesRect.top - contRect.top - 25,
      bottom: yesRect.bottom - contRect.top + 25,
    } : { left: -999, right: -999, top: -999, bottom: -999 };

    // Sample candidate spots across the whole screen and choose the one furthest from current cursor/spot
    let bestX = minX;
    let bestY = minY;
    let maxDist = -1;

    for (let i = 0; i < 12; i++) {
      const candX = minX + Math.random() * (maxX - minX);
      const candY = minY + Math.random() * (maxY - minY);

      // Avoid overlapping Yes button
      const overlapsYes = (candX >= yesRel.left && candX <= yesRel.right && candY >= yesRel.top && candY <= yesRel.bottom);
      if (overlapsYes) continue;

      const dist = Math.hypot(candX - currentX, candY - currentY);
      if (dist > maxDist) {
        maxDist = dist;
        bestX = candX;
        bestY = candY;
      }
    }

    const randomAngle = (Math.random() - 0.5) * 18;

    btnForeverNo.style.left = `${Math.round(bestX)}px`;
    btnForeverNo.style.top = `${Math.round(bestY)}px`;
    btnForeverNo.style.transform = `rotate(${randomAngle}deg)`;

    // Keep text simply as "No"
    if (foreverNoText) {
      foreverNoText.textContent = 'No';
    }

    // Gentle growth on Yes button
    const newScale = Math.min(1.0 + noTriesCount * 0.05, 1.35);
    if (btnForeverYes) {
      btnForeverYes.style.transform = `scale(${newScale})`;
    }
  }

  if (btnForeverNo) {
    ['mouseenter', 'mouseover', 'touchstart', 'pointerdown', 'click'].forEach(evt => {
      btnForeverNo.addEventListener(evt, dodgeNoButton, { passive: false });
    });
  }

  if (btnForeverYes) {
    btnForeverYes.addEventListener('click', () => {
      playCheerSfx();
      triggerConfetti(1.2);
      setTimeout(() => triggerConfetti(0.8), 240);

      btnForeverYes.disabled = true;
      if (btnForeverNo) btnForeverNo.style.display = 'none';

      if (foreverSubtitle) {
        foreverSubtitle.innerHTML = "I knew it! Best decision ever! 🥰💖💍";
        foreverSubtitle.style.color = "#c41e45";
        foreverSubtitle.style.fontWeight = "700";
      }

      btnForeverYes.innerHTML = "<span>YAYYY! 💖🥰</span>";
      btnForeverYes.style.transform = "scale(1.15)";

      setTimeout(() => {
        goToScreen('screenVirtualHug');
      }, 1200);
    });
  }

  // ---------------------------------------------------
  // SCREEN 9: GRAND FINALE - VIRTUAL HUG
  // ---------------------------------------------------
  const btnHugAgain = document.getElementById('btnHugAgain');
  const hugBearsWrapper = document.getElementById('hugBearsWrapper');
  const heartBurst = document.getElementById('heartBurst');
  const hugBearsImg = document.getElementById('hugBearsImg');

  function spawnHugPoppingHearts() {
    if (!hugBearsWrapper) return;
    const rect = hugBearsWrapper.getBoundingClientRect();
    const symbols = ['💖', '💕', '💗', '🤗', '✨', '🌸', '❤️', '🥰'];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'popping-hug-heart';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      const tx = (Math.random() - 0.5) * 160;
      const ty = -(Math.random() * 110 + 50);
      const rot = (Math.random() - 0.5) * 50;
      el.style.setProperty('--tx', `${tx}px`);
      el.style.setProperty('--ty', `${ty}px`);
      el.style.setProperty('--rot', `${rot}deg`);
      el.style.left = `${rect.left + rect.width * 0.5 + (Math.random() - 0.5) * 40}px`;
      el.style.top = `${rect.top + rect.height * 0.4}px`;
      document.body.appendChild(el);
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 1200);
    }
  }

  function triggerHugBurst() {
    playPopSfx();
    setTimeout(playCheerSfx, 60);
    setTimeout(playChimeSfx, 150);

    // Refresh animated picture/gif frame so animation restarts cleanly
    if (hugBearsImg) {
      const pic = hugBearsWrapper ? hugBearsWrapper.querySelector('.hug-bears-picture') : null;
      const srcEl = pic ? pic.querySelector('source') : null;
      const timestamp = Date.now();
      if (srcEl) {
        srcEl.srcset = `assets/hug_bears_animated.webp?t=${timestamp}`;
      }
      const baseSrc = hugBearsImg.src.split('?')[0];
      hugBearsImg.src = `${baseSrc}?t=${timestamp}`;
    }

    if (hugBearsWrapper) {
      hugBearsWrapper.classList.remove('is-hugging');
      void hugBearsWrapper.offsetWidth; // force reflow
      hugBearsWrapper.classList.add('is-hugging');
      setTimeout(() => {
        hugBearsWrapper.classList.remove('is-hugging');
      }, 800);
    }

    spawnHugPoppingHearts();
    triggerConfetti(0.8);
    setTimeout(() => triggerConfetti(0.4), 220);
  }

  btnHugAgain.addEventListener('click', triggerHugBurst);
  hugBearsWrapper.addEventListener('click', triggerHugBurst);

  const btnReplayAll = document.getElementById('btnReplayAll');
  btnReplayAll.addEventListener('click', () => {
    localStorage.removeItem('birthday_gift_saved_state');
    sessionStorage.clear();
    try {
      history.replaceState(null, '', window.location.pathname);
    } catch (e) {}

    const cupidHeartCoverExpansion = document.getElementById('cupidHeartCoverExpansion');
    if (cupidHeartCoverExpansion) {
      cupidHeartCoverExpansion.classList.remove('expanding', 'fade-out');
    }

    candlesBlown = false;
    if (interactiveCake) interactiveCake.classList.remove('blown');
    if (cakeHint) cakeHint.textContent = 'Blow candle! 🎂';

    // Reset single box carousel state
    activeBoxIndex = 1;
    openedBoxes[1] = false;
    openedBoxes[2] = false;
    openedBoxes[3] = false;

    if (box3TeaserModal) {
      box3TeaserModal.classList.remove('open');
      box3TeaserModal.setAttribute('aria-hidden', 'true');
    }

    mysteryBoxes.forEach(box => {
      box.classList.remove('is-open');
      const hint = box.querySelector('.box-tap-hint');
      if (hint) hint.textContent = 'Tap to open 🎁';
    });

    // Reset Screen 8 "Could you be with me forever?" state
    noTriesCount = 0;
    if (btnForeverNo) {
      if (foreverArena && btnForeverNo.parentElement !== foreverArena) {
        foreverArena.appendChild(btnForeverNo);
      }
      btnForeverNo.classList.remove('teleporting');
      btnForeverNo.style.position = '';
      btnForeverNo.style.left = '';
      btnForeverNo.style.top = '';
      btnForeverNo.style.transform = '';
      btnForeverNo.style.display = '';
    }
    if (foreverNoText) {
      foreverNoText.textContent = 'No';
    }
    if (btnForeverYes) {
      btnForeverYes.style.transform = '';
      btnForeverYes.innerHTML = '<span>Yes, I can! 💖</span>';
      btnForeverYes.disabled = false;
    }
    if (foreverSubtitle) {
      foreverSubtitle.textContent = "Please choose carefully... there's only one right answer! 🥺💖";
      foreverSubtitle.style.color = '';
      foreverSubtitle.style.fontWeight = '';
    }

    renderActiveBoxSlide();
    closeEnvelope();

    // Reset Cupid bow & arrow intro
    isArrowShot = false;
    if (bowArrowGroup) bowArrowGroup.style.opacity = '';
    if (cupidStruckArrow) cupidStruckArrow.classList.remove('struck');
    if (cupidHeartTarget) cupidHeartTarget.classList.remove('hit-impact');
    if (flyingArrowProjectile) {
      flyingArrowProjectile.classList.remove('is-flying');
      flyingArrowProjectile.style.opacity = '0';
    }
    resetBowString();

    goToScreen('screenCupid');
  });

  // ---------------------------------------------------
  // CONFETTI CANNON
  // ---------------------------------------------------
  function triggerConfetti(intensity = 0.5) {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: Math.floor(70 * intensity),
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#7b182b', '#f8c9d2', '#ffd166', '#ffffff', '#ff6b8b']
      });
    }
  }

  // ---------------------------------------------------
  // CUSTOMIZATION SYSTEM (LocalStorage)
  // ---------------------------------------------------
  const customizeBtn = document.getElementById('customizeBtn');
  const customModal = document.getElementById('customModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const btnSaveCustom = document.getElementById('btnSaveCustom');
  const btnResetDefaults = document.getElementById('btnResetDefaults');

  const inputRecipient = document.getElementById('inputRecipient');
  const inputLetter = document.getElementById('inputLetter');
  const displayRecipient = document.getElementById('displayRecipient');

  const photoInputs = [
    { input: document.getElementById('uploadPhoto1'), preview: document.getElementById('previewPhoto1'), targets: ['polaroidImg1', 'locketImgLeft'] },
    { input: document.getElementById('uploadPhoto2'), preview: document.getElementById('previewPhoto2'), targets: ['polaroidImg2', 'locketImgRight'] },
    { input: document.getElementById('uploadPhoto3'), preview: document.getElementById('previewPhoto3'), targets: ['polaroidImg3'] },
  ];

  const DEFAULT_DATA = {
    recipient: 'BBG',
    letter: DEFAULT_PAGES.join('\n---\n'),
    photo1: 'assets/polaroid_photo_1.jpg?v=3',
    photo2: 'assets/polaroid_photo_2.jpg?v=3',
    photo3: 'assets/polaroid_photo_3.jpg?v=3',
  };

  function parseLetterPages(rawText) {
    if (!rawText) return [...DEFAULT_PAGES];
    const parts = rawText.split(/\n\s*---\s*\n|\s*---\s*/);
    const cleaned = parts.map(p => {
      let trimmed = p.trim();
      return trimmed.replace(/\n\n+/g, '<br><br>').replace(/\n/g, '<br>');
    }).filter(p => p.length > 0);
    return cleaned.length > 0 ? cleaned : [...DEFAULT_PAGES];
  }

  function loadSavedCustomData() {
    const saved = localStorage.getItem('birthday_gift_custom');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.recipient) {
          displayRecipient.textContent = data.recipient;
          inputRecipient.value = data.recipient;
        }
        if (data.letter) {
          letterPages = parseLetterPages(data.letter);
          renderLetterPage(0, false);
          inputLetter.value = data.letter.replace(/<br\s*[\/]?>/gi, '\n').replace(/<[^>]+>/g, '');
        } else {
          renderLetterPage(0, false);
        }
        if (data.photo1 && data.photo1.startsWith('data:image/')) setPhoto('polaroidImg1', 'locketImgLeft', data.photo1);
        if (data.photo2 && data.photo2.startsWith('data:image/')) setPhoto('polaroidImg2', 'locketImgRight', data.photo2);
        if (data.photo3 && data.photo3.startsWith('data:image/')) setPhoto('polaroidImg3', null, data.photo3);
      } catch (e) {
        renderLetterPage(0, false);
      }
    } else {
      renderLetterPage(0, false);
    }
  }

  function setPhoto(targetId1, targetId2, src) {
    const el1 = document.getElementById(targetId1);
    if (el1) el1.src = src;
    if (targetId2) {
      const el2 = document.getElementById(targetId2);
      if (el2) el2.src = src;
    }
  }

  if (customizeBtn) {
    customizeBtn.addEventListener('click', () => {
      if (customModal) customModal.classList.add('open');
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      if (customModal) customModal.classList.remove('open');
    });
  }

  if (customModal) {
    customModal.addEventListener('click', (e) => {
      if (e.target === customModal) customModal.classList.remove('open');
    });
  }

  const uploadGiftVideo = document.getElementById('uploadGiftVideo');
  const customVideoFilename = document.getElementById('customVideoFilename');
  const btnDownloadVideo1 = document.getElementById('btnDownloadVideo1');

  if (btnDownloadVideo1) {
    btnDownloadVideo1.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Lock state to Screen 7 with Gift Box 1 opened
      openedBoxes[1] = true;
      activeBoxIndex = 1;
      const box1 = document.getElementById('mysteryBox1');
      if (box1) {
        box1.classList.add('is-open');
        const hint = box1.querySelector('.box-tap-hint');
        if (hint) hint.textContent = 'Opened! ✨';
      }
      renderActiveBoxSlide();
      sessionStorage.setItem('return_from_download', 'true');
      saveAppState('screenSurprise');

      playCheerSfx();
      triggerConfetti(0.85);

      const downloadUrl = btnDownloadVideo1.getAttribute('href') || 'assets/gift_video.mp4';
      const downloadName = btnDownloadVideo1.getAttribute('download') || 'A_Special_Edit_For_You.mp4';

      // Perform download without causing current window navigation
      const dlLink = document.createElement('a');
      dlLink.href = downloadUrl;
      dlLink.download = downloadName;
      dlLink.target = '_blank';
      dlLink.rel = 'noopener noreferrer';
      document.body.appendChild(dlLink);
      dlLink.click();
      setTimeout(() => {
        if (dlLink.parentNode) dlLink.parentNode.removeChild(dlLink);
      }, 500);
    });
  }

  if (uploadGiftVideo) {
    uploadGiftVideo.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const videoUrl = URL.createObjectURL(file);
        if (btnDownloadVideo1) {
          btnDownloadVideo1.href = videoUrl;
          btnDownloadVideo1.download = file.name || 'special_memory.mp4';
        }
        if (customVideoFilename) {
          customVideoFilename.textContent = file.name;
        }
      }
    });
  }

  // Handle photo file uploads
  photoInputs.forEach((item, idx) => {
    item.input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target.result;
          item.preview.style.backgroundImage = `url(${dataUrl})`;
          item.preview.style.display = 'block';
          item.targets.forEach(tId => {
            const el = document.getElementById(tId);
            if (el) el.src = dataUrl;
          });
          localStorage.setItem(`custom_photo_${idx+1}`, dataUrl);
        };
        reader.readAsDataURL(file);
      }
    });
  });

  btnSaveCustom.addEventListener('click', () => {
    const rawLetter = inputLetter.value.trim() || DEFAULT_DATA.letter;
    const customData = {
      recipient: inputRecipient.value.trim() || 'BBG',
      letter: rawLetter,
      photo1: localStorage.getItem('custom_photo_1') || DEFAULT_DATA.photo1,
      photo2: localStorage.getItem('custom_photo_2') || DEFAULT_DATA.photo2,
      photo3: localStorage.getItem('custom_photo_3') || DEFAULT_DATA.photo3,
    };

    localStorage.setItem('birthday_gift_custom', JSON.stringify(customData));
    displayRecipient.textContent = customData.recipient;
    letterPages = parseLetterPages(rawLetter);
    renderLetterPage(0, isEnvelopeOpen);

    customModal.classList.remove('open');
    playCheerSfx();
    triggerConfetti(0.5);
  });

  btnResetDefaults.addEventListener('click', () => {
    localStorage.removeItem('birthday_gift_custom');
    localStorage.removeItem('custom_photo_1');
    localStorage.removeItem('custom_photo_2');
    localStorage.removeItem('custom_photo_3');
    inputRecipient.value = DEFAULT_DATA.recipient;
    displayRecipient.textContent = DEFAULT_DATA.recipient;
    inputLetter.value = DEFAULT_DATA.letter.replace(/<br\s*[\/]?>/gi, '\n').replace(/<[^>]+>/g, '');
    letterPages = [...DEFAULT_PAGES];
    renderLetterPage(0, isEnvelopeOpen);
    setPhoto('polaroidImg1', null, DEFAULT_DATA.photo1);
    setPhoto('polaroidImg2', null, DEFAULT_DATA.photo2);
    setPhoto('polaroidImg3', null, DEFAULT_DATA.photo3);
    const lLeft = document.getElementById('locketImgLeft');
    const lRight = document.getElementById('locketImgRight');
    if (lLeft) lLeft.src = 'assets/locket_photo_user_1.jpg';
    if (lRight) lRight.src = 'assets/locket_photo_user_2.jpg';
    photoInputs.forEach(i => i.preview.style.display = 'none');
    playPopSfx();
  });

  loadSavedCustomData();

  // Restore user state if returning from download / app switch / refresh
  restoreAppState();

  // Listen for back-forward cache and visibility returns
  window.addEventListener('pageshow', () => {
    restoreAppState();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      restoreAppState();
    }
  });

  // First user interaction auto-starts music
  document.body.addEventListener('click', function unlockAudioOnce() {
    initAudioCtx();
    document.body.removeEventListener('click', unlockAudioOnce);
  }, { once: true });
});
