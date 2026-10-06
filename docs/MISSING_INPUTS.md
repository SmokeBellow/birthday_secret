# Inputs not included in this handoff

The package is sufficient to recreate the full playable game structure and visuals, with two deliberate exceptions.

## 1. Boeing 737 simulator certificate PDF — required for the real gift reveal
The original working Replit project retained this document at:

`artifacts/build-30-game/public/assets/flight-simulator-certificate.pdf`

The V2 runtime linked the semantic certificate key to that PDF and the final QA confirmed it returned HTTP 200.

The actual PDF bytes are NOT present in this handoff package.

Before final release, copy the original certificate PDF into the recreated project at:

`public/assets/flight-simulator-certificate.pdf`

Do not invent certificate personal details or replace it with a made-up certificate.

If the PDF is unavailable during development, keep the certificate reveal screen functional but clearly mark the document as a required external file.

## 2. Level 18 Player 2 answers
They remain intentionally unknown.
See:

`source_of_truth/LEVEL18_PLAYER2_ANSWERS_TEMPLATE.json`

Do not guess them.
