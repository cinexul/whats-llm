AI has finished a draft, a proposal or a block of code for you, and you are about to send it out. A few questions usually come up at this point: can I use this as is? Who is responsible if something goes wrong? Should I say AI helped? Can I trust the data and quotes in it?

In short, "how to say it" work such as wording, structure and first drafts is fine to hand to AI; whether the content is right, whether it can go out and whether you need to disclose anything is for you to judge and answer for. Whenever another chapter of this book says "check before it goes out; the responsibility is yours," this is the chapter it means. We cover three areas, checking facts, copyright and attribution, and licenses for open-source code, and then how thorough a review needs to be.

## 1. Check facts against the original sources

A model produces text that reads as plausible. It does not check facts automatically, and where it does not know something it may fill the gap in the same fluent, confident tone (Chapter 9 explains why). So anything that can be verified should be checked against the original source: numbers, dates, names, places, quotes, citations, statutes, paper titles and statistics.

It helps to look at a draft as two layers:

| This layer | What it covers | Can you hand it to AI? |
| --- | --- | --- |
| Expression | Wording, tone, structure, rephrasing, smoothing the text | Yes; this is what it does well (Chapter 16) |
| Facts | Whether numbers, quotes and sources are right, and whether conclusions hold | It can help organize them, but you do the checking |

A practical routine: when the draft is done, pull out every number, quoted line, name and source one by one and check each against the original material. Simply asking the AI "is this true?" is not enough; it may make something up again. The step takes little time and catches most errors that "sound true."

## 2. Copyright, attribution, and AI disclosure: varies by region and platform, still changing

Who owns AI-generated content? Can it be used commercially? Do you have to label it as AI-made? Laws differ between countries and terms differ between platforms, and both are still changing, so there is no single worldwide answer. Two examples show the general direction:

- In China, the Measures for Labeling AI-Generated Synthetic Content took effect on September 1, 2025. Service providers must add explicit labels (such as a visible text notice) and implicit labels (embedded in the file data) to generated content, and users who publish generated content on an online platform must declare it and use the platform's labeling function.
- In the United States, a report published by the Copyright Office in January 2025 concluded that purely AI-generated material is not protected by copyright; that with current technology, writing prompts alone does not make you the author; and that your own expression that you put in and that remains perceptible in the output, along with creative selection, arrangement and modification of generated material, can be protected.

Elsewhere, follow local law and the terms of the platform you publish on. For important cases involving commercial use, copyright or attribution, ask a legal advisor or other professional. A few points are fairly stable:

- Material you put in: the rights to articles or data you paste in for processing generally do not change just because they "went through AI," though the terms of service govern the details.
- Platform terms: many AI products state in their terms who may use generated content and whether it can be used commercially. Look before you use it commercially.
- Whether to label AI involvement: sometimes the law or a platform requires it; sometimes it is a matter of professional norms and honesty, for example when a school, publication or client explicitly asks for disclosure, or when staying silent would make people think you did everything yourself. In the second kind of case, transparency is usually the safer choice.
- Imitation and similarity: asking AI to write in a certain style is common, and whether a style itself is protected depends on where you are. The clearer lines are: do not pass generated content off as someone else's work, and do not copy someone else's protected specific content or registered trademarks.

## 3. If you use open-source code, check the license first

If AI writes code for you or hands you a ready-made snippet, there is one more easy-to-miss checkpoint: open source does not mean "use it however you like."

Open-source code almost always comes with a **license** that says how you may use it and what obligations you take on. Licenses differ a lot. Permissive licenses such as MIT mostly ask you to keep the copyright notice and license text. Copyleft licenses such as the GPL require that, if you distribute a program that uses the code, you provide the corresponding source code under the same license to the people who receive it. And some code has published source but no open-source license at all, and may restrict commercial use. Ignoring the license can drag you or your company into an infringement dispute or a demand to release your code.

When AI hands you code, it will not necessarily tell you accurately where the code came from or what license applies, and it may even present code with specific license requirements as a "common way of writing it." So before using any ready-made code, whether you found it yourself or AI supplied it, confirm the license, especially for commercial or closed-source release; when unsure, ask someone who knows or a legal advisor.

## 4. Match the review to the risk; you are the last check

| Task | What AI can help with | What you need to check |
| --- | --- | --- |
| Writing a draft or proposal | First drafts, style adjustments, smoother wording | Whether the facts are right and the conclusions hold |
| Publishing and attribution | Drafting, layout | Whether it can go out, who owns it, whether to disclose (per terms, law and norms) |
| Writing code | Ready-made snippets, completion | Whether the license is respected, the source is clear, and the change passed acceptance checks (Chapter 25) |

How carefully you review should follow the consequences. A draft only you will read needs one check by you. For anything published, sent to a client, or touching money, health, the law or someone's personal information, have a second person look at it as well; the same goes for code changes. Content that goes out under your name is treated as yours, both by other people and under the rules, and "the AI wrote it" does not shift the responsibility to the AI or the tool's maker.

## Summary

- Check verifiable details such as numbers, quotes, sources and names against the original material; do not rely on asking the AI again (Chapter 9).
- Rules on copyright, attribution and AI disclosure vary by region and platform and are still changing: read the terms before commercial use, disclose when you should, and consult a legal advisor for important cases.
- Check the license before using open-source code. Conditions differ between licenses, AI will not necessarily tell you the source, and compliance is your responsibility.
- Match the review to the consequences: for anything published or touching money, health, the law or personal information, get a second person to look. Generating can be left to AI, but checking stays with you.

