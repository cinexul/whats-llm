> Use this template library alongside Chapter 11, "The structure of a prompt." The main text explains "why you write it this way"; this appendix gives you "fill in the blanks and go."
> Anywhere a specific product (Claude Code, Codex, and so on) has features, buttons, or commands that change from version to version, this appendix marks it "**check the official docs**." The prompts here are "plain-language things you say to the AI," not commands inside a product.

---

## How to use these templates

Every template has the same shape, so it's easy to copy:

1. **When to use**: one line telling you which situation this template fits.
2. **The prompt template**: in a gray code box, with `<angle brackets>` marking "the blanks you fill in yourself." **Copy the whole block**, then replace each `<...>` with your real content.
3. **How to fill it in**: explains each blank one by one.
4. **Tip** (sometimes): a single thing to watch out for.

Three points to keep in mind first:

- **Replace the angle brackets along with the text inside them.** For example, swap the whole `<your job>` for "elementary school teacher"; don't leave the brackets behind.
- **A template is a starting point, not scripture.** Once you're comfortable, change it freely: drop the constraints you don't need, add your own requirements. The AI won't get upset because you "didn't follow the format."
- **The five parts of a good prompt** (running through this whole appendix, explained in detail in Chapter 11): **give context** (who I am, what I'm trying to do), **state the task** (what specifically to do), **give constraints** (what limits and preferences apply), **specify the output form** (a table, or bullet points), and **give the "standard for success"** (what counts as getting it right). The templates leave a spot for all five; you just fill them in.

> **One safety reminder that runs through the whole book:** Never paste passwords, API keys, card numbers, or other people's private information into the chat box. When you need to paste material that contains something sensitive, mask the sensitive part with `××` first.

---

## 1. Everyday: questions, life, decisions, explaining concepts

### Explain a hard concept until I get it

When to use: you've run into a term or idea you can't follow, and you want an explanation that actually sounds like a human talking.

```text
I want to understand "<the concept you want to understand>," but I have no background in it, so treat me as <who, for example: a complete layperson, an adult>.
Please:
1. First use an everyday analogy so I can grasp the gist;
2. Then in three to five sentences explain what it actually is and what it's good for;
3. Finally give an example of where I might run into it in daily life.
Use plain language throughout, and explain any technical term as you go. If there's a common misunderstanding about this concept, point that out too.
```

How to fill it in:
- `<the concept you want to understand>`: the word or thing you can't follow, such as "inflation," "blockchain," or "what an antibody is."
- `<who>`: who you want it to treat you as, such as "a complete layperson, an adult" or "a middle schooler."

Tip: if the first explanation is still too tangled, just reply "still didn't get it, try a simpler analogy."

### Help me think a decision through

When to use: you're torn between two or three options and want a clear, organized analysis (note: the one who decides in the end is you, not the AI).

```text
I'm making a decision and need you to help me sort out my thinking. Don't draw the conclusion for me.
Background: <briefly describe your situation and what you're torn about>.
The options I'm considering: <option A>, <option B> (list more if there are any).
What matters most to me: <the two or three things you care about most, for example: spending less, saving time, lower risk>.
Please lay out the upsides and downsides of each option in a table, and score each one against the things I care about (high / medium / low).
Finally, tell me: what other information should I gather so I can decide with more confidence?
```

How to fill it in:
- `<background>`: your real situation. The more specific you are, the more the AI can help.
- `<option A/B>`: the few approaches you're weighing.
- `<what you care about>`: your criteria. This is what it scores against.

Tip: the AI doesn't know your full situation. Its "advice" only helps you see the upsides and downsides clearly. Don't treat it as the final word.

### A face-to-face Q&A helper (ask until it's clear)

When to use: you want to dig into a topic all the way down, but you're worried your own questions will be a mess.

```text
I want to understand "<the topic>." Here's roughly how much I already know: <for example: I've only heard the name / I know the general idea>.
Please act as a patient explainer, and let's move forward one question and one answer at a time:
- Each time, explain just one small point, then ask me "is this point clear?";
- If I say "clear," move on to the next point; if I say "not clear," say it a different way and explain again;
- If I ask about something you're unsure of, or that might be out of date, please say honestly "I'm not sure about this, you should double-check it" rather than making something up.
Let's start now.
```

How to fill it in:
- `<the topic>`: the subject you want to understand.
- `<how much you know>`: your starting point, which decides how basic it starts.

Tip: this is a "learn one bite at a time" pace, good for tough topics, and it keeps you from getting buried in information.

### Turn a headache into a checklist

When to use: you're facing something overwhelming (moving house, handling paperwork, planning an event) and you want a checklist you can actually work through.

```text
I have something to do: <what it is>.
My situation: <key limits like time, budget, and helpers>.
Please break it into a checklist I can "do in order":
- For each item, spell out "what to do," and where it matters, note roughly how much time or money it takes;
- Sort the "must do first" items apart from the "can do last" ones;
- Mark which things are easy to forget and which have a deadline (for example, ones that need booking ahead).
At the end, in one sentence, remind me where this is most likely to go wrong.
```

How to fill it in:
- `<what it is>`: the thing you need to handle, written specifically.
- `<your situation>`: your limits on time, money, helpers, and so on. It sets priorities based on these.

### Polish a message before I send it

When to use: there's a line in a chat, a text, or a social post you're not sure how to phrase well, and you want a few versions to choose from.

```text
I want to tell <who the other person is> something, and I want it to sound <the tone you want, for example: polite but not groveling / a bit casual>.
Here's my current draft: "<what you wrote>"
Please give me three rewrites, leaning <for example: formal, warm, short and direct>, each under <word count> words.
Don't add any facts I didn't mention, and don't make it too gushing.
```

How to fill it in:
- `<who the other person is>`: the recipient, such as "my landlord" or "a coworker I don't know well."
- `<what you wrote>`: what you're trying to say, even if it's rough.
- `<the tone you want>` / `<word count>`: your preference and length limit.

Tip: stating what you want in the positive ("keep it concise") works better than the negative ("don't ramble"). That's a small trick the whole book keeps coming back to.

---

## 2. Work: writing, email, tables, organizing, translation, reporting

### Write a proper work email

When to use: you need to send a real email but don't want to agonize over the opening and closing from scratch.

```text
Please write a work email for me.
Sender's role: <your role, for example: project assistant>.
Recipient: <who they are and your relationship>.
What this email is trying to achieve: <what you want them to do / know>.
Key points (include all of these): <list 2 to 4 pieces of information that must be mentioned>.
Tone: <for example: polite, professional, not wordy>. Keep it under <word count> words, and give me a clear subject line.
When you're done, list separately anything you "filled in by guessing" so I can check it.
```

How to fill it in:
- `<purpose>`: what this email most wants to achieve. It's the through-line that organizes the whole thing.
- `<key points>`: the facts that must appear, so it doesn't skip them or make things up.
- The last line, asking it to "flag what it guessed," helps you catch the details it filled in for you.

### Turn messy information into a table

When to use: you have a pile of scattered text (sign-up info, quotes, a list) and want it turned into a tidy table.

```text
Below is some messy information. Please organize it into a table.
The columns I want are: <column 1>, <column 2>, <column 3> (add or remove as needed).
Requirements:
- Fill it in using only what I give you below; don't add or guess anything;
- If a piece of information is missing, write "not provided" in that cell rather than inventing one;
- When you're done, tell me below the table which rows have incomplete information.
Here's the material:
<paste your messy information here>
```

How to fill it in:
- `<column>`: which columns you want the table to have.
- `<material>`: your raw information, pasted in as one block.

Tip: the "write not provided if it's missing, don't invent" rule matters a lot. It keeps it from handing you a table that "looks complete but is half made up."

### Boil a long piece down to briefing points

When to use: you've finished a long piece of material and need to report to a manager or coworker, in person or in writing, so you need the key points.

```text
Please organize the content below into a set of briefing points, for <the audience, for example: a manager who doesn't know the details>.
Write it based on the material itself; don't add information that isn't there. Where you're unsure, mark it "to be confirmed" rather than making it up.
Output structure:
1. A one-sentence conclusion (lead with the most important thing);
2. Three to five key points;
3. What the other person needs to decide, or what I should do next.
Keep the whole thing under <word count> words, in plain language the other person will get instantly.
Here's the material:
<paste the material>
```

How to fill it in:
- `<audience>`: this decides the level of detail and word choice. For a manager, for example, lead with the conclusion.
- `<material>`: the raw content you're reporting on.

### Translate and explain, not just word for word

When to use: you're translating a passage and want it accurate and natural, and you also want to know the tricky parts.

```text
Please translate the following <source language> into <target language>.
The use or setting of this text is: <for example: a formal contract / chatting between friends / a product description>, so use a matching tone.
Requirements:
- Make it read naturally and fit how <target language> is actually used; don't translate word for word;
- For proper nouns, names, and abbreviations where you're not sure of the standard translation, keep the original and note it rather than guessing;
- After translating, in a new paragraph, pick out 1 or 2 places that called for a judgment call and briefly explain why you handled them the way you did.
Here's the original:
<paste the original>
```

How to fill it in:
- `<source language>` / `<target language>`: from which language to which.
- `<use / setting>`: this sets the tone. A contract and a chat call for completely different translations.

Tip: for high-stakes content like contracts or medical text, always have someone who knows the field check the AI's translation again.

### Help me draft a document or notice

When to use: you need to write a notice, an instruction sheet, a set of rules, or another document with a fixed pattern, and you want a draft you can edit.

```text
Please draft a <document type, for example: event notice / instructions>.
Background: <who this document is for and what it needs to solve>.
Information it must include: <list the key content one by one, such as time, place, steps, things to watch for>.
Style: <for example: formal, well-organized, so the reader can just follow it>.
Please present it as <bullet points / paragraphs / a table>, and open with one line stating what this document is for.
For details you're not sure about, leave them blank and mark them "<to fill in>" rather than making them up for me.
```

How to fill it in:
- `<document type>`: the name of the thing you're writing.
- `<information it must include>`: the list of core content. The more complete it is, the less it leaves out.

Tip: having it mark uncertain spots as "<to fill in>" is far safer than letting it force in a number.

### Turn meeting or discussion notes into action items

When to use: a meeting left you with a pile of scattered notes, and you want to sort out "who should do what."

```text
Below are some meeting notes. Please organize them into action items I can act on.
Organize using only what's in the notes; don't add anything they don't say.
Output two parts:
1. A one-sentence meeting conclusion;
2. A to-do table with three columns: <what to do>, <owner>, <due date>. If an owner or date wasn't mentioned, write "not assigned."
When you're done, remind me which items still have no clear owner or date and need me to fill them in.
Here's the material:
<paste the meeting notes>
```

How to fill it in:
- `<material>`: your meeting notes or shorthand, pasted in as one block.

Tip: "write not assigned if it wasn't specified" helps you see at a glance which items from the meeting didn't actually get nailed down.

---

## 3. Study: reading along, self-testing, fact-checking, taking notes, exam prep

> These templates share one ground rule: **have the AI answer based on the material you give it, not make things up; if it's unsure, have it say so.** That's because large models will confidently get things wrong while sounding completely sure of themselves (explained in detail in Chapter 9), and in study situations this rule especially matters.

### Be my reading partner

When to use: you're reading an article or a chapter and want someone to explain as you go and quiz you.

```text
I'm reading the material below. Please be my reading partner.
Explain strictly based on this material; don't add anything that isn't in it. If I ask about something the material doesn't cover, just say "this material doesn't mention that."
Please do this:
1. First summarize in three to five sentences what this passage is about;
2. Pick out the concepts I might not follow and explain them one by one;
3. Finally, ask me two questions to check whether I really understood it.
Here's the material:
<paste the material>
```

How to fill it in:
- `<material>`: the passage you're reading, pasted in as one block.

Tip: don't skip the two questions it asks. Answering them yourself first is a good way to test "really understood versus only seemed to."

### Make me a self-test

When to use: you've finished a section and want a few questions to test yourself.

```text
Based on the material below, please write me <number> self-test questions to check whether I've got it.
Requirements:
- Test only what's covered in the material; don't go beyond it;
- Use <for example: multiple choice / short answer> questions, with difficulty <for example: from easy to hard>;
- Give me only the questions first, no answers. After I've answered, I'll say "reveal the answers," and then you give the answers and explanations.
Here's the material:
<paste the material>
```

How to fill it in:
- `<number>` / `<question type>` / `<difficulty>`: how many you want, in what form, and how hard.
- `<material>`: the basis for the questions.

Tip: answering first and checking later works far better than reading the answers straight away. Don't let it hand you the answers right off the bat.

### Help me fact-check a claim (with a reminder)

When to use: you've heard a claim you're not sure is true, and you want the AI to help you analyze it (but be clear that it can be wrong too).

```text
I heard a claim: "<the claim>." Please help me judge whether this claim holds up.
Please:
1. Say which parts of the claim are likely true and which parts are doubtful or depend on conditions;
2. If you're unsure, or this might involve newer information, clearly say "I'm not sure about this" rather than forcing a conclusion;
3. Tell me: to confirm this, what kind of authoritative source should I look at (no need for specific links, just tell me the type).
```

How to fill it in:
- `<the claim>`: the statement you want to verify.

Tip: **the AI is not a source of facts.** It can help you sort out your thinking and point out doubtful spots, but the final conclusion has to be checked against authoritative material (emphasized again and again in Chapters 9 and 15).

### Turn material into study notes

When to use: you've finished a piece of material and want notes that are clearly structured and easy to review.

```text
Please organize the material below into study notes, so I can review quickly later.
Organize it entirely from the material; don't add anything that isn't in it.
Note structure:
1. The core conclusion of this material (one or two sentences);
2. The key points (as bullets, each making one point in a sentence);
3. Details that are easy to confuse or worth remembering;
4. A one-sentence summary.
Use concise bullet points; don't go on at length.
Here's the material:
<paste the material>
```

How to fill it in:
- `<material>`: the raw material you're taking notes on.

### Help me make an exam-prep plan

When to use: you have an exam coming up, limited time, and you want a review schedule you can actually follow.

```text
I'm preparing for <exam name>. The exam is on <date>, and there are <how many days> left until then.
Each day I can carve out about <available time> to review.
What I need to review: <list the subjects or chapters>, and the part I'm weakest on is <weak spot>.
Please lay out a review plan:
- Schedule it by week (or by day), giving the weak parts more time;
- Leave time for review, consolidation, and practice tests; don't pack it too tight;
- Present it as a table, listing what to do in each time slot.
If you don't have enough information to make the plan, ask me first what's missing.
```

How to fill it in:
- `<exam name>` / `<date>` / `<how many days>` / `<available time>`: the hard constraints on scheduling.
- `<weak spot>`: so it gives your weak areas more time.

Tip: a plan is rigid, but you're not. If you fall behind while following it, come back and have it reschedule.

---

## 4. Summarizing material: long-text summaries, comparing documents, extracting points, making outlines

> These templates share the same ground rule as above: **answer using only the material I give you, not your own invention; if it's not in the material, say it isn't.** When you feed in long material and it won't all fit in one paste, you can paste it in a few parts, and say up front "I'll send the material in several parts; start summarizing only when I say 'that's all.'"

### Summarize a long piece (conclusion first, then details)

When to use: a long, wordy article or report, and you want to grab quickly what it's saying.

```text
Please summarize the long piece below, for someone who has no time to read the whole thing.
Summarize based only on the original; don't add information or opinions that aren't in it. Where the original isn't clear, mark it "the original isn't explicit."
Output:
1. A one-sentence main point (what is this piece really trying to say);
2. Three to six key points, ordered by importance;
3. If the original has an explicit conclusion or recommendation, list it separately.
Keep the whole thing under <word count> words, in plain language.
Here's the original:
<paste the long piece>
```

How to fill it in:
- `<word count>`: the summary length you want.
- `<original>`: the long piece to summarize, pasted in as one block.

Tip: even a good summary drops details, so for important decisions don't rely on the summary alone. Go back to the matching passages in the original.

### Compare several pieces of material side by side

When to use: you have two or three pieces of material on the same thing (a few quotes, a few viewpoints) and want to see the similarities and differences clearly.

```text
Below are <number> pieces of material, all about "<the shared topic>." Please compare them side by side.
Compare based only on these pieces; don't bring in information from outside them.
Please use a table: each column is one piece of material, and each row is one comparison dimension (the dimensions I want: <dimension 1>, <dimension 2>, and so on).
Below the table, add two more points:
1. The biggest thing these pieces agree on;
2. The clearest disagreement or difference between them.
If a piece doesn't mention a dimension, write "not mentioned" in that cell.
Here's the material:
Material 1: <paste>
Material 2: <paste>
(continue as needed)
```

How to fill it in:
- `<the shared topic>`: the thing these pieces all revolve around.
- `<dimension>`: the angles you want to compare from, such as "price, service, risk."

Tip: label each piece clearly as "Material 1 / Material 2," so it doesn't mix them up when comparing.

### Pull specific points out of the material

When to use: out of one big piece of material, you only want to fish out one kind of information (all the dates, all the amounts, all the to-dos).

```text
Below is a piece of material. Please find every "<what you want to extract>" in it.
Requirements:
- Extract only what actually appears in the material; don't guess or fill in gaps;
- For each item, also note which part of the material it appears in (for example, which paragraph or under which subheading), so I can go back and check;
- If this kind of information actually isn't in the material, just tell me "none found" rather than padding it out.
Here's the material:
<paste the material>
```

How to fill it in:
- `<what you want to extract>`: the kind of information you're fishing for, such as "all the time points mentioned" or "all the names."
- `<material>`: the raw material.

Tip: having it "note where each came from" lets you verify against the original quickly, instead of blindly trusting its extraction.

### Lay the material out into an outline

When to use: you're going to write an article, give a report, or teach a class based on a piece of material, and you want a clear skeleton first.

```text
I'm going to make a <use, for example: talk / article / training session> based on the material below. Please build me an outline first.
Organize it based on the material; don't add arguments that aren't in it.
Outline requirements:
- Split it into a few big blocks, each with a clear subheading;
- Under each subheading, use a sentence or two to say what that block covers and which part of the material it maps to;
- Order the whole thing along a logic of <for example: simple to deep / chronological>.
After building the outline, tell me: are there any blocks where the material is thin and I might need to add more?
Here's the material:
<paste the material>
```

How to fill it in:
- `<use>`: this decides how the outline is organized. A talk and an article have different skeletons.
- `<material>`: the basis for the outline.

### "Understand first, then summarize" for long material over several turns

When to use: the material is very long and very technical, and you're worried it'll start summarizing off-track right away.

```text
I'm about to send you a long piece of material in several parts. Please work with me using these steps:
1. When I send a part, don't summarize yet; just reply "received part N";
2. When I say "that's all," then begin;
3. To begin, first tell me in three to five sentences what this material is about overall, so I can confirm you've got the right direction;
4. Once I confirm the direction is right, then do the detailed summary as I ask.
Throughout, use only the material I send; don't add your own. If you understand, reply "understood, please start sending the material."
```

How to fill it in:
- This template has no blanks to fill. Just send it to the AI, then start pasting your material part by part.

Tip: have it restate "what this is about overall" first, and only after you confirm the direction let it do the detail. This step blocks most "summary went off-topic" problems.

---

## 5. Claude Code: investigate -> plan -> implement -> sign-off

> Claude Code is an AI coding tool that "edits code and runs commands for you." The templates below **are all plain-language things you say to it, not commands or buttons inside a product**. Exactly how to install it, and what shortcuts and features it has, change from version to version, so **check the official docs**.
> One safety thread runs through this category (Chapters 23 to 30): **have it investigate first, look at its plan first, see what it changed (the diff), run the tests, and let a human sign off at the end. Don't merge code you can't understand, and never paste anything containing keys or passwords.**

### Step 1: investigate only, don't touch anything yet

When to use: you want to make a change in a project, but you (and the AI) don't yet know where the relevant code is or how it's written now.

```text
Don't change any code yet; this step is investigation only.
What I want to do is: <the change you want to make, in plain language>.
Please investigate and lay out clearly (with file paths):
- Which files the relevant code lives in now, and roughly how it's built;
- Whether the project has a similar existing approach I could reference or reuse;
- Which areas this change is likely to touch.
When you're done, give me just a list. Don't propose specific changes yet; wait until I've read it, then we'll talk about the next step.
```

How to fill it in:
- `<the change you want to make>`: your goal, the more specific the better.

Tip: open the two or three file paths it lists and take a look yourself, to confirm it hasn't "pointed at the wrong place," before going further.

### Step 2: show me the plan first, don't write yet

When to use: once the investigation is clear, you want it to put forward a plan, and you approve it before it touches anything.

```text
Based on that investigation, please give me an implementation plan first, and **don't change any code until I approve it**.
What I want to do: <restate your goal>.
In the plan, spell out:
- Which files you plan to change or add, and what each does;
- Which existing approaches in the project you'll reuse;
- Whether you need to bring in a new external tool or library. If so, explain why, and whether there's a simpler alternative.
Design it to fit the project's existing way of writing and its style; don't start a separate style of your own.
After you give me the plan, if I'm happy with it, I'll reply "go with this plan."
```

How to fill it in:
- `<your goal>`: keep it consistent with the previous step.

Tip: the plan step is the checkpoint that saves the most rework. If the approach is wrong, don't approve it. Just say what needs to change and have it produce a new plan (Chapter 29).

### Step 3: implement per the plan, ask first if you hit a deviation

When to use: you've already approved the plan and want it to formally start changing code.

```text
Start implementing per the plan we confirmed.
Strictly follow these:
- Write entirely to the project's existing directory structure, naming, and code style;
- Prefer reusing the existing approaches we found during investigation; don't build a new one;
- If during implementation you find the plan has a gap, or you need a change outside the plan, stop and tell me first; don't take it upon yourself to widen the scope of the change;
- For each spot you change, say in one line what you changed and why.
```

How to fill it in:
- Use this template directly; no blanks.

Tip: when it feels like it's starting to change things outside the plan, stop it promptly and point that out. For exactly how to interrupt or roll back, **check the official docs**.

### Understand what it changed (explain the diff)

When to use: it's finished, and you want to see "which parts it actually touched," but you don't really understand the code.

```text
Please walk me through all the changes you made this time, file by file, explaining it to someone who doesn't know much about code:
- For each file, what you changed and why;
- Which changes are core, and which are just small supporting fixes;
- Could any of these changes affect features that used to work fine? If there's a risk, point it out.
If there's anywhere I read it and still feel uneasy, I'll follow up with "what exactly is this part doing?"
```

How to fill it in:
- Use directly; no blanks.

Tip: besides hearing it out, it's best to go through the list of changes it gives you yourself. **If you can't understand the code, or the explanation doesn't hold up, don't merge it.**

### Have it write tests first, then confirm nothing broke

When to use: you've finished changing code and want to confirm "the new feature is right, and the old features weren't broken."

```text
Please verify whether this change is solid.
1. First add tests for the feature you added or changed this time, covering the normal case and also the error and edge cases (such as empty data, very large data, oddly formatted input);
2. Run all the existing tests in the project too, to confirm you didn't break features that were working fine;
3. If any test fails, tell me which one and why, and propose a fix (don't make big changes right away).
Finally, in one sentence: is this change safe to merge now?
```

How to fill it in:
- Use directly; no blanks.

Tip: having it run the tests itself and fix based on the results is how it "self-corrects" (Chapter 27). But the final call on "is it safe to merge" rests with you.

### Fixing a bug: reproduce first, then fix

When to use: you have a bug to fix and want it not to flail around, but to understand the problem first.

```text
There's a bug to fix. Don't rush to change things; go in this order:
What happens: <what occurs when it goes wrong>.
When it shows up: <steps to reproduce, or the pattern you've observed>.
(If you have an error message, you can paste it here, but **before pasting, check whether it contains keys, passwords, or personal information, and mask anything it does**.)
Please:
1. First investigate the possible causes and list them from most to least likely;
2. First write a test that "reproduces this bug" (so it fails right now);
3. Then make the fix, until that test passes and all the existing tests still work.
Tell me after each step, and continue once I've confirmed.
```

How to fill it in:
- `<what happens>`: how the bug shows up.
- `<steps to reproduce>`: how to make the bug appear again. This is the key to locating the problem.

Tip: write a "failing test that reproduces the bug" first, and once it's fixed the test goes green on its own. That way you have proof the bug was really fixed, not just that it "looks fine."

---

## 6. Codex: another way to use a coding agent

> Codex is another AI coding agent that "does the work for you," and the mental model is a lot like the previous category (Claude Code): **both rely on you giving the task in plain language, and both should follow the safe flow of "investigate -> plan -> implement -> sign-off."** What's below is, again, "things you say to it," **not product commands**.
> Important: Codex's specific features, install method, commands, and supported actions change from version to version, so for every specific operation in this category, **check the official docs**. This appendix only teaches "how to say things clearly"; it doesn't vouch for the product's features.

### Getting started: have it get to know the project first

When to use: it's your first time using it in a particular project, and you want it to get the lay of the land before doing work.

```text
This is the first time I'm having you work in this project. Please help me get familiar with it first, and **don't change anything at this step**.
Please tell me:
- Roughly what this project does and which main parts it's made of;
- What the key files and folders are each for;
- If I want to do <what you plan to do>, roughly which areas it would involve.
Explain it in language someone like me, who doesn't know much about code, can follow, and include file paths so I can match things up.
```

How to fill it in:
- `<what you plan to do>`: the change you want to make next, so it circles the relevant spots along the way.

Tip: which tools it can call, and whether it can run commands, differ by version, so **check the official docs**.

### Before giving it the task, ask for a plan

When to use: you want to hand it a specific task, but you want it to lay out an approach first, and you approve it before it starts.

```text
I have a task to hand you, but please give me an approach first and **don't change any code right away**.
Task: <what you want it to do, be specific>.
Background: <the relevant situation, such as the current problem with this feature and what you expect>.
Please give me a plan first: which areas to change, how, whether it'll affect other features, whether anything new needs installing.
Please stick to the project's existing way of writing and its style as much as you can. Once I confirm the plan, I'll reply "let's go."
```

How to fill it in:
- `<task>`: your specific need.
- `<background>`: the relevant situation, to help it understand the context.

Tip: just like the Claude Code category, "see the plan before doing the work" is the step that saves rework. It's a good general habit and doesn't depend on any specific product feature.

### Implement and explain the changes

When to use: once the plan is approved, have it do the work and also explain the changes clearly.

```text
Start implementing per the confirmed plan. Please follow these:
- Stick to the project's existing directory structure, naming, and style;
- If you can reuse an existing approach, don't rebuild one;
- If you find you need a change outside the plan, stop and ask me first;
- When you're done, explain file by file "what you changed and why," for someone who doesn't know much about code.
```

How to fill it in:
- Use directly; no blanks.

Tip: how to view the specific changes, and how to undo them, varies by tool, so **check the official docs**. But whatever tool you use, the principle doesn't change: **the changes have to be ones you can understand, and if you can't understand them, don't adopt them.**

### Run the tests, confirm nothing broke

When to use: after the changes, you want to confirm the quality, so have it add tests and verify.

```text
Please confirm this change is solid:
1. Add tests for the added or changed feature, covering normal, error, and edge cases;
2. Run all the existing tests, to confirm you didn't break the original features;
3. For anything that fails, tell me which one and why, give a fix idea, and don't make sweeping changes first.
In one final sentence, tell me: is this change OK to merge?
```

How to fill it in:
- Use directly; no blanks.

Tip: whether it can run tests automatically, and how, depends on the product, so **check the official docs**. But "tests should cover error and edge cases, and a human makes the final call" always holds.

### Fixing a bug (the safe flow)

When to use: you want it to fix a bug and want it to investigate first before acting.

```text
There's a bug to fix; don't rush to change things.
What happens: <how the problem shows up>.
How to reproduce: <steps or pattern to reproduce>.
(If you're going to paste an error message, **check and mask the keys, passwords, and personal information in it first**.)
Please: (1) first list the possible causes from most to least likely; (2) first write a failing test that reproduces this bug; (3) then fix until the test passes and the existing tests are unaffected. Confirm with me after each step.
```

How to fill it in:
- `<what happens>` / `<steps to reproduce>`: same as the bug-fixing template in the previous category, these are the key to locating the problem.

Tip: whatever tool you use, the same safe habits apply: reproduce first, then fix, let a human sign off, and don't paste keys.

---

## 7. Project management: breaking down tasks, planning, tracking progress, retrospectives, risk

### Break a big goal into doable tasks

When to use: you have a big goal (running an event, building a product, finishing a project) and don't know where to start.

```text
I have a goal: <your goal>.
Background and limits: <available time, budget, helpers, deadline, and so on>.
Please break it into a list of doable tasks:
- First split it into a few big phases, each with a clear name;
- Under each phase, list the specific small tasks to do;
- Mark the dependencies between tasks (which ones must finish before the next can start).
Present it as a layered list or a table. When you're done, tell me: which phase is most important and most likely to go wrong.
```

How to fill it in:
- `<your goal>`: what you want to achieve.
- `<background and limits>`: constraints like time, money, and helpers, which decide how the tasks are arranged.

### Lay out a plan with dates

When to use: the tasks are broken down, and you need to arrange "what to do when."

```text
Below is my list of tasks. Please lay them out into a plan with dates.
Start date: <start day>; target finish date: <due day>.
People and time available: <for example: just me, 2 hours a day / three people full-time>.
Please schedule it as a table, listing each task's start and end dates and its owner (if any).
Note:
- Leave some buffer for the key tasks and the ones easy to put off; don't schedule it too tight;
- Place the "must be done in order" tasks in the right sequence.
Here's the task list:
<paste your task list>
```

How to fill it in:
- `<start day>` / `<due day>`: the two endpoints of the schedule.
- `<people / time available>`: this decides how much can run in parallel and how much you can move forward each day.

Tip: plans never survive contact with reality, so treat it as a first draft and come back to adjust it as you go.

### Sort out progress, see whether we're behind

When to use: the project is halfway through, and you want to sort out "what's done, where it's stuck, and what's still missing."

```text
Let me report where the project stands; please help me sort out the current state.
The original plan was: <briefly describe the original plan, or paste it in>.
The actual situation now: <what's done, what's in progress, what blockers you've hit>.
Based on what I've said, please sort out:
1. Which tasks are done, which are in progress, which haven't started;
2. Against the original plan, are we ahead, on track, or behind;
3. If we're behind, where it's stuck and how to catch up.
Analyze based only on the information I provide. Where information is missing, ask me directly rather than assuming for me.
```

How to fill it in:
- `<original plan>`: the original arrangement, used as the baseline.
- `<the actual situation now>`: the real progress; the more honest, the more useful.

Tip: "ask me if information is missing, don't assume" matters a lot. Otherwise it might give you a progress read that looks good but is distorted by guesswork.

### Find the project's risks in advance

When to use: before or during a project, you want to anticipate "what could go wrong."

```text
Please do a risk review of this project and find the spots that could go wrong in advance.
Project overview: <what this project does, its goal and key limits>.
Please act as an experienced, nitpicky project advisor and list the possible risks:
- For each risk, spell out: what could happen, why, and how big the impact is;
- Mark the "likelihood" and the "impact" each as high / medium / low;
- For high-risk items, give one or two ways to prevent or handle them.
Please especially flag the risks that "optimism tends to overlook."
```

How to fill it in:
- `<project overview>`: the project's situation. The more specific, the more the risk read fits reality.

Tip: having it "act as a nitpicky advisor" forces out real problems better than vaguely asking "what are the risks." Giving it a role is a handy little trick (Chapter 11).

### Project retrospective (sum up after it's done)

When to use: a project or phase has ended, and you want to sum up the lessons learned.

```text
Please do a project retrospective.
Project / phase overview: <what was done, what the original goal was>.
Actual result: <how it turned out in the end, compared with the goal>.
Key events along the way: <what went smoothly, the pitfalls you hit, the last-minute changes>.
Based on the information I provide, please organize:
1. What was done well and worth keeping next time;
2. What went wrong or could be improved, and how to avoid it next time;
3. The three lessons most worth remembering.
Sum up based only on what I've said; don't invent episodes I didn't mention.
```

How to fill it in:
- `<project overview>` / `<actual result>` / `<key events>`: the three raw ingredients of a retrospective, which decide the quality of the summary.

Tip: a retrospective is about "how to do better next time," so have it turn the improvements into specific actions, instead of stopping at empty talk like "try harder."

### Write a progress update for a key person

When to use: you need to give a manager, client, or partner a short update on the project.

```text
Please write a project progress update for me, to send to <the audience, for example: a manager / a client>.
Write it based on the situation I provide; don't add progress I didn't mention.
The content comes from: <what's done, what's next, and whether there's anything you need the other person's support or sign-off on>.
Requirements:
- Lead with the conclusion and the key points, so the other person gets it in ten seconds or so;
- Split it into three small blocks: "done / in progress / need your support";
- Tone <for example: professional, concise, no spinning good or bad>.
Keep it under <word count> words.
```

How to fill it in:
- `<audience>`: who you're updating, which decides the detail and tone.
- `<content comes from>`: the real progress, the raw material it organizes the content from.

Tip: have it list "things that need the other person's support or sign-off" separately, so they know what decisions to make for you.

---

## The universal skeleton (when you can't recall a template, fill this in)

> Underneath, every template above is this one structure. In any situation, as long as you fill in the five blocks below clearly, you've got a good prompt. When you can't recall a specific template, come back to this skeleton.

```text
[Context] I'm <your identity / situation>, and I'm <the thing you're solving or the setting you're in>.
[Task] Please help me <the specific thing to do, as clear as possible>.
[Constraints] Please follow these requirements:
- <constraint 1, such as: length / style / what must be included or avoided>;
- <constraint 2>;
- (if material or facts are involved) please work only from what I give you; if it's not in the material, say so, and if you're unsure, say you're unsure, don't make things up.
[Output form] Please give it to me as <a table / bullet points / a single paragraph / conclusion first then details, and so on>, length about <length>.
[Standard for success] For me, it counts as success if you <what counts as good enough, for example: a manager gets it at a glance / the tests pass / it covers these few points>.
If you think the information still isn't enough, or there's a better approach, tell me before you start.
```

How to fill it in:
- **Context**: who you are, what situation you're in. The AI can't read your mind, so this is the premise for it understanding you.
- **Task**: what exactly you want it to do, stated with a verb ("organize into a table," "rewrite as an email").
- **Constraints**: your limits and preferences. When material or facts are involved, be sure to add "work only from the material, don't make things up, and say so if you're unsure."
- **Output form**: the shape you want. Say it clearly up front so it doesn't give you the wrong format.
- **Standard for success**: what counts as getting it right. This is the one the whole book emphasizes most; it gives the AI a yardstick to "check itself" against.

> Stating what you want in the positive ("write to the existing style," "keep it to 300 words") works better than the negative ("don't write all over the place," "don't make it too long"). It's a small trick the book holds to throughout, and it applies inside any of the `<constraints>` above.
