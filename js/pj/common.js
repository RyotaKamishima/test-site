function toBoolean (data) {
  return data.toLowerCase() === 'true';
}

document.addEventListener('DOMContentLoaded', function() {
  const pathName = location.pathname;
  const pathArray = pathName.split('/');
  if (pathArray[1].match('preview')) {
    var pathArrayName = pathArray[3];
  } else {
    var pathArrayName = pathArray[1];
  }

  const urlLists = ['header','footer'];
  let includeCommon = function(cnt) {
    let xhr1 = new XMLHttpRequest();
    var box=document.getElementById(urlLists[cnt]);
    if(pathArrayName == 'english') {
      xhr1.open('GET', '/english/common_' + urlLists[cnt] + '.html', true);
    }else {
      xhr1.open('GET', '/common_' + urlLists[cnt] + '.html', true);
    }
    xhr1.responseType='document';
    xhr1.overrideMimeType("text/html;charset=UTF-8");
    xhr1.send();
    xhr1.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var restxt=this.responseXML;
        var int=restxt.getElementById(urlLists[cnt] + 'I');
        box.innerHTML=int.innerHTML;
        if( cnt < urlLists.length-1 ) {
          includeCommon(cnt+1);
        } else {
          callBack();
        }
      };
    }
  }
  includeCommon(0);

  if (document.getElementById('sideblock')) {
    var sideBlockPresent = true;
    var xhr2 = new XMLHttpRequest(),
    method = 'GET',
    url = '/common_sideblock.html';
    var sideBlock = document.getElementById('sideblock');
  
    xhr2.open(method, url, true);
    xhr2.responseType='document';
    xhr2.overrideMimeType("text/html;charset=UTF-8");
    xhr2.onreadystatechange = function () {
      if(xhr2.readyState === 4 && xhr2.status === 200) {
        var restxt = xhr2.responseXML;
        var int = restxt.getElementById(pathArrayName + 'I');
        sideBlock.innerHTML = int.innerHTML;
      }
    };
    xhr2.send();
  }

  if (document.getElementById('newsBox') && pathArray.length == 3) {
    var xhr3 = new XMLHttpRequest(),
    method = 'GET',
    url = '/common_news_' + pathArrayName +'.html';
    var newsBox = document.getElementById('newsBox');
  
    xhr3.open(method, url, true);
    xhr3.responseType='document';
    xhr3.overrideMimeType("text/html;charset=UTF-8");
    xhr3.onreadystatechange = function () {
      if(xhr3.readyState === 4 && xhr3.status === 200) {
        var restxt = xhr3.responseXML;
        var int = restxt.getElementById('newsBoxI');
        newsBox.innerHTML = int.innerHTML;
      }
    };
    xhr3.send();
  }


  function callBack() {
    if (pathName == '/' || pathName == '/index.html') {
      const logo = document.getElementById('ciLogo');
      const logoCont = logo.innerHTML;
      logo.outerHTML = '<h1 id="ciLogo" class="ciBlock">' + logoCont + '</h1>'
      const logoSP = document.getElementById('ciBlockSP');
      const logoContSP = logoSP.innerHTML;
      logoSP.outerHTML = '<h1 id="ciBlockSP" class="ciBlockSP">' + logoContSP + '</h1>'
    }

    const linkAddBlank = function() {
      const a_tags = document.querySelectorAll('a[href$="pdf"], a[href$="xlsx"], a[href$="xlsm"], a[href$="xls"], a[href$="doc"], a[href$="docx"], a[href$="zip"], a[href$="mov"], a[href$="mpeg"], a[href$="mpg"], a[href$="wmv"], a[href^="http://"], a[href^="https://"]', '.contBlock'),
      res = [];
      if (!a_tags.length) return;
      for (let i = 0; i < a_tags.length; i++ ) {
        a_tags[i].setAttribute('target','_blank');
        a_tags[i].setAttribute('rel','noopener');
        res.push(a_tags[i])
      }
      return res;
    }
    linkAddBlank();

    const sideBlockCurrent = function() {
      var getRootRelative = function(path, excludeQueryString, excludeHashFragment) {
        if (!path || !path.match(/(^\/|\/\/)/)) return '';
        var rPath = path.replace(/\\/g, '/').replace(/^[^/]*\/\/[^/]*/, '');
        if (excludeQueryString) rPath = rPath.replace(/\?([^#]+)?/, '');
        if (excludeHashFragment) rPath = rPath.replace(/\#.*?$/, '');
        return rPath;
      };
      const sideBlockLink = document.querySelectorAll('.local-nav li a');
      for (let i = 0; i < sideBlockLink.length; i++ ) {
        string = getRootRelative(sideBlockLink[i].href);
        path = pathName;
        if (string == path && pathArray.length > 3) {
          sideBlockLink[i].parentNode.classList.add('current');
        }
      }
    }
    if(sideBlockPresent) { sideBlockCurrent(); };

    const gNavBtn = document.getElementById('gnavBtn');
    const gNavBtnClose = document.getElementById('gnavBtn-close');
    const gNavCont = document.getElementById('gnavBlock');

    const snavBox = document.querySelectorAll('.snavBox');
    const snavBox2nd = document.querySelectorAll('.snavBox2nd');
    const snav2ndLink = document.querySelectorAll('.snavBox2nd-list-link');

    const gNavSearchBtn = document.getElementById('searchBtn');
    const gNavSearchBtnClose = document.getElementById('searchBtn-close');
    const gNavSearch = document.getElementById('searchBlock_sp');

    const layer = document.getElementById('layer');

    function switchByWidth(){
      if (window.matchMedia('(max-width: 767px)').matches) {
        gNavBtn.setAttribute('aria-expanded','false');
        gNavBtnClose.setAttribute('aria-expanded','false');
        gNavCont.setAttribute('aria-hidden','true');
        layer.setAttribute('data-hidden','true');
        for (let i = 0; i < snavBox.length; i++){
          snavBox[i].setAttribute('aria-hidden','false');
        };
        for (let i = 0; i < snavBox2nd.length; i++){
          snavBox2nd[i].setAttribute('aria-hidden','true');
          snavBox2nd[i].style.height = "";
        };
        for (let i = 0; i < snav2ndLink.length; i++){
          snav2ndLink[i].setAttribute('tabindex','-1');
        };
        tableFunc();
      } else if (window.matchMedia('(min-width:768px)').matches) {
        gNavBtn.setAttribute('aria-expanded','false');
        gNavBtnClose.setAttribute('aria-expanded','false');
        gNavCont.setAttribute('aria-hidden','false');
        for (let i = 0; i < snavBox.length; i++){
          snavBox[i].setAttribute('aria-hidden','true');
        };
        for (let i = 0; i < snavBox2nd.length; i++){
          snavBox2nd[i].setAttribute('aria-hidden','false');
          snavBox2nd[i].style.height = "";
        };
        for (let i = 0; i < snav2ndLink.length; i++){
          snav2ndLink[i].setAttribute('tabindex','0');
        };
      }
    }
    switchByWidth();
    let timer = false;
    let currentWidth = window.innerWidth;
    window.addEventListener("resize", function() {
      if (timer !== false) {
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
        if (currentWidth == window.innerWidth) {
          return;
        }
        currentWidth = window.innerWidth;
        switchByWidth();
      }, 0);
    },false);

    const navBtn = document.querySelectorAll('.gnav-btn');
    const closeBtn = document.querySelectorAll('.snavCloseBtn');
    const dispNone = 'gnav-none';
    const addDisp = function() {
      flagClose = toBoolean(this.getAttribute('aria-hidden'));
      if (flagClose) {
        this.classList.add(dispNone);
      };
    };

    for (let i = 0; i < navBtn.length; i++){
      navBtn[i].addEventListener('click', function(){
        const navCont = document.getElementById(this.getAttribute('aria-controls'));
        const nextcloseBtn = this.nextElementSibling.lastElementChild.lastElementChild;
        flagBtn = toBoolean(this.getAttribute('aria-expanded'));
        flagCont = toBoolean(navCont.getAttribute('aria-hidden'));
        var navBtnArray = Array.prototype.slice.call(navBtn);

        navBtnArray.forEach(function(val) {
          val.setAttribute('aria-expanded',String('false'));
          val.nextElementSibling.setAttribute('aria-hidden',String('true'));
          val.nextElementSibling.lastElementChild.lastElementChild.setAttribute('aria-expanded',String(false));
          val.nextElementSibling.addEventListener('animationend', addDisp);
        });

        if(!flagBtn) {
          navCont.classList.remove(dispNone);
          this.setAttribute('aria-expanded',String(!flagBtn));
          navCont.setAttribute('aria-hidden',String(!flagCont));
          nextcloseBtn.setAttribute('aria-expanded',String(!flagBtn));
        } else {
          this.blur();
        };
      },false)
    };

    for (let i = 0; i < closeBtn.length; i++) {
      closeBtn[i].addEventListener('click', function() {
        const navCont = document.getElementById(this.getAttribute('aria-controls'));
        flagBtn = toBoolean(this.getAttribute('aria-expanded'));
        flagCont = toBoolean(navCont.getAttribute('aria-hidden'));
        var closeBtnArray = Array.prototype.slice.call(closeBtn);

        if(flagBtn) {
          closeBtnArray.forEach(function(val) {
            val.setAttribute('aria-expanded',String('false'));
            val.parentNode.parentNode.setAttribute('aria-hidden',String('true'));
            val.parentNode.parentNode.parentNode.firstElementChild.setAttribute('aria-expanded',String(false));
            val.parentNode.parentNode.addEventListener('animationend', addDisp);
          });
        };
      },false);
    };

  // layer SP
    const layerDispNone = 'layer-none';
    const layerAddDisp = function() {
      layer.classList.add(layerDispNone);
      layer.removeEventListener('animationend', layerAddDisp);
    };
    const layerOpen = function() {
      layer.classList.remove(layerDispNone);
      layer.setAttribute('data-hidden','false');
    };
    const layerClose = function() {
      layer.setAttribute('data-hidden','true');
      layer.addEventListener('animationend', layerAddDisp);
    };


  // gNav SP
    const gNavDispNone = 'gnavBlock-none';
    const gNavAddDisp = function() {
      gNavCont.classList.add(gNavDispNone);
      gNavCont.removeEventListener('animationend', gNavAddDisp);
    };
    const gNavOpen = function (){
      gNavCont.classList.remove(gNavDispNone);
      gNavBtn.setAttribute('aria-expanded','true');
      gNavBtnClose.setAttribute('aria-expanded','true');
      gNavCont.setAttribute('aria-hidden','false');
    };
    const gNavClose = function (){
      gNavBtn.setAttribute('aria-expanded','false');
      gNavBtnClose.setAttribute('aria-expanded','false');
      gNavCont.setAttribute('aria-hidden','true');
      gNavCont.addEventListener('animationend', gNavAddDisp);
    };


  // search SP
    const searchDispNone = 'search-none';
    const searchAddDisp = function() {
      gNavSearch.classList.add(searchDispNone);
      gNavSearch.removeEventListener('animationend', searchAddDisp);
    };
    const searchOpen = function (){
      gNavSearch.classList.remove(searchDispNone);
      gNavSearchBtn.setAttribute('aria-expanded','true');
      gNavSearchBtnClose.setAttribute('aria-expanded','true');
      gNavSearch.setAttribute('aria-hidden','false');
    };
    const searchClose = function (){
      gNavSearchBtn.setAttribute('aria-expanded','false');
      gNavSearchBtnClose.setAttribute('aria-expanded','false');
      gNavSearch.setAttribute('aria-hidden','true');
      gNavSearch.addEventListener('animationend', searchAddDisp);
    };

    gNavBtn.addEventListener('click', function() {
      gNavFlag = toBoolean(gNavBtn.getAttribute('aria-expanded'));
      gNavSearchFlag = toBoolean(gNavSearchBtn.getAttribute('aria-expanded'));
      if (!gNavFlag) {
        if (gNavSearchFlag) {
          gNavOpen();
          searchClose();
        } else {
          gNavOpen();
          layerOpen();
        }
      } else {
        gNavClose();
        layerClose();
      }
    },false);
    gNavBtnClose.addEventListener('click', function() {
      gNavClose();
      layerClose();
    },false);

    gNavSearchBtn.addEventListener('click', function() {
      gNavFlag = toBoolean(gNavBtn.getAttribute('aria-expanded'));
      gNavSearchFlag = toBoolean(gNavSearchBtn.getAttribute('aria-expanded'));
      if (!gNavSearchFlag) {
        if(gNavFlag) {
          searchOpen();
          gNavClose();
        }
        searchOpen();
        layerOpen();
      } else {
        searchClose();
        layerClose();
      }
    },false);
    gNavSearchBtnClose.addEventListener('click', function() {
      searchClose();
      layerClose();
    },false);


    const snav2ndBtn = document.querySelectorAll('.snav2nd-btn');
    const snavBox2ndListLink = document.querySelectorAll('.snavBox2nd-list-link');
    for (let i = 0; i < snav2ndBtn.length; i++){
      snav2ndBtn[i].addEventListener('click', function(){
        const nav2ndCont = document.getElementById(this.getAttribute('aria-controls'));
        flag2ndBtn = toBoolean(this.getAttribute('aria-expanded'));
        flag2ndCont = toBoolean(nav2ndCont.getAttribute('aria-hidden'));

        const snav2ndBtnArray = Array.prototype.slice.call(snav2ndBtn);
        snav2ndBtnArray.forEach(function(val) {
          val.setAttribute('aria-expanded',String('false'));
          val.nextElementSibling.setAttribute('aria-hidden',String('true'));
          val.nextElementSibling.style.height = "";
        });

        const snavBox2ndListLinkArray = Array.prototype.slice.call(snavBox2ndListLink);
        snavBox2ndListLinkArray.forEach(function(val){
          val.setAttribute('tabindex','-1');
        });

        if(!flag2ndBtn) {
          var elementChildren = nav2ndCont.firstElementChild.children;
          for (let i = 0; i < elementChildren.length; i++) {
            elementChildren[i].firstElementChild.setAttribute('tabindex','0');
          }
          const H = nav2ndCont.firstElementChild.offsetHeight;
          nav2ndCont.style.height = H + "px";
          this.setAttribute('aria-expanded',String(!flag2ndBtn));
          nav2ndCont.setAttribute('aria-hidden',String(!flag2ndCont));
        };
      },false)
    }

  // Google Costum Search
    const searchBG = 'gcs-text-bg';
    const searchBox = document.querySelectorAll('.gcs-text');

    var gcsBgBlur = function() {
      const theThis = this.box;
      if(theThis.value === ""){
        theThis.classList.add(searchBG);
      } else {
        theThis.classList.remove(searchBG);
      };
    };
    var gcsBgFocus = function() {
      const theThis = this.box;
      theThis.classList.remove(searchBG);
    };
    for (let i = 0; i < searchBox.length; i++) {
      searchBox[i].addEventListener('blur', {box: searchBox[i], handleEvent: gcsBgBlur});
      searchBox[i].addEventListener('focus', {box: searchBox[i], handleEvent: gcsBgFocus});
      window.addEventListener('load', {box: searchBox[i], handleEvent: gcsBgBlur});
    };

    const fsz_N = document.getElementById('fsz_N');
    const fsz_Nclass = fsz_N.getAttribute('id');
    const fsz_L = document.getElementById('fsz_L');
    const fsz_Lclass = fsz_L.getAttribute('id');
    const rootTag = document.documentElement;
    let setedFsz;

    const fsz_Nset = function(){
      rootTag.classList.add(fsz_Nclass);
      rootTag.classList.remove(fsz_Lclass);
      setedFsz = 'setedFszN';
      Cookies.set('fszCookie', setedFsz, { expires: 7, path: '/' });
    };
    const fsz_Lset = function(){
      rootTag.classList.add(fsz_Lclass);
      rootTag.classList.remove(fsz_Nclass);
      setedFsz = 'setedFszL';
      Cookies.set('fszCookie', setedFsz, { expires: 7, path: '/' });
    };

    fsz_N.addEventListener('click', fsz_Nset, false);
    fsz_L.addEventListener('click', fsz_Lset, false);

    const getFsz = function(){
      if (Cookies.get('fszCookie') == 'setedFszL') {
        fsz_Lset();
      } else {
        fsz_Nset();
      }
    };

    window.addEventListener('load', function(){
      let fsz = Cookies.get('fszCookie');
      if(fsz = 'setedFszL') {
        getFsz();
      };
    },false);
  }

  var scrollElm = (function() {
    if('scrollingElement' in document) return document.scrollingElement;
    if(navigator.userAgent.indexOf('WebKit') != -1) return document.body;
    return document.documentElement;
  })();
  (function() {
    var duration = 500;
    var ignore = '.noscroll';
    var easing = function (t, b, c, d) { return c * (0.5 - Math.cos(t / d * Math.PI) / 2) + b; }; //jswing
    var smoothScrollElm = document.querySelectorAll('a[href^="#"]:not(' + ignore +')');
    var scrollArray = Array.prototype.slice.call(smoothScrollElm);
    scrollArray.forEach(function(elm){
      elm.addEventListener('click', function(e) {
        e.preventDefault();
        var targetElm = document.querySelector(elm.getAttribute('href'));
        if(!targetElm) return;
        var targetPos = targetElm.getBoundingClientRect().top - 105;
        var startTime = Date.now();
        var scrollFrom = scrollElm.scrollTop;
        (function loop() {
          var currentTime = Date.now() - startTime;
          if(currentTime < duration) {
            scrollTo(0, easing(currentTime, scrollFrom, targetPos, duration));
            window.requestAnimationFrame(loop);
          } else {
            scrollTo(0, targetPos + scrollFrom);
          }
        })();
        targetElm.setAttribute('tabindex','-1'); 
        targetElm.focus();
      })
    });
  })();

},false);

const tableFunc = function (){
  var table02 = document.querySelectorAll('.table02');
  var table02Array = Array.prototype.slice.call(table02,0);
  table02Array.forEach(function(elem,N) {
    console.log('table'+(N+1));
    var tr = elem.querySelectorAll("tr");
    var trLength = tr.length;
    var tdLength;

    var trArray = Array.prototype.slice.call(tr,0);
    trArray.forEach(function(elemTR,i){
      var thtd = elemTR.querySelectorAll("th,td");
      tdLength = thtd.length;
    });

    console.log(trLength);
    console.log(tdLength);
    var table = elem.querySelectorAll("table");
    var tableArray = Array.prototype.slice.call(table,0);
    tableArray.forEach(function(elemTABLE,i){
      elemTABLE.style.gridTemplateRows = 'repeat(' + tdLength + ', auto)';
    });
  });
};

// 繝医ャ繝励∈謌ｻ繧九�繧ｿ繝ｳ
var pageTopBtn = document.getElementById("topPage");
window.addEventListener('scroll', function() {
  if (window.pageYOffset > 200) {
    pageTopBtn.classList.add("fixed")
  } else {
    pageTopBtn.classList.remove("fixed")
  }
});

// 蜑阪�繝壹�繧ｸ縺ｫ謌ｻ繧九�繧ｿ繝ｳ
var pageBack = document.querySelectorAll('.bkBtn');
var Backbtn = Array.prototype.slice.call(pageBack,0); 
Backbtn.forEach(function(target){ 
  target.addEventListener('click', function(){
    window.history.back();
  },false);
});
