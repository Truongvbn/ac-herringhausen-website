/*
 * The menu of the mobile layout of the template designs (mobile_layout.css): on the screens of the template's media
 * query (data-media), the template's own menu head opens and closes the menu. On other screens, and in browsers
 * without :has() (the stylesheet does not apply there), the page stays as it is.
 */
(function () {
  var script = document.currentScript;
  var query = script && script.getAttribute('data-media');
  if (!query || !window.matchMedia || !window.CSS || !CSS.supports || !CSS.supports('selector(:has(a))')) {
    return;
  }

  var media = window.matchMedia(query);
  var root = document.documentElement;
  var toggle = null;
  var icon = null;
  var list = null;
  var ownToggle = false;
  var ownListId = false;
  var ownLabel = false;
  var titleMark = null;
  var scrollBoxes = [];
  var swipeHints = [];
  var languagesItem = null;
  var shadowed = [];
  var averages = {};

  // "Menu" in the language of the website (the header gives it; without it, by the language of the page)
  function menuLabel() {
    var given = script.getAttribute('data-menu-label');
    if (given) {
      return given;
    }
    var language = document.querySelector('meta[http-equiv="content-language"]');
    return language && /^de/i.test(language.getAttribute('content') || '') ? 'Menü' : 'Menu';
  }

  function flip() {
    if (!media.matches) {
      return;
    }
    var open = root.classList.toggle('hpage_menu_open');
    toggle.setAttribute('aria-expanded', String(open));
  }

  // The languages of a multilingual website (its bar above the content) also at the end of the menu
  function addLanguages() {
    var bar = document.querySelector('.hpage_language_bar');
    if (!bar || !list || languagesItem) {
      return;
    }
    languagesItem = document.createElement('li');
    languagesItem.className = 'hpage_menu_item hpage_menu_languages';
    Array.prototype.forEach.call(bar.children, function (language) {
      languagesItem.appendChild(language.cloneNode(true));
    });
    list.appendChild(languagesItem);
  }

  function removeLanguages() {
    if (languagesItem && languagesItem.parentNode) {
      languagesItem.parentNode.removeChild(languagesItem);
    }
    languagesItem = null;
  }

  // Light letters of the menu on a background they hardly stand out from get a soft dark shadow (mobile_layout.css):
  // white entries on the light orange of template 366, the owner's colours, were hard to read on the phone, all the
  // more as the entries are bigger there and the menu's column has one plain colour (mafei-taichi.de, 2026-11-12).
  // Dark letters stay as they are: a light shadow does not help them.
  function parseColour(value) {
    var parts = (value || '').match(/[\d.]+/g);
    return parts && parts.length >= 3 ? parts.map(Number) : null;
  }

  // the relative luminance of a colour (WCAG)
  function luminance(colour) {
    return [0.2126, 0.7152, 0.0722].reduce(function (sum, weight, i) {
      var c = colour[i] / 255;
      return sum + weight * (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    }, 0);
  }

  // the average colour of a picture, null where it cannot be read (another host) or is mostly transparent
  function averageColour(url, done) {
    if (Object.prototype.hasOwnProperty.call(averages, url)) {
      done(averages[url]);
      return;
    }
    var image = new Image();
    var finish = function (colour) {
      averages[url] = colour;
      done(colour);
    };
    image.onload = function () {
      try {
        var scale = Math.min(1, 200 / Math.max(image.naturalWidth, image.naturalHeight, 1));
        var canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        var graphics = canvas.getContext('2d');
        graphics.drawImage(image, 0, 0, canvas.width, canvas.height);
        var data = graphics.getImageData(0, 0, canvas.width, canvas.height).data;
        var sum = [0, 0, 0];
        var seen = 0;
        for (var i = 0; i < data.length; i += 4) {
          if (data[i + 3] >= 128) {
            sum[0] += data[i];
            sum[1] += data[i + 1];
            sum[2] += data[i + 2];
            seen += 1;
          }
        }
        finish(seen > data.length / 8 ? sum.map(function (value) { return value / seen; }) : null);
      } catch (error) {
        finish(null);
      }
    };
    image.onerror = function () {
      finish(null);
    };
    image.src = url;
  }

  // what is behind an element: the nearest box with a background picture (its average colour) or colour, else white
  function colourBehind(element, done) {
    for (var box = element; box && box.nodeType === 1; box = box.parentElement) {
      var style = window.getComputedStyle(box);
      if (style.backgroundImage !== 'none') {
        var url = /^url\(["']?(.*?)["']?\)$/.exec(style.backgroundImage);
        if (url) {
          averageColour(url[1], done);
        } else {
          // a gradient or several pictures
          done(null);
        }
        return;
      }
      var colour = parseColour(style.backgroundColor);
      if (colour && (colour.length < 4 || colour[3] > 0.9)) {
        done(colour.slice(0, 3));
        return;
      }
    }
    done([255, 255, 255]);
  }

  // box: where the shadow goes, letters: whose colour counts
  function shadowIfHardToRead(box, letters) {
    colourBehind(box, function (behind) {
      var text = parseColour(window.getComputedStyle(letters).color);
      if (!toggle || !behind || !text || box.classList.contains('hpage_menu_shadow')) {
        return;
      }
      var light = luminance(text);
      var dark = luminance(behind);
      if (light > dark && (light + 0.05) / (dark + 0.05) < 3) {
        box.classList.add('hpage_menu_shadow');
        shadowed.push(box);
      }
    });
  }

  function shadowHardToRead() {
    Array.prototype.forEach.call(list.querySelectorAll('li.hpage_menu_item'), function (item) {
      var link = item.querySelector('a');
      if ((link || item).textContent.trim()) {
        shadowIfHardToRead(link || item, link || item);
      }
    });
    shadowIfHardToRead(toggle, titleMark || toggle.querySelector('.hpage_menu_title') || toggle);
  }

  function removeShadows() {
    shadowed.forEach(function (box) {
      box.classList.remove('hpage_menu_shadow');
    });
    shadowed = [];
  }

  function onKeydown(event) {
    if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
      event.preventDefault();
      flip();
    }
  }

  function setUp() {
    var item = document.querySelector('ul > .hpage_menu_item');
    if (!item || toggle) {
      return;
    }
    list = item.parentElement;
    var title = document.querySelector('.hpage_menu_title');
    // the box of the menu head, when it is not also the box of the menu
    var head = title && title.parentElement && !title.parentElement.contains(list) ? title.parentElement : null;

    ownToggle = head === null;
    toggle = head || document.createElement('div');
    if (ownToggle) {
      toggle.className = 'hpage_menu_toggle';
      toggle.appendChild(document.createTextNode(menuLabel()));
      list.parentElement.insertBefore(toggle, list);
    } else if (!title.textContent.trim()) {
      // a menu head without text (the owner chose none for the desktop): on the phone the button says what it is
      title.appendChild(document.createTextNode(menuLabel()));
      titleMark = title;
      ownLabel = true;
    }
    if (!list.id) {
      list.id = 'hpage_menu_list';
      ownListId = true;
    }

    icon = document.createElement('span');
    icon.className = 'hpage_menu_icon';
    icon.setAttribute('aria-hidden', 'true');
    toggle.insertBefore(icon, toggle.firstChild);
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', list.id);
    toggle.addEventListener('click', flip);
    toggle.addEventListener('keydown', onKeydown);
    addLanguages();
    shadowHardToRead();
  }

  // back to the desktop layout (e.g. a tablet turned): the page as the template has it
  function tearDown() {
    if (!toggle) {
      return;
    }
    root.classList.remove('hpage_menu_open');
    removeLanguages();
    removeShadows();
    toggle.removeEventListener('click', flip);
    toggle.removeEventListener('keydown', onKeydown);
    icon.parentNode.removeChild(icon);
    if (ownToggle) {
      toggle.parentNode.removeChild(toggle);
    } else {
      ['role', 'tabindex', 'aria-expanded', 'aria-controls'].forEach(function (name) {
        toggle.removeAttribute(name);
      });
    }
    if (ownLabel) {
      titleMark.textContent = '';
      titleMark = null;
      ownLabel = false;
    }
    if (ownListId) {
      list.removeAttribute('id');
    }
    toggle = null;
    icon = null;
    list = null;
    ownListId = false;
  }

  // The menu that scrolls sideways (jQuery hoverscroll, a few templates) measures its entries once, when the page loads:
  // loaded in the mobile layout (the menu closed), it is too narrow for the desktop layout. Measured again here.
  function measureScrollingMenus() {
    Array.prototype.forEach.call(document.querySelectorAll('.hoverscroll ul.list'), function (list) {
      var width = 0;
      // room for every entry, so that none is measured squeezed
      list.style.width = '10000px';
      Array.prototype.forEach.call(list.children, function (item) {
        var style = window.getComputedStyle(item);
        width += item.getBoundingClientRect().width + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      });
      if (width > 0) {
        list.style.width = Math.ceil(width + 5) + 'px';
      }
    });
  }

  // Tables of the content wider than the screen (fixed cells, the tables of an addon): each in a box that scrolls
  // sideways, so that the page itself does not
  function boxWideTables() {
    var content = document.querySelector('.hpage_content');
    if (!content) {
      return;
    }
    Array.prototype.forEach.call(content.querySelectorAll('table'), function (table) {
      if (table.parentNode.className === 'hpage_table_scroll' || table.parentNode.closest('.hpage_table_scroll')) {
        return;
      }
      if (table.getBoundingClientRect().right > document.documentElement.clientWidth + 1) {
        var box = document.createElement('div');
        box.className = 'hpage_table_scroll';
        table.parentNode.insertBefore(box, table);
        box.appendChild(table);
        scrollBoxes.push(box);
      }
    });
  }

  function unboxTables() {
    scrollBoxes.forEach(function (box) {
      if (box.parentNode) {
        box.parentNode.insertBefore(box.firstChild, box);
        box.parentNode.removeChild(box);
      }
    });
    scrollBoxes = [];
  }

  // A soft shadow on the side of a table that can be swiped further (the boxes above and the tables of a fixed width,
  // which scroll themselves, mobile_layout.css): without it, the cut-off column looked squeezed
  // (berliner-linienchronik.de). The shadow is drawn by its frame (.hpage_swipe), over the cells and their colours.
  function showSwipeSide(frame, scroller) {
    var room = scroller.scrollWidth - scroller.clientWidth;
    var position = Math.abs(scroller.scrollLeft);
    var rightToLeft = window.getComputedStyle(scroller).direction === 'rtl';
    var before = room > 2 && position > 2;
    var after = room > 2 && position < room - 2;
    frame.classList.toggle('hpage_swipe_left', rightToLeft ? after : before);
    frame.classList.toggle('hpage_swipe_right', rightToLeft ? before : after);
  }

  function addSwipeHints() {
    var content = document.querySelector('.hpage_content');
    if (!content) {
      return;
    }
    // the hints of tables that a script of the page replaced
    swipeHints = swipeHints.filter(function (hint) {
      return hint.frame.isConnected;
    });
    var scrollers = Array.prototype.filter.call(content.querySelectorAll('.hpage_table_scroll, table'), function (element) {
      if (element.tagName === 'TABLE' && (element.parentNode.className === 'hpage_table_scroll'
        || window.getComputedStyle(element).overflowX !== 'auto')) {
        return false;
      }
      return element.scrollWidth > element.clientWidth + 2;
    });
    scrollers.forEach(function (scroller) {
      var frame = scroller.parentNode;
      if (frame.className.indexOf('hpage_swipe') !== 0) {
        frame = document.createElement('div');
        frame.className = 'hpage_swipe';
        scroller.parentNode.insertBefore(frame, scroller);
        frame.appendChild(scroller);
        var onScroll = function () { showSwipeSide(frame, scroller); };
        scroller.addEventListener('scroll', onScroll, { passive: true });
        swipeHints.push({ frame: frame, scroller: scroller, onScroll: onScroll });
      }
      showSwipeSide(frame, scroller);
    });
  }

  function removeSwipeHints() {
    swipeHints.forEach(function (hint) {
      hint.scroller.removeEventListener('scroll', hint.onScroll);
      if (hint.frame.parentNode) {
        hint.frame.parentNode.insertBefore(hint.scroller, hint.frame);
        hint.frame.parentNode.removeChild(hint.frame);
      }
    });
    swipeHints = [];
  }

  function update() {
    if (media.matches) {
      setUp();
      boxWideTables();
      addSwipeHints();
    } else if (toggle) {
      tearDown();
      removeSwipeHints();
      unboxTables();
      measureScrollingMenus();
    }
  }

  if (media.addEventListener) {
    media.addEventListener('change', update);
  } else if (media.addListener) {
    media.addListener(update);
  }
  // again when the pictures are there: a table of pictures without a size in its HTML is narrow before they load
  window.addEventListener('load', update);
  // also on resizing: a change of the pointer (e.g. a trackpad attached to a tablet) does not always send a change
  window.addEventListener('resize', update);
  update();

  // Tables that a script of the page writes later (the owner's filter of the lines by year, berliner-linienchronik.de)
  // get their box and swipe hint too, again when their pictures are there
  var content = document.querySelector('.hpage_content');
  if (content && window.MutationObserver) {
    var refreshing = false;
    var refresh = function () {
      if (refreshing) {
        return;
      }
      refreshing = true;
      window.requestAnimationFrame(function () {
        refreshing = false;
        if (media.matches) {
          scrollBoxes = scrollBoxes.filter(function (box) {
            return box.isConnected;
          });
          boxWideTables();
          addSwipeHints();
        }
      });
    };
    new MutationObserver(refresh).observe(content, { childList: true, subtree: true });
    content.addEventListener('load', refresh, true);
  }
})();
