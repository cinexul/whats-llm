AI has finished writing your draft, finished your proposal, generated a block of code, and just as you're about to copy, paste, and send, your finger hovers there: **can I use this as is? Who's on the hook if something goes wrong? Do I need to say "AI helped write this"? That data it cited, that quote, is it reliable?**

This chapter answers that whole string of questions. Its core is just one line: **AI can be your "ghostwriter," but it can't be your "responsible party."** The "how to say it" work, style, first drafts, wording, you can hand to it with confidence. But **whether the facts are right, whether it can be sent, whose it is, the final call is always a human's, yours.** We'll cover three parts: checking facts, copyright and attribution, and the easy-to-overlook gate when you use open-source code.

## 1. The hardest rule: check facts yourself

First, the most critical rule, the one most worth burning into muscle memory. This is what Chapter 9 (hallucination) and Chapter 15 (learning and verifying) stressed over and over, and at the "send it out" step, its weight is heavier still.

> **Any verifiable "hard fact," specific numbers, dates, names, places, quotes, sources, statutes, paper titles, statistics, must be checked by you against the original material. You can't use it directly just because "it wrote it so confidently."** The reason is still that line from Chapters 4 and 9: what the model is after is "**sounding true**," not "**being true**." It has no fact database to check against, and when it doesn't know, it follows the momentum of language and **makes up whatever reads as most plausible.** And **the more fluent and confident it is, the less that means it's reliable.**

This principle boils down to a division of labor that's especially easy to remember:

> **You can outsource style. You can't outsource facts.**

What does that mean? Look at a draft as two layers:

| This layer | What it is | Okay to hand to AI |
| --- | --- | --- |
| **Style / expression** | Wording, tone, structure, smoothing out the phrasing, putting it another way | **Yes**, outsource it. This is its best work (Chapter 16) |
| **Facts / content** | Whether those numbers, quotes, and sources are right, whether the conclusion holds | **No.** The final check has to be in **your** hands |

> **Key point:** Weld this division of labor shut: **let AI be the "ghostwriter," not the "source of facts."** It helping you write the thing beautifully (the style layer) is fine, but every "verifiable hard fact" in the draft, treat it as **doubtful by default, valid only after you've checked it yourself.** A practical workflow: after you've written it, pull out every **number, quoted line, name, and source** in the whole text one by one, and go back to the **original material** to check them (not by asking AI again! Ask it again and it might make it up again). This step doesn't take long, but it's the only reliable line of defense between you and "confident nonsense."

## 2. Copyright, attribution, and AI disclosure: varies by region and platform, still evolving

Next, the part everyone cares about most and most easily takes for granted: **the stuff AI generates, whose is it? Can it be used commercially? Do you have to label it as AI-made?**

The most important line has to go first.

> **The copyright ownership of AI-generated content, whether it can be used commercially, and whether you must label "AI involvement" are governed differently by the laws of different countries and regions and by the terms of different platforms, and these rules are still evolving fast. This book doesn't give a one-size-fits-all conclusion. The specifics go by the law of your region and the official terms of the platform or service you're publishing on; for important cases involving commercial use, copyright, or attribution, you should consult legal or professional advice.** This isn't dodging. It's because this matter **genuinely** has no unified answer and changes every year, so any pinned-down statement would mislead you.

Even without a fixed conclusion, here are a few relatively stable and genuinely useful pieces of common sense:

- **The content you input usually stays yours**: the original material you paste in for it to work on (your article, your data) generally doesn't change ownership just because it "went through AI" once. But the specifics still go by the terms.
- **The platform's terms govern "who owns the output, whether it's okay for commercial use"**: many AI products spell out in their terms of service the usage rights for generated content (personal / commercial). **Go look at that product's terms before you use it**, especially when you're taking it for **commercial use.**
- **"Whether you need to label AI involvement" splits into two cases**: one is **required by law or platform** (some regions and platforms require AI-generated content to be marked, check the official docs); the other is at the level of **professional ethics and integrity**, for example a school, a media outlet, or a client explicitly asking you to disclose AI use, or you knowing in your heart that "not saying it would lead people to think I did all of it by hand." For the latter, **transparency is usually the safer choice.**
- **Don't use AI output to pass off as someone else's work or to infringe on their rights**: having it "imitate a living author's style to publish a book for profit" or "generate a logo nearly identical to a certain brand's," no matter what the terms say, these are near the high-voltage line of infringement. This is common sense; you don't need the terms to tell you.

