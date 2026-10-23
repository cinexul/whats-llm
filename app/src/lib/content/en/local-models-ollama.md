A model can run on a provider's servers or on your own computer. Local processing can be useful for offline work, controlling data flow and avoiding a provider charge for each local inference. It also means managing the hardware and checking which parts of the workflow are actually local.

## 1. Why some people want to run a model on their own computer

If a downloaded model processes a saved document entirely on your machine, the document need not be sent to a model provider. Once the required software and model files are present, that task can work without the internet.

Those benefits depend on the **whole path**. A local chat interface might use a cloud model, send a web-search query, call a remote document parser or synchronize chat history. “Installed here” and “processed here” are different claims.

## 2. Local vs cloud: one table to settle the trade-off

| Question | Cloud inference | Entirely local inference |
| --- | --- | --- |
| Where is the model processing done? | On the service's servers | On your machine |
| Does input leave the machine? | Input sent to the service does | It need not, if the surrounding workflow also stays local |
| Can it work offline? | Remote inference needs a connection | Yes, after required downloads, for operations without remote dependencies |
| What does it cost? | May be free within limits, subscription-based or metered | Hardware, electricity, storage and maintenance; no cloud inference fee for the local computation |
| What determines quality? | The particular model, tools and configuration | The particular model, tools and configuration, within hardware limits |
| Who handles setup and updates? | Mainly the provider | Mainly you or the tool you use |

A small local model may handle a narrow task well. A cloud service can make larger models and managed tools available. “Local” alone does not mean smarter, worse, faster or free overall. Test the same representative task on the options you can actually use.

## 3. Before downloading, take a look: can your computer handle it

**Download size is not the total memory requirement.** Allow for model weights, working memory, the context cache, the operating system and other open applications. Longer context and concurrent requests can require more memory.

- **RAM** is system memory. Some models run using the CPU and RAM, potentially more slowly.
- **VRAM** is a discrete GPU's memory. A model may run wholly on the GPU or split work between GPU and CPU, depending on the runtime and hardware.
- **Unified memory** is shared by CPU and GPU on some computers. Do not count the same physical memory twice as if it were separate RAM plus VRAM.

For intuition only, 8 billion parameters stored at exactly 4 bits each would occupy about **4 billion bytes for those weights alone**: 8 billion × 4 ÷ 8. Actual formats add overhead, and the running application needs more. This is arithmetic, not a promise that an “8B 4-bit” model will fit or run well on a 4 GB machine.

Check the model format, runtime compatibility, supported hardware and available memory. Start with a modest model and short context, then measure your real task. Fitting in memory does not guarantee acceptable speed.

## 4. Quantization: "compress" a big model a bit so it can get on board

Quantization stores some model values with fewer bits. It can reduce storage and memory needs, with quality and performance trade-offs that depend on the method, model and task. A lower bit count does not guarantee a fixed, tiny accuracy loss.

Do not confuse **parameter count** with **quantization**: an 8B model and a 14B model have different parameter counts; two quantizations of the same 8B model represent its values differently. Other variants may change training, context support or capabilities. Read the model description instead of assuming every smaller download is simply a more compressed copy.

## 5. Ollama and LM Studio: tools that help ordinary people get a model running

Ollama and LM Studio are applications/runtimes for using supported models, not model families. Their supported formats and hardware differ. Downloadable **open-weight** models make local use possible, but licensing, commercial use and redistribution rules still depend on the model. Open weights do not automatically mean every part of the training process or data is open.

Ollama's official documentation describes **both local models and cloud models**. It also documents a local-only setting that disables its cloud features, including its cloud models and web search. Therefore, installing Ollama is not proof that every request stays local. Check the selected model and execution route, and consult the current local-only instructions if that is your goal.

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

**Verification scope — October 22, 2026:** checked the following official repository snapshots for the mechanisms and product examples in this chapter. This is a documentation-check date, not a model release date or a guarantee of access in your account.

[Ollama FAQ](https://github.com/ollama/ollama/blob/efabf6bc450454dc856c1f799aac7ea865e3a4cf/docs/faq.mdx) · [Ollama context](https://github.com/ollama/ollama/blob/efabf6bc450454dc856c1f799aac7ea865e3a4cf/docs/context-length.mdx) · [LM Studio offline](https://github.com/lmstudio-ai/docs/blob/8c7159be3ffe364af10aa8ae6f5a7570e9402089/0_app/0_root/offline.mdx)

---

## Quiz

1. **[Basic · Concept]** When can a document-summary task run entirely offline? <!-- quiz: q01 revision: 1 -->
   - A. Whenever the app icon is on the desktop
   - B. Only if it uses a web-search service
   - C. When the necessary model, files and software are local and the task has no remote dependency
   - D. Whenever the product name includes “AI”
   > **Answer: C.** Every required part of that operation must be available locally.

2. **[Basic · Misconception]** You installed Ollama. What can you conclude about data leaving your computer? <!-- quiz: q02 revision: 1 -->
   - A. Nothing ever leaves in any mode
   - B. You need to check whether the selected model and other features are local or cloud-based
   - C. Every model runs in the cloud
   - D. Model size determines privacy
   > **Answer: B.** The official tool supports different execution routes.

3. **[Basic · Hardware]** A model download is 5 GB. How much free memory does it need? <!-- quiz: q03 revision: 1 -->
   - A. Exactly 5 GB, in every configuration
   - B. Exactly half of 5 GB
   - C. None, because it is on disk
   - D. More information is needed: runtime, context, format and other memory use matter
   > **Answer: D.** File size alone does not measure total running memory.

4. **[Intermediate · Concept]** What is quantization? <!-- quiz: q04 revision: 1 -->
   - A. Representing some model values with fewer bits, with task-dependent trade-offs
   - B. Giving the model internet access
   - C. Making a model permanently error-free
   - D. Changing an 8B model into a 14B model
   > **Answer: A.** Parameter count and numerical precision describe different properties.

5. **[Basic · Scenario]** The model fits in memory but replies too slowly. What is a useful next step? <!-- quiz: q05 revision: 1 -->
   - A. Assume fitting guarantees speed and ignore the result
   - B. Increase context as far as possible
   - C. Check actual CPU/GPU use and try a smaller model or shorter context on the same task
   - D. Conclude that local models never work
   > **Answer: C.** Memory capacity is only one part of performance; compare usable configurations.

6. **[Basic · Observation]** A local model summarizes a file with networking disconnected. What have you established? <!-- quiz: q06 revision: 1 -->
   - A. Every feature is permanently private
   - B. That specific operation can run offline in the tested setup
   - C. The model never hallucinates
   - D. You will never need updates or downloads
   > **Answer: B.** This is useful evidence about one operation, not a guarantee about future data paths or answer quality.
