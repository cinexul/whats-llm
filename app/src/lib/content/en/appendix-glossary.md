This glossary collects **162 terms** related to large models and AI tools, grouped by topic. Each entry gives the term in three languages (**Chinese ・ Japanese ・ English**) along with a plain-language definition; many entries also point out a common misconception. Whenever you hit a word you don't understand in the main text, come back here to look it up.

> **Key point:** For the features, prices, and limits of any specific product, always go by each vendor's **official docs**. This table gives you stable explanations of the concepts, not the volatile product details that change all the time.

## Basic concepts

**Artificial Intelligence (AI)**（人工智能 ・ 人工知能）  
Getting machines to do things that "used to take human intelligence." It's a very broad umbrella term. Playing chess, recognizing images, and filtering spam all count as AI.  
*Common misconception:* People often treat it as an "all-powerful computer brain"; in reality it's the name for a whole class of technologies, and large models are just one branch of it.  

**Machine Learning (ML)**（机器学习 ・ 機械学習）  
An approach to AI where, instead of a human writing out rules one by one, the program finds patterns in large amounts of data on its own. It's the foundation of deep learning and large models.  
*Common misconception:* People often think the machine "figured it out by itself"; in reality it just derives patterns statistically from data, without understanding what they mean.  

**Deep Learning (DL)**（深度学习 ・ 深層学習）  
A kind of machine learning that uses many layers of "computational networks" (neural networks) to learn. Most of today's large models, image generation, and speech synthesis are based on it.  

**Neural Network**（神经网络 ・ ニューラルネットワーク）  
A computing structure inspired by the neurons in the brain, built from many simple units connected layer by layer. Deep learning is just neural networks with many layers.  
*Common misconception:* People often think it "thinks like a human brain"; in reality that's only a metaphor. Inside, it's all numerical computation and has nothing to do with real neurons.  

**Large Language Model (LLM)**（大语言模型 ・ 大規模言語モデル）  
An AI model that learns "how words follow one another" from huge amounts of text. It's the core inside products like Claude and ChatGPT.  
*Common misconception:* People often treat it as an "all-knowing computer brain"; in reality it's just a class of model good at handling language, and it will confidently get things wrong with a perfectly straight face.  

**Model**（模型 ・ モデル）  
The big pile of numbers (parameters) you get after training, plus the method for running them. It's not the ordinary kind of program where you "write out rules one by one."  
*Common misconception:* People often think a model is a big database or a stack of if-statements; in reality it's parameters learned through training, and the answers are computed on the fly, not looked up.  

**Generative AI**（生成式AI ・ 生成AI）  
AI that can "produce" new content (text, images, code, audio, and so on), rather than only judging or classifying. Large models are the most common kind.  

**Natural Language Processing (NLP)**（自然语言处理 ・ 自然言語処理）  
The field of getting computers to handle human language (understanding, translating, summarizing, answering questions, and so on). Large models are the most powerful tool to come out of this field in recent years.  

**Artificial General Intelligence (AGI)**（人工通用智能 ・ 汎用人工知能）  
A hypothetical goal: an AI that can handle all kinds of tasks the way a human can. Today's large models are not AGI yet, and the term shows up more in discussions and visions of the future.  
*Common misconception:* People often treat today's chat AI as AGI; in reality these are just specialized models good at language, still a long way from "able to do anything."  

**Chatbot**（聊天机器人 ・ チャットボット）  
A program that can communicate back and forth with people through conversation. The powerful chatbots today mostly have a large model at their core, but the word "chatbot" is older and broader than "large model."  

**Algorithm**（算法 ・ アルゴリズム）  
A fixed set of steps or rules for solving a particular problem. A large model isn't an algorithm written out line by line; it's learned from data, and that's exactly what sets it apart from traditional programs.  
*Common misconception:* People often treat a large model as "a set of written-out rules"; in reality its behavior comes from parameters learned during training, and no one can write out line by line "why it answered this way."  

**Computer Vision**（计算机视觉 ・ コンピュータビジョン）  
The AI field of getting computers to "understand" images and video (such as recognizing faces or reading road signs). It and language-handling large models are different branches under AI, useful as a reminder that "AI isn't only large models."  

## Models and training

**Parameter**（参数 ・ パラメータ）  
The big pile of "adjustable numbers" inside a model; training means tuning them over and over. The patterns of language get "pressed" into these numbers. When people say "billions of parameters," that's the count they mean.  
*Common misconception:* People often think more parameters always means smarter; in reality parameter count is just one side of scale, and data quality and training method matter just as much.  

**Weight**（权重 ・ 重み）  
The main kind of parameter, showing "how important a given connection is" in the neural network. Training is basically the process of adjusting these weights over and over.  

**Training**（训练 ・ 学習（トレーニング））  
The process of showing a model large amounts of data and continually adjusting its internal parameters, so that its output gets closer and closer to what's wanted. Only after training is done do you get a usable model.  

**Pre-training**（预训练 ・ 事前学習）  
The first stage of building a large model: have it read huge amounts of text and practice "guessing the next word" over and over, so the patterns of language get learned into the parameters. This step takes the most time and money.  

**Fine-tuning**（微调 ・ ファインチューニング）  
Giving an already pre-trained model some extra "tutoring" with a smaller dataset, so it gets better at a certain kind of task or better at answering the way you want. It's one of the common methods for alignment.  
*Common misconception:* People often think fine-tuning means "teaching" the model new knowledge and storing it as fact; in reality it's more about adjusting "behavior and style," and for feeding it private material, RAG is a better fit.  

