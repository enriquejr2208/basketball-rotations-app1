import React, { useMemo, useState } from "react";

const initialPlayers = [
  {
    name: "Ash",
    positions: "2/3",
    offense: 9,
    defense: 9,
    speed: 10,
    decision: 6,
    scoring: 8,
    mustPlay: true,
    strengths: "Quick, athletic, slasher, good defender, gets deflections and steals, pretty good from 3",
    weaknesses: "Decision making, turnovers",
    role: "Athletic wing",
  },
  {
    name: "Haley",
    positions: "2/3",
    offense: 6,
    defense: 6,
    speed: 7,
    decision: 7,
    scoring: 4,
    mustPlay: true,
    strengths: "Medium speed, good IQ, moves well without the ball, shooter",
    weaknesses: "Shot selection",
    role: "Shooter",
  },
  {
    name: "Evie",
    positions: "1/2",
    offense: 7,
    defense: 8,
    speed: 7,
    decision: 7,
    scoring: 7,
    mustPlay: true,
    strengths: "Quick, secure ball handler, can execute offense",
    weaknesses: "Over dribbling, bad inbounder",
    role: "Ball handler / shooter / defender",
  },
  {
    name: "Lys",
    positions: "1",
    offense: 5,
    defense: 8,
    speed: 7,
    decision: 7,
    scoring: 5,
    mustPlay: true,
    strengths: "Medium speed, good effort, good IQ, not bad shooter from 3",
    weaknesses: "Over dribbling, turnovers, bad at pick and rolls",
    role: "Ball handler / shooter / defender",
  },
  {
    name: "Ella",
    positions: "4/5",
    offense: 7,
    defense: 5,
    speed: 5,
    decision: 7,
    scoring: 4,
    mustPlay: true,
    strengths: "Senior, calms the team, good leadership, not the most efficient on offense",
    weaknesses: "Slow, cannot handle the ball",
    role: "Non-ball-handling big",
  },
  {
    name: "Jas",
    positions: "4/5",
    offense: 8,
    defense: 9,
    speed: 8,
    decision: 8,
    scoring: 7,
    mustPlay: true,
    strengths: "Quick, great effort, high activity on offense and defense, can handle the ball for a big",
    weaknesses: "Hasn't been as efficient in scoring recently",
    role: "Mobile big / stretch big",
  },
  {
    name: "Danielle",
    positions: "1/2",
    offense: 7,
    defense: 9,
    speed: 9,
    decision: 8,
    scoring: 5,
    mustPlay: true,
    strengths: "Quick, high activity, great defender, secure with the ball, likes to move the ball, low turnover",
    weaknesses: "Smaller player",
    role: "Lead guard / ball handler / strong defender",
  },
  {
    name: "Emily",
    positions: "2/3",
    offense: 4,
    defense: 3,
    speed: 4,
    decision: 7,
    scoring: 3,
    mustPlay: false,
    strengths: "Can shoot if open which is rare",
    weaknesses: "Slower, not a great defender, slow to load on shots",
    role: "Situational shooter",
  },
  {
    name: "Jolie",
    positions: "3/4",
    offense: 3,
    defense: 7,
    speed: 7,
    decision: 4,
    scoring: 4,
    mustPlay: false,
    strengths: "Quick, physical, good defender",
    weaknesses: "Low IQ, high turnover, does not execute plays effectively",
    role: "Energy defender",
  },
  {
    name: "Nika",
    positions: "3/4",
    offense: 4,
    defense: 7,
    speed: 8,
    decision: 6,
    scoring: 4,
    mustPlay: false,
    strengths: "Medium speed, good effort, wants to play defense",
    weaknesses: "Lack of experience",
    role: "Defensive forward",
  },
  {
    name: "Abbey",
    positions: "4/5",
    offense: 8,
    defense: 8,
    speed: 8,
    decision: 8,
    scoring: 8,
    mustPlay: true,
    strengths: "Mobile big, quick, active on both ends, can handle the ball for a big, good scorer around the basket",
    weaknesses: "Not physical",
    role: "Mobile big / defender",
  },
  {
    name: "Ellee",
    positions: "2/3",
    offense: 4,
    defense: 6,
    speed: 7,
    decision: 5,
    scoring: 4,
    mustPlay: true,
    strengths: "Medium speed, can defend, catch and shoot shooter",
    weaknesses: "Cannot create a shot for herself or others, IQ",
    role: "Shooter / defender",
  },
];

