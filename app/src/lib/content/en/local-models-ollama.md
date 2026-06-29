The AI you usually use almost all lives in "someone else's house": the text you type flies across the network, gets computed on some company's server, and the answer is sent back. This setup is easy on you, but it brings three things that make some people uncomfortable: your content has to **leave your computer** to be processed; **lose the network and you can't use it**; and the more you use it, the more you have to **pay by the amount.**

So some people started looking at another path: can you put the model **straight onto your own computer**, and run it locally, no network, no sending out, no billing? You can. That's this chapter's topic, the **local model**, along with two kinds of tools that help ordinary people get one running: Ollama and LM Studio. First, one thing to be clear about: a local model isn't "a more advanced version" — it's "a version that runs in a different place." It has its sweet spots, and it has its real costs.

## 1. Why some people want to run a model on their own computer

Bringing the model home is about three things. Let's see clearly what each one actually solves.

| What you want | What it solves | Who cares especially |
| --- | --- | --- |
| **Privacy** | Content never leaves your machine, never uploaded to any company's server | People handling sensitive material, who don't want data "going out" |
| **Offline** | Works with no network — on a plane, on an internal network, when the connection drops | People with limited network, or who need to work in an isolated environment |
| **No per-use billing** | Once set up, use it freely, no longer charged per call | People with heavy usage, or who don't want the mental drag of being billed |

What these three share is that they all come from the same thing: **the model runs on your own machine, and the input and output never leave it.** The cloud setup is easy precisely because the heavy lifting happens in "someone else's house"; the local setup is private, offline, and unbilled precisely because the heavy lifting has moved back to "your house." **The benefits and the costs are two sides of the same reason.**

> **Key point:** Don't treat "local" as a flex; at heart it's a **trade-off question.** You spend "your own machine's compute and a bit of setup hassle" to buy "privacy, offline, no billing." Think through which end you care about most, then decide whether to take this path, rather than feeling superior just because you can "put it on your own computer."

## 2. Local vs cloud: one table to settle the trade-off

This is the one table to remember in the chapter. Local and cloud aren't about "which is better" — they're prepared for different people and different situations.

| | Cloud (the kind you usually use) | Local (on your own computer) |
| --- | --- | --- |
| Where the data goes | Sent to a company server to compute | **Never leaves your machine** |
| Need a network | Yes | **No** |
| How you pay | Per use / plan quota | After setup, **no per-use billing** (but you need a capable enough computer) |
| Strength | Usually **stronger** (giant machines behind it) | **Limited by your machine**, often **weaker** than top-tier cloud, all else equal |
| Ease of starting | Open it and use it, hassle-free | Download, configure, a bit of a barrier |
| Maintenance | The company carries it for you | You manage it yourself |

One line for each side's character:

- **Cloud = strong, hassle-free, but data has to go out and you pay by the amount.**
- **Local = private, offline, unbilled, but limited by your machine, with a setup barrier, usually weaker than cloud.**

Notice the most easily overlooked row, **strength.** The cloud often runs very large models, backed by compute a non-technical reader can't afford; what your computer can run is mostly a "slimmed-down version" of it. So expecting "install a local model and the result equals the strongest cloud" will mostly end in disappointment. This isn't Ollama or LM Studio falling short; it's that your computer's "build" decides how big a model it can run.

> **Key point:** To choose local or cloud, first ask yourself one line: **"For this thing, what matters most — the data not going out, or the best possible result?"** If you want the data to stay put, want offline, want no billing, local has irreplaceable value; if you want top-tier results and want it hassle-free, honestly use the cloud. It's the same idea as the "model/product/API/Agent" map from chapter 17: see clearly which layer the need is on, then talk about what to use.

## 3. Before downloading, take a look: can your computer handle it

This is the most practical hurdle for local models, and the one newcomers most easily ignore. **Not every model will run on your computer.**

A metaphor: a model is like a piece of "luggage," and your computer is like a car. Luggage comes in big and small, and the trunk comes in big and small too — **if the trunk can't hold it, the car can't go.** Whether the model "luggage" fits mainly comes down to whether two things can hold it:

- **Memory (RAM):** the space your computer works in temporarily. A running model has to "spread out" entirely in memory, and the bigger the model, the more memory it eats.
- **Video memory (VRAM):** the dedicated memory on the graphics card (GPU). Many models run much faster on the GPU, but the card's "dedicated space" is usually even tighter than RAM.

What this means in practice: every downloadable local model usually has its publisher list **roughly how much memory/VRAM it needs.** Before downloading, hold that requirement up against your computer's specs: **if it fits, it runs smoothly; force a too-big model past your specs, and at best it's maddeningly slow (a slideshow), at worst it just won't run.**

```text
The "quick check" before downloading:

  Model's stated requirement:   Your computer:        Conclusion
  ───────────────────────────   ──────────────        ──────────
  needs 16 GB RAM           vs   you have 8 GB    →  won't run / extremely slow
  needs 8 GB RAM            vs   you have 16 GB   →  no problem
  (the actual numbers, check the model publisher / official docs; this book won't pin them down)
```

