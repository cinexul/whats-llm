A lot of people who use AI have hit these "odd things": partway through a conversation it forgets what you said at the start; you paste in a long article and it says "too long"; you ask roughly the same amount as before, yet this month's quota burns down fast.

These seemingly unrelated phenomena are really one and the same thing underneath: **AI sees text differently from how we do.** It doesn't read character by character, and it doesn't "remember" the whole conversation in its head. Understand the two words in this chapter, **token** and **context window**, and all those odd things make sense. This is also one of the most "worth the price" chapters in the book: understand it, and a lot of what you do with AI will suddenly "click."

## 1. Token: the "grains" AI cuts text into

When we read "please help me write an email," we see seven words. The model doesn't see those words. It sees them cut into several **tokens**:

```text
Input:  please help me write an email
Tokens: please / help / me / write / an / email      (the split is just illustrative)
```

A token is the **smallest unit** the model uses to process text, but it's neither "one character" nor "one word." It's a set of "text grains" the model worked out itself during training, based on "which fragments often appear together."

- Roughly: **English** common words are often 1 to 2 tokens (`unhappiness` might be cut into `un` / `happiness`); for **Chinese** it's roughly "one character ≈ around 1 token." Punctuation, spaces, and line breaks each take tokens too.
- But remember: **every model uses a different "tokenizer,"** and the same sentence can come out 20 to 30 percent different in token count across models. The above is only a **rough rule of thumb** to give you a "sense of scale," **not a fixed ratio**.

> **Why does the model cut it this way?** Because cutting by "letters" makes the sequence too long and too fragmented for the model to grasp meaning; cutting by "whole words," there are far too many words in the world and they keep coming (new words, misspellings, foreign words). Tokens are a compromise between the two: **not too fragmented, yet able to spell out any text**, including words it has never seen. You don't have to remember exactly how it's cut. It's enough to know "the length in the model's eyes is counted in tokens, and it doesn't exactly match the character count you'd tally."

> **Quick-math sidebar: roughly how many tokens is a passage?**
> Building a **sense of scale** is enough: a short piece of a few hundred words is usually a few hundred to a bit over a thousand tokens. If you want a finer rule of thumb: common English is roughly "4 characters ≈ 1 token," and Chinese is often "1 character ≈ 1 to 2 tokens."
> But these are all **rough rules of thumb, not iron laws**: how many tokens you actually get depends on **which model's tokenizer** is used, and is also affected by punctuation, spaces, digits, and any code mixed in. People used to say "English uses fewer tokens than Chinese," but on newer tokenizers that gap has shrunk a lot, and it can't be taken as a law. **For precision, use the official token-counting tool for the product in question, and refer to the provider's official documentation.**

## 2. The context window: the model's "workbench"

Once you know tokens, the second word is easy.

The **context window** is the **upper limit on the total tokens the model can "lay out and look at" at once this time.**

An analogy: the context window is like a **desk**. To handle something, you have to lay all the relevant material out on the desktop. What you said, its earlier replies, the document you pasted in, the instructions you gave it: **all of it takes up desk space.** Desks come in different sizes, but even a big one has an edge.

```text
Everything spread on the desk this conversation counts toward the context window:
┌─────────────────────────────────────────────┐
│  The instructions you gave ("use a casual tone")  │
│  The material you pasted (that 5,000-word article) │
│  The questions you've asked over time              │
│  The answers it's given over time                  │
└─────────────────────────────────────────────┘   ← the total can't exceed the window limit
```

> **Key point:** What's on the desk **isn't just the characters you typed.** The long text you pasted in and the lengthy replies it wrote are what really take up space. Many people stare at their own short line of a question, puzzled that "I barely said anything," forgetting that the 10-page PDF they just pasted in and its rambling 2,000-word answer already covered the desk.

Different products and different models have desks of different sizes, and they keep getting bigger, so **this book won't give specific numbers** (writing them down would go stale fast; refer to the provider's official documentation). You only need to build the intuition that "the desktop is limited."

## 3. The most counterintuitive point: the model actually "has no memory"

This is where beginners most easily go wrong, so let's pull it out and address it on its own.

You might think: I've chatted with it for a while, so it "remembers" what we talked about. **It actually doesn't.** The model itself saves no conversation.

The truth: every time you send a new sentence, the software, behind the scenes, **resends the entire conversation up to this point to the model, untouched.** What the model receives each time is a fresh request: "here is a conversation transcript, please keep writing from here."

```text
Round 1:       [your question A]                              → answer a
Round 2:    [question A + answer a + your question B]         → answer b
Round 3: [question A + answer a + question B + answer b + question C]  → answer c
            └────────── each round resends everything before ──────────┘
```