**Instruction Tuning**（指令微调 ・ 指示チューニング）  
A specialized kind of fine-tuning that uses many "instruction and good-answer" examples to teach the model to understand and carry out people's instructions, turning it from a "text-continuation machine" into an "assistant that follows directions."  

**Alignment**（对齐 ・ アライメント）  
Using various methods to tune a model's behavior toward "helpful, honest, and harmless," so its answers match people's intentions and values. An unaligned model tends to go off the rails.  
*Common misconception:* People often think a model is absolutely safe and reliable once aligned; in reality alignment can only lower the risk, and it also brings side effects like "being overly cautious and refusing to answer at the drop of a hat."  

**Reinforcement Learning from Human Feedback (RLHF)**（人类反馈强化学习 ・ 人間のフィードバックによる強化学習（RLHF））  
A mainstream approach to alignment: have people rate and rank a model's several answers, then use those preferences to train the model, making it more inclined to give answers people like.  

**Training Data**（训练数据 ・ 学習データ）  
The text, code, and other material used to train a model. The data's quality, scope, and biases directly affect the model's eventual abilities and flaws.  
*Common misconception:* People often think the model stored the training data verbatim; in reality it learns the patterns within it, and the original text isn't kept whole inside the model.  

**Knowledge Cutoff**（知识截止 ・ 知識カットオフ）  
The "deadline" of a model's training data. The model itself doesn't know about anything that happened, or any new version that came out, only after that point in time.  
*Common misconception:* People often think AI always knows the latest news; in reality, unless it goes online or is fed material, it knows nothing about events after the cutoff and may make things up.  

**Foundation Model / Base Model**（基础模型 ・ 基盤モデル）  
A "base layer" large model trained on huge amounts of general data. It has very broad abilities on its own and can be turned into all sorts of products through further fine-tuning and alignment.  
*Common misconception:* People often confuse a foundation model with a finished chat product; in reality a foundation model hasn't been "trained in conversational manners" yet, and using it directly often means it won't follow instructions.  

**Distillation**（蒸馏 ・ 蒸留）  
Using a big, strong model as a "teacher" to train a smaller "student" model, so the small model approaches the big one's performance at lower cost.  

**Model Scale / Model Size**（模型规模 ・ モデル規模）  
A measure of how "big" a model is, mainly its parameter count and the amount of training data. Bigger scale is usually stronger, but also slower and more expensive.  

**Model Version / Generation**（模型版本/代际 ・ モデルのバージョン・世代）  
A model in the same family keeps getting new versions (such as a generational upgrade), and its abilities and pricing change along with them.  

**Context Length**（上下文长度（训练时） ・ 学習時の文脈長）  
The ceiling set during a model's design and training for "how many tokens it can handle at once." In use, this corresponds to the size of the context window.  

**Scaling Laws**（规模法则 ・ スケーリング則）  
A rough rule of thumb: the bigger the model, data, and compute, the better the results tend to be. This explains why everyone races to make models bigger, but it's not an infinite free lunch.  
*Common misconception:* People often think "just go bigger and it must get better"; in reality the returns diminish, and data quality and training method also set the ceiling.  

## How it works

**Token**（token ・ トークン）  
The smallest unit of text in a large model's eyes. It might be a word, half a word, or a single character. The model reads and computes by tokens, not by "characters."  
*Common misconception:* People often think one token is one character or one word; in reality it's a fragment the model carves out on its own, and the splitting differs across Chinese and English and across long and short words.  

**Tokenization**（分词 ・ トークン化（分かち書き））  
The process of splitting a piece of text into individual tokens. Different models split differently, which is why the same sentence has a different token count in different models.  

**Context Window**（上下文窗口 ・ コンテキストウィンドウ）  
The ceiling on the number of tokens a model can "see at once." The whole conversation has to fit onto this "temporary workbench." Go over it, and the earlier content gets pushed out.  
*Common misconception:* People often think it's the AI's long-term memory; in reality it's just the temporary capacity for this conversation. Close it or fill it up and it forgets, and the fuller it is, the slower and more expensive it gets.  

**Next-Token Prediction**（下一个词预测 ・ 次トークン予測）  
This is the one core thing a large model does: based on what came before, guess "the next most likely token," and keep going one by one to form a whole passage.  
*Common misconception:* People often think the AI thinks up the answer first and then says it; in reality it pops out one token at a time, guessing as it writes, with no pre-formed "answer."  

**Probability Distribution**（概率分布 ・ 確率分布）  
When picking the next token, the model computes a probability for each candidate word (for example, "Tokyo 92%, Edo 0.8%"), then chooses one from among them.  

**Sampling**（采样 ・ サンプリング）  
The process of picking the word to actually output from that "candidate-word probability table." The picking can lean steady (always pick the high-probability one) or lean random, controlled by parameters like temperature.  

**Temperature**（温度 ・ 温度（temperature））  
A knob that controls "how random the output is." Turn it down for steadier, nearly identical results every time; turn it up for more divergent, more creative output that also goes off the rails more easily.  
*Common misconception:* People often think higher temperature means smarter; in reality it only changes "how willing it is to pick uncommon words," and it has nothing to do with right or wrong. Set too high, it tends to go haywire.  

**Top-p (Nucleus) Sampling**（Top-p采样 ・ Top-p（核サンプリング））  
Another knob for controlling randomness: it picks only from "the small set of candidate words whose probabilities add up high enough," filtering out the very rare options. Often used together with temperature.  

**Reasoning Effort / Extended Thinking**（推理强度/扩展思考 ・ 拡張思考（推論の深さ））  
Letting the model "think a few more steps" internally before giving an answer (generating a thinking draft), spending more compute for more reliable results. Good for hard problems, unnecessary for simple ones.  
*Common misconception:* People often think "the longer it thinks, the more correct the answer must be"; in reality it can improve complex reasoning, but it's also slower and more expensive and can still be wrong, so for simple tasks it's actually a waste.  