How do you know how big a model needs to be and how much your computer has? These **specific numbers and how to check them differ by vendor and update often, so refer to the official documentation.** You just need to build the awareness first: **local models have a "hardware barrier"; check your specs before downloading**, so you don't find out it won't run only after a several-gigabyte download and a long wait for nothing.

> **Key point:** "Can you run a local model" depends not on whether you want to, but on whether your **machine can handle it.** Build a habit: when you see a local model, first find its stated memory/VRAM requirement, then look at your computer's specs. This step takes only a minute and saves you the trouble of "download several gigabytes, then watch it freeze up."

## 4. Quantization: "compress" a big model a bit so it can get on board

You might ask: so are big models completely out of reach for ordinary computers? Not entirely. There's a term you'll often hear, **quantization**, worth understanding in one line.

Continuing the "luggage" metaphor: quantization is like **squashing the things in your luggage with a vacuum compression bag** — the volume shrinks, so it's easier to fit into a small trunk. The cost is that if you squash too hard, the clothes may get a bit wrinkled.

Back to what it actually is: quantization is a technique that **"compresses" a model smaller and lighter on memory**, giving a model that originally wouldn't run a chance to run on an ordinary computer. The cost is that **the harder you compress, the more the quality usually drops a little** (answer quality may dip slightly). So you'll often see the same model offered with several "compression tiers": compress lightly for better quality but a heavier load on your specs; compress heavily for a lighter load on resources but a small hit to quality.

> **Key point:** Quantization is a common trade-off in the local-model world: **spend a bit of "quality" to buy "able to run on your computer."** A non-technical reader doesn't need to understand how it works, just to know that when the same model offers you several versions to pick from, those are mostly different quantization tiers — **a balance point between "runs" and "answers well."** For how to choose and how much each tier differs, refer to the official documentation.

## 5. Ollama and LM Studio: tools that help ordinary people get a model running

We've talked a lot about "local models," but a model itself is only a core (remember chapter 17, a model is "the thinking brain," and it needs something to wrap it before it's usable). **Dealing with a bare model directly is a real hassle**: download it, configure it, get it running, and have somewhere to talk with it.

**Ollama and LM Studio are tools that handle all that hassle for you**, letting ordinary people fairly easily **download** a model, **run** a model, and **talk with it** locally.

A common term to add here in passing: the models you can freely download and run on your own computer like this are mostly **open-weight models**, simply put, the kind where the publisher "releases" the model and allows everyone to download and use it locally. It's precisely because such downloadable models exist that the local path is workable at all; many of the most top-tier cloud models are not open for download and can only be used through their products or APIs (chapter 17). Which models are open-weight, and whether they can be used commercially, differs by each vendor's terms, so **refer to the official documentation.**

- A rough impression (**for specific features, interface, and supported models, refer to the official documentation**): they can usually help you browse and download available local models, manage the few models you've downloaded, and offer a place to chat directly.
- The two have slightly different positioning and emphases, but for a non-technical reader the goal is the same: **turn "running a model locally," a thing that used to be quite technical, into something you can start with a few clicks.**

As for how exactly to install, how to download models, what the commands and buttons look like, these **change often across versions, so this book won't pin them down; refer to each one's official documentation.** The deeper hands-on steps are left for appendix C.

> **Key point:** Don't confuse Ollama / LM Studio with the "model" itself. They are **not models**; they're "housekeepers" that help you **download, run, and use** a model, like a restaurant is to a chef (chapter 17). Swap the housekeeper and you're still running the same batch of local models; what really decides the result is **which model** you run and **how strong your computer is**, not which housekeeper you use.

## 6. Common misconceptions, cleared up

| Common misconception | Reality |
| --- | --- |
| A local model is definitely stronger than cloud | Just the opposite — local is limited by your machine's compute and often **weaker** than top-tier cloud, all else equal; strength comes from the **specific model + your hardware**, not from the word "local" |
| Local model = absolutely safe | It's more **private** (data doesn't leave your machine), true, but "private" doesn't equal "safe": the model still hallucinates and errs (chapter 9), and downloading a model of unknown origin has risks too |
| Install Ollama and you've got "a better AI" | Ollama/LM Studio are just **running tools**, not the model itself; the one doing the work is the model you downloaded |
| Just grab any model and it'll run | First check whether its **memory/VRAM requirement** matches your computer, or it'll be extremely slow or won't run |
| Local is for geeks, nothing to do with me | If you **especially care about data not going out, need offline, or have heavy usage**, local is a path with real value, just with a bit of a setup barrier |

## Summary

