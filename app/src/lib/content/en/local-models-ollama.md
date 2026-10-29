A model can run on a provider's servers or on your own computer. Running a model is called inference: having the model compute an answer from the input. It has nothing to do with the reasoning effort from Chapter 8, and this chapter simply says "run." Running a model locally suits some offline tasks, keeps the data path under your control, and avoids paying a cloud provider every time you use it. In exchange, you look after the hardware yourself and have to check which parts of the whole workflow really stay local.

## 1. Why some people want to run models on their own computers

If a downloaded model processes a saved document entirely on your computer, that document doesn't need to go to any model provider. Once the software and model files are in place, the task can also run without the internet.

These benefits only hold if the whole data path stays local. A chat app installed on your computer can still call a cloud model, send search terms to the web, use a remote document-parsing service or sync your chat history.

> **Key point:** "Installed here" and "processed here" are different questions. Whether data leaves your computer depends on where the chosen model and each extra feature actually run.

## 2. Local or cloud: the tradeoffs in one table

| Question | Running in the cloud | Running fully locally |
| --- | --- | --- |
| Where does the model process data? | The provider's servers | Your own computer |
| Does input leave the computer? | Input sent to the service leaves | Not necessarily, if the surrounding workflow is also local |
| Can it work offline? | Needs a connection | After the needed files are downloaded, operations without remote dependencies can |
| What does it cost? | Free allowance, subscription or pay-as-you-go | Hardware, electricity, storage and maintenance; no cloud usage fees |
| What determines quality? | The specific model, tools and configuration | The specific model, tools and configuration within your hardware's limits |
| Who handles setup and updates? | Mainly the provider | Mainly you or the tool you use |

A small local model can still do well at a narrow task; cloud services can offer bigger models and managed tools. The word "local" on its own doesn't mean smarter, weaker or faster, or that the total cost is zero. Try the options you can actually use on the same representative task.

## 3. Before downloading: can your computer handle it?

Download size is not the total memory needed to run. Think of the model file as a very thick cookbook: it takes up room on the shelf (disk), but to cook you also have to spread it open on the counter (memory), next to the ingredients and the dish in progress.

Memory at run time has several parts: the model weights themselves; working memory for the runtime (the software that loads and runs the model); the context cache, which stores what the conversation has already processed so it doesn't have to be recomputed each time; plus the operating system and other open apps. A longer context and more simultaneous requests both need more memory.

- RAM is system memory. Some models can run on the CPU and RAM alone, but usually slowly.
- VRAM is the memory on a dedicated graphics card. Depending on the software and hardware, a model may run entirely on the GPU or be split between GPU and CPU.
- Some computers, such as Macs with Apple silicon, use unified memory shared by CPU and GPU; don't count the same physical memory twice as "RAM plus VRAM."

A rough calculation: 8 billion (8B) parameters stored at 4 bits each take 8 billion × 4 ÷ 8 = 4 billion bytes, about 4 GB, for the weights alone. Real files are a little larger: as of October 2026, the 4-bit `qwen3:8b` in the Ollama model library is about a 5.2 GB download, because common 4-bit formats keep some values at higher precision. Running it adds the context cache and runtime overhead on top. For rough memory needs by model size, see Appendix E.

Context length also feeds straight into memory. Ollama's documentation says that, as of October 2026, it sets the default context automatically by VRAM: 4k tokens below 24 GiB of VRAM, 32k for 24 to 48 GiB, and 256k at 48 GiB or more. For tasks like web search, agents and coding it recommends at least 64,000 tokens, while warning that a longer context uses more memory. In other words, a local model on an ordinary laptop may by default "see" far less than the cloud assistants you're used to.

Once it's installed, the command `ollama ps` shows how much memory the model is actually using and whether it's running 100% on the GPU or partly on the CPU (spilling onto the CPU usually makes it much slower). Start with a mid-sized model and a short context, then measure with your own task. Fitting in memory doesn't mean it runs fast enough to live with.

## 4. Quantization: making a model smaller so it fits on your computer

