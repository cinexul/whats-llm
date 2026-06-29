After a meeting ends, the headache isn't the meeting itself — it's the notes afterward: a big block of text from a transcribed recording, or a page of sloppy shorthand, with sentences scattered all over and who has to do what and whether anything was decided all buried inside, and tidying it into a sendable set of notes eats up another half hour.

This chapter's project is to make a **meeting-notes assistant**: turning a messy **transcript or shorthand** into a clearly structured **set of meeting notes**, with topics, conclusions, to-dos, and owners sorted into categories and clear at a glance.

Why use this to get hands-on? Because it combines two things you learned earlier: "handling long text and summarizing material" from Chapter 12 and "stating what you want clearly" from Chapter 11. And it has one especially practical trick that this chapter is just right for spelling out fully: **rather than verbally telling it "format it like this, like that" before every meeting, give it one fixed template once and have it fill in the blanks.** This "give it a template" approach is an effort-saving move you can reuse over and over when dealing with AI.

But like the last chapter, this one also has a **red line that must be nailed down**, so let's put it right up front.

> **Key point:** **The to-dos and owners must be checked by you, manually, line by line, before they go out.** This is the bottom line this chapter won't budge on. The reason: if other parts of the notes are wrong, the worst case is some awkward wording; but with a to-do like "**who's responsible for what, due when**," once it's wrong — it pins Zhang San's task on Li Si, or simply invents a task no one mentioned — those notes, once they go out, **really mislead people and cause real harm**. It might **mishear** (transcripts are error-prone to begin with) and it might **invent** (the hallucination from Chapter 9). So: the notes you can have it generate, **but the to-dos and owners column is what you sign your name to, and you must check every line yourself before it goes out.**

## 1. Getting ready: what you need, the minimum starting point

This chapter doesn't necessarily call for a coding agent; much of the time a regular AI chat can do it. But the approach is exactly the same: **a clear input, a fixed template, and strict human checking.**

**The minimum starting point you need:**

- **A raw record of a meeting**: a transcribed recording, shorthand, or a draft you typed while listening, any of these works. **The more complete the better**; it can only tidy what you give it, and what you don't give it, it doesn't know (if you leave something out, it either drops it or "fills in the blanks").
- **An AI**: as long as it can read long text and tidy by the format you give. It can be an AI chat product, or a coding agent that acts on your files (**the form varies, so refer to the provider's official documentation**, Chapter 24).
- **A notes template you've decided on**: this is the key prop of this chapter, and Step 1 below makes it specifically.
- **A mental readiness to check**: treat "checking the to-dos and owners line by line before they go out" as the **last step you can't skip** in this task, the way you always check the address before mailing a package.

> **Key point:** This chapter has an interesting difference from the "personal website" one: the website's results are **visible** (a refresh tells you whether it's right), whereas the notes' results **look right but may actually be wrong**. They're laid out neatly and read smoothly, but the owner of some to-do might be entirely invented. **Precisely because "looking right" is the most deceptive, human checking is all the more not to be skipped.**

## 2. Doing it step by step

Each step below gives one **plain-language line to say to the AI** (this is what you say to the AI, **not a product command**), and **what you, the human, need to confirm**. The overall rhythm is: **set the template, feed it the source and have it fill in, check item by item (with to-dos and owners the focus), finalize.**

### Step 0: Get the "raw record" complete first

You can't cook without ingredients. Before tidying, get the source you're feeding it complete and full.

> Plain-language request: *"I'm going to send you a transcribed recording of a meeting shortly and have you tidy it into notes. The transcript may have casual speech, repetition, and misheard spots, so be ready for that."*

**What you need to confirm:**
- Check whether the source you have is **complete enough**. When tidying, it **only recognizes what you give it**; the parts you leave out, it either drops or invents something to fill in. **The fuller you give it, the less room it has to invent.**

### Step 1: Set a fixed template (the core move of this chapter)

Don't rush to have it "tidy this up." First **decide what you want the notes to look like as a fixed template**, and have it fill in the blanks.

> Plain-language request: *"From now on, when tidying meeting notes, always use this template. You just fill it in; don't change the headings, don't change the order:

