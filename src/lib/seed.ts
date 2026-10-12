import type { Affiliate, Category, Post, Subscriber, Tool } from "@/lib/types";
import { readMinutes } from "@/lib/format";

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor" | "writer";
  active: boolean;
  password: string;
}

export interface DemoDb {
  version: 1;
  users: DemoUser[];
  categories: Category[];
  posts: Post[];
  tools: Tool[];
  affiliates: Affiliate[];
  subscribers: Subscriber[];
  session: {
    userId: string;
    email: string;
    name: string;
    role: "admin" | "editor" | "writer";
  } | null;
}

const ANCHOR = Date.parse("2026-10-12T18:00:00.000Z");
const ago = (hours: number) => new Date(ANCHOR - hours * 3600_000).toISOString();

function article(lead: string, sections: Array<[string, string]>): string {
  return [
    "> Placeholder — Stackwise demo copy. Not a real lab result, and not a recommendation to spend money.",
    "",
    lead,
    "",
    ...sections.flatMap(([heading, paragraph]) => [`## ${heading}`, "", paragraph, ""]),
  ].join("\n");
}

function post(input: Omit<Post, "readMinutes" | "body"> & { body: string }): Post {
  return { ...input, readMinutes: readMinutes(input.body) };
}

export const SEED_CATEGORIES: Category[] = [
  {
    id: "cat-crypto",
    slug: "crypto",
    name: "Crypto",
    description: "Wallets, custody, and on-chain tools we actually opened.",
  },
  {
    id: "cat-ai",
    slug: "ai-tools",
    name: "AI Tools",
    description: "Models and apps tested on real work, not a demo prompt.",
  },
  {
    id: "cat-saas",
    slug: "saas",
    name: "SaaS",
    description: "Software a small team can justify on a real invoice.",
  },
  {
    id: "cat-reviews",
    slug: "reviews",
    name: "Reviews",
    description: "Single-product tests with a clear keep or skip.",
  },
  {
    id: "cat-comparisons",
    slug: "comparisons",
    name: "Comparisons",
    description: "Head-to-head tests that share one task list.",
  },
  {
    id: "cat-guides",
    slug: "guides",
    name: "Guides",
    description: "How we test, and how to do the careful version yourself.",
  },
  {
    id: "cat-deals",
    slug: "deals",
    name: "Deals",
    description: "Annual plans and upgrades that still look fair this month.",
  },
];

export const SEED_AFFILIATES: Affiliate[] = [
  { id: "aff-ledger", name: "Ledger", url: "https://example.com/go/ledger" },
  { id: "aff-cursor", name: "Cursor", url: "https://example.com/go/cursor" },
  { id: "aff-proton", name: "Proton Pass", url: "https://example.com/go/proton-pass" },
  { id: "aff-linear", name: "Linear", url: "https://example.com/go/linear" },
  { id: "aff-phantom", name: "Phantom", url: "https://example.com/go/phantom" },
];

export const SEED_TOOLS: Tool[] = [
  {
    id: "tool-ledger",
    name: "Ledger Flex",
    category: "Hardware wallet",
    rating: 9.2,
    affiliateId: "aff-ledger",
    rank: 1,
    blurb: "A screen you can read and a backup you can explain.",
  },
  {
    id: "tool-cursor",
    name: "Cursor",
    category: "AI editor",
    rating: 9.0,
    affiliateId: "aff-cursor",
    rank: 2,
    blurb: "The coding assistant we actually left installed.",
  },
  {
    id: "tool-proton",
    name: "Proton Pass",
    category: "Passwords",
    rating: 8.7,
    affiliateId: "aff-proton",
    rank: 3,
    blurb: "The manager we let near a throwaway seed phrase.",
  },
  {
    id: "tool-linear",
    name: "Linear",
    category: "Issue tracker",
    rating: 8.6,
    affiliateId: "aff-linear",
    rank: 4,
    blurb: "Fast enough that the team files the bug.",
  },
  {
    id: "tool-phantom",
    name: "Phantom",
    category: "Software wallet",
    rating: 8.1,
    affiliateId: "aff-phantom",
    rank: 5,
    blurb: "Fine for small tests. Not where savings live.",
  },
];

const bodyAi = article(
  "We gave fourteen writing tools the same brief: a 700-word buyer note, a skeptical edit, and a list of claims that had to be sourced. Most of them sounded confident and cited nothing.",
  [
    ["What we measured", "Speed, how often a claim was invented, and whether a human editor still had a job at the end. A tool that saved drafting time but added fact-checking time did not win."],
    ["What survived", "One editor-style assistant kept citations next to the sentence that needed them and refused to invent a price. The others buried guesses in smooth prose. Placeholder scores only — rerun this before you pay."],
  ],
);

