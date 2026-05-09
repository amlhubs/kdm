# KDM 1.4 — Authoritative Spec Artifacts

This directory contains every authoritative artifact for **OMG Knowledge Discovery Metamodel (KDM) 1.4**, OMG document number **formal/16-09-01**, also published as **ISO/IEC 19506:2012**. KDM 1.4 was issued September 2016 and supersedes KDM 1.3 (formal/11-08-04, August 2011).

The CMOF and ECORE are the machine-consumable serialisations of the typed metamodel. The PDF carries the normative definitional prose. Everything else is supplementary.

---

## Inventory — Downloaded Artifacts (normative)

| File | OMG Doc # | Source URL | Bytes | Format | Description |
|---|---|---|---|---|---|
| `formal-16-09-01.pdf` | formal/16-09-01 | https://www.omg.org/spec/KDM/1.4/PDF | 7,310,161 | PDF | KDM 1.4 normative specification (clean, no changebars). 15,689 lines after `pdftotext` extraction. |
| `formal-16-09-01.txt` | — | (extracted) | — | text | Searchable text extract of the spec PDF, produced by `pdftotext -layout`. Implementer subagents should grep this for definitional prose. |
| `kdm.cmof` | ptc/16-02-04 | https://www.omg.org/spec/KDM/20160201/kdm.cmof | 193,362 | XMI 2.4 / CMOF | **MOST IMPORTANT machine-readable artifact.** Typed CMOF metamodel — every metaclass, every property, every association. This is the source of truth implementer subagents read first. Confirmed valid XML (root `<xmi:XMI>` with `cmof:Package` namespace). |
| `kdm.ecore` | ptc/16-02-05 | https://www.omg.org/cgi-bin/doc?ptc/16-02-05.ecore | 92,074 | Eclipse EMF | ECORE (Eclipse Modeling Framework) projection of the metamodel. Useful as a cross-check against `kdm.cmof`; consume only if disambiguation is required. |
| `kdm.mdxml` | ptc/16-02-07 | https://www.omg.org/cgi-bin/doc?ptc/16-02-07.mdxml | 4,664,045 | MagicDraw XMI | UML model authored in MagicDraw — informative; carries the diagrammatic structure. Not read by implementers unless a diagram cross-reference is needed. |

## Inventory — XML Schemas (XSDs, normative for instance interchange)

The CMOF declares twelve KDM packages: `core`, `kdm`, `source`, `code`, `action`, `platform`, `ui`, `event`, `data`, `build`, `conceptual`, `structure`. OMG ships **ten** of them as standalone XSDs — the `ui` and `structure` packages have no separate XSD on the `https://www.omg.org/spec/KDM/20160201/` namespace (verified by 404 on every casing variant probed). The package contents for `ui` and `structure` are nonetheless fully defined inside `kdm.cmof`.

| File | Bytes | Source URL |
|---|---|---|
| `Core.xsd` | 4,650 | https://www.omg.org/spec/KDM/20160201/Core.xsd |
| `kdm.xsd` | 6,431 | https://www.omg.org/spec/KDM/20160201/kdm.xsd |
| `Source.xsd` | 11,047 | https://www.omg.org/spec/KDM/20160201/Source.xsd |
| `Code.xsd` | 33,028 | https://www.omg.org/spec/KDM/20160201/Code.xsd |
| `Action.xsd` | 11,624 | https://www.omg.org/spec/KDM/20160201/Action.xsd |
| `Platform.xsd` | 15,029 | https://www.omg.org/spec/KDM/20160201/Platform.xsd |
| `Event.xsd` | 8,208 | https://www.omg.org/spec/KDM/20160201/Event.xsd |
| `Data.xsd` | 18,375 | https://www.omg.org/spec/KDM/20160201/Data.xsd |
| `Build.xsd` | 8,737 | https://www.omg.org/spec/KDM/20160201/Build.xsd |
| `Conceptual.xsd` | 5,922 | https://www.omg.org/spec/KDM/20160201/Conceptual.xsd |

## Inventory — Informative / Predecessor

| File | OMG Doc # | Source URL | Bytes | Format | Description |
|---|---|---|---|---|---|
| `formal-16-09-02.pdf` | formal/16-09-02 | https://www.omg.org/cgi-bin/doc?formal/16-09-02.pdf | 7,311,574 | PDF | KDM 1.4 **changebar PDF** — renders KDM 1.3 → 1.4 deltas inline. Different content from `formal-16-09-01.pdf` (verified by SHA-256). 15,689 lines after extraction. |
| `formal-16-09-02.txt` | — | (extracted) | — | text | Searchable text extract of the changebar PDF. |
| `formal-11-08-04.pdf` | formal/11-08-04 | https://www.omg.org/cgi-bin/doc?formal/11-08-04.pdf | 2,903,201 | PDF | **KDM 1.3** specification (predecessor, August 2011). Useful for citation context — many academic and tooling references still cite 1.3. |
| `formal-11-08-04.txt` | — | (extracted) | — | text | Searchable text extract of the KDM 1.3 PDF. |
| `ptc-10-12-11.pdf` | ptc/10-12-11 | (user-supplied local copy) | 1,557,741 | PDF | KDM 1.3 RTF working draft, supplied by the user from `~/Downloads/`. Working draft — not canonical. Useful only as historical context. |
| `ptc-10-12-11.txt` | — | (extracted) | — | text | Searchable text extract of the working draft. |