const buttonBase = "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition border";
const inputBase = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300";
const cardBase = "rounded-2xl border border-slate-200 bg-white shadow-sm";

function Icon({ label }: { label: string }) {
  return (
    <span aria-hidden="true" className="inline-flex h-5 w-5 items-center justify-center text-base leading-none">
      {label}
    </span>
  );
}

function getPlayerText(player) {
  return `${player.strengths || ""} ${player.role || ""} ${player.weaknesses || ""}`;
}

function hasPosition(player, pos) {
  return String(player.positions || "")
    .split(/[\/,.\s]+/)
    .filter(Boolean)
    .includes(String(pos));
}

function combinations(arr, size) {
  const result = [];

  function backtrack(start, combo) {
    if (combo.length === size) {
      result.push(combo);
      return;
    }

    for (let i = start; i < arr.length; i += 1) {
      backtrack(i + 1, [...combo, arr[i]]);
    }
  }

  backtrack(0, []);
  return result;
}

function analyseLineup(lineup) {
  const offense = lineup.reduce((sum, p) => sum + Number(p.offense || 0), 0);
  const defense = lineup.reduce((sum, p) => sum + Number(p.defense || 0), 0);
  const speed = lineup.reduce((sum, p) => sum + Number(p.speed || 0), 0);
  const decision = lineup.reduce((sum, p) => sum + Number(p.decision || 0), 0);
  const scoring = lineup.reduce((sum, p) => sum + Number(p.scoring || 0), 0);
  const total = offense + defense + speed + decision + scoring;

  const handlers = lineup.filter((p) =>
    hasPosition(p, 1) ||
    /ball handler|secure with the ball|secure ball handler|lead guard|pnr|pick and roll|execute offense|low turnover/i.test(getPlayerText(p))
  );

  const bigs = lineup.filter((p) =>
    hasPosition(p, 4) || hasPosition(p, 5) || /big|anchor|interior|post|frontcourt/i.test(getPlayerText(p))
  );

  const shooters = lineup.filter((p) => /shoot|shooter|stretch|3/i.test(getPlayerText(p)));

  const creators = lineup.filter(
    (p) =>
      /create|slasher|pick and roll|ball handler|execute offense|handle the ball/i.test(getPlayerText(p)) &&
      !/cannot create/i.test(String(p.weaknesses || ""))
  );

  const decisionSupport = lineup.filter((p) =>
    /good iq|secure|low turnover|likes to move the ball|calms the team|leadership|execute offense/i.test(getPlayerText(p))
  );

  const lowDecision = lineup.filter((p) =>
    /low iq|bad decision|decision making|turnover|does not execute|doesn't execute|iq/i.test(String(p.weaknesses || ""))
  );

  const nonCreators = lineup.filter((p) =>
    /cannot create|cannot handle|bad at pick and rolls|slow to load/i.test(String(p.weaknesses || ""))
  );

  const lowValue = lineup.filter((p) => Number(p.offense || 0) + Number(p.defense || 0) <= 10);

  const flags = [];
  if (handlers.length < 1) flags.push("No clear ball handler");
  if (bigs.length < 1) flags.push("No big/interior anchor");
  if (handlers.length < 2) flags.push("Only one decision-maker/handler");
  if (creators.length < 2) flags.push("Limited shot creation");
  if (decision < 30) flags.push("Low total decision-making score");
  if (scoring < 25) flags.push("Low scoring punch");
  if (speed < 30) flags.push("Low team speed");
  if (lowValue.length >= 2) flags.push("Two or more low-value players together");
  if (lowDecision.length && decisionSupport.length < 2) flags.push("Decision-risk player needs stronger IQ/guard support");
  if (nonCreators.length >= 3) flags.push("Too many non-creators together");

  const score =
    total +
    handlers.length * 3 +
    bigs.length * 2 +
    shooters.length +
    creators.length * 2 +
    decisionSupport.length * 2 -
    flags.length * 5;

  return {
    offense,
    defense,
    speed,
    decision,
    scoring,
    total,
    score,
    handlers,
    bigs,
    shooters,
    creators,
    decisionSupport,
    lowDecision,
    lowValue,
    nonCreators,
    flags,
  };
}

