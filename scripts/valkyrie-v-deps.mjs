import { existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
export const EULER_ROOT = join(SCRIPTS_DIR, "..");

export const VALKYRIE_V_GIT =
    process.env.VALKYRIE_V_GIT ?? "https://github.com/valkyrie-language/valkyrie.v.git";
export const VALKYRIE_V_REF = process.env.VALKYRIE_V_REF ?? "main";
export const VALKYRIE_V_ROOT = resolve(
    process.env.VALKYRIE_V_ROOT ?? join(EULER_ROOT, "..", "valkyrie.v"),
);

export function valkyrieVDepsMode() {
    return process.env.VALKYRIE_V_DEPS === "git" ? "git" : "local";
}

export function assertValkyrieVPresent(mode = valkyrieVDepsMode()) {
    if (mode === "git") {
        return;
    }
    if (!existsSync(VALKYRIE_V_ROOT)) {
        throw new Error(
            `找不到 valkyrie.v：${VALKYRIE_V_ROOT}\n` +
                "请 clone 到 project-euler.v 同级，或设置 VALKYRIE_V_ROOT / VALKYRIE_V_DEPS=git。",
        );
    }
}

function toPosixPath(path) {
    return path.split("\\").join("/");
}

export function coreStdDependenciesVon() {
    return `        core: true,
        std: true`;
}

/** 写入 `project-euler.v/legions.von`，注册 `core` / `std` workspace 成员。 */
export function eulerLegionsVon({
    eulerRoot = EULER_ROOT,
    valkyrieRoot = VALKYRIE_V_ROOT,
} = {}) {
    const coreMember = toPosixPath(relative(eulerRoot, join(valkyrieRoot, "projects", "core")));
    const stdMember = toPosixPath(relative(eulerRoot, join(valkyrieRoot, "projects", "std")));
    return `{
    name: "project-euler",
    members: [
        "${coreMember}",
        "${stdMember}"
    ],
    workspace: {
        version: "0.1.0",
        auto_link: {
            core: false,
            std: false
        }
    }
}
`;
}

export function updateLegionVonDependencies(manifestSource, depsBlock = coreStdDependenciesVon()) {
    if (!manifestSource.includes("dependencies:")) {
        return manifestSource.replace(
            /auto_link:\s*\{[^}]+\},/,
            `auto_link: {
        core: false,
        std: false
    },
    dependencies: {
${depsBlock}
    },`,
        );
    }
    return manifestSource.replace(
        /dependencies:\s*\{[\s\S]*?\},/,
        `dependencies: {\n${depsBlock}\n    },`,
    );
}