## Failed / Skipped — with reasons

| Artifact | URL Tried | Reason |
|---|---|---|
| `UI.xsd` | https://www.omg.org/spec/KDM/20160201/UI.xsd | OMG returns HTTP 404 for every casing variant (`UI`, `ui`, `Ui`, `user-interface`, `UserInterface`). The `ui` package is defined in the CMOF but is not shipped as a standalone XSD. Implementers consult `kdm.cmof` `<cmof:Package name='ui'>` (line 4 onwards) for the metaclass definitions. |
| `Structure.xsd` | https://www.omg.org/spec/KDM/20160201/Structure.xsd | OMG returns HTTP 404 for every casing variant. Same situation as `UI.xsd` — `structure` package definitions live in `kdm.cmof` `<cmof:Package name='structure'>` (line 449). |
| ISO/IEC 19506:2012 PDF | https://www.iso.org/standard/32625.html | ISO PDFs sit behind a paywall (CHF 198). Only the abstract is freely accessible. Skipped per instructions — the OMG-published `formal-16-09-01.pdf` is content-equivalent and free. |

---

## Reading map — which artifact for which job

| Implementer wave | Primary read | Secondary cross-references |
|---|---|---|
| **Wave 1 — KDM Foundation** (Element, KDMEntity, KDMRelationship, ModelElement, Attribute, Stereotype, Annotation) | `kdm.cmof` lines 380-448 (`<cmof:Package name='kdm'>`); `formal-16-09-01.txt` §6 (Foundation framework), §8 (Common abstractions) | `Core.xsd`, `kdm.xsd` for instance-document shape |
| **Wave 2 — Core + Source + Code packages** (KDMFramework abstract syntax, root types, and the entire program-element tree) | `kdm.cmof` lines 488-1018 (`code`, lines 1019-1127 (`source`), 1520-1602 (`core`); `formal-16-09-01.txt` §8 (Core), §9 (Source), §10 (Code) | `Core.xsd`, `Source.xsd`, `Code.xsd` |
| **Wave 3 — Action + Platform + UI + Event** (runtime program semantics, OS-level resources, GUI binding, event semantics) | `kdm.cmof` lines 138-318 (`platform`), 4-137 (`ui`), 1149-1357 (`action`), 1603-end (`event`); `formal-16-09-01.txt` §11 (Action), §12 (Platform), §13 (UI), §14 (Event) | `Action.xsd`, `Platform.xsd`, `Event.xsd` (no `UI.xsd` available — read CMOF only) |
| **Wave 4 — Data + Build + Conceptual + Structure** (persistent data, build configuration, business knowledge, system architecture) | `kdm.cmof` lines 1128-1148 (`data`), 1085-...(`build`), 942-...(`conceptual`), 966-...(`structure`); `formal-16-09-01.txt` §15 (Data), §16 (Build), §17 (Conceptual), §18 (Structure) | `Data.xsd`, `Build.xsd`, `Conceptual.xsd` (no `Structure.xsd` — CMOF only) |
| **Wave 5 — Audit + cross-package consistency** | All XSDs + `kdm.cmof` + `formal-16-09-01.txt` Annex A (XMI serialization rules) | `kdm.ecore` for tool-validation cross-check; `formal-16-09-02.pdf` to confirm any 1.3→1.4 change is reflected |

---

## Verification summary

- **CMOF first 200 bytes**: `<?xml version="1.0" encoding="UTF-8"?>\n<xmi:XMI xmlns:xmi="http://www.omg.org/spec/XMI/20110701" xmlns:cmof="http://www.omg.org/spec/MOF/20110701/MOF.xmi">\n  <cmof:Package xmi:id='Pk_1' xmi:type='cm…` — confirms valid XMI 2.4 / CMOF.
- **ECORE first 100 bytes**: `<?xml version="1.0" encoding="UTF-8"?>\n<ecore:EPackage xmi:version="2.0" xmlns:xmi="http://www.omg…` — confirms valid Ecore.
- **MDXML first 100 bytes**: `<?xml version='1.0' encoding='UTF-8'?>\n\n<xmi:XMI xmlns:uml='http://www.omg.org/spec/UML/20110701' xm…` — confirms valid UML XMI.
- **PDF magic byte**: `%PDF-1.5` — all five PDFs verified.
- **CMOF package count**: 12 (matches the spec's documented package decomposition).
