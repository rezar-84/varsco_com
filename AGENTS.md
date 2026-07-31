<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

# AI Agents & Assistants

This repository contains specialized configurations for autonomous AI agents that run via the Google Antigravity framework to manage updates, translations, and technical documentation.

## 1. Registered Subagents

### 🌐 Translation Editor (`translation_editor`)

An editor agent with expertise in B2B search engine optimization (SEO) and commercial aquaculture technology (live feeds, salmonid genetics, ocean farming).

- **Purpose:** Reviews localization dictionaries and content files (`.json`, `.md`), correcting literal/machine translations to natural, native B2B structures.
- **Documentation:** Detailed terminology maps and developer layout hand-off checklists are available in [doc/translation_agents.md](file:///home/rubuntu/Projects/Websites/aqua-bloom-portal/doc/translation_agents.md).
- **How to Invoke:**
  ```json
  {
    "TypeName": "translation_editor",
    "Role": "German B2B Aquaculture Editor",
    "Prompt": "Review translation file src/lib/locales/de.json. Verify correct terminology for Eyed Eggs (Augenpunkteier) and Live Feed (Lebendfutter)."
  }
  ```
