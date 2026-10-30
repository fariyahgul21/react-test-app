import { useMemo, useState, useEffect } from "react";
import mammoth from "mammoth/mammoth.browser";

/* ------------------------------------------------------------------
   Template data — add new templates to this array.
   Note: GitHub expressions are written as \${{ ... }} so JS doesn't
   treat them as template-literal interpolation.
------------------------------------------------------------------- */
const TEMPLATES = [
  {
    id: "azure-webapps-node",
    title: "Deploy React App to Azure Web App",
    provider: "Microsoft Azure",
    category: "Deployment",
    platform: "GitHub Actions",
    fileName: "azure-webapps-node.yml",
    description:
      "Build a React (Node.js) project with npm and deploy the dist output to an Azure Web App using a publish profile.",
    tags: ["React", "Node 24", "Azure App Service"],
    secrets: ["DEVOPS_DEMO_AZURE_WEBAPP_PUBLISH_PROFILE"],
    // File lives in /public/docs so Vite serves it at this URL
    docUrl: "/docs/Azure_WebApp_CICD_GitHub_Actions_Guide.docx",
    docTitle: "Azure Web App CI/CD with GitHub Actions — Guide",
    yaml: `name: Build and Deploy React App to Azure

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read

env:
  AZURE_WEBAPP_NAME: 'devopsdemo'
  NODE_VERSION: '24.x'

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build React application
        run: npm run build

      - name: Upload deployment files
        uses: actions/upload-artifact@v4
        with:
          name: react-app
          path: |
            package.json
            package-lock.json
            dist/
          include-hidden-files: true

  deploy:
    runs-on: ubuntu-latest
    needs: build

    environment:
      name: Development
      url: \${{ steps.deploy-to-webapp.outputs.webapp-url }}

    steps:
      - name: Download deployment artifact
        uses: actions/download-artifact@v4
        with:
          name: react-app
          path: .

      - name: Deploy to Azure Web App
        id: deploy-to-webapp
        uses: azure/webapps-deploy@v3
        with:
          app-name: \${{ env.AZURE_WEBAPP_NAME }}
          publish-profile: \${{ secrets.DEVOPS_DEMO_AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: .
`,
  },
];

const CATEGORY_COLORS = {
  Deployment: "#0969da",
  "Continuous integration": "#1a7f37",
  Security: "#cf222e",
  Automation: "#8250df",
};

