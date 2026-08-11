"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "./skeleton";

// ⚙️ Replace with your GitHub repository owner and repo name
const GITHUB_OWNER = "coderade1905";
const GITHUB_REPO = "kewti-components";
const PER_PAGE = 9;

export default function ContributorsRow() {
  const [contributors, setContributors] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContributor, setSelectedContributor] = useState(null);

  // Fetch initial batch or paginated data
  const fetchContributors = async (pageNum, isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      // 1. Fetch initial list of contributors
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contributors?per_page=${PER_PAGE}&page=${pageNum}`
      );
      if (!res.ok) throw new Error("Failed to fetch GitHub contributors");

      const basicData = await res.json();

      if (basicData.length < PER_PAGE) {
        setHasMore(false);
      }

      // 2. Fetch full profile for each contributor to get their full Name
      const detailedData = await Promise.all(
        basicData.map(async (contributor) => {
          try {
            const userRes = await fetch(contributor.url); // contributor.url points to 'https://api.github.com/users/username'
            if (!userRes.ok) return { ...contributor, name: contributor.login };

            const userData = await userRes.json();
            return {
              ...contributor,
              name: userData.name || contributor.login, // Fallback to login if profile name is empty
            };
          } catch {
            return { ...contributor, name: contributor.login };
          }
        })
      );

      setContributors((prev) => (isInitial ? detailedData : [...prev, ...detailedData]));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchContributors(1, true);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchContributors(nextPage, false);
  };

  const filteredContributors = contributors.filter((contributor) =>
    contributor.login.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (contributor) => {
    setSelectedContributor(contributor.id);
    window.open(contributor.html_url, "_blank");
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] relative overflow-hidden flex flex-col items-center justify-center py-12 sm:py-20 px-4 sm:px-12 select-none">

      {/* ================= BACKGROUND GLOW ================= */}
      <div
        className="absolute w-[500px] h-[400px] sm:w-[700px] sm:h-[600px] md:w-[900px] md:h-[700px] rounded-full pointer-events-none opacity-20 blur-[80px] sm:blur-[120px] md:blur-[150px] mix-blend-screen"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, #E05320 0%, #241B17 60%, transparent 100%)",
        }}
      />

      {/* ================= PATTERN OVERLAYS ================= */}
      <div
        className="absolute top-0 left-0 bottom-0 w-[42%] pointer-events-none opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url('/assets/patern_2.svg')`,
          backgroundSize: "80px auto",
          backgroundRepeat: "repeat",
          WebkitMaskImage:
            "linear-gradient(to right, black 50%, transparent 100%)",
          maskImage: "linear-gradient(to right, black 50%, transparent 100%)",
        }}
      />
      <div
        className="absolute top-0 right-0 bottom-0 w-[42%] pointer-events-none opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url('/assets/patern_2.svg')`,
          backgroundSize: "80px auto",
          backgroundRepeat: "repeat",
          WebkitMaskImage:
            "linear-gradient(to left, black 50%, transparent 100%)",
          maskImage: "linear-gradient(to left, black 50%, transparent 100%)",
        }}
      />

      {/* ================= CONTROLS ================= */}
      <div className="relative z-10 w-full max-w-[1200px] mb-8 flex flex-col sm:flex-row gap-4 px-2 sm:px-0">
        <div className="flex-1 bg-[#141414] border border-neutral-800/60 rounded-lg h-10 flex items-center px-3">
          <svg
            className="w-3.5 h-3.5 text-neutral-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="10" cy="10" r="7" strokeWidth="2" />
            <line x1="15" y1="15" x2="21" y2="21" strokeWidth="2" />
          </svg>
          <input
            type="text"
            placeholder="Search GitHub contributors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-white/80 text-xs flex-1 focus:outline-none placeholder:text-neutral-500"
          />
        </div>
      </div>

      {/* ================= ERROR STATE ================= */}
      {error && (
        <div className="relative z-10 text-red-400 py-12 text-center text-sm">
          Failed to load contributors: {error}
        </div>
      )}

      {/* ================= GRID CONTAINER ================= */}
      <div className="relative z-10 w-full max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {/* INITIAL SKELETON LOADING STATE */}
        {loading &&
          Array.from({ length: PER_PAGE }).map((_, index) => (
            <div
              key={index}
              className="w-full h-[380px] sm:h-[410px] bg-[#141414] border border-white/[0.02] rounded-2xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="w-full flex justify-end">
                <div className="flex-1 bg-[#0C0C0C] h-[54px] rounded-tl-2xl border-b border-white/[0.02]" />
                <div className="bg-[#141414] h-[54px] px-4 flex items-center justify-center">
                  <Skeleton className="h-4 w-24 bg-white/10" />
                </div>
              </div>

              <div className="flex-1 w-full flex flex-col items-center justify-center gap-4 pb-6">
                <Skeleton className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] rounded-full bg-white/10" />
                <Skeleton className="h-5 w-32 mt-2 bg-white/10" />
                <Skeleton className="h-3 w-20 bg-white/10" />
              </div>
            </div>
          ))}

        {/* REAL CONTRIBUTORS GRID */}
        {!loading &&
          filteredContributors.map((contributor) => (
            <div
              key={contributor.id}
              onClick={() => handleCardClick(contributor)}
              className={`w-full h-[380px] sm:h-[410px] bg-[#141414] border rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-2xl transition-all cursor-pointer
                ${selectedContributor === contributor.id
                  ? "border-[#E05320] border-2"
                  : "border-white/[0.02] hover:border-white/10"
                }`}
            >
              {/* Top Inset Tab Header Block */}
              <div className="w-full flex justify-end">
                <div className="flex-1 bg-[#0C0C0C] h-[54px] rounded-tl-2xl border-b border-white/[0.02]" />

                <div className="bg-[#141414] h-[54px] px-4 sm:px-6 flex items-center justify-center gap-2.5">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6B35]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </div>

              {/* Avatar + Name Center Area */}
              <div className="flex-1 w-full flex flex-col items-center justify-center gap-2 sm:gap-3 pb-6">
                <div className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] rounded-full bg-white/[0.02] border border-white/[0.01] relative flex items-center justify-center overflow-hidden">
                  <img
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="text-white text-base sm:text-lg font-medium mt-2 text-center px-2">
                  <span className="text-xl">{contributor.name}</span><br />
                  <span className="text-sm">@{contributor.login}</span>
                </div>
                <div className="text-neutral-400 text-xs sm:text-sm text-center">
                  Contributor
                </div>
              </div>
            </div>
          ))}

        {/* SKELETONS FOR NEXT BATCH */}
        {loadingMore &&
          Array.from({ length: PER_PAGE }).map((_, index) => (
            <div
              key={`loading-more-${index}`}
              className="w-full h-[380px] sm:h-[410px] bg-[#141414] border border-white/[0.02] rounded-2xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="w-full flex justify-end">
                <div className="flex-1 bg-[#0C0C0C] h-[54px] rounded-tl-2xl border-b border-white/[0.02]" />
                <div className="bg-[#141414] h-[54px] px-4 flex items-center justify-center">
                  <Skeleton className="h-4 w-24 bg-white/10" />
                </div>
              </div>

              <div className="flex-1 w-full flex flex-col items-center justify-center gap-4 pb-6">
                <Skeleton className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] rounded-full bg-white/10" />
                <Skeleton className="h-5 w-32 mt-2 bg-white/10" />
                <Skeleton className="h-3 w-20 bg-white/10" />
              </div>
            </div>
          ))}
      </div>

      {/* NO RESULTS STATE */}
      {!loading && !error && filteredContributors.length === 0 && (
        <div className="relative z-10 text-center text-neutral-500 py-12 w-full">
          No contributors match your search criteria.
        </div>
      )}

      {/* ================= LOAD MORE BUTTON ================= */}
      {!loading && hasMore && !searchTerm && (
        <div className="relative z-10 mt-10 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-2.5 rounded-xl bg-[#141414] border border-neutral-800 hover:border-[#E05320] text-white/90 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(224,83,32,0.2)]"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}