Quantization stores the numbers in a model with fewer bits, saving disk space and memory. How much quality you lose depends on the method, the model and the task; fewer bits don't always cost just a small, fixed amount of accuracy.

Here are the real download sizes of different quantized versions of the same model (Ollama model library, as of October 2026):

| Version | Parameters | Roughly bits per value | Download size |
| --- | --- | --- | --- |
| `qwen3:8b-q4_K_M` | 8B | a little over 4 | 5.2 GB |
| `qwen3:8b-q8_0` | 8B | 8 | 8.9 GB |
| `qwen3:8b-fp16` | 8B | 16 | 16 GB |
| `qwen3:14b-q4_K_M` | 14B | a little over 4 | 9.3 GB |

The first three rows are the same 8B model at different precision; the last row has more parameters and is a different model. So don't mix up parameter count and quantization: 8B versus 14B is a difference in the number of parameters, while the three 8B versions differ in precision. Some variants also change the training, context support or capabilities, so read the model card instead of assuming every smaller download is a compressed copy of the same model.

## 5. Ollama and LM Studio: tools that get models running for ordinary people

Ollama and LM Studio are apps for running compatible models, not model families. They don't support exactly the same model formats and hardware.

Local use depends on open-weight models: the publisher releases the model's parameter files so you can download and run them on your own computer. Whether you may use them commercially or redistribute them depends on each model's license, and open weights don't mean the training process and data are public too.

Ollama offers both local and cloud models. As of October 2026, its documentation says models whose names end in `:cloud` (for example `gemma4:cloud`) run in Ollama's cloud and need no download, and that Ollama's own server listens only on this computer's address `127.0.0.1`, port 11434, by default. To use only local models, set `"disable_ollama_cloud": true` in `~/.ollama/server.json` or set the environment variable `OLLAMA_NO_CLOUD=1`, then restart; the log will show `Ollama cloud disabled: true`, and cloud models and web search stop working. So having Ollama installed doesn't show that every request stays local; check the chosen model and the execution path.

LM Studio's offline documentation says that once a model is downloaded, chatting with it, chatting with documents (RAG) and running a local server need no internet connection, and documents you drop in stay on your machine. Searching for and downloading models, downloading runtimes and checking for updates do need the internet; any other features you connect must be checked separately.

A first test could go like this: pick a document already on your computer that contains nothing sensitive, download a mid-sized model (for example `ollama run qwen3:8b`, about 5.2 GB), confirm you're using the local model, disconnect from the network, and ask it to summarize the document. That shows this operation can run offline, but it doesn't prove every connected feature or future session stays local; search, plugins, sync and remote service settings still need checking one by one.

## 6. Common misconceptions, cleared up

| Misconception | Correction |
| --- | --- |
| Ollama always means offline | It has both local and cloud models; it depends on the path you choose |
| A 5 GB download needs only 5 GB of memory | The runtime and context cache add to the requirement |
| Enough memory guarantees speed | The processor, GPU, memory bandwidth and configuration matter too |
| A smaller variant is just more compressed | Parameter count, training and capability may differ too |
| Local processing guarantees correct answers | Local models hallucinate too |

## Summary

