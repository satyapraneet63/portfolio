// Progressive enhancement: positions .sidenote elements into the shared
// .sidebar rail, aligned with their trigger paragraph, on viewports wide
// enough for .content-layout to be side-by-side (matches $container-
// breakpoint in main.scss — keep these two in sync if that value moves).
// Below the breakpoint, or if anything here fails to find what it needs,
// sidenotes are left as the plain in-flow blocks defined in _sidenote.scss.
(function () {
  var BREAKPOINT = 1100;
  var RAIL_WIDTH = 220;
  var GAP = 12;

  function reset(notes) {
    for (var i = 0; i < notes.length; i++) {
      notes[i].classList.remove('sidenote--positioned');
      notes[i].style.top = '';
      notes[i].style.width = '';
    }
  }

  function visibleSections(sidebar) {
    var sections = sidebar.querySelectorAll('.sidebar-section');
    var visible = [];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetHeight > 0) visible.push(sections[i]);
    }
    return visible;
  }

  function position() {
    var layout = document.querySelector('.content-layout');
    var notes = document.querySelectorAll('.sidenote');
    if (!layout || !notes.length) return;

    var sidebar = layout.querySelector('.sidebar');
    if (!sidebar || window.innerWidth < BREAKPOINT) {
      reset(notes);
      return;
    }

    var layoutTop = layout.getBoundingClientRect().top;
    var sections = visibleSections(sidebar);
    var lastSection = sections[sections.length - 1];
    var minTop = lastSection
      ? lastSection.getBoundingClientRect().bottom - layoutTop + GAP
      : 0;

    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];
      var trigger = note.closest('p, li, blockquote') || note.parentElement;
      var naturalTop = trigger.getBoundingClientRect().top - layoutTop;
      var top = Math.max(naturalTop, minTop);

      note.classList.add('sidenote--positioned');
      note.style.width = RAIL_WIDTH + 'px';
      note.style.top = top + 'px';

      minTop = top + note.getBoundingClientRect().height + GAP;
    }
  }

  var resizeTimer;
  function schedule() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(position, 150);
  }

  window.addEventListener('resize', schedule);
  window.addEventListener('load', position);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', position);
  } else {
    position();
  }
})();
