Every sentence you type into the chat box and send off by hitting enter: where does it actually go? Does it get stored? Will it be used to "train" the next generation of models? Can someone else see it? This is the worry almost everyone has at the back of their mind when they use AI, whether you're just one person using it casually or rolling it out at a company.

This chapter clears it up. First we'll get clear on **whose hands your input actually passes through**, then I'll give you a **four-tier way to sort your data that anyone can actually remember**, and finally we'll draw the one red line in this whole book that should be burned into your muscle memory: **secrets and real personal information never go into any chat box, ever.** This chapter isn't about compliance clauses. It's about how you, one person or a small team, should judge every day whether a given sentence is safe to feed in.

## 1. Where your input goes: get clear on the path first

Most people's first reaction to AI privacy is "will it secretly remember me," but there's a more basic fact that comes earlier. Think back to that conclusion in Chapter 3: **every time you send a sentence, the software sends that whole conversation to the model on a server.** This means something very plain.

> **Whatever you paste into the chat box, you've handed over.** It has left your computer and gone to be processed on someone else's server. This step is the precondition for AI to work at all, and there's no way around it (unless you're using a **local model** like the kind Chapter 21 covers, which is a different story, more on that below). So when we talk about privacy, the first question isn't "will it remember me," it's "**am I willing to send this sentence out at all**."

Once it's sent out, what happens? There are usually two separate questions here. Don't lump them together.

| Question | What it's about | Depends on |
| --- | --- | --- |
| **Will it be retained** | Whether your conversation gets stored, for how long, and who can see it | The product's **settings and terms** |
| **Will it be used for training** | Whether your content gets used to improve their next-generation models | The product's **settings and terms** |

The answers to these two questions are something this book **can't pin down for you**, and the reason matters.

> **Whether something is retained and whether it's used for training depend on which product you use, which plan, and how you've set things in the options. And these policies change. Always check the official docs and terms.** Here are three relatively stable pieces of common sense: (1) **most chat products aimed at individuals offer switches in the settings like "allow my data to improve the model / keep my chat history"**; whether you can turn them off, and what changes when you do, is in the official notes; (2) free versus paid, personal versus enterprise, the policies are often **different**; (3) **enterprise and team plans usually make stronger promises about protecting your data** (for example, not training on your data), but exactly which tier and how strong the promise is still comes down to the official terms.

In other words: rather than trying to memorize whether a given product retains data or not, build the habit. **Before you use something, spend two minutes looking at the "data / privacy" options and set them the way you need.** The entry point differs from product to product and the options change, so all this book can do is remind you that **there is such a switch, so go look for it.** For how to set it, refer to the provider's official documentation.

## 2. The four-tier way to sort data: a ruler you can carry with you

Once you know that input means handing it over, the practical question is: **so what's safe to feed in and what isn't?** You can't flip through the terms for every sentence. Here's a simple ruler. Sort the information in your hands into **four tiers**, and give each tier a default rule for "okay to input or not." Remembering this table beats memorizing any single company's policy.

| Tier | What it is | Examples | Okay to feed an online AI |
| --- | --- | --- | --- |
| **1. Public** | Already public, anyone can see it | Published articles, public product descriptions, common knowledge on a wiki | **Yes**, use it freely |
| **2. Internal** | Not public but not sensitive; a leak would at most be awkward | A plain meeting agenda, a non-confidential work draft | **With care**; usable after stripping out the sensitive bits; in a team setting, follow the rules |
| **3. Sensitive** | A leak would cause real harm | Customer lists, unreleased financial figures, materials containing personal information, contract details | **Don't feed it by default**; if you must, strip it first, and prefer an enterprise plan with protection promises |
| **4. Top secret** | A leak is serious and can't be undone | Passwords, secrets, ID / bank card numbers, medical records, the core of a trade secret | **Never feed it**, not into any chat box |

How do you use this table? It's simple. **Tag the thing you're about to paste in your head first, then check the last column.** After a try or two it becomes second nature.

> **Key point:** The heart of this ruler is **sorting by tier**, not "ban everything" or "whatever, feed it all in." Tier 1 public stuff, use it freely; a lot of AI's value comes from helping you handle public information. Tier 4 top-secret stuff, don't touch a single character. The real thinking happens in the middle, with tiers 2 and 3: **can you remove the deadly parts (names, account numbers, swap specific figures for placeholders) before feeding it in?** If yes, it drops to a usable tier; if no, don't feed it. This is the **stripping** you'll see come up again and again (replacing or wiping out sensitive information, covered in Chapter 40).

