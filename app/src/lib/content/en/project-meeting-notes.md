The worst part of a meeting is often the notes afterward: a long block of text from a recording, or a page of scribbles, with who's doing what and whether anything was actually decided buried inside, and another half hour to turn it into notes you can send.

In this chapter we build a meeting-notes assistant: it turns a messy transcript or shorthand into notes with topics, conclusions, to-dos, and owners clearly separated. It draws on Chapter 11's "say clearly what you want" and Chapter 12's long-text handling, plus one effort-saver you can reuse anywhere: instead of explaining the format out loud at every meeting, set a fixed template once and have it fill that in. When you're done you'll have two things: a notes template file you can reuse, and a set of notes you've checked line by line and are willing to send.

The red line in this chapter: **to-dos and owners must be checked by you, one by one, before the notes go out.** A mistake elsewhere in the notes means slightly inaccurate wording at worst. A wrong to-do, such as putting A's task under B's name or inventing a task nobody mentioned, causes real harm once it's sent. Transcripts are often misheard to begin with, and the model also makes things up (Chapter 9).

## 1. Getting ready: what you need, the minimum starting point

You don't necessarily need a coding agent for this; an ordinary AI chat product is often enough, and a coding agent's advantage is that it can read and write files directly. The idea is the same either way: complete input, a fixed template, a human check.

- The raw record of a meeting: a transcript of the recording, shorthand, or notes typed while listening; the more complete, the better. It can only work from what you give it; for anything you leave out, it either drops it or fills it in on its own. If you have nothing at hand, start with this practice transcript:

```text
(Practice transcript)
Chair: Today we need to set the date for the product launch.
Wang: The venue says both the 15th and the 22nd of next month are free.
Li: The 15th is too rushed. I'd go with the 22nd.
Chair: Then the 22nd it is. Who's sending the quote?
Wang: I'll send it to the client by Friday.
Li: The promo poster still needs following up soon after the meeting.
```

- An AI: anything that can read long text and organize it in the format you give.
- A notes template you've settled on; Step 1 makes it.

Meeting notes differ from Chapter 31's website in one way: whether a website is right, you see on refresh; meeting notes can look neat and read smoothly while the owner of one to-do is made up. Precisely because they "look right," the check can't be skipped.

## 2. Doing it step by step

Each step gives you a plain-language line to say to the AI (something you say to it, not a product command) and what you need to confirm. The overall rhythm: set the template → hand over the source and have it fill the template → check item by item (to-dos and owners above all) → finalize.

### Step 0: Get the "raw record" complete first

What to confirm: is the source complete? If the start or end is missing, or only half the speakers were captured, the notes will be missing that part too, or it will be filled with invented content. Spoken style, repetition, and mishearings it can handle; what matters is that nothing is missing. The more complete the input, the less room it has to invent.

### Step 1: Set a fixed template

Don't rush to "tidy this up." First fix what your notes should look like as a template, and have it fill in the blanks.

> Plain-language request: *"From now on, use the template below for meeting notes. Just fill it in; don't change the headings or the order. If you can't find matching content in the record for a field, write '(not mentioned in the record)'; don't invent anything."*

```text
Meeting topic:
Date / attendees:
Topics discussed: (bullet points)
Conclusions reached: (bullet points)
To-dos: (each with: what to do / who's responsible / due when)
Open / needs further confirmation:
```

What to confirm:

- Two things in the template deserve attention. The to-do field asks for all three of "what / who / when," which is exactly what you'll check closely later; "if you can't find it, write not mentioned, don't invent" is an anti-invention instruction that cuts down on guessing but doesn't replace your check.
- Save the template as a file, for example `notes-template.txt`. With a coding agent you can have it create the file in the project folder; with a chat product, keep it on your computer and paste it in together with the transcript next time. The model itself doesn't remember the previous conversation (Chapter 9); the file is what stays.

A template beats explaining out loud because spoken instructions slip or change each time and the output varies with them; a written template has it fill the same frame every time, so the result is stable and you only need to check field by field. Whenever you want an AI to produce the same kind of format again and again, give it a template first.

### Step 2: Hand over the source and have it fill the template

> Plain-language request: *"Here's the transcript (paste the content or hand it the file). Turn it into notes strictly following the template. For each to-do, state clearly who's responsible and when it's due; where the record doesn't clearly name an owner or a time, mark it '(not specified)'. Don't assign anyone and don't invent anything."*

