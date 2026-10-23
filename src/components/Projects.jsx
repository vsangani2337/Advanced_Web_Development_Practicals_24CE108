import { useCallback, useEffect, useMemo, useState } from "react";
import { studentConfig } from "../data/studentConfig.js";
import { IGNORE_REPOS } from "../data/portfolio.js";

const CACHE_KEY = `${studentConfig.githubUsername}-github-repos`;
const CACHE_DURATION = 10 * 60 * 1000;
const FEATURED_REPOS = new Set(["Cashen", "pizza-delivery", "student-portfolio", "task-manager"]);

function ProjectPreview({ type }) {
  if (type === "cashen") {
    return (
      <div className="preview-panel dashboard-preview" aria-label="Cashen dashboard preview">
        <div className="preview-window-bar">
          <i />
          <i />
          <i />
          <span>cashen / dashboard</span>
        </div>
        <div className="dashboard-body">
          <div className="dashboard-stats">
            <span><b>₹12.4k</b><small>Spent</small></span>
            <span><b>₹20k</b><small>Budget</small></span>
            <span><b>₹7.6k</b><small>Saved</small></span>
          </div>
          <div className="dashboard-chart" aria-hidden="true">
            <i /><i /><i /><i /><i /><i /><i />
          </div>
          <div className="dashboard-progress"><span /></div>
        </div>
      </div>
    );
  }

  if (type === "pizza") {
    return (
      <div className="preview-panel tracker-preview" aria-label="Order tracking preview">
        <div className="preview-window-bar">
          <i /><i /><i /><span>order / tracking</span>
        </div>
        <div className="tracker-body">
          {["Placed", "Preparing", "Baking", "Out for delivery", "Delivered"].map((step, index) => (
            <div className={index < 3 ? "tracker-step complete" : "tracker-step"} key={step}>
              <span>{index < 3 ? "✓" : index + 1}</span>
              <small>{step}</small>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="preview-panel coding-preview" aria-label="Engineering stats preview">
      <div className="coding-stats">
        <div><strong>React</strong><small>Frontend</small><i /></div>
        <div><strong>Express</strong><small>Backend</small><i /></div>
        <div><strong>Mongo</strong><small>Database</small><i /></div>
      </div>
      <p>Full-Stack MERN Architecture</p>
    </div>
  );
}

function ProjectLinks({ links }) {
  const entries = [
    ["live", "Live Demo"],
    ["github", "GitHub"],
  ];

  const available = entries.filter(([key]) => links[key]);
  if (available.length === 0) return null;

  return (
    <div className="project-links">
      {available.map(([key, label]) => (
        <a href={links[key]} key={key} target="_blank" rel="noreferrer">
          {label} <span aria-hidden="true">→</span>
        </a>
      ))}
    </div>
  );
}

function SkeletonCards() {
  return (
    <div className="repository-grid" aria-label="Loading repositories">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div className="repository-skeleton" key={item}>
          <span /><span /><span />
        </div>
      ))}
    </div>
  );
}

function RepositoryCard({ repo }) {
  const hasDescription = Boolean(repo.description);
  const isFeatured = FEATURED_REPOS.has(repo.name);

  return (
    <a className="repository-card" href={repo.html_url} target="_blank" rel="noreferrer">
      <div className="repository-card__top">
        <h3>{repo.name}</h3>
        <span className="repository-card__counts">★ {repo.stargazers_count} · ⑂ {repo.forks_count}</span>
      </div>
      {hasDescription && <p>{repo.description}</p>}
      <div className="repository-card__bottom">
        <span className="repository-language"><i />{repo.language || "Code"}</span>
        {isFeatured && <span className="featured-badge">Featured</span>}
        <span className="repository-card__arrow" aria-hidden="true">→</span>
      </div>
    </a>
  );
}

function Projects({ projectList }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const fetchRepositories = useCallback(async (signal) => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_DURATION) {
          setRepos(parsed.data);
          setLoading(false);
          return;
        }
      }

      const response = await fetch(
        `https://api.github.com/users/${studentConfig.githubUsername}/repos?sort=updated&per_page=100`,
        { signal }
      );
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
      const data = await response.json();
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
      setRepos(data);
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setError("GitHub is unavailable right now. Please try again or visit the profile directly.");
      }
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchRepositories(controller.signal);
    return () => controller.abort();
  }, [fetchRepositories]);

  const retryFetch = () => {
    sessionStorage.removeItem(CACHE_KEY);
    setError("");
    setLoading(true);
    const controller = new AbortController();
    fetchRepositories(controller.signal);
  };

  const filteredRepos = useMemo(() => {
    const ignoreSet = new Set(IGNORE_REPOS);
    return repos
      .filter((repo) => !ignoreSet.has(repo.name) && !repo.fork)
      .filter((repo) => {
        if (!search.trim()) return true;
        const query = search.toLowerCase();
        return (
          repo.name.toLowerCase().includes(query) ||
          (repo.description && repo.description.toLowerCase().includes(query)) ||
          (repo.language && repo.language.toLowerCase().includes(query))
        );
      });
  }, [repos, search]);

  const visibleRepos = showAll ? filteredRepos : filteredRepos.slice(0, 6);

  return (
    <section id="projects" className="content-section projects-section">
      <div className="section-heading">
        <p className="eyebrow">03 / Projects & GitHub</p>
        <h2>
          Hand-crafted code.<br />
          <em>Real-world utility.</em>
        </h2>
      </div>

      <div className="projects-showcase">
        {projectList.map((project, index) => {
          const type = index === 0 ? "cashen" : index === 1 ? "pizza" : "coding";
          return (
            <article className="project-row" key={project.name}>
              <div className="project-row__preview">
                <ProjectPreview type={type} />
              </div>
              <div className="project-row__details">
                <span className="project-index">0{index + 1}</span>
                <h3>{project.name}</h3>
                <p className="project-description">{project.description}</p>
                <p className="project-impact">{project.impact}</p>
                <div className="tag-list">
                  {project.technologies.map((tech) => (
                    <span className="tag" key={tech}>{tech}</span>
                  ))}
                </div>
                <ProjectLinks links={project.links} />
              </div>
            </article>
          );
        })}
      </div>

      <div className="repositories-section">
        <div className="repositories-header">
          <div>
            <h3>GitHub Repositories</h3>
            <p className="muted">
              Live data from <a href={studentConfig.githubUrl} target="_blank" rel="noreferrer">github.com/{studentConfig.githubUsername}</a>
            </p>
          </div>
          <div className="repositories-controls">
            <input
              type="search"
              className="search-input"
              placeholder="Search repositories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Filter repositories"
            />
          </div>
        </div>

        {loading && <SkeletonCards />}

        {error && (
          <div className="repository-error" role="alert">
            <p>{error}</p>
            <button className="button button-secondary" type="button" onClick={retryFetch}>
              Retry request
            </button>
          </div>
        )}

        {!loading && !error && visibleRepos.length === 0 && (
          <p className="task-empty">No repositories matching your query.</p>
        )}

        {!loading && !error && visibleRepos.length > 0 && (
          <div className="repository-grid">
            {visibleRepos.map((repo) => (
              <RepositoryCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}

        {!loading && !error && filteredRepos.length > 6 && (
          <div className="show-more-row">
            <button
              className="button button-quiet"
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Show fewer repositories" : `Show all ${filteredRepos.length} repositories`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;
