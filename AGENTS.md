# AGENTS

本目录是 **project-euler.v** — Project Euler 题目在 Valkyrie（V）与 TypeScript 上的完备性测试、外部产物基准与对比看板。

**代理入口（工具无关）**：不假定 Cursor、Codex、Claude Code 或其他产品。任何自动化助手先读本文件。

**Skills（开放标准）**：可复用工作流放在 [Agent Skills](https://agentskills.io/specification) 格式目录
`.agents/skills/<name>/SKILL.md`（YAML `name` + `description` + 正文）。Codex、Cursor、Claude Code 等均支持该路径；`AGENTS.md`
管常驻约定，skill 管专题流程（按需加载）。

**刷题**：用户说「刷题」「做一题」「推进某 slug」时，指单题 **完整闭环** — 写题解 → 写实现 → 测 Valkyrie → 缺能力则上游演进。见
`.agents/skills/euler-practice/SKILL.md`。

兄弟仓（本机路径，勿写死进题目内容）：

| 仓               | 用途                                                    |
|------------------|---------------------------------------------------------|
| `../nyar-vm.rs` | Rust 编译工具链与目标后端 |
| `../valkyrie.rs` | 语言夹具与符合性验证 |
| `../valkyrie.v`  | V 语言 `std`（经根 `legions.von` 注册）                 |

## 标识符（slug / id / number）

| 术语       | 含义                                                          | 示例                                                          |
|------------|---------------------------------------------------------------|---------------------------------------------------------------|
| **slug**   | 磁盘目录名（`pe-` + 三位题号）                                | `pe-001` → `projects/problems/pe-001/`                        |
| **id**     | 仓内 catalog / 跑测键；`metadata.json` 的 `id`、`EULER_BENCH_ID` | `pe-001`（**现实现中与 slug 同字符串**）                      |
| **number** | Project Euler 题号                                            | `1` → `https://projecteuler.net/problem=1`                    |

readme 链接用 **number**；目录与跑测键用 **slug** / **id**。

## 目录约定

| 路径                                           | 用途                                                                        |
|------------------------------------------------|-----------------------------------------------------------------------------|
| `projects/problems/<slug>/`                    | 单题：`metadata.json`、`readme.md`（教练稿）、`solvers/`                    |
| `projects/problems/<slug>/solvers/python/`     | Python 参考解：`solution.py` + `pyproject.toml`                                |
| `projects/problems/<slug>/solvers/typescript/` | 手写 TS 解：`solution.ts` + `package.json`                                  |
| `projects/problems/<slug>/solvers/valkyrie/`   | 手写 V 解：`solution.v` + `legion.von`（`entry: "solution.v"`）             |
| `projects/conformance/`                        | 完备性矩阵、TS/Python/V 跑测、**外部产物基准**                              |
| `projects/dashboard/`                          | Vue 看板（缓存 `benchmark-results.json`，Vega-Lite 可视化）                 |
| `scripts/`                                     | `batch-limit.mjs`、`link-valkyrie.mjs`、`valkyrie-v-deps.mjs` |
| `legions.von`                                  | workspace 成员：`../valkyrie.v/projects/std`                                |

**禁止**：程序化批量生成 V 解、在 `.v` 里嵌 `# ```legion` cargo-script、把 solver 再套一层 `source/` 目录（除非 `legion`
规划器明确要求）。

## 题目元数据

- `metadata.json`：`id`、`number`、`title`、`answer`（官方答案字符串）、`tests[]`（通常仅 `expected`）、`invoke`（如 `solve`）。目录名 = **slug**（与 `id` 同值）。
- `projects/conformance/src/catalog.generated.ts` 为目录索引， **勿手改**。
- 大批量跑测默认限 **50** 题（`scripts/batch-limit.mjs`）；全量需 `EULER_BATCH_ALL=1`。
- 单题基准：`EULER_BENCH_ID=pe-001 pnpm bench`。

## 题解文档（`readme.md`）

每题根目录应有 `readme.md`（教练稿）。格式与流程见 `.agents/skills/euler-coach/SKILL.md`。

硬性要求：

1. **标题即链接**：`# [英文题名](https://projecteuler.net/problem=<number>)`
2. **元数据不进 readme**：题号、`answer` 以 `metadata.json` 为准，readme **不**重复题号行。
3. **正文汉化**：问题、示例、约束用中文。
4. **必须含**：`## 问题`、`## 解答`、`## 复杂度分析`（内含 `### 时间复杂度`、`### 空间复杂度` 各一段 $O (...)$ + 独立理由段）。
5. **由浅入深**：`## 解答` 用 `###` 小标题 + 段落（ **不用**有序列表）；瓶颈/优化须具名（如 `### 补数重复扫描瓶颈`、
   `### 哈希表一次遍历优化`），困难题可多轮； **禁止**独立 `进阶` / Follow-up 小节。
6. **语言无关**：readme **不得**出现编程语言、代码块、函数/类名、`invoke`、`solvers/` 等实现细节（题面符号如 `nums` 除外）。
7. **数学用 LaTeX**；题面符号与示例输入输出用反引号。
8. **不**粘贴完整英文题面；正文中文表述。

## 求解器约定

| 语言       | 入口                                          | 说明                                                                   |
|------------|-----------------------------------------------|------------------------------------------------------------------------|
| Python     | `invoke.python`                               | 数据集参考，与 `tests` 对齐                                            |
| TypeScript | `export function solve` 或 `invoke.typescript` | 手写，与 Python 同算法语义                                          |
| Valkyrie   | `solution.v` + `legion.von`                   | `core: true`、`std: true`、`target: node`；**无** `[benchmark]` 烟雾块 |

`legion.von` 示例字段：`entry: "solution.v"`、`dependencies: { core: true, std: true }`。

## 基准测试

- **外部基准**：先 `legion build` 得到产物，再用 harness 对 **metadata.tests** 计时不依赖源码内 `[benchmark]`。
- TS：经 `run_ts_solver.ts` 对 `solution.ts` 跑全量测试并计时。
- 编排：`pnpm bench` → `@euler/conformance` `bench-all.ts`。
- 看板：`pnpm dashboard`；结果写入 `projects/dashboard/public/benchmark-results.json`。

## 格式化与链接

```text
pnpm link:valkyrie    # 链到兄弟仓 vcc（按需）
pnpm fmt              # `nifty format`（读 `biome.json`，4 空格）
pnpm fmt:check
pnpm test:problems    # 完备性
pnpm bench            # 基准
pnpm dashboard        # 看板 dev
```

- Biome 扫描：`scripts/`、`conformance/`、`dashboard/`、根 manifest、 **仅** `projects/problems/**/metadata.json`（不扫海量
  solver `package.json`）。
- **中文**写注释与 `readme.md`； **commit message** 用 gitmoji + 英文 subject/body（与本工作区既有约定一致）。

## 代理检索纪律

- **禁止**对工作区做 `**/*` 或无界全量 glob（`node_modules`、数万 `metadata.json` 会拖垮会话）。
- 已知 slug → 直读 `projects/problems/<slug>/`（`EULER_BENCH_ID` 等环境变量填 **id**，现与 slug 同字符串）。
- 搜代码 → 限定目录（如 `projects/conformance/src`）并带 `head_limit`。
- 列题目 → 读 `catalog.generated.ts` 或 `metadata.json`，不要递归枚举整个 `problems/`。

## Agent Skills（`.agents/skills/`）

| Skill                   | 用途                                                 |
|-------------------------|------------------------------------------------------|
| **`euler-practice`** | **刷题全流程**（编排下列四步，用户说刷题时先加载）   |
| `euler-coach`        | ① 单题 `readme.md` 教练稿（语言无关）                |
| `euler-implement`    | ② `solvers/` 三端实现与 `metadata.tests`             |
| `valkyrie-guide`        | ② 写 V 时：语法、下标、std、legion                   |
| `valkyrie-evolution`    | ④ 在 `../valkyrie.v` 补库，在 `../nyar-vm.rs` 补编译器，在 `../valkyrie.rs` 补夹具 |

**勿**在仓库根自建 `skills/` 或提交 `.cursor/skills/` 副本；`.cursor/` 仅作本机可选映射（已 gitignore）。