const bodyWallet = article(
  "A hardware wallet is a boring product until the backup fails. We set up three devices, restored them onto a spare phone, and wrote down every step a non-expert would actually do.",
  [
    ["The checklist", "Can you read the address on the device itself? Can a second person repeat the restore from the card alone? Does the app nag you into a cloud backup? Two of the three failed the second question."],
    ["The keep", "The device with a readable screen and a plain-language card stayed on our desk. The pretty app that wanted our email did not."],
  ],
);

const bodySaas = article(
  "Fifty dollars a month is the whole software budget for a lot of two-person teams. We rebuilt a week of work inside that cap: notes, issues, passwords, and one AI seat.",
  [
    ["What made the cut", "Tools that replace a spreadsheet you already resent, with an annual price you can read on one screen. Free tiers that hold data hostage after 50 items did not count as free."],
    ["What we skipped", "Suites that need an admin certification. If the onboarding video is longer than the work, it is not a small-team tool."],
  ],
);

const bodyModels = article(
  "Same brief, three research models, no favorite going in. The task was a comparison of two password managers with sources a reader could click.",
  [
    ["The split", "One model wrote the cleanest prose and invented a pricing tier. One was dull and accurate. One refused the task until we pasted the docs. Dull and accurate won the draft."],
    ["How to copy the test", "Freeze the sources first. If the model cannot point at a line you provided, the sentence does not ship. This page is a placeholder for that method, not a live scoreboard."],
  ],
);

const bodyGuide = article(
  "Stackwise does not score a wallet from the marketing site. This is the short version of the method, so a reader can see what a 'test' means here.",
  [
    ["Setup", "We buy or install the product ourselves, on a clean profile, and ignore the founder demo. Affiliate links are added after the notes, never before."],
    ["The three questions", "Can a new person finish the job without chat support? What happens when the network, the file, or the backup is wrong? Would we still use it if the link paid us nothing?"],
  ],
);

const bodyNotion = article(
  "Notion AI is already where the notes live, which is a real advantage. We still ran three specialist tools against it on the same meeting transcript.",
  [
    ["Convenience versus craft", "The built-in assistant summarized fastest. A specialist tool caught the action items the built-in one smoothed over. Convenience won for a recap. It lost for a decision log."],
    ["The practical pick", "Keep the notes where the team already writes. Pay for a second tool only if the misses are expensive. Placeholder conclusion, not a sponsored ranking."],
  ],
);

const bodyStable = article(
  "Cash accounts that pay a yield on stablecoins advertise a rate and a logo. We cared about withdrawal timing, what the reserve page actually says, and what happens on a weekend.",
  [
    ["What we tried to break", "A small deposit, a full withdrawal, and a support question asked in plain language. Any account that could not explain the reserve in one paragraph stayed off the list."],
    ["A cautious read", "A rate is not a review. If you cannot name who holds the dollars, you do not have a cash account. You have a slogan."],
  ],
);

const bodyDeals = article(
  "Annual plans look cheap in a banner and expensive in March. We priced four renewals against the monthly plan and against the free tier we would actually tolerate.",
  [
    ["Worth a look", "The discount counts only if you used the tool every week of the trial. A 40% banner on software you open twice is not a deal."],
    ["Skip", "Lifetime licenses on products that need a server next year. Placeholder prices — check the vendor before you checkout."],
  ],
);

const bodyCustody = article(
  "Self-custody has a loud culture and a quiet job: hold a backup you can still find in a year. This is a first-week guide with the theatrics removed.",
  [
    ["Week one", "Write the backup by hand. Restore it once onto a second device before any real balance moves. Store the copy somewhere you will remember without a riddle."],
    ["What we do not do", "We do not tell you which coin to buy. The guide stops at 'can you recover it.' The placeholder wallet link is labeled, and it is optional."],
  ],
);

const bodyTrackers = article(
  "Six people, one week, the same bugs. We ran Linear, Height, and Jira on a shared list and counted how many issues were filed without being asked.",
  [
    ["Speed", "The tracker people open without a meeting wins. Setup time counted against the tool. A painful admin console erased a pretty board."],
    ["The boring result", "The fastest tracker collected more real bugs. The most configurable one collected a workflow document. Placeholder timing, not a procurement report."],
  ],
);

const bodyBudget = article(
  "Draft notes from a writer pass. A budgeting app promised envelopes, then hid the export behind a higher tier. Not ready to publish.",
  [
    ["Still open", "Need a second week of receipts and a check that the CSV actually contains categories. Do not treat this draft as a review."],
  ],
);

const bodyFees = article(
  "In review. A fee comparison is easy to fake if you only quote the banner rate. This draft lines up maker, taker, and withdrawal fees on the same notional.",
  [
    ["Needs an editor", "The table is half-filled and one exchange changed fees mid-draft. Holding for a second pass before anyone hits publish."],
  ],
);

