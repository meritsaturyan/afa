/**
 * Переключатель языков (am/ru/en).
 * - currentLang по URL (армянский в корне, ru/en в папках).
 * - currentFile — имя файла страницы; fallback на index.html если не в knownPages.
 * - BASE: /afa для GitHub Pages (project site), иначе ''.
 * Подставляет href в .lang_link и обновляет текст кнопки #lang_btn.
 */
(function () {
    var pathname = window.location.pathname || '/';
    var pathSegs = pathname.split('/').filter(Boolean);
    var BASE = (pathSegs[0] === 'afa') ? '/afa' : '';
    var segs = BASE ? pathSegs.slice(1) : pathSegs;

    var currentLang, currentFile;
    if (segs.length >= 2 && (segs[0] === 'ru' || segs[0] === 'en')) {
        currentLang = segs[0];
        currentFile = segs[1] || 'index.html';
    } else if (segs.length >= 1) {
        currentLang = 'am';
        currentFile = segs[0] || 'index.html';
    } else {
        currentLang = 'am';
        currentFile = 'index.html';
    }

    var knownPages = ['index.html','andamakcutyan_hayt.html','andamner.html','ashxatatexer.html','gorcakir.html','gorcuneutyun.html','gorcynkerner.html','gorcynkerner_new.html','hetadardk_kap.html','inchuandamakcel.html','khorhurd.html','mermasin.html','mijotsaranner.html','norutyunner.html','norutyunner_hamajoxov.html','norutyunner_korporativ.html','norutyunner_scopus.html','tsarayutyunner.html','haytararutyunner.html','harotsaruytsner.html'];
    var file = knownPages.indexOf(currentFile) >= 0 ? currentFile : 'index.html';

    function getTargetUrl(targetLang) {
        if (targetLang === 'am') return BASE + '/' + file;
        return BASE + '/' + targetLang + '/' + file;
    }

    var btn = document.getElementById('lang_btn');
    var links = document.querySelectorAll('#lang_dropdown .lang_link');
    if (!btn || !links.length) return;
    btn.textContent = currentLang;
    [].forEach.call(links, function (link) {
        var lang = link.getAttribute('data-lang');
        if (!lang) return;
        var url = getTargetUrl(lang);
        link.setAttribute('href', url);
        link.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = url;
        });
    });
})();