What to confirm: first skim the structure: does it follow the template strictly, is any field missing? If not, have it redo the layout. Don't trust the content yet; the real check is the next step.

### Step 3: Check item by item, with to-dos and owners the focus

This is the most important step in the chapter. However neat its work looks, it's a draft waiting to be checked. There are two levels of checking:

- Topics and conclusions: compare them with the source as a whole for distortion, and for anything undecided written up as decided.
- To-dos and owners: go back to the source for each one and confirm three things. Did someone really bring this up? Is the owner really this person? Is the time from the source, or did it add one, for example turning "soon" into a specific date?

> Plain-language request: *"For each to-do, point to the sentence in the source it corresponds to. Mark separately any that have no clear basis in the source."*

What to confirm: follow the sources it gives and check them one by one; anything that doesn't match the source was invented or misheard, so fix or delete it on the spot. With the practice transcript, correct notes have one conclusion, the launch is on the 22nd of next month, and two to-dos: Wang sends the quote to the client by Friday; the promo poster needs following up, with owner and time both not specified. If it writes "Li owns the poster, due next Monday," it has made a decision on the meeting's behalf.

Skip this step and an invented "B to submit the plan by Friday" goes into the group chat, B is baffled, and the person who really owed it never hears. Five extra minutes of checking prevents real harm.

### Step 4: Finalize

Read it through one last time and confirm you'd put your name to these notes and can point to the basis for every to-do, then send them.

### Done when

The project is done when all of these are true:

- You have a `notes-template.txt` (name it as you like) ready to use at the next meeting.
- The notes follow the template strictly with no missing fields; fields with nothing in the record say "(not mentioned in the record)."
- Every to-do points to a sentence in the source, and you've checked each one; owners or times the source didn't make clear are marked "not specified."
- If you tried the practice transcript: the poster item has no owner or date attached.

## 3. Common pitfalls

- Skipping the check and sending to the whole group. It can write a fake to-do that looks exactly like a real one; sending unchecked passes its mishearings and inventions straight on to your colleagues.
- Being fooled by "looks right." A correct format doesn't mean correct content; the neater it looks, the more you should check item by item.
- Re-explaining the format out loud every time. Things slip and shift, and the output varies; use the saved template file.
- Giving an incomplete source and blaming it for gaps. It only knows what you give it; anything missing gets dropped or invented.
- Forcing "not specified" into "specified." If the source only says "follow up soon," don't let it (or yourself) attach a person and a date. Mark it "not specified / to be confirmed" and get someone to fill it in after the meeting.
- Passing along sensitive meeting records without thinking. HR, salaries, client privacy, trade secrets: before handing them over, think about whether they can go at all and whether to anonymize first (Chapter 37).

## 4. Taking it one step further

All of these follow the same routine: give the template → hand over the source → check.

- Switch templates by occasion: one for the weekly meeting, one for client meetings, one for interview notes, each saved as its own file.
- Split to-dos by person: *"Split the to-dos by owner, with a separate list for each person."* After splitting, check line by line just the same.
- Draft a follow-up email: have it draft one from the checked notes, and review it yourself before sending; what goes out carries your name and is your responsibility (Chapter 39).
- Write the template and the checking steps onto one page, so whoever takes the notes next time can follow them.

## Summary

- This project turns a messy transcript or shorthand into notes with clear topics, conclusions, to-dos, and owners.
- The effort-saver is a fixed template for it to fill in, saved as a file and reused; the model doesn't remember the last conversation, but the file stays.
- The red line: check to-dos and owners one by one before sending. It may mishear and it may invent, and once sent, those mistakes cause real harm.
- When checking, have it point each to-do back to the source, fix or delete anything that doesn't match, and honestly mark what's unclear as "not specified / to be confirmed."
- A correct format isn't correct content; think before handing over sensitive meeting records (Chapter 37), and what you send is your responsibility (Chapter 39).

With that, the first three everyday projects of Part Five are done: getting results came not from writing code, but from stating needs clearly, setting a good template, and checking the results.

---

## Quiz

> 6 questions, covering concept, misconception, scenario, and hands-on. Project chapters lean toward scenario and hands-on. Think first, then read the answer explanations in the quote blocks.

