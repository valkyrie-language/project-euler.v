# project-euler.v

Project Euler 题目在 **Valkyrie（V）** 与 **TypeScript** 上的完备性测试、外部产物基准与对比看板。

结构与 [`leetcode.v`](../leetcode.v) 同模式：单题 `metadata.json` + 教练稿 `readme.md` + `solvers/`（Python / TS / V）。

## 依赖兄弟仓

| 仓 | 作用 |
|----|------|
| [`nyar-vm.rs`](../nyar-vm.rs) | Rust 编译工具链与目标后端 |
| [`valkyrie.rs`](../valkyrie.rs) | 语言夹具与符合性验证 |
| [`valkyrie.v`](../valkyrie.v) | V `core` / `std`（根 `legions.von`） |

```bash
pnpm install
pnpm link:valkyrie
```

## 标识符

| 术语 | 含义 |
|------|------|
| **slug / id** | 目录名 `pe-NNN`（如 `pe-001`） |
| **number** | Project Euler 题号（URL `problem=N`） |

## 命令

```bash
pnpm test:problems
pnpm bench
pnpm dashboard
```

环境变量：`EULER_BATCH_ALL=1`、`EULER_BENCH_ID=pe-001`。

## 刷题流程

见 [`euler-practice`](.agents/skills/euler-practice/SKILL.md)（题解 → 实现 → 测 V → 演进）。代理约定 [`AGENTS.md`](AGENTS.md)。

## 许可证

[MPL-2.0](License.md)