> **Key point:** The right stance for this part isn't "memorize a set of rules" (because there's no unified rule and it's still changing), it's building three **habits**: **(1) before commercial use, look at the terms of the product or platform you're using; (2) disclose when you should, and lean toward transparency when unsure; (3) for important cases involving money or copyright, consult a professional or legal advisor.** Make "check the official docs and legal advice" the default ending for this part.

## 3. If you use open-source code, check the license first

If you use AI to write code, or it brings you a ready-made block of code, there's a gate that's **especially easy to overlook**, worth pulling out on its own: **open source doesn't mean "use it however you like."**

Many people think "open-source code = free = use it any way I want," which is a dangerous misunderstanding. Open-source code almost always comes with a **license**, which sets out **how you may use it, how you may not, and what obligations you have.**

> **The conditions of every open-source license are different.** Some are very permissive (basically use it freely, just keep the copyright notice); some carry "**contagious**" clauses (if you use it, your own project may have to be open-sourced too, released the same way); some put extra restrictions on **commercial use.** **Ignoring the license when you use open-source code can land you (or your company) in infringement or forced-open-source trouble.** And when AI hands you code, it **won't necessarily tell you, accurately or on its own, the source and license of that code.** It might even hand you a block of code with specific license requirements as if it were a "common way of writing it."

> **Key point:** For any **ready-made open-source code** (whether you found it yourself or AI brought it to you), **confirm its license first, then decide whether and how to use it**, especially when you're going to use it **commercially or release it as closed source.** What a given license allows and requires goes by **the license's own text and official explanation**; when unsure, ask someone who knows or a legal advisor. Don't assume it's compliant just because "AI gave it to me." **AI hands you the code, but the responsibility for compliance is yours.** This is actually the same spirit as the first section's "check facts yourself": AI handles generating, the human does the gatekeeping.

## 4. The line running through it all: generating is on AI, gatekeeping is on the human

Pull this chapter's three parts together and you'll see they're three faces of **one principle**:

| This task | What AI can do | What a human must gatekeep |
| --- | --- | --- |
| Writing a draft / proposal | Produce a first draft, adjust style, smooth the phrasing | Whether the **facts** are right, whether the conclusion holds |
| Publishing / attribution | Help you draft, lay it out | **Whether it can be sent, whose it is, whether to disclose** (per terms / law / ethics) |
| Writing code | Provide ready-made snippets, autocomplete | Whether the **license** is compliant, whether the source is clear |

> **Key point:** The whole chapter in one line: **AI is an extremely capable "ghostwriter" and "assistant," but it's not the "responsible party."** For every piece it generates, **the last gate is always you**: you check the facts, you judge whether it can be sent, you bear whether it's compliant. Etch this line in, and you can both let go and enjoy the efficiency AI brings, and avoid the day you eat a quiet loss because "it wrote it, not my fault." **In other people's eyes and before the rules, what has your name on it is yours.**

## Summary

- **Check facts yourself**: numbers, quotes, sources, names, and other "hard facts" go back to the **original material** for checking, not by asking AI again (it might make it up again). **You can outsource style, you can't outsource facts** (Chapters 9 and 15).
- **Copyright / attribution / AI disclosure vary by region and platform and are still evolving**; this book gives no unified conclusion: **look at the terms before commercial use, disclose when you should, ask legal advice for important cases, per the official docs and legal advice.**
- **Check the license before using open-source code**: open source doesn't mean use it however you like, and license conditions vary (some are "contagious," some restrict commercial use); **AI won't necessarily tell you the source, and the responsibility for compliance is yours.**
- The three parts are at bottom **one line**: **generating can be on AI, gatekeeping must be on the human.** What has your name on it, the responsibility is yours.

The next chapter is the close of this part, and of the book's risk section: setting up both personal safety habits and team rules, including a new dangerous term, "**prompt injection**," and how a team should draw its red lines.

---

## Quiz

