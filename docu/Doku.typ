#import "@preview/vienna-tech:1.0.0": *
#import "@preview/wordometer:0.1.4": total-words, word-count

#import "@preview/codly:1.3.0": *
#import "@preview/codly-languages:0.1.1": *

#show: codly-init.with()
#codly(languages: codly-languages)

#show "Typst": fancy-typst
#show "LaTeX": fancy-latex

// Using the configuration
#show: tuw-thesis.with(
  header-title: "Mixed Reality",
)

#maketitle(
  title: [Kuer-Abgabe],
  thesis-type: [Mixed Reality, WS 2025/26],
  authors: (
    (
      name: "Michael Kaup",
      email: "michael.kaup@student.htw-berlin.de",
      matrnr: "s0589545",
    ),
  ),
)

#pagebreak()

#outline()

#pagebreak()

#include "01_Themenvorschlag/01_Themenvorschlag.typ"

#pagebreak()

#include "02_Abschlussdokumentation/02_Abschlussdokumentation.typ"

#pagebreak()

#bibliography((
  "03_Bibliography/03_Bibliography_Code.bib",
  "03_Bibliography/03_Bibliography_Assets.bib",
  "03_Bibliography/03_Bibliography_Materials.bib"
  ), full: true)<bib>
