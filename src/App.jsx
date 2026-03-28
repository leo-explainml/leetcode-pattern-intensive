import { useState, useEffect, useRef, useCallback } from "react";

const STUDY_PLAN = [
  {
    day: 1,
    pattern: "Two Pointers",
    icon: "👉👈",
    template: "left=0, right=len-1, move based on condition",
    problems: [
      { name: "Two Sum II", id: 167, difficulty: "Med", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", tip: "Sorted array → two pointers, not hashmap" },
      { name: "3Sum", id: 15, difficulty: "Med", url: "https://leetcode.com/problems/3sum/", tip: "Fix one, two-pointer the rest. Skip dupes." },
      { name: "Container With Most Water", id: 11, difficulty: "Med", url: "https://leetcode.com/problems/container-with-most-water/", tip: "Move the shorter pointer inward" },
      { name: "Trapping Rain Water", id: 42, difficulty: "Hard", url: "https://leetcode.com/problems/trapping-rain-water/", tip: "Stretch goal — two pointer or prefix max approach" },
    ],
  },
  {
    day: 2,
    pattern: "Sliding Window",
    icon: "🪟",
    template: "expand right, shrink left when condition breaks",
    problems: [
      { name: "Longest Substring Without Repeating", id: 3, difficulty: "Med", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", tip: "Set + shrink left on collision" },
      { name: "Min Size Subarray Sum", id: 209, difficulty: "Med", url: "https://leetcode.com/problems/minimum-size-subarray-sum/", tip: "Shrink window when sum >= target" },
      { name: "Permutation in String", id: 567, difficulty: "Med", url: "https://leetcode.com/problems/permutation-in-string/", tip: "Fixed-size window + char freq map" },
      { name: "Longest Repeating Character Replacement", id: 424, difficulty: "Med", url: "https://leetcode.com/problems/longest-repeating-character-replacement/", tip: "Window valid when len - maxFreq <= k" },
    ],
  },
  {
    day: 3,
    pattern: "Binary Search",
    icon: "🔍",
    template: "lo=0, hi=n-1, while lo<=hi, mid=(lo+hi)//2",
    problems: [
      { name: "Search in Rotated Sorted Array", id: 33, difficulty: "Med", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", tip: "Determine which half is sorted first" },
      { name: "Find Min in Rotated Sorted Array", id: 153, difficulty: "Med", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", tip: "Compare mid to right boundary" },
      { name: "Koko Eating Bananas", id: 875, difficulty: "Med", url: "https://leetcode.com/problems/koko-eating-bananas/", tip: "Binary search on the answer (speed)" },
      { name: "Search a 2D Matrix", id: 74, difficulty: "Med", url: "https://leetcode.com/problems/search-a-2d-matrix/", tip: "Treat as flat sorted array" },
    ],
  },
  {
    day: 4,
    pattern: "Stacks",
    icon: "📚",
    template: "monotonic stack: pop while top violates invariant",
    problems: [
      { name: "Valid Parentheses", id: 20, difficulty: "Easy", url: "https://leetcode.com/problems/valid-parentheses/", tip: "Warm-up — push open, match close" },
      { name: "Daily Temperatures", id: 739, difficulty: "Med", url: "https://leetcode.com/problems/daily-temperatures/", tip: "Monotonic decreasing stack of indices" },
      { name: "Evaluate Reverse Polish Notation", id: 150, difficulty: "Med", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", tip: "Pop two operands per operator" },
      { name: "Min Stack", id: 155, difficulty: "Med", url: "https://leetcode.com/problems/min-stack/", tip: "Track min at each level of the stack" },
    ],
  },
  {
    day: 5,
    pattern: "Heap / Priority Queue",
    icon: "⛰️",
    template: "heapq: push/pop O(log n), peek O(1)",
    problems: [
      { name: "Kth Largest Element", id: 215, difficulty: "Med", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", tip: "Min-heap of size k, or quickselect" },
      { name: "Top K Frequent Elements", id: 347, difficulty: "Med", url: "https://leetcode.com/problems/top-k-frequent-elements/", tip: "Counter + heap, or bucket sort" },
      { name: "Task Scheduler", id: 621, difficulty: "Med", url: "https://leetcode.com/problems/task-scheduler/", tip: "Max heap + cooldown queue" },
      { name: "K Closest Points to Origin", id: 973, difficulty: "Med", url: "https://leetcode.com/problems/k-closest-points-to-origin/", tip: "Max-heap of size k by distance" },
    ],
  },
  {
    day: 6,
    pattern: "Trees (DFS)",
    icon: "🌳",
    template: "recursive: base case → process → recurse left/right",
    problems: [
      { name: "Lowest Common Ancestor of BST", id: 235, difficulty: "Med", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", tip: "Split point where p and q diverge" },
      { name: "Binary Tree Level Order Traversal", id: 102, difficulty: "Med", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", tip: "BFS with queue, process level by level" },
      { name: "Validate BST", id: 98, difficulty: "Med", url: "https://leetcode.com/problems/validate-binary-search-tree/", tip: "Pass min/max bounds down recursively" },
      { name: "Kth Smallest in BST", id: 230, difficulty: "Med", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", tip: "In-order traversal, count to k" },
    ],
  },
  {
    day: 7,
    pattern: "🔄 Review + Timed Sim",
    icon: "⏱️",
    template: "SIMULATION DAY — 2 random mediums, 30 min total",
    problems: [
      { name: "Re-solve weakest Day 1-3 problem", id: 0, difficulty: "Med", url: "", tip: "Pick the one you struggled with most" },
      { name: "Re-solve weakest Day 4-6 problem", id: 0, difficulty: "Med", url: "", tip: "No looking at notes — pure recall" },
      { name: "Timed Sim: 2 random mediums", id: 0, difficulty: "Med", url: "https://leetcode.com/problemset/?difficulty=MEDIUM", tip: "30 min total. Grade yourself honestly." },
    ],
  },
  {
    day: 8,
    pattern: "Graphs (BFS/DFS)",
    icon: "🕸️",
    template: "build adj list, visited set, BFS=queue DFS=stack/recursion",
    problems: [
      { name: "Number of Islands", id: 200, difficulty: "Med", url: "https://leetcode.com/problems/number-of-islands/", tip: "DFS flood fill from each unvisited '1'" },
      { name: "Clone Graph", id: 133, difficulty: "Med", url: "https://leetcode.com/problems/clone-graph/", tip: "HashMap old→new + BFS or DFS" },
      { name: "Pacific Atlantic Water Flow", id: 417, difficulty: "Med", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/", tip: "Reverse — BFS from each ocean inward" },
      { name: "Course Schedule", id: 207, difficulty: "Med", url: "https://leetcode.com/problems/course-schedule/", tip: "Topological sort — detect cycle" },
    ],
  },
  {
    day: 9,
    pattern: "Graphs (Advanced)",
    icon: "🗺️",
    template: "topo sort: in-degree + BFS, or DFS post-order",
    problems: [
      { name: "Course Schedule II", id: 210, difficulty: "Med", url: "https://leetcode.com/problems/course-schedule-ii/", tip: "Kahn's algo — BFS with in-degree" },
      { name: "Rotting Oranges", id: 994, difficulty: "Med", url: "https://leetcode.com/problems/rotting-oranges/", tip: "Multi-source BFS — enqueue all rotten first" },
      { name: "Surrounded Regions", id: 130, difficulty: "Med", url: "https://leetcode.com/problems/surrounded-regions/", tip: "DFS from border O's, then flip the rest" },
      { name: "Graph Valid Tree", id: 261, difficulty: "Med", url: "https://leetcode.com/problems/graph-valid-tree/", tip: "n-1 edges + connected = tree (Union Find)" },
    ],
  },
  {
    day: 10,
    pattern: "Backtracking",
    icon: "🔙",
    template: "choose → explore → unchoose. Base case = valid solution",
    problems: [
      { name: "Subsets", id: 78, difficulty: "Med", url: "https://leetcode.com/problems/subsets/", tip: "Include/exclude at each index" },
      { name: "Combination Sum", id: 39, difficulty: "Med", url: "https://leetcode.com/problems/combination-sum/", tip: "Reuse allowed — don't increment start" },
      { name: "Permutations", id: 46, difficulty: "Med", url: "https://leetcode.com/problems/permutations/", tip: "Swap-based or used[] boolean array" },
      { name: "Word Search", id: 79, difficulty: "Med", url: "https://leetcode.com/problems/word-search/", tip: "DFS grid + mark visited, backtrack" },
    ],
  },
  {
    day: 11,
    pattern: "DP (1D)",
    icon: "📈",
    template: "dp[i] = f(dp[i-1], dp[i-2], ...)",
    problems: [
      { name: "Climbing Stairs", id: 70, difficulty: "Easy", url: "https://leetcode.com/problems/climbing-stairs/", tip: "Warm-up — dp[i] = dp[i-1] + dp[i-2]" },
      { name: "House Robber", id: 198, difficulty: "Med", url: "https://leetcode.com/problems/house-robber/", tip: "dp[i] = max(dp[i-1], dp[i-2]+nums[i])" },
      { name: "Coin Change", id: 322, difficulty: "Med", url: "https://leetcode.com/problems/coin-change/", tip: "dp[amount] = min coins. Bottom-up." },
      { name: "Longest Increasing Subsequence", id: 300, difficulty: "Med", url: "https://leetcode.com/problems/longest-increasing-subsequence/", tip: "O(n²) DP or O(n log n) with binary search" },
    ],
  },
  {
    day: 12,
    pattern: "DP (2D / Intervals)",
    icon: "🧮",
    template: "dp[i][j] = subproblem on range or two sequences",
    problems: [
      { name: "Unique Paths", id: 62, difficulty: "Med", url: "https://leetcode.com/problems/unique-paths/", tip: "dp[i][j] = dp[i-1][j] + dp[i][j-1]" },
      { name: "Longest Common Subsequence", id: 1143, difficulty: "Med", url: "https://leetcode.com/problems/longest-common-subsequence/", tip: "Match → diagonal+1, else max(left, up)" },
      { name: "Word Break", id: 139, difficulty: "Med", url: "https://leetcode.com/problems/word-break/", tip: "dp[i] = can we segment s[:i]?" },
      { name: "Decode Ways", id: 91, difficulty: "Med", url: "https://leetcode.com/problems/decode-ways/", tip: "1-digit always valid if >0, 2-digit if 10-26" },
    ],
  },
  {
    day: 13,
    pattern: "Intervals + Linked Lists",
    icon: "🔗",
    template: "sort by start, merge overlapping. LL: dummy head trick.",
    problems: [
      { name: "Merge Intervals", id: 56, difficulty: "Med", url: "https://leetcode.com/problems/merge-intervals/", tip: "Sort by start, extend end if overlapping" },
      { name: "Insert Interval", id: 57, difficulty: "Med", url: "https://leetcode.com/problems/insert-interval/", tip: "Before, overlap, after — three phases" },
      { name: "Reorder List", id: 143, difficulty: "Med", url: "https://leetcode.com/problems/reorder-list/", tip: "Find mid, reverse second half, merge" },
      { name: "LRU Cache", id: 146, difficulty: "Med", url: "https://leetcode.com/problems/lru-cache/", tip: "HashMap + doubly linked list" },
    ],
  },
  {
    day: 14,
    pattern: "🏁 Final Simulation",
    icon: "🎯",
    template: "FINAL DAY — full simulation + review",
    problems: [
      { name: "Timed Sim #1: 2 random mediums (30 min)", id: 0, difficulty: "Med", url: "https://leetcode.com/problemset/?difficulty=MEDIUM", tip: "This is game day. Execute your process." },
      { name: "Timed Sim #2: 2 more random mediums (30 min)", id: 0, difficulty: "Med", url: "https://leetcode.com/problemset/?difficulty=MEDIUM", tip: "Second rep. Note where you lost time." },
      { name: "Review: write down your 5 weakest patterns", id: 0, difficulty: "—", url: "", tip: "These become your continued study focus" },
    ],
  },
];

const TOTAL_PROBLEMS = STUDY_PLAN.reduce((sum, day) => sum + day.problems.length, 0);

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function LeetCodeTracker() {
  const [completed, setCompleted] = useState({});
  const [activeDay, setActiveDay] = useState(1);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState(15); // 15 or 30
  const [showTip, setShowTip] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState("tracker"); // "tracker" or "strategy"
  const intervalRef = useRef(null);

  // Load state from storage
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("lc-tracker-state");
        if (result) {
          const parsed = JSON.parse(result.value);
          setCompleted(parsed.completed || {});
          if (parsed.activeDay) setActiveDay(parsed.activeDay);
        }
      } catch (e) {
        // No saved state
      }
      setLoaded(true);
    })();
  }, []);

  // Save state on change
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await window.storage.set(
          "lc-tracker-state",
          JSON.stringify({ completed, activeDay })
        );
      } catch (e) {}
    })();
  }, [completed, activeDay, loaded]);

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerRunning]);

  const startTimer = (minutes) => {
    setTimerMode(minutes);
    setTimerSeconds(minutes * 60);
    setTimerRunning(true);
  };

  const toggleProblem = useCallback((key) => {
    setCompleted((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = Date.now();
      return next;
    });
  }, []);

  const completedCount = Object.keys(completed).length;
  const progress = Math.round((completedCount / TOTAL_PROBLEMS) * 100);

  const currentDay = STUDY_PLAN.find((d) => d.day === activeDay);
  const dayCompleted = currentDay
    ? currentDay.problems.filter((_, i) => completed[`${activeDay}-${i}`]).length
    : 0;

  const timerPct = timerMode * 60 > 0 ? ((timerMode * 60 - timerSeconds) / (timerMode * 60)) * 100 : 0;
  const timerUrgent = timerSeconds > 0 && timerSeconds < 120;

  if (!loaded) return <div style={{ padding: 40, textAlign: "center", color: "#888", fontFamily: "'JetBrains Mono', monospace" }}>Loading...</div>;

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
      background: "#0a0a0f",
      color: "#e0e0e8",
      minHeight: "100vh",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #12121a; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 3px; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 8px rgba(0,255,136,0.3); } 50% { box-shadow: 0 0 20px rgba(0,255,136,0.6); } }
        .day-tab { 
          padding: 6px 10px; border: 1px solid #1e1e2e; border-radius: 6px; 
          cursor: pointer; transition: all 0.2s; font-size: 11px; font-family: inherit;
          background: #12121a; color: #666; white-space: nowrap; text-align: center;
          min-width: 38px;
        }
        .day-tab:hover { border-color: #3a3a5a; color: #aaa; }
        .day-tab.active { border-color: #00ff88; color: #00ff88; background: rgba(0,255,136,0.06); }
        .day-tab.done { border-color: #00ff8844; color: #00ff88; background: rgba(0,255,136,0.04); }
        .problem-row {
          display: flex; align-items: center; gap: 12px; padding: 14px 16px;
          border: 1px solid #1a1a2a; border-radius: 8px; margin-bottom: 8px;
          transition: all 0.25s; cursor: pointer; animation: slideIn 0.3s ease;
          background: #0f0f18;
        }
        .problem-row:hover { border-color: #2a2a4a; background: #13131f; }
        .problem-row.completed { border-color: #00ff8833; background: rgba(0,255,136,0.03); }
        .check-box {
          width: 22px; height: 22px; border-radius: 5px; border: 2px solid #333;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: all 0.2s; font-size: 13px;
        }
        .check-box.checked { border-color: #00ff88; background: rgba(0,255,136,0.15); }
        .tip-bubble {
          background: #1a1a2e; border: 1px solid #2a2a4a; border-radius: 6px;
          padding: 10px 14px; margin-top: 8px; font-size: 12px; color: #aaa;
          animation: slideIn 0.2s ease; line-height: 1.5;
        }
        .timer-btn {
          padding: 8px 18px; border-radius: 6px; border: 1px solid #2a2a3a;
          background: #12121a; color: #ccc; cursor: pointer; font-family: inherit;
          font-size: 13px; transition: all 0.2s;
        }
        .timer-btn:hover { border-color: #00ff88; color: #00ff88; }
        .timer-btn.active { background: rgba(0,255,136,0.1); border-color: #00ff88; color: #00ff88; }
        .timer-btn.stop { border-color: #ff4444; color: #ff4444; }
        .timer-btn.stop:hover { background: rgba(255,68,68,0.1); }
        a { color: #7788ff; text-decoration: none; }
        a:hover { text-decoration: underline; color: #99aaff; }
        .reset-btn {
          padding: 6px 14px; border-radius: 5px; border: 1px solid #2a2a3a;
          background: transparent; color: #666; cursor: pointer; font-family: inherit;
          font-size: 11px; transition: all 0.2s;
        }
        .reset-btn:hover { border-color: #ff4444; color: #ff4444; }
        .nav-tab {
          padding: 8px 16px; border: none; border-bottom: 2px solid transparent;
          background: none; color: #555; cursor: pointer; font-family: inherit;
          font-size: 13px; font-weight: 500; transition: all 0.2s; letter-spacing: 0.5px;
        }
        .nav-tab:hover { color: #aaa; }
        .nav-tab.active { color: #00ff88; border-bottom-color: #00ff88; }
        .strategy-section {
          padding: 24px; border: 1px solid #1a1a2a; border-radius: 10px;
          background: #0f0f18; margin-bottom: 16px; animation: slideIn 0.3s ease;
        }
        .strategy-section h3 {
          font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 600;
          color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 10px;
        }
        .strategy-section p {
          font-size: 13px; color: #aaa; line-height: 1.7; margin-bottom: 8px;
        }
        .strategy-number {
          width: 28px; height: 28px; border-radius: 6px; display: inline-flex;
          align-items: center; justify-content: center; font-size: 13px; font-weight: 700;
          background: rgba(0,255,136,0.1); color: #00ff88; border: 1px solid rgba(0,255,136,0.2);
          flex-shrink: 0;
        }
        .strategy-callout {
          margin-top: 16px; padding: 14px 18px; background: rgba(119,136,255,0.06);
          border: 1px solid rgba(119,136,255,0.15); border-radius: 8px;
          font-size: 12px; color: #99aaff; line-height: 1.6;
        }
      `}</style>

      {/* HEADER */}
      <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid #1a1a2a" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>
              <span style={{ color: "#00ff88" }}>leet</span>grind
            </div>
            <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>14-DAY SPEED PROTOCOL • 2 MEDIUMS / 30 MIN</div>
          </div>
          <button className="reset-btn" onClick={() => { if (confirm("Reset all progress?")) setCompleted({}); }}>
            reset
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
          <div style={{ flex: 1, height: 6, background: "#1a1a2a", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              width: `${progress}%`, height: "100%", borderRadius: 3,
              background: progress === 100 ? "#00ff88" : "linear-gradient(90deg, #00ff88, #00cc6a)",
              transition: "width 0.5s ease",
              ...(progress > 0 && progress < 100 ? { animation: "glow 2s infinite" } : {}),
            }} />
          </div>
          <span style={{ fontSize: 12, color: progress === 100 ? "#00ff88" : "#666", fontWeight: 600 }}>
            {completedCount}/{TOTAL_PROBLEMS}
          </span>
        </div>
      </div>

      {/* NAV TABS */}
      <div style={{ padding: "0 24px", borderBottom: "1px solid #1a1a2a", display: "flex", gap: 4 }}>
        <button className={`nav-tab ${page === "tracker" ? "active" : ""}`} onClick={() => setPage("tracker")}>
          Tracker
        </button>
        <button className={`nav-tab ${page === "strategy" ? "active" : ""}`} onClick={() => setPage("strategy")}>
          Strategy
        </button>
      </div>

      {page === "strategy" && (
        <div style={{ padding: "24px", maxWidth: 720, margin: "0 auto" }}>
          {/* Hero */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
              Speed Strategy
            </div>
            <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, margin: 0 }}>
              The core issue is pattern recognition speed, not understanding. At ~15 min per problem, you need to identify the pattern within 2-3 minutes and code almost on autopilot.
            </p>
          </div>

          {/* Section 1 */}
          <div className="strategy-section">
            <h3><span className="strategy-number">1</span> Study by pattern, not by problem</h3>
            <p>
              Group problems into the ~12-15 core patterns (sliding window, two pointers, BFS/DFS, topological sort, monotonic stack, union find, interval merge, binary search on answer, etc.). Do 3-5 problems per pattern in a batch.
            </p>
            <p>
              You want your brain to shortcut from "I see X constraint" to "this is pattern Y" instantly.
            </p>
          </div>

          {/* Section 2 */}
          <div className="strategy-section">
            <h3><span className="strategy-number">2</span> The "solve, review, redo" loop</h3>
            <p>
              For each problem: give yourself 15 minutes. If you don't have a working approach by minute 5, look at the solution category (not the full solution — just the tag). If you're stuck at 15, read the editorial, then close it and reimplement from memory.
            </p>
            <p>
              Come back 2-3 days later and redo it cold. The spaced repetition is what builds the speed.
            </p>
            <div className="strategy-callout">
              5 min — no approach? Check the pattern tag.<br/>
              15 min — still stuck? Read editorial, close it, reimplement.<br/>
              2-3 days later — redo cold.
            </div>
          </div>

          {/* Section 3 */}
          <div className="strategy-section">
            <h3><span className="strategy-number">3</span> Simulate real conditions weekly</h3>
            <p>
              Pick 2 random mediums on a timer. No IDE autocomplete, no running code until you think it's done. This trains you to write correct code on the first pass, which is where most of the time savings come from.
            </p>
          </div>

          {/* Section 4 */}
          <div className="strategy-section">
            <h3><span className="strategy-number">4</span> Optimize your "template library" mentally</h3>
            <p>
              Have instant-recall templates for: binary search (both boundary variants), BFS/DFS traversal, sliding window expand/contract, backtracking skeleton, DP table setup (1D and 2D).
            </p>
            <p>
              You shouldn't be thinking about boilerplate — it should be muscle memory.
            </p>
            <div className="strategy-callout">
              Templates to memorize: binary search boundaries, BFS/DFS traversal, sliding window expand/contract, backtracking choose/explore/unchoose, DP table init (1D + 2D).
            </div>
          </div>

          {/* Section 5 */}
          <div className="strategy-section">
            <h3><span className="strategy-number">5</span> Neetcode 150 over Blind 75</h3>
            <p>
              Neetcode 150 is better organized by pattern and has video walkthroughs. If you're time-constrained, prioritize the patterns you're weakest on rather than grinding linearly.
            </p>
          </div>

          {/* Key insight */}
          <div style={{
            marginTop: 8, padding: "20px 24px", background: "rgba(0,255,136,0.04)",
            border: "1px solid rgba(0,255,136,0.15)", borderRadius: 10,
          }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "#00ff88", marginBottom: 8 }}>
              The biggest leverage point
            </div>
            <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.7, margin: 0 }}>
              Going from "I can solve mediums" to "I can solve them in 15 minutes" is almost always about the first 3 minutes — how fast you map the problem to a known pattern and pick your data structures. If you're spending 5+ minutes just figuring out the approach, that's the bottleneck to focus on.
            </p>
          </div>
        </div>
      )}

      {/* DAY SELECTOR */}
      {page === "tracker" && <div style={{ padding: "14px 24px", borderBottom: "1px solid #1a1a2a", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 6, minWidth: "max-content" }}>
          {STUDY_PLAN.map((day) => {
            const dc = day.problems.filter((_, i) => completed[`${day.day}-${i}`]).length;
            const allDone = dc === day.problems.length;
            return (
              <button
                key={day.day}
                className={`day-tab ${activeDay === day.day ? "active" : ""} ${allDone ? "done" : ""}`}
                onClick={() => setActiveDay(day.day)}
              >
                <div style={{ fontSize: 14 }}>{day.icon}</div>
                <div>D{day.day}</div>
                {dc > 0 && (
                  <div style={{ fontSize: 9, color: allDone ? "#00ff88" : "#555" }}>
                    {dc}/{day.problems.length}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>}

      {page === "tracker" && <>
      {/* TIMER */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #1a1a2a", background: "#0c0c14" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>Timer</div>
          <button className={`timer-btn ${timerRunning && timerMode === 15 ? "active" : ""}`} onClick={() => startTimer(15)}>
            15:00 <span style={{ fontSize: 10, opacity: 0.5 }}>1 prob</span>
          </button>
          <button className={`timer-btn ${timerRunning && timerMode === 30 ? "active" : ""}`} onClick={() => startTimer(30)}>
            30:00 <span style={{ fontSize: 10, opacity: 0.5 }}>2 prob</span>
          </button>
          {timerRunning && (
            <button className="timer-btn stop" onClick={() => { setTimerRunning(false); setTimerSeconds(0); }}>
              stop
            </button>
          )}
          {timerSeconds > 0 && (
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 100, height: 4, background: "#1a1a2a", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  width: `${100 - timerPct}%`, height: "100%", borderRadius: 2,
                  background: timerUrgent ? "#ff4444" : "#00ff88",
                  transition: "width 1s linear, background 0.5s",
                }} />
              </div>
              <span style={{
                fontSize: 20, fontWeight: 700, fontVariantNumeric: "tabular-nums",
                color: timerUrgent ? "#ff4444" : "#00ff88",
                ...(timerUrgent ? { animation: "pulse 1s infinite" } : {}),
              }}>
                {formatTime(timerSeconds)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* DAY CONTENT */}
      {currentDay && (
        <div style={{ padding: "20px 24px" }}>
          {/* Pattern header */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 6 }}>
              Day {currentDay.day}: {currentDay.pattern}
            </div>
            <div style={{
              display: "inline-block", padding: "8px 14px", background: "#12121f",
              border: "1px solid #1e1e30", borderRadius: 6, fontSize: 12, color: "#7788ff",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              💡 {currentDay.template}
            </div>
          </div>

          {/* Problem list */}
          <div>
            {currentDay.problems.map((problem, i) => {
              const key = `${activeDay}-${i}`;
              const isDone = !!completed[key];
              return (
                <div key={key} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div
                    className={`problem-row ${isDone ? "completed" : ""}`}
                    onClick={() => toggleProblem(key)}
                  >
                    <div className={`check-box ${isDone ? "checked" : ""}`}>
                      {isDone ? "✓" : ""}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: 14, fontWeight: 500,
                          color: isDone ? "#00ff8899" : "#ddd",
                          textDecoration: isDone ? "line-through" : "none",
                        }}>
                          {problem.name}
                        </span>
                        <span style={{
                          fontSize: 10, padding: "2px 7px", borderRadius: 4,
                          background: problem.difficulty === "Hard" ? "rgba(255,68,68,0.12)" :
                            problem.difficulty === "Easy" ? "rgba(0,255,136,0.08)" : "rgba(255,187,0,0.1)",
                          color: problem.difficulty === "Hard" ? "#ff6666" :
                            problem.difficulty === "Easy" ? "#00dd77" : "#ffbb00",
                          fontWeight: 600,
                        }}>
                          {problem.difficulty}
                        </span>
                        {problem.id > 0 && (
                          <span style={{ fontSize: 10, color: "#444" }}>#{problem.id}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                      {problem.url && (
                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontSize: 11, padding: "4px 10px", borderRadius: 4,
                            border: "1px solid #2a2a4a", background: "#12121a",
                          }}
                        >
                          LC ↗
                        </a>
                      )}
                      <button
                        style={{
                          fontSize: 11, padding: "4px 10px", borderRadius: 4,
                          border: "1px solid #2a2a4a", background: "#12121a",
                          color: showTip === key ? "#00ff88" : "#666",
                          cursor: "pointer", fontFamily: "inherit",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTip(showTip === key ? null : key);
                        }}
                      >
                        hint
                      </button>
                    </div>
                  </div>
                  {showTip === key && (
                    <div className="tip-bubble">
                      ⚡ {problem.tip}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Day progress */}
          <div style={{
            marginTop: 20, padding: "14px 16px", background: "#0c0c14",
            border: "1px solid #1a1a2a", borderRadius: 8, display: "flex",
            alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 12, color: "#555" }}>Day {currentDay.day} Progress</span>
            <span style={{
              fontSize: 14, fontWeight: 600,
              color: dayCompleted === currentDay.problems.length ? "#00ff88" : "#888",
            }}>
              {dayCompleted === currentDay.problems.length ? "✓ Complete" : `${dayCompleted}/${currentDay.problems.length}`}
            </span>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <button
              className="timer-btn"
              onClick={() => setActiveDay(Math.max(1, activeDay - 1))}
              style={{ opacity: activeDay === 1 ? 0.3 : 1 }}
              disabled={activeDay === 1}
            >
              ← Prev
            </button>
            <button
              className="timer-btn"
              onClick={() => setActiveDay(Math.min(14, activeDay + 1))}
              style={{ opacity: activeDay === 14 ? 0.3 : 1 }}
              disabled={activeDay === 14}
            >
              Next →
            </button>
          </div>
        </div>
      )}
      </>}
    </div>
  );
}