**Vector**（向量 ・ ベクトル）  
A "coordinate" made of a string of numbers. Once words and sentences are turned into vectors, the machine can use math to compare how far apart they are, which is to say how close in meaning.  

**Embedding**（嵌入 ・ 埋め込み（エンベディング））  
The practice of turning a piece of text into a string of numbers (a vector) that captures its "meaning." Text that's close in meaning ends up with vectors close together, and this is the basis of search and RAG.  
*Common misconception:* People often think an embedding stores the original text; in reality it stores "the coordinates of the meaning." You can't read the original sentence from it, but you can compute who is close to whom in meaning.  

**Vector Space**（向量空间 ・ ベクトル空間）  
The "multi-dimensional space" formed by putting all the word and sentence vectors together. Things close in meaning sit close together, and the famous "king - man + woman ≈ queen" happens right here.  

**Similarity**（相似度 ・ 類似度）  
A number measuring "how close in meaning" two pieces of text are, computed by comparing their vectors. Search and RAG rely on it to find the "most relevant" material.  

**Attention Mechanism**（注意力机制 ・ アテンション機構）  
The ability, as the model reads a sentence, to decide "how much each word should attend to which other words." Put plainly, it knows how to mark the key points, which lets it catch the important connections in a long sentence.  
*Common misconception:* People often think attention means the model "really understood"; in reality it computes the statistical correlation between words, a mathematical weighting, not understanding.  

**Self-Attention**（自注意力 ・ 自己注意（セルフアテンション））  
The core form of the attention mechanism: each word in a sentence looks at the other words in the same sentence, weaving the context relationships in. It's the key component of the Transformer.  

**Transformer**（Transformer ・ トランスフォーマー）  
The underlying architecture of almost all mainstream large models today, with the attention mechanism at its core. Think of it as the "engine type" of large models; it's enough just to know it exists.  
*Common misconception:* People often treat the Transformer as a specific product; in reality it's a technical architecture, and Claude, GPT, Gemini, and others are all built on top of it.  

**Encoder / Decoder**（编码器/解码器 ・ エンコーダ・デコーダ）  
The two kinds of components in a Transformer: the encoder handles "understanding the input," and the decoder handles "generating the output." Chat-style large models mainly use the decoder side.  

**Knowledge (parametric)**（知识 ・ 知識）  
The "common sense and facts" welded into the parameters during training, which the model reels off without relying on the material you give this time. But events after its cutoff aren't in there.  
*Common misconception:* People often treat "the model knows" as "the model stored the original text and can look it up"; in reality it's a statistical impression learned during training, and it may garble or misremember.  

**Memory (in-context)**（记忆 ・ 記憶（文脈上の記憶））  
A temporary memory that lives only within "this conversation," held up entirely by the context window. Close the conversation or get pushed out of the window, and it forgets completely.  
*Common misconception:* People often think AI remembers you long-term the way a person does; in reality, by default it has no memory across conversations, and next time you meet it's in an "amnesiac" state. Any "memory" you see is added at the product layer, not in the model itself.  

**Hallucination**（幻觉 ・ ハルシネーション）  
The model stating content that doesn't exist or is wrong, in a convincing, confident way. That's because what it's after is "sounding true," not "being true."  
*Common misconception:* People often think the more fluent and confident it sounds, the more reliable it is; in reality the smoother it is, the more wary you should be, and important facts must be checked yourself.  

**Emergent Abilities**（涌现能力 ・ 創発的能力）  
Once a model's scale gets large enough, it "suddenly" shows new abilities that smaller models lack (such as multi-step reasoning). It's like water only boiling once it reaches a certain temperature.  
*Common misconception:* People often describe emergence as the AI "waking up" or gaining consciousness; in reality it's just an ability jump that comes with scale, and inside it's still numerical computation.  

**Multimodal**（多模态 ・ マルチモーダル）  
A model that handles not only text but also images, audio, and even video, that is, several kinds of "modality." For example, describing an image or reading a screenshot.  

**Determinism vs Randomness**（确定性vs随机性 ・ 決定論的・確率的な出力）  
Because generation involves randomness, asking the same question several times may give slightly different answers each time. "It was right last time" doesn't mean "it's right this time."  
*Common misconception:* People often think the same input always gives the same output; in reality there's randomness by default and results will vary, so any important output should be verified each time.  

## Using it

**Prompt**（提示词 ・ プロンプト）  
The piece of text or instruction you send to the AI. The clearer the background you give, the better its answer usually is. "The quality of the input decides the quality of the output."  
*Common misconception:* People often think it can guess the intent you didn't state; in reality it can't read your mind, and the background, requirements, and the format you want all have to be spelled out.  

**Prompt Engineering**（提示工程 ・ プロンプトエンジニアリング）  
A set of methods for figuring out "how to say things clearly and lay out your requirements plainly" so the AI gives you the result you want. Nothing mysterious; in essence it's just being good at stating requirements.  

**System Prompt**（系统提示 ・ システムプロンプト）  
An instruction at the very front of the conversation that sets the AI's "identity and overall rules," such as "you are a rigorous legal advisor." It affects the style and boundaries of the whole conversation.  

**Zero-shot**（零样本 ・ ゼロショット）  
Having the AI do a task directly without giving any examples. Usually enough for simple tasks; for complex ones or ones with special formats, giving a few examples works better.  

**Few-shot**（少样本/示例 ・ フューショット（少数例））  
Giving a few "input and desired output" examples in the prompt so the AI can follow the pattern. Especially useful when you want a fixed format or a particular style.  

