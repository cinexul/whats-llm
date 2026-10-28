AI has finished a draft, a proposal or a block of code for you, and you are about to send it out. A few questions usually come up at this point: can I use this as is? Who is responsible if something goes wrong? Should I say AI helped? Can I trust the data and quotes it cites?

This chapter answers those questions. In short, "how to say it" work such as wording, structure and first drafts is fine to hand to AI; whether the content is right, whether it can go out and whether you need to disclose anything is for you to judge and answer for. We cover three areas: checking facts, copyright and attribution, and licenses when you use open-source code.

## 1. Check facts against the original sources

As Chapter 9 (hallucination) and Chapter 15 (learning and verifying) explained, a model produces text that reads as plausible; it has no fact database it can check against at will. When it does not know something, it may fill in a reasonable-sounding answer by following the flow of language, in the same fluent, confident tone. Once you are about to send something out, this matters even more.

So anything that can be verified should be checked against the original source: numbers, dates, names, places, quotes, citations, statutes, paper titles and statistics. Do not use them just because they are written confidently.

It helps to look at a draft as two layers:

| This layer | What it covers | Can you hand it to AI? |
| --- | --- | --- |
| Expression | Wording, tone, structure, rephrasing, smoothing the text | Yes; this is what it does well (Chapter 16) |
| Facts | Whether numbers, quotes and sources are right, and whether conclusions hold | It can help organize them, but you do the checking |

> **Key point:** A practical routine: when the draft is done, pull out every number, quoted line, name and source one by one and check each against the original material. Simply asking the AI "is this true?" is not enough; it may make something up again. The step takes little time and catches most errors that "sound true."

## 2. Copyright, attribution, and AI disclosure: varies by region and platform, still changing

Next come questions many people care about: who owns AI-generated content? Can it be used commercially? Do you have to label it as AI-made?

The answers differ between the laws of different countries and regions and between platform terms, and they are still changing, so this book does not give a single conclusion. Two examples: China's Measures for Labeling AI-Generated Synthetic Content took effect on September 1, 2025 and set labeling requirements for AI-generated and synthesized content; a report published by the U.S. Copyright Office in January 2025 specifically examines whether AI-generated material can be protected by copyright. For specifics, follow the law where you are and the official terms of the platform or service you publish on; for important cases involving commercial use, copyright or attribution, ask a legal advisor or other professional.

A few points are fairly stable and useful to keep in mind:

- **Material you put in**: the rights to articles or data you paste in for processing generally do not change just because they "went through AI," though the terms of service still govern the details.
- **Platform terms**: many AI products state in their terms who may use generated content and whether it can be used commercially. Look before you use it commercially.
- **Whether to label AI involvement**: sometimes the law or a platform requires it, so follow the official guidance; sometimes it is a matter of professional norms and honesty, for example when a school, publication or client explicitly asks for disclosure, or when staying silent would make people think you did everything yourself. In the second kind of case, transparency is usually the safer choice.
- **Imitation and similarity**: asking AI to write in a certain style is common. Whether a style itself is protected, and when imitation might become infringement, depends on the rules and standards where you are. The clearer lines are: do not pass generated content off as someone else's work, and do not copy someone else's protected specific content or registered trademarks. When unsure, especially for commercial use, check official sources or consult a legal professional.

> **Key point:** You do not need to memorize rules here; three habits are enough: read the product and platform terms before commercial use; disclose when you should, and lean toward transparency when unsure; and for important cases involving money or copyright, ask a legal advisor or other professional.

## 3. If you use open-source code, check the license first

If AI writes code for you or hands you a ready-made snippet, there is one more easy-to-miss checkpoint: open source does not mean "use it however you like."

Open-source code almost always comes with a **license** (OSS license) that says how you may use it, what you may not do and what obligations you take on. Licenses differ a lot. Some are permissive and mostly ask you to keep the copyright notice; others are copyleft licenses (sometimes called "viral"), under which distributing a program that uses the code may require you to publish your own source code under the same license. And some code has published source but no open-source license at all, and may restrict commercial use. Ignoring the license can drag you or your company into an infringement dispute or a demand to release your code.

When AI hands you code, it will not necessarily tell you, on its own or accurately, where the code came from or what license applies. It may even present code with specific license requirements as a "common way of writing it."

> **Key point:** For any ready-made open-source code, whether you found it yourself or AI supplied it, confirm the license before deciding whether and how to use it, especially for commercial or closed-source release. What a given license allows and requires is set by its own text and official explanation; when unsure, ask someone who knows or a legal advisor.

## 4. What the three have in common: you are the last check

| Task | What AI can help with | What you need to check |
| --- | --- | --- |
| Writing a draft or proposal | First drafts, style adjustments, smoother wording | Whether the facts are right and the conclusions hold |
| Publishing and attribution | Drafting, layout | Whether it can go out, who owns it, whether to disclose (per terms, law and norms) |
| Writing code | Ready-made snippets, completion | Whether the license is respected and the source is clear |

AI can write a lot for you, but content that goes out under your name is treated as yours, both by other people and under the rules. So you check the facts, you judge whether it can be sent, and you answer for compliance.

## Summary

