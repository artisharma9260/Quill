import 'dotenv/config';
import mongoose from 'mongoose';
import User, { avatarFor } from '../models/User.js';
import Blog from '../models/Blog.js';

// Usage: npm run seed            -> seeds only if the database is empty
//        npm run seed -- --force -> wipes users & blogs, then seeds
const force = process.argv.includes('--force');
const daysAgo = (n) => new Date(Date.now() - n * 86400000);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  if (!force && ((await User.countDocuments()) > 0 || (await Blog.countDocuments()) > 0)) {
    console.log('Database already has data. Use --force to wipe and reseed.');
    return;
  }
  if (force) {
    await Promise.all([User.deleteMany({}), Blog.deleteMany({})]);
  }

  const sarah = await User.create({ name: 'Sarah Chen', email: 'sarah@example.com', password: 'password123', avatar: avatarFor('Sarah Chen', 'sarah@example.com') });
  const marcus = await User.create({ name: 'Marcus Webb', email: 'marcus@example.com', password: 'password123', avatar: avatarFor('Marcus Webb', 'marcus@example.com') });

  const blogs = [
    {
      title: 'The Art of Writing Code That Lasts',
      excerpt:
        'Why readability is the most underrated skill in software engineering, and how to cultivate it deliberately.',
      content: `## The Case for Readable Code

Software engineering is often treated as a discipline of problem-solving — and it is. But there's a quieter skill that separates good engineers from great ones: writing code that others (and your future self) can actually understand.

## Why Readability Matters

Most code is read far more often than it's written. A function you write today might be read by five different engineers over the next two years. Every minute they spend puzzling over unclear variable names or convoluted logic is a minute not spent building something new.

Consider this: the total cost of maintaining software far exceeds the cost of writing it. Clear, expressive code is one of the highest-leverage investments you can make.

## Practical Techniques

**Name things honestly.** A function called \`processData\` tells you almost nothing. \`validateAndNormalizeUserEmail\` tells you exactly what's happening.

**Keep functions small and focused.** The single responsibility principle isn't just architectural advice — it's a readability principle. Small functions are easier to name, easier to test, and easier to understand.

**Write comments for the *why*, not the *what*.** Good code explains what it does through its structure. Comments should explain *why* a non-obvious decision was made.

## The Long Game

Readable code is an act of respect for your colleagues and your future self. It's also a competitive advantage: teams that maintain clear codebases ship faster and have lower turnover.

The next time you're about to write a one-letter variable name or skip breaking a large function apart, pause. Ask yourself: *will a reasonable engineer understand this in six months?*

If the answer is no, spend the extra five minutes to make it better.`,
      featuredImage:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&auto=format',
      category: 'Programming',
      tags: ['software-engineering', 'best-practices', 'code-quality'],
      author: sarah._id,
      status: 'published',
      readingTime: 4,
      createdAt: daysAgo(14),
      updatedAt: daysAgo(14),
    },
    {
      title: 'Large Language Models Are Not Thinking — And That\'s Okay',
      excerpt:
        'Separating the genuine capabilities of modern AI from the misunderstood claims, and what this means for how we use these tools.',
      content: `## The Anthropomorphism Trap

When GPT-4 explains its reasoning step by step, it's easy to believe something mind-like is occurring. The fluent prose, the logical structure, the apt analogies — they all *feel* like thought. But they aren't.

This matters. Not because it diminishes what large language models can do — their capabilities are genuinely remarkable — but because misunderstanding the mechanism leads to misuse.

## What LLMs Actually Do

A language model predicts the next token given a context. That's it. The sophistication emerges from the sheer scale of pattern recognition across an enormous training corpus, combined with reinforcement learning from human feedback that shapes the output to be helpful.

What emerges from this process is something that:
- Synthesizes information fluently
- Follows logical structure in its outputs
- Generalizes across domains
- But also confabulates, makes arithmetic errors, and has no persistent world model

## The Practical Implications

Understanding the mechanism changes how you use the tool:

**Use it for generation, not ground truth.** LLMs are remarkable drafters and synthesizers. They're unreliable fact-checkers.

**Provide context explicitly.** The model has no memory of your previous conversations (unless explicitly given). Each prompt is a fresh context window.

**Verify outputs that matter.** For anything consequential — code in production, medical information, legal interpretation — treat LLM output as a starting point, not a conclusion.

## The Opportunity

The genuine opportunity is enormous: faster research, better first drafts, more accessible expertise. But unlocking it requires clear-eyed understanding of what these tools are.

We're not building minds. We're building something different, and in many ways more useful.`,
      featuredImage:
        'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=400&fit=crop&auto=format',
      category: 'AI',
      tags: ['ai', 'llm', 'machine-learning', 'technology'],
      author: marcus._id,
      status: 'published',
      readingTime: 5,
      createdAt: daysAgo(7),
      updatedAt: daysAgo(7),
    },
    {
      title: 'Building a Career in Tech Without a Computer Science Degree',
      excerpt:
        'The non-traditional path is harder than it looks, but more viable than ever — here\'s what actually matters.',
      content: `## The Credential Question

Every week, someone in a developer community asks: *Do I need a CS degree to get a job in tech?*

The honest answer: no, but the path is harder than bootcamp marketing suggests, and easier than traditionalists claim.

## What the Degree Actually Provides

A CS degree gives you:
- Data structures and algorithms fluency (critical for interviews at large companies)
- Systems programming foundation
- Four years of uninterrupted learning time
- A network and credential that signals baseline competence

None of these are impossible to obtain otherwise. All of them take deliberate effort.

## What Actually Gets You Hired

After reviewing hundreds of hiring decisions across different company sizes and stages, the pattern is clear:

**Portfolio > credential.** A GitHub profile with three well-built, maintained projects tells a hiring manager more than most degrees.

**Systems thinking > syntax.** Junior engineers who understand *why* things work — not just *how* to make them work — progress faster and get hired more readily.

**Communication.** Underrated. Engineers who write clearly, explain their thinking, and handle feedback well are rarer than their technical skills suggest.

## The Practical Path

1. Build something real and maintain it. Not tutorials — something you care about.
2. Learn data structures. The algorithm interview isn't going away.
3. Contribute to open source. It teaches collaboration and shows you can work in an existing codebase.
4. Write about what you're learning. It clarifies your thinking and builds a public record.

The path is longer without a degree. But it's a path.`,
      featuredImage:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&auto=format',
      category: 'Career',
      tags: ['career', 'self-taught', 'advice'],
      author: sarah._id,
      status: 'published',
      readingTime: 5,
      createdAt: daysAgo(4),
      updatedAt: daysAgo(4),
    },
    {
      title: 'The Future of the Web Is Not What Anyone Predicted',
      excerpt:
        'We spent a decade predicting the death of the browser. Instead, it became the most capable application platform in history.',
      content: `## A History of Wrong Predictions

In 2010, many believed native apps would replace the web. Then we believed single-page applications would usher in a new era of app-like experiences. Then we believed Web3 would decentralize everything. Then we believed the metaverse would move us beyond the screen entirely.

None of it happened the way anyone thought.

## What Actually Happened

The browser got better. Quietly, unglamorously, year after year, the web platform gained capabilities that once required native code: video editing, 3D graphics, audio synthesis, offline operation, push notifications, device camera and GPS access.

Today, the gap between a well-built web app and a native app is smaller than it's ever been — and the web's inherent advantages (instant distribution, cross-platform, no app store friction) remain intact.

## The Rise of Edge

The web's next chapter is computation at the edge. Frameworks like Next.js, Remix, and Astro are blurring the line between server and client in ways that improve performance without sacrificing the authoring experience developers love.

This isn't a new idea — it's the old web architecture (server rendering) combined with modern tooling. The wheel turns.

## What Developers Should Watch

The web is not going away. If anything, it's winning. The question is what skills remain valuable:

- Understanding the network (still fundamental)
- Performance optimization (increasingly competitive advantage)
- Accessibility (chronically undervalued, increasingly regulated)
- The browser APIs that keep expanding

The boring answer is also the right one: learn the fundamentals, stay curious, build things.`,
      featuredImage:
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&auto=format',
      category: 'Web Development',
      tags: ['web', 'frontend', 'browsers', 'future-of-tech'],
      author: marcus._id,
      status: 'published',
      readingTime: 4,
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
    },
    {
      title: 'Why Deep Work Is Getting Harder — and How to Protect It',
      excerpt:
        'The collapse of focused work time is a crisis hiding in plain sight. Here\'s what we can actually do about it.',
      content: `## The Attention Economy Wins

Cal Newport coined the term "deep work" — the ability to focus without distraction on cognitively demanding tasks. Since his book was published in 2016, the problem has gotten meaningfully worse.

Slack made interruption continuous. Remote work blurred the boundary between work and life. The smartphone made boredom impossible and attention spans shorter.

The engineers who can still do deep work have a significant advantage.

## Why This Matters Especially for Engineers

Software engineering is one of the domains where the output of deep work is most disproportionate. A focused engineer in four hours can produce more than an interrupted one in eight.

The compounding loss isn't just productivity — it's quality. Good architecture, clean abstractions, subtle bug detection: these require sustained attention that context-switching destroys.

## What Actually Works

**Time blocking.** Schedule deep work as non-negotiable calendar time, not as "whenever I have space" (you'll never have space).

**Notification hygiene.** Turn off all notifications. Check communication on a schedule, not as an interrupt.

**Threshold rituals.** A ritual that signals the start of deep work — a specific playlist, a particular workspace, a short planning session — trains your brain to shift modes faster.

**Default to asynchronous.** Synchronous communication is expensive. Default to writing things down, not calling meetings.

## The Cultural Piece

Individual techniques only go so far. Organizations that interrupt engineers constantly are burning money and driving away talent. Leaders who model deep work practices — by being slow to respond to messages, by blocking calendar time — give their teams permission to do the same.

This is harder to change than buying better headphones. But it's where the real leverage is.`,
      featuredImage:
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop&auto=format',
      category: 'Lifestyle',
      tags: ['productivity', 'focus', 'deep-work', 'career'],
      author: sarah._id,
      status: 'published',
      readingTime: 5,
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
    {
      title: 'React Server Components: What They Actually Change',
      excerpt:
        'Beyond the hype: a practical assessment of what RSC means for how you architect React applications today.',
      content: `## The New Mental Model

React Server Components (RSC) represent the most significant architectural shift in React's history. They're not just a performance optimization — they're a new way of thinking about the client/server boundary.

The key insight: components can now run on the server, with direct access to databases, file systems, and other server-side resources, and send their rendered output to the client without shipping their JavaScript.

## What Changes in Practice

**Data fetching moves to the component.** Instead of fetching in getServerSideProps or useEffect, you fetch directly in the component that needs the data. This colocation makes code dramatically easier to reason about.

**The bundle gets smaller.** Server components don't ship to the browser. A component that imports a 200kb parsing library doesn't add that to your bundle.

**Waterfall requests get better.** Server-to-server requests within a render tree are much faster than client-to-server requests. A component tree that previously required multiple round trips can often resolve in a single server render.

## What Doesn't Change

You still need client components for:
- Interactivity (event handlers, state)
- Browser APIs
- Effects

The composition model is the key: server components can render client components, but not vice versa. Learning where to draw this boundary is the new skill.

## Is It Worth It?

For new applications: yes. The full-stack colocation model is genuinely better for most use cases.

For existing applications: migrate incrementally. The benefits compound as more of your fetching logic moves server-side, but the architectural shift is real work.

RSC isn't hype. It's a genuine improvement — but one that requires updating your mental model.`,
      featuredImage:
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop&auto=format',
      category: 'Web Development',
      tags: ['react', 'rsc', 'frontend', 'performance'],
      author: marcus._id,
      status: 'published',
      readingTime: 6,
      createdAt: daysAgo(0),
      updatedAt: daysAgo(0),
    },
  ];

  // timestamps:false lets us backdate createdAt/updatedAt
  await Blog.insertMany(blogs, { timestamps: false });
  console.log(`Seeded 2 users and ${blogs.length} blogs.`);
  console.log('Demo login: sarah@example.com / password123');
}

run()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
