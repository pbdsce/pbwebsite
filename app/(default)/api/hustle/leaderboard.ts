interface Participant {
  [key: string]: [string, string, string]; // [handle, displayName, avatarUrl]
}

interface ContestData {
  id: number;
  title: string;
  begin: number;
  length: number;
  isReplay: boolean;
  participants: {
    [key: string]: [string, string, string];
  };
  submissions: number[][]; // Changed from Submission[][]
}

interface UserProblem {
  try: number;
  ok: boolean;
  tim: number | null;
  sub?: { v: number; t: number; }[];
}

interface UserScore {
  info: [string, string, string];
  prob: Map<number, UserProblem>;
  tot: number;
}

interface ProblemDetail {
  id: number;
  ok: boolean;
  try: number;
  tim: number;
}

interface BoardEntry {
  id: string;
  nam: string;
  disp: string;
  tot: number;
  pen: number;
  dtl: ProblemDetail[];
}


function sort(subs: number[][], contestLength: number): number[][] {
    return subs
        .sort((a,b) => a[3] - b[3])
        .filter(s => s[3] <= contestLength); // Filter submissions within contest duration
}

export function lead(data: ContestData, contestLength: number): BoardEntry[] {
    const pen = 1200;
    const scr: {
        [key: string]: {
            prb: Map<number, { try: number; ok: boolean; tim: number }>;
            tot: number;
            pen: number;
            inf: [string, string, string];
        }
    } = {};
    
    for(let id in data.participants) {
        scr[id] = {
            prb: new Map(),
            tot: 0,
            pen: 0,
            inf: data.participants[id]
        };
    }
    
    const subs = sort(data.submissions, contestLength);
    for(let s of subs) {
        const usr = scr[s[0]];
        if(!usr.prb.has(s[1])) {
            usr.prb.set(s[1], {try:0, ok:false, tim:0});
        }
        const prb = usr.prb.get(s[1]);
        if (!prb) continue;
        
        if(!prb.ok) {
            if(s[2] === 1) {
                prb.ok = true;
                prb.tim = s[3];
                usr.tot++;
                usr.pen += s[3] + (prb.try * pen);
            } else {
                prb.try++;
            }
        }
    }
    
    const brd: BoardEntry[] = [];
    for(let id in scr) {
        const d = scr[id];
        brd.push({
            id,
            nam: d.inf[0],
            disp: d.inf[1] || d.inf[0],
            tot: d.tot,
            pen: d.pen,
            dtl: Array.from(d.prb.entries()).map(([i,p]) => ({
                id: i,
                ok: p.ok,
                try: p.try,
                tim: p.tim
            }))
        });
    }
    
    brd.sort((a,b) => {
        if(b.tot !== a.tot) return b.tot - a.tot;
        if(a.pen !== b.pen) return a.pen - b.pen;
        return a.nam.localeCompare(b.nam);
    });
    
    return brd;
}
