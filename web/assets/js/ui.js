(function (global) {
  const pages = {
    dashboard: "dashboard.html",
    users: "users.html",
    add_user: "add_user.html",
    operators: "operators.html",
    links: "links.html",
    downloads: "downloads.html",
    tasks: "tasks.html",
    audit: "audit.html",
    settings: "settings.html",
    logout: "logout.html"
  };

  function currentUser() {
    const s = AMS.db.get();
    if (!s.session) return null;
    return s.accounts.find((a) => a.id === s.session.userId) || null;
  }

  function requireAuth() {
    const u = currentUser();
    if (!u) {
      location.href = pages.logout;
      return null;
    }
    return u;
  }

  function can(action) {
    const u = currentUser();
    if (!u) return false;
    if (u.role === "admin") return true;
    if (u.role === "operator") return ["view", "edit-tasks", "add-user"].includes(action);
    return action === "view";
  }

  function initials(name) {
    return (name || "?").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  }

  function layout(active, inner) {
    const u = requireAuth();
    if (!u) return;
    const nav = [
      ["dashboard", "Dashboard"],
      ["users", "Users"],
      ["operators", "Operators"],
      ["tasks", "Tasks"],
      ["links", "Useful Links"],
      ["downloads", "Downloads"],
      ["audit", "Audit log"],
      ["settings", "Settings"]
    ].map(([id, label]) =>
      `<a class="${active === id ? "active" : ""}" href="${pages[id]}"><span>${label}</span></a>`
    ).join("");

    document.body.innerHTML = `
      <div class="app">
        <aside class="sidebar">
          <div class="brand-mark">
            <div class="logo-sq">A</div>
            <div><strong>AdminOS</strong><span>Management System</span></div>
          </div>
          <div class="nav-label">Main navigation</div>
          <nav class="nav">${nav}
            <a href="${pages.logout}" id="nav-logout"><span>Logout</span></a>
          </nav>
          <div class="side-user">
            <div class="avatar">${initials(u.name)}</div>
            <div>
              <strong>${u.name}</strong>
              <div class="muted"><span class="dot"></span>Online · ${u.role}</div>
            </div>
          </div>
          <footer class="site">Design for operations + Selenium V 3.0.0<br>© 2026 Admin Management System</footer>
        </aside>
        <section class="main">
          <header class="topbar">
            <input class="search" id="global-search" placeholder="Search users, tasks, operators…" />
            <div class="row-between">
              <span class="pill ${u.role}">${u.role}</span>
              <button class="btn btn-ghost btn-small" id="signout">Sign out</button>
            </div>
          </header>
          <div class="page">${inner}</div>
        </section>
      </div>`;

    document.getElementById("signout").onclick = logout;
    document.getElementById("nav-logout").onclick = (e) => { e.preventDefault(); logout(); };
    const search = document.getElementById("global-search");
    search.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = search.value.trim();
        location.href = `users.html?q=${encodeURIComponent(q)}`;
      }
    });
  }

  function logout() {
    AMS.db.patch((s) => {
      if (s.session) {
        const u = s.accounts.find((a) => a.id === s.session.userId);
        s.activity.unshift({ at: Date.now(), text: `${u ? u.name : "User"} logged out successfully.` });
      }
      s.session = null;
      return s;
    });
    sessionStorage.setItem("justLogout", "1");
    location.href = pages.logout;
  }

  function fmt(ts) {
    return new Date(ts).toLocaleString();
  }

  function login(email, password) {
    const s = AMS.db.get();
    const user = s.accounts.find((a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password && a.status === "active");
    if (!user) return { ok: false, message: "Invalid email or password." };
    AMS.db.patch((st) => {
      st.session = { userId: user.id, at: Date.now() };
      st.activity.unshift({ at: Date.now(), text: `${user.name} signed in to start a session.` });
      return st;
    });
    return { ok: true };
  }

  function register(payload) {
    const s = AMS.db.get();
    if (s.accounts.some((a) => a.email.toLowerCase() === payload.email.toLowerCase())) {
      return { ok: false, message: "Membership already exists for this email." };
    }
    const id = "u-" + Date.now();
    AMS.db.patch((st) => {
      st.accounts.push({
        id,
        name: payload.name,
        email: payload.email,
        password: payload.password,
        mobile: payload.mobile,
        role: "viewer",
        course: payload.course || "Java/J2EE",
        gender: payload.gender || "Male",
        state: payload.state || "Maharashtra",
        status: "active"
      });
      st.activity.unshift({ at: Date.now(), text: `Registered new membership: ${payload.name}.` });
      st.session = { userId: id, at: Date.now() };
      return st;
    });
    return { ok: true };
  }

  global.UI = { pages, currentUser, requireAuth, can, layout, logout, fmt, login, register, initials };
})(window);
