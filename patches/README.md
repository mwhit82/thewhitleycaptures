# react-i18next 17.0.15: changing Studio namespaces

Sanity 6.16.0 uses react-i18next for menu labels. Its `useTranslation` passes the namespace array directly as React hook dependencies. Studio can change that list from `[]` to `['studio']` as gallery actions load, violating React's fixed-length dependency rule and producing repeated Next.js error overlays.

The patch uses one serialized namespace key as the dependency and includes the resulting stable namespace list in the translation snapshot cache identity. The latter prevents stale translations when namespaces change. Source, ESM and CommonJS entry points receive the same fix.

`package.json` pins this transitive dependency to 17.0.15. `postinstall` applies the patch with `--error-on-fail`; do not skip lifecycle scripts during installation. `patch-package` is a runtime dependency so production installs can apply it too.

Regression: `tests/studio-translation.spec.ts` runs the real hook in a development React browser with Strict Mode. It repeatedly changes from zero to one to two namespaces and back, asserting translated labels and no console errors. Signed-in Studio gallery navigation was also checked without editing content.

Remove the override and patch once an upstream version fixes both namespace memoization and snapshot invalidation, then rerun this test and the signed-in Studio walkthrough. Do not suppress React errors or turn off Strict Mode to conceal this issue.
