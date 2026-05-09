// ═══════════════════════════════════════════════════════════════════════════
// kdm.ts
// OMG Knowledge Discovery Metamodel (KDM) v1.4 (formal/16-09-01)
// Also published as ISO/IEC 19506:2012
//
// Scope: Pure KDM 1.4 metaclasses covering the full KDM specification —
// the conceptual entities defined by the OMG Architecture-Driven
// Modernization (ADM) Knowledge Discovery Metamodel:
//
//   • KDM Infrastructure Layer (Core, kdm)
//   • KDM Program Elements Layer (Source, Code, Action)
//   • KDM Resource Layer (Platform, UI, Event, Data)
//   • KDM Abstractions Layer (Conceptual, Build, Structure)
//
// Metaclass count: TODO (filled by the implementer subagents during the
// implementation wave). Initial scaffold authors only the top-banner header;
// metaclass declarations are inserted in subsequent commits.
//
// Architectural ordering:
//   KDM (this file) is PURE KDM 1.4. It imports NOTHING from any other
//   @amlhubs metamodel. Downstream consumers extend the interfaces and
//   base classes exported from this file through standard TypeScript
//   inheritance.
//
// @standard      OMG KDM 1.4 — formal/16-09-01
// @iso           ISO/IEC 19506:2012
// @specification https://www.omg.org/spec/KDM/1.4/
// @authority     Object Management Group (https://www.omg.org/)
// ═══════════════════════════════════════════════════════════════════════════