**Chain of Thought (CoT)**（思维链 ・ 思考の連鎖（Chain of Thought））  
Having the AI "write out its reasoning step by step" before giving a conclusion. It's often more accurate on complex tasks like math and logic problems.  

**Context**（上下文 ・ 文脈（コンテキスト））  
All the information you give the AI this time (the question, the background, the material you pasted in, the earlier conversation). Right now it can only answer based on these.  

**Session / Conversation**（会话/对话 ・ セッション（会話））  
The whole back-and-forth from when you open the chat to when you end it. Within the same conversation the AI remembers what came before; start a new conversation and it begins from scratch.  

**Multi-turn Conversation**（多轮对话 ・ マルチターン会話）  
Going back and forth over many turns around one topic. The longer you chat, the more space the context takes up, and the easier it is to drift off topic or "get dumber the longer it goes." Start a new conversation when needed.  
*Common misconception:* People often think the longer they chat, the better the AI understands them; in reality, once the topic gets mixed and the context fills up, mistakes get more likely, and one topic per conversation is steadier.  

**Summarization**（摘要/总结 ・ 要約）  
Having the AI compress a long text down to its key points. The key is to "summarize based on the material I gave, without adding your own," or fabrication slips in easily.  

**Structured Output**（结构化输出 ・ 構造化出力）  
Asking the AI to output in a fixed format, such as a table, a list, or JSON. Spell out the fields and format clearly and the result is tidier and more usable.  

**Role / Persona Setting**（角色设定 ・ ロール設定（役割付与））  
Assigning the AI an identity or perspective (such as "senior editor" or "interviewer") so its tone and emphasis fit what you need.  

**Iterative Refinement**（迭代修正 ・ 反復的な修正）  
Not expecting it right the first time, but rather "get a draft, point out what's wrong, have it revise," closing in on the result you want round by round. This is the normal way to use AI well.  

**Prompt Template**（提示词模板 ・ プロンプトテンプレート）  
Fixing a good, commonly used instruction into a "fill-in-the-blank template" so you can reuse it next time with different content, instead of writing it from scratch each time.  

**Verification / Fact-checking**（验证/复核 ・ 検証・裏取り）  
Checking the facts, numbers, and citations the AI gives you yourself. Because it hallucinates, important content must never be used as-is.  
*Common misconception:* People often think checking is too much trouble and can be skipped; in reality it's the most important step in using AI, and skipping it means making its mistakes your own.  

**Web Search / Tool-augmented**（联网搜索/工具增强 ・ ウェブ検索・ツール連携）  
Having the AI go online for the latest information or call tools while answering, to make up for the "knowledge cutoff" and for what it can't remember. It can find the latest content, but what it finds still needs checking.  
*Common misconception:* People often think turning on web access guarantees a correct answer; in reality it can still pick the wrong source or misread it, and in the end you still have to check the citations.  

**Regenerate / Rephrase**（重新生成/换个说法 ・ 再生成・言い換え）  
For an answer you're not happy with, having it answer again or asking in a different way. Because the output involves randomness and is sensitive to wording, rephrasing often gets a better result.  

**First Draft / Starting Point**（草稿/初稿思维 ・ たたき台）  
Treating the AI's output as a "first draft," not a finished product: it helps you get started quickly, and then you judge, revise, and finalize. This is the safest mindset for collaboration.  
*Common misconception:* People often want the AI to nail it in one shot and deliver directly; in reality treating it as a "drafting intern" with you finishing up is better for both quality and safety.  

**Prompt Leaking**（提示词泄露 ・ プロンプト漏洩）  
Someone using clever wording to coax the AI into "spitting out" the system prompt or hidden instructions you set. So don't put real secrets into the prompt.  

## The tool ecosystem

**Model vs Product**（模型vs产品 ・ モデルと製品の違い）  
The model is the underlying core (such as the GPT or Claude series); the product is the packaged thing people use (such as the ChatGPT website or the Claude app). One product may switch between different models behind the scenes.  
*Common misconception:* People often treat the product name and the model name as the same thing; in reality ChatGPT is the product and GPT is the model, the relationship of a "car" to an "engine."  

**Application Programming Interface (API)**（API ・ API）  
The entry point that lets your own program "call" the model directly, skipping the chat website. "Hooking AI up to a program" usually means calling the API.  
*Common misconception:* People often think the API is another, more powerful AI; in reality it's just another way to reach the same model (program to program), billed by usage.  

**API Key**（API密钥 ・ APIキー）  
A secret string used to prove "it's you" when calling the API, the equivalent of your account's key. If it leaks, others can spend your money.  
*Common misconception:* People often think it's fine to paste the key into a chat box or into code; in reality, once it leaks it can be used to run up charges, so it must never be made public, and a leak should be revoked and reset immediately.  

**Token-based Pricing**（Token计费 ・ トークン課金）  
Using the API is usually billed by token count, with both input and output costing money. The longer you chat and the more material you feed it, the more you spend. (This is a rough way to think about cost, not a fixed law.)  
*Common misconception:* People often think only the words they type cost money; in reality the AI's reply, and the history re-attached each turn, all count as tokens, so long conversations burn through a lot.  

**Software Development Kit (SDK)**（SDK ・ SDK）  
A ready-made code library a vendor provides to help developers call the API more easily, without piecing together requests from scratch.  

**Inference**（推理（运行模型） ・ 推論（インファレンス））  
"Running an already-trained model to produce results," that is, the computation that happens each time you ask a question and it generates an answer. It's a different thing from "training."  
*Common misconception:* People often read "inference" here as "logical reasoning"; in reality it refers to "running the model to get results," an engineering term.  