function runDiagnostics() {
  const noHandlerLineup = [
    { name: "W1", positions: "2/3", offense: 5, defense: 5, speed: 6, decision: 6, scoring: 5, strengths: "Wing", weaknesses: "", role: "Wing" },
    { name: "W2", positions: "2/3", offense: 5, defense: 5, speed: 6, decision: 6, scoring: 5, strengths: "Wing", weaknesses: "", role: "Wing" },
    { name: "F1", positions: "3/4", offense: 5, defense: 5, speed: 6, decision: 6, scoring: 5, strengths: "Forward", weaknesses: "", role: "Forward" },
    { name: "B1", positions: "4/5", offense: 5, defense: 5, speed: 6, decision: 6, scoring: 5, strengths: "Big", weaknesses: "", role: "Big" },
    { name: "B2", positions: "4/5", offense: 5, defense: 5, speed: 6, decision: 6, scoring: 5, strengths: "Big", weaknesses: "", role: "Big" },
  ];

  const noBigLineup = [
    { name: "G1", positions: "1", offense: 5, defense: 5, speed: 7, decision: 7, scoring: 5, strengths: "Ball handler", weaknesses: "", role: "Point guard" },
    { name: "G2", positions: "1/2", offense: 5, defense: 5, speed: 7, decision: 7, scoring: 5, strengths: "Ball handler", weaknesses: "", role: "Guard" },
    { name: "W1", positions: "2/3", offense: 5, defense: 5, speed: 7, decision: 7, scoring: 5, strengths: "Shooter", weaknesses: "", role: "Wing" },
    { name: "W2", positions: "2/3", offense: 5, defense: 5, speed: 7, decision: 7, scoring: 5, strengths: "Shooter", weaknesses: "", role: "Wing" },
    { name: "W3", positions: "3", offense: 5, defense: 5, speed: 7, decision: 7, scoring: 5, strengths: "Defender", weaknesses: "", role: "Wing" },
  ];

  const jolieRiskLineup = [
    { name: "Jolie", positions: "3/4", offense: 3, defense: 6, speed: 7, decision: 4, scoring: 4, strengths: "Quick defender", weaknesses: "Low IQ, bad decision making", role: "Energy defender" },
    { name: "W1", positions: "2/3", offense: 5, defense: 5, speed: 7, decision: 5, scoring: 5, strengths: "Shooter", weaknesses: "", role: "Wing" },
    { name: "W2", positions: "2/3", offense: 5, defense: 5, speed: 7, decision: 5, scoring: 5, strengths: "Shooter", weaknesses: "", role: "Wing" },
    { name: "B1", positions: "4/5", offense: 5, defense: 5, speed: 7, decision: 5, scoring: 5, strengths: "Big", weaknesses: "", role: "Big" },
    { name: "G1", positions: "1", offense: 5, defense: 5, speed: 7, decision: 5, scoring: 5, strengths: "Ball handler", weaknesses: "", role: "Guard" },
  ];

  const goodLineup = [
    { name: "Danielle", positions: "1/2", offense: 7, defense: 9, speed: 9, decision: 8, scoring: 5, strengths: "PnR, ball handler, low turnover", weaknesses: "", role: "Lead guard" },
    { name: "Evie", positions: "1/2", offense: 7, defense: 8, speed: 7, decision: 7, scoring: 7, strengths: "Ball handler, shooter, execute offense", weaknesses: "", role: "Guard" },
    { name: "Ash", positions: "2/3", offense: 9, defense: 9, speed: 10, decision: 7, scoring: 8, strengths: "Athletic wing, slasher", weaknesses: "", role: "Core wing" },
    { name: "Jas", positions: "4/5", offense: 8, defense: 9, speed: 8, decision: 8, scoring: 7, strengths: "Mobile big, stretch", weaknesses: "", role: "Mobile big" },
    { name: "Abbey", positions: "4/5", offense: 8, defense: 8, speed: 8, decision: 8, scoring: 8, strengths: "Mobile big, defender", weaknesses: "", role: "Defensive anchor" },
  ];

  const lowSpeedLineup = [
    { name: "S1", positions: "1", offense: 5, defense: 5, speed: 4, decision: 7, scoring: 5, strengths: "Ball handler", weaknesses: "", role: "Guard" },
    { name: "S2", positions: "2", offense: 5, defense: 5, speed: 4, decision: 7, scoring: 5, strengths: "Shooter", weaknesses: "", role: "Guard" },
    { name: "S3", positions: "3", offense: 5, defense: 5, speed: 4, decision: 7, scoring: 5, strengths: "Shooter", weaknesses: "", role: "Wing" },
    { name: "S4", positions: "4", offense: 5, defense: 5, speed: 4, decision: 7, scoring: 5, strengths: "Big", weaknesses: "", role: "Big" },
    { name: "S5", positions: "5", offense: 5, defense: 5, speed: 4, decision: 7, scoring: 5, strengths: "Big", weaknesses: "", role: "Big" },
  ];

  const lowScoringLineup = [
    { name: "D1", positions: "1", offense: 5, defense: 8, speed: 7, decision: 7, scoring: 4, strengths: "Ball handler", weaknesses: "", role: "Guard" },
    { name: "D2", positions: "2", offense: 5, defense: 8, speed: 7, decision: 7, scoring: 4, strengths: "Shooter", weaknesses: "", role: "Guard" },
    { name: "D3", positions: "3", offense: 5, defense: 8, speed: 7, decision: 7, scoring: 4, strengths: "Shooter", weaknesses: "", role: "Wing" },
    { name: "D4", positions: "4", offense: 5, defense: 8, speed: 7, decision: 7, scoring: 4, strengths: "Big", weaknesses: "", role: "Big" },
    { name: "D5", positions: "5", offense: 5, defense: 8, speed: 7, decision: 7, scoring: 4, strengths: "Big", weaknesses: "", role: "Big" },
  ];

  const tests = [
    {
      name: "Flags no ball handler",
      pass: analyseLineup(noHandlerLineup).flags.includes("No clear ball handler"),
    },
    {
      name: "Flags no big/interior anchor",
      pass: analyseLineup(noBigLineup).flags.includes("No big/interior anchor"),
    },
    {
      name: "Flags decision-risk player without enough guard support",
      pass: analyseLineup(jolieRiskLineup).flags.includes("Decision-risk player needs stronger IQ/guard support"),
    },
    {
      name: "Accepts strong balanced lineup",
      pass: analyseLineup(goodLineup).flags.length === 0,
    },
    {
      name: "Flags low team speed",
      pass: analyseLineup(lowSpeedLineup).flags.includes("Low team speed"),
    },
    {
      name: "Flags low scoring punch",
      pass: analyseLineup(lowScoringLineup).flags.includes("Low scoring punch"),
    },
  ];

  return tests;
}

