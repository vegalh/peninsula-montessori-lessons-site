// Shared client-side data layer: lesson catalog, simulated accounts, and
// localStorage-backed favorites/completed state so saves and history stay
// in sync across Discover, My Week, Profile, and lesson detail pages.
(function (global) {
  'use strict';

  var LESSONS = {
    'cleaning-mirror': { title: 'Cleaning Mirror', age: '2\u20133 years', area: 'Practical Life', duration: '10 min', materials: 3, href: 'lessons/cleaning-mirror.html', image: 'images/cleaning-mirror.jpg', alt: 'a child spraying and wiping a mirror clean' },
    'making-orange-juice': { title: 'Making Orange Juice', age: '2\u20133 years', area: 'Practical Life', duration: '12 min', materials: 3, href: 'lessons/making-orange-juice.html', image: 'images/making-orange-juice.jpg', alt: 'a child using a hand juicer to make orange juice' },
    'mopping': { title: 'Mopping', age: '2\u20133 years', area: 'Practical Life', duration: '15 min', materials: 3, href: 'lessons/mopping.html', image: 'images/mopping.jpg', alt: 'a child pushing a child-sized mop across the floor' },
    'peeling-and-cutting-egg': { title: 'Peeling and Cutting Egg', age: '2\u20133 years', area: 'Practical Life', duration: '12 min', materials: 3, href: 'lessons/peeling-and-cutting-egg.html', image: 'images/peeling-and-cutting-egg.jpg', alt: 'a child peeling and slicing a hard-boiled egg' },
    'peeling-cabbage': { title: 'Peeling Cabbage', age: '2\u20133 years', area: 'Practical Life', duration: '10 min', materials: 2, href: 'lessons/peeling-cabbage.html', image: 'images/peeling-cabbage.jpg', alt: 'a child peeling leaves from a cabbage' },
    'peeling-orange': { title: 'Peeling Orange', age: '2\u20133 years', area: 'Practical Life', duration: '10 min', materials: 3, href: 'lessons/peeling-orange.html', image: 'images/peeling-orange.jpg', alt: 'a child peeling an orange' },
    'red-rods-maze': { title: 'Red Rods Maze', age: '2\u20133 years', area: 'Sensorial', duration: '15 min', materials: 'Red rods set', href: 'lessons/red-rods-maze.html', image: 'images/red-rods-maze.jpg', alt: 'a child walking along a maze path made of red rods' },
    'wipe-the-board': { title: 'Wipe the Board', age: '2\u20133 years', area: 'Practical Life', duration: '8 min', materials: 2, href: 'lessons/wipe-the-board.html', image: 'images/wipe-the-board.jpg', alt: 'a child erasing a chalkboard' }
  };

  var USERS = {
    yoyo: { id: 'yoyo', name: 'Yoyo', email: 'yoyo@peninsulamontessori.example', role: 'Teacher', photoSeed: 'yoyo-profile' },
    reki: { id: 'reki', name: 'Reki', email: 'reki@peninsulamontessori.example', role: 'Teacher', photoSeed: 'reki-profile' }
  };

  function getCurrentUserId() {
    var id = localStorage.getItem('pml_currentUser');
    return USERS[id] ? id : 'yoyo';
  }

  function setCurrentUserId(id) {
    if (USERS[id]) {
      localStorage.setItem('pml_currentUser', id);
    }
  }

  function getUser() {
    return USERS[getCurrentUserId()];
  }

  function readList(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function writeList(key, list) {
    localStorage.setItem(key, JSON.stringify(list));
  }

  function favoritesKey() {
    return 'pml_favorites_' + getCurrentUserId();
  }

  function completedKey() {
    return 'pml_completed_' + getCurrentUserId();
  }

  function getFavorites() {
    return readList(favoritesKey()).filter(function (id) {
      return !!LESSONS[id];
    });
  }

  function isFavorite(lessonId) {
    return getFavorites().indexOf(lessonId) !== -1;
  }

  function setFavorite(lessonId, saved) {
    var favs = getFavorites();
    var idx = favs.indexOf(lessonId);
    if (saved && idx === -1) {
      favs.push(lessonId);
    } else if (!saved && idx !== -1) {
      favs.splice(idx, 1);
    }
    writeList(favoritesKey(), favs);
    return favs;
  }

  function getCompleted() {
    return readList(completedKey());
  }

  function formatToday() {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function isCompletedToday(lessonId) {
    var todayLabel = formatToday();
    return getCompleted().some(function (entry) {
      return entry.id === lessonId && entry.dateLabel === todayLabel;
    });
  }

  function addCompleted(lessonId) {
    if (isCompletedToday(lessonId)) {
      return getCompleted();
    }
    var list = getCompleted();
    list.unshift({ id: lessonId, dateLabel: formatToday() });
    writeList(completedKey(), list);
    return list;
  }

  // Some save buttons are styled as a full CTA ("Add to My Week") rather
  // than a bare heart icon; swap their visible label text with the state.
  function applyCtaLabel(btn, saved) {
    var textEl = btn.querySelector('.cta-text');
    if (!textEl) {
      return;
    }
    textEl.textContent = saved
      ? (btn.dataset.ctaLabelActive || btn.dataset.ctaLabel)
      : btn.dataset.ctaLabel;
  }

  // Wires every .save-btn[data-lesson] on the page: reflects and toggles
  // the shared favorite state, keeping all instances of a lesson in sync
  // (including plain heart icons and full-width "Add to My Week" CTAs).
  function initSaveButtons(root, onChange) {
    var scope = root || document;
    var buttons = Array.prototype.slice.call(scope.querySelectorAll('.save-btn[data-lesson]'));
    buttons.forEach(function (btn) {
      var lessonId = btn.dataset.lesson;
      var saved = isFavorite(lessonId);
      btn.setAttribute('aria-pressed', String(saved));
      applyCtaLabel(btn, saved);
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        var nowSaved = btn.getAttribute('aria-pressed') !== 'true';
        setFavorite(lessonId, nowSaved);
        document.querySelectorAll('.save-btn[data-lesson="' + lessonId + '"]').forEach(function (b) {
          b.setAttribute('aria-pressed', String(nowSaved));
          applyCtaLabel(b, nowSaved);
        });
        if (typeof onChange === 'function') {
          onChange(lessonId, nowSaved);
        }
      });
    });
  }

  // Wires every .share-btn[data-lesson]: uses the native share sheet when
  // available, otherwise copies the lesson link to the clipboard.
  function initShareButtons(root) {
    var scope = root || document;
    var buttons = Array.prototype.slice.call(scope.querySelectorAll('.share-btn[data-lesson]'));
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        var lesson = LESSONS[btn.dataset.lesson];
        var url = window.location.href;
        var title = lesson ? lesson.title : document.title;
        if (navigator.share) {
          navigator.share({ title: title, url: url }).catch(function () {});
          return;
        }
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(function () {
            showToast('Link copied!');
          });
        } else {
          showToast(url);
        }
      });
    });
  }

  function showToast(message) {
    var toast = document.createElement('div');
    toast.className = 'pml-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.remove();
    }, 2000);
  }

  // Wires every .mark-complete-btn[data-lesson]: logs one usage entry per
  // calendar day and reflects whether today's lesson is already logged.
  function initMarkCompleteButtons(root) {
    var scope = root || document;
    var buttons = Array.prototype.slice.call(scope.querySelectorAll('.mark-complete-btn[data-lesson]'));
    buttons.forEach(function (btn) {
      var lessonId = btn.dataset.lesson;

      function refresh() {
        btn.textContent = isCompletedToday(lessonId) ? 'Marked Complete Today \u2713' : 'Mark as Complete';
      }

      refresh();
      btn.addEventListener('click', function () {
        addCompleted(lessonId);
        refresh();
      });
    });
  }

  // Lessons with a real photo use `image`; lessons without one yet fall
  // back to a Lorem Picsum placeholder seeded by `imgSeed`.
  function imageSrc(lesson, size) {
    return lesson.image || ('https://picsum.photos/seed/' + lesson.imgSeed + '/' + size);
  }

  function imageAlt(lesson) {
    return lesson.image ? lesson.alt : 'Photo coming soon: ' + lesson.alt;
  }

  function lessonCardMarkup(lessonId) {
    var lesson = LESSONS[lessonId];
    if (!lesson) {
      return '';
    }
    return (
      '<article class="lesson-card" data-lesson="' + lessonId + '">' +
        '<a href="' + lesson.href + '">' +
          '<img src="' + imageSrc(lesson, '400/300') + '" alt="' + imageAlt(lesson) + '">' +
        '</a>' +
        '<div class="lesson-card-body">' +
          '<div class="lesson-card-header">' +
            '<a class="lesson-card-title" href="' + lesson.href + '">' + lesson.title + '</a>' +
            '<button type="button" class="save-btn" data-lesson="' + lessonId + '" aria-pressed="true" aria-label="Unsave ' + lesson.title + '">&hearts;</button>' +
          '</div>' +
          '<p class="lesson-card-meta">' + lesson.age + ' &middot; ' + lesson.area + '</p>' +
        '</div>' +
      '</article>'
    );
  }

  function materialsLabel(lesson) {
    return typeof lesson.materials === 'number' ? lesson.materials + ' materials' : lesson.materials;
  }

  function weekCardMarkup(lessonId) {
    var lesson = LESSONS[lessonId];
    if (!lesson) {
      return '';
    }
    return (
      '<article class="week-card" data-lesson="' + lessonId + '">' +
        '<a class="week-card-thumb" href="' + lesson.href + '">' +
          '<img src="' + imageSrc(lesson, '200/200') + '" alt="' + imageAlt(lesson) + '">' +
        '</a>' +
        '<a class="week-card-body" href="' + lesson.href + '">' +
          '<p class="lesson-card-title">' + lesson.title + '</p>' +
          '<p class="lesson-card-meta">' + lesson.age + ' &middot; ' + lesson.area + '</p>' +
          '<p class="lesson-card-stats"><span>&#9689; ' + lesson.duration + '</span><span>&#9633; ' + materialsLabel(lesson) + '</span></p>' +
        '</a>' +
        '<div class="card-menu" data-lesson="' + lessonId + '">' +
          '<button type="button" class="card-menu-btn" aria-haspopup="true" aria-expanded="false" aria-label="More options for ' + lesson.title + '">&hellip;</button>' +
          '<div class="card-menu-panel" role="menu" hidden>' +
            '<button type="button" class="card-menu-item remove-saved-btn" data-lesson="' + lessonId + '" role="menuitem">Remove from Saved</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  // Wires every .card-menu[data-lesson] kebab button: toggles its popover
  // and wires "Remove from Saved" to unfavorite + notify via onRemove.
  function initCardMenus(root, onRemove) {
    var scope = root || document;
    var menus = Array.prototype.slice.call(scope.querySelectorAll('.card-menu[data-lesson]'));
    menus.forEach(function (menu) {
      var lessonId = menu.dataset.lesson;
      var toggle = menu.querySelector('.card-menu-btn');
      var panel = menu.querySelector('.card-menu-panel');
      var removeBtn = menu.querySelector('.remove-saved-btn');

      toggle.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var isOpen = !panel.hidden;
        document.querySelectorAll('.card-menu-panel').forEach(function (p) {
          p.hidden = true;
        });
        document.querySelectorAll('.card-menu-btn').forEach(function (b) {
          b.setAttribute('aria-expanded', 'false');
        });
        panel.hidden = isOpen;
        toggle.setAttribute('aria-expanded', String(!isOpen));
      });

      if (removeBtn) {
        removeBtn.addEventListener('click', function (event) {
          event.preventDefault();
          setFavorite(lessonId, false);
          panel.hidden = true;
          toggle.setAttribute('aria-expanded', 'false');
          if (typeof onRemove === 'function') {
            onRemove(lessonId);
          }
        });
      }
    });

    document.addEventListener('click', function () {
      document.querySelectorAll('.card-menu-panel').forEach(function (p) {
        p.hidden = true;
      });
      document.querySelectorAll('.card-menu-btn').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function historyItemMarkup(entry) {
    var lesson = LESSONS[entry.id];
    var title = lesson ? lesson.title : entry.id;
    var href = lesson ? lesson.href : '#';
    return (
      '<li class="history-item">' +
        '<a class="history-title" href="' + href + '">' + title + '</a>' +
        '<span class="history-date">Used ' + entry.dateLabel + '</span>' +
      '</li>'
    );
  }

  global.PML = {
    LESSONS: LESSONS,
    USERS: USERS,
    getCurrentUserId: getCurrentUserId,
    setCurrentUserId: setCurrentUserId,
    getUser: getUser,
    getFavorites: getFavorites,
    isFavorite: isFavorite,
    setFavorite: setFavorite,
    getCompleted: getCompleted,
    addCompleted: addCompleted,
    isCompletedToday: isCompletedToday,
    initSaveButtons: initSaveButtons,
    initShareButtons: initShareButtons,
    initMarkCompleteButtons: initMarkCompleteButtons,
    initCardMenus: initCardMenus,
    showToast: showToast,
    lessonCardMarkup: lessonCardMarkup,
    weekCardMarkup: weekCardMarkup,
    historyItemMarkup: historyItemMarkup
  };
})(window);
