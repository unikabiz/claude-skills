---
name: unexpected-property-skill
description: This skill has an unexpected top-level property in the frontmatter
author: Test Author
unexpected_field: This should not be here
---

# Invalid Skill - Unexpected Property

This fixture tests that validation fails when there are unexpected top-level properties in the frontmatter. Only name, description, license, allowed-tools, and metadata are allowed.