Whether running locally makes sense depends on the task and your constraints. Trace the real data path, leave memory headroom (there's the context cache as well as the weights), use a command like `ollama ps` to see where the model is actually running, test quality and speed with your own task, and read the model license. These checks are far more useful than treating "local" or "cloud" as a quality ranking.

## Sources and version notes

Checked October 29, 2026.

- [Ollama FAQ](https://github.com/ollama/ollama/blob/3fbc609be4b3ac5af8061bef6b0013a32e50d17f/docs/faq.mdx): the two settings for disabling cloud features, and the default listening address.
- [Ollama: context length](https://github.com/ollama/ollama/blob/3fbc609be4b3ac5af8061bef6b0013a32e50d17f/docs/context-length.mdx): default context by VRAM, the 64,000-token recommendation, and `ollama ps`.
- [Ollama: cloud models](https://github.com/ollama/ollama/blob/3fbc609be4b3ac5af8061bef6b0013a32e50d17f/docs/cloud.mdx): `:cloud` models run in the cloud and need no download.
- [Ollama model library: qwen3 versions](https://ollama.com/library/qwen3/tags): download sizes of each quantized version.
- [LM Studio offline operation](https://github.com/lmstudio-ai/docs/blob/8c7159be3ffe364af10aa8ae6f5a7570e9402089/0_app/0_root/offline.mdx): which operations work offline and which need a connection.

---

## Quiz

1. **[Basic · Concept]** When can a document-summary task run entirely offline? <!-- quiz: q01 revision: 2 -->
   - A. Whenever you use a tool built for running models locally
   - B. Whenever the app is a desktop version installed on the PC
   - C. Once the model is downloaded, even with web search left on
   - D. When all it needs is local, with no remote dependency
   > **Answer: D.** Every required part of that operation must be available locally. The kind of tool (A) and where it is installed (B) guarantee nothing, and with web search on (C), queries leave the computer.

2. **[Basic · Misconception]** You installed Ollama. What can you conclude about data leaving your computer? <!-- quiz: q02 revision: 2 -->
   - A. Nothing yet; check where the chosen model and features run
   - B. Nothing leaves, because Ollama is a local-only tool
   - C. Nothing leaves, as long as the model file is small
   - D. Everything leaves, because all Ollama models run in the cloud
   > **Answer: A.** As of October 2026, Ollama's official documentation covers both local and cloud models and offers a setting to turn the cloud features off, so you need to check the selected model and execution route. B overlooks cloud models and web search, D goes to the opposite extreme, and model size (C) has nothing to do with where data goes.

3. **[Basic · Hardware]** A model download is 5 GB. How much free memory does it need? <!-- quiz: q03 revision: 2 -->
   - A. Exactly 5 GB; it uses as much as the download size
   - B. About half, because the runtime compresses it further
   - C. Not enough info; runtime, context and more matter
   - D. None, because the model is already stored on disk
   > **Answer: C.** File size alone does not measure total running memory: the runtime, context cache, model format, operating system and other apps all take some. A is the misconception this chapter corrects; the runtime does not halve it again (B); and being on disk does not mean it needs no memory (D).

4. **[Intermediate · Concept]** What is quantization? <!-- quiz: q04 revision: 2 -->
   - A. Cutting the parameter count to turn a 14B model into 8B
   - B. Using fewer bits per value, with task-dependent effects
   - C. Packing the model into an archive that unzips at runtime
   - D. Retraining the model so that it uses less memory
   > **Answer: B.** Quantization lowers the precision of stored values to save storage and memory, and its effect on quality depends on the method, model and task. Parameter count is a separate property (A), and it is neither an ordinary archive (C) nor retraining (D).

5. **[Basic · Scenario]** The model fits in memory but replies too slowly. What is a useful next step? <!-- quiz: q05 revision: 3 -->
   - A. Max out the context so it can read everything at once
   - B. Switch to the fp16 version of the same model for precision
   - C. Download the model files again in case they are corrupted
   - D. Check whether it spills onto the CPU; try a smaller model
   > **Answer: D.** Fitting in memory is only one part of performance. Use a command like `ollama ps` to see whether part of the model has spilled onto the CPU, then try a smaller model or a shorter context and compare on the same task. A longer context usually makes it slower and uses more memory (A); the fp16 version is about three times the size of the 4-bit one and will only be slower (B); if the model answers normally, the files aren't corrupted, and downloading again won't fix the speed (C).

6. **[Basic · Observation]** A local model summarizes a file with networking disconnected. What have you established? <!-- quiz: q06 revision: 2 -->
   - A. That operation can run offline in the tested setup
   - B. No feature of this app will ever go online again
   - C. Summaries made offline cannot contain hallucinations
   - D. You will never need any updates or downloads again
   > **Answer: A.** This is useful evidence about one operation. Search, plugins and sync still need separate checks (B); local models hallucinate too (C); and changing models or updating software still requires downloads (D).