So "it remembers what was said earlier" really means **the software lays the earlier text back out on the desk each time** for it to see. Once this transcript gets too long and overflows the desk, **the earliest content gets pushed off the desk**, and then it truly "forgets."

> **Misconception vs. reality:** "I told it my name yesterday, so it should remember today, right?" In reality, start a new conversation and the desk is **completely empty**; it knows nothing about you. Unless a particular product specifically provides a "long-term memory" feature (**such features differ between products and keep changing, so refer to the provider's official documentation**), the default is that **it has no yesterday**. Treat that as the default setting and you'll never again be surprised when "it acts like it doesn't know you."

This also incidentally explains a safety point people often forget: because every sentence gets sent to the model, **whatever you paste in is effectively handed over.** We'll save that for chapter 37.

### Then what are Claude Projects and ChatGPT's "memory"?

You might immediately push back: but I've clearly seen products that can "remember" my preferences, remember a whole project. Things like Claude's Projects, ChatGPT's Memory, the "project context" in coding tools, the personalization in your account, a company's internal knowledge base. Doesn't this contradict "the model has no memory"?

**No contradiction.** The key is to separate two layers:

| | The model itself | The product layer's "memory" |
| --- | --- | --- |
| What it is | The core that only "continues text" | A feature the product adds on top of the model |
| Does it remember | **Doesn't**, starts blank each time | Stores away the "things worth remembering" for you |
| How it does it | (nothing) | **Each conversation, it automatically stuffs this information back into the context for this turn** (back to the "desk" from the last section) |

In other words: "it remembered me" **isn't the model itself growing a memory; it's the product re-laying the relevant information back onto the desk for you each time.** Lift the lid and underneath it's still "a memoryless model + context re-fed each time."

> **Key point:** From now on, when you see features like Claude Projects, ChatGPT Memory, and project-context files, don't feel they clash with this chapter. They're all thoughtful designs at the **product layer**, not memory in the model itself. Exactly how each one remembers, how long it keeps things, whether it's on or off by default, and whether you can delete it: **defer to the provider's official documentation** (most of these features are on by default and can be turned off in settings). Once you understand "no memory underneath, the upper layer re-feeds it," you can predict their behavior: what it "remembers" is always the part the product decided to put back on the desk; whatever wasn't put back, it still doesn't know.

## 4. Why does it "get dumber the longer you chat"?

Even before the limit is hit, **the longer a conversation runs, the more the quality tends to slide.** There are three reasons, all understandable through the "desk":

| Reason | Desk metaphor | What it looks like |
| --- | --- | --- |
| The point gets buried | Too much material on the desk; the truly important sheet is pressed underneath | A key requirement you set early on, it later "can't see" |
| Contradictions pile up | Old discarded approaches and wrong info from trial and error are still spread on the desk | It gets dragged along by its own earlier mistakes, drifting further off |
| Summarizing loses detail | As the desk fills up, old material gets "boiled down to a sticky note," and the details are gone | Specific numbers and agreements stated early get blurred |

> **How you'll actually run into it:** A typical scene: you and it polish a draft back and forth, and the first 10 rounds are great, but the further on it goes the more "stubborn" it gets, starting to ignore your new requirements and rehash phrasings it already rejected. This isn't it "getting tired." It's that the desk is packed with this long string of trial and error, and **the noise has drowned out the signal.**

## 5. Tokens also decide "the cost" and "how much you can fit"

One last practical thing: **the token is the unit of measure.**

- Your **cost** of using AI (whether pay-as-you-go or a plan quota) is, at bottom, counted by **token count**: what goes in and what comes out both count.
- The **limit** on how much material you can paste in at once is also measured in token count (that's the context window).

So you get situations like this: you feel "I just asked a small question," but because you pasted a big chunk of material earlier and then had it generate a long answer, **tokens climb fast and the quota drops fast.** Chapter 38 covers how to "use it sparingly"; for now, remember one sentence:

> **Key point:** **The fuller the desk = the slower, the pricier, and the more error-prone.** These three things are linked. So "keeping the conversation clean" isn't only about saving money; it's also about getting more accurate answers. This is exactly the root of the whole set of "context management" techniques later (chapter 13).

## 6. Common misconceptions, corrected all at once

| Misconception | Reality |
| --- | --- |
| A token is one character | A token is the model's unit of cutting; it can be a word, half a word, or a character, and doesn't map exactly to "character count" |
| It remembers our earlier conversations | The model itself has no cross-conversation memory by default; the software re-lays the history on the desk each time. (A separately provided "memory / project memory" is the product layer feeding information back, not the model itself remembering, see the section above) |
| The chat box is empty, so this time didn't cost much | The long text you pasted and the long answer it gave are what really eat tokens |
| The bigger the context window, the more carefree | A bigger desk can indeed hold more, but stuff it too full and the point still gets buried, plus it's slower and pricier |
| Its "forgetting" is a malfunction | This is normal behavior of a limited context, not a bug |

## Summary

- A **token** is the "grain" the model cuts text into; it's not a character and not a word. Both your cost and your input limit are counted by it.
- The **context window** is the upper limit on the tokens the model can lay on the "desk" at once this time. What you say, what it says, and the material you paste all take up the desk.
- The model has **no cross-conversation memory**: the software resends the history each time, and old content beyond the window gets pushed out, so it "forgets."
- The longer a conversation, the more easily it "gets dumber": the point is buried, contradictions pile up, details get compressed.
- **The fuller the desk = the slower, the pricier, the more error-prone.** Keeping the conversation clean is a basic skill running through the whole book (chapters 13 and 38).

In the next chapter we'll look at this: after the model cuts text into tokens and lays them on the desk, how does it actually "continue" with the next sentence?

---

## Quiz

> Six questions in all, covering concept, misconception, scenario, and hands-on. Answers and explanations are in the blockquote under each question. Think first, then check.

1. **[Basic · Concept]** Which sentence is most accurate?
   - A. A token is one Chinese character or one English letter
   - B. A token is the model's unit of cutting text; it can be a word, half a word, or a character
   - C. A token is one sentence
   - D. A token is the model's unit of memory
   > **Answer: B.** A token is the model's own "text grain," neither a character nor a word. In English a word is often cut into one or two tokens, and in Chinese it's roughly one character to a token or so. A is the most common misconception (taking a token as a character); D confuses a token with "memory / context."

2. **[Basic · Concept]** What does "context window" refer to?
   - A. The size of the chat software's window
   - B. The upper limit on the number of tokens the model can "see" at once at the same time
   - C. The number of days the model remembers you
   - D. The cap on your network speed
   > **Answer: B.** It's the upper limit on how much text the model can lay on the "desk" and process at once this time. What you say, what it says, and the material you paste all count toward it.

3. **[Basic · Misconception]** "I told it my name yesterday, so it should still remember today." Where does this idea go wrong?
   - A. Nothing's wrong; it remembers permanently
   - B. It simply has no cross-conversation memory; each conversation starts from a blank desk
   - C. It remembers, but you have to pay to unlock it
   - D. It only remembers numbers, not names
   > **Answer: B.** By default the model itself has no "yesterday"; start a new conversation and it knows nothing about you. **Note:** some products provide "memory / project memory" outside the model (like Claude Projects, ChatGPT Memory, project-context files); that's the **product layer** stuffing the information back into this conversation for you each time, not the model itself remembering (**refer to each provider's official documentation**). Take "the model itself has no memory" as the default, and you'll neither be surprised when "it forgets" nor confused by a product's memory feature.

4. **[Advanced · Misconception]** "The chat box is empty, so this time didn't take up many tokens." What's wrong here?
   - A. Completely correct
   - B. The long text you pasted in and the long answer it gave are quietly filling up the window
   - C. Tokens only count the characters you type
   - D. An empty chat box deducts double tokens
   > **Answer: B.** Many people only stare at the one line they typed, forgetting that the **10-page PDF they pasted in and the 2,000 words it replied** are what really eat tokens.

5. **[Basic · Scenario]** You've chatted with the AI for a long time, and it starts answering off-topic and forgetting settings you stated earlier. What should you do first?
   - A. Restart the computer
   - B. Start a new conversation and restate the "information still needed"
   - C. Ask the same sentence five more times
   - D. Uninstall and reinstall
   > **Answer: B.** This is the classic symptom of a context window packed full, with early content pushed out. A new conversation = a clean desk, which is faster and more accurate than digging through a messy one (see chapter 13 for details).

6. **[Basic · Hands-on]** Find a Chinese passage of about 1,000 characters, first estimate "roughly how many tokens," then paste it into any tool with a token counter to see the actual number (**refer to the provider's official documentation**). Observe: between Chinese and English, which "costs more tokens"?
   > **What you should notice:** A passage of a few hundred words is usually a few hundred to a bit over a thousand tokens; the exact number depends on which model's tokenizer is used, and is also affected by punctuation, digits, and any code mixed in. **This is a rough rule of thumb, not a fixed ratio** ("English is definitely cheaper" no longer quite holds on newer tokenizers). For precision, use the official counting tool. Compare it yourself once and the intuition for "length, tokens, cost" takes shape.
