if (
  ((function (e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports
      ? (module.exports = e.document
          ? t(e, !0)
          : function (e) {
              if (!e.document)
                throw new Error("jQuery requires a window with a document");
              return t(e);
            })
      : t(e);
  })("undefined" != typeof window ? window : this, function (e, t) {
    "use strict";
    var n = [],
      r = Object.getPrototypeOf,
      i = n.slice,
      o = n.flat
        ? function (e) {
            return n.flat.call(e);
          }
        : function (e) {
            return n.concat.apply([], e);
          },
      a = n.push,
      s = n.indexOf,
      l = {},
      c = l.toString,
      u = l.hasOwnProperty,
      d = u.toString,
      f = d.call(Object),
      p = {},
      h = function (e) {
        return (
          "function" == typeof e &&
          "number" != typeof e.nodeType &&
          "function" != typeof e.item
        );
      },
      g = function (e) {
        return null != e && e === e.window;
      },
      v = e.document,
      m = { type: !0, src: !0, nonce: !0, noModule: !0 };
    function y(e, t, n) {
      var r,
        i,
        o = (n = n || v).createElement("script");
      if (((o.text = e), t))
        for (r in m)
          (i = t[r] || (t.getAttribute && t.getAttribute(r))) &&
            o.setAttribute(r, i);
      n.head.appendChild(o).parentNode.removeChild(o);
    }
    function b(e) {
      return null == e
        ? e + ""
        : "object" == typeof e || "function" == typeof e
        ? l[c.call(e)] || "object"
        : typeof e;
    }
    var x = "3.7.1",
      w = /HTML$/i,
      C = function (e, t) {
        return new C.fn.init(e, t);
      };
    function T(e) {
      var t = !!e && "length" in e && e.length,
        n = b(e);
      return (
        !h(e) &&
        !g(e) &&
        ("array" === n ||
          0 === t ||
          ("number" == typeof t && t > 0 && t - 1 in e))
      );
    }
    function k(e, t) {
      return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
    }
    (C.fn = C.prototype =
      {
        jquery: x,
        constructor: C,
        length: 0,
        toArray: function () {
          return i.call(this);
        },
        get: function (e) {
          return null == e
            ? i.call(this)
            : e < 0
            ? this[e + this.length]
            : this[e];
        },
        pushStack: function (e) {
          var t = C.merge(this.constructor(), e);
          return (t.prevObject = this), t;
        },
        each: function (e) {
          return C.each(this, e);
        },
        map: function (e) {
          return this.pushStack(
            C.map(this, function (t, n) {
              return e.call(t, n, t);
            })
          );
        },
        slice: function () {
          return this.pushStack(i.apply(this, arguments));
        },
        first: function () {
          return this.eq(0);
        },
        last: function () {
          return this.eq(-1);
        },
        even: function () {
          return this.pushStack(
            C.grep(this, function (e, t) {
              return (t + 1) % 2;
            })
          );
        },
        odd: function () {
          return this.pushStack(
            C.grep(this, function (e, t) {
              return t % 2;
            })
          );
        },
        eq: function (e) {
          var t = this.length,
            n = +e + (e < 0 ? t : 0);
          return this.pushStack(n >= 0 && n < t ? [this[n]] : []);
        },
        end: function () {
          return this.prevObject || this.constructor();
        },
        push: a,
        sort: n.sort,
        splice: n.splice,
      }),
      (C.extend = C.fn.extend =
        function () {
          var e,
            t,
            n,
            r,
            i,
            o,
            a = arguments[0] || {},
            s = 1,
            l = arguments.length,
            c = !1;
          for (
            "boolean" == typeof a && ((c = a), (a = arguments[s] || {}), s++),
              "object" == typeof a || h(a) || (a = {}),
              s === l && ((a = this), s--);
            s < l;
            s++
          )
            if (null != (e = arguments[s]))
              for (t in e)
                (r = e[t]),
                  "__proto__" !== t &&
                    a !== r &&
                    (c && r && (C.isPlainObject(r) || (i = Array.isArray(r)))
                      ? ((n = a[t]),
                        (o =
                          i && !Array.isArray(n)
                            ? []
                            : i || C.isPlainObject(n)
                            ? n
                            : {}),
                        (i = !1),
                        (a[t] = C.extend(c, o, r)))
                      : void 0 !== r && (a[t] = r));
          return a;
        }),
      C.extend({
        expando: "jQuery" + (x + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function (e) {
          throw new Error(e);
        },
        noop: function () {},
        isPlainObject: function (e) {
          var t, n;
          return (
            !(!e || "[object Object]" !== c.call(e)) &&
            (!(t = r(e)) ||
              ("function" ==
                typeof (n = u.call(t, "constructor") && t.constructor) &&
                d.call(n) === f))
          );
        },
        isEmptyObject: function (e) {
          var t;
          for (t in e) return !1;
          return !0;
        },
        globalEval: function (e, t, n) {
          y(e, { nonce: t && t.nonce }, n);
        },
        each: function (e, t) {
          var n,
            r = 0;
          if (T(e))
            for (n = e.length; r < n && !1 !== t.call(e[r], r, e[r]); r++);
          else for (r in e) if (!1 === t.call(e[r], r, e[r])) break;
          return e;
        },
        text: function (e) {
          var t,
            n = "",
            r = 0,
            i = e.nodeType;
          if (!i) for (; (t = e[r++]); ) n += C.text(t);
          return 1 === i || 11 === i
            ? e.textContent
            : 9 === i
            ? e.documentElement.textContent
            : 3 === i || 4 === i
            ? e.nodeValue
            : n;
        },
        makeArray: function (e, t) {
          var n = t || [];
          return (
            null != e &&
              (T(Object(e))
                ? C.merge(n, "string" == typeof e ? [e] : e)
                : a.call(n, e)),
            n
          );
        },
        inArray: function (e, t, n) {
          return null == t ? -1 : s.call(t, e, n);
        },
        isXMLDoc: function (e) {
          var t = e && e.namespaceURI,
            n = e && (e.ownerDocument || e).documentElement;
          return !w.test(t || (n && n.nodeName) || "HTML");
        },
        merge: function (e, t) {
          for (var n = +t.length, r = 0, i = e.length; r < n; r++)
            e[i++] = t[r];
          return (e.length = i), e;
        },
        grep: function (e, t, n) {
          for (var r = [], i = 0, o = e.length, a = !n; i < o; i++)
            !t(e[i], i) !== a && r.push(e[i]);
          return r;
        },
        map: function (e, t, n) {
          var r,
            i,
            a = 0,
            s = [];
          if (T(e))
            for (r = e.length; a < r; a++)
              null != (i = t(e[a], a, n)) && s.push(i);
          else for (a in e) null != (i = t(e[a], a, n)) && s.push(i);
          return o(s);
        },
        guid: 1,
        support: p,
      }),
      "function" == typeof Symbol &&
        (C.fn[Symbol.iterator] = n[Symbol.iterator]),
      C.each(
        "Boolean Number String Function Array Date RegExp Object Error Symbol".split(
          " "
        ),
        function (e, t) {
          l["[object " + t + "]"] = t.toLowerCase();
        }
      );
    var S = n.pop,
      E = n.sort,
      _ = n.splice,
      A = "[\\x20\\t\\r\\n\\f]",
      j = new RegExp("^" + A + "+|((?:^|[^\\\\])(?:\\\\.)*)" + A + "+$", "g");
    C.contains = function (e, t) {
      var n = t && t.parentNode;
      return (
        e === n ||
        !(
          !n ||
          1 !== n.nodeType ||
          !(e.contains
            ? e.contains(n)
            : e.compareDocumentPosition && 16 & e.compareDocumentPosition(n))
        )
      );
    };
    var H = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
    function D(e, t) {
      return t
        ? "\0" === e
          ? "�"
          : e.slice(0, -1) +
            "\\" +
            e.charCodeAt(e.length - 1).toString(16) +
            " "
        : "\\" + e;
    }
    C.escapeSelector = function (e) {
      return (e + "").replace(H, D);
    };
    var P = v,
      O = a;
    !(function () {
      var t,
        r,
        o,
        a,
        l,
        c,
        d,
        f,
        h,
        g,
        v = O,
        m = C.expando,
        y = 0,
        b = 0,
        x = ee(),
        w = ee(),
        T = ee(),
        H = ee(),
        D = function (e, t) {
          return e === t && (l = !0), 0;
        },
        R =
          "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        L =
          "(?:\\\\[\\da-fA-F]{1,6}" +
          A +
          "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",
        N =
          "\\[" +
          A +
          "*(" +
          L +
          ")(?:" +
          A +
          "*([*^$|!~]?=)" +
          A +
          "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
          L +
          "))|)" +
          A +
          "*\\]",
        M =
          ":(" +
          L +
          ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" +
          N +
          ")*)|.*)\\)|)",
        q = new RegExp(A + "+", "g"),
        I = new RegExp("^" + A + "*," + A + "*"),
        W = new RegExp("^" + A + "*([>+~]|" + A + ")" + A + "*"),
        F = new RegExp(A + "|>"),
        V = new RegExp(M),
        $ = new RegExp("^" + L + "$"),
        B = {
          ID: new RegExp("^#(" + L + ")"),
          CLASS: new RegExp("^\\.(" + L + ")"),
          TAG: new RegExp("^(" + L + "|[*])"),
          ATTR: new RegExp("^" + N),
          PSEUDO: new RegExp("^" + M),
          CHILD: new RegExp(
            "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
              A +
              "*(even|odd|(([+-]|)(\\d*)n|)" +
              A +
              "*(?:([+-]|)" +
              A +
              "*(\\d+)|))" +
              A +
              "*\\)|)",
            "i"
          ),
          bool: new RegExp("^(?:" + R + ")$", "i"),
          needsContext: new RegExp(
            "^" +
              A +
              "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
              A +
              "*((?:-\\d)?\\d*)" +
              A +
              "*\\)|)(?=[^-]|$)",
            "i"
          ),
        },
        z = /^(?:input|select|textarea|button)$/i,
        X = /^h\d$/i,
        Q = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        U = /[+~]/,
        K = new RegExp(
          "\\\\[\\da-fA-F]{1,6}" + A + "?|\\\\([^\\r\\n\\f])",
          "g"
        ),
        Y = function (e, t) {
          var n = "0x" + e.slice(1) - 65536;
          return (
            t ||
            (n < 0
              ? String.fromCharCode(n + 65536)
              : String.fromCharCode((n >> 10) | 55296, (1023 & n) | 56320))
          );
        },
        Z = function () {
          le();
        },
        G = fe(
          function (e) {
            return !0 === e.disabled && k(e, "fieldset");
          },
          { dir: "parentNode", next: "legend" }
        );
      try {
        v.apply((n = i.call(P.childNodes)), P.childNodes),
          n[P.childNodes.length].nodeType;
      } catch (e) {
        v = {
          apply: function (e, t) {
            O.apply(e, i.call(t));
          },
          call: function (e) {
            O.apply(e, i.call(arguments, 1));
          },
        };
      }
      function J(e, t, n, r) {
        var i,
          o,
          a,
          s,
          l,
          u,
          d,
          g = t && t.ownerDocument,
          y = t ? t.nodeType : 9;
        if (
          ((n = n || []),
          "string" != typeof e || !e || (1 !== y && 9 !== y && 11 !== y))
        )
          return n;
        if (!r && (le(t), (t = t || c), f)) {
          if (11 !== y && (l = Q.exec(e)))
            if ((i = l[1])) {
              if (9 === y) {
                if (!(a = t.getElementById(i))) return n;
                if (a.id === i) return v.call(n, a), n;
              } else if (
                g &&
                (a = g.getElementById(i)) &&
                J.contains(t, a) &&
                a.id === i
              )
                return v.call(n, a), n;
            } else {
              if (l[2]) return v.apply(n, t.getElementsByTagName(e)), n;
              if ((i = l[3]) && t.getElementsByClassName)
                return v.apply(n, t.getElementsByClassName(i)), n;
            }
          if (!(H[e + " "] || (h && h.test(e)))) {
            if (((d = e), (g = t), 1 === y && (F.test(e) || W.test(e)))) {
              for (
                ((g = (U.test(e) && se(t.parentNode)) || t) == t && p.scope) ||
                  ((s = t.getAttribute("id"))
                    ? (s = C.escapeSelector(s))
                    : t.setAttribute("id", (s = m))),
                  o = (u = ue(e)).length;
                o--;

              )
                u[o] = (s ? "#" + s : ":scope") + " " + de(u[o]);
              d = u.join(",");
            }
            try {
              return v.apply(n, g.querySelectorAll(d)), n;
            } catch (t) {
              H(e, !0);
            } finally {
              s === m && t.removeAttribute("id");
            }
          }
        }
        return ye(e.replace(j, "$1"), t, n, r);
      }
      function ee() {
        var e = [];
        return function t(n, i) {
          return (
            e.push(n + " ") > r.cacheLength && delete t[e.shift()],
            (t[n + " "] = i)
          );
        };
      }
      function te(e) {
        return (e[m] = !0), e;
      }
      function ne(e) {
        var t = c.createElement("fieldset");
        try {
          return !!e(t);
        } catch (e) {
          return !1;
        } finally {
          t.parentNode && t.parentNode.removeChild(t), (t = null);
        }
      }
      function re(e) {
        return function (t) {
          return k(t, "input") && t.type === e;
        };
      }
      function ie(e) {
        return function (t) {
          return (k(t, "input") || k(t, "button")) && t.type === e;
        };
      }
      function oe(e) {
        return function (t) {
          return "form" in t
            ? t.parentNode && !1 === t.disabled
              ? "label" in t
                ? "label" in t.parentNode
                  ? t.parentNode.disabled === e
                  : t.disabled === e
                : t.isDisabled === e || (t.isDisabled !== !e && G(t) === e)
              : t.disabled === e
            : "label" in t && t.disabled === e;
        };
      }
      function ae(e) {
        return te(function (t) {
          return (
            (t = +t),
            te(function (n, r) {
              for (var i, o = e([], n.length, t), a = o.length; a--; )
                n[(i = o[a])] && (n[i] = !(r[i] = n[i]));
            })
          );
        });
      }
      function se(e) {
        return e && void 0 !== e.getElementsByTagName && e;
      }
      function le(e) {
        var t,
          n = e ? e.ownerDocument || e : P;
        return n != c && 9 === n.nodeType && n.documentElement
          ? ((d = (c = n).documentElement),
            (f = !C.isXMLDoc(c)),
            (g = d.matches || d.webkitMatchesSelector || d.msMatchesSelector),
            d.msMatchesSelector &&
              P != c &&
              (t = c.defaultView) &&
              t.top !== t &&
              t.addEventListener("unload", Z),
            (p.getById = ne(function (e) {
              return (
                (d.appendChild(e).id = C.expando),
                !c.getElementsByName || !c.getElementsByName(C.expando).length
              );
            })),
            (p.disconnectedMatch = ne(function (e) {
              return g.call(e, "*");
            })),
            (p.scope = ne(function () {
              return c.querySelectorAll(":scope");
            })),
            (p.cssHas = ne(function () {
              try {
                return c.querySelector(":has(*,:jqfake)"), !1;
              } catch (e) {
                return !0;
              }
            })),
            p.getById
              ? ((r.filter.ID = function (e) {
                  var t = e.replace(K, Y);
                  return function (e) {
                    return e.getAttribute("id") === t;
                  };
                }),
                (r.find.ID = function (e, t) {
                  if (void 0 !== t.getElementById && f) {
                    var n = t.getElementById(e);
                    return n ? [n] : [];
                  }
                }))
              : ((r.filter.ID = function (e) {
                  var t = e.replace(K, Y);
                  return function (e) {
                    var n =
                      void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                    return n && n.value === t;
                  };
                }),
                (r.find.ID = function (e, t) {
                  if (void 0 !== t.getElementById && f) {
                    var n,
                      r,
                      i,
                      o = t.getElementById(e);
                    if (o) {
                      if ((n = o.getAttributeNode("id")) && n.value === e)
                        return [o];
                      for (i = t.getElementsByName(e), r = 0; (o = i[r++]); )
                        if ((n = o.getAttributeNode("id")) && n.value === e)
                          return [o];
                    }
                    return [];
                  }
                })),
            (r.find.TAG = function (e, t) {
              return void 0 !== t.getElementsByTagName
                ? t.getElementsByTagName(e)
                : t.querySelectorAll(e);
            }),
            (r.find.CLASS = function (e, t) {
              if (void 0 !== t.getElementsByClassName && f)
                return t.getElementsByClassName(e);
            }),
            (h = []),
            ne(function (e) {
              var t;
              (d.appendChild(e).innerHTML =
                "<a id='" +
                m +
                "' href='' disabled='disabled'></a><select id='" +
                m +
                "-\r\\' disabled='disabled'><option selected=''></option></select>"),
                e.querySelectorAll("[selected]").length ||
                  h.push("\\[" + A + "*(?:value|" + R + ")"),
                e.querySelectorAll("[id~=" + m + "-]").length || h.push("~="),
                e.querySelectorAll("a#" + m + "+*").length ||
                  h.push(".#.+[+~]"),
                e.querySelectorAll(":checked").length || h.push(":checked"),
                (t = c.createElement("input")).setAttribute("type", "hidden"),
                e.appendChild(t).setAttribute("name", "D"),
                (d.appendChild(e).disabled = !0),
                2 !== e.querySelectorAll(":disabled").length &&
                  h.push(":enabled", ":disabled"),
                (t = c.createElement("input")).setAttribute("name", ""),
                e.appendChild(t),
                e.querySelectorAll("[name='']").length ||
                  h.push("\\[" + A + "*name" + A + "*=" + A + "*(?:''|\"\")");
            }),
            p.cssHas || h.push(":has"),
            (h = h.length && new RegExp(h.join("|"))),
            (D = function (e, t) {
              if (e === t) return (l = !0), 0;
              var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
              return (
                n ||
                (1 &
                  (n =
                    (e.ownerDocument || e) == (t.ownerDocument || t)
                      ? e.compareDocumentPosition(t)
                      : 1) ||
                (!p.sortDetached && t.compareDocumentPosition(e) === n)
                  ? e === c || (e.ownerDocument == P && J.contains(P, e))
                    ? -1
                    : t === c || (t.ownerDocument == P && J.contains(P, t))
                    ? 1
                    : a
                    ? s.call(a, e) - s.call(a, t)
                    : 0
                  : 4 & n
                  ? -1
                  : 1)
              );
            }),
            c)
          : c;
      }
      for (t in ((J.matches = function (e, t) {
        return J(e, null, null, t);
      }),
      (J.matchesSelector = function (e, t) {
        if ((le(e), f && !H[t + " "] && (!h || !h.test(t))))
          try {
            var n = g.call(e, t);
            if (
              n ||
              p.disconnectedMatch ||
              (e.document && 11 !== e.document.nodeType)
            )
              return n;
          } catch (e) {
            H(t, !0);
          }
        return J(t, c, null, [e]).length > 0;
      }),
      (J.contains = function (e, t) {
        return (e.ownerDocument || e) != c && le(e), C.contains(e, t);
      }),
      (J.attr = function (e, t) {
        (e.ownerDocument || e) != c && le(e);
        var n = r.attrHandle[t.toLowerCase()],
          i = n && u.call(r.attrHandle, t.toLowerCase()) ? n(e, t, !f) : void 0;
        return void 0 !== i ? i : e.getAttribute(t);
      }),
      (J.error = function (e) {
        throw new Error("Syntax error, unrecognized expression: " + e);
      }),
      (C.uniqueSort = function (e) {
        var t,
          n = [],
          r = 0,
          o = 0;
        if (
          ((l = !p.sortStable),
          (a = !p.sortStable && i.call(e, 0)),
          E.call(e, D),
          l)
        ) {
          for (; (t = e[o++]); ) t === e[o] && (r = n.push(o));
          for (; r--; ) _.call(e, n[r], 1);
        }
        return (a = null), e;
      }),
      (C.fn.uniqueSort = function () {
        return this.pushStack(C.uniqueSort(i.apply(this)));
      }),
      (r = C.expr =
        {
          cacheLength: 50,
          createPseudo: te,
          match: B,
          attrHandle: {},
          find: {},
          relative: {
            ">": { dir: "parentNode", first: !0 },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: !0 },
            "~": { dir: "previousSibling" },
          },
          preFilter: {
            ATTR: function (e) {
              return (
                (e[1] = e[1].replace(K, Y)),
                (e[3] = (e[3] || e[4] || e[5] || "").replace(K, Y)),
                "~=" === e[2] && (e[3] = " " + e[3] + " "),
                e.slice(0, 4)
              );
            },
            CHILD: function (e) {
              return (
                (e[1] = e[1].toLowerCase()),
                "nth" === e[1].slice(0, 3)
                  ? (e[3] || J.error(e[0]),
                    (e[4] = +(e[4]
                      ? e[5] + (e[6] || 1)
                      : 2 * ("even" === e[3] || "odd" === e[3]))),
                    (e[5] = +(e[7] + e[8] || "odd" === e[3])))
                  : e[3] && J.error(e[0]),
                e
              );
            },
            PSEUDO: function (e) {
              var t,
                n = !e[6] && e[2];
              return B.CHILD.test(e[0])
                ? null
                : (e[3]
                    ? (e[2] = e[4] || e[5] || "")
                    : n &&
                      V.test(n) &&
                      (t = ue(n, !0)) &&
                      (t = n.indexOf(")", n.length - t) - n.length) &&
                      ((e[0] = e[0].slice(0, t)), (e[2] = n.slice(0, t))),
                  e.slice(0, 3));
            },
          },
          filter: {
            TAG: function (e) {
              var t = e.replace(K, Y).toLowerCase();
              return "*" === e
                ? function () {
                    return !0;
                  }
                : function (e) {
                    return k(e, t);
                  };
            },
            CLASS: function (e) {
              var t = x[e + " "];
              return (
                t ||
                ((t = new RegExp("(^|" + A + ")" + e + "(" + A + "|$)")) &&
                  x(e, function (e) {
                    return t.test(
                      ("string" == typeof e.className && e.className) ||
                        (void 0 !== e.getAttribute &&
                          e.getAttribute("class")) ||
                        ""
                    );
                  }))
              );
            },
            ATTR: function (e, t, n) {
              return function (r) {
                var i = J.attr(r, e);
                return null == i
                  ? "!=" === t
                  : !t ||
                      ((i += ""),
                      "=" === t
                        ? i === n
                        : "!=" === t
                        ? i !== n
                        : "^=" === t
                        ? n && 0 === i.indexOf(n)
                        : "*=" === t
                        ? n && i.indexOf(n) > -1
                        : "$=" === t
                        ? n && i.slice(-n.length) === n
                        : "~=" === t
                        ? (" " + i.replace(q, " ") + " ").indexOf(n) > -1
                        : "|=" === t &&
                          (i === n || i.slice(0, n.length + 1) === n + "-"));
              };
            },
            CHILD: function (e, t, n, r, i) {
              var o = "nth" !== e.slice(0, 3),
                a = "last" !== e.slice(-4),
                s = "of-type" === t;
              return 1 === r && 0 === i
                ? function (e) {
                    return !!e.parentNode;
                  }
                : function (t, n, l) {
                    var c,
                      u,
                      d,
                      f,
                      p,
                      h = o !== a ? "nextSibling" : "previousSibling",
                      g = t.parentNode,
                      v = s && t.nodeName.toLowerCase(),
                      b = !l && !s,
                      x = !1;
                    if (g) {
                      if (o) {
                        for (; h; ) {
                          for (d = t; (d = d[h]); )
                            if (s ? k(d, v) : 1 === d.nodeType) return !1;
                          p = h = "only" === e && !p && "nextSibling";
                        }
                        return !0;
                      }
                      if (((p = [a ? g.firstChild : g.lastChild]), a && b)) {
                        for (
                          x =
                            (f =
                              (c = (u = g[m] || (g[m] = {}))[e] || [])[0] ===
                                y && c[1]) && c[2],
                            d = f && g.childNodes[f];
                          (d = (++f && d && d[h]) || (x = f = 0) || p.pop());

                        )
                          if (1 === d.nodeType && ++x && d === t) {
                            u[e] = [y, f, x];
                            break;
                          }
                      } else if (
                        (b &&
                          (x = f =
                            (c = (u = t[m] || (t[m] = {}))[e] || [])[0] === y &&
                            c[1]),
                        !1 === x)
                      )
                        for (
                          ;
                          (d = (++f && d && d[h]) || (x = f = 0) || p.pop()) &&
                          (!(s ? k(d, v) : 1 === d.nodeType) ||
                            !++x ||
                            (b && ((u = d[m] || (d[m] = {}))[e] = [y, x]),
                            d !== t));

                        );
                      return (x -= i) === r || (x % r === 0 && x / r >= 0);
                    }
                  };
            },
            PSEUDO: function (e, t) {
              var n,
                i =
                  r.pseudos[e] ||
                  r.setFilters[e.toLowerCase()] ||
                  J.error("unsupported pseudo: " + e);
              return i[m]
                ? i(t)
                : i.length > 1
                ? ((n = [e, e, "", t]),
                  r.setFilters.hasOwnProperty(e.toLowerCase())
                    ? te(function (e, n) {
                        for (var r, o = i(e, t), a = o.length; a--; )
                          e[(r = s.call(e, o[a]))] = !(n[r] = o[a]);
                      })
                    : function (e) {
                        return i(e, 0, n);
                      })
                : i;
            },
          },
          pseudos: {
            not: te(function (e) {
              var t = [],
                n = [],
                r = me(e.replace(j, "$1"));
              return r[m]
                ? te(function (e, t, n, i) {
                    for (var o, a = r(e, null, i, []), s = e.length; s--; )
                      (o = a[s]) && (e[s] = !(t[s] = o));
                  })
                : function (e, i, o) {
                    return (
                      (t[0] = e), r(t, null, o, n), (t[0] = null), !n.pop()
                    );
                  };
            }),
            has: te(function (e) {
              return function (t) {
                return J(e, t).length > 0;
              };
            }),
            contains: te(function (e) {
              return (
                (e = e.replace(K, Y)),
                function (t) {
                  return (t.textContent || C.text(t)).indexOf(e) > -1;
                }
              );
            }),
            lang: te(function (e) {
              return (
                $.test(e || "") || J.error("unsupported lang: " + e),
                (e = e.replace(K, Y).toLowerCase()),
                function (t) {
                  var n;
                  do {
                    if (
                      (n = f
                        ? t.lang
                        : t.getAttribute("xml:lang") || t.getAttribute("lang"))
                    )
                      return (
                        (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-")
                      );
                  } while ((t = t.parentNode) && 1 === t.nodeType);
                  return !1;
                }
              );
            }),
            target: function (t) {
              var n = e.location && e.location.hash;
              return n && n.slice(1) === t.id;
            },
            root: function (e) {
              return e === d;
            },
            focus: function (e) {
              return (
                e ===
                  (function () {
                    try {
                      return c.activeElement;
                    } catch (e) {}
                  })() &&
                c.hasFocus() &&
                !!(e.type || e.href || ~e.tabIndex)
              );
            },
            enabled: oe(!1),
            disabled: oe(!0),
            checked: function (e) {
              return (
                (k(e, "input") && !!e.checked) ||
                (k(e, "option") && !!e.selected)
              );
            },
            selected: function (e) {
              return (
                e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
              );
            },
            empty: function (e) {
              for (e = e.firstChild; e; e = e.nextSibling)
                if (e.nodeType < 6) return !1;
              return !0;
            },
            parent: function (e) {
              return !r.pseudos.empty(e);
            },
            header: function (e) {
              return X.test(e.nodeName);
            },
            input: function (e) {
              return z.test(e.nodeName);
            },
            button: function (e) {
              return (k(e, "input") && "button" === e.type) || k(e, "button");
            },
            text: function (e) {
              var t;
              return (
                k(e, "input") &&
                "text" === e.type &&
                (null == (t = e.getAttribute("type")) ||
                  "text" === t.toLowerCase())
              );
            },
            first: ae(function () {
              return [0];
            }),
            last: ae(function (e, t) {
              return [t - 1];
            }),
            eq: ae(function (e, t, n) {
              return [n < 0 ? n + t : n];
            }),
            even: ae(function (e, t) {
              for (var n = 0; n < t; n += 2) e.push(n);
              return e;
            }),
            odd: ae(function (e, t) {
              for (var n = 1; n < t; n += 2) e.push(n);
              return e;
            }),
            lt: ae(function (e, t, n) {
              var r;
              for (r = n < 0 ? n + t : n > t ? t : n; --r >= 0; ) e.push(r);
              return e;
            }),
            gt: ae(function (e, t, n) {
              for (var r = n < 0 ? n + t : n; ++r < t; ) e.push(r);
              return e;
            }),
          },
        }),
      (r.pseudos.nth = r.pseudos.eq),
      { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }))
        r.pseudos[t] = re(t);
      for (t in { submit: !0, reset: !0 }) r.pseudos[t] = ie(t);
      function ce() {}
      function ue(e, t) {
        var n,
          i,
          o,
          a,
          s,
          l,
          c,
          u = w[e + " "];
        if (u) return t ? 0 : u.slice(0);
        for (s = e, l = [], c = r.preFilter; s; ) {
          for (a in ((n && !(i = I.exec(s))) ||
            (i && (s = s.slice(i[0].length) || s), l.push((o = []))),
          (n = !1),
          (i = W.exec(s)) &&
            ((n = i.shift()),
            o.push({ value: n, type: i[0].replace(j, " ") }),
            (s = s.slice(n.length))),
          r.filter))
            !(i = B[a].exec(s)) ||
              (c[a] && !(i = c[a](i))) ||
              ((n = i.shift()),
              o.push({ value: n, type: a, matches: i }),
              (s = s.slice(n.length)));
          if (!n) break;
        }
        return t ? s.length : s ? J.error(e) : w(e, l).slice(0);
      }
      function de(e) {
        for (var t = 0, n = e.length, r = ""; t < n; t++) r += e[t].value;
        return r;
      }
      function fe(e, t, n) {
        var r = t.dir,
          i = t.next,
          o = i || r,
          a = n && "parentNode" === o,
          s = b++;
        return t.first
          ? function (t, n, i) {
              for (; (t = t[r]); ) if (1 === t.nodeType || a) return e(t, n, i);
              return !1;
            }
          : function (t, n, l) {
              var c,
                u,
                d = [y, s];
              if (l) {
                for (; (t = t[r]); )
                  if ((1 === t.nodeType || a) && e(t, n, l)) return !0;
              } else
                for (; (t = t[r]); )
                  if (1 === t.nodeType || a)
                    if (((u = t[m] || (t[m] = {})), i && k(t, i)))
                      t = t[r] || t;
                    else {
                      if ((c = u[o]) && c[0] === y && c[1] === s)
                        return (d[2] = c[2]);
                      if (((u[o] = d), (d[2] = e(t, n, l)))) return !0;
                    }
              return !1;
            };
      }
      function pe(e) {
        return e.length > 1
          ? function (t, n, r) {
              for (var i = e.length; i--; ) if (!e[i](t, n, r)) return !1;
              return !0;
            }
          : e[0];
      }
      function he(e, t, n, r, i) {
        for (var o, a = [], s = 0, l = e.length, c = null != t; s < l; s++)
          (o = e[s]) && ((n && !n(o, r, i)) || (a.push(o), c && t.push(s)));
        return a;
      }
      function ge(e, t, n, r, i, o) {
        return (
          r && !r[m] && (r = ge(r)),
          i && !i[m] && (i = ge(i, o)),
          te(function (o, a, l, c) {
            var u,
              d,
              f,
              p,
              h = [],
              g = [],
              m = a.length,
              y =
                o ||
                (function (e, t, n) {
                  for (var r = 0, i = t.length; r < i; r++) J(e, t[r], n);
                  return n;
                })(t || "*", l.nodeType ? [l] : l, []),
              b = !e || (!o && t) ? y : he(y, h, e, l, c);
            if (
              (n ? n(b, (p = i || (o ? e : m || r) ? [] : a), l, c) : (p = b),
              r)
            )
              for (u = he(p, g), r(u, [], l, c), d = u.length; d--; )
                (f = u[d]) && (p[g[d]] = !(b[g[d]] = f));
            if (o) {
              if (i || e) {
                if (i) {
                  for (u = [], d = p.length; d--; )
                    (f = p[d]) && u.push((b[d] = f));
                  i(null, (p = []), u, c);
                }
                for (d = p.length; d--; )
                  (f = p[d]) &&
                    (u = i ? s.call(o, f) : h[d]) > -1 &&
                    (o[u] = !(a[u] = f));
              }
            } else (p = he(p === a ? p.splice(m, p.length) : p)), i ? i(null, a, p, c) : v.apply(a, p);
          })
        );
      }
      function ve(e) {
        for (
          var t,
            n,
            i,
            a = e.length,
            l = r.relative[e[0].type],
            c = l || r.relative[" "],
            u = l ? 1 : 0,
            d = fe(
              function (e) {
                return e === t;
              },
              c,
              !0
            ),
            f = fe(
              function (e) {
                return s.call(t, e) > -1;
              },
              c,
              !0
            ),
            p = [
              function (e, n, r) {
                var i =
                  (!l && (r || n != o)) ||
                  ((t = n).nodeType ? d(e, n, r) : f(e, n, r));
                return (t = null), i;
              },
            ];
          u < a;
          u++
        )
          if ((n = r.relative[e[u].type])) p = [fe(pe(p), n)];
          else {
            if ((n = r.filter[e[u].type].apply(null, e[u].matches))[m]) {
              for (i = ++u; i < a && !r.relative[e[i].type]; i++);
              return ge(
                u > 1 && pe(p),
                u > 1 &&
                  de(
                    e
                      .slice(0, u - 1)
                      .concat({ value: " " === e[u - 2].type ? "*" : "" })
                  ).replace(j, "$1"),
                n,
                u < i && ve(e.slice(u, i)),
                i < a && ve((e = e.slice(i))),
                i < a && de(e)
              );
            }
            p.push(n);
          }
        return pe(p);
      }
      function me(e, t) {
        var n,
          i = [],
          a = [],
          s = T[e + " "];
        if (!s) {
          for (t || (t = ue(e)), n = t.length; n--; )
            (s = ve(t[n]))[m] ? i.push(s) : a.push(s);
          (s = T(
            e,
            (function (e, t) {
              var n = t.length > 0,
                i = e.length > 0,
                a = function (a, s, l, u, d) {
                  var p,
                    h,
                    g,
                    m = 0,
                    b = "0",
                    x = a && [],
                    w = [],
                    T = o,
                    k = a || (i && r.find.TAG("*", d)),
                    E = (y += null == T ? 1 : Math.random() || 0.1),
                    _ = k.length;
                  for (
                    d && (o = s == c || s || d);
                    b !== _ && null != (p = k[b]);
                    b++
                  ) {
                    if (i && p) {
                      for (
                        h = 0, s || p.ownerDocument == c || (le(p), (l = !f));
                        (g = e[h++]);

                      )
                        if (g(p, s || c, l)) {
                          v.call(u, p);
                          break;
                        }
                      d && (y = E);
                    }
                    n && ((p = !g && p) && m--, a && x.push(p));
                  }
                  if (((m += b), n && b !== m)) {
                    for (h = 0; (g = t[h++]); ) g(x, w, s, l);
                    if (a) {
                      if (m > 0)
                        for (; b--; ) x[b] || w[b] || (w[b] = S.call(u));
                      w = he(w);
                    }
                    v.apply(u, w),
                      d &&
                        !a &&
                        w.length > 0 &&
                        m + t.length > 1 &&
                        C.uniqueSort(u);
                  }
                  return d && ((y = E), (o = T)), x;
                };
              return n ? te(a) : a;
            })(a, i)
          )),
            (s.selector = e);
        }
        return s;
      }
      function ye(e, t, n, i) {
        var o,
          a,
          s,
          l,
          c,
          u = "function" == typeof e && e,
          d = !i && ue((e = u.selector || e));
        if (((n = n || []), 1 === d.length)) {
          if (
            (a = d[0] = d[0].slice(0)).length > 2 &&
            "ID" === (s = a[0]).type &&
            9 === t.nodeType &&
            f &&
            r.relative[a[1].type]
          ) {
            if (!(t = (r.find.ID(s.matches[0].replace(K, Y), t) || [])[0]))
              return n;
            u && (t = t.parentNode), (e = e.slice(a.shift().value.length));
          }
          for (
            o = B.needsContext.test(e) ? 0 : a.length;
            o-- && ((s = a[o]), !r.relative[(l = s.type)]);

          )
            if (
              (c = r.find[l]) &&
              (i = c(
                s.matches[0].replace(K, Y),
                (U.test(a[0].type) && se(t.parentNode)) || t
              ))
            ) {
              if ((a.splice(o, 1), !(e = i.length && de(a))))
                return v.apply(n, i), n;
              break;
            }
        }
        return (
          (u || me(e, d))(
            i,
            t,
            !f,
            n,
            !t || (U.test(e) && se(t.parentNode)) || t
          ),
          n
        );
      }
      (ce.prototype = r.filters = r.pseudos),
        (r.setFilters = new ce()),
        (p.sortStable = m.split("").sort(D).join("") === m),
        le(),
        (p.sortDetached = ne(function (e) {
          return 1 & e.compareDocumentPosition(c.createElement("fieldset"));
        })),
        (C.find = J),
        (C.expr[":"] = C.expr.pseudos),
        (C.unique = C.uniqueSort),
        (J.compile = me),
        (J.select = ye),
        (J.setDocument = le),
        (J.tokenize = ue),
        (J.escape = C.escapeSelector),
        (J.getText = C.text),
        (J.isXML = C.isXMLDoc),
        (J.selectors = C.expr),
        (J.support = C.support),
        (J.uniqueSort = C.uniqueSort);
    })();
    var R = function (e, t, n) {
        for (var r = [], i = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
          if (1 === e.nodeType) {
            if (i && C(e).is(n)) break;
            r.push(e);
          }
        return r;
      },
      L = function (e, t) {
        for (var n = []; e; e = e.nextSibling)
          1 === e.nodeType && e !== t && n.push(e);
        return n;
      },
      N = C.expr.match.needsContext,
      M = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    function q(e, t, n) {
      return h(t)
        ? C.grep(e, function (e, r) {
            return !!t.call(e, r, e) !== n;
          })
        : t.nodeType
        ? C.grep(e, function (e) {
            return (e === t) !== n;
          })
        : "string" != typeof t
        ? C.grep(e, function (e) {
            return s.call(t, e) > -1 !== n;
          })
        : C.filter(t, e, n);
    }
    (C.filter = function (e, t, n) {
      var r = t[0];
      return (
        n && (e = ":not(" + e + ")"),
        1 === t.length && 1 === r.nodeType
          ? C.find.matchesSelector(r, e)
            ? [r]
            : []
          : C.find.matches(
              e,
              C.grep(t, function (e) {
                return 1 === e.nodeType;
              })
            )
      );
    }),
      C.fn.extend({
        find: function (e) {
          var t,
            n,
            r = this.length,
            i = this;
          if ("string" != typeof e)
            return this.pushStack(
              C(e).filter(function () {
                for (t = 0; t < r; t++) if (C.contains(i[t], this)) return !0;
              })
            );
          for (n = this.pushStack([]), t = 0; t < r; t++) C.find(e, i[t], n);
          return r > 1 ? C.uniqueSort(n) : n;
        },
        filter: function (e) {
          return this.pushStack(q(this, e || [], !1));
        },
        not: function (e) {
          return this.pushStack(q(this, e || [], !0));
        },
        is: function (e) {
          return !!q(
            this,
            "string" == typeof e && N.test(e) ? C(e) : e || [],
            !1
          ).length;
        },
      });
    var I,
      W = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    ((C.fn.init = function (e, t, n) {
      var r, i;
      if (!e) return this;
      if (((n = n || I), "string" == typeof e)) {
        if (
          !(r =
            "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3
              ? [null, e, null]
              : W.exec(e)) ||
          (!r[1] && t)
        )
          return !t || t.jquery
            ? (t || n).find(e)
            : this.constructor(t).find(e);
        if (r[1]) {
          if (
            ((t = t instanceof C ? t[0] : t),
            C.merge(
              this,
              C.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : v, !0)
            ),
            M.test(r[1]) && C.isPlainObject(t))
          )
            for (r in t) h(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
          return this;
        }
        return (
          (i = v.getElementById(r[2])) && ((this[0] = i), (this.length = 1)),
          this
        );
      }
      return e.nodeType
        ? ((this[0] = e), (this.length = 1), this)
        : h(e)
        ? void 0 !== n.ready
          ? n.ready(e)
          : e(C)
        : C.makeArray(e, this);
    }).prototype = C.fn),
      (I = C(v));
    var F = /^(?:parents|prev(?:Until|All))/,
      V = { children: !0, contents: !0, next: !0, prev: !0 };
    function $(e, t) {
      for (; (e = e[t]) && 1 !== e.nodeType; );
      return e;
    }
    C.fn.extend({
      has: function (e) {
        var t = C(e, this),
          n = t.length;
        return this.filter(function () {
          for (var e = 0; e < n; e++) if (C.contains(this, t[e])) return !0;
        });
      },
      closest: function (e, t) {
        var n,
          r = 0,
          i = this.length,
          o = [],
          a = "string" != typeof e && C(e);
        if (!N.test(e))
          for (; r < i; r++)
            for (n = this[r]; n && n !== t; n = n.parentNode)
              if (
                n.nodeType < 11 &&
                (a
                  ? a.index(n) > -1
                  : 1 === n.nodeType && C.find.matchesSelector(n, e))
              ) {
                o.push(n);
                break;
              }
        return this.pushStack(o.length > 1 ? C.uniqueSort(o) : o);
      },
      index: function (e) {
        return e
          ? "string" == typeof e
            ? s.call(C(e), this[0])
            : s.call(this, e.jquery ? e[0] : e)
          : this[0] && this[0].parentNode
          ? this.first().prevAll().length
          : -1;
      },
      add: function (e, t) {
        return this.pushStack(C.uniqueSort(C.merge(this.get(), C(e, t))));
      },
      addBack: function (e) {
        return this.add(
          null == e ? this.prevObject : this.prevObject.filter(e)
        );
      },
    }),
      C.each(
        {
          parent: function (e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null;
          },
          parents: function (e) {
            return R(e, "parentNode");
          },
          parentsUntil: function (e, t, n) {
            return R(e, "parentNode", n);
          },
          next: function (e) {
            return $(e, "nextSibling");
          },
          prev: function (e) {
            return $(e, "previousSibling");
          },
          nextAll: function (e) {
            return R(e, "nextSibling");
          },
          prevAll: function (e) {
            return R(e, "previousSibling");
          },
          nextUntil: function (e, t, n) {
            return R(e, "nextSibling", n);
          },
          prevUntil: function (e, t, n) {
            return R(e, "previousSibling", n);
          },
          siblings: function (e) {
            return L((e.parentNode || {}).firstChild, e);
          },
          children: function (e) {
            return L(e.firstChild);
          },
          contents: function (e) {
            return null != e.contentDocument && r(e.contentDocument)
              ? e.contentDocument
              : (k(e, "template") && (e = e.content || e),
                C.merge([], e.childNodes));
          },
        },
        function (e, t) {
          C.fn[e] = function (n, r) {
            var i = C.map(this, t, n);
            return (
              "Until" !== e.slice(-5) && (r = n),
              r && "string" == typeof r && (i = C.filter(r, i)),
              this.length > 1 &&
                (V[e] || C.uniqueSort(i), F.test(e) && i.reverse()),
              this.pushStack(i)
            );
          };
        }
      );
    var B = /[^\x20\t\r\n\f]+/g;
    function z(e) {
      return e;
    }
    function X(e) {
      throw e;
    }
    function Q(e, t, n, r) {
      var i;
      try {
        e && h((i = e.promise))
          ? i.call(e).done(t).fail(n)
          : e && h((i = e.then))
          ? i.call(e, t, n)
          : t.apply(void 0, [e].slice(r));
      } catch (e) {
        n.apply(void 0, [e]);
      }
    }
    (C.Callbacks = function (e) {
      e =
        "string" == typeof e
          ? (function (e) {
              var t = {};
              return (
                C.each(e.match(B) || [], function (e, n) {
                  t[n] = !0;
                }),
                t
              );
            })(e)
          : C.extend({}, e);
      var t,
        n,
        r,
        i,
        o = [],
        a = [],
        s = -1,
        l = function () {
          for (i = i || e.once, r = t = !0; a.length; s = -1)
            for (n = a.shift(); ++s < o.length; )
              !1 === o[s].apply(n[0], n[1]) &&
                e.stopOnFalse &&
                ((s = o.length), (n = !1));
          e.memory || (n = !1), (t = !1), i && (o = n ? [] : "");
        },
        c = {
          add: function () {
            return (
              o &&
                (n && !t && ((s = o.length - 1), a.push(n)),
                (function t(n) {
                  C.each(n, function (n, r) {
                    h(r)
                      ? (e.unique && c.has(r)) || o.push(r)
                      : r && r.length && "string" !== b(r) && t(r);
                  });
                })(arguments),
                n && !t && l()),
              this
            );
          },
          remove: function () {
            return (
              C.each(arguments, function (e, t) {
                for (var n; (n = C.inArray(t, o, n)) > -1; )
                  o.splice(n, 1), n <= s && s--;
              }),
              this
            );
          },
          has: function (e) {
            return e ? C.inArray(e, o) > -1 : o.length > 0;
          },
          empty: function () {
            return o && (o = []), this;
          },
          disable: function () {
            return (i = a = []), (o = n = ""), this;
          },
          disabled: function () {
            return !o;
          },
          lock: function () {
            return (i = a = []), n || t || (o = n = ""), this;
          },
          locked: function () {
            return !!i;
          },
          fireWith: function (e, n) {
            return (
              i ||
                ((n = [e, (n = n || []).slice ? n.slice() : n]),
                a.push(n),
                t || l()),
              this
            );
          },
          fire: function () {
            return c.fireWith(this, arguments), this;
          },
          fired: function () {
            return !!r;
          },
        };
      return c;
    }),
      C.extend({
        Deferred: function (t) {
          var n = [
              [
                "notify",
                "progress",
                C.Callbacks("memory"),
                C.Callbacks("memory"),
                2,
              ],
              [
                "resolve",
                "done",
                C.Callbacks("once memory"),
                C.Callbacks("once memory"),
                0,
                "resolved",
              ],
              [
                "reject",
                "fail",
                C.Callbacks("once memory"),
                C.Callbacks("once memory"),
                1,
                "rejected",
              ],
            ],
            r = "pending",
            i = {
              state: function () {
                return r;
              },
              always: function () {
                return o.done(arguments).fail(arguments), this;
              },
              catch: function (e) {
                return i.then(null, e);
              },
              pipe: function () {
                var e = arguments;
                return C.Deferred(function (t) {
                  C.each(n, function (n, r) {
                    var i = h(e[r[4]]) && e[r[4]];
                    o[r[1]](function () {
                      var e = i && i.apply(this, arguments);
                      e && h(e.promise)
                        ? e
                            .promise()
                            .progress(t.notify)
                            .done(t.resolve)
                            .fail(t.reject)
                        : t[r[0] + "With"](this, i ? [e] : arguments);
                    });
                  }),
                    (e = null);
                }).promise();
              },
              then: function (t, r, i) {
                var o = 0;
                function a(t, n, r, i) {
                  return function () {
                    var s = this,
                      l = arguments,
                      c = function () {
                        var e, c;
                        if (!(t < o)) {
                          if ((e = r.apply(s, l)) === n.promise())
                            throw new TypeError("Thenable self-resolution");
                          (c =
                            e &&
                            ("object" == typeof e || "function" == typeof e) &&
                            e.then),
                            h(c)
                              ? i
                                ? c.call(e, a(o, n, z, i), a(o, n, X, i))
                                : (o++,
                                  c.call(
                                    e,
                                    a(o, n, z, i),
                                    a(o, n, X, i),
                                    a(o, n, z, n.notifyWith)
                                  ))
                              : (r !== z && ((s = void 0), (l = [e])),
                                (i || n.resolveWith)(s, l));
                        }
                      },
                      u = i
                        ? c
                        : function () {
                            try {
                              c();
                            } catch (e) {
                              C.Deferred.exceptionHook &&
                                C.Deferred.exceptionHook(e, u.error),
                                t + 1 >= o &&
                                  (r !== X && ((s = void 0), (l = [e])),
                                  n.rejectWith(s, l));
                            }
                          };
                    t
                      ? u()
                      : (C.Deferred.getErrorHook
                          ? (u.error = C.Deferred.getErrorHook())
                          : C.Deferred.getStackHook &&
                            (u.error = C.Deferred.getStackHook()),
                        e.setTimeout(u));
                  };
                }
                return C.Deferred(function (e) {
                  n[0][3].add(a(0, e, h(i) ? i : z, e.notifyWith)),
                    n[1][3].add(a(0, e, h(t) ? t : z)),
                    n[2][3].add(a(0, e, h(r) ? r : X));
                }).promise();
              },
              promise: function (e) {
                return null != e ? C.extend(e, i) : i;
              },
            },
            o = {};
          return (
            C.each(n, function (e, t) {
              var a = t[2],
                s = t[5];
              (i[t[1]] = a.add),
                s &&
                  a.add(
                    function () {
                      r = s;
                    },
                    n[3 - e][2].disable,
                    n[3 - e][3].disable,
                    n[0][2].lock,
                    n[0][3].lock
                  ),
                a.add(t[3].fire),
                (o[t[0]] = function () {
                  return (
                    o[t[0] + "With"](this === o ? void 0 : this, arguments),
                    this
                  );
                }),
                (o[t[0] + "With"] = a.fireWith);
            }),
            i.promise(o),
            t && t.call(o, o),
            o
          );
        },
        when: function (e) {
          var t = arguments.length,
            n = t,
            r = Array(n),
            o = i.call(arguments),
            a = C.Deferred(),
            s = function (e) {
              return function (n) {
                (r[e] = this),
                  (o[e] = arguments.length > 1 ? i.call(arguments) : n),
                  --t || a.resolveWith(r, o);
              };
            };
          if (
            t <= 1 &&
            (Q(e, a.done(s(n)).resolve, a.reject, !t),
            "pending" === a.state() || h(o[n] && o[n].then))
          )
            return a.then();
          for (; n--; ) Q(o[n], s(n), a.reject);
          return a.promise();
        },
      });
    var U = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    (C.Deferred.exceptionHook = function (t, n) {
      e.console &&
        e.console.warn &&
        t &&
        U.test(t.name) &&
        e.console.warn("jQuery.Deferred exception: " + t.message, t.stack, n);
    }),
      (C.readyException = function (t) {
        e.setTimeout(function () {
          throw t;
        });
      });
    var K = C.Deferred();
    function Y() {
      v.removeEventListener("DOMContentLoaded", Y),
        e.removeEventListener("load", Y),
        C.ready();
    }
    (C.fn.ready = function (e) {
      return (
        K.then(e).catch(function (e) {
          C.readyException(e);
        }),
        this
      );
    }),
      C.extend({
        isReady: !1,
        readyWait: 1,
        ready: function (e) {
          (!0 === e ? --C.readyWait : C.isReady) ||
            ((C.isReady = !0),
            (!0 !== e && --C.readyWait > 0) || K.resolveWith(v, [C]));
        },
      }),
      (C.ready.then = K.then),
      "complete" === v.readyState ||
      ("loading" !== v.readyState && !v.documentElement.doScroll)
        ? e.setTimeout(C.ready)
        : (v.addEventListener("DOMContentLoaded", Y),
          e.addEventListener("load", Y));
    var Z = function (e, t, n, r, i, o, a) {
        var s = 0,
          l = e.length,
          c = null == n;
        if ("object" === b(n))
          for (s in ((i = !0), n)) Z(e, t, s, n[s], !0, o, a);
        else if (
          void 0 !== r &&
          ((i = !0),
          h(r) || (a = !0),
          c &&
            (a
              ? (t.call(e, r), (t = null))
              : ((c = t),
                (t = function (e, t, n) {
                  return c.call(C(e), n);
                }))),
          t)
        )
          for (; s < l; s++) t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
        return i ? e : c ? t.call(e) : l ? t(e[0], n) : o;
      },
      G = /^-ms-/,
      J = /-([a-z])/g;
    function ee(e, t) {
      return t.toUpperCase();
    }
    function te(e) {
      return e.replace(G, "ms-").replace(J, ee);
    }
    var ne = function (e) {
      return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType;
    };
    function re() {
      this.expando = C.expando + re.uid++;
    }
    (re.uid = 1),
      (re.prototype = {
        cache: function (e) {
          var t = e[this.expando];
          return (
            t ||
              ((t = {}),
              ne(e) &&
                (e.nodeType
                  ? (e[this.expando] = t)
                  : Object.defineProperty(e, this.expando, {
                      value: t,
                      configurable: !0,
                    }))),
            t
          );
        },
        set: function (e, t, n) {
          var r,
            i = this.cache(e);
          if ("string" == typeof t) i[te(t)] = n;
          else for (r in t) i[te(r)] = t[r];
          return i;
        },
        get: function (e, t) {
          return void 0 === t
            ? this.cache(e)
            : e[this.expando] && e[this.expando][te(t)];
        },
        access: function (e, t, n) {
          return void 0 === t || (t && "string" == typeof t && void 0 === n)
            ? this.get(e, t)
            : (this.set(e, t, n), void 0 !== n ? n : t);
        },
        remove: function (e, t) {
          var n,
            r = e[this.expando];
          if (void 0 !== r) {
            if (void 0 !== t) {
              n = (t = Array.isArray(t)
                ? t.map(te)
                : (t = te(t)) in r
                ? [t]
                : t.match(B) || []).length;
              for (; n--; ) delete r[t[n]];
            }
            (void 0 === t || C.isEmptyObject(r)) &&
              (e.nodeType
                ? (e[this.expando] = void 0)
                : delete e[this.expando]);
          }
        },
        hasData: function (e) {
          var t = e[this.expando];
          return void 0 !== t && !C.isEmptyObject(t);
        },
      });
    var ie = new re(),
      oe = new re(),
      ae = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
      se = /[A-Z]/g;
    function le(e, t, n) {
      var r;
      if (void 0 === n && 1 === e.nodeType)
        if (
          ((r = "data-" + t.replace(se, "-$&").toLowerCase()),
          "string" == typeof (n = e.getAttribute(r)))
        ) {
          try {
            n = (function (e) {
              return (
                "true" === e ||
                ("false" !== e &&
                  ("null" === e
                    ? null
                    : e === +e + ""
                    ? +e
                    : ae.test(e)
                    ? JSON.parse(e)
                    : e))
              );
            })(n);
          } catch (e) {}
          oe.set(e, t, n);
        } else n = void 0;
      return n;
    }
    C.extend({
      hasData: function (e) {
        return oe.hasData(e) || ie.hasData(e);
      },
      data: function (e, t, n) {
        return oe.access(e, t, n);
      },
      removeData: function (e, t) {
        oe.remove(e, t);
      },
      _data: function (e, t, n) {
        return ie.access(e, t, n);
      },
      _removeData: function (e, t) {
        ie.remove(e, t);
      },
    }),
      C.fn.extend({
        data: function (e, t) {
          var n,
            r,
            i,
            o = this[0],
            a = o && o.attributes;
          if (void 0 === e) {
            if (
              this.length &&
              ((i = oe.get(o)), 1 === o.nodeType && !ie.get(o, "hasDataAttrs"))
            ) {
              for (n = a.length; n--; )
                a[n] &&
                  0 === (r = a[n].name).indexOf("data-") &&
                  ((r = te(r.slice(5))), le(o, r, i[r]));
              ie.set(o, "hasDataAttrs", !0);
            }
            return i;
          }
          return "object" == typeof e
            ? this.each(function () {
                oe.set(this, e);
              })
            : Z(
                this,
                function (t) {
                  var n;
                  if (o && void 0 === t)
                    return void 0 !== (n = oe.get(o, e)) ||
                      void 0 !== (n = le(o, e))
                      ? n
                      : void 0;
                  this.each(function () {
                    oe.set(this, e, t);
                  });
                },
                null,
                t,
                arguments.length > 1,
                null,
                !0
              );
        },
        removeData: function (e) {
          return this.each(function () {
            oe.remove(this, e);
          });
        },
      }),
      C.extend({
        queue: function (e, t, n) {
          var r;
          if (e)
            return (
              (t = (t || "fx") + "queue"),
              (r = ie.get(e, t)),
              n &&
                (!r || Array.isArray(n)
                  ? (r = ie.access(e, t, C.makeArray(n)))
                  : r.push(n)),
              r || []
            );
        },
        dequeue: function (e, t) {
          t = t || "fx";
          var n = C.queue(e, t),
            r = n.length,
            i = n.shift(),
            o = C._queueHooks(e, t);
          "inprogress" === i && ((i = n.shift()), r--),
            i &&
              ("fx" === t && n.unshift("inprogress"),
              delete o.stop,
              i.call(
                e,
                function () {
                  C.dequeue(e, t);
                },
                o
              )),
            !r && o && o.empty.fire();
        },
        _queueHooks: function (e, t) {
          var n = t + "queueHooks";
          return (
            ie.get(e, n) ||
            ie.access(e, n, {
              empty: C.Callbacks("once memory").add(function () {
                ie.remove(e, [t + "queue", n]);
              }),
            })
          );
        },
      }),
      C.fn.extend({
        queue: function (e, t) {
          var n = 2;
          return (
            "string" != typeof e && ((t = e), (e = "fx"), n--),
            arguments.length < n
              ? C.queue(this[0], e)
              : void 0 === t
              ? this
              : this.each(function () {
                  var n = C.queue(this, e, t);
                  C._queueHooks(this, e),
                    "fx" === e && "inprogress" !== n[0] && C.dequeue(this, e);
                })
          );
        },
        dequeue: function (e) {
          return this.each(function () {
            C.dequeue(this, e);
          });
        },
        clearQueue: function (e) {
          return this.queue(e || "fx", []);
        },
        promise: function (e, t) {
          var n,
            r = 1,
            i = C.Deferred(),
            o = this,
            a = this.length,
            s = function () {
              --r || i.resolveWith(o, [o]);
            };
          for (
            "string" != typeof e && ((t = e), (e = void 0)), e = e || "fx";
            a--;

          )
            (n = ie.get(o[a], e + "queueHooks")) &&
              n.empty &&
              (r++, n.empty.add(s));
          return s(), i.promise(t);
        },
      });
    var ce = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
      ue = new RegExp("^(?:([+-])=|)(" + ce + ")([a-z%]*)$", "i"),
      de = ["Top", "Right", "Bottom", "Left"],
      fe = v.documentElement,
      pe = function (e) {
        return C.contains(e.ownerDocument, e);
      },
      he = { composed: !0 };
    fe.getRootNode &&
      (pe = function (e) {
        return (
          C.contains(e.ownerDocument, e) ||
          e.getRootNode(he) === e.ownerDocument
        );
      });
    var ge = function (e, t) {
      return (
        "none" === (e = t || e).style.display ||
        ("" === e.style.display && pe(e) && "none" === C.css(e, "display"))
      );
    };
    function ve(e, t, n, r) {
      var i,
        o,
        a = 20,
        s = r
          ? function () {
              return r.cur();
            }
          : function () {
              return C.css(e, t, "");
            },
        l = s(),
        c = (n && n[3]) || (C.cssNumber[t] ? "" : "px"),
        u =
          e.nodeType &&
          (C.cssNumber[t] || ("px" !== c && +l)) &&
          ue.exec(C.css(e, t));
      if (u && u[3] !== c) {
        for (l /= 2, c = c || u[3], u = +l || 1; a--; )
          C.style(e, t, u + c),
            (1 - o) * (1 - (o = s() / l || 0.5)) <= 0 && (a = 0),
            (u /= o);
        (u *= 2), C.style(e, t, u + c), (n = n || []);
      }
      return (
        n &&
          ((u = +u || +l || 0),
          (i = n[1] ? u + (n[1] + 1) * n[2] : +n[2]),
          r && ((r.unit = c), (r.start = u), (r.end = i))),
        i
      );
    }
    var me = {};
    function ye(e) {
      var t,
        n = e.ownerDocument,
        r = e.nodeName,
        i = me[r];
      return (
        i ||
        ((t = n.body.appendChild(n.createElement(r))),
        (i = C.css(t, "display")),
        t.parentNode.removeChild(t),
        "none" === i && (i = "block"),
        (me[r] = i),
        i)
      );
    }
    function be(e, t) {
      for (var n, r, i = [], o = 0, a = e.length; o < a; o++)
        (r = e[o]).style &&
          ((n = r.style.display),
          t
            ? ("none" === n &&
                ((i[o] = ie.get(r, "display") || null),
                i[o] || (r.style.display = "")),
              "" === r.style.display && ge(r) && (i[o] = ye(r)))
            : "none" !== n && ((i[o] = "none"), ie.set(r, "display", n)));
      for (o = 0; o < a; o++) null != i[o] && (e[o].style.display = i[o]);
      return e;
    }
    C.fn.extend({
      show: function () {
        return be(this, !0);
      },
      hide: function () {
        return be(this);
      },
      toggle: function (e) {
        return "boolean" == typeof e
          ? e
            ? this.show()
            : this.hide()
          : this.each(function () {
              ge(this) ? C(this).show() : C(this).hide();
            });
      },
    });
    var xe,
      we,
      Ce = /^(?:checkbox|radio)$/i,
      Te = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
      ke = /^$|^module$|\/(?:java|ecma)script/i;
    (xe = v.createDocumentFragment().appendChild(v.createElement("div"))),
      (we = v.createElement("input")).setAttribute("type", "radio"),
      we.setAttribute("checked", "checked"),
      we.setAttribute("name", "t"),
      xe.appendChild(we),
      (p.checkClone = xe.cloneNode(!0).cloneNode(!0).lastChild.checked),
      (xe.innerHTML = "<textarea>x</textarea>"),
      (p.noCloneChecked = !!xe.cloneNode(!0).lastChild.defaultValue),
      (xe.innerHTML = "<option></option>"),
      (p.option = !!xe.lastChild);
    var Se = {
      thead: [1, "<table>", "</table>"],
      col: [2, "<table><colgroup>", "</colgroup></table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: [0, "", ""],
    };
    function Ee(e, t) {
      var n;
      return (
        (n =
          void 0 !== e.getElementsByTagName
            ? e.getElementsByTagName(t || "*")
            : void 0 !== e.querySelectorAll
            ? e.querySelectorAll(t || "*")
            : []),
        void 0 === t || (t && k(e, t)) ? C.merge([e], n) : n
      );
    }
    function _e(e, t) {
      for (var n = 0, r = e.length; n < r; n++)
        ie.set(e[n], "globalEval", !t || ie.get(t[n], "globalEval"));
    }
    (Se.tbody = Se.tfoot = Se.colgroup = Se.caption = Se.thead),
      (Se.th = Se.td),
      p.option ||
        (Se.optgroup = Se.option =
          [1, "<select multiple='multiple'>", "</select>"]);
    var Ae = /<|&#?\w+;/;
    function je(e, t, n, r, i) {
      for (
        var o,
          a,
          s,
          l,
          c,
          u,
          d = t.createDocumentFragment(),
          f = [],
          p = 0,
          h = e.length;
        p < h;
        p++
      )
        if ((o = e[p]) || 0 === o)
          if ("object" === b(o)) C.merge(f, o.nodeType ? [o] : o);
          else if (Ae.test(o)) {
            for (
              a = a || d.appendChild(t.createElement("div")),
                s = (Te.exec(o) || ["", ""])[1].toLowerCase(),
                l = Se[s] || Se._default,
                a.innerHTML = l[1] + C.htmlPrefilter(o) + l[2],
                u = l[0];
              u--;

            )
              a = a.lastChild;
            C.merge(f, a.childNodes), ((a = d.firstChild).textContent = "");
          } else f.push(t.createTextNode(o));
      for (d.textContent = "", p = 0; (o = f[p++]); )
        if (r && C.inArray(o, r) > -1) i && i.push(o);
        else if (
          ((c = pe(o)), (a = Ee(d.appendChild(o), "script")), c && _e(a), n)
        )
          for (u = 0; (o = a[u++]); ) ke.test(o.type || "") && n.push(o);
      return d;
    }
    var He = /^([^.]*)(?:\.(.+)|)/;
    function De() {
      return !0;
    }
    function Pe() {
      return !1;
    }
    function Oe(e, t, n, r, i, o) {
      var a, s;
      if ("object" == typeof t) {
        for (s in ("string" != typeof n && ((r = r || n), (n = void 0)), t))
          Oe(e, s, n, r, t[s], o);
        return e;
      }
      if (
        (null == r && null == i
          ? ((i = n), (r = n = void 0))
          : null == i &&
            ("string" == typeof n
              ? ((i = r), (r = void 0))
              : ((i = r), (r = n), (n = void 0))),
        !1 === i)
      )
        i = Pe;
      else if (!i) return e;
      return (
        1 === o &&
          ((a = i),
          (i = function (e) {
            return C().off(e), a.apply(this, arguments);
          }),
          (i.guid = a.guid || (a.guid = C.guid++))),
        e.each(function () {
          C.event.add(this, t, i, r, n);
        })
      );
    }
    function Re(e, t, n) {
      n
        ? (ie.set(e, t, !1),
          C.event.add(e, t, {
            namespace: !1,
            handler: function (e) {
              var n,
                r = ie.get(this, t);
              if (1 & e.isTrigger && this[t]) {
                if (r)
                  (C.event.special[t] || {}).delegateType &&
                    e.stopPropagation();
                else if (
                  ((r = i.call(arguments)),
                  ie.set(this, t, r),
                  this[t](),
                  (n = ie.get(this, t)),
                  ie.set(this, t, !1),
                  r !== n)
                )
                  return e.stopImmediatePropagation(), e.preventDefault(), n;
              } else
                r &&
                  (ie.set(this, t, C.event.trigger(r[0], r.slice(1), this)),
                  e.stopPropagation(),
                  (e.isImmediatePropagationStopped = De));
            },
          }))
        : void 0 === ie.get(e, t) && C.event.add(e, t, De);
    }
    (C.event = {
      global: {},
      add: function (e, t, n, r, i) {
        var o,
          a,
          s,
          l,
          c,
          u,
          d,
          f,
          p,
          h,
          g,
          v = ie.get(e);
        if (ne(e))
          for (
            n.handler && ((n = (o = n).handler), (i = o.selector)),
              i && C.find.matchesSelector(fe, i),
              n.guid || (n.guid = C.guid++),
              (l = v.events) || (l = v.events = Object.create(null)),
              (a = v.handle) ||
                (a = v.handle =
                  function (t) {
                    return void 0 !== C && C.event.triggered !== t.type
                      ? C.event.dispatch.apply(e, arguments)
                      : void 0;
                  }),
              c = (t = (t || "").match(B) || [""]).length;
            c--;

          )
            (p = g = (s = He.exec(t[c]) || [])[1]),
              (h = (s[2] || "").split(".").sort()),
              p &&
                ((d = C.event.special[p] || {}),
                (p = (i ? d.delegateType : d.bindType) || p),
                (d = C.event.special[p] || {}),
                (u = C.extend(
                  {
                    type: p,
                    origType: g,
                    data: r,
                    handler: n,
                    guid: n.guid,
                    selector: i,
                    needsContext: i && C.expr.match.needsContext.test(i),
                    namespace: h.join("."),
                  },
                  o
                )),
                (f = l[p]) ||
                  (((f = l[p] = []).delegateCount = 0),
                  (d.setup && !1 !== d.setup.call(e, r, h, a)) ||
                    (e.addEventListener && e.addEventListener(p, a))),
                d.add &&
                  (d.add.call(e, u),
                  u.handler.guid || (u.handler.guid = n.guid)),
                i ? f.splice(f.delegateCount++, 0, u) : f.push(u),
                (C.event.global[p] = !0));
      },
      remove: function (e, t, n, r, i) {
        var o,
          a,
          s,
          l,
          c,
          u,
          d,
          f,
          p,
          h,
          g,
          v = ie.hasData(e) && ie.get(e);
        if (v && (l = v.events)) {
          for (c = (t = (t || "").match(B) || [""]).length; c--; )
            if (
              ((p = g = (s = He.exec(t[c]) || [])[1]),
              (h = (s[2] || "").split(".").sort()),
              p)
            ) {
              for (
                d = C.event.special[p] || {},
                  f = l[(p = (r ? d.delegateType : d.bindType) || p)] || [],
                  s =
                    s[2] &&
                    new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                  a = o = f.length;
                o--;

              )
                (u = f[o]),
                  (!i && g !== u.origType) ||
                    (n && n.guid !== u.guid) ||
                    (s && !s.test(u.namespace)) ||
                    (r && r !== u.selector && ("**" !== r || !u.selector)) ||
                    (f.splice(o, 1),
                    u.selector && f.delegateCount--,
                    d.remove && d.remove.call(e, u));
              a &&
                !f.length &&
                ((d.teardown && !1 !== d.teardown.call(e, h, v.handle)) ||
                  C.removeEvent(e, p, v.handle),
                delete l[p]);
            } else for (p in l) C.event.remove(e, p + t[c], n, r, !0);
          C.isEmptyObject(l) && ie.remove(e, "handle events");
        }
      },
      dispatch: function (e) {
        var t,
          n,
          r,
          i,
          o,
          a,
          s = new Array(arguments.length),
          l = C.event.fix(e),
          c = (ie.get(this, "events") || Object.create(null))[l.type] || [],
          u = C.event.special[l.type] || {};
        for (s[0] = l, t = 1; t < arguments.length; t++) s[t] = arguments[t];
        if (
          ((l.delegateTarget = this),
          !u.preDispatch || !1 !== u.preDispatch.call(this, l))
        ) {
          for (
            a = C.event.handlers.call(this, l, c), t = 0;
            (i = a[t++]) && !l.isPropagationStopped();

          )
            for (
              l.currentTarget = i.elem, n = 0;
              (o = i.handlers[n++]) && !l.isImmediatePropagationStopped();

            )
              (l.rnamespace &&
                !1 !== o.namespace &&
                !l.rnamespace.test(o.namespace)) ||
                ((l.handleObj = o),
                (l.data = o.data),
                void 0 !==
                  (r = (
                    (C.event.special[o.origType] || {}).handle || o.handler
                  ).apply(i.elem, s)) &&
                  !1 === (l.result = r) &&
                  (l.preventDefault(), l.stopPropagation()));
          return u.postDispatch && u.postDispatch.call(this, l), l.result;
        }
      },
      handlers: function (e, t) {
        var n,
          r,
          i,
          o,
          a,
          s = [],
          l = t.delegateCount,
          c = e.target;
        if (l && c.nodeType && !("click" === e.type && e.button >= 1))
          for (; c !== this; c = c.parentNode || this)
            if (1 === c.nodeType && ("click" !== e.type || !0 !== c.disabled)) {
              for (o = [], a = {}, n = 0; n < l; n++)
                void 0 === a[(i = (r = t[n]).selector + " ")] &&
                  (a[i] = r.needsContext
                    ? C(i, this).index(c) > -1
                    : C.find(i, this, null, [c]).length),
                  a[i] && o.push(r);
              o.length && s.push({ elem: c, handlers: o });
            }
        return (
          (c = this),
          l < t.length && s.push({ elem: c, handlers: t.slice(l) }),
          s
        );
      },
      addProp: function (e, t) {
        Object.defineProperty(C.Event.prototype, e, {
          enumerable: !0,
          configurable: !0,
          get: h(t)
            ? function () {
                if (this.originalEvent) return t(this.originalEvent);
              }
            : function () {
                if (this.originalEvent) return this.originalEvent[e];
              },
          set: function (t) {
            Object.defineProperty(this, e, {
              enumerable: !0,
              configurable: !0,
              writable: !0,
              value: t,
            });
          },
        });
      },
      fix: function (e) {
        return e[C.expando] ? e : new C.Event(e);
      },
      special: {
        load: { noBubble: !0 },
        click: {
          setup: function (e) {
            var t = this || e;
            return (
              Ce.test(t.type) && t.click && k(t, "input") && Re(t, "click", !0),
              !1
            );
          },
          trigger: function (e) {
            var t = this || e;
            return (
              Ce.test(t.type) && t.click && k(t, "input") && Re(t, "click"), !0
            );
          },
          _default: function (e) {
            var t = e.target;
            return (
              (Ce.test(t.type) &&
                t.click &&
                k(t, "input") &&
                ie.get(t, "click")) ||
              k(t, "a")
            );
          },
        },
        beforeunload: {
          postDispatch: function (e) {
            void 0 !== e.result &&
              e.originalEvent &&
              (e.originalEvent.returnValue = e.result);
          },
        },
      },
    }),
      (C.removeEvent = function (e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n);
      }),
      (C.Event = function (e, t) {
        if (!(this instanceof C.Event)) return new C.Event(e, t);
        e && e.type
          ? ((this.originalEvent = e),
            (this.type = e.type),
            (this.isDefaultPrevented =
              e.defaultPrevented ||
              (void 0 === e.defaultPrevented && !1 === e.returnValue)
                ? De
                : Pe),
            (this.target =
              e.target && 3 === e.target.nodeType
                ? e.target.parentNode
                : e.target),
            (this.currentTarget = e.currentTarget),
            (this.relatedTarget = e.relatedTarget))
          : (this.type = e),
          t && C.extend(this, t),
          (this.timeStamp = (e && e.timeStamp) || Date.now()),
          (this[C.expando] = !0);
      }),
      (C.Event.prototype = {
        constructor: C.Event,
        isDefaultPrevented: Pe,
        isPropagationStopped: Pe,
        isImmediatePropagationStopped: Pe,
        isSimulated: !1,
        preventDefault: function () {
          var e = this.originalEvent;
          (this.isDefaultPrevented = De),
            e && !this.isSimulated && e.preventDefault();
        },
        stopPropagation: function () {
          var e = this.originalEvent;
          (this.isPropagationStopped = De),
            e && !this.isSimulated && e.stopPropagation();
        },
        stopImmediatePropagation: function () {
          var e = this.originalEvent;
          (this.isImmediatePropagationStopped = De),
            e && !this.isSimulated && e.stopImmediatePropagation(),
            this.stopPropagation();
        },
      }),
      C.each(
        {
          altKey: !0,
          bubbles: !0,
          cancelable: !0,
          changedTouches: !0,
          ctrlKey: !0,
          detail: !0,
          eventPhase: !0,
          metaKey: !0,
          pageX: !0,
          pageY: !0,
          shiftKey: !0,
          view: !0,
          char: !0,
          code: !0,
          charCode: !0,
          key: !0,
          keyCode: !0,
          button: !0,
          buttons: !0,
          clientX: !0,
          clientY: !0,
          offsetX: !0,
          offsetY: !0,
          pointerId: !0,
          pointerType: !0,
          screenX: !0,
          screenY: !0,
          targetTouches: !0,
          toElement: !0,
          touches: !0,
          which: !0,
        },
        C.event.addProp
      ),
      C.each({ focus: "focusin", blur: "focusout" }, function (e, t) {
        function n(e) {
          if (v.documentMode) {
            var n = ie.get(this, "handle"),
              r = C.event.fix(e);
            (r.type = "focusin" === e.type ? "focus" : "blur"),
              (r.isSimulated = !0),
              n(e),
              r.target === r.currentTarget && n(r);
          } else C.event.simulate(t, e.target, C.event.fix(e));
        }
        (C.event.special[e] = {
          setup: function () {
            var r;
            if ((Re(this, e, !0), !v.documentMode)) return !1;
            (r = ie.get(this, t)) || this.addEventListener(t, n),
              ie.set(this, t, (r || 0) + 1);
          },
          trigger: function () {
            return Re(this, e), !0;
          },
          teardown: function () {
            var e;
            if (!v.documentMode) return !1;
            (e = ie.get(this, t) - 1)
              ? ie.set(this, t, e)
              : (this.removeEventListener(t, n), ie.remove(this, t));
          },
          _default: function (t) {
            return ie.get(t.target, e);
          },
          delegateType: t,
        }),
          (C.event.special[t] = {
            setup: function () {
              var r = this.ownerDocument || this.document || this,
                i = v.documentMode ? this : r,
                o = ie.get(i, t);
              o ||
                (v.documentMode
                  ? this.addEventListener(t, n)
                  : r.addEventListener(e, n, !0)),
                ie.set(i, t, (o || 0) + 1);
            },
            teardown: function () {
              var r = this.ownerDocument || this.document || this,
                i = v.documentMode ? this : r,
                o = ie.get(i, t) - 1;
              o
                ? ie.set(i, t, o)
                : (v.documentMode
                    ? this.removeEventListener(t, n)
                    : r.removeEventListener(e, n, !0),
                  ie.remove(i, t));
            },
          });
      }),
      C.each(
        {
          mouseenter: "mouseover",
          mouseleave: "mouseout",
          pointerenter: "pointerover",
          pointerleave: "pointerout",
        },
        function (e, t) {
          C.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function (e) {
              var n,
                r = e.relatedTarget,
                i = e.handleObj;
              return (
                (r && (r === this || C.contains(this, r))) ||
                  ((e.type = i.origType),
                  (n = i.handler.apply(this, arguments)),
                  (e.type = t)),
                n
              );
            },
          };
        }
      ),
      C.fn.extend({
        on: function (e, t, n, r) {
          return Oe(this, e, t, n, r);
        },
        one: function (e, t, n, r) {
          return Oe(this, e, t, n, r, 1);
        },
        off: function (e, t, n) {
          var r, i;
          if (e && e.preventDefault && e.handleObj)
            return (
              (r = e.handleObj),
              C(e.delegateTarget).off(
                r.namespace ? r.origType + "." + r.namespace : r.origType,
                r.selector,
                r.handler
              ),
              this
            );
          if ("object" == typeof e) {
            for (i in e) this.off(i, t, e[i]);
            return this;
          }
          return (
            (!1 !== t && "function" != typeof t) || ((n = t), (t = void 0)),
            !1 === n && (n = Pe),
            this.each(function () {
              C.event.remove(this, e, n, t);
            })
          );
        },
      });
    var Le = /<script|<style|<link/i,
      Ne = /checked\s*(?:[^=]|=\s*.checked.)/i,
      Me = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
    function qe(e, t) {
      return (
        (k(e, "table") &&
          k(11 !== t.nodeType ? t : t.firstChild, "tr") &&
          C(e).children("tbody")[0]) ||
        e
      );
    }
    function Ie(e) {
      return (e.type = (null !== e.getAttribute("type")) + "/" + e.type), e;
    }
    function We(e) {
      return (
        "true/" === (e.type || "").slice(0, 5)
          ? (e.type = e.type.slice(5))
          : e.removeAttribute("type"),
        e
      );
    }
    function Fe(e, t) {
      var n, r, i, o, a, s;
      if (1 === t.nodeType) {
        if (ie.hasData(e) && (s = ie.get(e).events))
          for (i in (ie.remove(t, "handle events"), s))
            for (n = 0, r = s[i].length; n < r; n++) C.event.add(t, i, s[i][n]);
        oe.hasData(e) &&
          ((o = oe.access(e)), (a = C.extend({}, o)), oe.set(t, a));
      }
    }
    function Ve(e, t) {
      var n = t.nodeName.toLowerCase();
      "input" === n && Ce.test(e.type)
        ? (t.checked = e.checked)
        : ("input" !== n && "textarea" !== n) ||
          (t.defaultValue = e.defaultValue);
    }
    function $e(e, t, n, r) {
      t = o(t);
      var i,
        a,
        s,
        l,
        c,
        u,
        d = 0,
        f = e.length,
        g = f - 1,
        v = t[0],
        m = h(v);
      if (m || (f > 1 && "string" == typeof v && !p.checkClone && Ne.test(v)))
        return e.each(function (i) {
          var o = e.eq(i);
          m && (t[0] = v.call(this, i, o.html())), $e(o, t, n, r);
        });
      if (
        f &&
        ((a = (i = je(t, e[0].ownerDocument, !1, e, r)).firstChild),
        1 === i.childNodes.length && (i = a),
        a || r)
      ) {
        for (l = (s = C.map(Ee(i, "script"), Ie)).length; d < f; d++)
          (c = i),
            d !== g &&
              ((c = C.clone(c, !0, !0)), l && C.merge(s, Ee(c, "script"))),
            n.call(e[d], c, d);
        if (l)
          for (
            u = s[s.length - 1].ownerDocument, C.map(s, We), d = 0;
            d < l;
            d++
          )
            (c = s[d]),
              ke.test(c.type || "") &&
                !ie.access(c, "globalEval") &&
                C.contains(u, c) &&
                (c.src && "module" !== (c.type || "").toLowerCase()
                  ? C._evalUrl &&
                    !c.noModule &&
                    C._evalUrl(
                      c.src,
                      { nonce: c.nonce || c.getAttribute("nonce") },
                      u
                    )
                  : y(c.textContent.replace(Me, ""), c, u));
      }
      return e;
    }
    function Be(e, t, n) {
      for (var r, i = t ? C.filter(t, e) : e, o = 0; null != (r = i[o]); o++)
        n || 1 !== r.nodeType || C.cleanData(Ee(r)),
          r.parentNode &&
            (n && pe(r) && _e(Ee(r, "script")), r.parentNode.removeChild(r));
      return e;
    }
    C.extend({
      htmlPrefilter: function (e) {
        return e;
      },
      clone: function (e, t, n) {
        var r,
          i,
          o,
          a,
          s = e.cloneNode(!0),
          l = pe(e);
        if (
          !(
            p.noCloneChecked ||
            (1 !== e.nodeType && 11 !== e.nodeType) ||
            C.isXMLDoc(e)
          )
        )
          for (a = Ee(s), r = 0, i = (o = Ee(e)).length; r < i; r++)
            Ve(o[r], a[r]);
        if (t)
          if (n)
            for (
              o = o || Ee(e), a = a || Ee(s), r = 0, i = o.length;
              r < i;
              r++
            )
              Fe(o[r], a[r]);
          else Fe(e, s);
        return (
          (a = Ee(s, "script")).length > 0 && _e(a, !l && Ee(e, "script")), s
        );
      },
      cleanData: function (e) {
        for (
          var t, n, r, i = C.event.special, o = 0;
          void 0 !== (n = e[o]);
          o++
        )
          if (ne(n)) {
            if ((t = n[ie.expando])) {
              if (t.events)
                for (r in t.events)
                  i[r] ? C.event.remove(n, r) : C.removeEvent(n, r, t.handle);
              n[ie.expando] = void 0;
            }
            n[oe.expando] && (n[oe.expando] = void 0);
          }
      },
    }),
      C.fn.extend({
        detach: function (e) {
          return Be(this, e, !0);
        },
        remove: function (e) {
          return Be(this, e);
        },
        text: function (e) {
          return Z(
            this,
            function (e) {
              return void 0 === e
                ? C.text(this)
                : this.empty().each(function () {
                    (1 !== this.nodeType &&
                      11 !== this.nodeType &&
                      9 !== this.nodeType) ||
                      (this.textContent = e);
                  });
            },
            null,
            e,
            arguments.length
          );
        },
        append: function () {
          return $e(this, arguments, function (e) {
            (1 !== this.nodeType &&
              11 !== this.nodeType &&
              9 !== this.nodeType) ||
              qe(this, e).appendChild(e);
          });
        },
        prepend: function () {
          return $e(this, arguments, function (e) {
            if (
              1 === this.nodeType ||
              11 === this.nodeType ||
              9 === this.nodeType
            ) {
              var t = qe(this, e);
              t.insertBefore(e, t.firstChild);
            }
          });
        },
        before: function () {
          return $e(this, arguments, function (e) {
            this.parentNode && this.parentNode.insertBefore(e, this);
          });
        },
        after: function () {
          return $e(this, arguments, function (e) {
            this.parentNode &&
              this.parentNode.insertBefore(e, this.nextSibling);
          });
        },
        empty: function () {
          for (var e, t = 0; null != (e = this[t]); t++)
            1 === e.nodeType && (C.cleanData(Ee(e, !1)), (e.textContent = ""));
          return this;
        },
        clone: function (e, t) {
          return (
            (e = null != e && e),
            (t = null == t ? e : t),
            this.map(function () {
              return C.clone(this, e, t);
            })
          );
        },
        html: function (e) {
          return Z(
            this,
            function (e) {
              var t = this[0] || {},
                n = 0,
                r = this.length;
              if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
              if (
                "string" == typeof e &&
                !Le.test(e) &&
                !Se[(Te.exec(e) || ["", ""])[1].toLowerCase()]
              ) {
                e = C.htmlPrefilter(e);
                try {
                  for (; n < r; n++)
                    1 === (t = this[n] || {}).nodeType &&
                      (C.cleanData(Ee(t, !1)), (t.innerHTML = e));
                  t = 0;
                } catch (e) {}
              }
              t && this.empty().append(e);
            },
            null,
            e,
            arguments.length
          );
        },
        replaceWith: function () {
          var e = [];
          return $e(
            this,
            arguments,
            function (t) {
              var n = this.parentNode;
              C.inArray(this, e) < 0 &&
                (C.cleanData(Ee(this)), n && n.replaceChild(t, this));
            },
            e
          );
        },
      }),
      C.each(
        {
          appendTo: "append",
          prependTo: "prepend",
          insertBefore: "before",
          insertAfter: "after",
          replaceAll: "replaceWith",
        },
        function (e, t) {
          C.fn[e] = function (e) {
            for (var n, r = [], i = C(e), o = i.length - 1, s = 0; s <= o; s++)
              (n = s === o ? this : this.clone(!0)),
                C(i[s])[t](n),
                a.apply(r, n.get());
            return this.pushStack(r);
          };
        }
      );
    var ze = new RegExp("^(" + ce + ")(?!px)[a-z%]+$", "i"),
      Xe = /^--/,
      Qe = function (t) {
        var n = t.ownerDocument.defaultView;
        return (n && n.opener) || (n = e), n.getComputedStyle(t);
      },
      Ue = function (e, t, n) {
        var r,
          i,
          o = {};
        for (i in t) (o[i] = e.style[i]), (e.style[i] = t[i]);
        for (i in ((r = n.call(e)), t)) e.style[i] = o[i];
        return r;
      },
      Ke = new RegExp(de.join("|"), "i");
    function Ye(e, t, n) {
      var r,
        i,
        o,
        a,
        s = Xe.test(t),
        l = e.style;
      return (
        (n = n || Qe(e)) &&
          ((a = n.getPropertyValue(t) || n[t]),
          s && a && (a = a.replace(j, "$1") || void 0),
          "" !== a || pe(e) || (a = C.style(e, t)),
          !p.pixelBoxStyles() &&
            ze.test(a) &&
            Ke.test(t) &&
            ((r = l.width),
            (i = l.minWidth),
            (o = l.maxWidth),
            (l.minWidth = l.maxWidth = l.width = a),
            (a = n.width),
            (l.width = r),
            (l.minWidth = i),
            (l.maxWidth = o))),
        void 0 !== a ? a + "" : a
      );
    }
    function Ze(e, t) {
      return {
        get: function () {
          if (!e()) return (this.get = t).apply(this, arguments);
          delete this.get;
        },
      };
    }
    !(function () {
      function t() {
        if (u) {
          (c.style.cssText =
            "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0"),
            (u.style.cssText =
              "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%"),
            fe.appendChild(c).appendChild(u);
          var t = e.getComputedStyle(u);
          (r = "1%" !== t.top),
            (l = 12 === n(t.marginLeft)),
            (u.style.right = "60%"),
            (a = 36 === n(t.right)),
            (i = 36 === n(t.width)),
            (u.style.position = "absolute"),
            (o = 12 === n(u.offsetWidth / 3)),
            fe.removeChild(c),
            (u = null);
        }
      }
      function n(e) {
        return Math.round(parseFloat(e));
      }
      var r,
        i,
        o,
        a,
        s,
        l,
        c = v.createElement("div"),
        u = v.createElement("div");
      u.style &&
        ((u.style.backgroundClip = "content-box"),
        (u.cloneNode(!0).style.backgroundClip = ""),
        (p.clearCloneStyle = "content-box" === u.style.backgroundClip),
        C.extend(p, {
          boxSizingReliable: function () {
            return t(), i;
          },
          pixelBoxStyles: function () {
            return t(), a;
          },
          pixelPosition: function () {
            return t(), r;
          },
          reliableMarginLeft: function () {
            return t(), l;
          },
          scrollboxSize: function () {
            return t(), o;
          },
          reliableTrDimensions: function () {
            var t, n, r, i;
            return (
              null == s &&
                ((t = v.createElement("table")),
                (n = v.createElement("tr")),
                (r = v.createElement("div")),
                (t.style.cssText =
                  "position:absolute;left:-11111px;border-collapse:separate"),
                (n.style.cssText = "box-sizing:content-box;border:1px solid"),
                (n.style.height = "1px"),
                (r.style.height = "9px"),
                (r.style.display = "block"),
                fe.appendChild(t).appendChild(n).appendChild(r),
                (i = e.getComputedStyle(n)),
                (s =
                  parseInt(i.height, 10) +
                    parseInt(i.borderTopWidth, 10) +
                    parseInt(i.borderBottomWidth, 10) ===
                  n.offsetHeight),
                fe.removeChild(t)),
              s
            );
          },
        }));
    })();
    var Ge = ["Webkit", "Moz", "ms"],
      Je = v.createElement("div").style,
      et = {};
    function tt(e) {
      var t = C.cssProps[e] || et[e];
      return (
        t ||
        (e in Je
          ? e
          : (et[e] =
              (function (e) {
                for (
                  var t = e[0].toUpperCase() + e.slice(1), n = Ge.length;
                  n--;

                )
                  if ((e = Ge[n] + t) in Je) return e;
              })(e) || e))
      );
    }
    var nt = /^(none|table(?!-c[ea]).+)/,
      rt = { position: "absolute", visibility: "hidden", display: "block" },
      it = { letterSpacing: "0", fontWeight: "400" };
    function ot(e, t, n) {
      var r = ue.exec(t);
      return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t;
    }
    function at(e, t, n, r, i, o) {
      var a = "width" === t ? 1 : 0,
        s = 0,
        l = 0,
        c = 0;
      if (n === (r ? "border" : "content")) return 0;
      for (; a < 4; a += 2)
        "margin" === n && (c += C.css(e, n + de[a], !0, i)),
          r
            ? ("content" === n && (l -= C.css(e, "padding" + de[a], !0, i)),
              "margin" !== n &&
                (l -= C.css(e, "border" + de[a] + "Width", !0, i)))
            : ((l += C.css(e, "padding" + de[a], !0, i)),
              "padding" !== n
                ? (l += C.css(e, "border" + de[a] + "Width", !0, i))
                : (s += C.css(e, "border" + de[a] + "Width", !0, i)));
      return (
        !r &&
          o >= 0 &&
          (l +=
            Math.max(
              0,
              Math.ceil(
                e["offset" + t[0].toUpperCase() + t.slice(1)] - o - l - s - 0.5
              )
            ) || 0),
        l + c
      );
    }
    function st(e, t, n) {
      var r = Qe(e),
        i =
          (!p.boxSizingReliable() || n) &&
          "border-box" === C.css(e, "boxSizing", !1, r),
        o = i,
        a = Ye(e, t, r),
        s = "offset" + t[0].toUpperCase() + t.slice(1);
      if (ze.test(a)) {
        if (!n) return a;
        a = "auto";
      }
      return (
        ((!p.boxSizingReliable() && i) ||
          (!p.reliableTrDimensions() && k(e, "tr")) ||
          "auto" === a ||
          (!parseFloat(a) && "inline" === C.css(e, "display", !1, r))) &&
          e.getClientRects().length &&
          ((i = "border-box" === C.css(e, "boxSizing", !1, r)),
          (o = s in e) && (a = e[s])),
        (a = parseFloat(a) || 0) +
          at(e, t, n || (i ? "border" : "content"), o, r, a) +
          "px"
      );
    }
    function lt(e, t, n, r, i) {
      return new lt.prototype.init(e, t, n, r, i);
    }
    C.extend({
      cssHooks: {
        opacity: {
          get: function (e, t) {
            if (t) {
              var n = Ye(e, "opacity");
              return "" === n ? "1" : n;
            }
          },
        },
      },
      cssNumber: {
        animationIterationCount: !0,
        aspectRatio: !0,
        borderImageSlice: !0,
        columnCount: !0,
        flexGrow: !0,
        flexShrink: !0,
        fontWeight: !0,
        gridArea: !0,
        gridColumn: !0,
        gridColumnEnd: !0,
        gridColumnStart: !0,
        gridRow: !0,
        gridRowEnd: !0,
        gridRowStart: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        scale: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
        fillOpacity: !0,
        floodOpacity: !0,
        stopOpacity: !0,
        strokeMiterlimit: !0,
        strokeOpacity: !0,
      },
      cssProps: {},
      style: function (e, t, n, r) {
        if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
          var i,
            o,
            a,
            s = te(t),
            l = Xe.test(t),
            c = e.style;
          if (
            (l || (t = tt(s)),
            (a = C.cssHooks[t] || C.cssHooks[s]),
            void 0 === n)
          )
            return a && "get" in a && void 0 !== (i = a.get(e, !1, r))
              ? i
              : c[t];
          "string" === (o = typeof n) &&
            (i = ue.exec(n)) &&
            i[1] &&
            ((n = ve(e, t, i)), (o = "number")),
            null != n &&
              n == n &&
              ("number" !== o ||
                l ||
                (n += (i && i[3]) || (C.cssNumber[s] ? "" : "px")),
              p.clearCloneStyle ||
                "" !== n ||
                0 !== t.indexOf("background") ||
                (c[t] = "inherit"),
              (a && "set" in a && void 0 === (n = a.set(e, n, r))) ||
                (l ? c.setProperty(t, n) : (c[t] = n)));
        }
      },
      css: function (e, t, n, r) {
        var i,
          o,
          a,
          s = te(t);
        return (
          Xe.test(t) || (t = tt(s)),
          (a = C.cssHooks[t] || C.cssHooks[s]) &&
            "get" in a &&
            (i = a.get(e, !0, n)),
          void 0 === i && (i = Ye(e, t, r)),
          "normal" === i && t in it && (i = it[t]),
          "" === n || n
            ? ((o = parseFloat(i)), !0 === n || isFinite(o) ? o || 0 : i)
            : i
        );
      },
    }),
      C.each(["height", "width"], function (e, t) {
        C.cssHooks[t] = {
          get: function (e, n, r) {
            if (n)
              return !nt.test(C.css(e, "display")) ||
                (e.getClientRects().length && e.getBoundingClientRect().width)
                ? st(e, t, r)
                : Ue(e, rt, function () {
                    return st(e, t, r);
                  });
          },
          set: function (e, n, r) {
            var i,
              o = Qe(e),
              a = !p.scrollboxSize() && "absolute" === o.position,
              s = (a || r) && "border-box" === C.css(e, "boxSizing", !1, o),
              l = r ? at(e, t, r, s, o) : 0;
            return (
              s &&
                a &&
                (l -= Math.ceil(
                  e["offset" + t[0].toUpperCase() + t.slice(1)] -
                    parseFloat(o[t]) -
                    at(e, t, "border", !1, o) -
                    0.5
                )),
              l &&
                (i = ue.exec(n)) &&
                "px" !== (i[3] || "px") &&
                ((e.style[t] = n), (n = C.css(e, t))),
              ot(0, n, l)
            );
          },
        };
      }),
      (C.cssHooks.marginLeft = Ze(p.reliableMarginLeft, function (e, t) {
        if (t)
          return (
            (parseFloat(Ye(e, "marginLeft")) ||
              e.getBoundingClientRect().left -
                Ue(e, { marginLeft: 0 }, function () {
                  return e.getBoundingClientRect().left;
                })) + "px"
          );
      })),
      C.each({ margin: "", padding: "", border: "Width" }, function (e, t) {
        (C.cssHooks[e + t] = {
          expand: function (n) {
            for (
              var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n];
              r < 4;
              r++
            )
              i[e + de[r] + t] = o[r] || o[r - 2] || o[0];
            return i;
          },
        }),
          "margin" !== e && (C.cssHooks[e + t].set = ot);
      }),
      C.fn.extend({
        css: function (e, t) {
          return Z(
            this,
            function (e, t, n) {
              var r,
                i,
                o = {},
                a = 0;
              if (Array.isArray(t)) {
                for (r = Qe(e), i = t.length; a < i; a++)
                  o[t[a]] = C.css(e, t[a], !1, r);
                return o;
              }
              return void 0 !== n ? C.style(e, t, n) : C.css(e, t);
            },
            e,
            t,
            arguments.length > 1
          );
        },
      }),
      (C.Tween = lt),
      (lt.prototype = {
        constructor: lt,
        init: function (e, t, n, r, i, o) {
          (this.elem = e),
            (this.prop = n),
            (this.easing = i || C.easing._default),
            (this.options = t),
            (this.start = this.now = this.cur()),
            (this.end = r),
            (this.unit = o || (C.cssNumber[n] ? "" : "px"));
        },
        cur: function () {
          var e = lt.propHooks[this.prop];
          return e && e.get ? e.get(this) : lt.propHooks._default.get(this);
        },
        run: function (e) {
          var t,
            n = lt.propHooks[this.prop];
          return (
            this.options.duration
              ? (this.pos = t =
                  C.easing[this.easing](
                    e,
                    this.options.duration * e,
                    0,
                    1,
                    this.options.duration
                  ))
              : (this.pos = t = e),
            (this.now = (this.end - this.start) * t + this.start),
            this.options.step &&
              this.options.step.call(this.elem, this.now, this),
            n && n.set ? n.set(this) : lt.propHooks._default.set(this),
            this
          );
        },
      }),
      (lt.prototype.init.prototype = lt.prototype),
      (lt.propHooks = {
        _default: {
          get: function (e) {
            var t;
            return 1 !== e.elem.nodeType ||
              (null != e.elem[e.prop] && null == e.elem.style[e.prop])
              ? e.elem[e.prop]
              : (t = C.css(e.elem, e.prop, "")) && "auto" !== t
              ? t
              : 0;
          },
          set: function (e) {
            C.fx.step[e.prop]
              ? C.fx.step[e.prop](e)
              : 1 !== e.elem.nodeType ||
                (!C.cssHooks[e.prop] && null == e.elem.style[tt(e.prop)])
              ? (e.elem[e.prop] = e.now)
              : C.style(e.elem, e.prop, e.now + e.unit);
          },
        },
      }),
      (lt.propHooks.scrollTop = lt.propHooks.scrollLeft =
        {
          set: function (e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
          },
        }),
      (C.easing = {
        linear: function (e) {
          return e;
        },
        swing: function (e) {
          return 0.5 - Math.cos(e * Math.PI) / 2;
        },
        _default: "swing",
      }),
      (C.fx = lt.prototype.init),
      (C.fx.step = {});
    var ct,
      ut,
      dt = /^(?:toggle|show|hide)$/,
      ft = /queueHooks$/;
    function pt() {
      ut &&
        (!1 === v.hidden && e.requestAnimationFrame
          ? e.requestAnimationFrame(pt)
          : e.setTimeout(pt, C.fx.interval),
        C.fx.tick());
    }
    function ht() {
      return (
        e.setTimeout(function () {
          ct = void 0;
        }),
        (ct = Date.now())
      );
    }
    function gt(e, t) {
      var n,
        r = 0,
        i = { height: e };
      for (t = t ? 1 : 0; r < 4; r += 2 - t)
        i["margin" + (n = de[r])] = i["padding" + n] = e;
      return t && (i.opacity = i.width = e), i;
    }
    function vt(e, t, n) {
      for (
        var r,
          i = (mt.tweeners[t] || []).concat(mt.tweeners["*"]),
          o = 0,
          a = i.length;
        o < a;
        o++
      )
        if ((r = i[o].call(n, t, e))) return r;
    }
    function mt(e, t, n) {
      var r,
        i,
        o = 0,
        a = mt.prefilters.length,
        s = C.Deferred().always(function () {
          delete l.elem;
        }),
        l = function () {
          if (i) return !1;
          for (
            var t = ct || ht(),
              n = Math.max(0, c.startTime + c.duration - t),
              r = 1 - (n / c.duration || 0),
              o = 0,
              a = c.tweens.length;
            o < a;
            o++
          )
            c.tweens[o].run(r);
          return (
            s.notifyWith(e, [c, r, n]),
            r < 1 && a
              ? n
              : (a || s.notifyWith(e, [c, 1, 0]), s.resolveWith(e, [c]), !1)
          );
        },
        c = s.promise({
          elem: e,
          props: C.extend({}, t),
          opts: C.extend(
            !0,
            { specialEasing: {}, easing: C.easing._default },
            n
          ),
          originalProperties: t,
          originalOptions: n,
          startTime: ct || ht(),
          duration: n.duration,
          tweens: [],
          createTween: function (t, n) {
            var r = C.Tween(
              e,
              c.opts,
              t,
              n,
              c.opts.specialEasing[t] || c.opts.easing
            );
            return c.tweens.push(r), r;
          },
          stop: function (t) {
            var n = 0,
              r = t ? c.tweens.length : 0;
            if (i) return this;
            for (i = !0; n < r; n++) c.tweens[n].run(1);
            return (
              t
                ? (s.notifyWith(e, [c, 1, 0]), s.resolveWith(e, [c, t]))
                : s.rejectWith(e, [c, t]),
              this
            );
          },
        }),
        u = c.props;
      for (
        !(function (e, t) {
          var n, r, i, o, a;
          for (n in e)
            if (
              ((i = t[(r = te(n))]),
              (o = e[n]),
              Array.isArray(o) && ((i = o[1]), (o = e[n] = o[0])),
              n !== r && ((e[r] = o), delete e[n]),
              (a = C.cssHooks[r]) && ("expand" in a))
            )
              for (n in ((o = a.expand(o)), delete e[r], o))
                (n in e) || ((e[n] = o[n]), (t[n] = i));
            else t[r] = i;
        })(u, c.opts.specialEasing);
        o < a;
        o++
      )
        if ((r = mt.prefilters[o].call(c, e, u, c.opts)))
          return (
            h(r.stop) &&
              (C._queueHooks(c.elem, c.opts.queue).stop = r.stop.bind(r)),
            r
          );
      return (
        C.map(u, vt, c),
        h(c.opts.start) && c.opts.start.call(e, c),
        c
          .progress(c.opts.progress)
          .done(c.opts.done, c.opts.complete)
          .fail(c.opts.fail)
          .always(c.opts.always),
        C.fx.timer(C.extend(l, { elem: e, anim: c, queue: c.opts.queue })),
        c
      );
    }
    (C.Animation = C.extend(mt, {
      tweeners: {
        "*": [
          function (e, t) {
            var n = this.createTween(e, t);
            return ve(n.elem, e, ue.exec(t), n), n;
          },
        ],
      },
      tweener: function (e, t) {
        h(e) ? ((t = e), (e = ["*"])) : (e = e.match(B));
        for (var n, r = 0, i = e.length; r < i; r++)
          (n = e[r]),
            (mt.tweeners[n] = mt.tweeners[n] || []),
            mt.tweeners[n].unshift(t);
      },
      prefilters: [
        function (e, t, n) {
          var r,
            i,
            o,
            a,
            s,
            l,
            c,
            u,
            d = "width" in t || "height" in t,
            f = this,
            p = {},
            h = e.style,
            g = e.nodeType && ge(e),
            v = ie.get(e, "fxshow");
          for (r in (n.queue ||
            (null == (a = C._queueHooks(e, "fx")).unqueued &&
              ((a.unqueued = 0),
              (s = a.empty.fire),
              (a.empty.fire = function () {
                a.unqueued || s();
              })),
            a.unqueued++,
            f.always(function () {
              f.always(function () {
                a.unqueued--, C.queue(e, "fx").length || a.empty.fire();
              });
            })),
          t))
            if (((i = t[r]), dt.test(i))) {
              if (
                (delete t[r],
                (o = o || "toggle" === i),
                i === (g ? "hide" : "show"))
              ) {
                if ("show" !== i || !v || void 0 === v[r]) continue;
                g = !0;
              }
              p[r] = (v && v[r]) || C.style(e, r);
            }
          if ((l = !C.isEmptyObject(t)) || !C.isEmptyObject(p))
            for (r in (d &&
              1 === e.nodeType &&
              ((n.overflow = [h.overflow, h.overflowX, h.overflowY]),
              null == (c = v && v.display) && (c = ie.get(e, "display")),
              "none" === (u = C.css(e, "display")) &&
                (c
                  ? (u = c)
                  : (be([e], !0),
                    (c = e.style.display || c),
                    (u = C.css(e, "display")),
                    be([e]))),
              ("inline" === u || ("inline-block" === u && null != c)) &&
                "none" === C.css(e, "float") &&
                (l ||
                  (f.done(function () {
                    h.display = c;
                  }),
                  null == c && ((u = h.display), (c = "none" === u ? "" : u))),
                (h.display = "inline-block"))),
            n.overflow &&
              ((h.overflow = "hidden"),
              f.always(function () {
                (h.overflow = n.overflow[0]),
                  (h.overflowX = n.overflow[1]),
                  (h.overflowY = n.overflow[2]);
              })),
            (l = !1),
            p))
              l ||
                (v
                  ? "hidden" in v && (g = v.hidden)
                  : (v = ie.access(e, "fxshow", { display: c })),
                o && (v.hidden = !g),
                g && be([e], !0),
                f.done(function () {
                  for (r in (g || be([e]), ie.remove(e, "fxshow"), p))
                    C.style(e, r, p[r]);
                })),
                (l = vt(g ? v[r] : 0, r, f)),
                r in v ||
                  ((v[r] = l.start), g && ((l.end = l.start), (l.start = 0)));
        },
      ],
      prefilter: function (e, t) {
        t ? mt.prefilters.unshift(e) : mt.prefilters.push(e);
      },
    })),
      (C.speed = function (e, t, n) {
        var r =
          e && "object" == typeof e
            ? C.extend({}, e)
            : {
                complete: n || (!n && t) || (h(e) && e),
                duration: e,
                easing: (n && t) || (t && !h(t) && t),
              };
        return (
          C.fx.off
            ? (r.duration = 0)
            : "number" != typeof r.duration &&
              (r.duration in C.fx.speeds
                ? (r.duration = C.fx.speeds[r.duration])
                : (r.duration = C.fx.speeds._default)),
          (null != r.queue && !0 !== r.queue) || (r.queue = "fx"),
          (r.old = r.complete),
          (r.complete = function () {
            h(r.old) && r.old.call(this), r.queue && C.dequeue(this, r.queue);
          }),
          r
        );
      }),
      C.fn.extend({
        fadeTo: function (e, t, n, r) {
          return this.filter(ge)
            .css("opacity", 0)
            .show()
            .end()
            .animate({ opacity: t }, e, n, r);
        },
        animate: function (e, t, n, r) {
          var i = C.isEmptyObject(e),
            o = C.speed(t, n, r),
            a = function () {
              var t = mt(this, C.extend({}, e), o);
              (i || ie.get(this, "finish")) && t.stop(!0);
            };
          return (
            (a.finish = a),
            i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
          );
        },
        stop: function (e, t, n) {
          var r = function (e) {
            var t = e.stop;
            delete e.stop, t(n);
          };
          return (
            "string" != typeof e && ((n = t), (t = e), (e = void 0)),
            t && this.queue(e || "fx", []),
            this.each(function () {
              var t = !0,
                i = null != e && e + "queueHooks",
                o = C.timers,
                a = ie.get(this);
              if (i) a[i] && a[i].stop && r(a[i]);
              else for (i in a) a[i] && a[i].stop && ft.test(i) && r(a[i]);
              for (i = o.length; i--; )
                o[i].elem !== this ||
                  (null != e && o[i].queue !== e) ||
                  (o[i].anim.stop(n), (t = !1), o.splice(i, 1));
              (!t && n) || C.dequeue(this, e);
            })
          );
        },
        finish: function (e) {
          return (
            !1 !== e && (e = e || "fx"),
            this.each(function () {
              var t,
                n = ie.get(this),
                r = n[e + "queue"],
                i = n[e + "queueHooks"],
                o = C.timers,
                a = r ? r.length : 0;
              for (
                n.finish = !0,
                  C.queue(this, e, []),
                  i && i.stop && i.stop.call(this, !0),
                  t = o.length;
                t--;

              )
                o[t].elem === this &&
                  o[t].queue === e &&
                  (o[t].anim.stop(!0), o.splice(t, 1));
              for (t = 0; t < a; t++)
                r[t] && r[t].finish && r[t].finish.call(this);
              delete n.finish;
            })
          );
        },
      }),
      C.each(["toggle", "show", "hide"], function (e, t) {
        var n = C.fn[t];
        C.fn[t] = function (e, r, i) {
          return null == e || "boolean" == typeof e
            ? n.apply(this, arguments)
            : this.animate(gt(t, !0), e, r, i);
        };
      }),
      C.each(
        {
          slideDown: gt("show"),
          slideUp: gt("hide"),
          slideToggle: gt("toggle"),
          fadeIn: { opacity: "show" },
          fadeOut: { opacity: "hide" },
          fadeToggle: { opacity: "toggle" },
        },
        function (e, t) {
          C.fn[e] = function (e, n, r) {
            return this.animate(t, e, n, r);
          };
        }
      ),
      (C.timers = []),
      (C.fx.tick = function () {
        var e,
          t = 0,
          n = C.timers;
        for (ct = Date.now(); t < n.length; t++)
          (e = n[t])() || n[t] !== e || n.splice(t--, 1);
        n.length || C.fx.stop(), (ct = void 0);
      }),
      (C.fx.timer = function (e) {
        C.timers.push(e), C.fx.start();
      }),
      (C.fx.interval = 13),
      (C.fx.start = function () {
        ut || ((ut = !0), pt());
      }),
      (C.fx.stop = function () {
        ut = null;
      }),
      (C.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
      (C.fn.delay = function (t, n) {
        return (
          (t = (C.fx && C.fx.speeds[t]) || t),
          (n = n || "fx"),
          this.queue(n, function (n, r) {
            var i = e.setTimeout(n, t);
            r.stop = function () {
              e.clearTimeout(i);
            };
          })
        );
      }),
      (function () {
        var e = v.createElement("input"),
          t = v.createElement("select").appendChild(v.createElement("option"));
        (e.type = "checkbox"),
          (p.checkOn = "" !== e.value),
          (p.optSelected = t.selected),
          ((e = v.createElement("input")).value = "t"),
          (e.type = "radio"),
          (p.radioValue = "t" === e.value);
      })();
    var yt,
      bt = C.expr.attrHandle;
    C.fn.extend({
      attr: function (e, t) {
        return Z(this, C.attr, e, t, arguments.length > 1);
      },
      removeAttr: function (e) {
        return this.each(function () {
          C.removeAttr(this, e);
        });
      },
    }),
      C.extend({
        attr: function (e, t, n) {
          var r,
            i,
            o = e.nodeType;
          if (3 !== o && 8 !== o && 2 !== o)
            return void 0 === e.getAttribute
              ? C.prop(e, t, n)
              : ((1 === o && C.isXMLDoc(e)) ||
                  (i =
                    C.attrHooks[t.toLowerCase()] ||
                    (C.expr.match.bool.test(t) ? yt : void 0)),
                void 0 !== n
                  ? null === n
                    ? void C.removeAttr(e, t)
                    : i && "set" in i && void 0 !== (r = i.set(e, n, t))
                    ? r
                    : (e.setAttribute(t, n + ""), n)
                  : i && "get" in i && null !== (r = i.get(e, t))
                  ? r
                  : null == (r = C.find.attr(e, t))
                  ? void 0
                  : r);
        },
        attrHooks: {
          type: {
            set: function (e, t) {
              if (!p.radioValue && "radio" === t && k(e, "input")) {
                var n = e.value;
                return e.setAttribute("type", t), n && (e.value = n), t;
              }
            },
          },
        },
        removeAttr: function (e, t) {
          var n,
            r = 0,
            i = t && t.match(B);
          if (i && 1 === e.nodeType)
            for (; (n = i[r++]); ) e.removeAttribute(n);
        },
      }),
      (yt = {
        set: function (e, t, n) {
          return !1 === t ? C.removeAttr(e, n) : e.setAttribute(n, n), n;
        },
      }),
      C.each(C.expr.match.bool.source.match(/\w+/g), function (e, t) {
        var n = bt[t] || C.find.attr;
        bt[t] = function (e, t, r) {
          var i,
            o,
            a = t.toLowerCase();
          return (
            r ||
              ((o = bt[a]),
              (bt[a] = i),
              (i = null != n(e, t, r) ? a : null),
              (bt[a] = o)),
            i
          );
        };
      });
    var xt = /^(?:input|select|textarea|button)$/i,
      wt = /^(?:a|area)$/i;
    function Ct(e) {
      return (e.match(B) || []).join(" ");
    }
    function Tt(e) {
      return (e.getAttribute && e.getAttribute("class")) || "";
    }
    function kt(e) {
      return Array.isArray(e) ? e : ("string" == typeof e && e.match(B)) || [];
    }
    C.fn.extend({
      prop: function (e, t) {
        return Z(this, C.prop, e, t, arguments.length > 1);
      },
      removeProp: function (e) {
        return this.each(function () {
          delete this[C.propFix[e] || e];
        });
      },
    }),
      C.extend({
        prop: function (e, t, n) {
          var r,
            i,
            o = e.nodeType;
          if (3 !== o && 8 !== o && 2 !== o)
            return (
              (1 === o && C.isXMLDoc(e)) ||
                ((t = C.propFix[t] || t), (i = C.propHooks[t])),
              void 0 !== n
                ? i && "set" in i && void 0 !== (r = i.set(e, n, t))
                  ? r
                  : (e[t] = n)
                : i && "get" in i && null !== (r = i.get(e, t))
                ? r
                : e[t]
            );
        },
        propHooks: {
          tabIndex: {
            get: function (e) {
              var t = C.find.attr(e, "tabindex");
              return t
                ? parseInt(t, 10)
                : xt.test(e.nodeName) || (wt.test(e.nodeName) && e.href)
                ? 0
                : -1;
            },
          },
        },
        propFix: { for: "htmlFor", class: "className" },
      }),
      p.optSelected ||
        (C.propHooks.selected = {
          get: function (e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex, null;
          },
          set: function (e) {
            var t = e.parentNode;
            t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex);
          },
        }),
      C.each(
        [
          "tabIndex",
          "readOnly",
          "maxLength",
          "cellSpacing",
          "cellPadding",
          "rowSpan",
          "colSpan",
          "useMap",
          "frameBorder",
          "contentEditable",
        ],
        function () {
          C.propFix[this.toLowerCase()] = this;
        }
      ),
      C.fn.extend({
        addClass: function (e) {
          var t, n, r, i, o, a;
          return h(e)
            ? this.each(function (t) {
                C(this).addClass(e.call(this, t, Tt(this)));
              })
            : (t = kt(e)).length
            ? this.each(function () {
                if (
                  ((r = Tt(this)),
                  (n = 1 === this.nodeType && " " + Ct(r) + " "))
                ) {
                  for (o = 0; o < t.length; o++)
                    (i = t[o]), n.indexOf(" " + i + " ") < 0 && (n += i + " ");
                  (a = Ct(n)), r !== a && this.setAttribute("class", a);
                }
              })
            : this;
        },
        removeClass: function (e) {
          var t, n, r, i, o, a;
          return h(e)
            ? this.each(function (t) {
                C(this).removeClass(e.call(this, t, Tt(this)));
              })
            : arguments.length
            ? (t = kt(e)).length
              ? this.each(function () {
                  if (
                    ((r = Tt(this)),
                    (n = 1 === this.nodeType && " " + Ct(r) + " "))
                  ) {
                    for (o = 0; o < t.length; o++)
                      for (i = t[o]; n.indexOf(" " + i + " ") > -1; )
                        n = n.replace(" " + i + " ", " ");
                    (a = Ct(n)), r !== a && this.setAttribute("class", a);
                  }
                })
              : this
            : this.attr("class", "");
        },
        toggleClass: function (e, t) {
          var n,
            r,
            i,
            o,
            a = typeof e,
            s = "string" === a || Array.isArray(e);
          return h(e)
            ? this.each(function (n) {
                C(this).toggleClass(e.call(this, n, Tt(this), t), t);
              })
            : "boolean" == typeof t && s
            ? t
              ? this.addClass(e)
              : this.removeClass(e)
            : ((n = kt(e)),
              this.each(function () {
                if (s)
                  for (o = C(this), i = 0; i < n.length; i++)
                    (r = n[i]),
                      o.hasClass(r) ? o.removeClass(r) : o.addClass(r);
                else
                  (void 0 !== e && "boolean" !== a) ||
                    ((r = Tt(this)) && ie.set(this, "__className__", r),
                    this.setAttribute &&
                      this.setAttribute(
                        "class",
                        r || !1 === e ? "" : ie.get(this, "__className__") || ""
                      ));
              }));
        },
        hasClass: function (e) {
          var t,
            n,
            r = 0;
          for (t = " " + e + " "; (n = this[r++]); )
            if (1 === n.nodeType && (" " + Ct(Tt(n)) + " ").indexOf(t) > -1)
              return !0;
          return !1;
        },
      });
    var St = /\r/g;
    C.fn.extend({
      val: function (e) {
        var t,
          n,
          r,
          i = this[0];
        return arguments.length
          ? ((r = h(e)),
            this.each(function (n) {
              var i;
              1 === this.nodeType &&
                (null == (i = r ? e.call(this, n, C(this).val()) : e)
                  ? (i = "")
                  : "number" == typeof i
                  ? (i += "")
                  : Array.isArray(i) &&
                    (i = C.map(i, function (e) {
                      return null == e ? "" : e + "";
                    })),
                ((t =
                  C.valHooks[this.type] ||
                  C.valHooks[this.nodeName.toLowerCase()]) &&
                  "set" in t &&
                  void 0 !== t.set(this, i, "value")) ||
                  (this.value = i));
            }))
          : i
          ? (t = C.valHooks[i.type] || C.valHooks[i.nodeName.toLowerCase()]) &&
            "get" in t &&
            void 0 !== (n = t.get(i, "value"))
            ? n
            : "string" == typeof (n = i.value)
            ? n.replace(St, "")
            : null == n
            ? ""
            : n
          : void 0;
      },
    }),
      C.extend({
        valHooks: {
          option: {
            get: function (e) {
              var t = C.find.attr(e, "value");
              return null != t ? t : Ct(C.text(e));
            },
          },
          select: {
            get: function (e) {
              var t,
                n,
                r,
                i = e.options,
                o = e.selectedIndex,
                a = "select-one" === e.type,
                s = a ? null : [],
                l = a ? o + 1 : i.length;
              for (r = o < 0 ? l : a ? o : 0; r < l; r++)
                if (
                  ((n = i[r]).selected || r === o) &&
                  !n.disabled &&
                  (!n.parentNode.disabled || !k(n.parentNode, "optgroup"))
                ) {
                  if (((t = C(n).val()), a)) return t;
                  s.push(t);
                }
              return s;
            },
            set: function (e, t) {
              for (
                var n, r, i = e.options, o = C.makeArray(t), a = i.length;
                a--;

              )
                ((r = i[a]).selected =
                  C.inArray(C.valHooks.option.get(r), o) > -1) && (n = !0);
              return n || (e.selectedIndex = -1), o;
            },
          },
        },
      }),
      C.each(["radio", "checkbox"], function () {
        (C.valHooks[this] = {
          set: function (e, t) {
            if (Array.isArray(t))
              return (e.checked = C.inArray(C(e).val(), t) > -1);
          },
        }),
          p.checkOn ||
            (C.valHooks[this].get = function (e) {
              return null === e.getAttribute("value") ? "on" : e.value;
            });
      });
    var Et = e.location,
      _t = { guid: Date.now() },
      At = /\?/;
    C.parseXML = function (t) {
      var n, r;
      if (!t || "string" != typeof t) return null;
      try {
        n = new e.DOMParser().parseFromString(t, "text/xml");
      } catch (e) {}
      return (
        (r = n && n.getElementsByTagName("parsererror")[0]),
        (n && !r) ||
          C.error(
            "Invalid XML: " +
              (r
                ? C.map(r.childNodes, function (e) {
                    return e.textContent;
                  }).join("\n")
                : t)
          ),
        n
      );
    };
    var jt = /^(?:focusinfocus|focusoutblur)$/,
      Ht = function (e) {
        e.stopPropagation();
      };
    C.extend(C.event, {
      trigger: function (t, n, r, i) {
        var o,
          a,
          s,
          l,
          c,
          d,
          f,
          p,
          m = [r || v],
          y = u.call(t, "type") ? t.type : t,
          b = u.call(t, "namespace") ? t.namespace.split(".") : [];
        if (
          ((a = p = s = r = r || v),
          3 !== r.nodeType &&
            8 !== r.nodeType &&
            !jt.test(y + C.event.triggered) &&
            (y.indexOf(".") > -1 &&
              ((b = y.split(".")), (y = b.shift()), b.sort()),
            (c = y.indexOf(":") < 0 && "on" + y),
            ((t = t[C.expando]
              ? t
              : new C.Event(y, "object" == typeof t && t)).isTrigger = i
              ? 2
              : 3),
            (t.namespace = b.join(".")),
            (t.rnamespace = t.namespace
              ? new RegExp("(^|\\.)" + b.join("\\.(?:.*\\.|)") + "(\\.|$)")
              : null),
            (t.result = void 0),
            t.target || (t.target = r),
            (n = null == n ? [t] : C.makeArray(n, [t])),
            (f = C.event.special[y] || {}),
            i || !f.trigger || !1 !== f.trigger.apply(r, n)))
        ) {
          if (!i && !f.noBubble && !g(r)) {
            for (
              l = f.delegateType || y, jt.test(l + y) || (a = a.parentNode);
              a;
              a = a.parentNode
            )
              m.push(a), (s = a);
            s === (r.ownerDocument || v) &&
              m.push(s.defaultView || s.parentWindow || e);
          }
          for (o = 0; (a = m[o++]) && !t.isPropagationStopped(); )
            (p = a),
              (t.type = o > 1 ? l : f.bindType || y),
              (d =
                (ie.get(a, "events") || Object.create(null))[t.type] &&
                ie.get(a, "handle")) && d.apply(a, n),
              (d = c && a[c]) &&
                d.apply &&
                ne(a) &&
                ((t.result = d.apply(a, n)),
                !1 === t.result && t.preventDefault());
          return (
            (t.type = y),
            i ||
              t.isDefaultPrevented() ||
              (f._default && !1 !== f._default.apply(m.pop(), n)) ||
              !ne(r) ||
              (c &&
                h(r[y]) &&
                !g(r) &&
                ((s = r[c]) && (r[c] = null),
                (C.event.triggered = y),
                t.isPropagationStopped() && p.addEventListener(y, Ht),
                r[y](),
                t.isPropagationStopped() && p.removeEventListener(y, Ht),
                (C.event.triggered = void 0),
                s && (r[c] = s))),
            t.result
          );
        }
      },
      simulate: function (e, t, n) {
        var r = C.extend(new C.Event(), n, { type: e, isSimulated: !0 });
        C.event.trigger(r, null, t);
      },
    }),
      C.fn.extend({
        trigger: function (e, t) {
          return this.each(function () {
            C.event.trigger(e, t, this);
          });
        },
        triggerHandler: function (e, t) {
          var n = this[0];
          if (n) return C.event.trigger(e, t, n, !0);
        },
      });
    var Dt = /\[\]$/,
      Pt = /\r?\n/g,
      Ot = /^(?:submit|button|image|reset|file)$/i,
      Rt = /^(?:input|select|textarea|keygen)/i;
    function Lt(e, t, n, r) {
      var i;
      if (Array.isArray(t))
        C.each(t, function (t, i) {
          n || Dt.test(e)
            ? r(e, i)
            : Lt(
                e + "[" + ("object" == typeof i && null != i ? t : "") + "]",
                i,
                n,
                r
              );
        });
      else if (n || "object" !== b(t)) r(e, t);
      else for (i in t) Lt(e + "[" + i + "]", t[i], n, r);
    }
    (C.param = function (e, t) {
      var n,
        r = [],
        i = function (e, t) {
          var n = h(t) ? t() : t;
          r[r.length] =
            encodeURIComponent(e) +
            "=" +
            encodeURIComponent(null == n ? "" : n);
        };
      if (null == e) return "";
      if (Array.isArray(e) || (e.jquery && !C.isPlainObject(e)))
        C.each(e, function () {
          i(this.name, this.value);
        });
      else for (n in e) Lt(n, e[n], t, i);
      return r.join("&");
    }),
      C.fn.extend({
        serialize: function () {
          return C.param(this.serializeArray());
        },
        serializeArray: function () {
          return this.map(function () {
            var e = C.prop(this, "elements");
            return e ? C.makeArray(e) : this;
          })
            .filter(function () {
              var e = this.type;
              return (
                this.name &&
                !C(this).is(":disabled") &&
                Rt.test(this.nodeName) &&
                !Ot.test(e) &&
                (this.checked || !Ce.test(e))
              );
            })
            .map(function (e, t) {
              var n = C(this).val();
              return null == n
                ? null
                : Array.isArray(n)
                ? C.map(n, function (e) {
                    return { name: t.name, value: e.replace(Pt, "\r\n") };
                  })
                : { name: t.name, value: n.replace(Pt, "\r\n") };
            })
            .get();
        },
      });
    var Nt = /%20/g,
      Mt = /#.*$/,
      qt = /([?&])_=[^&]*/,
      It = /^(.*?):[ \t]*([^\r\n]*)$/gm,
      Wt = /^(?:GET|HEAD)$/,
      Ft = /^\/\//,
      Vt = {},
      $t = {},
      Bt = "*/".concat("*"),
      zt = v.createElement("a");
    function Xt(e) {
      return function (t, n) {
        "string" != typeof t && ((n = t), (t = "*"));
        var r,
          i = 0,
          o = t.toLowerCase().match(B) || [];
        if (h(n))
          for (; (r = o[i++]); )
            "+" === r[0]
              ? ((r = r.slice(1) || "*"), (e[r] = e[r] || []).unshift(n))
              : (e[r] = e[r] || []).push(n);
      };
    }
    function Qt(e, t, n, r) {
      var i = {},
        o = e === $t;
      function a(s) {
        var l;
        return (
          (i[s] = !0),
          C.each(e[s] || [], function (e, s) {
            var c = s(t, n, r);
            return "string" != typeof c || o || i[c]
              ? o
                ? !(l = c)
                : void 0
              : (t.dataTypes.unshift(c), a(c), !1);
          }),
          l
        );
      }
      return a(t.dataTypes[0]) || (!i["*"] && a("*"));
    }
    function Ut(e, t) {
      var n,
        r,
        i = C.ajaxSettings.flatOptions || {};
      for (n in t) void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
      return r && C.extend(!0, e, r), e;
    }
    (zt.href = Et.href),
      C.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
          url: Et.href,
          type: "GET",
          isLocal:
            /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(
              Et.protocol
            ),
          global: !0,
          processData: !0,
          async: !0,
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          accepts: {
            "*": Bt,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript",
          },
          contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ },
          responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON",
          },
          converters: {
            "* text": String,
            "text html": !0,
            "text json": JSON.parse,
            "text xml": C.parseXML,
          },
          flatOptions: { url: !0, context: !0 },
        },
        ajaxSetup: function (e, t) {
          return t ? Ut(Ut(e, C.ajaxSettings), t) : Ut(C.ajaxSettings, e);
        },
        ajaxPrefilter: Xt(Vt),
        ajaxTransport: Xt($t),
        ajax: function (t, n) {
          "object" == typeof t && ((n = t), (t = void 0)), (n = n || {});
          var r,
            i,
            o,
            a,
            s,
            l,
            c,
            u,
            d,
            f,
            p = C.ajaxSetup({}, n),
            h = p.context || p,
            g = p.context && (h.nodeType || h.jquery) ? C(h) : C.event,
            m = C.Deferred(),
            y = C.Callbacks("once memory"),
            b = p.statusCode || {},
            x = {},
            w = {},
            T = "canceled",
            k = {
              readyState: 0,
              getResponseHeader: function (e) {
                var t;
                if (c) {
                  if (!a)
                    for (a = {}; (t = It.exec(o)); )
                      a[t[1].toLowerCase() + " "] = (
                        a[t[1].toLowerCase() + " "] || []
                      ).concat(t[2]);
                  t = a[e.toLowerCase() + " "];
                }
                return null == t ? null : t.join(", ");
              },
              getAllResponseHeaders: function () {
                return c ? o : null;
              },
              setRequestHeader: function (e, t) {
                return (
                  null == c &&
                    ((e = w[e.toLowerCase()] = w[e.toLowerCase()] || e),
                    (x[e] = t)),
                  this
                );
              },
              overrideMimeType: function (e) {
                return null == c && (p.mimeType = e), this;
              },
              statusCode: function (e) {
                var t;
                if (e)
                  if (c) k.always(e[k.status]);
                  else for (t in e) b[t] = [b[t], e[t]];
                return this;
              },
              abort: function (e) {
                var t = e || T;
                return r && r.abort(t), S(0, t), this;
              },
            };
          if (
            (m.promise(k),
            (p.url = ((t || p.url || Et.href) + "").replace(
              Ft,
              Et.protocol + "//"
            )),
            (p.type = n.method || n.type || p.method || p.type),
            (p.dataTypes = (p.dataType || "*").toLowerCase().match(B) || [""]),
            null == p.crossDomain)
          ) {
            l = v.createElement("a");
            try {
              (l.href = p.url),
                (l.href = l.href),
                (p.crossDomain =
                  zt.protocol + "//" + zt.host != l.protocol + "//" + l.host);
            } catch (e) {
              p.crossDomain = !0;
            }
          }
          if (
            (p.data &&
              p.processData &&
              "string" != typeof p.data &&
              (p.data = C.param(p.data, p.traditional)),
            Qt(Vt, p, n, k),
            c)
          )
            return k;
          for (d in ((u = C.event && p.global) &&
            0 === C.active++ &&
            C.event.trigger("ajaxStart"),
          (p.type = p.type.toUpperCase()),
          (p.hasContent = !Wt.test(p.type)),
          (i = p.url.replace(Mt, "")),
          p.hasContent
            ? p.data &&
              p.processData &&
              0 ===
                (p.contentType || "").indexOf(
                  "application/x-www-form-urlencoded"
                ) &&
              (p.data = p.data.replace(Nt, "+"))
            : ((f = p.url.slice(i.length)),
              p.data &&
                (p.processData || "string" == typeof p.data) &&
                ((i += (At.test(i) ? "&" : "?") + p.data), delete p.data),
              !1 === p.cache &&
                ((i = i.replace(qt, "$1")),
                (f = (At.test(i) ? "&" : "?") + "_=" + _t.guid++ + f)),
              (p.url = i + f)),
          p.ifModified &&
            (C.lastModified[i] &&
              k.setRequestHeader("If-Modified-Since", C.lastModified[i]),
            C.etag[i] && k.setRequestHeader("If-None-Match", C.etag[i])),
          ((p.data && p.hasContent && !1 !== p.contentType) || n.contentType) &&
            k.setRequestHeader("Content-Type", p.contentType),
          k.setRequestHeader(
            "Accept",
            p.dataTypes[0] && p.accepts[p.dataTypes[0]]
              ? p.accepts[p.dataTypes[0]] +
                  ("*" !== p.dataTypes[0] ? ", " + Bt + "; q=0.01" : "")
              : p.accepts["*"]
          ),
          p.headers))
            k.setRequestHeader(d, p.headers[d]);
          if (p.beforeSend && (!1 === p.beforeSend.call(h, k, p) || c))
            return k.abort();
          if (
            ((T = "abort"),
            y.add(p.complete),
            k.done(p.success),
            k.fail(p.error),
            (r = Qt($t, p, n, k)))
          ) {
            if (((k.readyState = 1), u && g.trigger("ajaxSend", [k, p]), c))
              return k;
            p.async &&
              p.timeout > 0 &&
              (s = e.setTimeout(function () {
                k.abort("timeout");
              }, p.timeout));
            try {
              (c = !1), r.send(x, S);
            } catch (e) {
              if (c) throw e;
              S(-1, e);
            }
          } else S(-1, "No Transport");
          function S(t, n, a, l) {
            var d,
              f,
              v,
              x,
              w,
              T = n;
            c ||
              ((c = !0),
              s && e.clearTimeout(s),
              (r = void 0),
              (o = l || ""),
              (k.readyState = t > 0 ? 4 : 0),
              (d = (t >= 200 && t < 300) || 304 === t),
              a &&
                (x = (function (e, t, n) {
                  for (
                    var r, i, o, a, s = e.contents, l = e.dataTypes;
                    "*" === l[0];

                  )
                    l.shift(),
                      void 0 === r &&
                        (r = e.mimeType || t.getResponseHeader("Content-Type"));
                  if (r)
                    for (i in s)
                      if (s[i] && s[i].test(r)) {
                        l.unshift(i);
                        break;
                      }
                  if (l[0] in n) o = l[0];
                  else {
                    for (i in n) {
                      if (!l[0] || e.converters[i + " " + l[0]]) {
                        o = i;
                        break;
                      }
                      a || (a = i);
                    }
                    o = o || a;
                  }
                  if (o) return o !== l[0] && l.unshift(o), n[o];
                })(p, k, a)),
              !d &&
                C.inArray("script", p.dataTypes) > -1 &&
                C.inArray("json", p.dataTypes) < 0 &&
                (p.converters["text script"] = function () {}),
              (x = (function (e, t, n, r) {
                var i,
                  o,
                  a,
                  s,
                  l,
                  c = {},
                  u = e.dataTypes.slice();
                if (u[1])
                  for (a in e.converters) c[a.toLowerCase()] = e.converters[a];
                for (o = u.shift(); o; )
                  if (
                    (e.responseFields[o] && (n[e.responseFields[o]] = t),
                    !l &&
                      r &&
                      e.dataFilter &&
                      (t = e.dataFilter(t, e.dataType)),
                    (l = o),
                    (o = u.shift()))
                  )
                    if ("*" === o) o = l;
                    else if ("*" !== l && l !== o) {
                      if (!(a = c[l + " " + o] || c["* " + o]))
                        for (i in c)
                          if (
                            (s = i.split(" "))[1] === o &&
                            (a = c[l + " " + s[0]] || c["* " + s[0]])
                          ) {
                            !0 === a
                              ? (a = c[i])
                              : !0 !== c[i] && ((o = s[0]), u.unshift(s[1]));
                            break;
                          }
                      if (!0 !== a)
                        if (a && e.throws) t = a(t);
                        else
                          try {
                            t = a(t);
                          } catch (e) {
                            return {
                              state: "parsererror",
                              error: a
                                ? e
                                : "No conversion from " + l + " to " + o,
                            };
                          }
                    }
                return { state: "success", data: t };
              })(p, x, k, d)),
              d
                ? (p.ifModified &&
                    ((w = k.getResponseHeader("Last-Modified")) &&
                      (C.lastModified[i] = w),
                    (w = k.getResponseHeader("etag")) && (C.etag[i] = w)),
                  204 === t || "HEAD" === p.type
                    ? (T = "nocontent")
                    : 304 === t
                    ? (T = "notmodified")
                    : ((T = x.state), (f = x.data), (d = !(v = x.error))))
                : ((v = T), (!t && T) || ((T = "error"), t < 0 && (t = 0))),
              (k.status = t),
              (k.statusText = (n || T) + ""),
              d ? m.resolveWith(h, [f, T, k]) : m.rejectWith(h, [k, T, v]),
              k.statusCode(b),
              (b = void 0),
              u &&
                g.trigger(d ? "ajaxSuccess" : "ajaxError", [k, p, d ? f : v]),
              y.fireWith(h, [k, T]),
              u &&
                (g.trigger("ajaxComplete", [k, p]),
                --C.active || C.event.trigger("ajaxStop")));
          }
          return k;
        },
        getJSON: function (e, t, n) {
          return C.get(e, t, n, "json");
        },
        getScript: function (e, t) {
          return C.get(e, void 0, t, "script");
        },
      }),
      C.each(["get", "post"], function (e, t) {
        C[t] = function (e, n, r, i) {
          return (
            h(n) && ((i = i || r), (r = n), (n = void 0)),
            C.ajax(
              C.extend(
                { url: e, type: t, dataType: i, data: n, success: r },
                C.isPlainObject(e) && e
              )
            )
          );
        };
      }),
      C.ajaxPrefilter(function (e) {
        var t;
        for (t in e.headers)
          "content-type" === t.toLowerCase() &&
            (e.contentType = e.headers[t] || "");
      }),
      (C._evalUrl = function (e, t, n) {
        return C.ajax({
          url: e,
          type: "GET",
          dataType: "script",
          cache: !0,
          async: !1,
          global: !1,
          converters: { "text script": function () {} },
          dataFilter: function (e) {
            C.globalEval(e, t, n);
          },
        });
      }),
      C.fn.extend({
        wrapAll: function (e) {
          var t;
          return (
            this[0] &&
              (h(e) && (e = e.call(this[0])),
              (t = C(e, this[0].ownerDocument).eq(0).clone(!0)),
              this[0].parentNode && t.insertBefore(this[0]),
              t
                .map(function () {
                  for (var e = this; e.firstElementChild; )
                    e = e.firstElementChild;
                  return e;
                })
                .append(this)),
            this
          );
        },
        wrapInner: function (e) {
          return h(e)
            ? this.each(function (t) {
                C(this).wrapInner(e.call(this, t));
              })
            : this.each(function () {
                var t = C(this),
                  n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e);
              });
        },
        wrap: function (e) {
          var t = h(e);
          return this.each(function (n) {
            C(this).wrapAll(t ? e.call(this, n) : e);
          });
        },
        unwrap: function (e) {
          return (
            this.parent(e)
              .not("body")
              .each(function () {
                C(this).replaceWith(this.childNodes);
              }),
            this
          );
        },
      }),
      (C.expr.pseudos.hidden = function (e) {
        return !C.expr.pseudos.visible(e);
      }),
      (C.expr.pseudos.visible = function (e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
      }),
      (C.ajaxSettings.xhr = function () {
        try {
          return new e.XMLHttpRequest();
        } catch (e) {}
      });
    var Kt = { 0: 200, 1223: 204 },
      Yt = C.ajaxSettings.xhr();
    (p.cors = !!Yt && "withCredentials" in Yt),
      (p.ajax = Yt = !!Yt),
      C.ajaxTransport(function (t) {
        var n, r;
        if (p.cors || (Yt && !t.crossDomain))
          return {
            send: function (i, o) {
              var a,
                s = t.xhr();
              if (
                (s.open(t.type, t.url, t.async, t.username, t.password),
                t.xhrFields)
              )
                for (a in t.xhrFields) s[a] = t.xhrFields[a];
              for (a in (t.mimeType &&
                s.overrideMimeType &&
                s.overrideMimeType(t.mimeType),
              t.crossDomain ||
                i["X-Requested-With"] ||
                (i["X-Requested-With"] = "XMLHttpRequest"),
              i))
                s.setRequestHeader(a, i[a]);
              (n = function (e) {
                return function () {
                  n &&
                    ((n =
                      r =
                      s.onload =
                      s.onerror =
                      s.onabort =
                      s.ontimeout =
                      s.onreadystatechange =
                        null),
                    "abort" === e
                      ? s.abort()
                      : "error" === e
                      ? "number" != typeof s.status
                        ? o(0, "error")
                        : o(s.status, s.statusText)
                      : o(
                          Kt[s.status] || s.status,
                          s.statusText,
                          "text" !== (s.responseType || "text") ||
                            "string" != typeof s.responseText
                            ? { binary: s.response }
                            : { text: s.responseText },
                          s.getAllResponseHeaders()
                        ));
                };
              }),
                (s.onload = n()),
                (r = s.onerror = s.ontimeout = n("error")),
                void 0 !== s.onabort
                  ? (s.onabort = r)
                  : (s.onreadystatechange = function () {
                      4 === s.readyState &&
                        e.setTimeout(function () {
                          n && r();
                        });
                    }),
                (n = n("abort"));
              try {
                s.send((t.hasContent && t.data) || null);
              } catch (e) {
                if (n) throw e;
              }
            },
            abort: function () {
              n && n();
            },
          };
      }),
      C.ajaxPrefilter(function (e) {
        e.crossDomain && (e.contents.script = !1);
      }),
      C.ajaxSetup({
        accepts: {
          script:
            "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
        },
        contents: { script: /\b(?:java|ecma)script\b/ },
        converters: {
          "text script": function (e) {
            return C.globalEval(e), e;
          },
        },
      }),
      C.ajaxPrefilter("script", function (e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET");
      }),
      C.ajaxTransport("script", function (e) {
        var t, n;
        if (e.crossDomain || e.scriptAttrs)
          return {
            send: function (r, i) {
              (t = C("<script>")
                .attr(e.scriptAttrs || {})
                .prop({ charset: e.scriptCharset, src: e.url })
                .on(
                  "load error",
                  (n = function (e) {
                    t.remove(),
                      (n = null),
                      e && i("error" === e.type ? 404 : 200, e.type);
                  })
                )),
                v.head.appendChild(t[0]);
            },
            abort: function () {
              n && n();
            },
          };
      });
    var Zt,
      Gt = [],
      Jt = /(=)\?(?=&|$)|\?\?/;
    C.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function () {
        var e = Gt.pop() || C.expando + "_" + _t.guid++;
        return (this[e] = !0), e;
      },
    }),
      C.ajaxPrefilter("json jsonp", function (t, n, r) {
        var i,
          o,
          a,
          s =
            !1 !== t.jsonp &&
            (Jt.test(t.url)
              ? "url"
              : "string" == typeof t.data &&
                0 ===
                  (t.contentType || "").indexOf(
                    "application/x-www-form-urlencoded"
                  ) &&
                Jt.test(t.data) &&
                "data");
        if (s || "jsonp" === t.dataTypes[0])
          return (
            (i = t.jsonpCallback =
              h(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback),
            s
              ? (t[s] = t[s].replace(Jt, "$1" + i))
              : !1 !== t.jsonp &&
                (t.url += (At.test(t.url) ? "&" : "?") + t.jsonp + "=" + i),
            (t.converters["script json"] = function () {
              return a || C.error(i + " was not called"), a[0];
            }),
            (t.dataTypes[0] = "json"),
            (o = e[i]),
            (e[i] = function () {
              a = arguments;
            }),
            r.always(function () {
              void 0 === o ? C(e).removeProp(i) : (e[i] = o),
                t[i] && ((t.jsonpCallback = n.jsonpCallback), Gt.push(i)),
                a && h(o) && o(a[0]),
                (a = o = void 0);
            }),
            "script"
          );
      }),
      (p.createHTMLDocument =
        (((Zt = v.implementation.createHTMLDocument("").body).innerHTML =
          "<form></form><form></form>"),
        2 === Zt.childNodes.length)),
      (C.parseHTML = function (e, t, n) {
        return "string" != typeof e
          ? []
          : ("boolean" == typeof t && ((n = t), (t = !1)),
            t ||
              (p.createHTMLDocument
                ? (((r = (t =
                    v.implementation.createHTMLDocument("")).createElement(
                    "base"
                  )).href = v.location.href),
                  t.head.appendChild(r))
                : (t = v)),
            (o = !n && []),
            (i = M.exec(e))
              ? [t.createElement(i[1])]
              : ((i = je([e], t, o)),
                o && o.length && C(o).remove(),
                C.merge([], i.childNodes)));
        var r, i, o;
      }),
      (C.fn.load = function (e, t, n) {
        var r,
          i,
          o,
          a = this,
          s = e.indexOf(" ");
        return (
          s > -1 && ((r = Ct(e.slice(s))), (e = e.slice(0, s))),
          h(t)
            ? ((n = t), (t = void 0))
            : t && "object" == typeof t && (i = "POST"),
          a.length > 0 &&
            C.ajax({ url: e, type: i || "GET", dataType: "html", data: t })
              .done(function (e) {
                (o = arguments),
                  a.html(r ? C("<div>").append(C.parseHTML(e)).find(r) : e);
              })
              .always(
                n &&
                  function (e, t) {
                    a.each(function () {
                      n.apply(this, o || [e.responseText, t, e]);
                    });
                  }
              ),
          this
        );
      }),
      (C.expr.pseudos.animated = function (e) {
        return C.grep(C.timers, function (t) {
          return e === t.elem;
        }).length;
      }),
      (C.offset = {
        setOffset: function (e, t, n) {
          var r,
            i,
            o,
            a,
            s,
            l,
            c = C.css(e, "position"),
            u = C(e),
            d = {};
          "static" === c && (e.style.position = "relative"),
            (s = u.offset()),
            (o = C.css(e, "top")),
            (l = C.css(e, "left")),
            ("absolute" === c || "fixed" === c) && (o + l).indexOf("auto") > -1
              ? ((a = (r = u.position()).top), (i = r.left))
              : ((a = parseFloat(o) || 0), (i = parseFloat(l) || 0)),
            h(t) && (t = t.call(e, n, C.extend({}, s))),
            null != t.top && (d.top = t.top - s.top + a),
            null != t.left && (d.left = t.left - s.left + i),
            "using" in t ? t.using.call(e, d) : u.css(d);
        },
      }),
      C.fn.extend({
        offset: function (e) {
          if (arguments.length)
            return void 0 === e
              ? this
              : this.each(function (t) {
                  C.offset.setOffset(this, e, t);
                });
          var t,
            n,
            r = this[0];
          return r
            ? r.getClientRects().length
              ? ((t = r.getBoundingClientRect()),
                (n = r.ownerDocument.defaultView),
                { top: t.top + n.pageYOffset, left: t.left + n.pageXOffset })
              : { top: 0, left: 0 }
            : void 0;
        },
        position: function () {
          if (this[0]) {
            var e,
              t,
              n,
              r = this[0],
              i = { top: 0, left: 0 };
            if ("fixed" === C.css(r, "position")) t = r.getBoundingClientRect();
            else {
              for (
                t = this.offset(),
                  n = r.ownerDocument,
                  e = r.offsetParent || n.documentElement;
                e &&
                (e === n.body || e === n.documentElement) &&
                "static" === C.css(e, "position");

              )
                e = e.parentNode;
              e &&
                e !== r &&
                1 === e.nodeType &&
                (((i = C(e).offset()).top += C.css(e, "borderTopWidth", !0)),
                (i.left += C.css(e, "borderLeftWidth", !0)));
            }
            return {
              top: t.top - i.top - C.css(r, "marginTop", !0),
              left: t.left - i.left - C.css(r, "marginLeft", !0),
            };
          }
        },
        offsetParent: function () {
          return this.map(function () {
            for (
              var e = this.offsetParent;
              e && "static" === C.css(e, "position");

            )
              e = e.offsetParent;
            return e || fe;
          });
        },
      }),
      C.each(
        { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" },
        function (e, t) {
          var n = "pageYOffset" === t;
          C.fn[e] = function (r) {
            return Z(
              this,
              function (e, r, i) {
                var o;
                if (
                  (g(e) ? (o = e) : 9 === e.nodeType && (o = e.defaultView),
                  void 0 === i)
                )
                  return o ? o[t] : e[r];
                o
                  ? o.scrollTo(n ? o.pageXOffset : i, n ? i : o.pageYOffset)
                  : (e[r] = i);
              },
              e,
              r,
              arguments.length
            );
          };
        }
      ),
      C.each(["top", "left"], function (e, t) {
        C.cssHooks[t] = Ze(p.pixelPosition, function (e, n) {
          if (n)
            return (n = Ye(e, t)), ze.test(n) ? C(e).position()[t] + "px" : n;
        });
      }),
      C.each({ Height: "height", Width: "width" }, function (e, t) {
        C.each(
          { padding: "inner" + e, content: t, "": "outer" + e },
          function (n, r) {
            C.fn[r] = function (i, o) {
              var a = arguments.length && (n || "boolean" != typeof i),
                s = n || (!0 === i || !0 === o ? "margin" : "border");
              return Z(
                this,
                function (t, n, i) {
                  var o;
                  return g(t)
                    ? 0 === r.indexOf("outer")
                      ? t["inner" + e]
                      : t.document.documentElement["client" + e]
                    : 9 === t.nodeType
                    ? ((o = t.documentElement),
                      Math.max(
                        t.body["scroll" + e],
                        o["scroll" + e],
                        t.body["offset" + e],
                        o["offset" + e],
                        o["client" + e]
                      ))
                    : void 0 === i
                    ? C.css(t, n, s)
                    : C.style(t, n, i, s);
                },
                t,
                a ? i : void 0,
                a
              );
            };
          }
        );
      }),
      C.each(
        [
          "ajaxStart",
          "ajaxStop",
          "ajaxComplete",
          "ajaxError",
          "ajaxSuccess",
          "ajaxSend",
        ],
        function (e, t) {
          C.fn[t] = function (e) {
            return this.on(t, e);
          };
        }
      ),
      C.fn.extend({
        bind: function (e, t, n) {
          return this.on(e, null, t, n);
        },
        unbind: function (e, t) {
          return this.off(e, null, t);
        },
        delegate: function (e, t, n, r) {
          return this.on(t, e, n, r);
        },
        undelegate: function (e, t, n) {
          return 1 === arguments.length
            ? this.off(e, "**")
            : this.off(t, e || "**", n);
        },
        hover: function (e, t) {
          return this.on("mouseenter", e).on("mouseleave", t || e);
        },
      }),
      C.each(
        "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(
          " "
        ),
        function (e, t) {
          C.fn[t] = function (e, n) {
            return arguments.length > 0
              ? this.on(t, null, e, n)
              : this.trigger(t);
          };
        }
      );
    var en = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
    (C.proxy = function (e, t) {
      var n, r, o;
      if (("string" == typeof t && ((n = e[t]), (t = e), (e = n)), h(e)))
        return (
          (r = i.call(arguments, 2)),
          (o = function () {
            return e.apply(t || this, r.concat(i.call(arguments)));
          }),
          (o.guid = e.guid = e.guid || C.guid++),
          o
        );
    }),
      (C.holdReady = function (e) {
        e ? C.readyWait++ : C.ready(!0);
      }),
      (C.isArray = Array.isArray),
      (C.parseJSON = JSON.parse),
      (C.nodeName = k),
      (C.isFunction = h),
      (C.isWindow = g),
      (C.camelCase = te),
      (C.type = b),
      (C.now = Date.now),
      (C.isNumeric = function (e) {
        var t = C.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e));
      }),
      (C.trim = function (e) {
        return null == e ? "" : (e + "").replace(en, "$1");
      }),
      "function" == typeof define &&
        define.amd &&
        define("jquery", [], function () {
          return C;
        });
    var tn = e.jQuery,
      nn = e.$;
    return (
      (C.noConflict = function (t) {
        return (
          e.$ === C && (e.$ = nn), t && e.jQuery === C && (e.jQuery = tn), C
        );
      }),
      void 0 === t && (e.jQuery = e.$ = C),
      C
    );
  }),
  (function (e) {
    "use strict";
    "function" == typeof define && define.amd
      ? define(["jquery"], e)
      : "object" == typeof exports && "object" == typeof module
      ? (module.exports = e(require("jquery")))
      : e(jQuery);
  })(function (e, t) {
    "use strict";
    var n = {
        beforeShow: u,
        move: u,
        change: u,
        show: u,
        hide: u,
        color: !1,
        flat: !1,
        showInput: !1,
        allowEmpty: !1,
        showButtons: !0,
        clickoutFiresChange: !0,
        showInitial: !1,
        showPalette: !1,
        showPaletteOnly: !1,
        hideAfterPaletteSelect: !1,
        togglePaletteOnly: !1,
        showSelectionPalette: !0,
        localStorageKey: !1,
        appendTo: "body",
        maxSelectionSize: 7,
        cancelText: "cancel",
        chooseText: "choose",
        togglePaletteMoreText: "more",
        togglePaletteLessText: "less",
        clearText: "Clear Color Selection",
        noColorSelectedText: "No Color Selected",
        preferredFormat: !1,
        className: "",
        containerClassName: "",
        replacerClassName: "",
        showAlpha: !1,
        theme: "sp-light",
        palette: [
          [
            "#ffffff",
            "#000000",
            "#ff0000",
            "#ff8000",
            "#ffff00",
            "#008000",
            "#0000ff",
            "#4b0082",
            "#9400d3",
          ],
        ],
        selectionPalette: [],
        disabled: !1,
        offset: null,
      },
      r = [],
      i = !!/msie/i.exec(window.navigator.userAgent),
      o = (function () {
        function e(e, t) {
          return !!~("" + e).indexOf(t);
        }
        var t = document.createElement("div").style;
        return (
          (t.cssText = "background-color:rgba(0,0,0,.5)"),
          e(t.backgroundColor, "rgba") || e(t.backgroundColor, "hsla")
        );
      })(),
      a = [
        "<div class='sp-replacer'>",
        "<div class='sp-preview'><div class='sp-preview-inner'></div></div>",
        "<div class='sp-dd'>&#9660;</div>",
        "</div>",
      ].join(""),
      s = (function () {
        var e = "";
        if (i)
          for (var t = 1; t <= 6; t++) e += "<div class='sp-" + t + "'></div>";
        return [
          "<div class='sp-container sp-hidden'>",
          "<div class='sp-palette-container'>",
          "<div class='sp-palette sp-thumb sp-cf'></div>",
          "<div class='sp-palette-button-container sp-cf'>",
          "<button type='button' class='sp-palette-toggle'></button>",
          "</div>",
          "</div>",
          "<div class='sp-picker-container'>",
          "<div class='sp-top sp-cf'>",
          "<div class='sp-fill'></div>",
          "<div class='sp-top-inner'>",
          "<div class='sp-color'>",
          "<div class='sp-sat'>",
          "<div class='sp-val'>",
          "<div class='sp-dragger'></div>",
          "</div>",
          "</div>",
          "</div>",
          "<div class='sp-clear sp-clear-display'>",
          "</div>",
          "<div class='sp-hue'>",
          "<div class='sp-slider'></div>",
          e,
          "</div>",
          "</div>",
          "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>",
          "</div>",
          "<div class='sp-input-container sp-cf'>",
          "<input class='sp-input' type='text' spellcheck='false'  />",
          "</div>",
          "<div class='sp-initial sp-thumb sp-cf'></div>",
          "<div class='sp-button-container sp-cf'>",
          "<a class='sp-cancel' href='#'></a>",
          "<button type='button' class='sp-choose'></button>",
          "</div>",
          "</div>",
          "</div>",
        ].join("");
      })();
    function l(t, n, r, i) {
      for (var a = [], s = 0; s < t.length; s++) {
        var l = t[s];
        if (l) {
          var c = tinycolor(l),
            u =
              c.toHsl().l < 0.5
                ? "sp-thumb-el sp-thumb-dark"
                : "sp-thumb-el sp-thumb-light";
          u += tinycolor.equals(n, l) ? " sp-thumb-active" : "";
          var d = c.toString(i.preferredFormat || "rgb"),
            f = o
              ? "background-color:" + c.toRgbString()
              : "filter:" + c.toFilter();
          a.push(
            '<span title="' +
              d +
              '" data-color="' +
              c.toRgbString() +
              '" class="' +
              u +
              '"><span class="sp-thumb-inner" style="' +
              f +
              ';"></span></span>'
          );
        } else {
          a.push(
            e("<div />")
              .append(
                e(
                  '<span data-color="" style="background-color:transparent;" class="sp-clear-display"></span>'
                ).attr("title", i.noColorSelectedText)
              )
              .html()
          );
        }
      }
      return "<div class='sp-cf " + r + "'>" + a.join("") + "</div>";
    }
    function c(c, u) {
      var g,
        v,
        m,
        y,
        b = (function (t, r) {
          var i = e.extend({}, n, t);
          return (
            (i.callbacks = {
              move: f(i.move, r),
              change: f(i.change, r),
              show: f(i.show, r),
              hide: f(i.hide, r),
              beforeShow: f(i.beforeShow, r),
            }),
            i
          );
        })(u, c),
        x = b.flat,
        w = b.showSelectionPalette,
        C = b.localStorageKey,
        T = b.theme,
        k = b.callbacks,
        S =
          ((g = $e),
          (v = 10),
          function () {
            var e = this,
              t = arguments,
              n = function () {
                (y = null), g.apply(e, t);
              };
            m && clearTimeout(y), (!m && y) || (y = setTimeout(n, v));
          }),
        E = !1,
        _ = !1,
        A = 0,
        j = 0,
        H = 0,
        D = 0,
        P = 0,
        O = 0,
        R = 0,
        L = 0,
        N = 0,
        M = 0,
        q = 1,
        I = [],
        W = [],
        F = {},
        V = b.selectionPalette.slice(0),
        $ = b.maxSelectionSize,
        B = "sp-dragging",
        z = null,
        X = c.ownerDocument,
        Q = (X.body, e(c)),
        U = !1,
        K = e(s, X).addClass(T),
        Y = K.find(".sp-picker-container"),
        Z = K.find(".sp-color"),
        G = K.find(".sp-dragger"),
        J = K.find(".sp-hue"),
        ee = K.find(".sp-slider"),
        te = K.find(".sp-alpha-inner"),
        ne = K.find(".sp-alpha"),
        re = K.find(".sp-alpha-handle"),
        ie = K.find(".sp-input"),
        oe = K.find(".sp-palette"),
        ae = K.find(".sp-initial"),
        se = K.find(".sp-cancel"),
        le = K.find(".sp-clear"),
        ce = K.find(".sp-choose"),
        ue = K.find(".sp-palette-toggle"),
        de = Q.is("input"),
        fe = de && "color" === Q.attr("type") && h(),
        pe = de && !x,
        he = pe
          ? e(a).addClass(T).addClass(b.className).addClass(b.replacerClassName)
          : e([]),
        ge = pe ? he : Q,
        ve = he.find(".sp-preview-inner"),
        me = b.color || (de && Q.val()),
        ye = !1,
        be = b.preferredFormat,
        xe = !b.showButtons || b.clickoutFiresChange,
        we = !me,
        Ce = b.allowEmpty && !fe;
      function Te() {
        if (
          (b.showPaletteOnly && (b.showPalette = !0),
          ue.text(
            b.showPaletteOnly
              ? b.togglePaletteMoreText
              : b.togglePaletteLessText
          ),
          b.palette)
        ) {
          (I = b.palette.slice(0)), (W = e.isArray(I[0]) ? I : [I]), (F = {});
          for (var t = 0; t < W.length; t++)
            for (var n = 0; n < W[t].length; n++) {
              var r = tinycolor(W[t][n]).toRgbString();
              F[r] = !0;
            }
        }
        K.toggleClass("sp-flat", x),
          K.toggleClass("sp-input-disabled", !b.showInput),
          K.toggleClass("sp-alpha-enabled", b.showAlpha),
          K.toggleClass("sp-clear-enabled", Ce),
          K.toggleClass("sp-buttons-disabled", !b.showButtons),
          K.toggleClass("sp-palette-buttons-disabled", !b.togglePaletteOnly),
          K.toggleClass("sp-palette-disabled", !b.showPalette),
          K.toggleClass("sp-palette-only", b.showPaletteOnly),
          K.toggleClass("sp-initial-disabled", !b.showInitial),
          K.addClass(b.className).addClass(b.containerClassName),
          $e();
      }
      function ke() {
        if (C && window.localStorage) {
          try {
            var t = window.localStorage[C].split(",#");
            t.length > 1 &&
              (delete window.localStorage[C],
              e.each(t, function (e, t) {
                Se(t);
              }));
          } catch (e) {}
          try {
            V = window.localStorage[C].split(";");
          } catch (e) {}
        }
      }
      function Se(t) {
        if (w) {
          var n = tinycolor(t).toRgbString();
          if (!F[n] && -1 === e.inArray(n, V))
            for (V.push(n); V.length > $; ) V.shift();
          if (C && window.localStorage)
            try {
              window.localStorage[C] = V.join(";");
            } catch (e) {}
        }
      }
      function Ee() {
        var t = qe(),
          n = e.map(W, function (e, n) {
            return l(e, t, "sp-palette-row sp-palette-row-" + n, b);
          });
        ke(),
          V &&
            n.push(
              l(
                (function () {
                  var e = [];
                  if (b.showPalette)
                    for (var t = 0; t < V.length; t++) {
                      var n = tinycolor(V[t]).toRgbString();
                      F[n] || e.push(V[t]);
                    }
                  return e.reverse().slice(0, b.maxSelectionSize);
                })(),
                t,
                "sp-palette-row sp-palette-row-selection",
                b
              )
            ),
          oe.html(n.join(""));
      }
      function _e() {
        if (b.showInitial) {
          var e = ye,
            t = qe();
          ae.html(l([e, t], t, "sp-palette-row-initial", b));
        }
      }
      function Ae() {
        (j <= 0 || A <= 0 || D <= 0) && $e(),
          (_ = !0),
          K.addClass(B),
          (z = null),
          Q.trigger("dragstart.spectrum", [qe()]);
      }
      function je() {
        (_ = !1), K.removeClass(B), Q.trigger("dragstop.spectrum", [qe()]);
      }
      function He() {
        var e = ie.val();
        if ((null !== e && "" !== e) || !Ce) {
          var t = tinycolor(e);
          t.isValid()
            ? (Me(t), Ie(), Ve())
            : ie.addClass("sp-validation-error");
        } else Me(null), Ie(), Ve();
      }
      function De() {
        E ? Le() : Pe();
      }
      function Pe() {
        var t = e.Event("beforeShow.spectrum");
        E
          ? $e()
          : (Q.trigger(t, [qe()]),
            !1 === k.beforeShow(qe()) ||
              t.isDefaultPrevented() ||
              (!(function () {
                for (var e = 0; e < r.length; e++) r[e] && r[e].hide();
              })(),
              (E = !0),
              e(X).on("keydown.spectrum", Oe),
              e(X).on("click.spectrum", Re),
              e(window).on("resize.spectrum", S),
              he.addClass("sp-active"),
              K.removeClass("sp-hidden"),
              $e(),
              We(),
              (ye = qe()),
              _e(),
              k.show(ye),
              Q.trigger("show.spectrum", [ye])));
      }
      function Oe(e) {
        27 === e.keyCode && Le();
      }
      function Re(e) {
        2 != e.button && (_ || (xe ? Ve(!0) : Ne(), Le()));
      }
      function Le() {
        E &&
          !x &&
          ((E = !1),
          e(X).off("keydown.spectrum", Oe),
          e(X).off("click.spectrum", Re),
          e(window).off("resize.spectrum", S),
          he.removeClass("sp-active"),
          K.addClass("sp-hidden"),
          k.hide(qe()),
          Q.trigger("hide.spectrum", [qe()]));
      }
      function Ne() {
        Me(ye, !0), Ve(!0);
      }
      function Me(e, t) {
        var n, r;
        tinycolor.equals(e, qe())
          ? We()
          : (!e && Ce
              ? (we = !0)
              : ((we = !1),
                (r = (n = tinycolor(e)).toHsv()),
                (L = (r.h % 360) / 360),
                (N = r.s),
                (M = r.v),
                (q = r.a)),
            We(),
            n &&
              n.isValid() &&
              !t &&
              (be = b.preferredFormat || n.getFormat()));
      }
      function qe(e) {
        return (
          (e = e || {}),
          Ce && we
            ? null
            : tinycolor.fromRatio(
                { h: L, s: N, v: M, a: Math.round(1e3 * q) / 1e3 },
                { format: e.format || be }
              )
        );
      }
      function Ie() {
        We(), k.move(qe()), Q.trigger("move.spectrum", [qe()]);
      }
      function We() {
        ie.removeClass("sp-validation-error"), Fe();
        var e = tinycolor.fromRatio({ h: L, s: 1, v: 1 });
        Z.css("background-color", e.toHexString());
        var t = be;
        q < 1 &&
          (0 !== q || "name" !== t) &&
          (("hex" !== t && "hex3" !== t && "hex6" !== t && "name" !== t) ||
            (t = "rgb"));
        var n = qe({ format: t }),
          r = "";
        if (
          (ve.removeClass("sp-clear-display"),
          ve.css("background-color", "transparent"),
          !n && Ce)
        )
          ve.addClass("sp-clear-display");
        else {
          var a = n.toHexString(),
            s = n.toRgbString();
          if (
            (o || 1 === n.alpha
              ? ve.css("background-color", s)
              : (ve.css("background-color", "transparent"),
                ve.css("filter", n.toFilter())),
            b.showAlpha)
          ) {
            var l = n.toRgb();
            l.a = 0;
            var c = tinycolor(l).toRgbString(),
              u = "linear-gradient(left, " + c + ", " + a + ")";
            i
              ? te.css("filter", tinycolor(c).toFilter({ gradientType: 1 }, a))
              : (te.css("background", "-webkit-" + u),
                te.css("background", "-moz-" + u),
                te.css("background", "-ms-" + u),
                te.css(
                  "background",
                  "linear-gradient(to right, " + c + ", " + a + ")"
                ));
          }
          r = n.toString(t);
        }
        b.showInput && ie.val(r), b.showPalette && Ee(), _e();
      }
      function Fe() {
        var e = N,
          t = M;
        if (Ce && we) re.hide(), ee.hide(), G.hide();
        else {
          re.show(), ee.show(), G.show();
          var n = e * A,
            r = j - t * j;
          (n = Math.max(-H, Math.min(A - H, n - H))),
            (r = Math.max(-H, Math.min(j - H, r - H))),
            G.css({ top: r + "px", left: n + "px" });
          var i = q * P;
          re.css({ left: i - O / 2 + "px" });
          var o = L * D;
          ee.css({ top: o - R + "px" });
        }
      }
      function Ve(e) {
        var t = qe(),
          n = "",
          r = !tinycolor.equals(t, ye);
        t && ((n = t.toString(be)), Se(t)),
          de && Q.val(n),
          e && r && (k.change(t), Q.trigger("change", [t]));
      }
      function $e() {
        E &&
          ((A = Z.width()),
          (j = Z.height()),
          (H = G.height()),
          J.width(),
          (D = J.height()),
          (R = ee.height()),
          (P = ne.width()),
          (O = re.width()),
          x ||
            (K.css("position", "absolute"),
            b.offset
              ? K.offset(b.offset)
              : K.offset(
                  (function (t, n) {
                    var r = 0,
                      i = t.outerWidth(),
                      o = t.outerHeight(),
                      a = n.outerHeight(),
                      s = t[0].ownerDocument,
                      l = s.documentElement,
                      c = l.clientWidth + e(s).scrollLeft(),
                      u = l.clientHeight + e(s).scrollTop(),
                      d = n.offset(),
                      f = d.left,
                      p = d.top;
                    return (
                      (p += a),
                      (f -= Math.min(
                        f,
                        f + i > c && c > i ? Math.abs(f + i - c) : 0
                      )),
                      {
                        top: (p -= Math.min(
                          p,
                          p + o > u && u > o ? Math.abs(o + a - r) : r
                        )),
                        bottom: d.bottom,
                        left: f,
                        right: d.right,
                        width: d.width,
                        height: d.height,
                      }
                    );
                  })(K, ge)
                )),
          Fe(),
          b.showPalette && Ee(),
          Q.trigger("reflow.spectrum"));
      }
      function Be() {
        Le(), (U = !0), Q.attr("disabled", !0), ge.addClass("sp-disabled");
      }
      !(function () {
        if (
          (i && K.find("*:not(input)").attr("unselectable", "on"),
          Te(),
          pe && Q.after(he).hide(),
          Ce || le.hide(),
          x)
        )
          Q.after(K).hide();
        else {
          var t = "parent" === b.appendTo ? Q.parent() : e(b.appendTo);
          1 !== t.length && (t = e("body")), t.append(K);
        }
        function n(t) {
          return (
            t.data && t.data.ignore
              ? (Me(e(t.target).closest(".sp-thumb-el").data("color")), Ie())
              : (Me(e(t.target).closest(".sp-thumb-el").data("color")),
                Ie(),
                b.hideAfterPaletteSelect ? (Ve(!0), Le()) : Ve()),
            !1
          );
        }
        ke(),
          ge.on("click.spectrum touchstart.spectrum", function (t) {
            U || De(),
              t.stopPropagation(),
              e(t.target).is("input") || t.preventDefault();
          }),
          (Q.is(":disabled") || !0 === b.disabled) && Be(),
          K.click(d),
          ie.change(He),
          ie.on("paste", function () {
            setTimeout(He, 1);
          }),
          ie.keydown(function (e) {
            13 == e.keyCode && He();
          }),
          se.text(b.cancelText),
          se.on("click.spectrum", function (e) {
            e.stopPropagation(), e.preventDefault(), Ne(), Le();
          }),
          le.attr("title", b.clearText),
          le.on("click.spectrum", function (e) {
            e.stopPropagation(),
              e.preventDefault(),
              (we = !0),
              Ie(),
              x && Ve(!0);
          }),
          ce.text(b.chooseText),
          ce.on("click.spectrum", function (e) {
            e.stopPropagation(),
              e.preventDefault(),
              i && ie.is(":focus") && ie.trigger("change"),
              ie.hasClass("sp-validation-error") || (Ve(!0), Le());
          }),
          ue.text(
            b.showPaletteOnly
              ? b.togglePaletteMoreText
              : b.togglePaletteLessText
          ),
          ue.on("click.spectrum", function (e) {
            e.stopPropagation(),
              e.preventDefault(),
              (b.showPaletteOnly = !b.showPaletteOnly),
              b.showPaletteOnly ||
                x ||
                K.css("left", "-=" + (Y.outerWidth(!0) + 5)),
              Te();
          }),
          p(
            ne,
            function (e, t, n) {
              (q = e / P),
                (we = !1),
                n.shiftKey && (q = Math.round(10 * q) / 10),
                Ie();
            },
            Ae,
            je
          ),
          p(
            J,
            function (e, t) {
              (L = parseFloat(t / D)), (we = !1), b.showAlpha || (q = 1), Ie();
            },
            Ae,
            je
          ),
          p(
            Z,
            function (e, t, n) {
              if (n.shiftKey) {
                if (!z) {
                  var r = N * A,
                    i = j - M * j,
                    o = Math.abs(e - r) > Math.abs(t - i);
                  z = o ? "x" : "y";
                }
              } else z = null;
              var a = !z || "y" === z;
              (!z || "x" === z) && (N = parseFloat(e / A)),
                a && (M = parseFloat((j - t) / j)),
                (we = !1),
                b.showAlpha || (q = 1),
                Ie();
            },
            Ae,
            je
          ),
          me
            ? (Me(me),
              We(),
              (be = b.preferredFormat || tinycolor(me).format),
              Se(me))
            : We(),
          x && Pe();
        var r = i ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
        oe.on(r, ".sp-thumb-el", n),
          ae.on(r, ".sp-thumb-el:nth-child(1)", { ignore: !0 }, n);
      })();
      var ze = {
        show: Pe,
        hide: Le,
        toggle: De,
        reflow: $e,
        option: function (n, r) {
          return n === t
            ? e.extend({}, b)
            : r === t
            ? b[n]
            : ((b[n] = r),
              "preferredFormat" === n && (be = b.preferredFormat),
              void Te());
        },
        enable: function () {
          (U = !1), Q.attr("disabled", !1), ge.removeClass("sp-disabled");
        },
        disable: Be,
        offset: function (e) {
          (b.offset = e), $e();
        },
        set: function (e) {
          Me(e), Ve();
        },
        get: qe,
        destroy: function () {
          Q.show(),
            ge.off("click.spectrum touchstart.spectrum"),
            K.remove(),
            he.remove(),
            (r[ze.id] = null);
        },
        container: K,
      };
      return (ze.id = r.push(ze) - 1), ze;
    }
    function u() {}
    function d(e) {
      e.stopPropagation();
    }
    function f(e, t) {
      var n = Array.prototype.slice,
        r = n.call(arguments, 2);
      return function () {
        return e.apply(t, r.concat(n.call(arguments)));
      };
    }
    function p(t, n, r, o) {
      (n = n || function () {}),
        (r = r || function () {}),
        (o = o || function () {});
      var a = document,
        s = !1,
        l = {},
        c = 0,
        u = 0,
        d = "ontouchstart" in window,
        f = {};
      function p(e) {
        e.stopPropagation && e.stopPropagation(),
          e.preventDefault && e.preventDefault(),
          (e.returnValue = !1);
      }
      function h(e) {
        if (s) {
          if (i && a.documentMode < 9 && !e.button) return g();
          var r =
              e.originalEvent &&
              e.originalEvent.touches &&
              e.originalEvent.touches[0],
            o = (r && r.pageX) || e.pageX,
            f = (r && r.pageY) || e.pageY,
            h = Math.max(0, Math.min(o - l.left, u)),
            v = Math.max(0, Math.min(f - l.top, c));
          d && p(e), n.apply(t, [h, v, e]);
        }
      }
      function g() {
        s &&
          (e(a).off(f),
          e(a.body).removeClass("sp-dragging"),
          setTimeout(function () {
            o.apply(t, arguments);
          }, 0)),
          (s = !1);
      }
      (f.selectstart = p),
        (f.dragstart = p),
        (f["touchmove mousemove"] = h),
        (f["touchend mouseup"] = g),
        e(t).on("touchstart mousedown", function (n) {
          (n.which ? 3 == n.which : 2 == n.button) ||
            s ||
            (!1 !== r.apply(t, arguments) &&
              ((s = !0),
              (c = e(t).height()),
              (u = e(t).width()),
              (l = e(t).offset()),
              e(a).on(f),
              e(a.body).addClass("sp-dragging"),
              h(n),
              p(n)));
        });
    }
    function h() {
      return e.fn.spectrum.inputTypeColorSupport();
    }
    var g = "spectrum.id";
    (e.fn.spectrum = function (t, n) {
      if ("string" == typeof t) {
        var i = this,
          o = Array.prototype.slice.call(arguments, 1);
        return (
          this.each(function () {
            var n = r[e(this).data(g)];
            if (n) {
              var a = n[t];
              if (!a) throw new Error("Spectrum: no such method: '" + t + "'");
              "get" == t
                ? (i = n.get())
                : "container" == t
                ? (i = n.container)
                : "option" == t
                ? (i = n.option.apply(n, o))
                : "destroy" == t
                ? (n.destroy(), e(this).removeData(g))
                : a.apply(n, o);
            }
          }),
          i
        );
      }
      return this.spectrum("destroy").each(function () {
        var n = c(this, e.extend({}, e(this).data(), t));
        e(this).data(g, n.id);
      });
    }),
      (e.fn.spectrum.load = !0),
      (e.fn.spectrum.loadOpts = {}),
      (e.fn.spectrum.draggable = p),
      (e.fn.spectrum.defaults = n),
      (e.fn.spectrum.inputTypeColorSupport = function t() {
        if (void 0 === t._cachedResult) {
          var n = e("<input type='color'/>")[0];
          t._cachedResult = "color" === n.type && "" !== n.value;
        }
        return t._cachedResult;
      }),
      (e.spectrum = {}),
      (e.spectrum.localization = {}),
      (e.spectrum.palettes = {}),
      (e.fn.spectrum.processNativeColorInputs = function () {
        var t = e("input[type=color]");
        t.length && !h() && t.spectrum({ preferredFormat: "hex6" });
      }),
      (function () {
        var e = /^[\s,#]+/,
          t = /\s+$/,
          n = 0,
          r = Math,
          i = r.round,
          o = r.min,
          a = r.max,
          s = r.random,
          l = function (s, c) {
            if (((c = c || {}), (s = s || "") instanceof l)) return s;
            if (!(this instanceof l)) return new l(s, c);
            var u = (function (n) {
              var i = { r: 0, g: 0, b: 0 },
                s = 1,
                l = !1,
                c = !1;
              "string" == typeof n &&
                (n = (function (n) {
                  n = n.replace(e, "").replace(t, "").toLowerCase();
                  var r,
                    i = !1;
                  if (E[n]) (n = E[n]), (i = !0);
                  else if ("transparent" == n)
                    return { r: 0, g: 0, b: 0, a: 0, format: "name" };
                  if ((r = q.rgb.exec(n))) return { r: r[1], g: r[2], b: r[3] };
                  if ((r = q.rgba.exec(n)))
                    return { r: r[1], g: r[2], b: r[3], a: r[4] };
                  if ((r = q.hsl.exec(n))) return { h: r[1], s: r[2], l: r[3] };
                  if ((r = q.hsla.exec(n)))
                    return { h: r[1], s: r[2], l: r[3], a: r[4] };
                  if ((r = q.hsv.exec(n))) return { h: r[1], s: r[2], v: r[3] };
                  if ((r = q.hsva.exec(n)))
                    return { h: r[1], s: r[2], v: r[3], a: r[4] };
                  if ((r = q.hex8.exec(n)))
                    return {
                      a: R(r[1]),
                      r: D(r[2]),
                      g: D(r[3]),
                      b: D(r[4]),
                      format: i ? "name" : "hex8",
                    };
                  if ((r = q.hex6.exec(n)))
                    return {
                      r: D(r[1]),
                      g: D(r[2]),
                      b: D(r[3]),
                      format: i ? "name" : "hex",
                    };
                  if ((r = q.hex3.exec(n)))
                    return {
                      r: D(r[1] + "" + r[1]),
                      g: D(r[2] + "" + r[2]),
                      b: D(r[3] + "" + r[3]),
                      format: i ? "name" : "hex",
                    };
                  return !1;
                })(n));
              "object" == typeof n &&
                (n.hasOwnProperty("r") &&
                n.hasOwnProperty("g") &&
                n.hasOwnProperty("b")
                  ? ((u = n.r),
                    (d = n.g),
                    (f = n.b),
                    (i = {
                      r: 255 * j(u, 255),
                      g: 255 * j(d, 255),
                      b: 255 * j(f, 255),
                    }),
                    (l = !0),
                    (c = "%" === String(n.r).substr(-1) ? "prgb" : "rgb"))
                  : n.hasOwnProperty("h") &&
                    n.hasOwnProperty("s") &&
                    n.hasOwnProperty("v")
                  ? ((n.s = O(n.s)),
                    (n.v = O(n.v)),
                    (i = (function (e, t, n) {
                      (e = 6 * j(e, 360)), (t = j(t, 100)), (n = j(n, 100));
                      var i = r.floor(e),
                        o = e - i,
                        a = n * (1 - t),
                        s = n * (1 - o * t),
                        l = n * (1 - (1 - o) * t),
                        c = i % 6,
                        u = [n, s, a, a, l, n][c],
                        d = [l, n, n, s, a, a][c],
                        f = [a, a, l, n, n, s][c];
                      return { r: 255 * u, g: 255 * d, b: 255 * f };
                    })(n.h, n.s, n.v)),
                    (l = !0),
                    (c = "hsv"))
                  : n.hasOwnProperty("h") &&
                    n.hasOwnProperty("s") &&
                    n.hasOwnProperty("l") &&
                    ((n.s = O(n.s)),
                    (n.l = O(n.l)),
                    (i = (function (e, t, n) {
                      var r, i, o;
                      function a(e, t, n) {
                        return (
                          n < 0 && (n += 1),
                          n > 1 && (n -= 1),
                          n < 1 / 6
                            ? e + 6 * (t - e) * n
                            : n < 0.5
                            ? t
                            : n < 2 / 3
                            ? e + (t - e) * (2 / 3 - n) * 6
                            : e
                        );
                      }
                      if (
                        ((e = j(e, 360)),
                        (t = j(t, 100)),
                        (n = j(n, 100)),
                        0 === t)
                      )
                        r = i = o = n;
                      else {
                        var s = n < 0.5 ? n * (1 + t) : n + t - n * t,
                          l = 2 * n - s;
                        (r = a(l, s, e + 1 / 3)),
                          (i = a(l, s, e)),
                          (o = a(l, s, e - 1 / 3));
                      }
                      return { r: 255 * r, g: 255 * i, b: 255 * o };
                    })(n.h, n.s, n.l)),
                    (l = !0),
                    (c = "hsl")),
                n.hasOwnProperty("a") && (s = n.a));
              var u, d, f;
              return (
                (s = A(s)),
                {
                  ok: l,
                  format: n.format || c,
                  r: o(255, a(i.r, 0)),
                  g: o(255, a(i.g, 0)),
                  b: o(255, a(i.b, 0)),
                  a: s,
                }
              );
            })(s);
            (this._originalInput = s),
              (this._r = u.r),
              (this._g = u.g),
              (this._b = u.b),
              (this._a = u.a),
              (this._roundA = i(1e3 * this._a) / 1e3),
              (this._format = c.format || u.format),
              (this._gradientType = c.gradientType),
              this._r < 1 && (this._r = i(this._r)),
              this._g < 1 && (this._g = i(this._g)),
              this._b < 1 && (this._b = i(this._b)),
              (this._ok = u.ok),
              (this._tc_id = n++);
          };
        function c(e, t, n) {
          (e = j(e, 255)), (t = j(t, 255)), (n = j(n, 255));
          var r,
            i,
            s = a(e, t, n),
            l = o(e, t, n),
            c = (s + l) / 2;
          if (s == l) r = i = 0;
          else {
            var u = s - l;
            switch (((i = c > 0.5 ? u / (2 - s - l) : u / (s + l)), s)) {
              case e:
                r = (t - n) / u + (t < n ? 6 : 0);
                break;
              case t:
                r = (n - e) / u + 2;
                break;
              case n:
                r = (e - t) / u + 4;
            }
            r /= 6;
          }
          return { h: r, s: i, l: c };
        }
        function u(e, t, n) {
          (e = j(e, 255)), (t = j(t, 255)), (n = j(n, 255));
          var r,
            i,
            s = a(e, t, n),
            l = o(e, t, n),
            c = s,
            u = s - l;
          if (((i = 0 === s ? 0 : u / s), s == l)) r = 0;
          else {
            switch (s) {
              case e:
                r = (t - n) / u + (t < n ? 6 : 0);
                break;
              case t:
                r = (n - e) / u + 2;
                break;
              case n:
                r = (e - t) / u + 4;
            }
            r /= 6;
          }
          return { h: r, s: i, v: c };
        }
        function d(e, t, n, r) {
          var o = [
            P(i(e).toString(16)),
            P(i(t).toString(16)),
            P(i(n).toString(16)),
          ];
          return r &&
            o[0].charAt(0) == o[0].charAt(1) &&
            o[1].charAt(0) == o[1].charAt(1) &&
            o[2].charAt(0) == o[2].charAt(1)
            ? o[0].charAt(0) + o[1].charAt(0) + o[2].charAt(0)
            : o.join("");
        }
        function f(e, t, n, r) {
          var o;
          return [
            P(((o = r), Math.round(255 * parseFloat(o)).toString(16))),
            P(i(e).toString(16)),
            P(i(t).toString(16)),
            P(i(n).toString(16)),
          ].join("");
        }
        function p(e, t) {
          t = 0 === t ? 0 : t || 10;
          var n = l(e).toHsl();
          return (n.s -= t / 100), (n.s = H(n.s)), l(n);
        }
        function h(e, t) {
          t = 0 === t ? 0 : t || 10;
          var n = l(e).toHsl();
          return (n.s += t / 100), (n.s = H(n.s)), l(n);
        }
        function g(e) {
          return l(e).desaturate(100);
        }
        function v(e, t) {
          t = 0 === t ? 0 : t || 10;
          var n = l(e).toHsl();
          return (n.l += t / 100), (n.l = H(n.l)), l(n);
        }
        function m(e, t) {
          t = 0 === t ? 0 : t || 10;
          var n = l(e).toRgb();
          return (
            (n.r = a(0, o(255, n.r - i((-t / 100) * 255)))),
            (n.g = a(0, o(255, n.g - i((-t / 100) * 255)))),
            (n.b = a(0, o(255, n.b - i((-t / 100) * 255)))),
            l(n)
          );
        }
        function y(e, t) {
          t = 0 === t ? 0 : t || 10;
          var n = l(e).toHsl();
          return (n.l -= t / 100), (n.l = H(n.l)), l(n);
        }
        function b(e, t) {
          var n = l(e).toHsl(),
            r = (i(n.h) + t) % 360;
          return (n.h = r < 0 ? 360 + r : r), l(n);
        }
        function x(e) {
          var t = l(e).toHsl();
          return (t.h = (t.h + 180) % 360), l(t);
        }
        function w(e) {
          var t = l(e).toHsl(),
            n = t.h;
          return [
            l(e),
            l({ h: (n + 120) % 360, s: t.s, l: t.l }),
            l({ h: (n + 240) % 360, s: t.s, l: t.l }),
          ];
        }
        function C(e) {
          var t = l(e).toHsl(),
            n = t.h;
          return [
            l(e),
            l({ h: (n + 90) % 360, s: t.s, l: t.l }),
            l({ h: (n + 180) % 360, s: t.s, l: t.l }),
            l({ h: (n + 270) % 360, s: t.s, l: t.l }),
          ];
        }
        function T(e) {
          var t = l(e).toHsl(),
            n = t.h;
          return [
            l(e),
            l({ h: (n + 72) % 360, s: t.s, l: t.l }),
            l({ h: (n + 216) % 360, s: t.s, l: t.l }),
          ];
        }
        function k(e, t, n) {
          (t = t || 6), (n = n || 30);
          var r = l(e).toHsl(),
            i = 360 / n,
            o = [l(e)];
          for (r.h = (r.h - ((i * t) >> 1) + 720) % 360; --t; )
            (r.h = (r.h + i) % 360), o.push(l(r));
          return o;
        }
        function S(e, t) {
          t = t || 6;
          for (
            var n = l(e).toHsv(), r = n.h, i = n.s, o = n.v, a = [], s = 1 / t;
            t--;

          )
            a.push(l({ h: r, s: i, v: o })), (o = (o + s) % 1);
          return a;
        }
        (l.prototype = {
          isDark: function () {
            return this.getBrightness() < 128;
          },
          isLight: function () {
            return !this.isDark();
          },
          isValid: function () {
            return this._ok;
          },
          getOriginalInput: function () {
            return this._originalInput;
          },
          getFormat: function () {
            return this._format;
          },
          getAlpha: function () {
            return this._a;
          },
          getBrightness: function () {
            var e = this.toRgb();
            return (299 * e.r + 587 * e.g + 114 * e.b) / 1e3;
          },
          setAlpha: function (e) {
            return (
              (this._a = A(e)), (this._roundA = i(1e3 * this._a) / 1e3), this
            );
          },
          toHsv: function () {
            var e = u(this._r, this._g, this._b);
            return { h: 360 * e.h, s: e.s, v: e.v, a: this._a };
          },
          toHsvString: function () {
            var e = u(this._r, this._g, this._b),
              t = i(360 * e.h),
              n = i(100 * e.s),
              r = i(100 * e.v);
            return 1 == this._a
              ? "hsv(" + t + ", " + n + "%, " + r + "%)"
              : "hsva(" + t + ", " + n + "%, " + r + "%, " + this._roundA + ")";
          },
          toHsl: function () {
            var e = c(this._r, this._g, this._b);
            return { h: 360 * e.h, s: e.s, l: e.l, a: this._a };
          },
          toHslString: function () {
            var e = c(this._r, this._g, this._b),
              t = i(360 * e.h),
              n = i(100 * e.s),
              r = i(100 * e.l);
            return 1 == this._a
              ? "hsl(" + t + ", " + n + "%, " + r + "%)"
              : "hsla(" + t + ", " + n + "%, " + r + "%, " + this._roundA + ")";
          },
          toHex: function (e) {
            return d(this._r, this._g, this._b, e);
          },
          toHexString: function (e) {
            return "#" + this.toHex(e);
          },
          toHex8: function () {
            return f(this._r, this._g, this._b, this._a);
          },
          toHex8String: function () {
            return "#" + this.toHex8();
          },
          toRgb: function () {
            return { r: i(this._r), g: i(this._g), b: i(this._b), a: this._a };
          },
          toRgbString: function () {
            return 1 == this._a
              ? "rgb(" +
                  i(this._r) +
                  ", " +
                  i(this._g) +
                  ", " +
                  i(this._b) +
                  ")"
              : "rgba(" +
                  i(this._r) +
                  ", " +
                  i(this._g) +
                  ", " +
                  i(this._b) +
                  ", " +
                  this._roundA +
                  ")";
          },
          toPercentageRgb: function () {
            return {
              r: i(100 * j(this._r, 255)) + "%",
              g: i(100 * j(this._g, 255)) + "%",
              b: i(100 * j(this._b, 255)) + "%",
              a: this._a,
            };
          },
          toPercentageRgbString: function () {
            return 1 == this._a
              ? "rgb(" +
                  i(100 * j(this._r, 255)) +
                  "%, " +
                  i(100 * j(this._g, 255)) +
                  "%, " +
                  i(100 * j(this._b, 255)) +
                  "%)"
              : "rgba(" +
                  i(100 * j(this._r, 255)) +
                  "%, " +
                  i(100 * j(this._g, 255)) +
                  "%, " +
                  i(100 * j(this._b, 255)) +
                  "%, " +
                  this._roundA +
                  ")";
          },
          toName: function () {
            return 0 === this._a
              ? "transparent"
              : !(this._a < 1) && (_[d(this._r, this._g, this._b, !0)] || !1);
          },
          toFilter: function (e) {
            var t = "#" + f(this._r, this._g, this._b, this._a),
              n = t,
              r = this._gradientType ? "GradientType = 1, " : "";
            e && (n = l(e).toHex8String());
            return (
              "progid:DXImageTransform.Microsoft.gradient(" +
              r +
              "startColorstr=" +
              t +
              ",endColorstr=" +
              n +
              ")"
            );
          },
          toString: function (e) {
            var t = !!e;
            e = e || this._format;
            var n = !1,
              r = this._a < 1 && this._a >= 0;
            return t ||
              !r ||
              ("hex" !== e && "hex6" !== e && "hex3" !== e && "name" !== e)
              ? ("rgb" === e && (n = this.toRgbString()),
                "prgb" === e && (n = this.toPercentageRgbString()),
                ("hex" !== e && "hex6" !== e) || (n = this.toHexString()),
                "hex3" === e && (n = this.toHexString(!0)),
                "hex8" === e && (n = this.toHex8String()),
                "name" === e && (n = this.toName()),
                "hsl" === e && (n = this.toHslString()),
                "hsv" === e && (n = this.toHsvString()),
                n || this.toHexString())
              : "name" === e && 0 === this._a
              ? this.toName()
              : this.toRgbString();
          },
          _applyModification: function (e, t) {
            var n = e.apply(null, [this].concat([].slice.call(t)));
            return (
              (this._r = n._r),
              (this._g = n._g),
              (this._b = n._b),
              this.setAlpha(n._a),
              this
            );
          },
          lighten: function () {
            return this._applyModification(v, arguments);
          },
          brighten: function () {
            return this._applyModification(m, arguments);
          },
          darken: function () {
            return this._applyModification(y, arguments);
          },
          desaturate: function () {
            return this._applyModification(p, arguments);
          },
          saturate: function () {
            return this._applyModification(h, arguments);
          },
          greyscale: function () {
            return this._applyModification(g, arguments);
          },
          spin: function () {
            return this._applyModification(b, arguments);
          },
          _applyCombination: function (e, t) {
            return e.apply(null, [this].concat([].slice.call(t)));
          },
          analogous: function () {
            return this._applyCombination(k, arguments);
          },
          complement: function () {
            return this._applyCombination(x, arguments);
          },
          monochromatic: function () {
            return this._applyCombination(S, arguments);
          },
          splitcomplement: function () {
            return this._applyCombination(T, arguments);
          },
          triad: function () {
            return this._applyCombination(w, arguments);
          },
          tetrad: function () {
            return this._applyCombination(C, arguments);
          },
        }),
          (l.fromRatio = function (e, t) {
            if ("object" == typeof e) {
              var n = {};
              for (var r in e)
                e.hasOwnProperty(r) && (n[r] = "a" === r ? e[r] : O(e[r]));
              e = n;
            }
            return l(e, t);
          }),
          (l.equals = function (e, t) {
            return !(!e || !t) && l(e).toRgbString() == l(t).toRgbString();
          }),
          (l.random = function () {
            return l.fromRatio({ r: s(), g: s(), b: s() });
          }),
          (l.mix = function (e, t, n) {
            n = 0 === n ? 0 : n || 50;
            var r,
              i = l(e).toRgb(),
              o = l(t).toRgb(),
              a = n / 100,
              s = 2 * a - 1,
              c = o.a - i.a,
              u =
                1 -
                (r = ((r = s * c == -1 ? s : (s + c) / (1 + s * c)) + 1) / 2),
              d = {
                r: o.r * r + i.r * u,
                g: o.g * r + i.g * u,
                b: o.b * r + i.b * u,
                a: o.a * a + i.a * (1 - a),
              };
            return l(d);
          }),
          (l.readability = function (e, t) {
            var n = l(e),
              r = l(t),
              i = n.toRgb(),
              o = r.toRgb(),
              a = n.getBrightness(),
              s = r.getBrightness(),
              c =
                Math.max(i.r, o.r) -
                Math.min(i.r, o.r) +
                Math.max(i.g, o.g) -
                Math.min(i.g, o.g) +
                Math.max(i.b, o.b) -
                Math.min(i.b, o.b);
            return { brightness: Math.abs(a - s), color: c };
          }),
          (l.isReadable = function (e, t) {
            var n = l.readability(e, t);
            return n.brightness > 125 && n.color > 500;
          }),
          (l.mostReadable = function (e, t) {
            for (var n = null, r = 0, i = !1, o = 0; o < t.length; o++) {
              var a = l.readability(e, t[o]),
                s = a.brightness > 125 && a.color > 500,
                c = (a.brightness / 125) * 3 + a.color / 500;
              ((s && !i) || (s && i && c > r) || (!s && !i && c > r)) &&
                ((i = s), (r = c), (n = l(t[o])));
            }
            return n;
          });
        var E = (l.names = {
            aliceblue: "f0f8ff",
            antiquewhite: "faebd7",
            aqua: "0ff",
            aquamarine: "7fffd4",
            azure: "f0ffff",
            beige: "f5f5dc",
            bisque: "ffe4c4",
            black: "000",
            blanchedalmond: "ffebcd",
            blue: "00f",
            blueviolet: "8a2be2",
            brown: "a52a2a",
            burlywood: "deb887",
            burntsienna: "ea7e5d",
            cadetblue: "5f9ea0",
            chartreuse: "7fff00",
            chocolate: "d2691e",
            coral: "ff7f50",
            cornflowerblue: "6495ed",
            cornsilk: "fff8dc",
            crimson: "dc143c",
            cyan: "0ff",
            darkblue: "00008b",
            darkcyan: "008b8b",
            darkgoldenrod: "b8860b",
            darkgray: "a9a9a9",
            darkgreen: "006400",
            darkgrey: "a9a9a9",
            darkkhaki: "bdb76b",
            darkmagenta: "8b008b",
            darkolivegreen: "556b2f",
            darkorange: "ff8c00",
            darkorchid: "9932cc",
            darkred: "8b0000",
            darksalmon: "e9967a",
            darkseagreen: "8fbc8f",
            darkslateblue: "483d8b",
            darkslategray: "2f4f4f",
            darkslategrey: "2f4f4f",
            darkturquoise: "00ced1",
            darkviolet: "9400d3",
            deeppink: "ff1493",
            deepskyblue: "00bfff",
            dimgray: "696969",
            dimgrey: "696969",
            dodgerblue: "1e90ff",
            firebrick: "b22222",
            floralwhite: "fffaf0",
            forestgreen: "228b22",
            fuchsia: "f0f",
            gainsboro: "dcdcdc",
            ghostwhite: "f8f8ff",
            gold: "ffd700",
            goldenrod: "daa520",
            gray: "808080",
            green: "008000",
            greenyellow: "adff2f",
            grey: "808080",
            honeydew: "f0fff0",
            hotpink: "ff69b4",
            indianred: "cd5c5c",
            indigo: "4b0082",
            ivory: "fffff0",
            khaki: "f0e68c",
            lavender: "e6e6fa",
            lavenderblush: "fff0f5",
            lawngreen: "7cfc00",
            lemonchiffon: "fffacd",
            lightblue: "add8e6",
            lightcoral: "f08080",
            lightcyan: "e0ffff",
            lightgoldenrodyellow: "fafad2",
            lightgray: "d3d3d3",
            lightgreen: "90ee90",
            lightgrey: "d3d3d3",
            lightpink: "ffb6c1",
            lightsalmon: "ffa07a",
            lightseagreen: "20b2aa",
            lightskyblue: "87cefa",
            lightslategray: "789",
            lightslategrey: "789",
            lightsteelblue: "b0c4de",
            lightyellow: "ffffe0",
            lime: "0f0",
            limegreen: "32cd32",
            linen: "faf0e6",
            magenta: "f0f",
            maroon: "800000",
            mediumaquamarine: "66cdaa",
            mediumblue: "0000cd",
            mediumorchid: "ba55d3",
            mediumpurple: "9370db",
            mediumseagreen: "3cb371",
            mediumslateblue: "7b68ee",
            mediumspringgreen: "00fa9a",
            mediumturquoise: "48d1cc",
            mediumvioletred: "c71585",
            midnightblue: "191970",
            mintcream: "f5fffa",
            mistyrose: "ffe4e1",
            moccasin: "ffe4b5",
            navajowhite: "ffdead",
            navy: "000080",
            oldlace: "fdf5e6",
            olive: "808000",
            olivedrab: "6b8e23",
            orange: "ffa500",
            orangered: "ff4500",
            orchid: "da70d6",
            palegoldenrod: "eee8aa",
            palegreen: "98fb98",
            paleturquoise: "afeeee",
            palevioletred: "db7093",
            papayawhip: "ffefd5",
            peachpuff: "ffdab9",
            peru: "cd853f",
            pink: "ffc0cb",
            plum: "dda0dd",
            powderblue: "b0e0e6",
            purple: "800080",
            rebeccapurple: "663399",
            red: "f00",
            rosybrown: "bc8f8f",
            royalblue: "4169e1",
            saddlebrown: "8b4513",
            salmon: "fa8072",
            sandybrown: "f4a460",
            seagreen: "2e8b57",
            seashell: "fff5ee",
            sienna: "a0522d",
            silver: "c0c0c0",
            skyblue: "87ceeb",
            slateblue: "6a5acd",
            slategray: "708090",
            slategrey: "708090",
            snow: "fffafa",
            springgreen: "00ff7f",
            steelblue: "4682b4",
            tan: "d2b48c",
            teal: "008080",
            thistle: "d8bfd8",
            tomato: "ff6347",
            turquoise: "40e0d0",
            violet: "ee82ee",
            wheat: "f5deb3",
            white: "fff",
            whitesmoke: "f5f5f5",
            yellow: "ff0",
            yellowgreen: "9acd32",
          }),
          _ = (l.hexNames = (function (e) {
            var t = {};
            for (var n in e) e.hasOwnProperty(n) && (t[e[n]] = n);
            return t;
          })(E));
        function A(e) {
          return (
            (e = parseFloat(e)), (isNaN(e) || e < 0 || e > 1) && (e = 1), e
          );
        }
        function j(e, t) {
          (function (e) {
            return (
              "string" == typeof e &&
              -1 != e.indexOf(".") &&
              1 === parseFloat(e)
            );
          })(e) && (e = "100%");
          var n = (function (e) {
            return "string" == typeof e && -1 != e.indexOf("%");
          })(e);
          return (
            (e = o(t, a(0, parseFloat(e)))),
            n && (e = parseInt(e * t, 10) / 100),
            r.abs(e - t) < 1e-6 ? 1 : (e % t) / parseFloat(t)
          );
        }
        function H(e) {
          return o(1, a(0, e));
        }
        function D(e) {
          return parseInt(e, 16);
        }
        function P(e) {
          return 1 == e.length ? "0" + e : "" + e;
        }
        function O(e) {
          return e <= 1 && (e = 100 * e + "%"), e;
        }
        function R(e) {
          return D(e) / 255;
        }
        var L,
          N,
          M,
          q =
            ((N =
              "[\\s|\\(]+(" +
              (L = "(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)") +
              ")[,|\\s]+(" +
              L +
              ")[,|\\s]+(" +
              L +
              ")\\s*\\)?"),
            (M =
              "[\\s|\\(]+(" +
              L +
              ")[,|\\s]+(" +
              L +
              ")[,|\\s]+(" +
              L +
              ")[,|\\s]+(" +
              L +
              ")\\s*\\)?"),
            {
              rgb: new RegExp("rgb" + N),
              rgba: new RegExp("rgba" + M),
              hsl: new RegExp("hsl" + N),
              hsla: new RegExp("hsla" + M),
              hsv: new RegExp("hsv" + N),
              hsva: new RegExp("hsva" + M),
              hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
              hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
              hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            });
        window.tinycolor = l;
      })(),
      e(function () {
        e.fn.spectrum.load && e.fn.spectrum.processNativeColorInputs();
      });
  }),
  ($.fn.accordion = function () {
    $(this)
      .find(".Accordion")
      .each(function (e, t) {
        var n = $(t).find("> *"),
          r = n.eq(0),
          i = n.eq(1);
        r.is(".open") || i.hide(),
          r.on("click", function (e) {
            e.preventDefault(),
              i.stop(!0, !1),
              r.removeClass("open"),
              i.is(":visible") || r.addClass("open"),
              i.slideToggle(300);
          });
      });
  }),
  (function (e) {
    var t = function (t, n) {
      var r = { element: e(t), minHeight: 0, per: 0 };
      n = n || {};
      var i = this,
        o = function () {
          i.options.element.css("height", "auto"),
            "function" == typeof i.options.per || i.options.per > 0 ? s() : a();
        },
        a = function () {
          var t = 0;
          i.options.element
            .each(function () {
              e(this).is(":visible") &&
                (t = Math.max(i.options.minHeight, c(e(this)), t));
            })
            .css("height", t);
        },
        s = function () {
          for (
            var t = 0,
              n = 0,
              r =
                "function" == typeof i.options.per
                  ? i.options.per(
                      window.innerWidth || document.body.clientWidth
                    )
                  : i.options.per;
            n < i.options.element.length;
            n += r
          )
            (t = 0),
              l(n, n + r - 1)
                .each(function () {
                  t = Math.max(i.options.minHeight, c(e(this)), t);
                })
                .css("height", t);
        },
        l = function (t, n) {
          for (var r = [], o = t; o <= n; o++)
            i.options.element.get(o) && r.push(i.options.element.get(o));
          return e(r).map(function () {
            return e(this).get();
          });
        },
        c = function (e) {
          return parseFloat(e.css("height"));
        };
      (i.setPer = function (e) {
        (i.options.per = e), o();
      }),
        (i.options = e.extend({}, r, n)),
        e(window)
          .bind("load resize", function () {
            o();
          })
          .trigger("resize");
    };
    e.fn.equalHeight = function (n) {
      var r = this;
      e(function () {
        new t(r, n);
      });
    };
  })(jQuery),
  (function (e) {
    "use strict";
    "function" == typeof define && define.amd
      ? define(["jquery"], e)
      : "object" == typeof exports && "function" == typeof require
      ? e(require("jquery"))
      : e(jQuery);
  })(function (e) {
    "use strict";
    var t = {
        escapeRegExChars: function (e) {
          return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
        },
        createNode: function (e) {
          var t = document.createElement("div");
          return (
            (t.className = e),
            (t.style.position = "absolute"),
            (t.style.display = "none"),
            t
          );
        },
      },
      n = 27,
      r = 9,
      i = 13,
      o = 38,
      a = 39,
      s = 40,
      l = e.noop;
    function c(t, n) {
      var r = this;
      (r.element = t),
        (r.el = e(t)),
        (r.suggestions = []),
        (r.badQueries = []),
        (r.selectedIndex = -1),
        (r.currentValue = r.element.value),
        (r.timeoutId = null),
        (r.cachedResponse = {}),
        (r.onChangeTimeout = null),
        (r.onChange = null),
        (r.isLocal = !1),
        (r.suggestionsContainer = null),
        (r.noSuggestionsContainer = null),
        (r.options = e.extend(!0, {}, c.defaults, n)),
        (r.classes = {
          selected: "autocomplete-selected",
          suggestion: "autocomplete-suggestion",
        }),
        (r.hint = null),
        (r.hintValue = ""),
        (r.selection = null),
        r.initialize(),
        r.setOptions(n);
    }
    (c.utils = t),
      (e.Autocomplete = c),
      (c.defaults = {
        ajaxSettings: {},
        autoSelectFirst: !1,
        appendTo: "body",
        serviceUrl: null,
        lookup: null,
        onSelect: null,
        width: "auto",
        minChars: 1,
        maxHeight: 300,
        deferRequestBy: 0,
        params: {},
        formatResult: function (e, n) {
          if (!n) return e.value;
          var r = "(" + t.escapeRegExChars(n) + ")";
          return e.value
            .replace(new RegExp(r, "gi"), "<strong>$1</strong>")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/&lt;(\/?strong)&gt;/g, "<$1>");
        },
        formatGroup: function (e, t) {
          return '<div class="autocomplete-group">' + t + "</div>";
        },
        delimiter: null,
        zIndex: 9999,
        type: "GET",
        noCache: !1,
        onSearchStart: l,
        onSearchComplete: l,
        onSearchError: l,
        preserveInput: !1,
        containerClass: "autocomplete-suggestions",
        tabDisabled: !1,
        dataType: "text",
        currentRequest: null,
        triggerSelectOnValidInput: !0,
        preventBadQueries: !0,
        lookupFilter: function (e, t, n) {
          return -1 !== e.value.toLowerCase().indexOf(n);
        },
        paramName: "query",
        transformResult: function (t) {
          return "string" == typeof t ? e.parseJSON(t) : t;
        },
        showNoSuggestionNotice: !1,
        noSuggestionNotice: "No results",
        orientation: "bottom",
        forceFixPosition: !1,
      }),
      (c.prototype = {
        initialize: function () {
          var t,
            n = this,
            r = "." + n.classes.suggestion,
            i = n.classes.selected,
            o = n.options;
          n.element.setAttribute("autocomplete", "off"),
            (n.noSuggestionsContainer = e(
              '<div class="autocomplete-no-suggestion"></div>'
            )
              .html(this.options.noSuggestionNotice)
              .get(0)),
            (n.suggestionsContainer = c.utils.createNode(o.containerClass)),
            (t = e(n.suggestionsContainer)).appendTo(o.appendTo || "body"),
            "auto" !== o.width && t.css("width", o.width),
            t.on("mouseover.autocomplete", r, function () {
              n.activate(e(this).data("index"));
            }),
            t.on("mouseout.autocomplete", function () {
              (n.selectedIndex = -1), t.children("." + i).removeClass(i);
            }),
            t.on("click.autocomplete", r, function () {
              n.select(e(this).data("index"));
            }),
            t.on("click.autocomplete", function () {
              clearTimeout(n.blurTimeoutId);
            }),
            (n.fixPositionCapture = function () {
              n.visible && n.fixPosition();
            }),
            e(window).on("resize.autocomplete", n.fixPositionCapture),
            n.el.on("keydown.autocomplete", function (e) {
              n.onKeyPress(e);
            }),
            n.el.on("keyup.autocomplete", function (e) {
              n.onKeyUp(e);
            }),
            n.el.on("blur.autocomplete", function () {
              n.onBlur();
            }),
            n.el.on("focus.autocomplete", function () {
              n.onFocus();
            }),
            n.el.on("change.autocomplete", function (e) {
              n.onKeyUp(e);
            }),
            n.el.on("input.autocomplete", function (e) {
              n.onKeyUp(e);
            });
        },
        onFocus: function () {
          var e = this;
          e.fixPosition(),
            e.el.val().length >= e.options.minChars && e.onValueChange();
        },
        onBlur: function () {
          var t = this,
            n = t.options,
            r = t.el.val(),
            i = t.getQuery(r);
          t.blurTimeoutId = setTimeout(function () {
            t.hide(),
              t.selection &&
                t.currentValue !== i &&
                (n.onInvalidateSelection || e.noop).call(t.element);
          }, 200);
        },
        abortAjax: function () {
          var e = this;
          e.currentRequest &&
            (e.currentRequest.abort(), (e.currentRequest = null));
        },
        setOptions: function (t) {
          var n = this,
            r = e.extend({}, n.options, t);
          (n.isLocal = Array.isArray(r.lookup)),
            n.isLocal && (r.lookup = n.verifySuggestionsFormat(r.lookup)),
            (r.orientation = n.validateOrientation(r.orientation, "bottom")),
            e(n.suggestionsContainer).css({
              "max-height": r.maxHeight + "px",
              width: r.width + "px",
              "z-index": r.zIndex,
            }),
            (this.options = r);
        },
        clearCache: function () {
          (this.cachedResponse = {}), (this.badQueries = []);
        },
        clear: function () {
          this.clearCache(), (this.currentValue = ""), (this.suggestions = []);
        },
        disable: function () {
          var e = this;
          (e.disabled = !0), clearTimeout(e.onChangeTimeout), e.abortAjax();
        },
        enable: function () {
          this.disabled = !1;
        },
        fixPosition: function () {
          var t = this,
            n = e(t.suggestionsContainer),
            r = n.parent().get(0);
          if (r === document.body || t.options.forceFixPosition) {
            var i = t.options.orientation,
              o = n.outerHeight(),
              a = t.el.outerHeight(),
              s = t.el.offset(),
              l = { top: s.top, left: s.left };
            if ("auto" === i) {
              var c = e(window).height(),
                u = e(window).scrollTop(),
                d = -u + s.top - o,
                f = u + c - (s.top + a + o);
              i = Math.max(d, f) === d ? "top" : "bottom";
            }
            if (((l.top += "top" === i ? -o : a), r !== document.body)) {
              var p,
                h = n.css("opacity");
              t.visible || n.css("opacity", 0).show(),
                (p = n.offsetParent().offset()),
                (l.top -= p.top),
                (l.top += r.scrollTop),
                (l.left -= p.left),
                t.visible || n.css("opacity", h).hide();
            }
            "auto" === t.options.width && (l.width = t.el.outerWidth() + "px"),
              n.css(l);
          }
        },
        isCursorAtEnd: function () {
          var e,
            t = this.el.val().length,
            n = this.element.selectionStart;
          return "number" == typeof n
            ? n === t
            : !document.selection ||
                ((e = document.selection.createRange()).moveStart(
                  "character",
                  -t
                ),
                t === e.text.length);
        },
        onKeyPress: function (e) {
          var t = this;
          if (t.disabled || t.visible || e.which !== s || !t.currentValue) {
            if (!t.disabled && t.visible) {
              switch (e.which) {
                case n:
                  t.el.val(t.currentValue), t.hide();
                  break;
                case a:
                  if (t.hint && t.options.onHint && t.isCursorAtEnd()) {
                    t.selectHint();
                    break;
                  }
                  return;
                case r:
                  if (t.hint && t.options.onHint) return void t.selectHint();
                  if (-1 === t.selectedIndex) return void t.hide();
                  if ((t.select(t.selectedIndex), !1 === t.options.tabDisabled))
                    return;
                  break;
                case i:
                  if (-1 === t.selectedIndex) return void t.hide();
                  t.select(t.selectedIndex);
                  break;
                case o:
                  t.moveUp();
                  break;
                case s:
                  t.moveDown();
                  break;
                default:
                  return;
              }
              e.stopImmediatePropagation(), e.preventDefault();
            }
          } else t.suggest();
        },
        onKeyUp: function (e) {
          var t = this;
          if (!t.disabled) {
            switch (e.which) {
              case o:
              case s:
                return;
            }
            clearTimeout(t.onChangeTimeout),
              t.currentValue !== t.el.val() &&
                (t.findBestHint(),
                t.options.deferRequestBy > 0
                  ? (t.onChangeTimeout = setTimeout(function () {
                      t.onValueChange();
                    }, t.options.deferRequestBy))
                  : t.onValueChange());
          }
        },
        onValueChange: function () {
          if (this.ignoreValueChange) this.ignoreValueChange = !1;
          else {
            var t = this,
              n = t.options,
              r = t.el.val(),
              i = t.getQuery(r);
            t.selection &&
              t.currentValue !== i &&
              ((t.selection = null),
              (n.onInvalidateSelection || e.noop).call(t.element)),
              clearTimeout(t.onChangeTimeout),
              (t.currentValue = r),
              (t.selectedIndex = -1),
              n.triggerSelectOnValidInput && t.isExactMatch(i)
                ? t.select(0)
                : i.length < n.minChars
                ? t.hide()
                : t.getSuggestions(i);
          }
        },
        isExactMatch: function (e) {
          var t = this.suggestions;
          return 1 === t.length && t[0].value.toLowerCase() === e.toLowerCase();
        },
        getQuery: function (t) {
          var n,
            r = this.options.delimiter;
          return r ? ((n = t.split(r)), e.trim(n[n.length - 1])) : t;
        },
        getSuggestionsLocal: function (t) {
          var n,
            r = this.options,
            i = t.toLowerCase(),
            o = r.lookupFilter,
            a = parseInt(r.lookupLimit, 10);
          return (
            (n = {
              suggestions: e.grep(r.lookup, function (e) {
                return o(e, t, i);
              }),
            }),
            a &&
              n.suggestions.length > a &&
              (n.suggestions = n.suggestions.slice(0, a)),
            n
          );
        },
        getSuggestions: function (t) {
          var n,
            r,
            i,
            o,
            a = this,
            s = a.options,
            l = s.serviceUrl;
          (s.params[s.paramName] = t),
            !1 !== s.onSearchStart.call(a.element, s.params) &&
              ((r = s.ignoreParams ? null : s.params),
              e.isFunction(s.lookup)
                ? s.lookup(t, function (e) {
                    (a.suggestions = e.suggestions),
                      a.suggest(),
                      s.onSearchComplete.call(a.element, t, e.suggestions);
                  })
                : (a.isLocal
                    ? (n = a.getSuggestionsLocal(t))
                    : (e.isFunction(l) && (l = l.call(a.element, t)),
                      (i = l + "?" + e.param(r || {})),
                      (n = a.cachedResponse[i])),
                  n && Array.isArray(n.suggestions)
                    ? ((a.suggestions = n.suggestions),
                      a.suggest(),
                      s.onSearchComplete.call(a.element, t, n.suggestions))
                    : a.isBadQuery(t)
                    ? s.onSearchComplete.call(a.element, t, [])
                    : (a.abortAjax(),
                      (o = {
                        url: l,
                        data: r,
                        type: s.type,
                        dataType: s.dataType,
                      }),
                      e.extend(o, s.ajaxSettings),
                      (a.currentRequest = e
                        .ajax(o)
                        .done(function (e) {
                          var n;
                          (a.currentRequest = null),
                            (n = s.transformResult(e, t)),
                            a.processResponse(n, t, i),
                            s.onSearchComplete.call(
                              a.element,
                              t,
                              n.suggestions
                            );
                        })
                        .fail(function (e, n, r) {
                          s.onSearchError.call(a.element, t, e, n, r);
                        })))));
        },
        isBadQuery: function (e) {
          if (!this.options.preventBadQueries) return !1;
          for (var t = this.badQueries, n = t.length; n--; )
            if (0 === e.indexOf(t[n])) return !0;
          return !1;
        },
        hide: function () {
          var t = this,
            n = e(t.suggestionsContainer);
          e.isFunction(t.options.onHide) &&
            t.visible &&
            t.options.onHide.call(t.element, n),
            (t.visible = !1),
            (t.selectedIndex = -1),
            clearTimeout(t.onChangeTimeout),
            e(t.suggestionsContainer).hide(),
            t.signalHint(null);
        },
        suggest: function () {
          if (this.suggestions.length) {
            var t,
              n = this,
              r = n.options,
              i = r.groupBy,
              o = r.formatResult,
              a = n.getQuery(n.currentValue),
              s = n.classes.suggestion,
              l = n.classes.selected,
              c = e(n.suggestionsContainer),
              u = e(n.noSuggestionsContainer),
              d = r.beforeRender,
              f = "";
            r.triggerSelectOnValidInput && n.isExactMatch(a)
              ? n.select(0)
              : (e.each(n.suggestions, function (e, n) {
                  i &&
                    (f += (function (e) {
                      var n = e.data[i];
                      return t === n ? "" : ((t = n), r.formatGroup(e, t));
                    })(n, 0)),
                    (f +=
                      '<div class="' +
                      s +
                      '" data-index="' +
                      e +
                      '">' +
                      o(n, a, e) +
                      "</div>");
                }),
                this.adjustContainerWidth(),
                u.detach(),
                c.html(f),
                e.isFunction(d) && d.call(n.element, c, n.suggestions),
                n.fixPosition(),
                c.show(),
                r.autoSelectFirst &&
                  ((n.selectedIndex = 0),
                  c.scrollTop(0),
                  c
                    .children("." + s)
                    .first()
                    .addClass(l)),
                (n.visible = !0),
                n.findBestHint());
          } else
            this.options.showNoSuggestionNotice
              ? this.noSuggestions()
              : this.hide();
        },
        noSuggestions: function () {
          var t = this,
            n = t.options.beforeRender,
            r = e(t.suggestionsContainer),
            i = e(t.noSuggestionsContainer);
          this.adjustContainerWidth(),
            i.detach(),
            r.empty(),
            r.append(i),
            e.isFunction(n) && n.call(t.element, r, t.suggestions),
            t.fixPosition(),
            r.show(),
            (t.visible = !0);
        },
        adjustContainerWidth: function () {
          var t,
            n = this,
            r = n.options,
            i = e(n.suggestionsContainer);
          "auto" === r.width
            ? ((t = n.el.outerWidth()), i.css("width", t > 0 ? t : 300))
            : "flex" === r.width && i.css("width", "");
        },
        findBestHint: function () {
          var t = this,
            n = t.el.val().toLowerCase(),
            r = null;
          n &&
            (e.each(t.suggestions, function (e, t) {
              var i = 0 === t.value.toLowerCase().indexOf(n);
              return i && (r = t), !i;
            }),
            t.signalHint(r));
        },
        signalHint: function (t) {
          var n = "",
            r = this;
          t && (n = r.currentValue + t.value.substr(r.currentValue.length)),
            r.hintValue !== n &&
              ((r.hintValue = n),
              (r.hint = t),
              (this.options.onHint || e.noop)(n));
        },
        verifySuggestionsFormat: function (t) {
          return t.length && "string" == typeof t[0]
            ? e.map(t, function (e) {
                return { value: e, data: null };
              })
            : t;
        },
        validateOrientation: function (t, n) {
          return (
            (t = e.trim(t || "").toLowerCase()),
            -1 === e.inArray(t, ["auto", "bottom", "top"]) && (t = n),
            t
          );
        },
        processResponse: function (e, t, n) {
          var r = this,
            i = r.options;
          (e.suggestions = r.verifySuggestionsFormat(e.suggestions)),
            i.noCache ||
              ((r.cachedResponse[n] = e),
              i.preventBadQueries &&
                !e.suggestions.length &&
                r.badQueries.push(t)),
            t === r.getQuery(r.currentValue) &&
              ((r.suggestions = e.suggestions), r.suggest());
        },
        activate: function (t) {
          var n,
            r = this,
            i = r.classes.selected,
            o = e(r.suggestionsContainer),
            a = o.find("." + r.classes.suggestion);
          return (
            o.find("." + i).removeClass(i),
            (r.selectedIndex = t),
            -1 !== r.selectedIndex && a.length > r.selectedIndex
              ? ((n = a.get(r.selectedIndex)), e(n).addClass(i), n)
              : null
          );
        },
        selectHint: function () {
          var t = this,
            n = e.inArray(t.hint, t.suggestions);
          t.select(n);
        },
        select: function (e) {
          this.hide(), this.onSelect(e);
        },
        moveUp: function () {
          var t = this;
          if (-1 !== t.selectedIndex)
            return 0 === t.selectedIndex
              ? (e(t.suggestionsContainer)
                  .children("." + t.classes.suggestion)
                  .first()
                  .removeClass(t.classes.selected),
                (t.selectedIndex = -1),
                (t.ignoreValueChange = !1),
                t.el.val(t.currentValue),
                void t.findBestHint())
              : void t.adjustScroll(t.selectedIndex - 1);
        },
        moveDown: function () {
          var e = this;
          e.selectedIndex !== e.suggestions.length - 1 &&
            e.adjustScroll(e.selectedIndex + 1);
        },
        adjustScroll: function (t) {
          var n = this,
            r = n.activate(t);
          if (r) {
            var i,
              o,
              a,
              s = e(r).outerHeight();
            (i = r.offsetTop),
              (a =
                (o = e(n.suggestionsContainer).scrollTop()) +
                n.options.maxHeight -
                s),
              i < o
                ? e(n.suggestionsContainer).scrollTop(i)
                : i > a &&
                  e(n.suggestionsContainer).scrollTop(
                    i - n.options.maxHeight + s
                  ),
              n.options.preserveInput ||
                ((n.ignoreValueChange = !0),
                n.el.val(n.getValue(n.suggestions[t].value))),
              n.signalHint(null);
          }
        },
        onSelect: function (t) {
          var n = this,
            r = n.options.onSelect,
            i = n.suggestions[t];
          (n.currentValue = n.getValue(i.value)),
            n.currentValue === n.el.val() ||
              n.options.preserveInput ||
              n.el.val(n.currentValue),
            n.signalHint(null),
            (n.suggestions = []),
            (n.selection = i),
            e.isFunction(r) && r.call(n.element, i);
        },
        getValue: function (e) {
          var t,
            n,
            r = this.options.delimiter;
          return r
            ? 1 === (n = (t = this.currentValue).split(r)).length
              ? e
              : t.substr(0, t.length - n[n.length - 1].length) + e
            : e;
        },
        dispose: function () {
          var t = this;
          t.el.off(".autocomplete").removeData("autocomplete"),
            e(window).off("resize.autocomplete", t.fixPositionCapture),
            e(t.suggestionsContainer).remove();
        },
      }),
      (e.fn.devbridgeAutocomplete = function (t, n) {
        var r = "autocomplete";
        return arguments.length
          ? this.each(function () {
              var i = e(this),
                o = i.data(r);
              "string" == typeof t
                ? o && "function" == typeof o[t] && o[t](n)
                : (o && o.dispose && o.dispose(),
                  (o = new c(this, t)),
                  i.data(r, o));
            })
          : this.first().data(r);
      }),
      e.fn.autocomplete || (e.fn.autocomplete = e.fn.devbridgeAutocomplete);
  }),
  "undefined" == typeof jQuery)
)
  throw new Error("Bootstrap's JavaScript requires jQuery");
