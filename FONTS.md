# Font System Documentation

This project uses a comprehensive font system with different typefaces for various purposes. Here's how to use each font:

## Available Fonts

### 1. **Montserrat** (`font-montserrat`)
**Purpose**: Modern geometric font for branding and primary headings
**Usage**: Logo, main brand elements, primary CTAs
**Example**: 
```tsx
<h1 className="font-montserrat font-bold text-3xl">VBPS MUN</h1>
```

### 2. **Playfair Display** (`font-playfair`)
**Purpose**: Elegant serif font for formal titles and main headings
**Usage**: Page titles, hero headings, formal announcements
**Example**:
```tsx
<h1 className="font-playfair text-5xl font-bold">Welcome Back</h1>
```

### 3. **Inter** (`font-inter`)
**Purpose**: Clean, modern sans-serif for navigation and UI elements
**Usage**: Navigation links, form labels, button text
**Example**:
```tsx
<nav className="font-inter">
  <Link href="/" className="font-medium">Home</Link>
</nav>
```

### 4. **Open Sans** (`font-open-sans`)
**Purpose**: Highly readable sans-serif for body text and descriptions
**Usage**: Paragraphs, descriptions, secondary content
**Example**:
```tsx
<p className="font-open-sans text-lg">
  Welcome to the MUN conference management portal
</p>
```

### 5. **Poppins** (`font-poppins`)
**Purpose**: Friendly, rounded sans-serif for form inputs and casual text
**Usage**: Form fields, participant information, casual content
**Example**:
```tsx
<span className="font-poppins font-medium">{participant.name}</span>
```

### 6. **Merriweather** (`font-merriweather`)
**Purpose**: Readable serif for long-form content and articles
**Usage**: Documentation, long descriptions, formal content
**Example**:
```tsx
<article className="font-merriweather prose">
  <p>This is a long article about MUN procedures...</p>
</article>
```

### 7. **Roboto Mono** (`font-roboto-mono`)
**Purpose**: Primary monospace font for code and technical content
**Usage**: Code snippets, IDs, technical data
**Example**:
```tsx
<code className="font-roboto-mono">participant-id-12345</code>
```

### 8. **Source Code Pro** (`font-source-code-pro`)
**Purpose**: Alternative monospace font for programming content
**Usage**: Code blocks, JSON data, configuration
**Example**:
```tsx
<pre className="font-source-code-pro">{JSON.stringify(data, null, 2)}</pre>
```

## Font Hierarchy & Usage Guidelines

### Page Structure
```
📄 Page
├── 🎯 Logo/Brand: font-montserrat
├── 📖 Main Title: font-playfair  
├── 🧭 Navigation: font-inter
├── 📝 Body Text: font-open-sans
├── 🎮 UI Elements: font-inter
├── 📋 Forms: font-poppins
└── 💻 Code/IDs: font-roboto-mono
```

### Component Examples

#### Hero Section
```tsx
<section>
  <h1 className="font-playfair text-6xl font-bold">
    Model United Nations 2025
  </h1>
  <p className="font-open-sans text-xl">
    Welcome to the conference portal
  </p>
  <button className="font-inter font-medium">
    Register Now
  </button>
</section>
```

#### Navigation
```tsx
<nav className="font-montserrat">
  <span className="font-bold">VBPS MUN</span>
  <ul className="font-inter">
    <li><Link href="/">Home</Link></li>
    <li><Link href="/participants">Participants</Link></li>
  </ul>
</nav>
```

#### Form
```tsx
<form className="space-y-4">
  <label className="font-inter font-medium">Name</label>
  <input className="font-poppins" placeholder="Enter your name" />
  <span className="font-roboto-mono text-sm">ID: #12345</span>
</form>
```

## Best Practices

1. **Consistency**: Use the same font for similar elements across the app
2. **Hierarchy**: Use Playfair for main titles, Inter for navigation, Open Sans for body
3. **Readability**: Ensure sufficient contrast and size for all fonts
4. **Performance**: Fonts are optimized with `display: 'swap'` for better loading
5. **Fallbacks**: All fonts have appropriate fallbacks defined

## Technical Implementation

All fonts are:
- Loaded via Google Fonts with Next.js optimization
- Configured with CSS variables for easy switching
- Include proper fallbacks for better performance
- Use `display: 'swap'` for better loading experience

To add a new font:
1. Import it in `src/lib/font.ts`
2. Add the variable to `layout.tsx`
3. Add the utility class to `tailwind.config.js`
4. Add the CSS class to `globals.css`