## 3. The absolute red line: secrets and real personal info never go in the box

Within tier 4, one category needs to be pulled out and stated in the heaviest tone, because it's the landmine beginners step on most often and the one with the most direct consequences: **secrets (API keys, passwords, tokens) and real, sensitive personal information must never go into any chat box, no matter how trustworthy that AI looks.**

Why are secrets so deadly? Here's a comparison.

> **Pasting an API key into a chat box is like taking a photo of your house key and posting it to a big group chat.** A secret is a pass that lets whoever holds it move your account, spend your money, pull your data. You don't know where this sentence gets stored after it's sent, how long it stays, who sees it, or whether it ends up in some log or training corpus. **The moment it leaves the range you tightly control, you have to assume it's already leaked.** There's only one remedy: go invalidate that key right away and swap in a new one (this is called **rotation**, detailed in Chapter 40). Rather than firefighting after the fact, **just don't paste it into the chat box in the first place.**

By the same logic, **real ID numbers, bank card numbers, home addresses, other people's private information, and medical records** shouldn't be fed in casually either. Need AI to help you handle an email that contains personal information? Swap the name for "John Doe," swap the card number for "XXXX," **use placeholders**, and let it work on the "structure" rather than the real data.

> **Key point:** Burn in two red lines that never have exceptions: **(1) no secret / password / token goes into any chat box; (2) no high-sensitivity personal information, anyone else's or your own, goes into any chat box.** When you need to work with this kind of content, **swap in placeholders first**, every time. These two don't require judgment, don't depend on the product, don't depend on the terms. **Carry them out unconditionally.** Save the judgment for the four-tier ruler above; here on the red line there's no judgment, only execution.

## 4. The misconception most worth breaking: "it can't learn from my data, so I'm safe"

Finally, let's correct an idea that's especially popular and especially dangerous. A lot of people reassure themselves: "I turned off 'use for training' in the settings, so it can't learn from my data, so I'm safe, right?"

**That's thinking about "safe" too narrowly.** "Whether it's used for training" is just **one** facet of the privacy question, far from all of it.

> **"Not used for training" does not equal "safe."** Even if a product clearly promises not to train on your data, your content **can still**: be **retained** for a while (for debugging, abuse prevention, and so on; how long depends on the terms), be at risk of a **leak** in transit and in storage, be **viewed by someone with access** under certain circumstances, or get out because **you pasted it in the wrong place or sent it to the wrong person**. **Training is just one of many destinations.** What really decides safety has never been "did it learn from it," but "**this sentence shouldn't have left my control in the first place**," which is the four-tier ruler and the red line above.

Another angle: even if it doesn't learn a single word, the moment you paste a customer's complete list into an online service, that list **has already left your computer and reached someone else's server.** The risk has happened right then, whether or not it learns from it. So **deciding whether to feed something in comes down to the content's own sensitivity tier, not betting on whether the other side will use it for training.**

> **Key point:** Get the cause and effect the right way around. **It's not "it doesn't train, so I can feed it freely," it's "I only feed in what's okay to feed; what isn't okay, I don't feed, train or not."** "Turning off the training switch" is a good habit (remember to check the settings, and check the official docs), but it's **a nice extra**, not **a pass**. The real moat is your tier ruler and your red line.

## Summary