export const SEED_POSTS: Post[] = [
  post({
    id: "post-ai-writers",
    slug: "ai-writers-30-day-test",
    title: "We ran 14 AI writers for 30 days. One draft was actually usable.",
    summary: "Most of the tools wrote smoothly and invented facts. Here is the short test we used, and the one assistant that stayed on the brief.",
    body: bodyAi,
    categoryId: "cat-ai",
    coverUrl: "",
    featured: true,
    status: "published",
    authorId: "user-editor",
    authorName: "Amina Cole",
    youtubeUrl: "",
    duration: "",
    isTest: false,
    affiliateId: "aff-cursor",
    createdAt: ago(1),
    updatedAt: ago(1),
    publishedAt: ago(1),
  }),
  post({
    id: "post-wallets",
    slug: "hardware-wallet-checklist",
    title: "Ledger, Trezor, and a weekend of restores: what survived the checklist",
    summary: "We set up three hardware wallets and restored them from the card alone. Pretty apps were not the point.",
    body: bodyWallet,
    categoryId: "cat-crypto",
    coverUrl: "",
    featured: true,
    status: "published",
    authorId: "user-editor",
    authorName: "Amina Cole",
    youtubeUrl: "",
    duration: "",
    isTest: false,
    affiliateId: "aff-ledger",
    createdAt: ago(2),
    updatedAt: ago(2),
    publishedAt: ago(2),
  }),
  post({
    id: "post-saas",
    slug: "saas-stack-under-fifty",
    title: "The SaaS stack we would pay for on a fifty-dollar budget",
    summary: "Notes, issues, passwords, and one AI seat. Everything else lost to a spreadsheet we already understand.",
    body: bodySaas,
    categoryId: "cat-saas",
    coverUrl: "",
    featured: true,
    status: "published",
    authorId: "user-admin",
    authorName: "Sam Okonkwo",
    youtubeUrl: "",
    duration: "",
    isTest: false,
    affiliateId: "aff-linear",
    createdAt: ago(3),
    updatedAt: ago(3),
    publishedAt: ago(3),
  }),
  post({
    id: "post-models",
    slug: "research-models-one-brief",
    title: "Three research models, one brief, no favorite",
    summary: "The cleanest prose invented a price. The dull draft was the one we would ship. A placeholder video of the method.",
    body: bodyModels,
    categoryId: "cat-comparisons",
    coverUrl: "",
    featured: false,
    status: "published",
    authorId: "user-editor",
    authorName: "Amina Cole",
    youtubeUrl: "https://www.youtube.com/results?search_query=stackwise+placeholder+research+models",
    duration: "12:04",
    isTest: true,
    affiliateId: "aff-cursor",
    createdAt: ago(4),
    updatedAt: ago(4),
    publishedAt: ago(4),
  }),
  post({
    id: "post-method",
    slug: "how-we-test-wallets",
    title: "How Stackwise tests a crypto wallet before it earns a link",
    summary: "Affiliate links come after the notes. These are the three questions a wallet has to pass first.",
    body: bodyGuide,
    categoryId: "cat-guides",
    coverUrl: "",
    featured: false,
    status: "published",
    authorId: "user-editor",
    authorName: "Amina Cole",
    youtubeUrl: "",
    duration: "",
    isTest: false,
    affiliateId: "aff-ledger",
    createdAt: ago(5),
    updatedAt: ago(5),
    publishedAt: ago(5),
  }),
  post({
    id: "post-notion",
    slug: "notion-ai-alternatives",
    title: "Notion AI is convenient. These three tools were sharper.",
    summary: "Built-in won the recap. A specialist caught the decisions. We would not pay for both without a reason.",
    body: bodyNotion,
    categoryId: "cat-reviews",
    coverUrl: "",
    featured: false,
    status: "published",
    authorId: "user-editor",
    authorName: "Amina Cole",
    youtubeUrl: "https://www.youtube.com/results?search_query=stackwise+placeholder+notion+ai",
    duration: "08:41",
    isTest: true,
    affiliateId: "aff-cursor",
    createdAt: ago(6),
    updatedAt: ago(6),
    publishedAt: ago(6),
  }),
  post({
    id: "post-stable",
    slug: "stablecoin-cash-accounts",
    title: "Stablecoin cash accounts, after we tried to break a withdrawal",
    summary: "A yield is not a review. We asked who holds the dollars, then requested the money back on a Friday.",
    body: bodyStable,
    categoryId: "cat-crypto",
    coverUrl: "",
    featured: false,
    status: "published",
    authorId: "user-admin",
    authorName: "Sam Okonkwo",
    youtubeUrl: "https://www.youtube.com/results?search_query=stackwise+placeholder+stablecoin+account",
    duration: "15:20",
    isTest: true,
    affiliateId: "aff-phantom",
    createdAt: ago(8),
    updatedAt: ago(8),
    publishedAt: ago(8),
  }),
  post({
    id: "post-deals",
    slug: "annual-plans-worth-it",
    title: "Annual plans that are still worth paying this month",
    summary: "A banner discount counts only if you already use the product every week. Lifetime deals usually do not.",
    body: bodyDeals,
    categoryId: "cat-deals",
    coverUrl: "",
    featured: false,
    status: "published",
    authorId: "user-admin",
    authorName: "Sam Okonkwo",
    youtubeUrl: "",
    duration: "",
    isTest: false,
    affiliateId: "aff-linear",
    createdAt: ago(12),
    updatedAt: ago(12),
    publishedAt: ago(12),
  }),
  post({
    id: "post-custody",
    slug: "self-custody-first-week",
    title: "A first week of self-custody, without the theatrics",
    summary: "Write the backup, restore it once, then decide if any balance moves. The guide stops before the price chart.",
    body: bodyCustody,
    categoryId: "cat-guides",
    coverUrl: "",
    featured: false,
    status: "published",
    authorId: "user-editor",
    authorName: "Amina Cole",
    youtubeUrl: "",
    duration: "",
    isTest: false,
    affiliateId: "aff-ledger",
    createdAt: ago(26),
    updatedAt: ago(26),
    publishedAt: ago(26),
  }),
  post({
    id: "post-trackers",
    slug: "issue-trackers-six-person-team",
    title: "Linear, Height, and Jira on a six-person team",
    summary: "The tracker people open without a meeting collected the bugs. The configurable one collected a workflow doc.",
    body: bodyTrackers,
    categoryId: "cat-comparisons",
    coverUrl: "",
    featured: false,
    status: "published",
    authorId: "user-editor",
    authorName: "Amina Cole",
    youtubeUrl: "https://www.youtube.com/results?search_query=stackwise+placeholder+issue+tracker",
    duration: "09:05",
    isTest: true,
    affiliateId: "aff-linear",
    createdAt: ago(30),
    updatedAt: ago(30),
    publishedAt: ago(30),
  }),
  post({
    id: "post-budget-draft",
    slug: "budgeting-saas-notes",
    title: "Notes from a week inside a budgeting app",
    summary: "Writer draft. The export is paywalled and the week is not finished. Not for the homepage.",
    body: bodyBudget,
    categoryId: "cat-saas",
    coverUrl: "",
    featured: false,
    status: "draft",
    authorId: "user-writer",
    authorName: "Jordan Blake",
    youtubeUrl: "",
    duration: "",
    isTest: false,
    affiliateId: "",
    createdAt: ago(6),
    updatedAt: ago(3),
    publishedAt: "",
  }),
  post({
    id: "post-fees-review",
    slug: "exchange-fee-comparison",
    title: "A quieter way to compare exchange fees",
    summary: "In review. Banner rates are not the fee. Waiting on a second pass before this can publish.",
    body: bodyFees,
    categoryId: "cat-crypto",
    coverUrl: "",
    featured: false,
    status: "in_review",
    authorId: "user-writer",
    authorName: "Jordan Blake",
    youtubeUrl: "",
    duration: "",
    isTest: false,
    affiliateId: "",
    createdAt: ago(10),
    updatedAt: ago(2),
    publishedAt: "",
  }),
];

export const SEED_DB: DemoDb = {
  version: 1,
  users: [
    {
      id: "user-admin",
      email: "admin@demo.com",
      name: "Sam Okonkwo",
      role: "admin",
      active: true,
      password: "demo1234",
    },
    {
      id: "user-editor",
      email: "editor@demo.com",
      name: "Amina Cole",
      role: "editor",
      active: true,
      password: "demo1234",
    },
    {
      id: "user-writer",
      email: "writer@demo.com",
      name: "Jordan Blake",
      role: "writer",
      active: true,
      password: "demo1234",
    },
  ],
  categories: SEED_CATEGORIES,
  posts: SEED_POSTS,
  tools: SEED_TOOLS,
  affiliates: SEED_AFFILIATES,
  subscribers: [
    { id: "sub-1", email: "reader@example.com", createdAt: ago(20) },
    { id: "sub-2", email: "ops@example.com", createdAt: ago(48) },
  ],
  session: null,
};

export function freshSeed(): DemoDb {
  return structuredClone(SEED_DB);
}

export function findSeedPost(slug: string): Post | undefined {
  return SEED_DB.posts.find((post) => post.slug === slug && post.status === "published");
}
