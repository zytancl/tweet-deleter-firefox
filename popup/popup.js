// ─── i18n strings ────────────────────────────────────────────────────────────
const I18N = {
  en: {
    title:                "Tweet Cleaner v1.3",
    tab_filters:          "Filters",
    label_keywords:       "Keyword filter (comma-separated)",
    placeholder_keywords: "e.g. hate, love, whatever",
    help_keywords:        "Only tweets containing these keywords will be deleted",
    label_ignore:         "Ignore tweet IDs (comma-separated)",
    placeholder_ignore:   "Numbers from the tweet link: 1234567890,9876543210",
    help_ignore:          "Tweets with these IDs will not be deleted",
    label_unretweet:      "Undo retweets",
    label_keepPin:        "Keep pinned tweet",
    label_linkOnly:       "Only tweets with links",
    label_debug:          "Debug mode",
    help_debug:           "Print detailed logs to console",
    label_authStatus:     "API Auth Status",
    auth_checking:        "Checking...",
    auth_ok:              "✓ API credentials captured",
    auth_missing:         "⚠ Scroll the replies tab on X.com",
    btn_refreshAuth:      "Refresh auth info",
    help_auth:            "If there's an issue, refresh your X.com profile page and scroll",
    btn_clean:            "Start deleting tweets!",
    status_working:       "Working...",
    status_running:       "Running! Keep this tab open. You'll be notified when done.",
    status_no_auth:       "No API credentials. Scroll the replies tab on your X.com profile, then try again.",
    status_reload:        "Page reloaded. Wait a few seconds then try again.",
    err_no_tab:           "Could not find active tab.",
    err_wrong_site:       "Please open X.com first.",
    err_wrong_site_auth:  "Only works while on X.com.",
    err_inject:           "Script injection failed",
    err_prefix:           "Error: ",
  },
  ko: {
    title:                "트윗 청소기 v1.3",
    tab_filters:          "필터",
    label_keywords:       "키워드 필터 (쉼표로 구분)",
    placeholder_keywords: "예: 싫다, 좋다, 어쩌구",
    help_keywords:        "이 키워드가 포함된 트윗만 삭제됩니다",
    label_ignore:         "무시할 트윗 ID (쉼표로 구분)",
    placeholder_ignore:   "링크에 있는 숫자: 1234567890,9876543210",
    help_ignore:          "이 ID를 가진 트윗은 삭제하지 않습니다",
    label_unretweet:      "리트윗 취소",
    label_keepPin:        "고정트윗 유지",
    label_linkOnly:       "링크 포함 트윗만",
    label_debug:          "디버그 모드",
    help_debug:           "콘솔에 상세 로그를 출력합니다",
    label_authStatus:     "API 인증 상태",
    auth_checking:        "확인 중...",
    auth_ok:              "✓ API 인증 정보 확보됨",
    auth_missing:         "⚠ X.com에서 reply탭을 스크롤해 주세요.",
    btn_refreshAuth:      "인증 정보 갱신",
    help_auth:            "문제가 있으면 X.com 프로필을 새로고침 후 스크롤해보세요",
    btn_clean:            "트윗 삭제 시작!",
    status_working:       "작업 중...",
    status_running:       "실행 중! 탭을 유지하세요. 완료 후 알림이 표시됩니다.",
    status_no_auth:       "API 인증 정보가 없습니다. X.com 프로필 페이지에서 스크롤 후 재시도해주세요.",
    status_reload:        "페이지를 다시 로드했습니다. 몇 초 후 다시 시도하세요.",
    err_no_tab:           "활성 탭을 찾을 수 없습니다.",
    err_wrong_site:       "먼저 X.com에 접속해주세요.",
    err_wrong_site_auth:  "X.com에 접속한 상태에서만 가능합니다.",
    err_inject:           "스크립트 삽입 실패",
    err_prefix:           "오류: ",
  }
};

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const cleanBtn   = document.getElementById('cleanBtn');
  const statusText = document.getElementById('status');
  const langToggle = document.getElementById('langToggle');
  const langLabel  = document.getElementById('langLabel');

  let lang = 'en';

  // ── Apply all i18n strings to the DOM ──
  function applyLang() {
    const t = I18N[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) el.placeholder = t[key];
    });
    langLabel.textContent = lang === 'en' ? 'KO' : 'EN'; // show what you'll switch TO
    updateAuthStatus();
  }

  // ── Language toggle ──
  langToggle.addEventListener('click', () => {
    lang = lang === 'en' ? 'ko' : 'en';
    chrome.storage.local.set({ uiLang: lang });
    applyLang();
  });

  // ── Tab switching ──
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabId = tab.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(tabId)?.classList.add('active');
    });
  });

  const showStatus = (msg, isError = false) => {
    statusText.textContent = msg;
    statusText.classList.toggle('error', isError);
    statusText.style.display = 'block';
  };

  const $ = id => document.getElementById(id);

  const getOptions = () => {
    const keywordsRaw = $("keywords")?.value || "";
    const ignoreRaw   = $("ignore")?.value   || "";
    return {
      unretweet: $("unretweet")?.checked || false,
      keepPin:   $("keepPin")?.checked   || false,
      linkOnly:  $("linkOnly")?.checked  || false,
      keywords:  keywordsRaw ? keywordsRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
      ignore:    ignoreRaw   ? ignoreRaw.split(',').map(s => s.trim()).filter(Boolean)   : [],
      debug:     $("debugMode")?.checked || false
    };
  };

  // ── Clean button ──
  cleanBtn.addEventListener('click', async () => {
    const t = I18N[lang];
    showStatus(t.status_working);
    try {
      const opts = getOptions();
      await chrome.storage.local.set({ opts });

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) throw new Error(t.err_no_tab);

      if (!tab.url.includes('x.com') && !tab.url.includes('twitter.com')) {
        throw new Error(t.err_wrong_site);
      }

      const credentials = await chrome.storage.local.get(['bearer', 'timelineCTID', 'tweetsQry', 'tweetsQS']);
      const hasAuth = credentials.bearer && credentials.timelineCTID && credentials.tweetsQry;
      if (!hasAuth) {
        showStatus(t.status_no_auth, true);
        return;
      }

      const response = await chrome.runtime.sendMessage({ cmd: "inject-cleaner", tabId: tab.id });
      if (!response.ok) throw new Error(response.err || t.err_inject);

      showStatus(t.status_running);
    } catch (err) {
      showStatus(t.err_prefix + err.message, true);
      console.error(err);
    }
  });

  // ── Refresh auth ──
  $('refreshAuth')?.addEventListener('click', async () => {
    const t = I18N[lang];
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.url.includes('x.com') && !tab.url.includes('twitter.com')) {
        throw new Error(t.err_wrong_site_auth);
      }
      await chrome.tabs.reload(tab.id);
      showStatus(t.status_reload);
    } catch (err) {
      showStatus(t.err_prefix + err.message, true);
    }
  });

  // ── Restore saved options ──
  chrome.storage.local.get(['opts', 'uiLang'], ({ opts, uiLang }) => {
    if (uiLang === 'ko' || uiLang === 'en') lang = uiLang;
    applyLang();

    if (!opts) return;
    $('unretweet').checked = opts.unretweet !== false;
    $('keepPin').checked   = opts.keepPin   !== false;
    $('linkOnly').checked  = opts.linkOnly  === true;
    if ($('debugMode')) $('debugMode').checked = opts.debug === true;
    if (opts.keywords?.length) $('keywords').value = opts.keywords.join(', ');
    if (opts.ignore?.length)   $('ignore').value   = opts.ignore.join(', ');
  });

  // ── Auth status indicator ──
  function updateAuthStatus() {
    const t = I18N[lang];
    chrome.storage.local.get(['bearer', 'timelineCTID', 'tweetsQry'], (data) => {
      const hasAuth = data.bearer && data.timelineCTID && data.tweetsQry;
      const el = $('authStatus');
      if (el) {
        el.textContent   = hasAuth ? t.auth_ok : t.auth_missing;
        el.style.color   = hasAuth ? "green"   : "orange";
      }
    });
  }

  updateAuthStatus();
  setInterval(updateAuthStatus, 5000);
});