> Six questions, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** About the "facts" in AI-generated content, which approach is right?
   - A. It wrote it so confidently, you can take it on trust
   - B. Hard facts like numbers, quotes, and sources go back to the original material for you to check yourself; you can outsource style, you can't outsource facts
   - C. Ask AI again "is this true," and if it says yes, you're good
   - D. Only especially important drafts need checking
   > **Answer: B.** This is the hardest rule in the chapter: **you can outsource style to AI, you can't outsource facts.** Because it's after "sounding true," not "being true," and the more confident it is the less that means it's reliable (Chapter 9). C is especially dangerous: ask AI again and it might **make it up again**; you have to go back to the **original material** to check. D isn't safe either (any verifiable hard fact you're about to send out should be checked).

2. **[Basic · Concept]** About "the copyright of AI-generated content, whether it can be used commercially, whether to label AI," what's this book's stance?
   - A. It gives a single globally standard answer
   - B. These rules vary by regional law and platform terms and are still evolving; go by your region's law and the platform's official terms, and consult legal advice for important cases
   - C. AI-generated stuff has no restrictions at all, use it however
   - D. AI-generated stuff can never be used commercially
   > **Answer: B.** This matter **genuinely** has no one-size-fits-all conclusion and changes every year, so this book only teaches the **habits** (look at the terms before commercial use, disclose when you should, ask legal advice for important cases) and leaves the conclusion to **the official docs and legal advice.** A, C, and D all turn a matter that "depends on region, depends on platform, and is still changing" into an absolute, and all would mislead you.

3. **[Advanced · Misconception]** "This code is open source, open source means free, I can use it however I want." What's wrong?
   - A. Nothing; open source means use it freely
   - B. Open source almost always comes with a license, and conditions vary; some are "contagious" and require you to open-source too, some restrict commercial use, and ignoring it can mean infringement or being forced to open-source
   - C. The mistake is that open-source code can't be used at all
   - D. The mistake is that open-source code must be paid for
   > **Answer: B.** "Open source doesn't mean use it however you like." The license sets out how you may use it and what obligations you have. Especially when you're going **commercial or releasing closed-source**, you must check the license first. Even more to watch for: **when AI hands you code it won't necessarily tell you the source and license accurately**, and the responsibility for compliance is still yours. C goes to the other extreme (check the license, meet the conditions, and of course it can be used); D is wrong too (most open source is free, but "free" doesn't mean "no conditions").

4. **[Advanced · Scenario]** An industry report AI wrote for you has a line, "according to a certain authoritative body's 2023 statistics, the market size reached X billion," and it looks very professional. You're about to send it to a client. What should you do first?
   - A. Send it as is; the data looks specific and credible
   - B. Treat this number and source as "doubtful by default," go back to that body's original report to verify it, and if you can't find it, don't use it or rewrite it
   - C. Ask AI again "is this data accurate"
   - D. Bump "X billion" up a bit to make it more striking
   > **Answer: B.** "Specific, professional, official-looking" is exactly what a hallucination looks like when it's made up most convincingly: **the more specific the number and source, the more you go back to the original material to check.** If you can't find it, or that report doesn't exist at all, drop it decisively. C hands the gatekeeping back to an AI that "might make it up again"; D is even worse (fabricating data). A report sent out with your name on it, the facts are your responsibility.

5. **[Basic · Scenario]** You used AI to help write a large part of something to hand to a teacher or send to a client, and they explicitly care about "whether it was done independently / whether AI was used." What's the safest approach?
   - A. Treat it as all your own writing and never mention AI
   - B. Per the other party's requirement / the situation's integrity standard, honestly disclose AI's involvement; lean toward transparency when unsure
   - C. The terms don't require it, so no need to say anything
   - D. Just tweak the AI traces so no one can tell
   > **Answer: B.** Whether you must label it splits into "required by law / platform" and "professional ethics"; when the other party explicitly cares, or not saying it would lead people to **think you did it all by hand**, **transparency is usually the safer choice.** A and D are concealment, even deliberate cover-up, and the risk is to your integrity; C mistakes "the law doesn't require it" for "ethically I needn't say it either," and those aren't the same thing.

6. **[Basic · Hands-on / Observation]** Have AI write a short intro on any topic, asking it to "**include specific data and a quote from a famous person**." Once you have it, pull out the **numbers** and **that quote**, and check them against a search engine or original material: do the data hold up? Did that person really say that line?
   > **What you should notice:** Very likely the number has no basis when you search, and that "quote" can't be traced to a source, or is pinned on someone who never said it. This is hallucination (Chapter 9), and it proves firsthand that "**the more fluent and confident, the less it means it's true.**" This is exactly the chapter's core move: **hand the style to it, check the facts yourself.** Once you've run this little experiment, you'll automatically add a "check first, then use" instinct whenever you see "hard facts" AI wrote.
