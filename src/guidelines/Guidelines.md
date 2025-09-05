**Add your own guidelines here**
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->

# Wordmark
- Use only the official ZeroH wordmark assets.
- Apply in brand primary blue (#009fe3) or white depending on background.
- Maintain proportions and respect minimum clear space = height of “Z”.
- Size variations: Bold / Medium / Small / Additional / Minimum.
- Do not recolor, distort, or add effects (shadows, gradients, outlines).

# Logo
- Use only the official ZeroH logo assets.
- Apply in primary brand colors (blue, navy, or white on dark).
- Respect minimum clear space = height of “Z” in wordmark.
- Maintain defined proportions and size variations.
- Do not recolor, distort, or add effects.

# Colors
Primary:
- #002338 (Dark Navy), #4695bf (Blue), #9de6fc (Light Blue)

Supporting:
- #f4c430 (Yellow), #e45f2b (Orange-Red), #ffffff (White)

Success:
- Base: #52c41a
- Use tokens: colorSuccess, colorSuccessBg, colorSuccessBorder, colorSuccessText
- Do not create custom greens.

Neutrals (Grays):
- Text: rgba(0,0,0,0.88), 0.65, 0.45, 0.25
- Icons: rgba(0,0,0,0.45), hover rgba(0,0,0,0.88)
- Background: #ffffff, #f5f5f5
- Fill: rgba(0,0,0,0.15 / 0.06 / 0.04 / 0.02)
- Borders: #d9d9d9, #f0f0f0
- Use only semantic tokens (Text.*, Background.*, Fill.*, Border.*).

Rules:
- Do not invent new hex values.
- Ensure WCAG AA contrast.
- Respect Light/Dark token mappings.

# Typography
Font family: Quicksand
Available weights: Light, Regular, Medium, Semibold, Bold

Headings:
- H1: Semibold 38/46
- H2: Semibold 30/38
- H3: Semibold 24/32
- H4: Semibold 20/28
- H5: Semibold 16/24

Desktop text:
- XL: Semibold 20/28
- LG: Medium 16/24
- Normal: Medium 14/22
- Caption: Semibold 12/20
- Code: Regular 12/16

Rules:
- Do not substitute fonts.
- Do not invent new sizes/weights.
- Maintain readability and accessibility across all sizes.

# Spacing
Padding tokens:
- XXS: 4px, XS: 8px, SM: 12px, MD: 20px, LG: 24px, XL: 32px, XXL: 48px
- Default padding: 16px

Margin tokens:
- XXS: 4px, XS: 8px, SM: 12px, Default: 16px, LG: 24px, XL: 32px, XXL: 48px

Rules:
- Use only predefined tokens.
- Do not create custom spacing values.
- Always align spacing to grid and apply consistently.
