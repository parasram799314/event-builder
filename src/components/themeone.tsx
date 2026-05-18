import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Speaker {
  name: string;
  role: string;
  img: string;
}

interface ProgramItem {
  time: string;
  room: string;
  title: string;
  speaker: string;
  desc: string;
  img: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────
const speakers: Speaker[] = [
  { name: "Jenny Green", role: "UI Designer", img: "https://i.pravatar.cc/300?img=1" },
  { name: "David Yoon", role: "Creative Director", img: "https://i.pravatar.cc/300?img=3" },
  { name: "Je Mary Lee", role: "Web Specialist", img: "https://i.pravatar.cc/300?img=5" },
  { name: "Johnathan Doe", role: "Frontend Dev", img: "https://i.pravatar.cc/300?img=7" },
  { name: "Elite Hamilton", role: "Marketing Guru", img: "https://i.pravatar.cc/300?img=9" },
];

const programs: Record<string, ProgramItem[]> = {
  "FIRST DAY": [
    { time: "09.00 AM", room: "Room 240", title: "Introduction to Design", speaker: "By Jenny Green", desc: "Maecenas accumsan metus turpis, eu faucibus ligula interdum in. Mauris at tincidunt felis, vitae aliquam magna.", img: "https://i.pravatar.cc/80?img=1" },
    { time: "10.00 AM", room: "Room 360", title: "Front-End Development", speaker: "By Johnathan Mark", desc: "Mauris at tincidunt felis, vitae aliquam magna. Sed aliquam fringilla vestibulum. Praesent ullamcorper mauris.", img: "https://i.pravatar.cc/80?img=2" },
    { time: "11.00 AM", room: "Room 450", title: "Social Media Marketing", speaker: "By Johnathan Doe", desc: "Nam pulvinar, elit vitae rhoncus pretium, massa urna bibendum ex, aliquam efficitur lorem odio vitae erat.", img: "https://i.pravatar.cc/80?img=3" },
  ],
  "SECOND DAY": [
    { time: "11.00 AM", room: "Room 240", title: "Backend Development", speaker: "By Matt Lee", desc: "Integer rutrum viverra magna, nec ultrices risus rutrum nec. Pellentesque interdum vel nisi nec tincidunt.", img: "https://i.pravatar.cc/80?img=4" },
    { time: "01.00 PM", room: "Room 450", title: "Web Application Lite", speaker: "By David Orlando", desc: "Aliquam faucibus lobortis dolor, id pellentesque eros pretium in. Aenean in erat ut quam aliquet commodo.", img: "https://i.pravatar.cc/80?img=5" },
    { time: "03.00 PM", room: "Room 650", title: "Professional UX Design", speaker: "By James Lee Mark", desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.", img: "https://i.pravatar.cc/80?img=6" },
  ],
  "THIRD DAY": [
    { time: "03.00 PM", room: "Room 750", title: "Online Shopping Business", speaker: "By Michael Walker", desc: "Aliquam faucibus lobortis dolor, id pellentesque eros pretium in. Aenean in erat ut quam aliquet commodo.", img: "https://i.pravatar.cc/80?img=7" },
    { time: "05.00 PM", room: "Room 850", title: "Introduction to Mobile App", speaker: "By Cherry Stella", desc: "Nunc eu nibh vel augue mollis tincidunt id efficitur tortor. Sed pulvinar est sit amet tellus iaculis.", img: "https://i.pravatar.cc/80?img=8" },
    { time: "07.00 PM", room: "Room 750", title: "Bootstrap UI Design", speaker: "By John David", desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.", img: "https://i.pravatar.cc/80?img=9" },
  ],
};

const faqs: FaqItem[] = [
  { question: "What is Responsive Design?", answer: "Lorem ipsum dolor sit amet, maecenas eget vestibulum justo imperdiet, wisi risus purus augue vulputate voluptate neque, curabitur dolor libero sodales vitae elit massa.\n\nNunc eu nibh vel augue mollis tincidunt id efficitur tortor. Sed pulvinar est sit amet tellus iaculis hendrerit." },
  { question: "What are latest UX Developments?", answer: "Nunc eu nibh vel augue mollis tincidunt id efficitur tortor. Sed pulvinar est sit amet tellus iaculis hendrerit. Mauris justo erat, rhoncus in arcu at, scelerisque tempor erat.\n\nLorem ipsum dolor sit amet, maecenas eget vestibulum justo imperdiet." },
  { question: "What things about Social Media will be discussed?", answer: "Aenean vulputate finibus justo et feugiat. Ut turpis lacus, dapibus quis justo id, porttitor tempor justo. Quisque ut libero sapien.\n\nLorem ipsum dolor sit amet, maecenas eget vestibulum justo imperdiet, wisi risus purus augue." },
];

const sponsors = [
  "https://via.placeholder.com/200x80/cccccc/666666?text=Sponsor+1",
  "https://via.placeholder.com/200x80/cccccc/666666?text=Sponsor+2",
  "https://via.placeholder.com/200x80/cccccc/666666?text=Sponsor+3",
  "https://via.placeholder.com/200x80/cccccc/666666?text=Sponsor+4",
];

// ─── Colour tokens (matching original) ───────────────────────────────────────
const C = {
  red: "#f2545f",
  dark: "#101010",
  dark2: "#222222",
  lightBg: "#f9f9f9",
  white: "#ffffff",
  accent: "#66ccff",
  textGrey: "#707070",
  midGrey: "#808080",
  lightGrey: "#f0f0f0",
};

// ─── Global font injection ────────────────────────────────────────────────────
const injectFont = () => {
  if (document.getElementById("poppins-font")) return;
  const link = document.createElement("link");
  link.id = "poppins-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap";
  document.head.appendChild(link);

  const faLink = document.createElement("link");
  faLink.rel = "stylesheet";
  faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
  document.head.appendChild(faLink);

  const style = document.createElement("style");
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Poppins', sans-serif; background: #fff; }
    @keyframes rotatePlane {
      0%   { transform: perspective(120px) rotateX(0deg) rotateY(0deg); }
      50%  { transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg); }
      100% { transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); }
    }
    @keyframes fadeInUp  { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
    @keyframes bounceIn  { 0%,20%,40%,60%,80%,100% { animation-timing-function: cubic-bezier(0.215,.61,.355,1); } 0% { opacity:0; transform:scale3d(.3,.3,.3); } 20% { transform:scale3d(1.1,1.1,1.1); } 40% { transform:scale3d(.9,.9,.9); } 60% { opacity:1; transform:scale3d(1.03,1.03,1.03); } 80% { transform:scale3d(.97,.97,.97); } 100% { opacity:1; transform:scale3d(1,1,1); } }
    .animate-fadeInUp  { animation: fadeInUp  0.8s ease both; }
    .animate-bounceIn  { animation: bounceIn  0.8s ease both; }
    .go-top { display:none; position:fixed; bottom:2em; right:2em; background:#222; color:#fff; width:60px; height:60px; line-height:60px; text-align:center; font-size:28px; text-decoration:none; transition:background 0.4s; z-index:999; }
    .go-top:hover { background:${C.red}; color:#fff; }
    .navbar-brand-text { color:#fff; font-weight:600; font-size:2.2rem; text-decoration:none; }
    input::placeholder, textarea::placeholder { color:rgba(255,255,255,0.6); }
  `;
  document.head.appendChild(style);
};

// ─── Preloader ────────────────────────────────────────────────────────────────
const Preloader = ({ done }: { done: boolean }) => (
  <div style={{
    position: "fixed", inset: 0, background: C.white, zIndex: 99999,
    display: "flex", alignItems: "center", justifyContent: "center",
    opacity: done ? 0 : 1, pointerEvents: done ? "none" : "all",
    transition: "opacity 0.5s",
  }}>
    <div style={{
      width: 50, height: 50, background: C.dark2,
      animation: "rotatePlane 1.2s infinite ease-in-out",
    }} />
  </div>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
const NAV_LINKS = ["intro","overview","speakers","program","register","venue","sponsors","contact"];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = scrolled ? C.dark : "transparent";

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: navBg, padding: scrolled ? "0 0" : "20px 0",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 60 }}>
        <a href="#intro" className="navbar-brand-text" onClick={(e) => { e.preventDefault(); scrollTo("intro"); }}>
          New Event
        </a>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} style={{ display: "none", background: "transparent", border: "none", cursor: "pointer", padding: 8 }}
          className="nav-hamburger">
          {[0,1,2].map(i => <span key={i} style={{ display:"block", width:22, height:2, background:"#fff", margin:"4px 0" }} />)}
        </button>

        {/* Desktop links */}
        <ul style={{ display: "flex", gap: 0, listStyle: "none", flexWrap: "wrap" }}>
          {NAV_LINKS.map(id => (
            <li key={id}>
              <button onClick={() => scrollTo(id)} style={{
                background: "transparent", border: "none", color: "#ddd", fontSize: 12,
                fontWeight: 500, letterSpacing: "0.6px", textTransform: "uppercase",
                lineHeight: "40px", padding: "0 12px", cursor: "pointer",
                fontFamily: "'Poppins', sans-serif", transition: "color 0.4s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = "#ddd")}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: C.dark, padding: "8px 16px" }}>
          {NAV_LINKS.map(id => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              display: "block", width: "100%", textAlign: "left",
              background: "transparent", border: "none", color: "#ddd",
              fontSize: 12, fontWeight: 500, textTransform: "uppercase",
              padding: "10px 0", cursor: "pointer", fontFamily: "'Poppins', sans-serif",
              letterSpacing: "0.6px",
            }}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:768px) {
          .nav-hamburger { display: flex !important; flex-direction: column; }
          nav ul { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ id, style, children }: { id: string; style?: React.CSSProperties; children: React.ReactNode }) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id={id} ref={ref} data-visible={visible} style={style}>
      {children}
    </section>
  );
};

const Container = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 16px", ...style }}>{children}</div>
);

// ─── Intro ────────────────────────────────────────────────────────────────────
const Intro = () => (
  <Section id="intro" style={{
    background: `linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600') center/cover no-repeat fixed`,
    height: "100vh", display: "flex", alignItems: "center", color: C.white, textAlign: "center",
  }}>
    <Container>
      <h3 className="animate-bounceIn" style={{ fontSize: 18, fontWeight: 500, letterSpacing: 2, marginBottom: 16, animationDelay: "0.9s" }}>
        July 22 – 26 in San Francisco, CA
      </h3>
      <h1 className="animate-fadeInUp" style={{ fontSize: 40, fontWeight: 600, letterSpacing: 2, marginBottom: 42, animationDelay: "1.6s" }}>
        Web Design Conference
      </h1>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <a href="#overview" onClick={e => { e.preventDefault(); document.getElementById("overview")?.scrollIntoView({behavior:"smooth"}); }}
          style={{ ...btnBase, ...btnOutline }}>LEARN MORE</a>
        <a href="#register" onClick={e => { e.preventDefault(); document.getElementById("register")?.scrollIntoView({behavior:"smooth"}); }}
          style={{ ...btnBase, ...btnRed }}>REGISTER NOW</a>
      </div>
    </Container>
  </Section>
);

const btnBase: React.CSSProperties = {
  display: "inline-block", padding: "14px 42px", fontSize: 12, fontWeight: 600,
  letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", borderRadius: 0,
  transition: "all 0.4s ease-in-out", textDecoration: "none", border: "2px solid #fff", fontFamily: "'Poppins',sans-serif",
};
const btnOutline: React.CSSProperties = { background: "transparent", color: C.white };
const btnRed: React.CSSProperties = { background: C.red, borderColor: "transparent", color: C.white };

// ─── Overview ─────────────────────────────────────────────────────────────────
const Overview = () => (
  <Section id="overview" style={{ padding: "14rem 0", background: C.white }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
        <div className="animate-fadeInUp">
          <h3 style={{ fontSize: 20, fontWeight: 500, lineHeight: 36, paddingBottom: 12, color: C.dark2 }}>
            New Event is a fully responsive one-page template for events, conferences or workshops.
          </h3>
          <p style={{ color: C.textGrey, fontSize: 14, lineHeight: 24, marginBottom: 16 }}>
            This is a Bootstrap v3.3.6 layout that is responsive and mobile friendly. You may download and modify this template for your website.
          </p>
          <p style={{ color: C.textGrey, fontSize: 14, lineHeight: 24 }}>
            Quisque facilisis scelerisque venenatis. Nam vulputate ultricies luctus. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.
          </p>
        </div>
        <div className="animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
          <img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600" alt="Overview" style={{ width: "100%", height: "auto", display: "block" }} />
        </div>
      </div>
    </Container>
    <style>{`@media(max-width:768px){#overview > div > div{grid-template-columns:1fr !important;}}`}</style>
  </Section>
);

// ─── Detail ───────────────────────────────────────────────────────────────────
const Detail = () => {
  const items = [
    { icon: "fa-group", label: "650 Participants" },
    { icon: "fa-clock-o", label: "24 Programs" },
    { icon: "fa-microphone", label: "11 Speakers" },
  ];
  return (
    <Section id="detail" style={{ background: C.dark2, padding: "10rem 0", color: C.white, textAlign: "center" }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
          {items.map(({ icon, label }, i) => (
            <div key={i} className="animate-fadeInUp" style={{ animationDelay: `${0.3 * (i + 1)}s` }}>
              <i className={`fa ${icon}`} style={{ color: C.red, fontSize: 48, display: "block", marginBottom: 16 }} />
              <h3 style={{ fontWeight: 600, marginBottom: 12, paddingBottom: 12 }}>{label}</h3>
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 24 }}>
                Quisque ut libero sapien. Integer tellus nisl, efficitur sed dolor at, vehicula finibus massa. Sed tincidunt metus.
              </p>
            </div>
          ))}
        </div>
      </Container>
      <style>{`@media(max-width:768px){#detail > div > div{grid-template-columns:1fr !important;}}`}</style>
    </Section>
  );
};

// ─── Video ────────────────────────────────────────────────────────────────────
const VideoSection = () => (
  <Section id="video" style={{ padding: "10rem 0", background: C.white }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
        <div className="animate-fadeInUp" style={{ animationDelay: "1.3s" }}>
          <h2 style={{ fontSize: 30, fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Watch Video</h2>
          <h3 style={{ fontSize: 18, fontWeight: 500, lineHeight: 36, paddingBottom: 12, color: C.dark2 }}>
            Quisque ut libero sapien. Integer tellus nisl, efficitur sed dolor at, vehicula finibus massa.
          </h3>
          <p style={{ color: C.textGrey, fontSize: 14, lineHeight: 24 }}>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet. Dolore magna aliquam erat volutpat.
          </p>
        </div>
        <div className="animate-fadeInUp" style={{ animationDelay: "1.6s" }}>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
            <iframe
              title="Event Video"
              src="https://www.youtube.com/embed/XDPwXQjAlB0"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      </div>
    </Container>
    <style>{`@media(max-width:768px){#video > div > div{grid-template-columns:1fr !important;} #video iframe{margin-top:42px;}}`}</style>
  </Section>
);

// ─── Speakers ─────────────────────────────────────────────────────────────────
const Speakers = () => {
  const [active, setActive] = useState(0);

  return (
    <Section id="speakers" style={{ background: C.lightBg, padding: "10rem 0", textAlign: "center" }}>
      <Container>
        <div className="animate-bounceIn" style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 30, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Creative Speakers</h2>
          <p style={{ color: C.textGrey, fontSize: 14 }}>Lorem ipsum dolor sit amet, maecenas eget vestibulum justo imperdiet.</p>
        </div>

        <div style={{ display: "flex", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
          {speakers.map((sp, i) => (
            <div key={i} className="animate-fadeInUp" style={{ flex: "0 0 220px", padding: "30px 12px 20px", marginBottom: 22 }}>
              <div style={{ background: C.white, paddingBottom: 22 }}>
                <img src={sp.img} alt={sp.name} style={{ width: "100%", height: "auto", display: "block" }} />
                <div style={{ paddingTop: 12 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 0 }}>{sp.name}</h3>
                  <h6 style={{ color: "#666", fontSize: 13, marginTop: 4, fontWeight: 400 }}>{sp.role}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

// ─── Program ──────────────────────────────────────────────────────────────────
const Program = () => {
  const days = Object.keys(programs);
  const [active, setActive] = useState(days[0]);

  return (
    <Section id="program" style={{ padding: "10rem 0", background: C.white }}>
      <Container>
        <div className="animate-fadeInUp" style={{ marginBottom: 32, textAlign: "center" }}>
          <h2 style={{ fontSize: 30, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Our Programs</h2>
          <p style={{ color: C.textGrey, fontSize: 14 }}>Quisque ut libero sapien. Integer tellus nisl, efficitur sed dolor at, vehicula finibus massa.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #ddd", marginBottom: 20 }}>
          {days.map(day => (
            <button key={day} onClick={() => setActive(day)} style={{
              background: "transparent", border: "none", cursor: "pointer",
              padding: "10px 16px", fontSize: 13, fontWeight: 600,
              fontFamily: "'Poppins',sans-serif", letterSpacing: 0.5,
              color: active === day ? C.red : C.dark2,
              borderBottom: active === day ? `2px solid ${C.red}` : "2px solid transparent",
              marginBottom: -1, transition: "color 0.3s",
            }}>
              {day}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ paddingTop: 20, maxWidth: 840 }}>
          {programs[active].map((item, i) => (
            <div key={i}>
              <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <img src={item.img} alt={item.title} style={{ width: 60, height: 60, borderRadius: "50%", flexShrink: 0 }} />
                <div>
                  <h6 style={{ fontSize: 13, color: C.textGrey, marginBottom: 4 }}>
                    <span style={{ paddingRight: 12 }}>
                      <i className="fa fa-clock-o" style={{ marginRight: 4 }} />{item.time}
                    </span>
                    <span>
                      <i className="fa fa-map-marker" style={{ marginRight: 4 }} />{item.room}
                    </span>
                  </h6>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 8, marginBottom: 4 }}>{item.title}</h3>
                  <h4 style={{ color: C.midGrey, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{item.speaker}</h4>
                  <p style={{ color: C.textGrey, fontSize: 14, lineHeight: 24 }}>{item.desc}</p>
                </div>
              </div>
              {i < programs[active].length - 1 && (
                <div style={{ borderTop: `1px solid ${C.lightBg}`, margin: "32px 0 42px" }} />
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

// ─── Register ─────────────────────────────────────────────────────────────────
const Register = () => {
  const [form, setForm] = useState({ firstname: "", lastname: "", phone: "", email: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const inputStyle: React.CSSProperties = {
    display: "block", width: "100%", background: "transparent",
    border: "2px solid #fff", borderRadius: 0, color: "#fff",
    padding: "10px 14px", fontSize: 14, marginBottom: 16, height: 45,
    fontFamily: "'Poppins',sans-serif", outline: "none",
  };

  return (
    <Section id="register" style={{
      padding: "14rem 0", color: C.white,
      background: `linear-gradient(rgba(0,0,0,0.65),rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600') center/cover no-repeat fixed`,
    }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
          <div className="animate-fadeInUp">
            <h2 style={{ fontSize: 30, fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Register Here</h2>
            <h3 style={{ fontSize: 18, fontWeight: 500, lineHeight: 36, paddingBottom: 12 }}>
              Nunc eu nibh vel augue mollis tincidunt id efficitur tortor. Sed pulvinar est sit amet tellus iaculis.
            </h3>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 24 }}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet. Dolore magna aliquam erat volutpat.
            </p>
          </div>
          <div className="animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
            <input name="firstname" type="text" placeholder="First Name" value={form.firstname} onChange={handleChange} style={inputStyle} />
            <input name="lastname" type="text" placeholder="Last Name" value={form.lastname} onChange={handleChange} style={inputStyle} />
            <input name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange} style={inputStyle} />
            <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} style={inputStyle} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" style={{
                background: C.red, border: "none", borderRadius: 100, color: C.white,
                padding: "0 32px", height: 50, fontSize: 12, fontWeight: 600, letterSpacing: 2,
                cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.4s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = C.white, e.currentTarget.style.color = C.dark2)}
                onMouseLeave={e => (e.currentTarget.style.background = C.red, e.currentTarget.style.color = C.white)}>
                REGISTER
              </button>
            </div>
          </div>
        </div>
      </Container>
      <style>{`@media(max-width:768px){#register > div > div{grid-template-columns:1fr !important;}}`}</style>
    </Section>
  );
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" style={{ background: C.lightBg, padding: "8rem 0" }}>
      <Container>
        <div className="animate-bounceIn" style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
          <h2 style={{ fontSize: 30, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Do you have Questions?</h2>
          <p style={{ color: C.textGrey, fontSize: 14 }}>Lorem ipsum dolor sit amet, maecenas eget vestibulum justo imperdiet.</p>
        </div>

        <div className="animate-fadeInUp" style={{ maxWidth: 840, margin: "0 auto" }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ background: C.lightGrey, padding: "0 16px" }}>
                <button onClick={() => setOpen(open === i ? null : i)} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  width: "100%", background: "transparent", border: "none", cursor: "pointer",
                  padding: "16px 0", fontFamily: "'Poppins',sans-serif",
                  fontSize: 17, fontWeight: 500, color: "#505050", textAlign: "left",
                }}>
                  {faq.question}
                  <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0, marginLeft: 12 }}>{open === i ? "−" : "+"}</span>
                </button>
              </div>
              {open === i && (
                <div style={{ background: C.white, padding: "22px 32px" }}>
                  {faq.answer.split("\n\n").map((para, j) => (
                    <p key={j} style={{ color: C.textGrey, fontSize: 14, lineHeight: 24, marginBottom: j < 1 ? 12 : 0 }}>{para}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

// ─── Venue ────────────────────────────────────────────────────────────────────
const Venue = () => (
  <Section id="venue" style={{
    padding: "7rem 0", color: C.white,
    background: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600') center/cover no-repeat fixed`,
  }}>
    <Container>
      <div style={{ maxWidth: 480 }}>
        <div className="animate-fadeInUp">
          <h2 style={{ fontSize: 30, fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Venue</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", paddingTop: 12, paddingBottom: 18, fontSize: 14, lineHeight: 24 }}>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet. Dolore magna aliquam erat volutpat.
          </p>
          {["New Event", "120 Market Street, Suite 110", "San Francisco, CA 10110", "Tel: 010-020-0120"].map((line, i) => (
            <h4 key={i} style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{line}</h4>
          ))}
        </div>
      </div>
    </Container>
  </Section>
);

// ─── Sponsors ─────────────────────────────────────────────────────────────────
const Sponsors = () => (
  <Section id="sponsors" style={{ padding: "10rem 0", textAlign: "center", background: C.white }}>
    <Container>
      <div className="animate-bounceIn" style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 30, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Our Sponsors</h2>
        <p style={{ color: C.textGrey, fontSize: 14 }}>Lorem ipsum dolor sit amet, maecenas eget vestibulum justo imperdiet.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, alignItems: "center" }}>
        {sponsors.map((src, i) => (
          <div key={i} className="animate-fadeInUp" style={{ animationDelay: `${0.3 * i}s` }}>
            <img src={src} alt={`Sponsor ${i + 1}`} style={{ width: "100%", height: "auto", marginTop: 18 }} />
          </div>
        ))}
      </div>
    </Container>
    <style>{`@media(max-width:768px){#sponsors > div > div:last-child{grid-template-columns:repeat(2,1fr) !important;}}`}</style>
  </Section>
);

// ─── Contact ──────────────────────────────────────────────────────────────────
const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const inputStyle: React.CSSProperties = {
    display: "block", width: "100%", background: "transparent", border: "none",
    borderBottom: "1px solid #f0f0f0", borderRadius: 0, padding: "10px 0",
    fontSize: 14, marginBottom: 16, fontFamily: "'Poppins',sans-serif", outline: "none",
  };

  return (
    <Section id="contact" style={{
      padding: "10rem 0",
      background: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600') center/cover no-repeat fixed`,
    }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <div className="animate-fadeInUp" style={{ paddingTop: "3rem" }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, paddingBottom: 12, color: C.white }}>New Event</h3>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 24, marginBottom: 12 }}>
              Proin sodales convallis urna eu condimentum. Morbi tincidunt augue eros, vitae pretium mi condimentum eget.
            </p>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 24, marginBottom: 12 }}>
              Mauris at tincidunt felis, vitae aliquam magna. Sed aliquam fringilla vestibulum.
            </p>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 24, marginBottom: 32 }}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.
            </p>
            <a href="#" style={{
              display: "inline-block", background: C.red, borderRadius: 100, color: C.white,
              padding: "14px 42px", fontSize: 12, fontWeight: 600, letterSpacing: 1,
              textDecoration: "none", transition: "background 0.4s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = C.dark2)}
              onMouseLeave={e => (e.currentTarget.style.background = C.red)}>
              DOWNLOAD NOW
            </a>
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            <div style={{ background: C.white, padding: "5rem" }}>
              <h2 style={{ fontSize: 24, fontWeight: 600, textTransform: "uppercase", marginBottom: 32 }}>Keep in touch</h2>
              <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange}
                style={inputStyle} onFocus={e => (e.currentTarget.style.borderBottomColor = "#999")}
                onBlur={e => (e.currentTarget.style.borderBottomColor = "#f0f0f0")} />
              <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
                style={inputStyle} onFocus={e => (e.currentTarget.style.borderBottomColor = "#999")}
                onBlur={e => (e.currentTarget.style.borderBottomColor = "#f0f0f0")} />
              <textarea name="message" rows={5} placeholder="Message" value={form.message} onChange={handleChange}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={e => (e.currentTarget.style.borderBottomColor = "#999")}
                onBlur={e => (e.currentTarget.style.borderBottomColor = "#f0f0f0")} />
              <button type="button" style={{
                background: C.dark2, border: "none", borderRadius: 100, color: C.white,
                padding: "0 32px", height: 50, fontSize: 12, fontWeight: 600,
                letterSpacing: 2, cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                transition: "background 0.4s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = C.red)}
                onMouseLeave={e => (e.currentTarget.style.background = C.dark2)}>
                SEND
              </button>
            </div>
          </div>
        </div>
      </Container>
      <style>{`@media(max-width:768px){#contact > div > div{grid-template-columns:1fr !important;} #contact > div > div > div:last-child{margin-top:48px;}}`}</style>
    </Section>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ padding: "10rem 0", textAlign: "center", background: C.white }}>
    <Container>
      <p className="animate-fadeInUp" style={{ color: C.textGrey, fontSize: 14, marginBottom: 24 }}>
        Copyright &copy; 2024 Your Company | Design: <a href="http://www.templatemo.com" target="_blank" rel="noreferrer" style={{ color: C.red, textDecoration: "none" }}>Templatemo</a>
      </p>
      <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", justifyContent: "center", gap: 4 }}>
        {[
          { icon: "fa-facebook", delay: "1s" },
          { icon: "fa-twitter", delay: "1.3s" },
          { icon: "fa-dribbble", delay: "1.6s" },
          { icon: "fa-behance", delay: "1.9s" },
          { icon: "fa-google-plus", delay: "2s" },
        ].map(({ icon, delay }, i) => (
          <li key={i}>
            <a href="#" className={`fa ${icon} animate-fadeInUp`} style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 50, height: 50, borderRadius: "50%", color: "#666",
              fontSize: 16, textDecoration: "none", transition: "all 0.4s",
              animationDelay: delay,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C.red; e.currentTarget.style.color = C.white; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#666"; }} />
          </li>
        ))}
      </ul>
    </Container>
  </footer>
);

// ─── Root component ───────────────────────────────────────────────────────────
export default function NewEventPage() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [showGoTop, setShowGoTop] = useState(false);

  useEffect(() => {
    injectFont();
    const t = setTimeout(() => setPreloaderDone(true), 1400);
    const onScroll = () => setShowGoTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <>
      <Preloader done={preloaderDone} />
      <Navbar />
      <Intro />
      <Overview />
      <Detail />
      <VideoSection />
      <Speakers />
      <Program />
      <Register />
      <FAQ />
      <Venue />
      <Sponsors />
      <Contact />
      <Footer />

      {/* Back to top */}
      <a href="#intro" className="go-top"
        onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        style={{ display: showGoTop ? "block" : "none" }}>
        <i className="fa fa-angle-up" />
      </a>
    </>
  );
}