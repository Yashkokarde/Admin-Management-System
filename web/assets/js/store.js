(function (global) {
  const KEY = "ams.v1";

  const seed = () => ({
    org: { name: "Admin Management System", timezone: "Asia/Kolkata" },
    session: null,
    accounts: [
      { id: "u-admin", name: "Kiran", email: "kiran@gmail.com", password: "123456", mobile: "9898989898", role: "admin", course: "Java/J2EE", gender: "Male", state: "Maharashtra", status: "active" },
      { id: "u-sagar", name: "Sagar", email: "sagar@javabykiran.com", password: "123456", mobile: "999999999", role: "operator", course: "Selenium", gender: "Male", state: "Punjab", status: "active" },
      { id: "u-monica", name: "Monica", email: "monica@gmail.com", password: "123456", mobile: "1111111111", role: "operator", course: "Python", gender: "Female", state: "Maharashtra", status: "active" },
      { id: "u-kimaya", name: "Kimaya", email: "kimaya@gmail.com", password: "123456", mobile: "999999999", role: "viewer", course: "PHP", gender: "Female", state: "Punjab", status: "active" },
      { id: "u-disha", name: "Disha", email: "dishabadhe070@gmail.com", password: "123456", mobile: "9000000000", role: "admin", course: "Selenium", gender: "Female", state: "Maharashtra", status: "active" }
    ],
    operators: [
      { id: "01", person: "Kiran", for: "Urgent Technical Help", connect: "Whats App Only", contact: "9552343698", timings: "07:00 AM to 10:00 PM Monday-Sunday" },
      { id: "02", person: "Neelam", for: "Technical Discussion (Errors, Software, Technical Materials)", connect: "Whats App Phone Call SMS eMail", contact: "7066885937", timings: "09:00 AM to 06:00 PM Monday-Saturday" },
      { id: "03", person: "Akash", for: "Administration (Fees, ID Card, Certificates, WhatsApp Group, Enquiry)", connect: "Whats App Phone Call SMS eMail", contact: "8888558802", timings: "09:00 AM to 06:00 PM Monday-Saturday" },
      { id: "04", person: "Archana", for: "Enquiry (Course Details, Fees, Enquiry)", connect: "Whats App Phone Call SMS eMail", contact: "8888809416", timings: "09:00 AM to 06:00 PM Monday to Friday and Sunday" },
      { id: "05", person: "Pankaj", for: "HelpDesk", connect: "Whats App Only", contact: "1111111111", timings: "08:30 AM to 02:00 PM Saturday-Sunday" }
    ],
    links: [
      { sr: "01", content: "Schedule", href: "#schedule" },
      { sr: "02", content: "Video Lectures All Topics", href: "#videos" },
      { sr: "03", content: "Selenium Interview Questions", href: "https://www.selenium.dev/documentation/" },
      { sr: "04", content: "Java Interview Questions", href: "https://docs.oracle.com/en/java/" },
      { sr: "05", content: "Courses", href: "dashboard.html" },
      { sr: "06", content: "Placement", href: "#placement" }
    ],
    downloads: [
      { sr: "01", name: "Java Development Kit (JDK)", vendor: "Oracle", version: "1.8 / 21 LTS", bits32: "#", bits64: "#", official: "https://www.oracle.com/java/technologies/downloads/" },
      { sr: "02", name: "Selenium Server Standalone", vendor: "Selenium", version: "4.27.0", bits32: "#", bits64: "#", official: "https://www.selenium.dev/downloads/" },
      { sr: "03", name: "Selenium Java Client", vendor: "Selenium", version: "4.27.0", bits32: "#", bits64: "#", official: "https://www.selenium.dev/documentation/" },
      { sr: "04", name: "Google Chrome", vendor: "Google", version: "stable", bits32: "#", bits64: "#", official: "https://www.google.com/chrome/" },
      { sr: "05", name: "ChromeDriver", vendor: "Google", version: "matching", bits32: "#", bits64: "#", official: "https://googlechromelabs.github.io/chrome-for-testing/" },
      { sr: "06", name: "Mozilla Firefox", vendor: "Mozilla", version: "stable", bits32: "#", bits64: "#", official: "https://www.mozilla.org/firefox/" },
      { sr: "07", name: "GeckoDriver", vendor: "Mozilla", version: "0.35.0", bits32: "#", bits64: "#", official: "https://github.com/mozilla/geckodriver/releases" }
    ],
    courses: [
      { key: "selenium", title: "Selenium", subtitle: "Automation Testing", more: "Syllabus & labs for WebDriver, TestNG, and CI." },
      { key: "java", title: "Java / J2EE", subtitle: "Software Development", more: "Core Java through Spring Boot services." },
      { key: "python", title: "Python", subtitle: "Data Science", more: "Python, pandas, and test automation helpers." },
      { key: "php", title: "PHP", subtitle: "Web Development", more: "Server-side apps and admin portals." }
    ],
    tasks: [
      { id: "t1", title: "Custom Template Design", status: "doing", progress: 70, assignee: "Monica", priority: "high", due: "2026-09-04" },
      { id: "t2", title: "Update Resume bank", status: "doing", progress: 95, assignee: "Kimaya", priority: "medium", due: "2026-08-30" },
      { id: "t3", title: "Laravel Integration", status: "todo", progress: 50, assignee: "Sagar", priority: "medium", due: "2026-09-12" },
      { id: "t4", title: "Back End Framework", status: "doing", progress: 68, assignee: "Kiran", priority: "high", due: "2026-09-08" },
      { id: "t5", title: "Role audit for operators", status: "done", progress: 100, assignee: "Kiran", priority: "low", due: "2026-08-20" }
    ],
    activity: [
      { at: Date.now() - 3600e3, text: "Kiran signed in to start a session." },
      { at: Date.now() - 7200e3, text: "Frodo updated a profile phone number." },
      { at: Date.now() - 10800e3, text: "Nora joined the mailing list." },
      { at: Date.now() - 14400e3, text: "Nightly operator roster job finished in 5s." }
    ]
  });

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return seed();
      return { ...seed(), ...JSON.parse(raw) };
    } catch (e) {
      return seed();
    }
  }

  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  const db = {
    get() { return load(); },
    set(next) { save(next); return next; },
    patch(fn) {
      const s = load();
      const n = fn(s) || s;
      save(n);
      return n;
    },
    log(text) {
      return this.patch((s) => {
        s.activity.unshift({ at: Date.now(), text });
        s.activity = s.activity.slice(0, 40);
        return s;
      });
    },
    reset() {
      localStorage.removeItem(KEY);
      return seed();
    }
  };

  global.AMS = { db, seed };
})(window);
