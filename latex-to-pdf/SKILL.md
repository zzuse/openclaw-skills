---
name: latex-to-pdf
description: Convert LaTeX (.tex) files to PDF (.pdf) and upload them to Filebin for sharing. Use this when the user provides a LaTeX source and wants a PDF or a download link.
---

# LaTeX to PDF with Archive Policy & Preprocessing

This skill automates the process of saving LaTeX sources with a specific naming convention (`resume_{company}_{position}`), preprocessing them (e.g., removing extra spacing), compiling them, and archiving both the source and output with a timestamp.

## Quick Start

1. **Save the LaTeX source** as `resume_{company}_{position}.tex`.
2. **Preprocess the source** using `scripts/preprocess.py` (e.g., removes empty lines after `\vspace`).
3. **Compile to PDF** using `scripts/compile.sh resume_{company}_{position}.tex`.
4. **Archive both files** using `scripts/archive.sh resume_{company}_{position}`.
5. **Upload to Filebin** using `scripts/upload.sh archive/resume_{company}_{position}_{timestamp}.pdf`.
6. **Share the link** with the user.

## Workflow

### 1. Preprocessing
Before compiling, run the preprocessor to ensure alignment and spacing (it removes empty lines after `\vspace{...}`).
```bash
python3 ./skills/latex-to-pdf/scripts/preprocess.py my_document.tex
```

### 2. Compilation
Use the bundled `compile.sh` script.

```bash
./skills/latex-to-pdf/scripts/compile.sh my_document.tex
```

### 3. Archiving & Renaming
Use the bundled `archive.sh` script to move both the `.tex` and `.pdf` to the `archive/` directory with a timestamp.

```bash
./skills/latex-to-pdf/scripts/archive.sh my_document
```

### 4. Uploading
Use the bundled `upload.sh` script to get a Filebin link for the archived PDF.

```bash
./skills/latex-to-pdf/scripts/upload.sh archive/my_document_20260318_120000.pdf
```

## Troubleshooting
- **Alignment Issues**: Ensure `preprocess.py` is run to remove extra paragraph breaks after `\vspace`.
- **Missing Packages**: Tectonic downloads packages on the fly.
