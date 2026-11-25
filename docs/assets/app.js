/* Xyra Streamer Hub — enhancement JS (classic script, tanpa sintaks modern).
   Navigasi & konten inti tetap HTML statis; JS ini hanya:
   - download  : isi kartu versi dari data/releases.json
   - changelog : render daftar versi dari data/releases.json
   - cara-pakai: render video dari data/video.json
   Semua akses elemen di-guard; halaman tetap berguna tanpa JS. */

(function () {
  'use strict';

  window.__xyraBoot = false;

  function el(id) {
    return document.getElementById(id);
  }

  function setText(node, text) {
    if (node) node.textContent = text;
  }

  function showFatal(message) {
    var box = el('boot-error');
    if (box) {
      box.hidden = false;
      box.textContent = 'Gagal memuat data: ' + message + '. Coba refresh halaman.';
    }
  }

  window.addEventListener('error', function (event) {
    var message = event && (event.message || (event.error && event.error.message));
    if (message) showFatal(message);
  });

  window.addEventListener('unhandledrejection', function (event) {
    var reason = event && event.reason;
    showFatal((reason && reason.message) || String(reason));
  });

  var ROOT = document.body.getAttribute('data-root') || '';
  var REPO_RELEASES = 'https://github.com/xyra-dev/xyra-streamer-hub/releases';

  function fetchJSON(url, onDone, onFail) {
    fetch(url, { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(onDone)
      .catch(onFail);
  }

  function downloadUrl(fileName) {
    return REPO_RELEASES + '/latest/download/' + encodeURIComponent(fileName || '');
  }

  function showToast(message) {
    var toast = el('xyra-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'xyra-toast';
      toast.className = 'toast-pill';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 1800);
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast(successMsg || 'Tersalin!');
      }).catch(function () {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand('copy');
      showToast(successMsg || 'Tersalin!');
    } catch (e) {
      showToast('Gagal salin: ' + text);
    }
    area.parentNode.removeChild(area);
  }

  /* ---------- halaman download ---------- */

  function initDownload() {
    var btn = el('dl-btn');
    var oldList = el('dl-old');
    var copyShaBtn = el('copy-sha-btn');
    var shaCode = el('dl-sha');

    if (copyShaBtn) {
      copyShaBtn.addEventListener('click', function () {
        var text = (shaCode && shaCode.textContent) || '';
        if (!text) return;
        copyToClipboard(text, 'SHA-256 berhasil disalin!');
      });
    }

    fetchJSON(
      ROOT + 'data/releases.json',
      function (data) {
        var latest = data && data.latest;
        if (latest) {
          setText(el('dl-version'), 'v' + latest.version);
          setText(el('dl-date'), latest.date);
          setText(el('dl-size'), latest.sizeText || '');
          setText(el('dl-min'), latest.minAndroid || '');
          setText(el('dl-arch'), latest.arch || '');
          setText(el('dl-sha'), latest.sha256 || '');
          if (btn && latest.file) btn.href = downloadUrl(latest.file);
          if (oldList) {
            var history = (data && data.history) || [];
            var html = '';
            for (var i = 0; i < history.length; i += 1) {
              var item = history[i];
              html +=
                '<li><span class="ver">v' + item.version +
                '</span><span class="date">' + item.date +
                ' · <a href="' + REPO_RELEASES + '">APK di Releases</a></span></li>';
            }
            oldList.innerHTML = html;
          }
        }
        window.__xyraBoot = true;
      },
      function (error) {
        window.__xyraBoot = true;
        showFatal((error && error.message) || 'tidak diketahui');
      }
    );
  }

  /* ---------- halaman changelog ---------- */

  function releaseHtml(item, isLatest) {
    var notes = (item && item.notes) || [];
    var listHtml = '';
    for (var i = 0; i < notes.length; i += 1) {
      listHtml += '<li>' + notes[i] + '</li>';
    }
    if (!listHtml) listHtml = '<li>Perbaikan & pemeliharaan</li>';
    return (
      '<article class="release' + (isLatest ? ' is-latest' : '') + '">' +
      '<div class="release-head">' +
      '<h3>v' + item.version + '</h3>' +
      (isLatest ? '<span class="tag-latest">Terbaru</span>' : '') +
      '<span class="release-date">' + (item.date || '') + '</span>' +
      '</div><ul>' + listHtml + '</ul>' +
      '</article>'
    );
  }

  function initChangelog() {
    var wrap = el('changelog-list');
    if (!wrap) {
      window.__xyraBoot = true;
      return;
    }

    fetchJSON(
      ROOT + 'data/releases.json',
      function (data) {
        var latest = data && data.latest;
        var history = (data && data.history) || [];
        var html = '';
        if (latest) html += releaseHtml(latest, true);
        for (var i = 0; i < history.length; i += 1) {
          html += releaseHtml(history[i], false);
        }
        if (html) {
          var fallback = el('changelog-static');
          if (fallback) fallback.parentNode.removeChild(fallback);
          wrap.innerHTML = html;
        }
        window.__xyraBoot = true;
      },
      function (error) {
        window.__xyraBoot = true;
        /* fallback statis sudah ada di HTML; cukup laporkan di #boot-error */
        showFatal((error && error.message) || 'tidak diketahui');
      }
    );
  }

  /* ---------- halaman cara-pakai (video) ---------- */

  function youTubeEmbed(id) {
    return (
      'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
      '?autoplay=1&rel=0'
    );
  }

  function initVideo() {
    var frameRoot = el('video-root');
    var metaTitle = el('video-title');
    var channelBtn = el('video-channel');

    fetchJSON(
      ROOT + 'data/video.json',
      function (video) {
        video = video || {};
        if (metaTitle && video.title) metaTitle.textContent = video.title;
        if (channelBtn) {
          if (video.channelUrl) {
            channelBtn.href = video.channelUrl;
          } else {
            channelBtn.parentNode.removeChild(channelBtn);
          }
        }

        if (frameRoot) {
          if (video.youtubeId) {
            var thumb =
              'https://i.ytimg.com/vi/' + encodeURIComponent(video.youtubeId) +
              '/hqdefault.jpg';
            frameRoot.innerHTML =
              '<button type="button" class="video-thumb" ' +
              'aria-label="Putar video: ' + String(video.title || 'Cara pakai').replace(/"/g, '') + '" ' +
              'style="background-image:url(' + thumb + ')">' +
              '<span class="play" aria-hidden="true"></span></button>';

            var playBtn = frameRoot.querySelector('.video-thumb');
            if (playBtn) {
              playBtn.addEventListener('click', function () {
                frameRoot.innerHTML =
                  '<iframe src="' + youTubeEmbed(video.youtubeId) + '" ' +
                  'title="Video cara pakai" allow="accelerometer; autoplay; ' +
                  'clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
                  'allowfullscreen></iframe>';
              });
            }

            var chapters = video.chapters || [];
            var chapterWrap = el('video-chapters');
            if (chapterWrap && chapters.length) {
              var html = '';
              for (var i = 0; i < chapters.length; i += 1) {
                var c = chapters[i];
                html +=
                  '<li><a href="https://youtu.be/' + encodeURIComponent(video.youtubeId) +
                  '?t=' + encodeURIComponent(c.t) + '">' + c.label + '</a></li>';
              }
              chapterWrap.innerHTML = html;
              var head = el('video-chapters-head');
              if (head) head.hidden = false;
            }
          } else {
            frameRoot.innerHTML =
              '<div class="video-empty"><span class="big" aria-hidden="true">🎬</span>' +
              '<b>Video segera hadir</b>' +
              '<span>Panduan lengkap sedang disiapkan di YouTube.</span></div>';
          }
        }
        window.__xyraBoot = true;
      },
      function (error) {
        window.__xyraBoot = true;
        showFatal((error && error.message) || 'tidak diketahui');
      }
    );
  }

  /* ---------- router sederhana ---------- */

  var page = document.body.getAttribute('data-page');

  if (page === 'download') {
    initDownload();
  } else if (page === 'changelog') {
    initChangelog();
  } else if (page === 'cara-pakai') {
    initVideo();
  } else {
    window.__xyraBoot = true;
  }
})();