export default function BasketballRotationPlanner() {
  const [players, setPlayers] = useState(initialPlayers);
  const [scenario, setScenario] = useState("Balanced");
  const [selected, setSelected] = useState([]);
  const [showTests, setShowTests] = useState(false);

  const lineups = useMemo(() => {
    return combinations(players.filter((p) => String(p.name || "").trim()), 5)
      .map((lineup) => ({ lineup, analysis: analyseLineup(lineup) }))
      .sort((a, b) => b.analysis.score - a.analysis.score);
  }, [players]);

  const scenarioLineups = useMemo(() => {
    const sorted = [...lineups];

    if (scenario === "Offense") {
      sorted.sort((a, b) => b.analysis.offense - a.analysis.offense || b.analysis.scoring - a.analysis.scoring || b.analysis.score - a.analysis.score);
    }

    if (scenario === "Defense") {
      sorted.sort((a, b) => b.analysis.defense - a.analysis.defense || b.analysis.score - a.analysis.score);
    }

    if (scenario === "Speed") {
      sorted.sort((a, b) => b.analysis.speed - a.analysis.speed || b.analysis.score - a.analysis.score);
    }

    if (scenario === "Ball Control") {
      sorted.sort((a, b) => b.analysis.decision - a.analysis.decision || b.analysis.handlers.length - a.analysis.handlers.length || b.analysis.score - a.analysis.score);
    }

    if (scenario === "Development") {
      sorted.sort((a, b) => {
        const aDev = a.lineup.filter((p) => !p.mustPlay).length;
        const bDev = b.lineup.filter((p) => !p.mustPlay).length;
        return bDev - aDev || b.analysis.score - a.analysis.score;
      });
    }

    return sorted.slice(0, 8);
  }, [lineups, scenario]);

  function updatePlayer(index, field, value) {
    const updated = [...players];
    updated[index] = { ...updated[index], [field]: value };
    setPlayers(updated);
  }

  function addPlayer() {
    setPlayers([
      ...players,
      {
        name: "",
        positions: "",
        offense: 5,
        defense: 5,
        speed: 5,
        decision: 5,
        scoring: 5,
        mustPlay: false,
        strengths: "",
        weaknesses: "",
        role: "",
      },
    ]);
  }

  function removePlayer(index) {
    const removedName = players[index].name;
    setPlayers(players.filter((_, i) => i !== index));
    setSelected(selected.filter((name) => name !== removedName));
  }

  function toggleSelected(name) {
    if (!name) return;

    if (selected.includes(name)) {
      setSelected(selected.filter((n) => n !== name));
    } else if (selected.length < 5) {
      setSelected([...selected, name]);
    }
  }

  function resetSelection() {
    setSelected([]);
  }

  const selectedLineup = players.filter((p) => selected.includes(p.name));
  const selectedAnalysis = selectedLineup.length === 5 ? analyseLineup(selectedLineup) : null;
  const diagnostics = runDiagnostics();
  const passedTests = diagnostics.filter((test) => test.pass).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Basketball Rotation Planner</h1>
            <p className="mt-2 max-w-3xl text-slate-600">
              Build safe, competitive lineups using positions, offence value, defence value, speed, decision-making, scoring, strengths and weaknesses.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Balanced", "Offense", "Defense", "Speed", "Ball Control", "Development"].map((s) => (
              <button
                key={s}
                className={`${buttonBase} ${
                  scenario === s
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100"
                }`}
                onClick={() => setScenario(s)}
                type="button"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className={`${cardBase} lg:col-span-2`}>
            <div className="p-4 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-xl font-semibold"><Icon label="👥" /> Player List</h2>
                <button onClick={addPlayer} className={`${buttonBase} border-slate-900 bg-slate-900 text-white`} type="button">
                  <span className="mr-1">＋</span> Add Player
                </button>
              </div>

              <div className="mb-2 hidden grid-cols-[repeat(14,minmax(0,1fr))] gap-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
                <div className="col-span-2">Name</div>
                <div>Pos</div>
                <div>Off</div>
                <div>Def</div>
                <div>Spd</div>
                <div>IQ</div>
                <div>Score</div>
                <div className="col-span-2">Strengths</div>
                <div className="col-span-2">Weaknesses</div>
                <div></div>
              </div>

              <div className="space-y-3">
                {players.map((p, i) => (
                  <div key={`${p.name}-${i}`} className="grid grid-cols-1 gap-2 rounded-2xl border bg-slate-50 p-3 md:grid-cols-[repeat(14,minmax(0,1fr))]">
                    <input
                      className={`${inputBase} md:col-span-2`}
                      placeholder="Name"
                      value={p.name}
                      onChange={(e) => updatePlayer(i, "name", e.target.value)}
                    />
                    <input
                      className={inputBase}
                      placeholder="2/3"
                      value={p.positions}
                      onChange={(e) => updatePlayer(i, "positions", e.target.value)}
                    />
                    <input
                      className={inputBase}
                      type="number"
                      min="1"
                      max="10"
                      value={p.offense}
                      onChange={(e) => updatePlayer(i, "offense", Number(e.target.value))}
                    />
                    <input
                      className={inputBase}
                      type="number"
                      min="1"
                      max="10"
                      value={p.defense}
                      onChange={(e) => updatePlayer(i, "defense", Number(e.target.value))}
                    />
                    <input
                      className={inputBase}
                      type="number"
                      min="1"
                      max="10"
                      value={p.speed || 0}
                      onChange={(e) => updatePlayer(i, "speed", Number(e.target.value))}
                    />
                    <input
                      className={inputBase}
                      type="number"
                      min="1"
                      max="10"
                      value={p.decision || 0}
                      onChange={(e) => updatePlayer(i, "decision", Number(e.target.value))}
                    />
                    <input
                      className={inputBase}
                      type="number"
                      min="1"
                      max="10"
                      value={p.scoring || 0}
                      onChange={(e) => updatePlayer(i, "scoring", Number(e.target.value))}
                    />
                    <input
                      className={`${inputBase} md:col-span-2`}
                      placeholder="Strengths"
                      value={p.strengths}
                      onChange={(e) => updatePlayer(i, "strengths", e.target.value)}
                    />
                    <input
                      className={`${inputBase} md:col-span-2`}
                      placeholder="Weaknesses"
                      value={p.weaknesses}
                      onChange={(e) => updatePlayer(i, "weaknesses", e.target.value)}
                    />
                    <button
                      className={`${buttonBase} border-transparent text-slate-500 hover:bg-slate-200`}
                      onClick={() => removePlayer(i)}
                      type="button"
                      title="Remove player"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={cardBase}>
            <div className="space-y-4 p-4 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Manual Lineup Checker</h2>
                <button className={`${buttonBase} border-slate-200 bg-white text-slate-700 hover:bg-slate-100`} onClick={resetSelection} type="button">
                  Clear
                </button>
              </div>
              <p className="text-sm text-slate-600">Pick any 5 players and check if the lineup is safe.</p>
              <div className="grid grid-cols-2 gap-2">
                {players.filter((p) => String(p.name || "").trim()).map((p) => (
                  <button
                    key={p.name}
                    className={`${buttonBase} ${
                      selected.includes(p.name)
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100"
                    }`}
                    onClick={() => toggleSelected(p.name)}
                    type="button"
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              {selectedAnalysis ? (
                <div className="space-y-2 rounded-2xl border bg-slate-50 p-4">
                  <div className="font-semibold">Selected: {selectedLineup.map((p) => p.name).join(", ")}</div>
                  <div className="text-sm">
                    Offence: {selectedAnalysis.offense} | Defence: {selectedAnalysis.defense} | Speed: {selectedAnalysis.speed} | IQ: {selectedAnalysis.decision} | Scoring: {selectedAnalysis.scoring}
                  </div>
                  <div className="text-sm">
                    Handlers: {selectedAnalysis.handlers.length} | Bigs: {selectedAnalysis.bigs.length} | Shooters: {selectedAnalysis.shooters.length} | Creators: {selectedAnalysis.creators.length}
                  </div>
                  {selectedAnalysis.flags.length ? (
                    <div className="flex gap-2 text-sm text-red-700"><span>⚠️</span> {selectedAnalysis.flags.join("; ")}</div>
                  ) : (
                    <div className="text-sm text-green-700">✅ Safe lineup — balanced coverage.</div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-slate-500">Select exactly 5 players. Selected: {selected.length}/5</div>
              )}
            </div>
          </div>
        </div>

        <div className={cardBase}>
          <div className="p-4 md:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold"><Icon label="⚡" /> Recommended Lineups: {scenario}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {scenarioLineups.map(({ lineup, analysis }, i) => (
                <div key={`${scenario}-${i}`} className="space-y-3 rounded-2xl border bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold">Lineup {i + 1}</div>
                    <div className="rounded-full bg-white px-2 py-1 text-sm">Score {Math.round(analysis.score)}</div>
                  </div>
                  <div className="text-sm font-medium">{lineup.map((p) => p.name).join(" • ")}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>Off: {analysis.offense}</div>
                    <div>Def: {analysis.defense}</div>
                    <div>Speed: {analysis.speed}</div>
                    <div>IQ: {analysis.decision}</div>
                    <div>Scoring: {analysis.scoring}</div>
                    <div>Handlers: {analysis.handlers.length}</div>
                    <div>Bigs: {analysis.bigs.length}</div>
                    <div>Shooters: {analysis.shooters.length}</div>
                    <div>Creators: {analysis.creators.length}</div>
                    <div>Total: {analysis.total}</div>
                  </div>
                  {analysis.flags.length ? (
                    <div className="rounded-xl bg-red-50 p-2 text-xs text-red-700">⚠️ {analysis.flags.join("; ")}</div>
                  ) : (
                    <div className="rounded-xl bg-green-50 p-2 text-xs text-green-700">🛡️ Balanced and safe.</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={cardBase}>
          <div className="p-4 md:p-6">
            <h2 className="mb-3 text-xl font-semibold">Coaching Rules Built Into The App</h2>
            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-4">
              <div className="rounded-2xl border bg-slate-50 p-3"><b>Ball Security</b><br />Avoid lineups with no true guard or only one weak decision-maker.</div>
              <div className="rounded-2xl border bg-slate-50 p-3"><b>Big Coverage</b><br />Keep at least one 4/5 or interior anchor on court.</div>
              <div className="rounded-2xl border bg-slate-50 p-3"><b>Decision Risk</b><br />Players like Jolie can play, but need strong handlers and high-IQ support around them.</div>
              <div className="rounded-2xl border bg-slate-50 p-3"><b>Competitive Balance</b><br />Avoid stacking too many low-value players, non-creators or low-scorers together.</div>
            </div>
          </div>
        </div>

        <div className={cardBase}>
          <div className="p-4 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Built-in Diagnostics</h2>
                <p className="text-sm text-slate-600">These checks confirm the core lineup rules are working inside the preview.</p>
              </div>
              <button
                className={`${buttonBase} border-slate-200 bg-white text-slate-700 hover:bg-slate-100`}
                onClick={() => setShowTests(!showTests)}
                type="button"
              >
                {showTests ? "Hide Tests" : "Show Tests"} ({passedTests}/{diagnostics.length} passing)
              </button>
            </div>
            {showTests && (
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {diagnostics.map((test) => (
                  <div key={test.name} className={`rounded-2xl border p-3 text-sm ${test.pass ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                    {test.pass ? "✅" : "❌"} {test.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