**Agent**（智能体 ・ エージェント）  
An AI that doesn't just answer questions but can "take action": give it a goal and it will call tools on its own, pushing forward through an "investigate, execute, check" loop.  
*Common misconception:* People often think an Agent is just a smarter chatbot; in reality its key is "actually being able to get things done," and both its power and its risk come from that.  

**Tool Use / Function Calling**（工具调用 ・ ツール呼び出し（ファンクションコーリング））  
The mechanism that lets the model "call external tools" while answering (querying a database, doing arithmetic, sending requests, and so on). It's the technical basis for an Agent being able to act.  
*Common misconception:* People often think the model can go online or do arithmetic by itself; in reality it has to do so through the tools it's been granted, and with no tools connected it can only talk.  

**Claude**（Claude ・ Claude）  
The name of Anthropic's AI product and model family (including Opus, Sonnet, Haiku, and others). It's one representative of large models, not "all of AI."  

**Claude Code**（Claude Code ・ Claude Code）  
A coding agent that runs in the terminal (the command line), able to read project files, change code, and run commands. Think of it as "Claude with hands and feet attached."  

**ChatGPT**（ChatGPT ・ ChatGPT）  
OpenAI's chat product, with the GPT series of models at its core. For many people it's the first large-model product they ever touched.  

**Codex**（Codex ・ Codex）  
OpenAI's product in the programming and coding-agent direction. Like Claude Code, it belongs to the class of tools that "can actually write code hands-on."  

**Gemini**（Gemini ・ Gemini）  
The name of Google's AI product and model family. It's also one of the mainstream large models, often compared alongside Claude and ChatGPT.  

**Copilot**（Copilot ・ Copilot）  
A general term for AI assistants embedded in editors and office software (such as code completion or a document assistant). Here we only cover the concept of it as a "co-pilot."  

**Retrieval-Augmented Generation (RAG)**（检索增强生成 ・ 検索拡張生成（RAG））  
First "retrieving" relevant content from your own library of material, then feeding it to the model so it answers "based on this material." Used to work around the knowledge cutoff, reduce hallucination, and make use of private material.  
*Common misconception:* People often think RAG means "training" the material into the model; in reality it's temporarily retrieved and fed into the context, without changing the model itself, and updating the material needs no retraining.  

**Vector Database**（向量数据库 ・ ベクトルデータベース）  
A database specialized in storing "text vectors (embeddings)" and quickly finding the "most similar content." It's the common component handling the "retrieval" step in RAG.  

**Knowledge Base**（知识库 ・ ナレッジベース）  
A body of material you've organized specifically for the AI to retrieve (documents, web pages, manuals, and so on). RAG is what pulls material from here.  

**Local Model**（本地模型 ・ ローカルモデル）  
A large model that runs on your own computer (or your own server) without going through the cloud. The upside is privacy and offline use; the cost is needing hardware, and it's usually not as strong as a cloud model.  
*Common misconception:* People often think a local model is always weaker than the cloud, or always safer; in reality it is more private, but its ability and speed are limited by your hardware, and how strong it is depends on the specific model.  

**Open-source / Open-weight Model**（开源模型/开放权重 ・ オープンソースモデル・オープンウェイト）  
A model whose weights are made public, letting everyone download and run it themselves. It makes local deployment possible and is often used for offline or privacy-sensitive scenarios.  
*Common misconception:* People often equate "open weights" with "fully open source and free for commercial use"; in reality the license terms vary a lot between models, so check the license before using one.  

**Ollama**（Ollama ・ Ollama）  
A tool that makes it easy to download and run open-source large models on your own computer. The commands are simple, and beginners often use it to get started with local models.  

**LM Studio**（LM Studio ・ LM Studio）  
A desktop app with a graphical interface that makes it easy to download and run open-source large models locally, good for people who'd rather not type commands and want to try local models.  

**Quantization**（量化 ・ 量子化）  
Storing the numbers in a model at a "coarser" precision, making the model smaller and able to run on an ordinary computer, at the cost of a slight loss in quality. It's a common trick for running large models locally.  
*Common misconception:* People often think quantization makes a model "much dumber"; in reality moderate quantization usually lowers quality only slightly while greatly reducing the hardware requirements.  

**Skills**（Skills/技能 ・ スキル）  
Packaging "the steps for doing something and the related files" into a reusable "skill" that loads only when needed, so it doesn't take up context the rest of the time. Think of it as a plug-and-play plugin pack for the AI.  

**Model Context Protocol (MCP)**（模型上下文协议 ・ モデルコンテキストプロトコル（MCP））  
An open standard that lets AI applications connect to external tools and data sources in a uniform way, often likened to "the USB port of the AI world": plug in and various peripherals just work.  
*Common misconception:* People often think MCP is a particular product or server; in reality it's a set of "interface specifications," and the actual features are provided by each MCP server.  

**MCP Server**（MCP服务器 ・ MCPサーバー）  
A program that provides some tool or data interface following the MCP standard (for example, connecting to your calendar or database). The AI, as a client, connects to it to draw on those abilities.  

**Plugin**（插件 ・ プラグイン）  
A small module that adds extra abilities to an AI product, letting it connect to some external service or gain some new feature. It's the everyday term for "extending abilities."  

**Multimodal Input**（多模态输入 ・ マルチモーダル入力）  
Beyond typing, being able to give the AI images, files, audio, and so on to handle together, such as sending a screenshot for it to explain.  