!(function () {
  "use strict";
  var e = jQuery.fn.jquery.split(" ")[0].split(".");
  if (
    (e[0] < 2 && e[1] < 9) ||
    (1 == e[0] && 9 == e[1] && e[2] < 1) ||
    e[0] > 3
  )
    throw new Error(
      "Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4"
    );
})(),
  (function (e) {
    "use strict";
    var t = '[data-toggle="dropdown"]',
      n = function (t) {
        e(t).on("click.bs.dropdown", this.toggle);
      };
    function r(t) {
      var n = t.attr("data-target");
      n ||
        (n =
          (n = t.attr("href")) &&
          /#[A-Za-z]/.test(n) &&
          n.replace(/.*(?=#[^\s]*$)/, ""));
      var r = n && e(n);
      return r && r.length ? r : t.parent();
    }
    function i(n) {
      (n && 3 === n.which) ||
        (e(".dropdown-backdrop").remove(),
        e(t).each(function () {
          var t = e(this),
            i = r(t),
            o = { relatedTarget: this };
          i.hasClass("open") &&
            ((n &&
              "click" == n.type &&
              /input|textarea/i.test(n.target.tagName) &&
              e.contains(i[0], n.target)) ||
              (i.trigger((n = e.Event("hide.bs.dropdown", o))),
              n.isDefaultPrevented() ||
                (t.attr("aria-expanded", "false"),
                i
                  .removeClass("open")
                  .trigger(e.Event("hidden.bs.dropdown", o)))));
        }));
    }
    (n.VERSION = "3.3.7"),
      (n.prototype.toggle = function (t) {
        var n = e(this);
        if (!n.is(".disabled, :disabled")) {
          var o = r(n),
            a = o.hasClass("open");
          if ((i(), !a)) {
            "ontouchstart" in document.documentElement &&
              !o.closest(".navbar-nav").length &&
              e(document.createElement("div"))
                .addClass("dropdown-backdrop")
                .insertAfter(e(this))
                .on("click", i);
            var s = { relatedTarget: this };
            if (
              (o.trigger((t = e.Event("show.bs.dropdown", s))),
              t.isDefaultPrevented())
            )
              return;
            n.trigger("focus").attr("aria-expanded", "true"),
              o.toggleClass("open").trigger(e.Event("shown.bs.dropdown", s));
          }
          return !1;
        }
      }),
      (n.prototype.keydown = function (n) {
        if (
          /(38|40|27|32)/.test(n.which) &&
          !/input|textarea/i.test(n.target.tagName)
        ) {
          var i = e(this);
          if (
            (n.preventDefault(),
            n.stopPropagation(),
            !i.is(".disabled, :disabled"))
          ) {
            var o = r(i),
              a = o.hasClass("open");
            if ((!a && 27 != n.which) || (a && 27 == n.which))
              return (
                27 == n.which && o.find(t).trigger("focus"), i.trigger("click")
              );
            var s = o.find(".dropdown-menu li:not(.disabled):visible a");
            if (s.length) {
              var l = s.index(n.target);
              38 == n.which && l > 0 && l--,
                40 == n.which && l < s.length - 1 && l++,
                ~l || (l = 0),
                s.eq(l).trigger("focus");
            }
          }
        }
      });
    var o = e.fn.dropdown;
    (e.fn.dropdown = function (t) {
      return this.each(function () {
        var r = e(this),
          i = r.data("bs.dropdown");
        i || r.data("bs.dropdown", (i = new n(this))),
          "string" == typeof t && i[t].call(r);
      });
    }),
      (e.fn.dropdown.Constructor = n),
      (e.fn.dropdown.noConflict = function () {
        return (e.fn.dropdown = o), this;
      }),
      e(document)
        .on("click.bs.dropdown.data-api", i)
        .on("click.bs.dropdown.data-api", ".dropdown form", function (e) {
          e.stopPropagation();
        })
        .on("click.bs.dropdown.data-api", t, n.prototype.toggle)
        .on("keydown.bs.dropdown.data-api", t, n.prototype.keydown)
        .on(
          "keydown.bs.dropdown.data-api",
          ".dropdown-menu",
          n.prototype.keydown
        );
  })(jQuery),
  (function (e) {
    "use strict";
    var t = function (t) {
      this.element = e(t);
    };
    function n(n) {
      return this.each(function () {
        var r = e(this),
          i = r.data("bs.tab");
        i || r.data("bs.tab", (i = new t(this))),
          "string" == typeof n && i[n]();
      });
    }
    (t.VERSION = "3.3.7"),
      (t.TRANSITION_DURATION = 150),
      (t.prototype.show = function () {
        var t = this.element,
          n = t.closest("ul:not(.dropdown-menu)"),
          r = t.data("target");
        if (
          (r || (r = (r = t.attr("href")) && r.replace(/.*(?=#[^\s]*$)/, "")),
          !t.parent("li").hasClass("active"))
        ) {
          var i = n.find(".active:last a"),
            o = e.Event("hide.bs.tab", { relatedTarget: t[0] }),
            a = e.Event("show.bs.tab", { relatedTarget: i[0] });
          if (
            (i.trigger(o),
            t.trigger(a),
            !a.isDefaultPrevented() && !o.isDefaultPrevented())
          ) {
            var s = e(r);
            this.activate(t.closest("li"), n),
              this.activate(s, s.parent(), function () {
                i.trigger({ type: "hidden.bs.tab", relatedTarget: t[0] }),
                  t.trigger({ type: "shown.bs.tab", relatedTarget: i[0] });
              });
          }
        }
      }),
      (t.prototype.activate = function (n, r, i) {
        var o = r.find("> .active"),
          a =
            i &&
            e.support.transition &&
            ((o.length && o.hasClass("fade")) || !!r.find("> .fade").length);
        function s() {
          o
            .removeClass("active")
            .find("> .dropdown-menu > .active")
            .removeClass("active")
            .end()
            .find('[data-toggle="tab"]')
            .attr("aria-expanded", !1),
            n
              .addClass("active")
              .find('[data-toggle="tab"]')
              .attr("aria-expanded", !0),
            a ? (n[0].offsetWidth, n.addClass("in")) : n.removeClass("fade"),
            n.parent(".dropdown-menu").length &&
              n
                .closest("li.dropdown")
                .addClass("active")
                .end()
                .find('[data-toggle="tab"]')
                .attr("aria-expanded", !0),
            i && i();
        }
        o.length && a
          ? o
              .one("bsTransitionEnd", s)
              .emulateTransitionEnd(t.TRANSITION_DURATION)
          : s(),
          o.removeClass("in");
      });
    var r = e.fn.tab;
    (e.fn.tab = n),
      (e.fn.tab.Constructor = t),
      (e.fn.tab.noConflict = function () {
        return (e.fn.tab = r), this;
      });
    var i = function (t) {
      t.preventDefault(), n.call(e(this), "show");
    };
    e(document)
      .on("click.bs.tab.data-api", '[data-toggle="tab"]', i)
      .on("click.bs.tab.data-api", '[data-toggle="pill"]', i);
  })(jQuery),
  (function (e) {
    e.fn.droptabs = function (t) {
      var n = e.extend(
        {
          dropdownSelector: "li.dropdown",
          dropdownMenuSelector: "ul.dropdown-menu",
          dropdownTabsSelector: "li",
          visibleTabsSelector: ">li:not(.dropdown)",
          developmentId: "dt-devInfo",
          autoArrangeTabs: !0,
          development: !1,
        },
        t
      );
      return this.each(function () {
        var t = e(this),
          r = e(n.dropdownSelector, this),
          i = e(n.dropdownMenuSelector, r),
          o = function () {
            return e(n.dropdownTabsSelector, i);
          },
          a = function () {
            return e(n.visibleTabsSelector, t);
          };
        function s() {
          var n = o().first().clone().appendTo(t).css("position", "fixed"),
            r = e(n).outerWidth();
          return e(n).remove(), r;
        }
        function l(t) {
          e("a", e(t)).on("show.bs.tab", function (t) {
            e(t.relatedTarget).parent().removeClass("active");
          });
        }
        if (n.development) {
          e("body").append(
            '<div class="alert alert-success" id="' +
              n.developmentId +
              '"></div>'
          );
          var c = e("#" + n.developmentId);
          function u(t, n) {
            var r = t.replace(/\s+/g, "-").toLowerCase();
            return (
              e("#" + r).length > 0
                ? e("#" + r).text(t + ": " + n)
                : e("#dt-devInfo").append(
                    '<div id="' + r + '">' + t + ": " + n + "</div>"
                  ),
              !0
            );
          }
          e(c)
            .css("position", "fixed")
            .css("right", "20px")
            .css("bottom", "20px");
        }
        var d = function () {
            var t = 0;
            return (
              e(a()).each(function (n) {
                t += e(this).outerWidth();
              }),
              (t += e(r).outerWidth())
            );
          },
          f = function () {
            return t.outerWidth() - d();
          },
          p = function () {
            if (
              (n.development &&
                (u("Container width", t.outerWidth()),
                u("Visible tabs width", d()),
                u("Available space", f()),
                u("First hidden", s())),
              f() < 0)
            ) {
              var l = f();
              e(a().get().reverse()).each(function (t) {
                if (
                  (e(this).hasClass("always-visible") ||
                    (e(this).prependTo(i), (l += e(this).outerWidth())),
                  l >= 0)
                )
                  return !1;
              });
            }
            if (f() > s()) {
              l = f();
              e(o()).each(function (n) {
                if (
                  ((r = e(this).clone().appendTo(t).css("position", "fixed")),
                  (i = e(r).outerWidth()),
                  e(r).remove(),
                  !(i < l) || e(this).hasClass("always-dropdown"))
                )
                  return !1;
                var r, i;
                e(this).appendTo(t), (l -= e(this).outerWidth());
              });
            }
            o().length <= 0 ? r.hide() : r.show();
          };
        if (n.autoArrangeTabs) {
          var h = [];
          e(a().get().reverse()).each(function (t) {
            e(this).hasClass("always-visible") &&
              (h.push(e(this)), e(this).remove());
          });
          for (var g = 0; g < h.length; g++) t.prepend(h[g]);
        }
        return (
          e(document).ready(function () {
            p(),
              o().each(function () {
                l(e(this));
              }),
              a().each(function () {
                l(e(this));
              });
          }),
          e(window).resize(function () {
            p();
          }),
          this
        );
      });
    };
  })(jQuery),
  (function (e, t, n, r) {
    "use strict";
    var i = n(e),
      o = n(t),
      a = n("html"),
      s = (n.fancybox = function () {
        s.open.apply(this, arguments);
      }),
      l = (s.isTouch = t.createTouch !== r || e.ontouchstart !== r),
      c = function (e) {
        return e && e.hasOwnProperty && e instanceof n;
      },
      u = function (e) {
        return e && "string" === n.type(e);
      },
      d = function (e) {
        return u(e) && e.indexOf("%") > 0;
      },
      f = function (e, t) {
        var n = parseFloat(e, 10) || 0;
        return t && d(e) && (n = (s.getViewport()[t] / 100) * n), Math.ceil(n);
      },
      p = function (e, t) {
        return f(e, t) + "px";
      },
      h =
        Date.now ||
        function () {
          return +new Date();
        },
      g = function (t) {
        return e.PointerEvent
          ? "pointer" + v(t)
          : e.MSPointerEvent
          ? "MSPointer" + v(t).charAt(0).toUpperCase() + v(t).slice(1)
          : "touch" + t;
      },
      v = function (e) {
        switch (e) {
          case "start":
            return "down";
          case "move":
            return "move";
          case "end":
            return "up";
          case "cancel":
            return "cancel";
        }
      },
      m = function (e) {
        return void 0 !== e.originalEvent.changedTouches
          ? e.originalEvent.changedTouches[0].pageX
          : e.originalEvent.x;
      },
      y = g("start"),
      b = g("move"),
      x = g("end"),
      w = g("cancel"),
      C = function (e) {
        var t = u(e) ? n(e) : e;
        if (t && t.length) {
          t.removeClass("fancybox-wrap")
            .stop(!0)
            .trigger("onReset")
            .hide()
            .unbind();
          try {
            t
              .find("iframe")
              .unbind()
              .attr("src", l ? "" : "//about:blank"),
              setTimeout(function () {
                var e, r;
                (t.empty().remove(), !s.lock || s.coming || s.current) ||
                  (n(".fancybox-margin").removeClass("fancybox-margin"),
                  (e = i.scrollTop()),
                  (r = i.scrollLeft()),
                  a.removeClass("fancybox-lock"),
                  s.lock.remove(),
                  (s.lock = null),
                  i.scrollTop(e).scrollLeft(r));
              }, 150);
          } catch (e) {}
        }
      };
    n.extend(s, {
      version: "3.0.0",
      defaults: {
        theme: "default",
        padding: 15,
        margin: [30, 55, 30, 55],
        loop: !0,
        arrows: !0,
        closeBtn: !0,
        expander: !l,
        caption: { type: "outside" },
        overlay: {
          closeClick: !0,
          speedIn: 0,
          speedOut: 250,
          showEarly: !0,
          css: {},
        },
        helpers: {},
        width: 800,
        height: 450,
        minWidth: 100,
        minHeight: 100,
        maxWidth: 99999,
        maxHeight: 99999,
        aspectRatio: !1,
        fitToView: !0,
        autoHeight: !0,
        autoWidth: !0,
        autoResize: !0,
        autoCenter: !l,
        topRatio: 0.5,
        leftRatio: 0.5,
        openEffect: "elastic",
        openSpeed: 350,
        openEasing: "easeOutQuad",
        closeEffect: "elastic",
        closeSpeed: 350,
        closeEasing: "easeOutQuad",
        nextEffect: "elastic",
        nextSpeed: 350,
        nextEasing: "easeOutQuad",
        prevEffect: "elastic",
        prevSpeed: 350,
        prevEasing: "easeOutQuad",
        autoPlay: !1,
        playSpeed: 3e3,
        onCancel: n.noop,
        beforeLoad: n.noop,
        afterLoad: n.noop,
        beforeShow: n.noop,
        afterShow: n.noop,
        beforeClose: n.noop,
        afterClose: n.noop,
        ajax: { dataType: "html", headers: { "X-fancyBox": !0 } },
        iframe: { scrolling: "auto", preload: !0 },
        swf: {
          wmode: "transparent",
          allowfullscreen: "true",
          allowscriptaccess: "always",
        },
        keys: {
          next: { 13: "left", 34: "up", 39: "left", 40: "up" },
          prev: { 8: "right", 33: "down", 37: "right", 38: "down" },
          close: [27],
          play: [32],
          toggle: [70],
        },
        direction: { next: "left", prev: "right" },
        tpl: {
          wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-inner"></div></div>',
          iframe:
            '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true"></iframe>',
          error: '<p class="fancybox-error">{{ERROR}}</p>',
          closeBtn:
            '<a title="{{CLOSE}}" class="fancybox-close" href="javascript:;"></a>',
          next: '<a title="{{NEXT}}" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
          prev: '<a title="{{PREV}}" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>',
        },
        locale: "en",
        locales: {
          en: {
            CLOSE: "Close",
            NEXT: "Next",
            PREV: "Previous",
            ERROR:
              "The requested content cannot be loaded. <br/> Please try again later.",
            EXPAND: "Display actual size",
            SHRINK: "Fit to the viewport",
            PLAY_START: "Start slideshow",
            PLAY_STOP: "Pause slideshow",
          },
          nl: {
            CLOSE: "Sluiten",
            NEXT: "Volgende",
            PREV: "Vorige",
            ERROR:
              "De opgevraagde inhoud kan niet getoond worden <br/> Probeer het later opnieuw.",
            EXPAND: "Weergeven op ware grote",
            SHRINK: "Aanpassen aan de viewport",
            PLAY_START: "Start slideshow",
            PLAY_STOP: "Pauzeer slideshow",
          },
        },
        index: 0,
        content: null,
        href: null,
        wrapCSS: "",
        modal: !1,
        locked: !0,
        preload: 3,
        mouseWheel: !0,
        scrolling: "yes",
        scrollOutside: !0,
      },
      current: null,
      coming: null,
      group: [],
      index: 0,
      isActive: !1,
      isOpen: !1,
      isOpened: !1,
      isMaximized: !1,
      player: { timer: null, isActive: !1 },
      ajaxLoad: null,
      imgPreload: null,
      helpers: {},
      open: function (e, t) {
        e &&
          !1 !== s.close(!0) &&
          (n.isPlainObject(t) || (t = {}),
          (s.opts = n.extend(!0, {}, s.defaults, t)),
          s.populate(e),
          s.group.length && s._start(s.opts.index));
      },
      populate: function (e) {
        var t = [];
        n.isArray(e) || (e = [e]),
          n.each(e, function (i, o) {
            var a,
              d,
              f,
              p,
              h,
              g = n.extend(!0, {}, s.opts);
            if (n.isPlainObject(o)) a = o;
            else if (u(o)) a = { href: o };
            else {
              if (!(c(o) || ("object" === n.type(o) && o.nodeType))) return;
              (d = n(o)),
                (a = n(d).get(0)).href || (a = { href: o }),
                (a = n.extend(
                  {
                    href: d.data("fancybox-href") || d.attr("href") || a.href,
                    title:
                      d.data("fancybox-title") || d.attr("title") || a.title,
                    type: d.data("fancybox-type"),
                    element: d,
                  },
                  d.data("fancybox-options")
                ));
            }
            a.type ||
              (!a.content && !a.href) ||
              (a.type = a.content ? "html" : s.guessType(d, a.href)),
              ("image" !== (f = a.type || s.opts.type) && "swf" !== f) ||
                ((g.autoWidth = g.autoHeight = !1), (g.scrolling = "visible")),
              "image" === f && (g.aspectRatio = !0),
              "iframe" === f &&
                ((g.autoWidth = !1), (g.scrolling = l ? "scroll" : "visible")),
              e.length < 2 && (g.margin = 30),
              (p = (a = n.extend(!0, {}, g, a)).margin),
              (h = a.padding),
              "number" === n.type(p) && (a.margin = [p, p, p, p]),
              "number" === n.type(h) && (a.padding = [h, h, h, h]),
              a.modal &&
                n.extend(!0, a, {
                  closeBtn: !1,
                  closeClick: !1,
                  nextClick: !1,
                  arrows: !1,
                  mouseWheel: !1,
                  keys: null,
                  overlay: { closeClick: !1 },
                }),
              a.autoSize !== r && (a.autoWidth = a.autoHeight = !!a.autoSize),
              "auto" === a.width && (a.autoWidth = !0),
              "auto" === a.height && (a.autoHeight = !0),
              t.push(a);
          }),
          (s.group = s.group.concat(t));
      },
      cancel: function () {
        var e = s.coming;
        e &&
          !1 !== s.trigger("onCancel") &&
          (s.hideLoading(),
          s.ajaxLoad && s.ajaxLoad.abort(),
          s.imgPreload && (s.imgPreload.onload = s.imgPreload.onerror = null),
          e.wrap && C(e.wrap),
          (s.ajaxLoad = s.imgPreload = s.coming = null),
          s.current || s._afterZoomOut(e));
      },
      close: function (e) {
        e && "object" === n.type(e) && e.preventDefault(),
          s.cancel(),
          s.isActive &&
            !s.coming &&
            !1 !== s.trigger("beforeClose") &&
            (s.unbind(),
            (s.isClosing = !0),
            s.lock && s.lock.css("overflow", "hidden"),
            s.isOpen && !0 !== e
              ? ((s.isOpen = s.isOpened = !1), s.transitions.close())
              : s._afterZoomOut());
      },
      prev: function (e) {
        var t = s.current;
        t && s.jumpto(t.index - 1, u(e) ? e : t.direction.prev);
      },
      next: function (e) {
        var t = s.current;
        t && s.jumpto(t.index + 1, u(e) ? e : t.direction.next);
      },
      jumpto: function (e, t) {
        var n = s.current;
        (s.coming && s.coming.index === e) ||
          (s.cancel(),
          n.index === e
            ? (t = null)
            : t || (t = n.direction[e > n.index ? "next" : "prev"]),
          (s.direction = t),
          s._start(e));
      },
    }),
      n.extend(s, {
        guessType: function (e, t) {
          var n =
              e && e.prop("class")
                ? e.prop("class").match(/fancybox\.(\w+)/)
                : 0,
            r = !1;
          return n
            ? n[1]
            : (u(t)
                ? t.match(
                    /(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp)((\?|#).*)?$)/i
                  )
                  ? (r = "image")
                  : t.match(/\.(swf)((\?|#).*)?$/i)
                  ? (r = "swf")
                  : "#" === t.charAt(0) && (r = "inline")
                : u(e) && (r = "html"),
              r);
        },
        trigger: function (e, t) {
          var r,
            i = t || s.coming || s.current;
          if (i) {
            if (
              (n.isFunction(i[e]) &&
                (r = i[e].apply(i, Array.prototype.slice.call(arguments, 1))),
              !1 === r || ("afterClose" === e && s.isActive))
            )
              return !1;
            i.helpers &&
              n.each(i.helpers, function (t, r) {
                var o,
                  a = s.helpers[t];
                r &&
                  a &&
                  n.isFunction(a[e]) &&
                  ((o = n.extend(!0, {}, a.defaults, r)),
                  (a.opts = o),
                  a[e](o, i));
              }),
              n.event.trigger(e);
          }
        },
        reposition: function (e, t) {
          var n,
            r = t || s.current,
            i = r && r.wrap;
          s.isOpen &&
            i &&
            ((n = s._getPosition(r)),
            !1 === e || (e && "scroll" === e.type)
              ? i.stop(!0).animate(n, 200).css("overflow", "visible")
              : i.css(n));
        },
        update: function (e) {
          var t,
            r = e && e.type,
            i = (h(), s.current);
          if (i && s.isOpen) {
            if ("scroll" === r) {
              if (s.wrap.outerHeight(!0) > s.getViewport().h) return;
              return (
                s.didUpdate && clearTimeout(s.didUpdate),
                void (s.didUpdate = setTimeout(function () {
                  s.reposition(e), (s.didUpdate = null);
                }, 50))
              );
            }
            s.lock && s.lock.css("overflow", "hidden"),
              s._setDimension(),
              s.reposition(e),
              s.lock && s.lock.css("overflow", "auto"),
              "float" === i.caption.type &&
                ((t =
                  s.getViewport().w -
                  (s.wrap.outerWidth(!0) - s.inner.width())),
                i.caption.wrap
                  .css("width", t)
                  .css("marginLeft", -1 * (0.5 * t - 0.5 * s.inner.width()))),
              i.expander &&
                (i.canShrink
                  ? n(".fancybox-expand")
                      .show()
                      .attr("title", i.locales[i.locale].SHRINK)
                  : i.canExpand
                  ? n(".fancybox-expand")
                      .show()
                      .attr("title", i.locales[i.locale].EXPAND)
                  : n(".fancybox-expand").hide()),
              s.trigger("onUpdate");
          }
        },
        toggle: function (e) {},
        hideLoading: function () {
          n("#fancybox-loading").remove();
        },
        showLoading: function () {
          var e, t;
          s.hideLoading(),
            (e = n('<div id="fancybox-loading"></div>')
              .click(s.cancel)
              .appendTo("body")),
            s.defaults.fixed ||
              ((t = s.getViewport()),
              e.css({
                position: "absolute",
                top: 0.5 * t.h + t.y,
                left: 0.5 * t.w + t.x,
              }));
        },
        getViewport: function () {
          return s.lock
            ? {
                x: s.lock.scrollLeft(),
                y: s.lock.scrollTop(),
                w: s.lock[0].clientWidth,
                h: s.lock[0].clientHeight,
              }
            : {
                x: i.scrollLeft(),
                y: i.scrollTop(),
                w: l && e.innerWidth ? e.innerWidth : i.width(),
                h: l && e.innerHeight ? e.innerHeight : i.height(),
              };
        },
        unbind: function () {
          c(s.wrap) && s.wrap.unbind(".fb"),
            c(s.inner) && s.inner.unbind(".fb"),
            o.unbind(".fb"),
            i.unbind(".fb");
        },
        rebind: function () {
          var e,
            t = s.current;
          s.unbind(),
            t &&
              s.isOpen &&
              (i.bind(
                "resize.fb" + (t.autoCenter && !t.locked ? " scroll.fb" : ""),
                s.update
              ),
              (e = t.keys) &&
                o.bind("keydown.fb", function (i) {
                  var o = i.which || i.keyCode,
                    a = i.target || i.srcElement;
                  if (27 === o && s.coming) return !1;
                  i.ctrlKey ||
                    i.altKey ||
                    i.shiftKey ||
                    i.metaKey ||
                    (a && (a.type || n(a).is("[contenteditable]"))) ||
                    n.each(e, function (e, a) {
                      return a[o] !== r
                        ? (i.preventDefault(),
                          t.group.length > 1 && s[e](a[o]),
                          !1)
                        : n.inArray(o, a) > -1
                        ? (i.preventDefault(),
                          "play" === e ? s.slideshow.toggle() : s[e](),
                          !1)
                        : void 0;
                    });
                }),
              (s.lastScroll = h()),
              t.mouseWheel &&
                s.group.length > 1 &&
                s.wrap.bind(
                  "DOMMouseScroll.fb mousewheel.fb MozMousePixelScroll.fb",
                  function (e) {
                    var t = e.originalEvent,
                      n = t.target || 0,
                      r = t.wheelDelta || t.detail || 0,
                      i = t.wheelDeltaX || 0,
                      o = t.wheelDeltaY || 0,
                      a = h();
                    (n &&
                      n.style &&
                      (!n.style.overflow || "hidden" !== n.style.overflow) &&
                      ((n.clientWidth && n.scrollWidth > n.clientWidth) ||
                        (n.clientHeight && n.scrollHeight > n.clientHeight))) ||
                      0 === r ||
                      (s.current && s.current.canShrink) ||
                      (t.stopPropagation(),
                      s.lastScroll && a - s.lastScroll < 80
                        ? (s.lastScroll = a)
                        : ((s.lastScroll = a),
                          t.axis &&
                            (t.axis === t.HORIZONTAL_AXIS
                              ? (i = -1 * r)
                              : t.axis === t.VERTICAL_AXIS && (o = -1 * r)),
                          0 === i
                            ? o > 0
                              ? s.prev("down")
                              : s.next("up")
                            : i > 0
                            ? s.prev("right")
                            : s.next("left")));
                  }
                ),
              s.touch.init());
        },
        rebuild: function () {
          var e = s.current;
          e.wrap
            .find(".fancybox-nav, .fancybox-close, .fancybox-expand")
            .remove(),
            e.arrows &&
              s.group.length > 1 &&
              ((e.loop || e.index > 0) &&
                n(s._translate(e.tpl.prev))
                  .appendTo(s.inner)
                  .bind("click.fb", s.prev),
              (e.loop || e.index < s.group.length - 1) &&
                n(s._translate(e.tpl.next))
                  .appendTo(s.inner)
                  .bind("click.fb", s.next)),
            e.closeBtn &&
              n(s._translate(e.tpl.closeBtn))
                .appendTo(s.wrap)
                .bind("click.fb", s.close),
            e.expander &&
              "image" === e.type &&
              (n(
                '<a title="Expand image" class="fancybox-expand" href="javascript:;"></a>'
              )
                .appendTo(s.inner)
                .bind("click.fb", s.toggle),
              !e.canShrink && e.canExpand);
        },
        _start: function (e) {
          var t, r;
          if (
            (s.opts.loop &&
              (e < 0 && (e = s.group.length + (e % s.group.length)),
              (e %= s.group.length)),
            !(t = s.group[e]))
          )
            return !1;
          ((t = n.extend(!0, {}, s.opts, t)).group = s.group),
            (t.index = e),
            (s.coming = t),
            !1 !== s.trigger("beforeLoad")
              ? ((s.isActive = !0),
                s._build(),
                o.bind("keydown.loading", function (e) {
                  27 === (e.which || e.keyCode) &&
                    (o.unbind(".loading"), e.preventDefault(), s.cancel());
                }),
                t.overlay && t.overlay.showEarly && s.overlay.open(t.overlay),
                "image" === (r = t.type)
                  ? s._loadImage()
                  : "ajax" === r
                  ? s._loadAjax()
                  : "iframe" === r
                  ? s._loadIframe()
                  : "inline" === r
                  ? s._loadInline()
                  : "html" === r || "swf" === r
                  ? s._afterLoad()
                  : s._error())
              : (s.coming = null);
        },
        _build: function () {
          var e,
            t,
            r,
            l = s.coming,
            c = l.caption.type;
          (l.wrap = e =
            n('<div class="fancybox-wrap"></div>')
              .appendTo(l.parent || "body")
              .addClass("fancybox-" + l.theme)),
            (l.inner = n('<div class="fancybox-inner"></div>').appendTo(e)),
            l["outside" === c || "float" === c ? "inner" : "wrap"].addClass(
              "fancybox-skin fancybox-" + l.theme + "-skin"
            ),
            l.locked &&
              l.overlay &&
              s.defaults.fixed &&
              (s.lock ||
                (s.lock = n('<div id="fancybox-lock"></div>').appendTo(
                  e.parent()
                )),
              s.lock.unbind().append(e),
              l.overlay.closeClick &&
                s.lock.click(function (e) {
                  n(e.target).is(s.lock) && s.close();
                }),
              (o.height() > i.height() || "scroll" === a.css("overflow-y")) &&
                (n("*:visible")
                  .filter(function () {
                    return (
                      "fixed" === n(this).css("position") &&
                      !n(this).hasClass("fancybox-overlay") &&
                      "fancybox-lock" !== n(this).attr("id")
                    );
                  })
                  .addClass("fancybox-margin"),
                a.addClass("fancybox-margin")),
              (t = i.scrollTop()),
              (r = i.scrollLeft()),
              a.addClass("fancybox-lock"),
              i.scrollTop(t).scrollLeft(r)),
            s.trigger("onReady");
        },
        _error: function (e) {
          s.coming &&
            (n.extend(s.coming, {
              type: "html",
              autoWidth: !0,
              autoHeight: !0,
              closeBtn: !0,
              minWidth: 0,
              minHeight: 0,
              padding: [15, 15, 15, 15],
              scrolling: "visible",
              hasError: e,
              content: s._translate(s.coming.tpl.error),
            }),
            s._afterLoad());
        },
        _loadImage: function () {
          var e = (s.imgPreload = new Image());
          (e.onload = function () {
            (this.onload = this.onerror = null),
              n.extend(s.coming, {
                width: this.width,
                height: this.height,
                content: n(this).addClass("fancybox-image"),
              }),
              s._afterLoad();
          }),
            (e.onerror = function () {
              (this.onload = this.onerror = null), s._error("image");
            }),
            (e.src = s.coming.href),
            (!0 !== e.complete || e.width < 1) && s.showLoading();
        },
        _loadAjax: function () {
          var e,
            t,
            r = s.coming,
            i = r.href;
          (e = i.split(/\s+/, 2)),
            (i = e.shift()),
            (t = e.shift()),
            s.showLoading(),
            (s.ajaxLoad = n.ajax(
              n.extend({}, r.ajax, {
                url: r.href,
                error: function (e, t) {
                  s.coming && "abort" !== t
                    ? s._error("ajax", e)
                    : s.hideLoading();
                },
                success: function (e, i) {
                  "success" === i &&
                    (t && (e = n("<div>").html(e).find(t)),
                    (r.content = e),
                    s._afterLoad());
                },
              })
            ));
        },
        _loadIframe: function () {
          var e,
            t = s.coming;
          (t.content = e =
            n(t.tpl.iframe.replace(/\{rnd\}/g, new Date().getTime())).attr(
              "scrolling",
              l ? "auto" : t.iframe.scrolling
            )),
            t.iframe.preload &&
              (s.showLoading(),
              s._setDimension(t),
              t.wrap.addClass("fancybox-tmp"),
              e.one("load.fb", function () {
                t.iframe.preload &&
                  (n(this).data("ready", 1),
                  n(this).bind("load.fb", s.update),
                  s._afterLoad());
              })),
            e.attr("src", t.href).appendTo(t.inner),
            t.iframe.preload
              ? 1 !== e.data("ready") && s.showLoading()
              : s._afterLoad();
        },
        _loadInline: function () {
          var e = s.coming,
            t = e.href;
          (e.content = n(u(t) ? t.replace(/.*(?=#[^\s]+$)/, "") : t)),
            e.content.length ? s._afterLoad() : s._error();
        },
        _preloadImages: function () {
          var e,
            t,
            n = s.group,
            r = s.current,
            i = n.length,
            o = r.preload ? Math.min(r.preload, i - 1) : 0;
          for (t = 1; t <= o; t += 1)
            (e = n[(r.index + t) % i]) &&
              "image" === e.type &&
              e.href &&
              (new Image().src = e.href);
        },
        _afterLoad: function () {
          var e = s.coming,
            t = s.current;
          if (
            (o.unbind(".loading"),
            !e || !1 === s.isActive || !1 === s.trigger("afterLoad", e, t))
          )
            return (
              s.hideLoading(),
              e && e.wrap && C(e.wrap),
              t || s._afterZoomOut(e),
              void (s.coming = null)
            );
          n.extend(s, {
            wrap: e.wrap.addClass(
              "fancybox-type-" +
                e.type +
                " fancybox-" +
                (l ? "mobile" : "desktop") +
                " fancybox-" +
                e.theme +
                "-" +
                (l ? "mobile" : "desktop") +
                " " +
                e.wrapCSS
            ),
            inner: e.inner,
            current: e,
            previous: t,
          }),
            s._prepare(),
            s.trigger("beforeShow", e, t),
            (s.isOpen = !1),
            (s.coming = null),
            s._setDimension(),
            s.hideLoading(),
            e.overlay && !s.overlay.el && s.overlay.open(e.overlay),
            s.transitions.open();
        },
        _prepare: function () {
          var e,
            t = s.current,
            r = t.content || "",
            i = t.wrap,
            o = t.inner,
            a = t.margin,
            l = t.padding,
            d = t.href,
            f = t.type,
            h = (t.scrolling, t.caption),
            g = t.title,
            v = h.type,
            m = "fancybox-placeholder",
            y = "fancybox-display";
          "iframe" !== f &&
            c(r) &&
            r.length &&
            (r.data(m) ||
              r.data(y, r.css("display")).data(
                m,
                n('<div class="' + m + '"></div>')
                  .insertAfter(r)
                  .hide()
              ),
            (r = r.show().detach()),
            t.wrap.bind("onReset", function () {
              n(this).find(r).length &&
                r
                  .css("display", r.data(y))
                  .replaceAll(r.data(m))
                  .data(m, !1)
                  .data(y, !1);
            })),
            "swf" === f &&
              ((r =
                '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' +
                d +
                '"></param>'),
              (e = ""),
              n.each(t.swf, function (t, n) {
                (r += '<param name="' + t + '" value="' + n + '"></param>'),
                  (e += " " + t + '="' + n + '"');
              }),
              (r +=
                '<embed src="' +
                d +
                '" type="application/x-shockwave-flash" width="100%" height="100%"' +
                e +
                "></embed></object>")),
            (c(r) && r.parent().is(t.inner)) ||
              (t.inner.append(r), (t.content = t.inner.children(":last"))),
            n.each(["Top", "Right", "Bottom", "Left"], function (e, t) {
              a[e] && i.css("margin" + t, p(a[e])),
                l[e] &&
                  (("Bottom" === t && "outside" === v) ||
                    i.css("padding" + t, p(l[e])),
                  ("outside" !== v && "float" !== v) ||
                    (o.css("border" + t + "Width", p(l[e])),
                    ("Top" !== t && "Left" !== t) ||
                      o.css("margin" + t, p(-1 * l[e]))));
            }),
            n.isFunction(g) && (g = g.call(t.element, t)),
            u(g) &&
              "" !== n.trim(g) &&
              !t.disableTitle &&
              ((t.caption.wrap = n(
                '<div class="fancybox-title fancybox-title-' +
                  v +
                  '-wrap">' +
                  g +
                  "</div>"
              ).appendTo(t["over" === v ? "inner" : "wrap"])),
              "float" === v &&
                t.caption.wrap
                  .width(
                    s.getViewport().w -
                      (s.wrap.outerWidth(!0) - s.inner.width())
                  )
                  .wrapInner("<div></div>"));
        },
        _setDimension: function (e) {
          var t,
            n,
            r,
            i,
            o,
            a,
            l,
            u,
            h,
            g,
            v,
            m,
            y,
            b,
            x,
            w = s.getViewport(),
            C = e || s.current,
            T = C.wrap,
            k = C.inner,
            S = C.width,
            E = C.height,
            _ = C.minWidth,
            A = C.minHeight,
            j = C.maxWidth,
            H = C.maxHeight,
            D = C.margin,
            P = C.scrollOutside ? C.scrollbarWidth : 0,
            O = ((D = C.margin), C.padding),
            R = C.scrolling,
            L = 1;
          if (
            ((t = (R = R.split(","))[0]),
            (n = R[1] || t),
            C.inner
              .css(
                "overflow-x",
                "yes" === t ? "scroll" : "no" === t ? "hidden" : t
              )
              .css(
                "overflow-y",
                "yes" === n ? "scroll" : "no" === n ? "hidden" : n
              ),
            (i = D[1] + D[3] + O[1] + O[3]),
            (r = D[0] + D[2] + O[0] + O[2]),
            (_ = f(d(_) ? f(_, "w") - i : _)),
            (j = f(d(j) ? f(j, "w") - i : j)),
            (A = f(d(A) ? f(A, "h") - r : A)),
            (H = f(d(H) ? f(H, "h") - r : H)),
            (o = f(d(S) ? f(S, "w") - i : S)),
            (a = f(d(E) ? f(E, "h") - r : E)),
            C.fitToView &&
              ((j = Math.min(j, f("100%", "w") - i)),
              (H = Math.min(H, f("100%", "h") - r))),
            (g = w.w),
            (v = w.h),
            "iframe" === C.type)
          ) {
            if (
              ((u = C.content),
              T.removeClass("fancybox-tmp"),
              (C.autoWidth || C.autoHeight) && u && 1 === u.data("ready"))
            )
              try {
                u[0].contentWindow &&
                  u[0].contentWindow.document.location &&
                  ((h = u.contents().find("body")),
                  k.addClass("fancybox-tmp"),
                  k.width(screen.width - i).height(99999),
                  P && h.css("overflow-x", "hidden"),
                  C.autoWidth && (o = h.outerWidth(!0)),
                  C.autoHeight && (a = h.outerHeight(!0)),
                  k.removeClass("fancybox-tmp"));
              } catch (e) {}
          } else
            (C.autoWidth || C.autoHeight) &&
              "image" !== C.type &&
              "swf" !== C.type &&
              (k.addClass("fancybox-tmp"),
              C.autoWidth ? k.width("auto") : k.width(j),
              C.autoHeight ? k.height("auto") : k.height(H),
              C.autoWidth && (o = k[0].scrollWidth || k.width()),
              C.autoHeight && (a = k[0].scrollHeight || k.height()),
              k.removeClass("fancybox-tmp"));
          if (((S = o), (E = a), (l = o / a), !C.autoResize))
            return (
              T.css({ width: p(S), height: "auto" }),
              void k.css({ width: p(S), height: p(E) })
            );
          if (
            (C.aspectRatio
              ? (S > j && (E = (S = j) / l),
                E > H && (S = (E = H) * l),
                S < _ && (E = (S = _) / l),
                E < A && (S = (E = A) * l))
              : ((S = Math.max(_, Math.min(S, j))),
                C.autoHeight &&
                  "iframe" !== C.type &&
                  (k.width(S), (a = E = k[0].scrollHeight)),
                (E = Math.max(A, Math.min(E, H)))),
            T.css({ width: p(S), height: "auto" }),
            k.css({ width: p(S), height: p(E) }),
            (m = f(T.outerWidth(!0))),
            (y = f(T.outerHeight(!0))),
            C.fitToView)
          )
            if (C.aspectRatio)
              for (; (m > g || y > v) && S > _ && E > A && !(L++ > 30); )
                (E = Math.max(A, Math.min(H, E - 10))),
                  (S = f(E * l)) < _ && (E = f((S = _) / l)),
                  S > j && (E = f((S = j) / l)),
                  T.css({ width: p(S) }),
                  k.css({ width: p(S), height: p(E) }),
                  (m = f(T.outerWidth(!0))),
                  (y = f(T.outerHeight(!0)));
            else
              (S = Math.max(_, Math.min(S, S - (m - g)))),
                (E = Math.max(A, Math.min(E, E - (y - v))));
          P &&
            "auto" === t &&
            (E < k[0].scrollHeight ||
              (c(C.content) &&
                C.content[0] &&
                E < C.content[0].offsetHeight)) &&
            S + i + P < j &&
            (S += P),
            T.css({ width: S }),
            k.css({ width: p(S), height: p(E) }),
            (m = f(T.outerWidth(!0))),
            (y = f(T.outerHeight(!0))),
            (b = (m > g || y > v) && S > _ && E > A),
            (x =
              (m < g || y < v) &&
              (C.aspectRatio
                ? S < j && E < H && S < o && E < a
                : (S < j || E < H) && (S < o || E < a))),
            (C.canShrink = b),
            (C.canExpand = x),
            !u && C.autoHeight && E > A && E < H && !x && k.height("auto");
        },
        _getPosition: function (e) {
          var t = e || s.current,
            n = t.wrap,
            r = s.getViewport(),
            i = r.y,
            o = r.x;
          return {
            top: p(Math.max(i, i + (r.h - n.outerHeight(!0)) * t.topRatio)),
            left: p(Math.max(o, o + (r.w - n.outerWidth(!0)) * t.leftRatio)),
            width: p(n.width()),
            height: p(n.height()),
          };
        },
        _afterZoomIn: function () {
          var e = s.current;
          e &&
            (s.lock && s.lock.css("overflow", "auto"),
            (s.isOpen = s.isOpened = !0),
            s.rebuild(),
            s.rebind(),
            e.caption &&
              e.caption.wrap &&
              e.caption.wrap
                .show()
                .css({ visibility: "visible", opacity: 0, left: 0 })
                .animate({ opacity: 1 }, "fast"),
            s.update(),
            s.wrap.css("overflow", "visible").addClass("fancybox-open").focus(),
            s[s.wrap.hasClass("fancybox-skin") ? "wrap" : "inner"].addClass(
              "fancybox-" + e.theme + "-skin-open"
            ),
            e.caption &&
              e.caption.wrap &&
              e.caption.wrap
                .show()
                .css("left", 0)
                .animate({ opacity: 1 }, "fast"),
            e.margin[2] > 0 &&
              n('<div class="fancybox-spacer"></div>')
                .css("height", p(e.margin[2] - 2))
                .appendTo(s.wrap),
            s.trigger("afterShow"),
            s._preloadImages(),
            e.autoPlay && !s.slideshow.isActive && s.slideshow.start());
        },
        _afterZoomOut: function (e) {
          var t = function () {
            C(".fancybox-wrap");
          };
          s.hideLoading(),
            (e = e || s.current) && e.wrap && e.wrap.hide(),
            n.extend(s, {
              group: [],
              opts: {},
              coming: null,
              current: null,
              isActive: !1,
              isOpened: !1,
              isOpen: !1,
              isClosing: !1,
              wrap: null,
              skin: null,
              inner: null,
            }),
            s.trigger("afterClose", e),
            s.coming ||
              s.current ||
              (e.overlay ? s.overlay.close(e.overlay, t) : t());
        },
        _translate: function (e) {
          var t = s.coming || s.current,
            n = t.locales[t.locale];
          return e.replace(/\{\{(\w+)\}\}/g, function (e, t) {
            var i = n[t];
            return i === r ? e : i;
          });
        },
      }),
      (s.transitions = {
        _getOrig: function (e) {
          var t = e || s.current,
            n = t.wrap,
            r = t.element,
            o = t.orig,
            a = s.getViewport(),
            l = {},
            u = 50,
            d = 50;
          return (
            !o &&
              r &&
              r.is(":visible") &&
              ((o = r.find("img:first:visible")).length || (o = r)),
            !o &&
              t.group[0].element &&
              (o = t.group[0].element.find("img:visible:first")),
            c(o) && o.is(":visible")
              ? ((l = o.offset()),
                o.is("img") && ((u = o.outerWidth()), (d = o.outerHeight())),
                s.lock &&
                  ((l.top -= i.scrollTop()), (l.left -= i.scrollLeft())))
              : ((l.top = a.y + (a.h - d) * t.topRatio),
                (l.left = a.x + (a.w - u) * t.leftRatio)),
            (l = {
              top: p(l.top - 0.5 * (n.outerHeight(!0) - n.height())),
              left: p(l.left - 0.5 * (n.outerWidth(!0) - n.width())),
              width: p(u),
              height: p(d),
            })
          );
        },
        _getCenter: function (e) {
          var t = e || s.current,
            n = t.wrap,
            r = s.getViewport(),
            i = r.y,
            o = r.x;
          return {
            top: p(Math.max(i, i + (r.h - n.outerHeight(!0)) * t.topRatio)),
            left: p(Math.max(o, o + (r.w - n.outerWidth(!0)) * t.leftRatio)),
            width: p(n.width()),
            height: p(n.height()),
          };
        },
        _prepare: function (e, t) {
          var n = e || s.current,
            r = n.wrap,
            i = n.inner;
          r.height(r.height()),
            i.css({
              width: (100 * i.width()) / r.width() + "%",
              height:
                Math.floor(((100 * i.height()) / r.height()) * 100) / 100 + "%",
            }),
            !0 === t &&
              r
                .find(
                  ".fancybox-title, .fancybox-spacer, .fancybox-close, .fancybox-nav"
                )
                .remove(),
            i.css("overflow", "hidden");
        },
        fade: function (e, t) {
          var r = this._getCenter(e),
            i = { opacity: 0 };
          return "open" === t || "changeIn" === t
            ? [n.extend(r, i), { opacity: 1 }]
            : [{}, i];
        },
        drop: function (e, t) {
          var r = n.extend(this._getCenter(e), { opacity: 1 }),
            i = n.extend({}, r, {
              opacity: 0,
              top: p(Math.max(s.getViewport().y - e.margin[0], f(r.top) - 200)),
            });
          return "open" === t || "changeIn" === t ? [i, r] : [{}, i];
        },
        elastic: function (e, t) {
          var r,
            i,
            o,
            a = e.wrap,
            l = e.margin,
            c = s.getViewport(),
            u = s.direction,
            d = this._getCenter(e),
            p = n.extend({}, d),
            h = n.extend({}, d);
          return (
            "open" === t
              ? (p = this._getOrig(e))
              : "close" === t
              ? ((p = {}), (h = this._getOrig(e)))
              : u &&
                ((r = "up" === u || "down" === u ? "top" : "left"),
                (i = "up" === u || "left" === u ? 200 : -200),
                "changeIn" === t
                  ? ((o = f(p[r]) + i),
                    (o =
                      "left" === u
                        ? Math.min(o, c.x + c.w - l[3] - a.outerWidth() - 1)
                        : "right" === u
                        ? Math.max(o, c.x - l[1])
                        : "up" === u
                        ? Math.min(o, c.y + c.h - l[0] - a.outerHeight() - 1)
                        : Math.max(o, c.y - l[2])),
                    (p[r] = o))
                  : ((o = f(a.css(r)) - i),
                    (p = {}),
                    (o =
                      "left" === u
                        ? Math.max(o, c.x - l[3])
                        : "right" === u
                        ? Math.min(o, c.x + c.w - l[1] - a.outerWidth() - 1)
                        : "up" === u
                        ? Math.max(o, c.y - l[0])
                        : Math.min(o, c.y + c.h - l[2] - a.outerHeight() - 1)),
                    (h[r] = o))),
            "open" === t || "changeIn" === t
              ? ((p.opacity = 0), (h.opacity = 1))
              : (h.opacity = 0),
            [p, h]
          );
        },
        open: function () {
          var e,
            t,
            r,
            i,
            o,
            a = s.current,
            l = s.previous;
          s.direction;
          l && l.wrap.stop(!0).removeClass("fancybox-opened"),
            s.isOpened
              ? ((e = a.nextEffect),
                (r = a.nextSpeed),
                (i = a.nextEasing),
                (o = "changeIn"))
              : ((e = a.openEffect),
                (r = a.openSpeed),
                (i = a.openEasing),
                (o = "open")),
            "none" === e
              ? s._afterZoomIn()
              : ((t = this[e](a, o)),
                "elastic" === e && this._prepare(a),
                a.wrap.css(t[0]),
                a.wrap.animate(t[1], r, i, s._afterZoomIn)),
            l &&
              (s.isOpened && "none" !== l.prevEffect
                ? (l.wrap.stop(!0).removeClass("fancybox-opened"),
                  (t = this[l.prevEffect](l, "changeOut")),
                  this._prepare(l, !0),
                  l.wrap.animate(t[1], l.prevSpeed, l.prevEasing, function () {
                    C(l.wrap);
                  }))
                : C(n(".fancybox-wrap").not(a.wrap)));
        },
        close: function () {
          var e,
            t = s.current,
            n = t.wrap.stop(!0).removeClass("fancybox-opened"),
            r = t.closeEffect;
          if ("none" === r) return s._afterZoomOut();
          this._prepare(t, !0),
            (e = this[r](t, "close")),
            n
              .addClass("fancybox-animating")
              .animate(e[1], t.closeSpeed, t.closeEasing, s._afterZoomOut);
        },
      }),
      (s.slideshow = {
        _clear: function () {
          this._timer && clearTimeout(this._timer);
        },
        _set: function () {
          this._clear(),
            s.current &&
              this.isActive &&
              (this._timer = setTimeout(s.next, this._speed));
        },
        _timer: null,
        _speed: null,
        isActive: !1,
        start: function (e) {
          var t = s.current;
          t &&
            (t.loop || t.index < t.group.length - 1) &&
            (this.stop(),
            (this.isActive = !0),
            (this._speed = e || t.playSpeed),
            o.bind({
              "beforeLoad.player": n.proxy(this._clear, this),
              "onUpdate.player": n.proxy(this._set, this),
              "onCancel.player beforeClose.player": n.proxy(this.stop, this),
            }),
            this._set(),
            s.trigger("onPlayStart"));
        },
        stop: function () {
          this._clear(),
            o.unbind(".player"),
            (this.isActive = !1),
            (this._timer = this._speed = null),
            s.trigger("onPlayEnd");
        },
        toggle: function () {
          this.isActive ? this.stop() : this.start.apply(this, arguments);
        },
      }),
      (s.overlay = {
        el: null,
        theme: "",
        open: function (e) {
          var t,
            r,
            o = this,
            a = this.el,
            l = s.defaults.fixed;
          (e = n.extend({}, s.defaults.overlay, e)),
            a
              ? a.stop(!0).removeAttr("style").unbind(".overlay")
              : (a = n(
                  '<div class="fancybox-overlay' +
                    (l ? " fancybox-overlay-fixed" : "") +
                    '"></div>'
                ).appendTo(e.parent || "body")),
            e.closeClick &&
              a.bind("click.overlay", function (e) {
                return (
                  (s.lastTouch && h() - s.lastTouch < 300) ||
                    (s.isActive ? s.close() : o.close()),
                  !1
                );
              }),
            (r = e.theme || (s.coming ? s.coming.theme : "default")) !==
              this.theme &&
              a.removeClass("fancybox-" + this.theme + "-overlay"),
            (this.theme = r),
            a.addClass("fancybox-" + r + "-overlay").css(e.css),
            (t = a.css("opacity")),
            !this.el &&
              t < 1 &&
              e.speedIn &&
              a
                .css({ opacity: 0, filter: "alpha(opacity=0)" })
                .fadeTo(e.speedIn, t),
            (this.el = a),
            l ||
              (i.bind("resize.overlay", n.proxy(this.update, this)),
              this.update());
        },
        close: function (e, t) {
          (e = n.extend({}, s.defaults.overlay, e)),
            this.el &&
              this.el.stop(!0).fadeOut(e.speedOut, function () {
                i.unbind("resize.overlay"),
                  n(".fancybox-overlay").remove(),
                  (s.overlay.el = null),
                  n.isFunction(t) && t();
              });
        },
        update: function () {
          this.el.css({ width: "100%", height: "100%" }),
            this.el.width(o.width()).height(o.height());
        },
      }),
      (s.touch = {
        startX: 0,
        wrapX: 0,
        dx: 0,
        isMoving: !1,
        _start: function (e) {
          s.current;
          var t = e.originalEvent.touches ? e.originalEvent.touches[0] : e,
            r = h();
          if (
            s.isOpen &&
            !s.wrap.is(":animated") &&
            (n(e.target).is(s.inner) || n(e.target).parent().is(s.inner))
          ) {
            if (s.lastTouch && r - s.lastTouch < 300)
              return (
                e.preventDefault(),
                (s.lastTouch = r),
                this._cancel(!0),
                s.toggle(),
                !1
              );
            (s.lastTouch = r),
              (s.wrap && s.wrap.outerWidth() > s.getViewport().w) ||
                (e.preventDefault(),
                t &&
                  s.wrap &&
                  ((this.startX = m(e)),
                  (this.wrapX = s.wrap.position().left),
                  (this.isMoving = !0),
                  s.inner
                    .bind(b, n.proxy(this._move, this))
                    .one(x + " " + w, n.proxy(this._cancel, this))));
          }
        },
        _move: function (e) {
          e.originalEvent.touches && e.originalEvent.touches[0];
          var t = this.startX - m(e);
          this.isMoving &&
            s.isOpen &&
            ((this.dx = t),
            s.current.wrap.outerWidth(!0) <= i.width() &&
              (Math.abs(t) >= 50
                ? (e.preventDefault(),
                  (this.last = 0),
                  this._cancel(!0),
                  t > 0 ? s.next("left") : s.prev("right"))
                : Math.abs(t) > 3 &&
                  (e.preventDefault(),
                  (this.last = 0),
                  s.wrap.css("left", this.wrapX - t))));
        },
        _clear: function () {
          (this.startX = this.wrapX = this.dx = 0), (this.isMoving = !1);
        },
        _cancel: function (e) {
          s.inner && s.inner.unbind(b),
            s.isOpen && Math.abs(this.dx) > 3 && s.reposition(!1),
            this._clear();
        },
        init: function () {
          s.inner &&
            s.touch &&
            (this._cancel(!0), s.inner.bind(y, n.proxy(this._start, this)));
        },
      }),
      n.easing.easeOutQuad ||
        (n.easing.easeOutQuad = function (e, t, n, r, i) {
          return -r * (t /= i) * (t - 2) + n;
        }),
      o.ready(function () {
        var t, o, l, c, u, d;
        n.scrollbarWidth === r &&
          (n.scrollbarWidth = function () {
            var e = n(
                '<div style="width:50px;height:50px;overflow:auto"><div/></div>'
              ).appendTo("body"),
              t = e.children(),
              r = t.innerWidth() - t.height(99).innerWidth();
            return e.remove(), r;
          }),
          n.support.fixedPosition === r &&
            (n.support.fixedPosition =
              ((u = n(
                '<div style="position:fixed;top:20px;padding:0;margin:0;border:0;"></div>'
              ).appendTo("body")),
              (d =
                "fixed" === u.css("position") &&
                ((u[0].offsetTop > 18 && u[0].offsetTop < 22) ||
                  15 === u[0].offsetTop)),
              u.remove(),
              d)),
          n.extend(s.defaults, {
            scrollbarWidth: n.scrollbarWidth(),
            fixed: n.support.fixedPosition,
            parent: n("body"),
          }),
          (l = i.scrollTop()),
          (c = i.scrollLeft()),
          (t = n(e).width()),
          a.addClass("fancybox-lock-test"),
          (o = n(e).width()),
          a.removeClass("fancybox-lock-test"),
          i.scrollTop(l).scrollLeft(c),
          (s.lockMargin = o - t),
          n(
            "<style type='text/css'>.fancybox-margin{padding-right:" +
              s.lockMargin +
              "px;}</style>"
          ).appendTo("head"),
          n("script[src*='jquery.fancybox.js']").length > 0 &&
            n("script[src*='jquery.fancybox.js']")
              .attr("src")
              .match(/autorun/) &&
            n("a[href$='.jpg'],a[href$='.png'],a[href$='.gif'],.fancybox")
              .attr("data-fancybox-group", "gallery")
              .fancybox();
      }),
      (n.fn.fancybox = function (e) {
        var t = this,
          r = !!this.length && this.selector,
          i = r && r.indexOf("()") < 0 && !(e && !1 === e.live),
          a = function (o) {
            var a = i ? n(r) : t,
              l = n(this).blur(),
              c = e.groupAttr || "data-fancybox-group",
              u = l.attr(c),
              d = n(this).data("album");
            !u && d && "nofollow" !== d && ((c = "data-album"), (u = d)),
              u &&
                ((l = a.filter("[" + c + '="' + u + '"]')),
                (e.index = l.index(this))),
              l.length && (o.preventDefault(), s.open(l.get(), e));
          };
        return (
          (e = e || {}),
          i
            ? o
                .undelegate(r, "click.fb-start")
                .delegate(
                  r + ":not('.fancybox-close,.fancybox-nav,.fancybox-wrap')",
                  "click.fb-start",
                  a
                )
            : t.unbind("click.fb-start").bind("click.fb-start", a),
          this
        );
      });
  })(window, document, jQuery),
  (function (e) {
    "use strict";
    var t = e.fancybox,
      n = function (t, n, r) {
        return (
          (r = r || ""),
          "object" === e.type(r) && (r = e.param(r, !0)),
          e.each(n, function (e, n) {
            t = t.replace("$" + e, n || "");
          }),
          r.length && (t += (t.indexOf("?") > 0 ? "&" : "?") + r),
          t
        );
      };
    t.helpers.media = {
      defaults: {
        youtube: {
          matcher:
            /(youtube\.com|youtu\.be|youtube-nocookie\.com)\/(watch\?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*)).*/i,
          params: {
            autoplay: 1,
            autohide: 1,
            fs: 1,
            rel: 0,
            hd: 1,
            wmode: "opaque",
            enablejsapi: 1,
          },
          type: "iframe",
          url: "//www.youtube.com/embed/$3",
        },
        vimeo: {
          matcher: /(?:vimeo(?:pro)?.com)\/(?:[^\d]+)?(\d+)(?:.*)/,
          params: {
            autoplay: 1,
            hd: 1,
            show_title: 1,
            show_byline: 1,
            show_portrait: 0,
            fullscreen: 1,
          },
          type: "iframe",
          url: "//player.vimeo.com/video/$1",
        },
        metacafe: {
          matcher: /metacafe.com\/(?:watch|fplayer)\/([\w\-]{1,10})/,
          params: { autoPlay: "yes" },
          type: "swf",
          url: function (t, n, r) {
            return (
              (r.swf.flashVars = "playerVars=" + e.param(n, !0)),
              "//www.metacafe.com/fplayer/" + t[1] + "/.swf"
            );
          },
        },
        dailymotion: {
          matcher: /dailymotion.com\/video\/(.*)\/?(.*)/,
          params: { additionalInfos: 0, autoStart: 1 },
          type: "swf",
          url: "//www.dailymotion.com/swf/video/$1",
        },
        twitvid: {
          matcher: /twitvid\.com\/([a-zA-Z0-9_\-\?\=]+)/i,
          params: { autoplay: 0 },
          type: "iframe",
          url: "//www.twitvid.com/embed.php?guid=$1",
        },
        twitpic: {
          matcher:
            /twitpic\.com\/(?!(?:place|photos|events)\/)([a-zA-Z0-9\?\=\-]+)/i,
          type: "image",
          url: "//twitpic.com/show/full/$1/",
        },
        instagram: {
          matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
          type: "image",
          url: "//$1/p/$2/media/?size=l",
        },
        google_maps: {
          matcher:
            /maps\.google\.([a-z]{2,3}(\.[a-z]{2})?)\/(\?ll=|maps\?)(.*)/i,
          type: "iframe",
          url: function (e) {
            return (
              "//maps.google." +
              e[1] +
              "/" +
              e[3] +
              e[4] +
              "&output=" +
              (e[4].indexOf("layer=c") > 0 ? "svembed" : "embed")
            );
          },
        },
      },
      beforeLoad: function (t, r) {
        var i,
          o,
          a,
          s,
          l = r.href || "",
          c = !1;
        for (i in t)
          if (t.hasOwnProperty(i) && ((o = t[i]), (a = l.match(o.matcher)))) {
            (c = o.type),
              (s = e.extend(
                !0,
                {},
                o.params,
                r[i] || (e.isPlainObject(t[i]) ? t[i].params : null)
              )),
              (l =
                "function" === e.type(o.url)
                  ? o.url.call(this, a, s, r)
                  : n(o.url, a, s));
            break;
          }
        c &&
          ((r.href = l),
          (r.type = c),
          (r.disableTitle = !0),
          (r.scrolling = "hidden"),
          (r.autoHeight = !1));
      },
    };
  })(jQuery),
  ($.fn.plugins = function () {
    const e = $(this);
    e.usable(),
      e.requiredRules(),
      e.reverseRules(),
      e.markDown(),
      e.ckeditors(),
      e.autocompleters(),
      e.phones(),
      e.textLimit(),
      e.codeEditors(),
      e.initializeFancybox(),
      e.currencyFormatter(),
      e.colorpicker(),
      e.decimalFormatter(),
      e.permissions(),
      e.secureText(),
      e.droptabs(),
      e.vue();
  });
