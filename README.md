# Admin Management System

Working admin workspace for **user roles**, **directory data**, **operator coverage**, **downloads**, and **task tracking**. The original repo only contained Selenium coverage of the JavaByKiran AdminLTE demo; this tree adds the product those tests were written against — and the features that demo never implemented.

## Run the website

```bash
python3 web/serve.py
```

Open [http://127.0.0.1:8080/](http://127.0.0.1:8080/). Login (Selenium target): [http://127.0.0.1:8080/pages/examples/logout.html](http://127.0.0.1:8080/pages/examples/logout.html).

| Role | Email | Password |
| --- | --- | --- |
| Admin | `kiran@gmail.com` | `123456` |
| Operator | `sagar@javabykiran.com` | `123456` |
| Viewer | `kimaya@gmail.com` | `123456` |
| Admin (existing test email) | `dishabadhe070@gmail.com` | `123456` |

## What was in this repository

| Area | Before | Now |
| --- | --- | --- |
| Product | README claim only | Static web app with persisted local data |
| Selenium | Hits `javabykiran.com/liveproject` | Configurable base URL; login copy and `#email` preserved |
| Features | Two login assertions | Full original module set + competitive extras |

## Competitive analysis (how the feature set was chosen)

The JavaByKiran **liveproject** is a static AdminLTE skin used for QA training. It looks like an admin product but does not save users, enforce roles, or track work. That is the gap this site closes.

| Capability | JBK liveproject | OrangeHRM demo | Retool / Appsmith | Asana / Jira | **This system** |
| --- | --- | --- | --- | --- | --- |
| Email/password login + register | Skin only | Yes | Yes | Yes | Yes, including “Sign in to start your session” |
| Dashboard KPIs / course cards | Course tiles | HR widgets | Custom | Project home | Course tiles + KPIs + weekly spark |
| User directory CRUD | Table + dead Delete | Strong | CRUD builders | Weak | Add, delete, search, role filter, CSV |
| Roles (admin / operator / viewer) | No | Yes | Yes | Yes | Enforced in the shell |
| Operator / help roster | Static table | No | Custom | No | Same roster, live navigation |
| Useful links + tooling downloads | Static | No | No | Attachments | Full lists with official sources |
| Task tracking | Sidebar fake bars | Leave/attendance | Custom | Core | Kanban, assignees, progress, audit |
| Audit / activity | Dummy feed | Partial | Paid extras | Activity | Real log of mutations |
| Export | No | Yes | Yes | Yes | Users CSV |
| Seat cost | Free demo | Cloud SKU | Per-seat | Per-seat | Runs as static files |

**Positioning:** a self-hosted **ops console** for training centres and small teams — directory + roster + board in one place — rather than a general app builder (Retool) or a standalone PM tool (Asana).

## Integrated modules

1. **Auth** — login, register membership, logout flash (“Logout successfully”).
2. **Dashboard** — users / operators / open tasks / completion, four courses, activity.
3. **Users** — original columns (username, email, mobile, course, gender, state) plus role, search, filter, export, add, delete.
4. **Add User** — original fields (username, mobile, email, courses, gender, state, password).
5. **Operators** — coverage, channel, contact, timings.
6. **Useful Links** — schedule, lectures, interview sets, courses, placement.
7. **Downloads** — JDK, Selenium, Chrome, Firefox, drivers.
8. **Tasks** — kanban, create, move, progress (README “task tracking”).
9. **Audit log** — sign-in, membership, deletes, task moves.
10. **Settings** — org name, timezone, demo reset (admin).

Data lives in `localStorage` (`ams.v1`) so the site works without a backend.

## Selenium

Tests stay under `Selenium258-main`. Set the app URL in `src/main/resources/Confic.properties`:

```
adminmngnt.browsertype = chrome
adminmngnt.baseurl = http://127.0.0.1:8080/pages/examples/logout.html
```

Login locators kept for the original cases:

- Subheading: `/html/body/div/div[2]/p[1]` → `Sign in to start your session`
- Email: `//*[@id="email"]`