**Cloud Model / Hosted Model**（云端模型 ・ クラウドモデル）  
A large model that runs on the vendor's servers and is accessed over the network (the vast majority of chat products work this way). The upside is convenience and strength; the cost is needing to be online, with your data leaving your own machine.  
*Common misconception:* People often think "cloud equals unsafe, local equals foolproof"; in reality each involves trade-offs, and what matters is how sensitive your data is and what your needs are.  

**Context Engineering**（上下文工程 ・ コンテキストエンジニアリング）  
The craft of carefully arranging "which information to put into the context, and in what order." Giving the right material matters more than giving a lot of it, and it's the core idea behind using RAG, long tasks, and project context well.  

**Embedding Model**（嵌入模型 ・ 埋め込みモデル）  
A model specialized in turning text into vectors (embeddings), often a different model from the large model that generates the conversation. RAG uses it to give material its "coordinates."  

**Prompt Caching**（提示词缓存 ・ プロンプトキャッシュ）  
"Caching" the same stretch of context that gets used repeatedly, so reusing it next time is faster and cheaper. Very useful for cases that repeatedly carry the same long prefix.  

**Application / Wrapper Layer**（应用/封装层 ・ アプリ・ラッパー層）  
The concrete applications built on top of a model or API (websites, plugins, industry tools). Countless applications can grow on top of the same underlying model, and this layer decides how you actually use it.  
*Common misconception:* People often dismiss all "wrapper apps" outright; in reality a good wrapper does a lot of work on the prompts, the workflow, and the data, and the experience can differ a great deal.  

## AI coding and agents

**Coding Agent**（编程智能体 ・ コーディングエージェント）  
An Agent made specifically for writing code, changing files, and running commands (such as Claude Code or Codex). Treat it as "a very capable colleague who just started"; the final responsibility is still yours.  
*Common misconception:* People often think it can deliver fully automatically with no oversight; in reality it makes mistakes and misunderstands things, so a human must read the diff, run the tests, and sign off.  

**Terminal / Command Line (CLI)**（终端/命令行 ・ ターミナル（コマンドライン））  
A black-background window you operate by "typing commands." Many coding agents run here. It looks hardcore, but just follow the steps as given.  
*Common misconception:* People often think the command line is "for hackers only and easily breaks the computer"; in reality it's just another way of operating, and going step by step as prompted isn't scary.  

**Diff**（diff（差异） ・ 差分（diff））  
Laying "before the change" and "after the change" side by side and marking them, so you can see at a glance exactly which lines the AI touched. It's the basis for reviewing changes.  
*Common misconception:* People often think reading diffs is only for programmers; in reality it's just a comparison of "what changed," and even if you don't know code, you should build the habit of reading the diff before approving.  

**Version Control / Git**（版本控制/Git ・ バージョン管理（Git））  
A system that records the history of every change to your files. With it, even if the AI breaks something, you can return to a previous version with one click. It's the safety net for "daring to let the AI act."  
*Common misconception:* People often think Git is only a programmer's tool; in reality it gives you the ability to "undo anytime," the key safeguard for letting the AI work freely without losing control.  

**Commit**（提交/commit ・ コミット）  
"Saving a snapshot" of the current batch of changes into the Git history. Each commit is a restorable save point, handy for later review and rollback.  

**Branch**（分支 ・ ブランチ）  
A "parallel work line" forked off the main line, where you can change things freely without affecting the main line even if you break something. When letting the AI make sweeping changes, opening a branch first is safer.  

**Rollback / Revert**（回滚 ・ 巻き戻し（ロールバック））  
Restoring files to an earlier save point, the equivalent of "one-click undo." When the AI changes something into a mess, rollback is one of the fastest first-aid measures.  

**Test**（测试 ・ テスト）  
A piece of code that automatically checks "whether the program works as expected." Running the tests after a change quickly reveals whether the AI broke something elsewhere.  

**Code Review**（代码评审 ・ コードレビュー）  
Before adopting a change, having a person (or another AI) check piece by piece whether the code is changed correctly and well. No matter how fast the AI writes, a human still has to do the review and the sign-off.  

**Regression**（退化 ・ デグレード（リグレッション））  
Changing a new feature but breaking an old feature that used to work fine. You catch it in time by running all the existing tests.  

**CLAUDE.md / Project Context**（CLAUDE.md/项目上下文 ・ CLAUDE.md（プロジェクト文脈））  
A "project manual" placed in the project that the AI reads first every time it starts work, spelling out the tech stack, the rules, the do-nots, and so on, the equivalent of a resident memory for the AI.  
*Common misconception:* People often think more is better; in reality writing too much takes up context and dilutes the key points, so write only the rules that "actually affect its work."  

**Permission System**（许可机制 ・ 許可（パーミッション）の仕組み）  
The mechanism by which a coding agent asks you first and acts only after you approve, before "changing files or running commands." Handing dangerous operations to a human to confirm is the key to it "acting without losing control."  

**Plan Mode**（计划模式 ・ プランモード）  
A mode where the AI first lays out its plan for "how it intends to make the changes" and acts only after you approve. Looking at the plan before a big change saves the most rework.  

**Subagent**（子代理 ・ サブエージェント）  
"Another AI" the main AI temporarily sends out to do a specialized job, with its own separate context, which brings back only a summary of the result when done, without taking up space in the main line.  

**Task Decomposition**（任务拆分 ・ タスク分割）  
Cutting a big task into small steps like "investigate, plan, execute, check," handing them to the AI one at a time. This makes it less likely to drift, and easier for you to keep control.  

**Acceptance / Sign-off**（验收 ・ 受け入れ確認）  
At the end, you confirm that "this change really meets the requirements and didn't break anything else" before adopting it. If you don't understand it or aren't sure, don't merge it; the responsibility is the human's.  
*Common misconception:* People often think passing the tests means all is well; in reality the tests are only the floor. Whether it truly meets the need, and whether it can ship, still takes a human to decide.  

