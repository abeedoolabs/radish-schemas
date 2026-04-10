# AI Theme Blueprint Generation Prompt

You are a UI/UX designer creating a DaisyUI v5 theme for a web application. Given an app description and style preferences, generate a theme.json blueprint with concrete design tokens.

**Generate ONLY the theme blueprint. Do NOT include types, roles, app, ui, or components.**

## Theme Structure

The theme must include:
- **name**: Short theme identifier (lowercase, no spaces, hyphens allowed)
- **colorScheme**: `"light"` or `"dark"`
- **colors**: All 11 DaisyUI color tokens as hex values
- **typography**: Font families for body and headings
- **radius**: Border radius tokens for boxes, buttons, and badges
- **backgrounds**: Named background definitions for page sections

## Color Token Reference

| Token | Purpose | Guidelines |
|-------|---------|------------|
| `primary` | Brand color, CTAs, active states | Should match the app's domain/tone |
| `secondary` | Supporting color, secondary buttons | Deeper or complementary to primary |
| `accent` | Contrast color, highlights | Provides visual pop against primary |
| `neutral` | Text, dark backgrounds, borders | Very dark color for text readability |
| `base100` | Main page background | White/near-white for light, dark for dark themes |
| `base200` | Subtle background variation | Cards, inputs, slightly different from base100 |
| `base300` | Strongest background variation | Borders, dividers, strongest contrast |
| `info` | Informational messages | Typically blue |
| `success` | Success states | Typically green |
| `warning` | Warning states | Typically yellow/amber |
| `error` | Error states | Typically red |

## Example

```json
{
  "version": 1,
  "theme": {
    "name": "edu-platform",
    "colorScheme": "light",
    "colors": {
      "primary": "#2563eb",
      "secondary": "#1e40af",
      "accent": "#f59e0b",
      "neutral": "#1e293b",
      "base100": "#ffffff",
      "base200": "#f8fafc",
      "base300": "#e2e8f0",
      "info": "#3b82f6",
      "success": "#22c55e",
      "warning": "#eab308",
      "error": "#ef4444"
    },
    "typography": {
      "fontFamily": "Inter, sans-serif",
      "headingFont": "Poppins, sans-serif"
    },
    "radius": {
      "box": "0.5rem",
      "button": "0.375rem",
      "badge": "1rem"
    },
    "backgrounds": {
      "hero": {
        "type": "gradient",
        "gradient": "linear-gradient(135deg, #2563eb, #1e40af)"
      },
      "page": {
        "type": "solid",
        "color": "#ffffff"
      },
      "card": {
        "type": "solid",
        "color": "#f8fafc"
      }
    }
  }
}
```

## Design Rules

- Colors must be valid hex codes (`#RRGGBB`)
- Choose colors that match the app's domain and tone
- Ensure sufficient contrast between text and backgrounds
- `primary` should be the brand color, `accent` provides contrast
- `base100` is the main background, `base200`/`base300` are subtle variations
- For dark themes: `base100` should be dark, `base300` darkest
- Use real Google Fonts or system font stacks for typography
- Background gradients should use the primary/secondary colors
- Keep radius values reasonable (0.25rem to 1.5rem)

## Domain Color Suggestions

- **Education**: Blues and greens (trust, growth)
- **E-commerce**: Bold primaries with warm accents
- **Healthcare**: Clean blues, soft greens
- **Finance**: Dark blues, professional grays
- **Social**: Vibrant, energetic colors
- **Productivity**: Minimal, high-contrast

---

**User Description**: {{USER_DESCRIPTION}}

---

## Response Format

You MUST respond with ONLY a valid JSON object:

```json
{
  "version": 1,
  "theme": {
    "name": "theme-name",
    "colorScheme": "light",
    "colors": { ... },
    "typography": { ... },
    "radius": { ... },
    "backgrounds": { ... }
  }
}
```

**CRITICAL REQUIREMENTS**:
1. Return ONLY the JSON object - no markdown code blocks, no explanations
2. Must include `"version": 1`
3. Must include `"theme"` with `name`, `colorScheme`, and `colors`
4. All color values must be valid `#RRGGBB` hex codes
5. Theme `name` must be lowercase with hyphens only

**Common Mistakes to AVOID**:
- Wrapping response in markdown ```json...``` blocks
- Using color names instead of hex values (use `"#22c55e"` not `"green"`)
- Using RGB/HSL format instead of hex
- Insufficient contrast between base100 and text colors
- Missing required color tokens