> **Meeting topic:**
> **Date / attendees:**
> **Topics discussed:** (in bullet points)
> **Conclusions reached:** (in bullet points)
> **To-dos:** (each one written clearly: what to do / who's responsible / due when)
> **Open / needs further confirmation:**

> If a column has no matching content in the record, write '(not mentioned in the record)', **don't invent anything.**"*

**What you need to confirm:**
- This template is **set once and reused every time after**, which is exactly where "giving a template" saves effort: you don't have to verbally re-explain the format before every meeting.
- Two lines in the template deserve special attention: the to-dos column explicitly requires "**what to do / who's responsible / due when**," all three (which is exactly what you'll focus your checking on later); and the line "**if you can't find it, write 'not mentioned,' don't invent.**" This is an "anti-invention" instruction for it, which can cut down its random filling, but **it can't replace your checking.**

> **Key point:** Why is "giving a fixed template" better than verbally explaining each time? Because **verbal explanations can drop or shift each time**, so its output is hit or miss; whereas a written-down template nails "the format I want" once, and it fills in by the same frame each time, so **the results are stable and you check them faster** (just go column by column). This approach isn't only for notes; for anything you want AI to produce repeatedly in "the same format," you can give it a template first.

### Step 2: Feed in the source and have it fill the template

With the template set, give it the meeting source and have it tidy by the template.

> Plain-language request: *"Here's the transcript (paste the content / give it the file). Please tidy it into notes strictly by the template above. Every to-do must clearly state who's responsible and due when; for ones where the record doesn't clearly state the owner or time, mark '(not specified)', **don't arrange it for them, and don't invent.**"*

**What you need to confirm:**
- First scan whether the **structure is right**: is it strictly by your template, did any column get dropped. If the structure is off, have it rearrange; this step is easy to check.
- On the content level, **don't rush to trust it**; the next step is the real gatekeeping.

### Step 3: Check item by item, with to-dos and owners the focus (the crux of this chapter)

**This is the most important step of the whole chapter, never to be skipped.** However nicely it fills it in, it's only a "draft to be checked."

Checking comes at two intensities:

- **Overall read-through (medium intensity)**: for things like topics and conclusions, read against the source for any distortion or any "undecided" thing written as decided.
- **Line-by-line grinding (highest intensity), for to-dos and owners only**: for **each** to-do, go back to the source and confirm three things:
  1. **Did someone really bring this up?** (guards against it inventing tasks)
  2. **Is the owner really this person?** (guards against it pinning one person's task on another, or mishearing a name)
  3. **Is the time / deadline something it added itself?** (guards against it filling in "as soon as possible" as a specific date)

> Plain-language request (you can have it prove itself while checking): *"For each to-do, mark the sentence in the source it corresponds to, so I can check line by line. For ones with no clear basis in the source, mark them out separately."*

**What you need to confirm:**
- Have it **trace each to-do back to its source line**, and you go through them one by one against those lines. **The ones that don't match the source are what it invented or misheard**; change or delete them right away.
- Picture the cost of skipping the check: one invented "Li Si to submit the plan by Friday" sent into the group chat, Li Si baffled, and the person who really should submit not notified. **The notes' damage lies precisely in this kind of "looks formal but is actually wrong" to-do.** Five extra minutes on this step heads off real harm.

### Step 4: Finalize

Only after checking confirms it's right is it finalized and ready to send.

**What you need to confirm:**
- Read it through one last time, confirm these are notes **you dare put your name to and dare take responsibility for on every to-do**, then send.
- That nerve to "take responsibility" comes not from how nicely it generated them, but from **the line-by-line check you just did.**

## 3. Common pitfalls

- **Skipping the check and mass-sending directly.** This is the most serious pitfall of this chapter. It can write a fake to-do that looks exactly like a real one. **Not checking to-dos and owners line by line before sending is the same as handing its mishearing and invention straight to your colleagues.**
- **Fooled by "looks right."** Notes that are laid out neatly and read smoothly are the most deceptive. **Format right does not equal content right**; a neat structure is all the more reason to check line by line.
- **Re-explaining the format verbally every time.** Drop a bit, shift a bit, and the output is hit or miss. **Set one fixed template and reuse it**, steady and worry-free.
- **Giving the source incomplete, then blaming it for dropping things.** It only recognizes what you give it; **it can't possibly know what you didn't feed in**, and when something's missing it either drops or invents. Getting the source complete first is the root way to cut down its "filling in."
- **Forcing "not specified" into "specified."** If the source only says "follow up as soon as possible after the meeting," don't let it (or yourself) insist on landing a specific person and date. **For anything uncertain, mark it honestly as "not specified / to be confirmed,"** and tracking someone down after the meeting beats inventing something misleading.
- **Carelessly feeding in meeting records with sensitive information.** For meeting content involving personnel, pay, customer privacy, or trade secrets, **feeding it in is the same as sending it out** (Chapter 37). Before processing this kind of record, think clearly about what can be handed over and what has to be de-identified first or simply not run through an online tool.

## 4. Taking it one step further

Once you've got the basics down, you can make this "assistant" suit your workflow better (all still the same old routine of "give a template, feed the source, check"):

- **Switch among several templates by occasion**: one for routine weekly meetings, one for client meetings, one for interview records, saved and ready to grab.
- **Generate "a to-do list for each person" along the way**: *"Split the to-dos by owner, and list each person's own tasks separately."* After splitting, **still check line by line**; don't relax your gatekeeping just because the layout changed.
- **Generate a "meeting recap email" draft**: have it draft a notification email based on the checked notes, but **you review it once before it goes out, same as always** (Chapter 39 covers "reviewing and being responsible for AI-generated content"; what goes out carries your name, you're responsible).
- **Distill the template and the checklist into a "standard operating procedure"**: so the next person who tidies follows it too. Whether to make it into a more automated process, take it as far as you can manage, and **for the specifics, refer to the provider's official documentation.**

> **Key point:** However fancy "taking it one step further" gets, that red line doesn't retreat one step: **any output that lands on "who should do what," whether a to-do list or a notification email, must be checked manually, line by line, before it goes out.** A template helps you standardize the format and get the work done faster, but **"being responsible for the content" is something AI can't do for you.** It fills in, you sign your name.

## Summary

- The third project is a **meeting-notes assistant**: turning a messy transcript or shorthand into clearly structured notes of "topics / conclusions / to-dos / owners."
- The core effort-saving move: **give it a fixed template to fill in**, instead of verbally explaining the format each time; the template is set once and reused, so the results are stable and checking is fast.
- **The red line that won't budge: the to-dos and owners must be checked manually, line by line, before they go out.** It might **mishear** (transcript error) or **invent** (hallucination), and this kind of mistake, once out, **causes real harm.**
- The crux of checking is to have it **trace each to-do back to its source line**; the ones that don't match are wrong, so change or delete them right away; mark uncertain ones honestly as "not specified / to be confirmed," and don't force-fill.
- Notes that "look right" are the most deceptive; **format right doesn't equal content right**; think clearly before handing over meeting records with sensitive information (Chapter 37), and what goes out carries your name and your responsibility (Chapter 39).

That wraps up the first three "close to life" projects of Part Five. You should already feel that producing results rests not on knowing how to code, but on **stating what you want clearly, setting the template well, and checking the results**, a skill that runs through the whole book.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Project chapters lean toward scenario and hands-on. Think first, then read the answer explanations in the quote blocks.

1. **[Basic · Concept]** What method does this chapter suggest to save the hassle of "verbally explaining the notes format before every meeting"?
   - A. Verbally re-explain each time, in more detail
   - B. Give it one fixed template, and have it fill in each time
   - C. Just skip the format entirely
   - D. Let it improvise, different each time
   > **Answer: B.** Verbal explanations can drop or shift each time, so the output is hit or miss; a written-down template nails "the format I want," and it fills in by the same frame each time, so the results are stable and you check them faster. This "give a template" approach works for anything you want to produce repeatedly in the same format.

2. **[Basic · Concept]** What is this chapter's "red line that won't budge"?
   - A. You must use the most expensive AI
   - B. The to-dos and owners must be checked manually, line by line, before they go out
   - C. The notes must be over a thousand words
   - D. You must be online to tidy
   > **Answer: B.** A mistake elsewhere is at worst some clumsy phrasing, but with a to-do like "who's responsible for what, due when," once it's wrong (it misheard or invented), once the notes go out it really misleads people and causes real harm. The to-dos and owners column is what you sign your name to, and you must check every line yourself before it goes out.

3. **[Advanced · Misconception]** "These notes are laid out neatly and read smoothly, so they're probably fine, just mass-send them." What's wrong with this?
   - A. Nothing wrong, neat means right
   - B. Format right doesn't equal content right; it can write an invented to-do that looks exactly like a real one, and the more it "looks right" the more you must check line by line
   - C. Neat notes can't be mass-sent
   - D. Mass-sending costs money
   > **Answer: B.** The notes' results "look right but may actually be wrong," which is exactly where they're most deceptive. It can lay out a task no one mentioned or a wrongly assigned owner without a flaw. A neat structure is all the more reason to gatekeep; don't be fooled by "looks right."

4. **[Advanced · Scenario]** When checking the to-dos, what's the most efficient and reliable way?
   - A. Go by impression, it's about right
   - B. Have it trace each to-do back to the matching sentence in the source, and you check line by line against those sentences; the ones that don't match are what it invented or misheard
   - C. Delete the notes and regenerate them ten times
   - D. Only check whether the format is right
   > **Answer: B.** Have it "prove its source," and you can check line by line against the source: did someone really bring this up? Is the owner this person? Is the time something it added itself? The ones that don't match the source, change or delete right away. This is far more reliable than going by feel.

5. **[Basic · Scenario]** The transcript only says "follow up on the coordination after the meeting as soon as possible," with no specific who or what day. What's the safest way to write this to-do in the notes?
   - A. Have it pick a person and invent a date to fill in
   - B. Mark it honestly as "owner / time not specified, to be confirmed," and track someone down after the meeting
   - C. Just delete this one
   - D. Write "everyone, immediately"
   > **Answer: B.** For anything uncertain, mark it honestly as "not specified / to be confirmed," and never fill in "as soon as possible" as a specific person and date. Inventing a misleading specific arrangement is far worse than honestly leaving a to-be-confirmed and filling it in after the meeting.

6. **[Advanced · Hands-on]** Following Step 1 of this chapter, write your own "meeting-notes template" by hand (including at least: topic, topics, conclusions, to-dos [what to do / who's responsible / due when], to be confirmed). After writing it, answer: why does the to-dos column specifically require stating "who's responsible, due when" clearly?
   > **What you should notice:** Because the to-dos are the **only part of the whole notes that lands on "a specific person doing a specific thing,"** and also the part **most likely to cause harm when wrong**; splitting it into "what to do / who / when" makes it both easy to assign and easy for you to check line by line before it goes out. A template standardizes the format, but "being responsible for the content" AI can't do for you. Which tool to use for tidying is **best confirmed against the provider's official documentation** (Chapters 24 and 25).