**Workflow**（工作流 ・ ワークフロー）  
Upgrading "one question, one answer" into a fixed set of steps (such as investigate, plan, execute, accept), so the AI keeps pushing the task forward along the process without losing control.  

**Integrated Development Environment (IDE)**（集成开发环境 ・ 統合開発環境（IDE））  
The main software programmers write code in (such as VS Code). Many AI coding assistants can be installed and used inside it.  

**Repository (repo)**（仓库 ・ リポジトリ）  
The "central repository" of all of a project's files and their change history, usually managed by Git. The AI's work, commits, and rollbacks all revolve around it.  

**Pull Request (PR)**（拉取请求 ・ プルリクエスト）  
The process on a collaboration platform of "requesting that my batch of changes be merged into the main line," making it easy for others to review before merging. The AI can help you write the description and open the PR.  

**Refactoring**（重构 ・ リファクタリング）  
Tidying up the internal structure to make code clearer and easier to maintain, without changing the program's "external behavior." A common check is that "the existing tests all still pass," confirming nothing broke.  

**Debugging**（调试 ・ デバッグ）  
Finding and fixing the errors (bugs) in a program. A coding agent can read the error message, look into the cause, try a fix, and run it again, working through this "trial-and-error loop" on its own.  

**Sandbox / Isolated Environment**（沙箱/隔离环境 ・ サンドボックス（隔離環境））  
An isolated run environment where "even if something goes wrong, it won't reach the real system." Letting the AI try things freely in here is far safer than in the live environment.  

**Recovery / Troubleshooting**（急救/卡住怎么办 ・ トラブル時の応急処置）  
The standard moves for when the AI gets stuck or makes things messier the more it changes: stop the current run, start a new conversation, roll back the changes, restate the problem. Stop the bleeding first, then investigate.  

## Risk and safety

**Privacy**（隐私 ・ プライバシー）  
The question of how the content you give the AI gets handled, and whether it's retained or used for training. Be especially careful when personal or confidential information is involved.  
*Common misconception:* People often think what they put in is "gone once it's used"; in reality whether it's retained or used for training depends on the product's settings and terms, and those change, so confirm first.  

**Data Classification / Tiering**（数据分级 ・ データ分類（機密度レベル））  
Sorting information into a few tiers by sensitivity (such as public, internal, confidential, top secret), and deciding from that which can be fed to the AI and which absolutely cannot. A simple, practical self-protection framework.  

**Prompt Injection**（提示注入 ・ プロンプトインジェクション）  
An attacker hiding "fake instructions" in external content the AI will read (web pages, emails, documents), tricking it into doing something you never meant it to do.  
*Common misconception:* People often think the risk comes only from the words they type themselves; in reality any external content the AI reads may have a landmine buried in it, so be especially careful when hooking up external data.  

**Jailbreak**（越狱 ・ ジェイルブレイク）  
Using special wording to coax the AI into bypassing its safety limits and saying things it shouldn't. It's a form of misuse, and an attack vendors keep working to prevent.  

**Sensitive Information / Secrets**（敏感信息/密钥 ・ 機密情報・シークレット）  
Things that must never leak, like passwords, API keys, database connection strings, and private keys. Never paste them into a chat box or into code; if you do, revoke and reset them immediately.  
*Common misconception:* People often think pasting into an AI chat box is "private"; in reality it may be retained or leaked, which is like posting your house key to a group chat.  

**Personally Identifiable Information (PII)**（个人信息（PII） ・ 個人情報（PII））  
Information that can identify a specific person, such as a name, address, phone number, ID number, or email. Before feeding it to the AI, confirm whether any has slipped in and redact it.  
*Common misconception:* People often think only an ID number counts as PII; in reality a name plus an employer, an email, a location, and so on can also identify someone when combined, so all of it needs care.  

**Content Moderation**（内容审核 ・ コンテンツモデレーション）  
Applying safety filtering to the AI's input and output, blocking illegal, harmful, or inappropriate content. It refers both to the vendor's built-in guardrails and to your own gatekeeping of generated content.  

**Copyright**（版权 ・ 著作権）  
Whether AI-generated content "can be used directly, and whom it belongs to" raises copyright questions, and the rules are still developing. Be especially careful to check before commercial use.  
*Common misconception:* People often think anything AI-generated can be used commercially however they like; in reality ownership and usability depend on the specific case and local rules, so don't take it for granted.  

**AI Disclosure / Attribution**（署名/AI披露 ・ AIの利用開示（出所表示））  
Noting, where appropriate, that "this part was AI-generated or AI-assisted," for the sake of honesty and to help others judge. Whether it's required depends on the setting and the rules.  

**Open-source License**（开源许可证 ・ OSSライセンス）  
The usage terms of open-source code. For any third-party library the AI brings in, confirm that its license allows you to use it this way, or you may be in violation.  
*Common misconception:* People often think open source means "use it however"; in reality the restrictions differ a lot between licenses, and some require you to make your code public or keep the notices.  

**Context Cost**（上下文成本 ・ コンテキストコスト）  
The longer the context, the slower and more expensive each answer, and the easier it is to drift. So "saving context" often saves money, boosts speed, and improves quality, all at once. (Treat this as a rough rule, not a precise law.)  
*Common misconception:* People often think cramming in all the material at once is safest; in reality cramming in too much burns money, slows things down, and dilutes the key points, making mistakes more likely.  

**Quota / Rate Limit**（额度/限流 ・ 利用上限・レート制限）  
The vendor's limit on how much you can use per unit of time; go over it and you have to wait or move to a higher tier. You'll actually run into it when usage is heavy.  

