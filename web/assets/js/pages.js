(function () {
  function qs(name) {
    return new URLSearchParams(location.search).get(name) || "";
  }

  function spark(values) {
    const max = Math.max(...values, 1);
    const w = 280, h = 72, gap = 8;
    const bw = (w - gap * (values.length - 1)) / values.length;
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="72" aria-hidden="true">
      ${values.map((v, i) => {
        const bh = (v / max) * (h - 8);
        return `<rect x="${i * (bw + gap)}" y="${h - bh}" width="${bw}" height="${bh}" rx="4" fill="${i === values.length - 1 ? "#0f7a6c" : "#c9a227"}"/>`;
      }).join("")}
    </svg>`;
  }

  const Pages = {
    dashboard() {
      const s = AMS.db.get();
      const open = s.tasks.filter((t) => t.status !== "done").length;
      const done = s.tasks.filter((t) => t.status === "done").length;
      const rate = Math.round((done / s.tasks.length) * 100);
      const courses = s.courses.map((c) =>
        `<article class="card course ${c.key}"><div><h3>${c.title}</h3><small>${c.subtitle}</small></div><span>More info →</span></article>`
      ).join("");
      UI.layout("dashboard", `
        <div class="crumb">Home / Dashboard</div>
        <h1>Dashboard</h1>
        <p class="lede">Courses offered, workforce snapshot, and live operational load.</p>
        <div class="kpis">
          <div class="kpi"><div class="label">Users</div><div class="value">${s.accounts.length}</div><div class="delta">Role-based directory</div></div>
          <div class="kpi"><div class="label">Operators</div><div class="value">${s.operators.length}</div><div class="delta">Coverage roster</div></div>
          <div class="kpi"><div class="label">Open tasks</div><div class="value">${open}</div><div class="delta">${done} completed</div></div>
          <div class="kpi"><div class="label">Completion</div><div class="value">${rate}%</div><div class="delta">Across the current board</div></div>
        </div>
        <h3>Courses Offered</h3>
        <div class="grid-courses">${courses}</div>
        <div class="grid-2">
          <div class="card">
            <h3>Weekly throughput</h3>
            ${spark([8, 11, 9, 14, 16, 12, 18])}
            <p class="muted">Tickets closed in the last seven days — used by ops to staff operators.</p>
          </div>
          <div class="card">
            <h3>Task progress</h3>
            ${s.tasks.map((t) => `<div style="margin-bottom:12px"><div class="row-between"><span>${t.title}</span><span class="muted">${t.progress}%</span></div><div class="bar"><span style="width:${t.progress}%"></span></div></div>`).join("")}
          </div>
        </div>
        <div class="card" style="margin-top:14px">
          <h3>Recent activity</h3>
          <ul class="activity">${s.activity.slice(0, 6).map((a) => `<li>${a.text}<div class="muted">${UI.fmt(a.at)}</div></li>`).join("")}</ul>
        </div>
      `);
    },

    users() {
      const s = AMS.db.get();
      const q = (qs("q") || "").toLowerCase();
      const role = qs("role");
      const rows = s.accounts.filter((u) => {
        const hay = `${u.name} ${u.email} ${u.mobile} ${u.course} ${u.state}`.toLowerCase();
        const okQ = !q || hay.includes(q);
        const okR = !role || u.role === role;
        return okQ && okR;
      });
      UI.layout("users", `
        <div class="crumb">Home / Users</div>
        <div class="row-between">
          <div><h1>Users</h1><p class="lede">Directory with roles, courses, and state. Filter, export, or add a user.</p></div>
          ${UI.can("add-user") ? `<a class="btn btn-primary btn-small" href="add_user.html" style="width:auto">Add User</a>` : ""}
        </div>
        <div class="toolbar">
          <input class="search" id="user-q" value="${q.replace(/"/g, "")}" placeholder="Search name, email, mobile…" />
          <select id="role-filter">
            <option value="">All roles</option>
            <option ${role === "admin" ? "selected" : ""}>admin</option>
            <option ${role === "operator" ? "selected" : ""}>operator</option>
            <option ${role === "viewer" ? "selected" : ""}>viewer</option>
          </select>
          <button class="btn btn-ghost btn-small" id="export-csv">Export CSV</button>
        </div>
        <div class="card table-wrap">
          <h3>User List</h3>
          <table class="data" id="user-table">
            <thead><tr><th>#</th><th>Username</th><th>Email</th><th>Mobile</th><th>Course</th><th>Gender</th><th>State</th><th>Role</th><th>Action</th></tr></thead>
            <tbody>
              ${rows.map((u, i) => `<tr>
                <td>${i + 1}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.mobile}</td>
                <td>${u.course}</td>
                <td>${u.gender}</td>
                <td>${u.state}</td>
                <td><span class="pill ${u.role}">${u.role}</span></td>
                <td>${UI.can("add-user") && UI.currentUser().id !== u.id ? `<button class="btn btn-danger btn-small" data-del="${u.id}">Delete</button>` : "—"}</td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>
      `);
      const apply = () => {
        const nq = document.getElementById("user-q").value;
        const nr = document.getElementById("role-filter").value;
        location.href = `users.html?q=${encodeURIComponent(nq)}&role=${encodeURIComponent(nr)}`;
      };
      document.getElementById("user-q").addEventListener("keydown", (e) => { if (e.key === "Enter") apply(); });
      document.getElementById("role-filter").onchange = apply;
      document.getElementById("export-csv").onclick = () => {
        const header = "Username,Email,Mobile,Course,Gender,State,Role";
        const body = rows.map((u) => [u.name, u.email, u.mobile, u.course, u.gender, u.state, u.role].join(",")).join("\n");
        const blob = new Blob([header + "\n" + body], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "users.csv";
        a.click();
      };
      document.querySelectorAll("[data-del]").forEach((btn) => {
        btn.onclick = () => {
          if (!confirm("Delete this user?")) return;
          AMS.db.patch((st) => {
            const u = st.accounts.find((x) => x.id === btn.dataset.del);
            st.accounts = st.accounts.filter((x) => x.id !== btn.dataset.del);
            st.activity.unshift({ at: Date.now(), text: `Deleted user ${u ? u.name : btn.dataset.del}.` });
            return st;
          });
          location.reload();
        };
      });
    },

    add_user() {
      if (!UI.can("add-user")) {
        location.href = "users.html";
        return;
      }
      UI.layout("users", `
        <div class="crumb">Home / Add User</div>
        <h1>Add User</h1>
        <p class="lede">Fill below details. New people land in the directory immediately.</p>
        <form class="card form-grid" id="add-form">
          <div class="field"><label>Username</label><input name="name" id="username" required></div>
          <div class="field"><label>Mobile</label><input name="mobile" id="mobile" required></div>
          <div class="field"><label>Email</label><input name="email" id="email" type="email" required></div>
          <div class="field"><label>Password</label><input name="password" id="password" type="password" required></div>
          <div class="field"><label>Courses</label>
            <select name="course" id="course">
              <option>Java/J2EE</option><option>Selenium</option><option>Python</option><option>PHP</option>
            </select>
          </div>
          <div class="field"><label>State</label>
            <select name="state" id="state">
              <option value="">--Select State--</option>
              <option>Maharashtra</option><option>Delhi</option><option>HP</option><option>Punjab</option>
            </select>
          </div>
          <div class="field"><label>Gender</label>
            <label><input type="radio" name="gender" value="Male" checked> Male</label>
            <label><input type="radio" name="gender" value="Female"> Female</label>
          </div>
          <div class="field"><label>Role</label>
            <select name="role" id="role">
              <option>viewer</option><option>operator</option><option>admin</option>
            </select>
          </div>
          <div class="full row-between">
            <button class="btn btn-primary" type="submit" style="width:auto">Submit</button>
            <a class="btn btn-ghost btn-small" href="users.html">Cancel</a>
          </div>
        </form>
      `);
      document.getElementById("add-form").onsubmit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const email = fd.get("email");
        const st = AMS.db.get();
        if (st.accounts.some((a) => a.email.toLowerCase() === String(email).toLowerCase())) {
          alert("A user with this email already exists.");
          return;
        }
        AMS.db.patch((s) => {
          s.accounts.push({
            id: "u-" + Date.now(),
            name: fd.get("name"),
            email,
            password: fd.get("password"),
            mobile: fd.get("mobile"),
            role: fd.get("role"),
            course: fd.get("course"),
            gender: fd.get("gender"),
            state: fd.get("state") || "Maharashtra",
            status: "active"
          });
          s.activity.unshift({ at: Date.now(), text: `Added user ${fd.get("name")} (${fd.get("role")}).` });
          return s;
        });
        location.href = "users.html";
      };
    },

    operators() {
      const s = AMS.db.get();
      UI.layout("operators", `
        <div class="crumb">Home / Operators</div>
        <h1>Operators</h1>
        <p class="lede">Who to call, for what, and when — the live help roster.</p>
        <div class="card table-wrap">
          <h3>Operator List</h3>
          <table class="data">
            <thead><tr><th>ID</th><th>Person</th><th>For</th><th>Preferred way to connect</th><th>Contact</th><th>Timings</th></tr></thead>
            <tbody>
              ${s.operators.map((o) => `<tr><td>${o.id}</td><td>${o.person}</td><td>${o.for}</td><td>${o.connect}</td><td>${o.contact}</td><td>${o.timings}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      `);
    },

    links() {
      const s = AMS.db.get();
      UI.layout("links", `
        <div class="crumb">Home / Useful Links</div>
        <h1>Useful Links</h1>
        <p class="lede">Internet required for external destinations.</p>
        <div class="card table-wrap">
          <table class="data">
            <thead><tr><th>Sr</th><th>Content</th><th>Click</th></tr></thead>
            <tbody>
              ${s.links.map((l) => `<tr><td>${l.sr}</td><td>${l.content}</td><td><a href="${l.href}" ${l.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>Go !</a></td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      `);
    },

    downloads() {
      const s = AMS.db.get();
      UI.layout("downloads", `
        <div class="crumb">Home / Downloads</div>
        <h1>Downloads</h1>
        <p class="lede">Tooling the operations and QA teams actually use. Official sources preferred.</p>
        <div class="card table-wrap">
          <h3>Downloads List</h3>
          <table class="data">
            <thead><tr><th>Sr</th><th>Name</th><th>Vendor</th><th>Version</th><th>32bit</th><th>64bit</th><th>Official source</th></tr></thead>
            <tbody>
              ${s.downloads.map((d) => `<tr>
                <td>${d.sr}</td><td>${d.name}</td><td>${d.vendor}</td><td>${d.version}</td>
                <td><a href="${d.bits32}">32bit</a></td>
                <td><a href="${d.bits64}">64bit</a></td>
                <td><a href="${d.official}" target="_blank" rel="noopener">Official Website</a></td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>
      `);
    },

    tasks() {
      const s = AMS.db.get();
      const cols = [
        ["todo", "To do"],
        ["doing", "In progress"],
        ["done", "Done"]
      ];
      const colHtml = cols.map(([key, label]) => `
        <div class="kanban-col" data-col="${key}">
          <h3>${label}</h3>
          ${s.tasks.filter((t) => t.status === key).map((t) => `
            <article class="task">
              <h4>${t.title}</h4>
              <div class="muted">${t.assignee} · due ${t.due}</div>
              <div class="bar" style="margin:8px 0"><span style="width:${t.progress}%"></span></div>
              <div class="row-between">
                <span class="pill ${key}">${t.priority}</span>
                ${UI.can("edit-tasks") ? `<select data-move="${t.id}">
                  <option value="todo" ${t.status === "todo" ? "selected" : ""}>To do</option>
                  <option value="doing" ${t.status === "doing" ? "selected" : ""}>In progress</option>
                  <option value="done" ${t.status === "done" ? "selected" : ""}>Done</option>
                </select>` : ""}
              </div>
            </article>`).join("")}
        </div>`).join("");

      UI.layout("tasks", `
        <div class="crumb">Home / Tasks</div>
        <div class="row-between">
          <div><h1>Task tracking</h1><p class="lede">Assign work, move status, and watch progress — the operational core.</p></div>
        </div>
        ${UI.can("edit-tasks") ? `
        <form class="card toolbar" id="new-task">
          <input name="title" placeholder="New task title" required>
          <input name="assignee" placeholder="Assignee" value="${UI.currentUser().name}">
          <input name="due" type="date" required>
          <select name="priority"><option>low</option><option selected>medium</option><option>high</option></select>
          <button class="btn btn-primary btn-small" type="submit">Add task</button>
        </form>` : ""}
        <div class="kanban">${colHtml}</div>
      `);

      document.querySelectorAll("[data-move]").forEach((sel) => {
        sel.onchange = () => {
          AMS.db.patch((st) => {
            const t = st.tasks.find((x) => x.id === sel.dataset.move);
            if (t) {
              t.status = sel.value;
              t.progress = sel.value === "done" ? 100 : sel.value === "doing" ? Math.max(t.progress, 40) : t.progress;
              st.activity.unshift({ at: Date.now(), text: `Moved task “${t.title}” to ${sel.value}.` });
            }
            return st;
          });
          location.reload();
        };
      });
      const form = document.getElementById("new-task");
      if (form) form.onsubmit = (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        AMS.db.patch((st) => {
          st.tasks.unshift({
            id: "t" + Date.now(),
            title: fd.get("title"),
            status: "todo",
            progress: 0,
            assignee: fd.get("assignee"),
            priority: fd.get("priority"),
            due: fd.get("due")
          });
          st.activity.unshift({ at: Date.now(), text: `Created task “${fd.get("title")}”.` });
          return st;
        });
        location.reload();
      };
    },

    audit() {
      const s = AMS.db.get();
      UI.layout("audit", `
        <div class="crumb">Home / Audit log</div>
        <h1>Audit log</h1>
        <p class="lede">Every sign-in, membership, deletion, and task move — a trail competitors charge extra for.</p>
        <div class="card">
          <ul class="activity">${s.activity.map((a) => `<li>${a.text}<div class="muted">${UI.fmt(a.at)}</div></li>`).join("")}</ul>
        </div>
      `);
    },

    settings() {
      const s = AMS.db.get();
      const u = UI.currentUser();
      UI.layout("settings", `
        <div class="crumb">Home / Settings</div>
        <h1>Settings</h1>
        <p class="lede">Organisation defaults and a factory reset for demos.</p>
        <form class="card form-grid" id="org-form">
          <div class="field full"><label>Organisation name</label><input name="name" value="${s.org.name}" ${u.role === "admin" ? "" : "disabled"}></div>
          <div class="field"><label>Timezone</label><input name="timezone" value="${s.org.timezone}" ${u.role === "admin" ? "" : "disabled"}></div>
          <div class="field"><label>Signed in as</label><input value="${u.email}" disabled></div>
          ${u.role === "admin" ? `<div class="full"><button class="btn btn-primary" style="width:auto">Save settings</button>
          <button type="button" class="btn btn-ghost btn-small" id="reset">Reset demo data</button></div>` : ""}
        </form>
      `);
      const form = document.getElementById("org-form");
      form.onsubmit = (e) => {
        e.preventDefault();
        if (u.role !== "admin") return;
        const fd = new FormData(form);
        AMS.db.patch((st) => {
          st.org.name = fd.get("name");
          st.org.timezone = fd.get("timezone");
          st.activity.unshift({ at: Date.now(), text: "Updated organisation settings." });
          return st;
        });
        alert("Saved.");
      };
      const reset = document.getElementById("reset");
      if (reset) reset.onclick = () => {
        if (!confirm("Reset all local demo data?")) return;
        AMS.db.reset();
        location.href = "logout.html";
      };
    }
  };

  window.Pages = Pages;
})();
