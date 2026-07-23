# Change Log

All notable changes to the `docx-markdown-editor` extension will be documented in this file.

This project follows the general structure recommended by Keep a Changelog.

## [Unreleased]

## [0.0.1] - 2026-05-02

### Added

- Open `.docx` files as Markdown.
- Sync Markdown edits back to `.docx` on save.
- Convert documents between `.md`, `.docx`, `.html`, `.pdf`, and `.epub` where supported by Pandoc.
- Create blank `.docx` files from the Explorer context menu.

### Changed

- Added Marketplace metadata, documentation cleanup, and safer file/path handling.

## [0.0.2] - 2026-05-02

### Changed

- Update icon

## [0.0.3] - 2026-05-07

### Changed

- Update README.md

## [1.0.0] - 2026-07-08

- Preview `.docx` files directly in VS Code
- Automatic preview refresh when the source `.docx` changes
- Automatic download and installation of Pandoc
- Output channel logging
- Round-trip editing with embedded image preservation (`.docx` ⇄ `.md`)
- Automatic registration of `.docx` files with the custom preview editor

### Changed

- Improved Pandoc integration
- Refactored conversion and preview pipeline
- Improved overall stability and error handling
- Reworked document conversion workflow for better reliability
- Improved HTML preview rendering

### Fixed

- Fixed image loss when converting `.docx` → `.md` → `.docx`
- Fixed image handling during document conversions
- Fixed relative resource paths for generated Markdown files
- Fixed preview updates after document changes
- Fixed temporary file cleanup

## [1.0.1] - 2026-07-23

### Fixed

- Fixed automatic download and installation of Pandoc on Linux and MacOS platforms