- **Input means handing it over**: every sentence you send goes to a server to be processed (local models are the exception, Chapter 21); when talking privacy, first ask "am I willing to send this out."
- **Whether it's retained or used for training depends on the product's settings and terms, and it changes, so check the official docs**; most chat products have related switches in the settings, and enterprise plans usually offer stronger protection (specifics still per the official docs), so remember to look before you use.
- **The four-tier way to sort data**: public (usable) / internal (usable after stripping) / sensitive (don't feed by default, strip first) / top secret (never feed). Carry this ruler with you.
- **The absolute red line**: secrets / passwords / tokens and high-sensitivity personal information **never go into any chat box**; use placeholders when needed.
- **The biggest misconception** is "it can't learn from it, so I'm safe." Training is just one of many destinations for your data. **Safety depends on whether the content should have left your control**, not on betting it won't be used for training.

In the next chapter we'll look at "cost" from a different angle: not the cost to your privacy, but the cost in **real money and quota**, why "bigger context = slower, pricier, more prone to drift," and how to save money and improve quality at the same time.

---

## Quiz

> Six questions, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the quote block under each question. Think first, then check.

1. **[Basic · Concept]** About "whether the content you input gets used to train the model," which statement is most accurate?
   - A. It always will; every AI trains on your data
   - B. It never will; no product does this
   - C. It depends on the product, plan, and settings you use, and the policy changes, so check the official docs
   - D. Only paid plans use it for training
   > **Answer: C.** Whether something is retained and whether it's used for training **depend on the product's settings and terms, and they change**. Most chat products offer related switches in the settings, and enterprise plans usually make stronger protection promises, but exactly which tier and how strong the promise is, you **check the official docs**. A and B both turn an "it depends" matter into an absolute; D has the direction wrong too (it's often the opposite, with paid and enterprise plans offering stronger protection).

2. **[Basic · Concept]** By this chapter's four-tier way to sort data, which of these belongs to the tier you **absolutely cannot feed in**?
   - A. An already published article
   - B. A non-confidential meeting agenda
   - C. Your API key (a secret)
   - D. A piece of common knowledge from Wikipedia
   > **Answer: C.** A secret belongs to tier 4, "top secret," and **never goes into any chat box**. A and D are "public," use them freely; B is "internal," usable after stripping. The correct way to use this ruler is to tag the thing you're about to paste in your head first, then check the "okay to input" column.

3. **[Advanced · Misconception]** "I turned off 'use my data to improve the model' in the settings, so now anything I paste is safe." What's wrong with this idea?
   - A. Nothing; turning off training settles it all
   - B. "Not used for training" doesn't equal "safe"; the content can still be retained, leaked, or viewed by someone with access, and training is just one of many destinations
   - C. Turning off training actually makes it more dangerous
   - D. The mistake is turning off the training switch at all
   > **Answer: B.** This is the misconception most worth breaking in this chapter. **Safety depends on whether the content should have left your control, not on betting whether it gets trained on.** Even if it doesn't learn a single word, the moment you paste a customer list in, it has reached someone else's server and the risk has happened. Turning off the training switch is a good habit (a nice extra), but not a pass. D is wrong too: turning the switch off is fine; the mistake is thinking that makes you absolutely safe.

4. **[Advanced · Scenario]** A coworker says in the team chat: "I just pasted our server's secret into the AI to help me check the config, and it said no problem." What should you most advise them to do?
   - A. It's fine, the AI won't leak it
   - B. Invalidate that secret right away and swap in a new one (rotate it), because once it leaves your control you have to assume it's leaked; use placeholders from now on
   - C. Have them paste it again to confirm the AI really understood
   - D. Just shorten the secret a bit
   > **Answer: B.** Once a secret is pasted into a chat box, you have to **assume it's already leaked**: you don't know where it's stored or who sees it. The only remedy is to **rotate it right away** (invalidate the old one, swap in a new one, detailed in Chapter 40). This is exactly the "key posted to a group chat" comparison: the remedy isn't "hope nobody saw it," it's "change the lock fast." A is a dangerous gamble; C pours fuel on the fire; D does nothing (the length of a secret doesn't change the fact that it's leaked).

5. **[Basic · Scenario]** You want AI to help you polish an email to a customer, and the email has the customer's real name and order amount. What's the safest approach?
   - A. Paste it as is and let it edit directly
   - B. Swap the real name for "Mr. Smith" and the amount for a placeholder first, then have it polish the "structure and wording"
   - C. Email like this should never go near AI
   - D. Send it a screenshot of the whole email
   > **Answer: B.** This is the standard way to handle "sensitive" tier content (containing personal information): **strip it first, then feed it in.** Let AI work on the "wording and structure" you actually need it for, not the real data. C is too extreme (after stripping it's perfectly usable, and AI is genuinely valuable for polishing structure); A and D both send the customer's real information straight out (a screenshot is just as much handing the content over), which is exactly what to avoid.

6. **[Basic · Hands-on / Observation]** No need to paste any sensitive information. Open an AI product you use regularly, find its "settings / privacy / data" page, and look: is there a switch like "use my data to improve the model" or "keep chat history"? Is it on or off by default? (**The exact options and locations are per the official docs.**)
   > **What you should notice:** Most chat products aimed at individuals **do** offer switches like this in the settings, but **the entry point, wording, and default state differ from company to company** (some default to allowing it, some default to not). This is exactly what proves the chapter's line that it "depends on the settings and terms, and changes, so check the official docs." Find it yourself once and you'll build the habit of **looking at the data settings before you use something**; this two-minute move is more useful than memorizing any single company's specific policy.
