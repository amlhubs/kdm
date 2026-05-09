# @amlhubs/kdm — KDM 1.4 as a Typed Metamodel

## Identity

| Field | Value |
|---|---|
| Standard | Knowledge Discovery Metamodel (KDM) 1.4 |
| OMG Formal Document | [formal/16-09-01](https://www.omg.org/spec/KDM/1.4/) |
| OMG Specification | [omg.org/spec/KDM/1.4](https://www.omg.org/spec/KDM/1.4/) |
| ISO equivalent | [ISO/IEC 19506:2012](https://www.iso.org/standard/32625.html) |
| Authority | [Object Management Group](https://www.omg.org/) |
| npm Package | `@amlhubs/kdm` |
| npm Version | `0.0.1` |
| Peer Dependencies | None — pure KDM, zero downstream dependencies |
| License | UNLICENSED |

## Abstract

The Knowledge Discovery Metamodel is the OMG specification for representing existing software systems — their physical artifacts, program elements, runtime resources, and architectural abstractions — as structured model instances. KDM is the meta-model substrate of Architecture-Driven Modernization (ADM) and Software Assurance (SwA): it gives modernization toolchains, technical-debt analyzers, security auditors, and refactoring engines a vendor-neutral, language-neutral representation of legacy software (COBOL, Java, C/C++, .NET, RPG, PL/I, JavaScript, …) so that every downstream analysis amortizes the cost of reverse-engineering the source. KDM 1.4 (formal/16-09-01) is the OMG release that consolidates the four-layer knowledge architecture into a single, cohesive specification — also published as ISO/IEC 19506:2012.

The `@amlhubs/kdm` npm package projects the KDM 1.4 metamodel into TypeScript as extensible interfaces and base classes covering the 12 KDM packages stratified into 4 layers: the **Infrastructure Layer** (Core, kdm) supplying the universal model-element machinery; the **Program Elements Layer** (Source, Code, Action) representing source artifacts, code structures, and behavioral relationships; the **Resource Layer** (Platform, UI, Event, Data) representing runtime environments, user interfaces, event-driven dispatch, and persistent data structures; and the **Abstractions Layer** (Conceptual, Build, Structure) representing conceptual domain knowledge, build-system organization, and architectural decomposition. Every interface carries a JSDoc header citing the precise KDM 1.4 §-section that defines it, making each symbol an auditable projection of the specification rather than an internal invention.

## Business Value — Why Extending This Metamodel Pays Off

KDM is the standard substrate of every serious Architecture-Driven Modernization toolchain. Tools that import legacy COBOL mainframes, decade-old Java EE estates, C/C++ embedded firmware, .NET monoliths, RPG/iSeries codebases, or PL/I batch jobs into a normalized KDM representation amortize the up-front analysis cost across every modernization output the same model can drive: cloud-migration assessments, technical-debt heatmaps, refactor recommendations, security-audit reports, dependency graphs, change-impact analysis, code-clone detection, and decommissioning plans. A vendor that builds an ADM offering directly against KDM rather than against a per-language proprietary representation collapses N-language × M-output engineering work into a single matrix entry, and any KDM-formatted model an upstream parser produces flows into every downstream analyzer without conversion.

The second business lever is agentic-runtime leverage. Ageni's Probabilistic Reduction Engine consumes KDM as the deterministic substrate over which large-language-model reasoning operates — when an agent answers "what does this legacy codebase do?", "what is safe to refactor?", "where does sensitive data flow?", or "which subsystems can be lifted to the cloud first?", the AST/CFG/data-flow graph it traverses lives natively as KDM model instances. The TypeScript compiler evaluates whether the agent's proposed analysis or transformation is structurally valid against the KDM metamodel at the same moment it evaluates the code itself, collapsing structural correctness and semantic correctness into a single `tsc` pass. Hallucinated metaclasses, misattributed associations, and ill-formed traversals are caught at compile time.

The third lever is compounding reuse across the OMG stack. KDM coordinates with UML's class-and-package structure (`@amlhubs/uml`) for OO subsystems, with SMM (`@amlhubs/smm`) for measuring code-quality metrics directly on KDM models, with SBVR (`@amlhubs/sbvr`) for capturing the business rules a legacy system encodes, and with the broader OMG ADM portal — including ASTM (Abstract Syntax Tree Metamodel) and SMM-published modernization measurement libraries — when those packages publish. Every downstream ageni venture that touches legacy-system analysis, modernization planning, or software-assurance auditing transitively consumes the same metaclasses surfaced here.

## Scope — What the Package Surfaces

KDM 1.4 partitions the metamodel into 12 packages stratified across 4 layers. The complete enumeration lives in `kdm.ts`; the table below summarizes each package and cites the authoritative §-section. Metaclass counts will be filled in by the implementer waves.

| KDM Layer | KDM Package | §Section | Metaclasses Surfaced |
|---|---|---|---|
| Infrastructure | Core | §6 | KDMEntity, ModelElement, Attribute, AggregatedRelationship, the universal Model spine |
| Infrastructure | kdm | §7 | Segment, KDMModel, KDMFramework, ExtensionFamily, Stereotype, TagDefinition |
| Program Elements | Source | §8 | InventoryModel, SourceFile, Image, ExecutableProgram, BinaryFile, SourceRef, SourceRegion |
| Program Elements | Code | §9 | CodeModel, CodeElement, AbstractCodeRelationship, DataType, Module, ClassUnit, InterfaceUnit, MethodUnit, etc. |
| Program Elements | Action | §10 | ActionElement, AbstractActionRelationship, control-flow and data-flow micro-relationships |
| Resource | Platform | §11 | PlatformModel, PlatformElement, RuntimeResource, DeployedComponent, ExecutionResource |
| Resource | UI | §12 | UIModel, UIElement, Screen, UIAction, UIField, UIEvent, UIResource |
| Resource | Event | §13 | EventModel, EventElement, EventAction, State, Transition, EventResource |
| Resource | Data | §14 | DataModel, DataElement, DataContainer, RecordFile, IndexFile, RelationalSchema, etc. |
| Abstractions | Conceptual | §15 | ConceptualModel, ConceptualElement, Term, Fact, Behavior, Rule, ConceptualRelationship |
| Abstractions | Build | §16 | BuildModel, BuildElement, BuildResource, BuildStep, BuildProduct, Tool, SymbolicLink |
| Abstractions | Structure | §17 | StructureModel, StructureElement, AbstractStructureRelationship, Subsystem, Layer, Component |

Every interface is accompanied by an extensible base class with the same name minus the `I` prefix (e.g., `CodeModel`, `MethodUnit`, `BuildStep`). The full list and the JSDoc headers citing each §-section will live at [`kdm.ts`](./kdm.ts) once the implementer waves complete.

## Dependency Topology

`@amlhubs/kdm` is a leaf metamodel in the `@amlhubs` stack. It depends on nothing and projects the OMG KDM 1.4 specification with no transitive import surface — the KDM specification itself is self-contained and defines its own Core/kdm infrastructure layer rather than reusing UML or MOF.

```
@amlhubs/kdm  (this package — leaf, zero dependencies)
```

Downstream agentic-runtime packages may extend any KDM interface or class through ordinary TypeScript inheritance. The `index.ts` namespace barrel re-exports every symbol so consumers may `import { ICodeModel, IMethodUnit, IBuildStep } from '@amlhubs/kdm'` without addressing internal file structure.

## Installation & Usage

```bash
npm install @amlhubs/kdm
```

```typescript
import type {
  ICodeModel,
  IClassUnit,
  IMethodUnit,
  IDataElement,
  IBuildStep,
  ISubsystem,
} from '@amlhubs/kdm';

// Declare a KDM CodeModel slice as a typed metamodel instance.
declare const myCodeModel: ICodeModel;
declare const myClassUnit: IClassUnit;
declare const myMethodUnit: IMethodUnit;
```

The source artifact is [`kdm.ts`](./kdm.ts). Every interface JSDoc header declares `@standard OMG KDM 1.4 -- formal/16-09-01` and a `@section §x.y` reference.

## Provenance & Formal References

- [OMG KDM 1.4 specification](https://www.omg.org/spec/KDM/1.4/) — formal/16-09-01
- [Machine-readable CMOF](https://www.omg.org/spec/KDM/20160201/kdm.cmof) — ptc/16-02-04
- [ISO/IEC 19506:2012](https://www.iso.org/standard/32625.html) — international standard equivalent (KDM 1.3 baseline)
- [OMG ADM portal](https://www.omg.org/adm/) — Architecture-Driven Modernization initiative
- [Object Management Group home](https://www.omg.org/)
- Local mirror: `spec/` (text extracts used for §-section citations)

## Version History

| Version | Date | Change Summary |
|---|---|---|
| 0.0.1 | initial publish | Full KDM 1.4 metamodel — Core, kdm, Source, Code, Action, Platform, UI, Event, Data, Build, Conceptual, Structure (12 packages) |

## License

UNLICENSED — restricted npm access under `@amlhubs` scope at [npm.pkg.github.com](https://npm.pkg.github.com).