- Some people pick a **local model** for three things: **privacy** (data doesn't leave the machine), **offline** (works with no network), **no per-use billing**, all stemming from "the model runs on your own machine."
- Local vs cloud is a **trade-off question**: cloud is **strong and hassle-free but data goes out and you're billed per use**; local is **private, offline, unbilled, but limited by the machine, with a barrier, usually weaker than cloud.**
- Before downloading, **check the hardware requirement first**: the model has to "spread out" into your **memory/VRAM**, and if it doesn't fit it won't run smoothly or won't run at all (for the actual numbers, refer to the official documentation).
- **Quantization** is the common trade-off of spending a bit of quality to "run on an ordinary computer"; the multiple versions of one model are mostly different quantization tiers.
- **Ollama / LM Studio** are **tools** that help ordinary people download, run, and chat locally, not the model itself; for specific usage refer to the official documentation, and the deeper hands-on steps are in appendix C.

Next chapter we switch angles: however strong a model is, only being able to "talk" isn't enough. How do you wire it up to **external tools and data**, so it can read material you designate and do things by your fixed process? That brings us to Skills and MCP.

---

## Quiz

> Six questions, covering concept, misconception, scenario, and hands-on. The answer and explanation are in the quoted block under each question. Think first, then compare.

1. **[Basic · Concept]** When people want to run a local model on their own computer, which three things are they mainly after?
   - A. Privacy, offline, no per-use billing
   - B. Definitely stronger, definitely faster, definitely cheaper to buy a computer
   - C. Auto-online, auto-update, auto-backup
   - D. Never errs, never hallucinates
   > **Answer: A.** A local model's three sweet spots — data not leaving the machine (privacy), working with no network (offline), and no billing after setup — all come from the one thing "the model runs on your own machine." B mistakes local for "stronger, faster" (it's often weaker than top-tier cloud); D mistakes "private" for "won't err," when the model still hallucinates (chapter 9).

2. **[Basic · Concept]** About "local" and "cloud," which statement is the most accurate?
   - A. Local is always better than cloud
   - B. Cloud is strong and hassle-free but data goes out and you're billed per use; local is private, offline, and unbilled but limited by the machine and usually weaker than cloud
   - C. Cloud needs no network, local needs a network
   - D. They're identical, just different names
   > **Answer: B.** It's a trade-off question, with no "always better." A is the most common misconception; C **gets the network relationship backwards** (cloud needs the network, local doesn't); D ignores a whole string of real differences — data direction, billing, strength.

3. **[Basic · Misconception]** "A local model is definitely stronger and smarter than the cloud's." Where's the mistake?
   - A. No mistake, local is stronger
   - B. Local is limited by your computer's compute and often weaker than top-tier cloud, all else equal; strength comes from the specific model and your hardware, not from the word "local"
   - C. Wrong because local is actually weaker and can never be used
   - D. Wrong because local and cloud run completely different things
   > **Answer: B.** Behind the cloud is giant compute a non-technical reader can't afford, and what your computer can run is often a "slimmed-down version." What decides strength is **which model + your hardware**; the word "local" by itself doesn't mean strong. People who make this mistake usually misread "put it on your own computer" as "more advanced." C goes to the other extreme (local has its own irreplaceable value).

4. **[Intermediate · Misconception]** "A local model's data doesn't go out, so it's absolutely safe and won't err." What's wrong here?
   - A. Completely correct
   - B. "More private" ≠ "absolutely safe": the model still hallucinates and errs, and downloading a model of unknown origin has its own risks
   - C. A local model actually uploads data secretly
   - D. A local model has no privacy benefit at all
   > **Answer: B.** "Data doesn't leave the machine" does make it more **private**, but "private" and "safe/correct" are different things: its answers can still be wrong (hallucination still exists, chapter 9), and downloading a model from an unreliable source carries risk in itself. Equating "private" with "safe" is the confusion this question is meant to fix. D, again, denies its real privacy benefit, also wrong.

5. **[Basic · Scenario]** You've got your eye on a local model. Before downloading, what's the **first thing you should do**?
   - A. Just hit download, deal with it not running later
   - B. Glance at its stated memory/VRAM requirement and check whether your computer's specs can handle it
   - C. Cancel your cloud subscription first
   - D. Uninstall all the other software on your computer
   > **Answer: B.** A model has to "spread out" entirely into your memory/VRAM, and **if it doesn't fit it'll be extremely slow or won't run.** A minute spent matching specs saves you the trouble of "download several gigabytes only to run a slideshow" (for the actual numbers, refer to the official documentation). A is the easiest pit to fall into; C and D both miss the real gate: "is the hardware enough."

6. **[Basic · Hands-on/Observation]** First check roughly how many GB of memory (RAM) your own computer has; then go to any local-model tool (such as Ollama / LM Studio — **for specifics, refer to the official documentation**) and see that the same model often comes in several different sizes. Observe: are the smaller versions lighter on resources but possibly a bit worse in quality?
   > **What you should notice:** A model's multiple versions are mostly different **quantization** tiers: compress harder for a smaller file, lighter on memory, but answer quality may dip slightly; compress lighter for a heavier load on specs but better quality. This is exactly the local model's core trade-off: **pick a balance point between "runs" and "answers well."** Match your own memory against model sizes once by hand and the intuition for "how big a model my computer can run" takes shape (for how much each tier differs, refer to the official documentation).
