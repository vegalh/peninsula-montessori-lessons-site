// Shared client-side data layer: lesson catalog, simulated accounts, and
// localStorage-backed favorites/completed state so saves and history stay
// in sync across Discover, My Week, Profile, and lesson detail pages.
(function (global) {
  'use strict';

  var LESSONS = {
    'leaf-transfer': { title: 'Leaf Transfer', age: '2\u20133 years', area: 'Practical Life', duration: '10 min', materials: 3, href: 'leaf-transfer.html', imgSeed: 'leaf-transfer', alt: 'leaf transfer activity' },
    'color-mixing': { title: 'Color Mixing', age: '3\u20134 years', area: 'Science', duration: '15 min', materials: 5, href: 'color-mixing.html', imgSeed: 'color-mixing', alt: 'color mixing activity' },
    'pouring-practice': { title: 'Pouring Practice', age: '2\u20133 years', area: 'Practical Life', duration: '8 min', materials: 4, href: 'pouring-practice.html', imgSeed: 'pouring-practice', alt: 'pouring practice activity' },
    'nature-collage': { title: 'Nature Collage', age: '3\u20135 years', area: 'Art', duration: '20 min', materials: 6, href: 'nature-collage.html', imgSeed: 'nature-collage', alt: 'nature collage activity' }
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

  // Wires every .save-btn[data-lesson] on the page: reflects and toggles
  // the shared favorite state, keeping all instances of a lesson in sync.
  function initSaveButtons(root, onChange) {
    var scope = root || document;
    var buttons = Array.prototype.slice.call(scope.querySelectorAll('.save-btn[data-lesson]'));
    buttons.forEach(function (btn) {
      var lessonId = btn.dataset.lesson;
      btn.setAttribute('aria-pressed', String(isFavorite(lessonId)));
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        var nowSaved = btn.getAttribute('aria-pressed') !== 'true';
        setFavorite(lessonId, nowSaved);
        document.querySelectorAll('.save-btn[data-lesson="' + lessonId + '"]').forEach(function (b) {
          b.setAttribute('aria-pressed', String(nowSaved));
        });
        if (typeof onChange === 'function') {
          onChange(lessonId, nowSaved);
        }
      });
    });
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

  function lessonCardMarkup(lessonId) {
    var lesson = LESSONS[lessonId];
    if (!lesson) {
      return '';
    }
    return (
      '<article class="lesson-card" data-lesson="' + lessonId + '">' +
        '<a href="' + lesson.href + '">' +
          '<img src="https://picsum.photos/seed/' + lesson.imgSeed + '/400/300" alt="Photo coming soon: ' + lesson.alt + '">' +
        '</a>' +
        '<div class="lesson-card-body">' +
          '<div class="lesson-card-header">' +
            '<p class="lesson-card-title">' + lesson.title + '</p>' +
            '<button type="button" class="save-btn" data-lesson="' + lessonId + '" aria-pressed="true" aria-label="Unsave ' + lesson.title + '">&hearts;</button>' +
          '</div>' +
          '<p class="lesson-card-meta">' + lesson.age + ' &middot; ' + lesson.area + '</p>' +
        '</div>' +
      '</article>'
    );
  }

  function weekCardMarkup(lessonId) {
    var lesson = LESSONS[lessonId];
    if (!lesson) {
      return '';
    }
    return (
      '<article class="week-card" data-lesson="' + lessonId + '">' +
        '<a class="week-card-thumb" href="' + lesson.href + '">' +
          '<img src="https://picsum.photos/seed/' + lesson.imgSeed + '/200/200" alt="Photo coming soon: ' + lesson.alt + '">' +
        '</a>' +
        '<div class="week-card-body">' +
          '<p class="lesson-card-title">' + lesson.title + '</p>' +
          '<p class="lesson-card-meta">' + lesson.age + ' &middot; ' + lesson.area + '</p>' +
          '<p class="lesson-card-stats"><span>&#9689; ' + lesson.duration + '</span><span>&#9633; ' + lesson.materials + ' materials</span></p>' +
        '</div>' +
        '<button type="button" class="save-btn" data-lesson="' + lessonId + '" aria-pressed="true" aria-label="Unsave ' + lesson.title + '">&hearts;</button>' +
      '</article>'
    );
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
    initMarkCompleteButtons: initMarkCompleteButtons,
    lessonCardMarkup: lessonCardMarkup,
    weekCardMarkup: weekCardMarkup,
    historyItemMarkup: historyItemMarkup
  };
})(window);
