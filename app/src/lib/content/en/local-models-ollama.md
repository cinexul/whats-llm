A model can run on a provider's servers or on your own computer. Running a model is also called inference: having the model compute an answer from the input. This chapter simply says "running," because inference has nothing to do with the reasoning effort setting from Chapter 8. Running a model locally can be useful for offline work and controlling data flow, and you do not pay a cloud provider each time you use it. It also means managing the hardware and checking which parts of the workflow are actually local.

## 1. Why some people want to run a model on their own computer

If a downloaded model processes a saved document entirely on your machine, the document need not be sent to a model provider. Once the required software and model files are present, that task can work without the internet.

Those benefits depend on the **whole path**. A local chat interface might use a cloud model, send a web-search query, call a remote document parser or synchronize chat history.

> **Key point:** “Installed here” and “processed here” are different claims. Whether data leaves your computer depends on where the selected model and each add-on feature actually run.

## 2. Local vs cloud: one table to settle the trade-off

| Question | Running in the cloud | Running entirely locally |
| --- | --- | --- |
| Where is the model processing done? | On the service's servers | On your machine |
| Does input leave the machine? | Input sent to the service does | It need not, if the surrounding workflow also stays local |
| Can it work offline? | Running remotely needs a connection | Yes, after required downloads, for operations without remote dependencies |
| What does it cost? | May be free within limits, subscription-based or metered | Hardware, electricity, storage and maintenance; no cloud usage fee for running locally |
| What determines quality? | The particular model, tools and configuration | The particular model, tools and configuration, within hardware limits |
| Who handles setup and updates? | Mainly the provider | Mainly you or the tool you use |

A small local model may handle a narrow task well. A cloud service can make larger models and managed tools available. “Local” alone does not mean smarter, worse, faster or free overall. Test the same representative task on the options you can actually use.

## 3. Before downloading, take a look: can your computer handle it

**Download size is not the total memory requirement.** Think of the model file as a thick cookbook: it takes up space on the shelf (the disk), but to actually cook you also have to open it on the counter (memory) next to the ingredients and the dish in progress.

The memory needed while running has several parts: the model weights themselves; working memory for the runtime (the software that loads and runs the model); the context cache, which stores parts of the conversation that have already been processed so they need not be recomputed each time; plus the operating system and other open applications. Longer context and concurrent requests can require more memory.

- **RAM** is system memory. Some models run using the CPU and RAM, potentially more slowly.
- **VRAM** is a discrete GPU's memory. A model may run wholly on the GPU or split work between GPU and CPU, depending on the runtime and hardware.
- **Unified memory** is shared by CPU and GPU on some computers. Do not count the same physical memory twice as if it were separate RAM plus VRAM.

For intuition only, 8 billion parameters stored at exactly 4 bits each would occupy about **4 billion bytes for those weights alone**: 8 billion × 4 ÷ 8. Actual formats add overhead, and the running application needs more. This is arithmetic, not a promise that an “8B 4-bit” model will fit or run well on a 4 GB machine.

Check the model format, runtime compatibility, supported hardware and available memory. Start with a modest model and short context, then measure your real task. Fitting in memory does not guarantee acceptable speed.

## 4. Quantization: "compress" a big model a bit so it can get on board

Quantization stores some model values with fewer bits. It can reduce storage and memory needs, with quality and performance trade-offs that depend on the method, model and task. A lower bit count does not guarantee a fixed, tiny accuracy loss.

Do not confuse **parameter count** with **quantization**: an 8B model and a 14B model have different parameter counts; two quantizations of the same 8B model represent its values differently. Other variants may change training, context support or capabilities. Read the model description instead of assuming every smaller download is simply a more compressed copy.

## 5. Ollama and LM Studio: tools that help ordinary people get a model running

Ollama and LM Studio are applications/runtimes for using supported models, not model families. Their supported formats and hardware differ.

Local use depends on **open-weight models**: the publisher has released the model's parameter files, so you can download and run them on your own computer. Licensing, commercial use and redistribution rules still depend on the model. Open weights do not automatically mean every part of the training process or data is open.

Ollama's official documentation describes **both local models and cloud models**. It also documents a local-only setting that disables its cloud features, including its cloud models and web search. As of October 2026, the official FAQ says to set `disable_ollama_cloud` in a configuration file or set the environment variable `OLLAMA_NO_CLOUD=1`, then restart Ollama; follow the official documentation for the exact steps. Therefore, installing Ollama is not proof that every request stays local; check the selected model and execution route.

LM Studio’s offline documentation specifically describes local chat, local document processing and a local server as operations that can work without internet access after models are downloaded. Finding and downloading models still requires connectivity. Additional integrations need their own data-path check.

For a first trial, use a harmless document already on your computer. Download a compatible local model, confirm local mode, and try summarizing the document with networking disconnected. That trial checks that this operation can run offline; it does not establish that every connected feature or later session will remain local. Review separate search, plugins, sync and remote-service settings.