1. **[Basic · Concept]** What method does this chapter suggest to save the hassle of "verbally explaining the notes format before every meeting"? <!-- quiz: q01 revision: 2 -->
   - A. Explain the format in more detail before each meeting
   - B. Have it look at last time's notes and keep the format itself
   - C. Set one fixed template and have it fill that in every time
   - D. Let it tidy freely, then fix up the format yourself at the end
   > **Answer: C.** Verbal explanations can drop or shift each time, so the output is hit or miss; a written-down template nails "the format I want," and it fills in by the same frame each time, so the results are stable and you check them faster. A is still explaining out loud, and however detailed, it drifts; B relies on it "remembering last time," but the model itself doesn't remember across conversations, and if you hand it last time's notes again, you're really just giving it a template; D hands the formatting work back to you.

2. **[Basic · Concept]** What is this chapter's "red line that won't budge"? <!-- quiz: q02 revision: 2 -->
   - A. Check to-dos and owners by hand, line by line, before sending
   - B. Clean up the transcript by hand before you give it to the AI
   - C. Never leave any "not specified" items in the notes
   - D. Write "don't make things up" in the template and it won't
   > **Answer: A.** A mistake elsewhere is at worst some clumsy phrasing, but with a to-do like "who's responsible for what, due when," once it's wrong (it misheard or invented), the notes go out and really mislead people and cause real harm, so you must check every line yourself before sending. B isn't needed: it can handle a conversational transcript, and what matters is that the transcript is complete; C is the opposite of the advice, since anything uncertain should be marked "not specified"; D's "don't invent" instruction cuts down on guessing but can't replace your check.

3. **[Advanced · Misconception]** "These notes are laid out neatly and read smoothly, so they're probably fine, just mass-send them." What's wrong with this? <!-- quiz: q03 revision: 2 -->
   - A. Mass-sending is too informal; send them to each person instead
   - B. The issue is the missing signature; add your name and send
   - C. Smooth reading shows it understood the meeting; send it
   - D. Right format isn't right content; still check each to-do
   > **Answer: D.** The notes' results "look right but may actually be wrong," which is exactly where they're most deceptive. It can lay out a task no one mentioned or a wrongly assigned owner without a flaw. C mistakes "reads smoothly" for "understood" and "correct," but fluency doesn't prove the content is right; A and B change how you send or add a signature, and neither touches the problem that the content may be wrong.

4. **[Advanced · Scenario]** When checking the to-dos, what's the most efficient and reliable way? <!-- quiz: q04 revision: 2 -->
   - A. Have it give each to-do a confidence score from 1 to 10
   - B. Have it cite each to-do's source line, then compare
   - C. Send the notes out and let attendees spot the errors
   - D. Have it redo the notes in other words and compare the two
   > **Answer: B.** Have it "prove its source," and you can check line by line against the source: did someone really bring this up? Is the owner this person? Is the time something it added itself? The ones that don't match the source, change or delete right away. A's score is still its own judgment, and a high score can sit on an invented item; C pushes the checking onto the recipients after the wrong to-do has already gone out; D's two versions can make the same mistake.

5. **[Basic · Scenario]** The transcript only says "follow up on the coordination after the meeting as soon as possible," with no specific who or what day. What's the safest way to write this to-do in the notes? <!-- quiz: q05 revision: 2 -->
   - A. By meeting custom, assign it to the meeting chair
   - B. Delete it, so the notes don't carry anything uncertain
   - C. Mark it "owner and date not specified, to be confirmed"
   - D. Have it infer the most likely person and date from context
   > **Answer: C.** For anything uncertain, mark it honestly as "not specified / to be confirmed," and never fill in "as soon as possible" as a specific person and date. A and D make the decision on the meeting's behalf, producing an arrangement that looks specific but that nobody actually agreed to; B makes the item vanish from the notes, so nobody remembers to follow up afterward.

6. **[Advanced · Hands-on]** Following Step 1 of this chapter, write your own "meeting-notes template" by hand (including at least: topic, topics, conclusions, to-dos [what to do / who's responsible / due when], to be confirmed). After writing it, answer: why does the to-dos column specifically require stating "who's responsible, due when" clearly? <!-- quiz: q06 revision: 3 -->
   > **What you should notice:** Because the to-dos are the **only part of the whole notes that lands on "a specific person doing a specific thing,"** and also the part **most likely to cause harm when wrong**; splitting it into "what to do / who / when" makes it both easy to assign and easy for you to check line by line before it goes out. A template standardizes the format, but "being responsible for the content" AI can't do for you. For choosing a tool to do the tidying, see Chapters 18 and 24.
