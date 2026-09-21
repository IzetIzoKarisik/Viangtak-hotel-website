// ===== Cookie banner + Google Analytics =====

const GA_ID = 'G-EXMP2T6SFX';


// ----- 1. Google Analytics -----
// This is Google's own code. It only runs after the visitor clicks Accept.
function loadGoogleAnalytics() {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID);
}


// ----- 2. Banner style -----
function addBannerStyle() {
    const style = document.createElement('style');
    style.textContent = `
    #cookie-banner {
      position: fixed;
      right: max(1.5rem, calc((100vw - 1200px) / 2 + 1.5rem));
      bottom: 1.5rem;
      z-index: 1000;
      max-width: 360px;
      padding: 1.25rem 1.5rem;
      text-align: center;
      background: rgba(18, 20, 14, 0.88);
      backdrop-filter: blur(8px);
      color: #f3efe6;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      font-family: "Inter", system-ui, sans-serif;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    #cookie-banner p {
      margin: 0 0 1rem;
    }

    #cookie-banner button {
      font: inherit;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      padding: 0.6rem 1.25rem;
      margin: 0 0.25rem;
      border-radius: 999px;
      cursor: pointer;
    }

    #cookie-banner button:hover {
      opacity: 0.85;
    }

    .cookie-decline {
      background: transparent;
      color: #f3efe6;
      border: 1px solid rgba(255, 255, 255, 0.4);
    }

    .cookie-accept {
      background: #5b7a1e;
      color: #fff;
      border: 1px solid #5b7a1e;
    }

    #cookie-banner a {
      color: inherit;
      text-decoration: underline;
    }

    html[lang="th"] #cookie-banner button {
      letter-spacing: 0.02em;
    }

    @media (max-width: 480px) {
      #cookie-banner {
        left: 1rem;
        right: 1rem;
        bottom: 1rem;
        max-width: none;
      }
    }
  `;
    document.head.appendChild(style);
}


// ----- 3. Banner -----
function showCookieBanner() {
    addBannerStyle();

    // English text (default)
    let message = 'We use cookies to understand how visitors use our site. <a href="privacy.html">Privacy policy</a>';
    let declineText = 'Decline';
    let acceptText = 'Accept';

    // Thai text, if this is a Thai page
    if (document.documentElement.lang === 'th') {
        message = 'เว็บไซต์นี้ใช้คุกกี้เพื่อเก็บสถิติการเข้าชม <a href="privacy-th.html">นโยบายความเป็นส่วนตัว</a>';
        declineText = 'ปฏิเสธ';
        acceptText = 'ยอมรับ';
    }

    // Build the banner
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
    <p>${message}</p>
    <button class="cookie-decline">${declineText}</button>
    <button class="cookie-accept">${acceptText}</button>
  `;
    document.body.appendChild(banner);

    // When Accept is clicked
    const acceptButton = banner.querySelector('.cookie-accept');
    acceptButton.addEventListener('click', function () {
        localStorage.setItem('cookie-choice', 'accepted');
        banner.remove();
        loadGoogleAnalytics();
    });

    // When Decline is clicked
    const declineButton = banner.querySelector('.cookie-decline');
    declineButton.addEventListener('click', function () {
        localStorage.setItem('cookie-choice', 'declined');
        banner.remove();
    });
}


// ===== Start here =====
// Check what the visitor chose last time.
const savedChoice = localStorage.getItem('cookie-choice');

if (savedChoice === 'accepted') {
    loadGoogleAnalytics();   // said Accept before → track, no banner
} else if (savedChoice === null) {
    showCookieBanner();      // first visit → show banner
}
// said Decline before → do nothing