The next chapter closes the risk section by setting up personal safety habits and team rules together. Chapters 22 and 36 already introduced prompt injection; the next chapter covers how to guard against it in everyday use and in team rules.

## Sources and version notes

Checked on 2026-10-29. These are starting points for official information, not legal advice; the rules that apply to you are set by the law where you are and by the platform's terms.

- [Chinese government portal: full text of the Measures for Labeling AI-Generated Synthetic Content (in Chinese)](https://www.gov.cn/zhengce/zhengceku/202503/content_7014286.htm): definitions of explicit and implicit labels (Article 3), users' duty to declare and label when publishing (Article 10), in effect from September 1, 2025 (Article 14).
- [U.S. Copyright Office: Copyright and Artificial Intelligence](https://www.copyright.gov/ai/): the Office's series of reports on AI and copyright; Part 2 (January 29, 2025) covers the copyrightability of AI-generated output, including the conclusion that prompts alone do not make a user the author.
- [Open Source Initiative: Licenses](https://opensource.org/licenses): the list and full texts of licenses approved by the Open Source Initiative, including MIT and the GPL.

---

## Quiz

> Six questions, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** About the "facts" in AI-generated content, which approach is right? <!-- quiz: q01 revision: 2 -->
   - A. It sounds confident, so it must have a basis; accept it
   - B. Ask the AI "is this true?" and accept it if it says yes
   - C. Check the figures yourself against the original sources
   - D. Only especially important drafts need their facts checked
   > **Answer: C.** A model aims for plausible text and does not guarantee the content is true; a confident tone says nothing about reliability (Chapter 9). B is especially risky, since asking again may just produce another invention. D falls short too: anything verifiable that you are about to send out should be checked.

2. **[Basic · Concept]** About "the copyright of AI-generated content, whether it can be used commercially, whether to label AI," what's this book's stance? <!-- quiz: q02 revision: 2 -->
   - A. Rules vary by place; follow local law and platform terms
   - B. AI-generated content can never be used commercially anywhere
   - C. AI-generated content has no copyright, so use it freely
   - D. A single global standard exists, so just follow that
   > **Answer: A.** There is no one-size-fits-all conclusion and the rules are still changing, so the book only teaches habits: read the terms before commercial use, disclose when you should, and ask a legal advisor for important cases. B, C and D all turn something that "depends on region and platform and is still changing" into an absolute.

3. **[Advanced · Misconception]** "This code is open source, open source means free, I can use it however I want." What's wrong? <!-- quiz: q03 revision: 2 -->
   - A. Open-source code cannot be used in any project at all
   - B. It comes with a license, and conditions vary
   - C. Nothing; open source means you can use it however you like
   - D. Open-source code always requires a paid license to use
   > **Answer: B.** The license sets out how you may use the code and what obligations you take on; some require you to publish your source code under the same license. AI may not tell you the source and license accurately, and compliance remains your responsibility. A goes to the opposite extreme; D is wrong too, since most open-source code is free, but free does not mean unconditional.

4. **[Advanced · Scenario]** An industry report AI wrote for you has a line, "according to a certain authoritative body's 2023 statistics, the market size reached X billion," and it looks very professional. You're about to send it to a client. What should you do first? <!-- quiz: q04 revision: 2 -->
   - A. Check that body's original report; cut it if not found
   - B. Ask the AI whether the figure is accurate, then decide
   - C. Send it as is; the figure is specific and looks credible
   - D. Change it to a round number so it can't count as an error
   > **Answer: A.** The more specific and professional a figure and source look, the more they need checking against the original; if you cannot find it, or the report does not exist, cut or rewrite the line. B hands the check back to an AI that may invent again, and D merely blurs an unverified number without solving the problem.

5. **[Basic · Scenario]** You used AI to help write a large part of something to hand to a teacher or send to a client, and they explicitly care about "whether it was done independently / whether AI was used." What's the safest approach? <!-- quiz: q05 revision: 2 -->
   - A. Present it all as your own work and never mention AI
   - B. Edit out the signs of AI so that nobody can tell
   - C. Say nothing, since no law requires you to disclose it
   - D. Tell them honestly how AI was involved, as requested
   > **Answer: D.** Whether to label AI use has two layers: legal or platform requirements, and professional norms. When the other party explicitly cares, or silence would make them think you did everything yourself, transparency is usually the safer choice. A and B are concealment, which puts your integrity at risk; C mistakes "the law does not require it" for "norms do not call for it either."

6. **[Basic · Hands-on / Observation]** Have AI write a short intro on any topic, asking it to "include specific data and a quote from a famous person." Once you have it, pull out the numbers and the quote, and check them against a search engine or original material: do the data hold up? Did that person really say that line? <!-- quiz: q06 revision: 2 -->
   > **What you should notice:** Quite often the number has no traceable basis, and the "quote" cannot be found or is attributed to someone who never said it. That is hallucination (Chapter 9), and it shows that fluent and confident is not the same as true. After doing this small experiment once, you will find it natural to check AI-written figures and quotes before using them.