## 6. Common misconceptions, cleared up

| Misconception | Correction |
| --- | --- |
| Ollama always means offline | It supports local and cloud execution; inspect the selected route |
| A 5 GB download needs only 5 GB of memory | Runtime and context memory add to the weights |
| Enough RAM guarantees fast output | Processor, GPU, memory bandwidth and configuration also matter |
| Smaller variants only differ in compression | Parameter count, training and other capabilities may differ |
| Local processing guarantees a correct answer | Local models can hallucinate too |

## Summary

Choose local processing when it fits your task and constraints. Trace the actual data path, leave memory headroom, test output quality and speed, and read the model's license. These checks are more useful than treating “local” or “cloud” as a quality ranking.

---

**Verification scope — October 22, 2026 (Ollama local-only setting rechecked October 27, 2026):** checked the following official repository snapshots for the mechanisms and product examples in this chapter. This is a documentation-check date, not a model release date or a guarantee of access in your account.

[Ollama FAQ](https://github.com/ollama/ollama/blob/efabf6bc450454dc856c1f799aac7ea865e3a4cf/docs/faq.mdx) · [Ollama context](https://github.com/ollama/ollama/blob/efabf6bc450454dc856c1f799aac7ea865e3a4cf/docs/context-length.mdx) · [LM Studio offline](https://github.com/lmstudio-ai/docs/blob/8c7159be3ffe364af10aa8ae6f5a7570e9402089/0_app/0_root/offline.mdx)

---

## Quiz

1. **[Basic · Concept]** When can a document-summary task run entirely offline? <!-- quiz: q01 revision: 1 -->
   - A. Whenever you use a tool built for running models locally
   - B. Whenever the app is a desktop version installed on the PC
   - C. Once the model is downloaded, even with web search left on
   - D. When all it needs is local, with no remote dependency
   > **Answer: D.** Every required part of that operation must be available locally. The kind of tool (A) and where it is installed (B) guarantee nothing, and with web search on (C), queries leave the computer.

2. **[Basic · Misconception]** You installed Ollama. What can you conclude about data leaving your computer? <!-- quiz: q02 revision: 1 -->
   - A. Nothing yet; check where the chosen model and features run
   - B. Nothing leaves, because Ollama is a local-only tool
   - C. Nothing leaves, as long as the model file is small
   - D. Everything leaves, because all Ollama models run in the cloud
   > **Answer: A.** As of October 2026, Ollama's official documentation covers both local and cloud models and offers a setting to turn the cloud features off, so you need to check the selected model and execution route. B overlooks cloud models and web search, D goes to the opposite extreme, and model size (C) has nothing to do with where data goes.

3. **[Basic · Hardware]** A model download is 5 GB. How much free memory does it need? <!-- quiz: q03 revision: 1 -->
   - A. Exactly 5 GB; it uses as much as the download size
   - B. About half, because the runtime compresses it further
   - C. Not enough info; runtime, context and more matter
   - D. None, because the model is already stored on disk
   > **Answer: C.** File size alone does not measure total running memory: the runtime, context cache, model format, operating system and other apps all take some. A is the misconception this chapter corrects; the runtime does not halve it again (B); and being on disk does not mean it needs no memory (D).

4. **[Intermediate · Concept]** What is quantization? <!-- quiz: q04 revision: 1 -->
   - A. Cutting the parameter count to turn a 14B model into 8B
   - B. Using fewer bits per value, with task-dependent effects
   - C. Packing the model into an archive that unzips at runtime
   - D. Retraining the model so that it uses less memory
   > **Answer: B.** Quantization lowers the precision of stored values to save storage and memory, and its effect on quality depends on the method, model and task. Parameter count is a separate property (A), and it is neither an ordinary archive (C) nor retraining (D).

5. **[Basic · Scenario]** The model fits in memory but replies too slowly. What is a useful next step? <!-- quiz: q05 revision: 1 -->
   - A. Max out the context so it can read everything at once
   - B. Blame the network, since a model that fits should be fast
   - C. Give up on local models, since they are all too slow
   - D. Check hardware use; try a smaller model or less context
   > **Answer: D.** Fitting in memory is only one part of performance; processor, GPU, memory bandwidth and configuration matter too, so compare usable configurations on the same task. Longer context usually makes it slower (A), a local model running offline does not depend on the network (B), and one slow run does not rule out local use (C).

6. **[Basic · Observation]** A local model summarizes a file with networking disconnected. What have you established? <!-- quiz: q06 revision: 1 -->
   - A. That operation can run offline in the tested setup
   - B. No feature of this app will ever go online again
   - C. Summaries made offline cannot contain hallucinations
   - D. You will never need any updates or downloads again
   > **Answer: A.** This is useful evidence about one operation. Search, plugins and sync still need separate checks (B); local models hallucinate too (C); and changing models or updating software still requires downloads (D).