/* Generic cloud icon (provider-neutral) */
function CloudIcon({ color = "#0969da" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 18h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.4 9.2 4.5 4.5 0 0 0 7 18Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TemplateCard({ template, onConfigure, onOpenDoc }) {
  const dot = CATEGORY_COLORS[template.category] || "#6e7781";
  return (
    <article className="tl-card">
      <div className="tl-card-head">
        <div>
          <h3 className="tl-card-title">{template.title}</h3>
          <p className="tl-card-by">By {template.provider}</p>
        </div>
        <span className="tl-card-icon">
          <CloudIcon color={dot} />
        </span>
      </div>
      <p className="tl-card-desc">{template.description}</p>
      <div className="tl-card-foot">
        <button className="tl-btn" onClick={() => onConfigure(template)}>
          Configure
        </button>
        {template.docUrl ? (
          <button className="tl-cat tl-doc-link" onClick={() => onOpenDoc(template)}>
            Documentation
            <span className="tl-dot" style={{ background: dot }} />
          </button>
        ) : (
          <span className="tl-cat">
            Documentation
            <span className="tl-dot" style={{ background: "#8c959f" }} />
          </span>
        )}
      </div>
    </article>
  );
}

function TemplateDrawer({ template, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(template.yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const download = () => {
    const blob = new Blob([template.yaml], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = template.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tl-overlay" onClick={onClose}>
      <aside
        className="tl-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={template.title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="tl-drawer-head">
          <div>
            <h2>{template.title}</h2>
            <p className="tl-card-by">
              By {template.provider} · {template.platform}
            </p>
          </div>
          <button className="tl-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <p className="tl-card-desc">{template.description}</p>

        <div className="tl-tags">
          {template.tags.map((t) => (
            <span key={t} className="tl-tag">{t}</span>
          ))}
        </div>

        {template.secrets?.length > 0 && (
          <div className="tl-note">
            <strong>Required repository secrets</strong>
            <ul>
              {template.secrets.map((s) => (
                <li key={s}><code>{s}</code></li>
              ))}
            </ul>
            <p>
              Save this file as <code>.github/workflows/{template.fileName}</code> in your repo.
            </p>
          </div>
        )}

        <div className="tl-code-bar">
          <span>{template.fileName}</span>
          <div className="tl-code-actions">
            <button className="tl-btn" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
            <button className="tl-btn tl-btn-primary" onClick={download}>Download</button>
          </div>
        </div>
        <pre className="tl-code"><code>{template.yaml}</code></pre>
      </aside>
    </div>
  );
}

function DocViewer({ template, onClose }) {
  const [html, setHtml] = useState("");
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(template.docUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arrayBuffer = await res.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        if (!cancelled) {
          setHtml(result.value);
          setStatus("ready");
        }
      } catch (err) {
        console.error("Could not load document:", err);
        if (!cancelled) setStatus("error");
      }
    })();
    return () => { cancelled = true; };
  }, [template.docUrl]);

  return (
    <div className="tl-overlay" onClick={onClose}>
      <aside
        className="tl-drawer tl-drawer-wide"
        role="dialog"
        aria-modal="true"
        aria-label={template.docTitle || template.title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="tl-drawer-head">
          <div>
            <h2>{template.docTitle || template.title}</h2>
            <p className="tl-card-by">Documentation · {template.provider}</p>
          </div>
          <div className="tl-code-actions">
            <a className="tl-btn" href={template.docUrl} download>Download .docx</a>
            <button className="tl-close" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </header>

        {status === "loading" && <p className="tl-empty">Loading document…</p>}
        {status === "error" && (
          <p className="tl-empty">
            The document couldn’t be loaded. Check that it exists at <code>{template.docUrl}</code>.
          </p>
        )}
        {status === "ready" && (
          <div className="tl-doc" dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </aside>
    </div>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [docTemplate, setDocTemplate] = useState(null);

  const categories = useMemo(
    () => ["All", ...new Set(TEMPLATES.map((t) => t.category))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter((t) => {
      const inCat = category === "All" || t.category === category;
      const inText =
        !q ||
        [t.title, t.provider, t.description, ...t.tags].join(" ").toLowerCase().includes(q);
      return inCat && inText;
    });
  }, [query, category]);

  const grouped = useMemo(() => {
    return filtered.reduce((acc, t) => {
      (acc[t.category] ||= []).push(t);
      return acc;
    }, {});
  }, [filtered]);

  return (
    <div className="tl-page">
      <style>{CSS}</style>

      <header className="tl-hero">
        <h1>Xavor's CI/CD Template Library</h1>
        <p>
          Ready-to-use pipeline workflows. Pick a template, review the YAML, and drop it
          into your repository.
        </p>
        <div className="tl-controls">
          <input
            className="tl-search"
            type="search"
            placeholder="Search templates"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search templates"
          />
          <div className="tl-filters" role="tablist">
            {categories.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={category === c}
                className={`tl-filter ${category === c ? "is-active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="tl-main">
        {Object.keys(grouped).length === 0 && (
          <p className="tl-empty">No templates match “{query}”. Try a different search term.</p>
        )}

        {Object.entries(grouped).map(([cat, items]) => (
          <section key={cat} className="tl-section">
            <div className="tl-section-head">
              <h2>{cat}</h2>
              <span className="tl-count">{items.length} template{items.length > 1 ? "s" : ""}</span>
            </div>
            <div className="tl-grid">
              {items.map((t) => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  onConfigure={setSelected}
                  onOpenDoc={setDocTemplate}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {selected && <TemplateDrawer template={selected} onClose={() => setSelected(null)} />}
      {docTemplate && <DocViewer template={docTemplate} onClose={() => setDocTemplate(null)} />}
    </div>
  );
}

const CSS = `
.tl-page {
  --bg: #ffffff; --surface: #ffffff; --subtle: #f6f8fa; --border: #d0d7de;
  --text: #1f2328; --muted: #59636e; --link: #0969da; --primary: #1f883d;
  --code-bg: #f6f8fa;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
  background: var(--bg); color: var(--text); min-height: 100vh;
}
@media (prefers-color-scheme: dark) {
  .tl-page {
    --bg: #0d1117; --surface: #0d1117; --subtle: #151b23; --border: #3d444d;
    --text: #f0f6fc; --muted: #9198a1; --link: #4493f8; --primary: #238636;
    --code-bg: #151b23;
  }
}
.tl-page *, .tl-page *::before, .tl-page *::after { box-sizing: border-box; }

.tl-hero { max-width: 1200px; margin: 0 auto; padding: 48px 24px 8px; }
.tl-hero h1 { font-size: 32px; font-weight: 600; margin: 0 0 8px; }
.tl-hero p { color: var(--muted); font-size: 16px; margin: 0; max-width: 60ch; line-height: 1.5; }

.tl-controls { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; align-items: center; }
.tl-search {
  flex: 1 1 280px; max-width: 420px; padding: 7px 12px; font-size: 14px;
  border: 1px solid var(--border); border-radius: 6px; background: var(--surface); color: var(--text);
}
.tl-filters { display: flex; flex-wrap: wrap; gap: 6px; }
.tl-filter {
  padding: 5px 12px; font-size: 13px; border-radius: 999px; cursor: pointer;
  border: 1px solid var(--border); background: var(--surface); color: var(--text);
}
.tl-filter.is-active { background: var(--link); border-color: var(--link); color: #fff; }

.tl-main { max-width: 1200px; margin: 0 auto; padding: 16px 24px 64px; }
.tl-section { margin-top: 24px; }
.tl-section-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; }
.tl-section-head h2 { font-size: 24px; font-weight: 600; margin: 0; }
.tl-count { color: var(--muted); font-size: 14px; }

.tl-grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }

.tl-card {
  display: flex; flex-direction: column; min-height: 230px; padding: 24px 30px;
  border: 1px solid var(--border); border-radius: 6px; background: var(--surface);
}
.tl-card-head { display: flex; justify-content: space-between; gap: 12px; }
.tl-card-title { font-size: 18px; font-weight: 600; margin: 0; line-height: 1.4; }
.tl-card-by { color: var(--muted); font-size: 14px; margin: 4px 0 0; }
.tl-card-icon {
  flex: none; width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center;
  background: var(--surface); box-shadow: 0 1px 3px rgba(31,35,40,.12), 0 0 0 1px rgba(31,35,40,.04);
}
.tl-card-desc { color: var(--muted); font-size: 14px; line-height: 1.6; margin: 14px 0 20px; }
.tl-card-foot { margin-top: auto; display: flex; justify-content: space-between; align-items: center; }
.tl-cat { display: inline-flex; align-items: center; gap: 10px; color: var(--muted); font-size: 14px; }
.tl-dot { width: 14px; height: 14px; border-radius: 50%; display: inline-block; }

.tl-btn {
  padding: 5px 15px; font-size: 14px; font-weight: 600; border-radius: 6px; cursor: pointer;
  border: 1px solid var(--border); background: var(--subtle); color: var(--text);
}
.tl-btn:hover { filter: brightness(0.97); }
.tl-btn-primary { background: var(--primary); border-color: transparent; color: #fff; }
.tl-btn:focus-visible, .tl-filter:focus-visible, .tl-search:focus-visible, .tl-close:focus-visible {
  outline: 2px solid var(--link); outline-offset: 2px;
}

.tl-empty { color: var(--muted); padding: 40px 0; }

.tl-overlay {
  position: fixed; inset: 0; background: rgba(1,4,9,.5); display: flex; justify-content: flex-end; z-index: 50;
}
.tl-drawer {
  width: min(720px, 100%); height: 100%; overflow-y: auto; padding: 28px;
  background: var(--surface); border-left: 1px solid var(--border);
  animation: tl-slide .2s ease-out;
}
@keyframes tl-slide { from { transform: translateX(24px); opacity: 0; } to { transform: none; opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .tl-drawer { animation: none; } }
.tl-drawer-head { display: flex; justify-content: space-between; gap: 16px; }
.tl-drawer-head h2 { margin: 0; font-size: 22px; font-weight: 600; }
.tl-close { background: none; border: 0; color: var(--muted); font-size: 18px; cursor: pointer; height: 32px; width: 32px; border-radius: 6px; }

.tl-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
.tl-tag { font-size: 12px; padding: 2px 10px; border-radius: 999px; border: 1px solid var(--border); color: var(--muted); }

.tl-note {
  border: 1px solid var(--border); background: var(--subtle); border-radius: 6px;
  padding: 12px 16px; font-size: 14px; margin-bottom: 16px;
}
.tl-note ul { margin: 6px 0; padding-left: 18px; }
.tl-note p { margin: 6px 0 0; color: var(--muted); }
.tl-note code, .tl-code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.tl-note code { font-size: 12px; }

.tl-code-bar {
  display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;
  padding: 8px 12px; border: 1px solid var(--border); border-bottom: 0; border-radius: 6px 6px 0 0;
  background: var(--subtle); font-size: 13px; font-weight: 600;
}
.tl-code-actions { display: flex; gap: 8px; }
.tl-code {
  margin: 0; padding: 16px; font-size: 12.5px; line-height: 1.55; overflow-x: auto;
  background: var(--code-bg); border: 1px solid var(--border); border-radius: 0 0 6px 6px;
}

.tl-doc-link {
  background: none; border: 0; padding: 4px 0; cursor: pointer; font: inherit;
}
.tl-doc-link:hover { color: var(--link); text-decoration: underline; }
.tl-doc-link:focus-visible { outline: 2px solid var(--link); outline-offset: 2px; border-radius: 4px; }
a.tl-btn { text-decoration: none; display: inline-flex; align-items: center; }

.tl-drawer-wide { width: min(900px, 100%); }
.tl-doc { margin-top: 20px; font-size: 15px; line-height: 1.65; max-width: 75ch; }
.tl-doc h1, .tl-doc h2, .tl-doc h3 { line-height: 1.3; margin: 1.6em 0 0.5em; }
.tl-doc h1 { font-size: 24px; } .tl-doc h2 { font-size: 20px; } .tl-doc h3 { font-size: 17px; }
.tl-doc p { margin: 0 0 0.9em; }
.tl-doc ul, .tl-doc ol { padding-left: 22px; margin: 0 0 1em; }
.tl-doc li { margin-bottom: 0.3em; }
.tl-doc a { color: var(--link); }
.tl-doc img { max-width: 100%; height: auto; }
.tl-doc table { border-collapse: collapse; width: 100%; margin: 0 0 1em; font-size: 14px; display: block; overflow-x: auto; }
.tl-doc th, .tl-doc td { border: 1px solid var(--border); padding: 6px 10px; text-align: left; vertical-align: top; }
.tl-doc pre, .tl-doc code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; }
.tl-doc pre { background: var(--code-bg); border: 1px solid var(--border); border-radius: 6px; padding: 12px; overflow-x: auto; }

@media (max-width: 600px) {
  .tl-hero { padding-top: 32px; }
  .tl-hero h1 { font-size: 26px; }
  .tl-card { padding: 20px; }
}
`;