- Check verifiable details such as numbers, quotes, sources and names against the original material; do not rely on asking the AI again (Chapters 9 and 15).
- Rules on copyright, attribution and AI disclosure vary by region and platform and are still changing. Read the terms before commercial use, disclose when you should, consult a legal advisor for important cases, and follow official sources and professional advice.
- Check the license before using open-source code. Conditions differ between licenses, AI will not necessarily tell you the source, and compliance is your responsibility.
- All three follow the same idea: generating can be left to AI, but checking stays with you.

The next chapter closes the risk section by setting up personal safety habits and team rules together. Chapters 22 and 36 already introduced prompt injection; the next chapter covers how to guard against it in everyday use and in team rules.

## Sources and version notes

Checked on 2026-10-27. These are starting points for official information, not legal advice; the rules that apply to you are set by the law where you are and by the platform's terms.

- [Cyberspace Administration of China: release of the Measures for Labeling AI-Generated Synthetic Content (in Chinese)](https://www.cac.gov.cn/2025-03/14/c_1743654685899683.htm): issued jointly by four agencies, in effect from September 1, 2025.
- [U.S. Copyright Office: Copyright and Artificial Intelligence](https://www.copyright.gov/ai/): the Office's series of reports on AI and copyright; Part 2 (January 2025) covers the copyrightability of AI-generated output.
- [Open Source Initiative: Licenses](https://opensource.org/licenses): the list and full texts of licenses approved by the Open Source Initiative.

---

## Quiz

> Six questions, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** About the "facts" in AI-generated content, which approach is right? <!-- quiz: q01 revision: 1 -->
   - A. It sounds confident, so it must have a basis; accept it
   - B. Ask the AI "is this true?" and accept it if it says yes
   - C. Check the figures yourself against the original sources
   - D. Only especially important drafts need their facts checked
   > **Answer: C.** A model aims for plausible text and does not guarantee the content is true; a confident tone says nothing about reliability (Chapter 9). B is especially risky, since asking again may just produce another invention. D falls short too: anything verifiable that you are about to send out should be checked.

2. **[Basic · Concept]** About "the copyright of AI-generated content, whether it can be used commercially, whether to label AI," what's this book's stance? <!-- quiz: q02 revision: 1 -->
   - A. Rules vary by place; follow local law and platform terms
   - B. AI-generated content can never be used commercially anywhere
   - C. AI-generated content has no copyright, so use it freely
   - D. A single global standard exists, so just follow that
   > **Answer: A.** There is no one-size-fits-all conclusion and the rules are still changing, so the book only teaches habits: read the terms before commercial use, disclose when you should, and ask a legal advisor for important cases. B, C and D all turn something that "depends on region and platform and is still changing" into an absolute.

3. **[Advanced · Misconception]** "This code is open source, open source means free, I can use it however I want." What's wrong? <!-- quiz: q03 revision: 1 -->
   - A. Open-source code cannot be used in any project at all
   - B. It comes with a license, and conditions vary
   - C. Nothing; open source means you can use it however you like
   - D. Open-source code always requires a paid license to use
   > **Answer: B.** The license sets out how you may use the code and what obligations you take on; some require you to publish your source code under the same license. AI may not tell you the source and license accurately, and compliance remains your responsibility. A goes to the opposite extreme; D is wrong too, since most open-source code is free, but free does not mean unconditional.

4. **[Advanced · Scenario]** An industry report AI wrote for you has a line, "according to a certain authoritative body's 2023 statistics, the market size reached X billion," and it looks very professional. You're about to send it to a client. What should you do first? <!-- quiz: q04 revision: 1 -->
   - A. Check that body's original report; cut it if not found
   - B. Ask the AI whether the figure is accurate, then decide
   - C. Send it as is; the figure is specific and looks credible
   - D. Change it to a round number so it can't count as an error
   > **Answer: A.** The more specific and professional a figure and source look, the more they need checking against the original; if you cannot find it, or the report does not exist, cut or rewrite the line. B hands the check back to an AI that may invent again, and D merely blurs an unverified number without solving the problem.

5. **[Basic · Scenario]** You used AI to help write a large part of something to hand to a teacher or send to a client, and they explicitly care about "whether it was done independently / whether AI was used." What's the safest approach? <!-- quiz: q05 revision: 1 -->
   - A. Present it all as your own work and never mention AI
   - B. Edit out the signs of AI so that nobody can tell
   - C. Say nothing, since no law requires you to disclose it
   - D. Tell them honestly how AI was involved, as requested
   > **Answer: D.** Whether to label AI use has two layers: legal or platform requirements, and professional norms. When the other party explicitly cares, or silence would make them think you did everything yourself, transparency is usually the safer choice. A and B are concealment, which puts your integrity at risk; C mistakes "the law does not require it" for "norms do not call for it either."

6. **[Basic · Hands-on / Observation]** Have AI write a short intro on any topic, asking it to "include specific data and a quote from a famous person." Once you have it, pull out the numbers and the quote, and check them against a search engine or original material: do the data hold up? Did that person really say that line? <!-- quiz: q06 revision: 1 -->
   > **What you should notice:** Quite often the number has no traceable basis, and the "quote" cannot be found or is attributed to someone who never said it. That is hallucination (Chapter 9), and it shows that fluent and confident is not the same as true. After doing this small experiment once, you will find it natural to check AI-written figures and quotes before using them.