**Zero Data Retention (ZDR)**（零数据保留 ・ ゼロデータ保持）  
An arrangement where the service provider doesn't keep your input and output (discarded once used), often used in privacy-sensitive scenarios. Whether it's available and how to enable it depends on the product.  

**Use of Data for Training**（数据用于训练 ・ 学習への利用）  
Whether your input gets taken by the service provider to train future models. This bears on whether confidential material might "leak out," so confirm before use and turn it off as needed.  
*Common misconception:* People often think all products use your data for training by default (or that none do); in reality each has a different policy, settable and subject to change, so confirm each one.  

**Bias**（偏见 ・ バイアス）  
Unfair tendencies a model learns from its training data (such as stereotypes about certain groups). It carries them into answers unconsciously, so be wary and check.  
*Common misconception:* People often think the machine is "objective and neutral"; in reality it learns the biases in the data wholesale, its output isn't necessarily fair, and important cases need a human to gatekeep.  

**Over-reliance / Automation Bias**（过度依赖 ・ 過度の依存）  
Believing the AI's answers without a second thought, treating it as an authority. It will confidently get things wrong, and the more you cut corners the easier it is to stumble, so the key judgments still have to be made by a human.  
*Common misconception:* People often think "the AI said so, it should be right"; in reality it has no ability to tell right from wrong, only to sound right, so important decisions can't be outsourced to it directly.  

**Data Masking / Anonymization**（数据脱敏 ・ マスキング（匿名化））  
Before feeding material to the AI, wiping out or replacing the sensitive parts (names, phone numbers, keys, and so on) with fake values. It's a common compromise for "wanting to use AI while protecting privacy."  

**Team Usage Policy**（团队使用规范 ・ チーム利用ガイドライン）  
A set of rules a team agrees on in advance: "what can be fed, what can't, who reviews, how keys are managed." It upgrades personal habits into a shared understanding, so no one causes trouble unintentionally.  

**Fabricated Citation**（幻觉引用 ・ 架空の出典）  
A classic form of hallucination: the AI makes up references, links, or legal provisions that look proper but don't actually exist. Citations must be verified one by one for authenticity.  
*Common misconception:* People often think "it gave a source, so it's trustworthy"; in reality the source itself may be made up, and the links and reference names all need to be opened and checked.  

**Guardrails**（安全护栏 ・ ガードレール）  
The various "don't cross this line" limits added to an AI system (refusing illegal requests, filtering dangerous output, and so on), relying both on the vendor's built-ins and on what the user adds.  

## Abbreviations

**AI = Artificial Intelligence**（AI（缩写） ・ AI（略語））  
The English abbreviation for artificial intelligence. A general term for the kinds of technology that get machines to do tasks requiring intelligence.  

**ML = Machine Learning**（ML（缩写） ・ ML（略語））  
The English abbreviation for machine learning. A class of methods that let a program learn patterns from data on its own.  

**DL = Deep Learning**（DL（缩写） ・ DL（略語））  
The English abbreviation for deep learning. A machine learning method that learns using multi-layer neural networks.  

**LLM = Large Language Model**（LLM（缩写） ・ LLM（略語））  
The English abbreviation for large language model, the core inside products like Claude and ChatGPT.  

**NLP = Natural Language Processing**（NLP（缩写） ・ NLP（略語））  
The English abbreviation for natural language processing, the field of getting computers to handle human language.  

**API = Application Programming Interface**（API（缩写） ・ API（略語））  
The English abbreviation for application programming interface. The entry point that lets your program call the model directly.  

**RAG = Retrieval-Augmented Generation**（RAG（缩写） ・ RAG（略語））  
The English abbreviation for retrieval-augmented generation. The method of retrieving material first, then having the model answer based on it.  

**MCP = Model Context Protocol**（MCP（缩写） ・ MCP（略語））  
The English abbreviation for model context protocol. An open standard that lets AI connect to external tools and data in a uniform way.  

**SDK = Software Development Kit**（SDK（缩写） ・ SDK（略語））  
The English abbreviation for software development kit. A ready-made code library that helps developers call the API more easily.  

**PII = Personally Identifiable Information**（PII（缩写） ・ PII（略語））  
The English abbreviation for personally identifiable information, such as a name, address, phone number, or email.  

**RLHF = Reinforcement Learning from Human Feedback**（RLHF（缩写） ・ RLHF（略語））  
The English abbreviation for reinforcement learning from human feedback, a mainstream approach to model alignment.  

**GPU = Graphics Processing Unit**（GPU（缩写） ・ GPU（略語））  
The English abbreviation for graphics processing unit. Originally for drawing graphics, it became the main hardware for training and running large models because it's good at large-scale parallel computation.  
*Common misconception:* People often think it's just a "gaming graphics card"; in reality it's the key compute for running large models, and how fast a model runs locally depends largely on it.  

**CLI = Command Line Interface**（CLI（缩写） ・ CLI（略語））  
The English abbreviation for command line interface. The way of operating software or a computer by typing commands, where many coding agents run.  

**GPT = Generative Pre-trained Transformer**（GPT（缩写） ・ GPT（略語））  
The abbreviated name for a class of large model (generative pre-trained Transformer), the core model series inside ChatGPT.  

**JSON = JavaScript Object Notation**（JSON（缩写） ・ JSON（略語））  
A common text format for "structured data," with keys and values in pairs that machines parse easily. Having the AI output JSON makes it easy for a program to process next.  

**ZDR = Zero Data Retention**（ZDR（缩写） ・ ZDR（略語））  
The English abbreviation for zero data retention. An arrangement where the service provider doesn't keep your input and output once used.  
