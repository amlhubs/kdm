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

// ═══════════════════════════════════════════════════════════════════════════
// BEGIN Implementer #1: KDM Foundation (kdm package, §9 + §10)
//
// Scope: KDM Foundation framework = core package (Element / AnnotatableElement
// / AnnotationElement / ExtendableElement / ExtensionElement / ModelElement
// / KDMEntity / KDMRelationship / AggregatedRelationship — §9) + kdm package
// (FrameworkElement / KDMModel / Segment / Audit / Attribute / Annotation /
// Stereotype / ExtensionFamily / TagDefinition / ExtendedValue / TaggedValue
// / TaggedRef — §10).
//
// Cross-package forward references: Source / Track endpoints (§11) are typed
// as `unknown` placeholders and will be tightened by Wave 2 once the Source
// package is published.
// ═══════════════════════════════════════════════════════════════════════════

// ─── Forward references (cross-package — defined in later waves) ───
// FORWARD: SourceRef defined by Wave 2 (Source package, §11.4 SourceRef Class).
type ISourceRef = unknown;
// FORWARD: ActionElement defined by Wave 3 (Action package, §14 Action.ActionElement).
// (Used by ModelElement via reflection only — no member of the foundation
// surface references it directly.)

// ─── 1. Element (§9.3.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §9.3.1
 * @metaclass Element (abstract)
 * @generalization (root)
 * @definition An Element is an atomic constituent of a model. The Element class
 *   is the top meta-element in the KDM class hierarchy. Element is an abstract
 *   meta-model element. Element is the common parent from all meta-model
 *   elements of KDM.
 * @ownedAttributes
 *   (none declared in §9.3.1 — Element introduces no attributes; it is the
 *    pure root marker of the KDM hierarchy)
 * @associationEnds (none)
 * @operations (none)
 * @constraints (none declared in §9.3.1)
 */
export interface IElement {
  // pure marker interface — Element is the abstract root of every KDM
  // metaclass. Concrete subclasses contribute structure further down.
}

export abstract class Element implements IElement {
  abstract readonly metaClass: string;
}

// ─── 2. AnnotatableElement (§9.3.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §9.3.2
 * @metaclass AnnotatableElement (abstract)
 * @generalization Element
 * @definition Some elements of KDM can be annotated with AnnotationElements.
 *   Annotations supply additional information to a particular KDM element. The
 *   particular annotations are represented as subclasses of AnnotationElement
 *   and are described in the package named "kdm." The AnnotatableElement is
 *   one of the abstract top meta-elements in the KDM class hierarchy. Its
 *   purpose is to represent KDM elements that can be annotated and to
 *   distinguish them from the AnnotationElement. The key subclass of
 *   AnnotatableElement is ExtendableElement.
 * @ownedAttributes
 *   • annotation : Annotation [0..*] (composite) -- §10.7.3 (AnnotatableElement
 *     additional properties): the set of annotations owned by the given element.
 *   • attribute  : Attribute  [0..*] (composite) -- §10.7.3 (AnnotatableElement
 *     additional properties): the set of attributes owned by the given element.
 * @associationEnds
 *   • ElementAnnotation -- A_836 -- annotation end
 *   • ElementAttribute  -- A_841 -- attribute end
 * @operations (none declared on AnnotatableElement)
 * @constraints
 *   No assumptions should be made regarding the order of attributes or
 *   annotations associated with a particular instance. (§10.7.3)
 */
export interface IAnnotatableElement extends IElement {
  readonly annotation: ReadonlyArray<IAnnotation>;
  readonly attribute: ReadonlyArray<IAttribute>;
}

export abstract class AnnotatableElement extends Element implements IAnnotatableElement {
  readonly annotation: ReadonlyArray<IAnnotation> = [];
  readonly attribute: ReadonlyArray<IAttribute> = [];
}

// ─── 3. AnnotationElement (§9.3.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §9.3.3
 * @metaclass AnnotationElement (abstract)
 * @generalization Element
 * @definition AnnotationElement represents various annotations to
 *   AnnotatableElements. The AnnotationElement class is one of the abstract
 *   top meta-elements in the KDM class hierarchy. Its purpose is to represent
 *   utility KDM elements that describe annotations to other KDM elements, and
 *   that themselves can not be annotated. The concrete subclasses to
 *   AnnotationElement are provided in the package named "kdm."
 * @ownedAttributes (none introduced at this level)
 * @associationEnds (none introduced at this level)
 * @operations (none)
 * @constraints (none declared in §9.3.3)
 */
export interface IAnnotationElement extends IElement {
  // structural marker — concrete subclasses (Attribute, Annotation) carry
  // their own attribute/owner members.
}

export abstract class AnnotationElement extends Element implements IAnnotationElement {}

// ─── 4. ExtendableElement (§9.3.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §9.3.4
 * @metaclass ExtendableElement (abstract)
 * @generalization AnnotatableElement
 * @definition Some KDM elements can be extended through the light-weight
 *   extension mechanism. Extensions introduce new "extended" meta-model
 *   classes that represent specialized subsets within the extent of their base
 *   KDM element. Extended elements can have new properties. Extensions are
 *   represented by the subclasses of the ExtensionElement class, and are
 *   described in the package named "kdm." The ExtendableElement is one of the
 *   abstract top meta-elements in the KDM class hierarchy. Its purpose is to
 *   represent the KDM elements that can be extended and to distinguish them
 *   from the ExtensionElement. The key subclass of ExtendableElement is
 *   ModelElement.
 * @ownedAttributes
 *   • stereotype  : Stereotype  [0..*] -- §10.5.4: the stereotype set
 *     branding this ExtendableElement.
 *   • taggedValue : ExtendedValue [0..*] (composite) -- §10.5.4: the set of
 *     tagged values determined by the stereotype.
 * @associationEnds
 *   • Extension      -- A_811 -- stereotype end (non-composite)
 *   • ExtendedValues -- A_833 -- taggedValue end (composite)
 * @operations (none)
 * @constraints
 *   1. Each tagged value added to an ExtendableElement must conform to a
 *      certain tag definition owned by the stereotype of that
 *      ExtendableElement. (§10.5.4)
 *   2. Stereotype can be associated with a certain instance of an
 *      ExtendableElement if the type of the ExtendableElement is the same as
 *      the type property in the stereotype definition, or one of its
 *      subclasses. (§10.5.4)
 */
export interface IExtendableElement extends IAnnotatableElement {
  readonly stereotype: ReadonlyArray<IStereotype>;
  readonly taggedValue: ReadonlyArray<IExtendedValue>;
}

export abstract class ExtendableElement extends AnnotatableElement implements IExtendableElement {
  readonly stereotype: ReadonlyArray<IStereotype> = [];
  readonly taggedValue: ReadonlyArray<IExtendedValue> = [];
}

// ─── 5. ExtensionElement (§9.3.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §9.3.5
 * @metaclass ExtensionElement (abstract)
 * @generalization AnnotatableElement
 * @definition ExtensionElement represents various elements that provide the
 *   light-weight extension mechanism of KDM. ExtensionElement is one of the
 *   abstract top meta-elements in the KDM class hierarchy. Its purpose is to
 *   represent the elements that are part of the light-weight extension
 *   mechanism and that themselves cannot be extended (but can be annotated
 *   using the AnnotationElement). The concrete subclasses of ExtensionElement
 *   are described in the package named "kdm."
 * @ownedAttributes (none introduced at this level)
 * @associationEnds (none introduced at this level)
 * @operations (none)
 * @constraints (none declared in §9.3.5)
 */
export interface IExtensionElement extends IAnnotatableElement {
  // structural marker — concrete subclasses (Stereotype, ExtensionFamily,
  // TagDefinition, ExtendedValue) carry their own members.
}

export abstract class ExtensionElement extends AnnotatableElement implements IExtensionElement {}

// ─── 6. ModelElement (§9.3.6) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §9.3.6
 * @metaclass ModelElement (abstract)
 * @generalization ExtendableElement
 * @definition A ModelElement is an element that represents some aspect of the
 *   existing system. The ModelElement is one of the abstract top meta-model
 *   elements in the KDM class hierarchy. The key subclasses of ModelElement
 *   are KDMEntity and KDMRelationship. Most of the meta-model elements in KDM
 *   are subclasses of either KDMEntity or KDMRelationship. Another important
 *   subclass of ModelElement is FrameworkElement defined in the package named
 *   "kdm." A ModelElement can be extended through the lightweight extension
 *   mechanism.
 * @ownedAttributes
 *   • audit : Audit [0..*] (composite) -- §10.4.2 (ModelElement additional
 *     properties): the list of Audit element instances for the given instance
 *     of ModelElement, including Segment or Model.
 * @associationEnds
 *   • Audits -- A_828 -- audit end (composite)
 * @operations (none)
 * @constraints (none declared in §9.3.6)
 */
export interface IModelElement extends IExtendableElement {
  readonly audit: ReadonlyArray<IAudit>;
}

export abstract class ModelElement extends ExtendableElement implements IModelElement {
  readonly audit: ReadonlyArray<IAudit> = [];
}

// ─── 7. KDMEntity (§9.4.1 + §9.5.2 + §10.3.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §9.4.1, §9.5.2, §10.3.3
 * @metaclass KDMEntity (abstract)
 * @generalization ModelElement
 * @definition A KDMEntity is a named model element that represents an artifact
 *   of existing software systems. In the meta-model, KDMEntity is a subclass
 *   of ModelElement. Each KDM package defines specific KDM entities that are
 *   direct or indirect subclasses of KDMEntity. A KDMEntity can be an atomic
 *   element, a container for some KDMEntities, and/or a group of some
 *   KDMEntities. Container and group introduce built-in relationships between
 *   entities and are used to represent hierarchies of entities. A KDMEntity
 *   can be owned by at most one container, and can be associated with zero or
 *   many groups.
 * @ownedAttributes
 *   • name : String -- An identifier for the KDM entity. (§9.4.1)
 *   • / owner          : KDMEntity     [0..1] (derived union) -- container
 *   • / ownedElement   : KDMEntity     [0..*] (derived union, composite)
 *   • / group          : KDMEntity     [0..*] (derived union)
 *   • / groupedElement : KDMEntity     [0..*] (derived union)
 *   • / ownedRelation  : KDMRelationship [0..*] (derived union, composite) -- §9.5.2
 *   • / inbound        : KDMRelationship [0..*] (derived union) -- §9.5.2
 *   • / outbound       : KDMRelationship [0..*] (derived union) -- §9.5.2
 *   • / model          : KDMModel      [0..1] (derived) -- §10.3.3
 *   • aggregatedRelation : AggregatedRelationship [0..*] (composite) -- A_825
 *   • source : SourceRef [0..*] (composite) -- §11 (forward-ref)
 *   • track  : SourceRef [0..*] (composite) -- §11 (forward-ref)
 * @associationEnds
 *   • A_KDMEntity_ownedElement   -- A_16
 *   • A_KDMEntity_groupedElement -- A_11
 *   • A_KDMEntity_ownedRelation  -- A_5
 *   • A_KDMModel_ownedElement    -- A_24
 *   • AggregaredRelations        -- A_825
 *   • Source                     -- A_845 (forward-ref)
 *   • Track                      -- A_848 (forward-ref)
 * @operations
 *   getOwner()          : KDMEntity[0..1]
 *   getOwnedElement()   : KDMEntity[0..*]
 *   getGroup()          : KDMEntity[0..*]
 *   getGroupedElement() : KDMEntity[0..*]
 *   getInbound()        : KDMRelationship[0..*]
 *   getOutbound()       : KDMRelationship[0..*]
 *   getOwnedRelation()  : KDMRelationship[0..*]
 *   getModel()          : KDMModel[0..1]
 *   createAggregation(otherEntity : KDMEntity) -- abstract per A_825
 *   deleteAggregation(aggregation : AggregatedRelationship)
 * @constraints
 *   1. KDMEntity should not reference self as groupedElement. (§9.4.1)
 *   2. The set of ownedRelations for a given KDMEntity should be the same as
 *      the set of KDMRelations for which the from-property is the given
 *      KDMEntity. (§9.5.2)
 */
export interface IKDMEntity extends IModelElement {
  readonly name: string;
  readonly aggregatedRelation: ReadonlyArray<IAggregatedRelationship>;
  readonly source: ReadonlyArray<ISourceRef>;
  readonly track: ReadonlyArray<ISourceRef>;
  // -- derived navigation operations (§9.4.1 + §9.5.2 + §10.3.3) --
  getOwner(): IKDMEntity | undefined;
  getOwnedElement(): ReadonlyArray<IKDMEntity>;
  getGroup(): ReadonlyArray<IKDMEntity>;
  getGroupedElement(): ReadonlyArray<IKDMEntity>;
  getInbound(): ReadonlyArray<IKDMRelationship>;
  getOutbound(): ReadonlyArray<IKDMRelationship>;
  getOwnedRelation(): ReadonlyArray<IKDMRelationship>;
  getModel(): IKDMModel | undefined;
  createAggregation(otherEntity: IKDMEntity): IAggregatedRelationship;
  deleteAggregation(aggregation: IAggregatedRelationship): void;
}

export abstract class KDMEntity extends ModelElement implements IKDMEntity {
  readonly name: string = "";
  readonly aggregatedRelation: ReadonlyArray<IAggregatedRelationship> = [];
  readonly source: ReadonlyArray<ISourceRef> = [];
  readonly track: ReadonlyArray<ISourceRef> = [];
  abstract getOwner(): IKDMEntity | undefined;
  abstract getOwnedElement(): ReadonlyArray<IKDMEntity>;
  abstract getGroup(): ReadonlyArray<IKDMEntity>;
  abstract getGroupedElement(): ReadonlyArray<IKDMEntity>;
  abstract getInbound(): ReadonlyArray<IKDMRelationship>;
  abstract getOutbound(): ReadonlyArray<IKDMRelationship>;
  abstract getOwnedRelation(): ReadonlyArray<IKDMRelationship>;
  abstract getModel(): IKDMModel | undefined;
  abstract createAggregation(otherEntity: IKDMEntity): IAggregatedRelationship;
  abstract deleteAggregation(aggregation: IAggregatedRelationship): void;
}

// ─── 8. KDMRelationship (§9.5.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §9.5.1
 * @metaclass KDMRelationship (abstract)
 * @generalization ModelElement
 * @definition A KDMRelationship is a model element that represents semantic
 *   association between two entities. In the meta-model, KDMRelationship is a
 *   subclass of ModelElement. Each KDM package defines some specific KDM
 *   relations that are either direct or indirect subclasses of
 *   KDMRelationship. Specific subclasses of KDMRelationship are typed
 *   associations between some specific subclasses of KDMEntity.
 * @ownedAttributes
 *   • / to   : KDMEntity[1] -- target endpoint, redefined by every concrete
 *     subclass to a specific subtype of KDMEntity.
 *   • / from : KDMEntity[1] -- origin endpoint, redefined by every concrete
 *     subclass to a specific subtype of KDMEntity.
 * @associationEnds
 *   • A_kdmRelationship_to   -- A_32
 *   • A_kdmRelationship_from -- A_33
 * @operations
 *   getTo()   : KDMEntity[1] -- This operation returns the KDM entity that is
 *     the to-endpoint (the target) of the current relationship.
 *   getFrom() : KDMEntity[1] -- This operation returns the KDM entity that is
 *     the from-endpoint (the origin) of the current relationship.
 * @constraints
 *   Each instance of KDMRelationship has exactly one target and exactly one
 *   origin. Each concrete subclass of KDMRelationship defines the acceptable
 *   types of its endpoints. (§9.5.1)
 */
export interface IKDMRelationship extends IModelElement {
  readonly to: IKDMEntity;
  readonly from: IKDMEntity;
  getTo(): IKDMEntity;
  getFrom(): IKDMEntity;
}

export abstract class KDMRelationship extends ModelElement implements IKDMRelationship {
  abstract readonly to: IKDMEntity;
  abstract readonly from: IKDMEntity;
  getTo(): IKDMEntity { return this.to; }
  getFrom(): IKDMEntity { return this.from; }
}

// ─── 9. AggregatedRelationship (§9.6.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §9.6.1
 * @metaclass AggregatedRelationship (concrete)
 * @generalization ModelElement
 * @definition The set of AggregatedRelationship elements for a given entity
 *   represents all explicit relationships between the entities that are
 *   transitively owned by the given entity as well as the entity itself. One
 *   AggregatedRelationship represents collection of individual KDMRelationship
 *   elements (and can be referred to as their aggregate). The aggregation
 *   rules are defined in the semantics section. AggregatedRelationship is a
 *   concrete class, because an AggregatedRelationship can be instantiated, and
 *   exchanged. AggregatedRelations are meant to be built on demand (and
 *   exchanged too, if necessary). KDMEntity class includes operations for
 *   managing the lifecycle of owned AggregatedRelationship elements.
 * @ownedAttributes
 *   • / density : Integer -- The number of explicit relationships in the
 *     aggregated set. This property is derived. (§9.6.1)
 *   • relation  : KDMRelationship [0..*] -- The set of explicit KDM
 *     relationships represented by the aggregated relationship.
 *   • to        : KDMEntity[1] -- aggregation to-endpoint.
 *   • from      : KDMEntity[1] -- aggregation from-endpoint.
 * @associationEnds
 *   • Origin       -- A_814 -- from end
 *   • Destination  -- A_818 -- to end
 *   • RelationSet  -- A_821 -- relation end
 * @operations (none beyond accessors)
 * @constraints
 *   1. To- and from-endpoints should be distinct. (§9.6.1)
 *   2. The density should be greater than or equal to 1. (§9.6.1)
 *   3. The density should be equal to the number of explicit relationships
 *      represented by the given aggregated relationship. (§9.6.1)
 */
export interface IAggregatedRelationship extends IModelElement {
  readonly density: number;
  readonly relation: ReadonlyArray<IKDMRelationship>;
  readonly to: IKDMEntity;
  readonly from: IKDMEntity;
}

export class AggregatedRelationship extends ModelElement implements IAggregatedRelationship {
  readonly metaClass = "AggregatedRelationship" as const;
  readonly density: number;
  readonly relation: ReadonlyArray<IKDMRelationship>;
  readonly to: IKDMEntity;
  readonly from: IKDMEntity;
  constructor(args: {
    from: IKDMEntity;
    to: IKDMEntity;
    relation?: ReadonlyArray<IKDMRelationship>;
    density?: number;
  }) {
    super();
    this.from = args.from;
    this.to = args.to;
    this.relation = args.relation ?? [];
    // derived: per §9.6.1 constraint 3, density equals |relation| at minimum 1.
    this.density = args.density ?? Math.max(1, this.relation.length);
  }
}

// ─── 10. FrameworkElement (§10.3.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §10.3.1
 * @metaclass FrameworkElement (abstract)
 * @generalization ModelElement
 * @definition The FrameworkElement meta-model element is an abstract class
 *   that describes the common properties of all KDM Framework elements.
 *   FrameworkElement class is extended by Segment and KDMModel classes. These
 *   elements may own KDM light-weight extensions (extensionFamily property).
 *   The KDM extension mechanism is described further in this clause.
 * @ownedAttributes
 *   • name            : String                  -- §10.3.1: the name of the
 *     framework element.
 *   • extensionFamily : ExtensionFamily [0..*] (composite) -- §10.3.1:
 *     extensions for the current model segment.
 * @associationEnds
 *   • Extensions -- A_238 -- extensionFamily end (composite)
 * @operations (none)
 * @constraints (none declared in §10.3.1)
 */
export interface IFrameworkElement extends IModelElement {
  readonly name: string;
  readonly extensionFamily: ReadonlyArray<IExtensionFamily>;
}

export abstract class FrameworkElement extends ModelElement implements IFrameworkElement {
  readonly name: string = "";
  readonly extensionFamily: ReadonlyArray<IExtensionFamily> = [];
}

// ─── 11. KDMModel (§10.3.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §10.3.2
 * @metaclass KDMModel (abstract)
 * @generalization FrameworkElement
 * @definition A KDMModel is an abstract class that defines common properties
 *   of KDM model instances that are collections of facts about a given
 *   software system from the same architectural viewpoint of one of the KDM
 *   domains. KDM defines several concrete subclasses of the KDMModel class,
 *   each of which defines a particular kind of a KDM model. The architectural
 *   viewpoint is defined by the corresponding KDM package. A KDM model
 *   instance is an architectural view of the given system. From the
 *   meta-model perspective, KDMModel extends the Element class. Each concrete
 *   KDM model follows the so-called Framework Extension meta-model pattern.
 * @ownedAttributes
 *   • / ownedElement : KDMEntity [0..*] (derived union, composite) --
 *     §10.3.2: instances of KDM entities owned by the model.
 * @associationEnds
 *   • A_KDMModel_ownedElement -- A_24 (composite, derived union)
 * @operations
 *   getOwnedElement() : KDMEntity[0..*] -- This operation returns the set of
 *     KDM entities that are owned by the current KDM Model.
 * @constraints (none declared in §10.3.2)
 */
export interface IKDMModel extends IFrameworkElement {
  getOwnedElement(): ReadonlyArray<IKDMEntity>;
}

export abstract class KDMModel extends FrameworkElement implements IKDMModel {
  abstract getOwnedElement(): ReadonlyArray<IKDMEntity>;
}

// ─── 12. Segment (§10.3.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §10.3.4
 * @metaclass Segment (concrete)
 * @generalization FrameworkElement
 * @definition The Segment element is a container for a meaningful set of
 *   facts about an existing software system. Each segment may include one or
 *   more KDM model instances and thus represents a collection of one or more
 *   architectural views for a given software system. Segment is a unit of
 *   exchange between the tools of the KDM ecosystem. Segment without owners
 *   is the top segment of the KDM model.
 * @ownedAttributes
 *   • segment : Segment [0..*] (composite) -- §10.3.4: nested Segment
 *     elements owned by the current Segment.
 *   • model   : KDMModel [0..*] (composite) -- §10.3.4: the set of KDM models
 *     owned by the current segment.
 * @associationEnds
 *   • Segments -- A_243 -- segment end (composite)
 *   • Models   -- A_247 -- model end (composite)
 * @operations (none)
 * @constraints (none declared in §10.3.4)
 */
export interface ISegment extends IFrameworkElement {
  readonly segment: ReadonlyArray<ISegment>;
  readonly model: ReadonlyArray<IKDMModel>;
}

export class Segment extends FrameworkElement implements ISegment {
  readonly metaClass = "Segment" as const;
  readonly segment: ReadonlyArray<ISegment>;
  readonly model: ReadonlyArray<IKDMModel>;
  constructor(args?: {
    name?: string;
    segment?: ReadonlyArray<ISegment>;
    model?: ReadonlyArray<IKDMModel>;
  }) {
    super();
    if (args?.name !== undefined) {
      // override the readonly default through Object.defineProperty since the
      // base class declares a readonly default — we're constructing a fresh
      // instance, not reassigning.
      Object.defineProperty(this, "name", { value: args.name, writable: false, enumerable: true });
    }
    this.segment = args?.segment ?? [];
    this.model = args?.model ?? [];
  }
}

// ─── 13. Audit (§10.4.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §10.4.1
 * @metaclass Audit (concrete)
 * @generalization ExtendableElement
 * @definition Audit class represents basic audit information associated with
 *   KDM model elements. The Audit element allows associating provenance,
 *   argument as well as other metadata with arbitrary KDM model elements.
 * @ownedAttributes
 *   • description : String -- Contains the description related to the Audit
 *     of the element (the Audit message). (§10.4.1)
 *   • author      : String -- Contains the name of the person who has created
 *     the model element, or the name of the tool that was used to create the
 *     model element. (§10.4.1)
 *   • date        : String -- Contains the date when the model element was
 *     created. (§10.4.1)
 *   • owner       : ModelElement[1] -- The owner of the current Audit
 *     element. (§10.4.1)
 * @associationEnds
 *   • Audits -- A_828 -- owner end
 * @operations (none)
 * @constraints
 *   1. date should be represented in "dd-mm-yyyy" format. (§10.4.1)
 */
export interface IAudit extends IExtendableElement {
  readonly description: string;
  readonly author: string;
  readonly date: string;
  readonly owner: IModelElement;
}

export class Audit extends ExtendableElement implements IAudit {
  readonly metaClass = "Audit" as const;
  readonly description: string;
  readonly author: string;
  readonly date: string;
  readonly owner: IModelElement;
  constructor(args: {
    owner: IModelElement;
    description?: string;
    author?: string;
    date?: string;
  }) {
    super();
    this.owner = args.owner;
    this.description = args.description ?? "";
    this.author = args.author ?? "";
    this.date = args.date ?? "";
  }
}

// ─── 14. Attribute (§10.7.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §10.7.1
 * @metaclass Attribute (concrete)
 * @generalization AnnotationElement
 * @definition An attribute allows information to be attached to any model
 *   element in the form of a "tagged value" pair (i.e., name=value). Attribute
 *   add information to the instances of model elements, as opposed to
 *   stereotypes and tagged values, which apply to meta-model elements. Tagged
 *   value is part of the extension mechanism (stereotypes define extended new
 *   model element, and tagged values specify additional attributes of these
 *   extended model elements). Tagged values are only associated with model
 *   elements branded by a stereotype, and the set of tagged values for a
 *   particular instance of a model element is determined by its stereotype.
 *   On the other hand, arbitrary attributes may be associated with individual
 *   instances of model element.
 * @ownedAttributes
 *   • tag   : String -- Contains the name of the attribute. (§10.7.1)
 *   • value : String -- Contains the current value of the attribute. (§10.7.1)
 *   • owner : Element[1] -- The AnnotatableElement that owns the current
 *     Attribute. (§10.7.1)
 * @associationEnds
 *   • ElementAttribute -- A_841 -- owner end
 * @operations (none)
 * @constraints
 *   1. Attribute cannot have further annotations or attributes. (§10.7.1)
 */
export interface IAttribute extends IAnnotationElement {
  readonly tag: string;
  readonly value: string;
  readonly owner: IAnnotatableElement;
}

export class Attribute extends AnnotationElement implements IAttribute {
  readonly metaClass = "Attribute" as const;
  readonly tag: string;
  readonly value: string;
  readonly owner: IAnnotatableElement;
  constructor(args: { owner: IAnnotatableElement; tag: string; value: string }) {
    super();
    this.owner = args.owner;
    this.tag = args.tag;
    this.value = args.value;
  }
}

// ─── 15. Annotation (§10.7.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §10.7.2
 * @metaclass Annotation (concrete)
 * @generalization AnnotationElement
 * @definition Annotations allow textual descriptions to be attached to any
 *   instance of a model element. Annotation allows associating a
 *   human-readable text with an instance of any Element.
 * @ownedAttributes
 *   • text  : String -- Contains the text of the annotation to the target
 *     model element. (§10.7.2)
 *   • owner : Element[1] -- The AnnotatableElement that owns the current
 *     Annotation. (§10.7.2)
 * @associationEnds
 *   • ElementAnnotation -- A_836 -- owner end
 * @operations (none)
 * @constraints
 *   1. Annotation cannot have further annotations or attributes. (§10.7.2)
 */
export interface IAnnotation extends IAnnotationElement {
  readonly text: string;
  readonly owner: IAnnotatableElement;
}

export class Annotation extends AnnotationElement implements IAnnotation {
  readonly metaClass = "Annotation" as const;
  readonly text: string;
  readonly owner: IAnnotatableElement;
  constructor(args: { owner: IAnnotatableElement; text: string }) {
    super();
    this.owner = args.owner;
    this.text = args.text;
  }
}

// ─── 16. Stereotype (§10.5.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §10.5.1
 * @metaclass Stereotype (concrete)
 * @generalization ExtensionElement
 * @definition The stereotype concept provides a way of branding (classifying)
 *   certain elements so that they behave as if they were the instances of new
 *   extended meta-model constructs. These elements have the same structure
 *   (attributes, associations, operations) as similar non-stereotyped elements
 *   of the same kind. The stereotype may specify additional required tagged
 *   values that apply to these elements. In addition, a stereotype may be
 *   used to indicate a difference in meaning or usage between two elements
 *   with identical structure. Stereotype is a named element. TaggedValues
 *   attached to a Stereotype apply to each ExtendableElement branded by that
 *   Stereotype. A Stereotype specifies the name of the base element to which
 *   it can be added.
 * @ownedAttributes
 *   • name  : String -- Specifies the name of the stereotype. (§10.5.1)
 *   • type  : String -- Specifies the name of the base element to which the
 *     stereotype applies. (§10.5.1)
 *   • tag   : TagDefinition[0..*] (composite) -- Stereotype owns the set of
 *     tag definitions that determine the additional tagged values associated
 *     with the model elements that are branded with the given stereotype.
 *   • owner : ExtensionFamily[1] -- ExtensionFamily that owns the current
 *     stereotype. (§10.5.1)
 * @associationEnds
 *   • Stereotypes -- A_256 -- owner end
 *   • Tags        -- A_260 -- tag end (composite)
 *   • Extension   -- A_811 -- inverse extendableElement end
 * @operations (none)
 * @constraints
 *   1. Tags associated with ExtendableElement should not clash with any meta
 *      attributes associated with this model element. (§10.5.1)
 *   2. A model element should have at most one tagged value with a given tag
 *      name. (§10.5.1)
 *   3. A stereotype should not extend itself. (§10.5.1)
 *   4. A Stereotype can be added to ExtendableElement if its class is the same
 *      as the value of the type attribute of the Stereotype, or one of its
 *      subclasses. (§10.5.1)
 *   5. The values of the type attribute of the TagDefinition are restricted to
 *      the names of the subclasses of ExtendableElement and the names of the
 *      core datatypes ("Boolean," "String," "Integer"). (§10.5.1)
 */
export interface IStereotype extends IExtensionElement {
  readonly name: string;
  readonly type: string;
  readonly tag: ReadonlyArray<ITagDefinition>;
  readonly owner: IExtensionFamily;
}

export class Stereotype extends ExtensionElement implements IStereotype {
  readonly metaClass = "Stereotype" as const;
  readonly name: string;
  readonly type: string;
  readonly tag: ReadonlyArray<ITagDefinition>;
  readonly owner: IExtensionFamily;
  constructor(args: {
    owner: IExtensionFamily;
    name: string;
    type: string;
    tag?: ReadonlyArray<ITagDefinition>;
  }) {
    super();
    this.owner = args.owner;
    this.name = args.name;
    this.type = args.type;
    this.tag = args.tag ?? [];
  }
}

// ─── 17. ExtensionFamily (§10.5.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §10.5.3
 * @metaclass ExtensionFamily (concrete)
 * @generalization ExtensionElement
 * @definition ExtensionFamily provides a mechanism for managing lightweight
 *   extensions. ExtensionFamily acts as a container for a set of related
 *   stereotypes and their corresponding tag definitions. ExtensionFamily
 *   provides a named container for stereotype definitions. The implementer
 *   shall arrange stereotype definitions into meaningful families.
 * @ownedAttributes
 *   • name       : String -- Provides the name of the extension family.
 *     (§10.5.3)
 *   • stereotype : Stereotype[0..*] (composite) -- The set of stereotypes
 *     that are owned by the extension family. (§10.5.3)
 *   • owner      : FrameworkElement[1] -- The FrameworkElement (Segment or
 *     KDMModel) that owns the current extension family. (§10.5.3)
 * @associationEnds
 *   • Extensions  -- A_238 -- owner end
 *   • Stereotypes -- A_256 -- stereotype end (composite)
 * @operations (none)
 * @constraints (none declared in §10.5.3)
 */
export interface IExtensionFamily extends IExtensionElement {
  readonly name: string;
  readonly stereotype: ReadonlyArray<IStereotype>;
  readonly owner: IFrameworkElement;
}

export class ExtensionFamily extends ExtensionElement implements IExtensionFamily {
  readonly metaClass = "ExtensionFamily" as const;
  readonly name: string;
  readonly stereotype: ReadonlyArray<IStereotype>;
  readonly owner: IFrameworkElement;
  constructor(args: {
    owner: IFrameworkElement;
    name: string;
    stereotype?: ReadonlyArray<IStereotype>;
  }) {
    super();
    this.owner = args.owner;
    this.name = args.name;
    this.stereotype = args.stereotype ?? [];
  }
}

// ─── 18. TagDefinition (§10.5.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §10.5.2
 * @metaclass TagDefinition (concrete)
 * @generalization ExtensionElement
 * @definition Lightweight extensions allows information to be attached to any
 *   model element in the form of a "tagged value" pair (i.e., name=value). The
 *   interpretation of tagged value semantics is outside the scope of KDM. It
 *   must be determined by the user or tool conventions. It is expected that
 *   tools will define tags to supply information needed for their operations
 *   beyond the basic semantics of KDM. Each Stereotype owns the optional set
 *   of TagDefinitions. Each TagDefinition provides the name of the tag and
 *   the name of the KDM type of the corresponding value.
 * @ownedAttributes
 *   • tag   : String -- Contains the name of the tagged value. (§10.5.2)
 *   • type  : String -- Specifies the type of the value attribute. (§10.5.2)
 *   • owner : Stereotype[1] -- Stereotype that owns the current TagDefinition.
 *     (§10.5.2)
 * @associationEnds
 *   • Tags                   -- A_260 -- owner end
 *   • TaggedValueDefinition  -- A_264 -- extendedValue end (composite)
 * @operations (none)
 * @constraints
 *   1. The "value" attribute of the TaggedValue should be valid according to
 *      the type specified in the corresponding TagDefinition. (§10.5.2)
 *   2. The target of the "ref" association of the TaggedRef should be of the
 *      type specified in the corresponding TagDefinition, or one of its
 *      subtypes. (§10.5.2)
 *   3. If the type of the TaggedDefinition is one of the primitive datatypes,
 *      the corresponding value should be an instance of the TaggedValue class.
 *      (§10.5.2)
 *   4. If the type of the TaggedDefinition is a name of some other KDM
 *      element, the corresponding value should be an instance of the TaggedRef
 *      class. (§10.5.2)
 */
export interface ITagDefinition extends IExtensionElement {
  readonly tag: string;
  readonly type: string;
  readonly owner: IStereotype;
}

export class TagDefinition extends ExtensionElement implements ITagDefinition {
  readonly metaClass = "TagDefinition" as const;
  readonly tag: string;
  readonly type: string;
  readonly owner: IStereotype;
  constructor(args: { owner: IStereotype; tag: string; type: string }) {
    super();
    this.owner = args.owner;
    this.tag = args.tag;
    this.type = args.type;
  }
}

// ─── 19. ExtendedValue (§10.6.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §10.6.1
 * @metaclass ExtendedValue (abstract)
 * @generalization ExtensionElement
 * @definition ExtendedValue class is an abstract superclass for the two
 *   concrete classes that represent tagged values: the TaggedValue and the
 *   TaggedRef. ExtendedValue class defines common properties for these
 *   classes. ExtendedValue is an additional attribute to an extended KDM
 *   meta-model element. ExtendedValue element represents the value of the
 *   attribute.
 * @ownedAttributes
 *   • tag : TagDefinition[1] -- The reference to the tag definition of the
 *     corresponding stereotype. (§10.6.1)
 * @associationEnds
 *   • TaggedValueDefinition -- A_264 -- tag end
 *   • ExtendedValues        -- A_833 -- extendableElement end (inverse)
 * @operations (none)
 * @constraints (none declared in §10.6.1)
 */
export interface IExtendedValue extends IExtensionElement {
  readonly tag: ITagDefinition;
}

export abstract class ExtendedValue extends ExtensionElement implements IExtendedValue {
  abstract readonly tag: ITagDefinition;
}

// ─── 20. TaggedValue (§10.6.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §10.6.2
 * @metaclass TaggedValue (concrete)
 * @generalization ExtendedValue
 * @definition A tagged value allows information to be attached to any model
 *   element in the form of a "tagged value" pair, (i.e., name=value). The
 *   interpretation of tagged value semantics is outside of the scope of KDM.
 *   It must be determined by the user or tool conventions. Each TaggedValue
 *   must conform to the corresponding TagDefinition. TaggedValue element
 *   represents simple atomic extended attributes. The type constraint of the
 *   value, defined in the corresponding TagDefinition can be the name of any
 *   KDM primitive datatype.
 * @ownedAttributes
 *   • value : String -- Contains the current value of the TaggedValue.
 *     (§10.6.2)
 *   (inherits tag : TagDefinition[1] from ExtendedValue)
 * @associationEnds (inherits TaggedValueDefinition tag end from ExtendedValue)
 * @operations (none)
 * @constraints
 *   1. The value of the TaggedValue instance should conform to the type of
 *      the corresponding TagDefinition. (§10.6.2)
 */
export interface ITaggedValue extends IExtendedValue {
  readonly value: string;
}

export class TaggedValue extends ExtendedValue implements ITaggedValue {
  readonly metaClass = "TaggedValue" as const;
  readonly tag: ITagDefinition;
  readonly value: string;
  constructor(args: { tag: ITagDefinition; value: string }) {
    super();
    this.tag = args.tag;
    this.value = args.value;
  }
}

// ─── 21. TaggedRef (§10.6.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §10.6.3
 * @metaclass TaggedRef (concrete)
 * @generalization ExtendedValue
 * @definition A TaggedRef allows information to be attached to any model
 *   element in the form of a reference to another existing model element.
 *   Each TaggedRef must conform to the corresponding TagDefinition: the actual
 *   type of the model element that is the target of the TaggedRef must be the
 *   same as the type specified in the corresponding TagDefinition, or one of
 *   the subtypes of that type. TagRef represents complex extended attributes,
 *   which are associations to other KDM elements.
 * @ownedAttributes
 *   • reference : ModelElement[1] -- Designates the model element referred to
 *     by the extended value. (§10.6.3)
 *   (inherits tag : TagDefinition[1] from ExtendedValue)
 * @associationEnds
 *   • Reference -- A_251 -- reference end
 * @operations (none)
 * @constraints
 *   1. The model element that is the target of the reference association must
 *      be of the type, specified by the type attribute of the tag definition
 *      that is the target of the tag association of the tagged ref element.
 *      (§10.6.3)
 */
export interface ITaggedRef extends IExtendedValue {
  readonly reference: IModelElement;
}

export class TaggedRef extends ExtendedValue implements ITaggedRef {
  readonly metaClass = "TaggedRef" as const;
  readonly tag: ITagDefinition;
  readonly reference: IModelElement;
  constructor(args: { tag: ITagDefinition; reference: IModelElement }) {
    super();
    this.tag = args.tag;
    this.reference = args.reference;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// END Implementer #1: KDM Foundation
// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// BEGIN Implementer #2: Source + Code packages
//
// Scope: Source package (§11) — Inventory framework: InventoryModel, the full
// AbstractInventoryElement / InventoryItem / InventoryContainer hierarchy
// (SourceFile / ImageFile / ConfigFile / ExecutableFile / Directory / Project /
// LinkableFile / ObjectFile / LibraryFile / AudioFile / DataFile / Service /
// Document / Model / Track / InventoryElement), the full traceability
// surface (SourceRef, Region / SourceRegion / BinaryRegion / ReferenceableRegion),
// and inventory relationships (DependsOn, TraceableTo, InventoryRelationship).
//
// Code package (§12) — full Program-Elements surface: CodeModel, the
// AbstractCodeElement / CodeItem / ComputationalObject / DataElement / Module
// taxonomy; the Datatype family (PrimitiveType + 16 concrete primitive types,
// CompositeType / RecordType / ChoiceType, DerivedType / ArrayType /
// PointerType / RangeType / BagType / SetType / SequenceType, DefinedType /
// TypeUnit / SynonymType, EnumeratedType, ClassUnit / InterfaceUnit, Signature,
// TemplateElement / TemplateUnit / TemplateParameter / TemplateType); the
// data-element family (ItemUnit / IndexUnit / MemberUnit / StorableUnit /
// ParameterUnit / ValueElement / Value / ValueList); the control-element
// family (ControlElement / CallableUnit / MethodUnit); modules (CompilationUnit
// / SharedUnit / LanguageUnit / CodeAssembly / Package); preprocessor
// directives (PreprocessorDirective / MacroUnit / MacroDirective /
// IncludeDirective / ConditionalDirective); comments (CommentUnit);
// visibility (NamespaceUnit); extension points (CodeElement / CodeRelationship);
// and the full code-relationship suite (Imports / Extends / Implements /
// HasType / HasValue / Instantiates [InstanceOf] / ImplementationOf /
// ParameterTo / VisibleIn / Expands / GeneratedFrom / Includes / VariantTo
// / Redefines).
//
// Cross-package forward references: ActionElement and AbstractActionRelationship
// (§13 — Action package) and EntryFlow (§13.4) are typed as `unknown`
// placeholders and will be tightened by Wave 3 when the Action package is
// emitted.
// ═══════════════════════════════════════════════════════════════════════════

// ─── Forward references (cross-package — defined in later waves) ───
// IActionElement defined below in Wave 3 (Action package, §13.3.1).
// IAbstractActionRelationship defined below in Wave 3 (Action package, §13.3.2).
// IEntryFlow defined below in Wave 3 (Action package, §13.5.2).

// ───────────────────────────────────────────────────────────────────────────
// Source package (§11) — Program Elements / Inventory layer
// ───────────────────────────────────────────────────────────────────────────

// ─── 22. InventoryModel (§11.3.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.3.1
 * @metaclass InventoryModel (concrete)
 * @generalization KDMModel
 * @definition The InventoryModel is a specific KDM model that owns collections
 *   of facts related to the physical artifacts of the existing software
 *   system. InventoryModel is a container for the instances of InventoryItems.
 *   InventoryModel corresponds to the inventory of the physical artifacts of
 *   the existing software system.
 * @ownedAttributes
 *   • inventoryElement : AbstractInventoryElement [0..*] (composite) -- §11.3.1:
 *     The set of inventory elements owned by the inventory model.
 * @associationEnds
 *   • InventoryElements -- inventoryElement end (composite)
 * @operations (none)
 * @constraints (none declared in §11.3.1)
 */
export interface IInventoryModel extends IKDMModel {
  readonly inventoryElement: ReadonlyArray<IAbstractInventoryElement>;
}

export class InventoryModel extends KDMModel implements IInventoryModel {
  readonly metaClass = "InventoryModel" as const;
  readonly inventoryElement: ReadonlyArray<IAbstractInventoryElement>;
  constructor(args?: {
    name?: string;
    inventoryElement?: ReadonlyArray<IAbstractInventoryElement>;
  }) {
    super();
    if (args?.name !== undefined) {
      Object.defineProperty(this, "name", { value: args.name, writable: false, enumerable: true });
    }
    this.inventoryElement = args?.inventoryElement ?? [];
  }
  getOwnedElement(): ReadonlyArray<IKDMEntity> {
    return this.inventoryElement as ReadonlyArray<IKDMEntity>;
  }
}

// ─── 23. AbstractInventoryElement (§11.3.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.3.2
 * @metaclass AbstractInventoryElement (abstract)
 * @generalization KDMEntity
 * @definition The AbstractInventoryElement is the abstract parent class for
 *   all inventory entities. From the meta-model perspective, this element is a
 *   common parent for all inventory entities. This element is abstract and
 *   cannot occur in KDM instances. The name of the meta-model element can be
 *   used as the type constraint in stereotype definitions.
 * @ownedAttributes
 *   • inventoryRelation : AbstractInventoryRelationship [0..*] (composite) --
 *     §11.3.2: The set of inventory relations owned by the inventory element.
 * @associationEnds
 *   • InventoryRelations -- inventoryRelation end (composite)
 * @operations (none new -- inherits KDMEntity navigation operations)
 * @constraints (none declared in §11.3.2)
 */
export interface IAbstractInventoryElement extends IKDMEntity {
  readonly inventoryRelation: ReadonlyArray<IAbstractInventoryRelationship>;
}

export abstract class AbstractInventoryElement extends KDMEntity implements IAbstractInventoryElement {
  readonly inventoryRelation: ReadonlyArray<IAbstractInventoryRelationship> = [];
  // -- Provide sensible defaults for KDMEntity's abstract navigation operations
  //    so concrete inventory leaves don't each have to re-implement empty
  //    bodies. Per §9.4.1, these are derived-union accessors with sensible
  //    empty defaults at the metamodel-surface layer.
  getOwner(): IKDMEntity | undefined { return undefined; }
  getOwnedElement(): ReadonlyArray<IKDMEntity> { return []; }
  getGroup(): ReadonlyArray<IKDMEntity> { return []; }
  getGroupedElement(): ReadonlyArray<IKDMEntity> { return []; }
  getInbound(): ReadonlyArray<IKDMRelationship> { return []; }
  getOutbound(): ReadonlyArray<IKDMRelationship> { return []; }
  getOwnedRelation(): ReadonlyArray<IKDMRelationship> {
    return this.inventoryRelation as ReadonlyArray<IKDMRelationship>;
  }
  getModel(): IKDMModel | undefined { return undefined; }
  createAggregation(otherEntity: IKDMEntity): IAggregatedRelationship {
    return new AggregatedRelationship({ from: this, to: otherEntity });
  }
  deleteAggregation(_aggregation: IAggregatedRelationship): void { /* metamodel-surface no-op */ }
}

// ─── 24. AbstractInventoryRelationship (§11.3.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.3.3
 * @metaclass AbstractInventoryRelationship (abstract)
 * @generalization KDMRelationship
 * @definition The AbstractInventoryRelationship is the abstract parent class
 *   for all inventory relationships. From the meta-model perspective, this
 *   element is a common parent for all inventory relationships. This element
 *   is abstract and cannot occur in KDM instances. The name of the meta-model
 *   element can be used as the type constraint in stereotype definitions.
 * @ownedAttributes (none)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §11.3.3)
 */
export interface IAbstractInventoryRelationship extends IKDMRelationship {
  // structural marker — concrete subclasses (InventoryRelationship, DependsOn,
  // TraceableTo) carry their own endpoints.
}

export abstract class AbstractInventoryRelationship extends KDMRelationship implements IAbstractInventoryRelationship {}

// ─── 25. InventoryItem (§11.3.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.3.4
 * @metaclass InventoryItem (generic / concrete)
 * @generalization AbstractInventoryElement
 * @definition InventoryItem is a generic meta-model element that represents
 *   any artifact of an existing software system. This class is further
 *   subclassed by several concrete meta-model elements with more precise
 *   semantics. However, InventoryItem can be used as an extended modeling
 *   element with a stereotype.
 * @ownedAttributes
 *   • version : String -- Provides the ability to track version or revision
 *     numbers. (§11.3.4)
 *   • path    : String -- URI reference of the resource. (§11.3.4)
 *   • format  : String -- Optional description of the format of the
 *     InventoryItem. (§11.3.4)
 *   • md5     : String -- Optional MD5 hash signature of the resource using
 *     the MD5 message-digest algorithm. (§11.3.4)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §11.3.4 — although the spec semantics
 *   describes URI-resolution rules through the surrounding Directory
 *   hierarchy)
 */
export interface IInventoryItem extends IAbstractInventoryElement {
  readonly version: string;
  readonly path: string;
  readonly format: string;
  readonly md5: string;
}

export class InventoryItem extends AbstractInventoryElement implements IInventoryItem {
  readonly metaClass: string = "InventoryItem";
  readonly version: string;
  readonly path: string;
  readonly format: string;
  readonly md5: string;
  constructor(args?: {
    name?: string;
    version?: string;
    path?: string;
    format?: string;
    md5?: string;
    inventoryRelation?: ReadonlyArray<IAbstractInventoryRelationship>;
  }) {
    super();
    if (args?.name !== undefined) {
      Object.defineProperty(this, "name", { value: args.name, writable: false, enumerable: true });
    }
    if (args?.inventoryRelation !== undefined) {
      Object.defineProperty(this, "inventoryRelation", { value: args.inventoryRelation, writable: false, enumerable: true });
    }
    this.version = args?.version ?? "";
    this.path = args?.path ?? "";
    this.format = args?.format ?? "";
    this.md5 = args?.md5 ?? "";
  }
}

// ─── 26. SourceFile (§11.5.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.5.1
 * @metaclass SourceFile (concrete)
 * @generalization InventoryItem
 * @definition The SourceFile class represents source files. This meta-model
 *   element is the key part of the traceability mechanism of KDM whose purpose
 *   is to provide links between code elements and their physical
 *   implementations using the SourceRegion mechanism from the Source package.
 *   Instances of the SourceRegion meta-model element refer to certain regions
 *   of source files to identify the original representation corresponding to a
 *   certain KDM element.
 * @ownedAttributes
 *   • language : String -- Indicates the language of the source file.
 *     (§11.5.1)
 *   • encoding : String -- An optional attribute that represents the encoding
 *     of the characters in the file. (§11.5.1)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints
 *   The default encoding for SourceFile is "UTF-8." Encodings other than UTF-8
 *   should be explicitly specified in the optional encoding attribute. KDM
 *   tools shall at a minimum support UTF-8. (§11.5.1)
 */
export interface ISourceFile extends IInventoryItem {
  readonly language: string;
  readonly encoding: string;
}

export class SourceFile extends InventoryItem implements ISourceFile {
  override readonly metaClass = "SourceFile" as const;
  readonly language: string;
  readonly encoding: string;
  constructor(args?: {
    name?: string;
    version?: string;
    path?: string;
    format?: string;
    md5?: string;
    language?: string;
    encoding?: string;
  }) {
    super(args);
    this.language = args?.language ?? "";
    this.encoding = args?.encoding ?? "UTF-8";
  }
}

// ─── 27. ImageFile (§11.5.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.5.4
 * @metaclass ImageFile (concrete)
 * @generalization InventoryItem
 * @definition ImageFile element represents visual images, such as still
 *   graphical images, animated images, or video. ImageFile element represents
 *   visual images that combine shapes and color to inform, illustrate,
 *   entertain, or to guide viewers to particular information. A rich
 *   multimedia resource that combines video and audio shall be represented as
 *   an Instance of ImageFile.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §11.5.4)
 */
export interface IImageFile extends IInventoryItem {}

export class ImageFile extends InventoryItem implements IImageFile {
  override readonly metaClass = "ImageFile" as const;
}

// ─── 28. AudioFile (§11.5.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.5.5
 * @metaclass AudioFile (concrete)
 * @generalization InventoryItem
 * @definition AudioFile element represents resources related to audio content
 *   form, for example, digital recording or generation of sound waves such as
 *   voice, singing, instrumental music, or sound effects. AudioFile can be
 *   used to create the user interface of a software system, or as part of its
 *   content.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §11.5.5)
 */
export interface IAudioFile extends IInventoryItem {}

export class AudioFile extends InventoryItem implements IAudioFile {
  override readonly metaClass = "AudioFile" as const;
}

// ─── 29. DataFile (§11.5.6) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.5.6
 * @metaclass DataFile (concrete)
 * @generalization InventoryItem
 * @definition DataFile element represents variety of plain text or binary
 *   files that are used as input to some elements of a software system during
 *   the runtime phase. Data files may include csv files, Excel spreadsheets,
 *   database files, xml files, json files, etc. DataFile is often similar to a
 *   ConfigFile.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §11.5.6)
 */
export interface IDataFile extends IInventoryItem {}

export class DataFile extends InventoryItem implements IDataFile {
  override readonly metaClass = "DataFile" as const;
}

// ─── 30. Service (§11.5.7) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.5.7
 * @metaclass Service (concrete)
 * @generalization InventoryItem
 * @definition Service element represents a network resource that exposes some
 *   operations, such as a Web service. For example, REST web services provide
 *   a uniform set of stateless operations to manipulate a certain resource.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §11.5.7)
 */
export interface IService extends IInventoryItem {}

export class Service extends InventoryItem implements IService {
  override readonly metaClass = "Service" as const;
}

// ─── 31. ConfigFile (§11.5.8) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.5.8
 * @metaclass ConfigFile (concrete)
 * @generalization InventoryItem
 * @definition ConfigFile element represents configuration files, such as
 *   property lists, initial settings for user applications, server processes,
 *   operating system settings, or even simple databases. Configuration files
 *   often use plain text format, "us-ascii" character set, and are
 *   line-oriented.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §11.5.8)
 */
export interface IConfigFile extends IInventoryItem {}

export class ConfigFile extends InventoryItem implements IConfigFile {
  override readonly metaClass = "ConfigFile" as const;
}

// ─── 32. LinkableFile (§11.5.9) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.5.9
 * @metaclass LinkableFile (generic / concrete)
 * @generalization InventoryItem
 * @definition LinkableFile element represents various forms of relocatable
 *   machine code that is usually not directly executable. LinkableFile is a
 *   generic element, which introduces an extension point for the light-weight
 *   extension mechanism. Concrete subclasses of LinkableElement are ObjectFile
 *   and LibraryFile.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints
 *   1. LinkableFile should have at least one Stereotype. (§11.5.9)
 */
export interface ILinkableFile extends IInventoryItem {}

export class LinkableFile extends InventoryItem implements ILinkableFile {
  override readonly metaClass: string = "LinkableFile";
}

// ─── 33. ObjectFile (§11.5.10) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.5.10
 * @metaclass ObjectFile (concrete)
 * @generalization LinkableFile
 * @definition An object file is a file containing relocatable machine code
 *   that is usually not directly executable. Usually object files are used as
 *   input to the linker, which in turn typically generates an executable or
 *   library by combining parts of object files.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §11.5.10)
 */
export interface IObjectFile extends ILinkableFile {}

export class ObjectFile extends LinkableFile implements IObjectFile {
  override readonly metaClass = "ObjectFile" as const;
}

// ─── 34. LibraryFile (§11.5.11) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.5.11
 * @metaclass LibraryFile (concrete)
 * @generalization LinkableFile
 * @definition A library is a collection of reusable bytecode or machine code
 *   with a well-defined interface. A static library allows access to the code
 *   implemented by a library during the build of the invoking program. A
 *   shared or dynamic library can be accessed after the executable has been
 *   invoked to be executed.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §11.5.11)
 */
export interface ILibraryFile extends ILinkableFile {}

export class LibraryFile extends LinkableFile implements ILibraryFile {
  override readonly metaClass = "LibraryFile" as const;
}

// ─── 35. ExecutableFile (§11.5.12) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.5.12
 * @metaclass ExecutableFile (concrete)
 * @generalization InventoryItem
 * @definition ExecutableFile element represents executable files (machine
 *   code or bytecode) for a particular platform. ExecutableFile element
 *   assumes some binary format. Scripts and other interpreted files with text
 *   format are usually represented by a SourceFile element.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §11.5.12)
 */
export interface IExecutableFile extends IInventoryItem {}

export class ExecutableFile extends InventoryItem implements IExecutableFile {
  override readonly metaClass = "ExecutableFile" as const;
}

// ─── 36. Document (§11.5.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.5.3
 * @metaclass Document (concrete)
 * @generalization InventoryItem
 * @definition Document element represents various textual documents that are
 *   related to the software system. The format of a document can be plain
 *   text, formatted text, or one of the many binary formats. A Document is
 *   different from a SourceFile, because it does not determine the structure
 *   and behavior of the software system (but may describe it).
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §11.5.3)
 */
export interface IDocument extends IInventoryItem {}

export class Document extends InventoryItem implements IDocument {
  override readonly metaClass = "Document" as const;
}

// ─── 37. Model (§11.5.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.5.2
 * @metaclass Model (concrete) -- (Source package Model class, distinct from
 *   the kdm-package KDMModel framework class)
 * @generalization InventoryItem
 * @definition Model element represents various model artifacts that are
 *   related to the software system. The format of a document can be plain
 *   text, structured text, such as xml, or one of the many binary formats. A
 *   Model element complements SourceFile, because it determines the structure
 *   and behavior of the software system in an indirect way, by determining
 *   the structure and behavior of the source files through the techniques
 *   known as model-based engineering.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §11.5.2)
 */
export interface IInventoryModelArtifact extends IInventoryItem {}

// Note: the Source-package class is named "Model" in the spec but we expose it
// as `InventoryModelArtifact` in TypeScript to avoid collision with the `Model`
// concept from kdm-package's KDMModel hierarchy. The `metaClass` discriminant
// preserves the spec name "Model" so that XMI round-trip remains exact.
export class InventoryModelArtifact extends InventoryItem implements IInventoryModelArtifact {
  override readonly metaClass = "Model" as const;
}

// ─── 38. InventoryContainer (§11.3.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.3.5
 * @metaclass InventoryContainer (generic / concrete)
 * @generalization AbstractInventoryElement
 * @definition The InventoryContainer meta-model element provides a container
 *   for instances of InventoryItem elements. Concrete instances of the
 *   InventoryContainer element own other inventory elements (both inventory
 *   containers and individual inventory items).
 * @ownedAttributes
 *   • inventoryElement : AbstractInventoryElement [0..*] (composite) -- §11.3.5:
 *     The set of inventory elements owned by the container.
 * @associationEnds
 *   • OwnedInventory -- inventoryElement end (composite)
 * @operations (none)
 * @constraints
 *   1. InventoryContainer should have at least one stereotype. (§11.3.5)
 */
export interface IInventoryContainer extends IAbstractInventoryElement {
  readonly inventoryElement: ReadonlyArray<IAbstractInventoryElement>;
}

export class InventoryContainer extends AbstractInventoryElement implements IInventoryContainer {
  readonly metaClass: string = "InventoryContainer";
  readonly inventoryElement: ReadonlyArray<IAbstractInventoryElement>;
  constructor(args?: {
    name?: string;
    inventoryElement?: ReadonlyArray<IAbstractInventoryElement>;
    inventoryRelation?: ReadonlyArray<IAbstractInventoryRelationship>;
  }) {
    super();
    if (args?.name !== undefined) {
      Object.defineProperty(this, "name", { value: args.name, writable: false, enumerable: true });
    }
    if (args?.inventoryRelation !== undefined) {
      Object.defineProperty(this, "inventoryRelation", { value: args.inventoryRelation, writable: false, enumerable: true });
    }
    this.inventoryElement = args?.inventoryElement ?? [];
  }
  override getOwnedElement(): ReadonlyArray<IKDMEntity> {
    return this.inventoryElement as ReadonlyArray<IKDMEntity>;
  }
}

// ─── 39. Directory (§11.3.6) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.3.6
 * @metaclass Directory (concrete)
 * @generalization InventoryContainer
 * @definition The Directory class represents directories as containers that
 *   own inventory items. Directory items represent physical containers for
 *   the artifacts of the existing software systems, for example directories
 *   in file systems.
 * @ownedAttributes
 *   • path : String -- URI reference of the directory. (§11.3.6)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §11.3.6 -- the spec describes URI-resolution
 *   semantics through the directory hierarchy in informative prose)
 */
export interface IDirectory extends IInventoryContainer {
  readonly path: string;
}

export class Directory extends InventoryContainer implements IDirectory {
  override readonly metaClass = "Directory" as const;
  readonly path: string;
  constructor(args?: {
    name?: string;
    path?: string;
    inventoryElement?: ReadonlyArray<IAbstractInventoryElement>;
    inventoryRelation?: ReadonlyArray<IAbstractInventoryRelationship>;
  }) {
    super(args);
    this.path = args?.path ?? "";
  }
}

// ─── 40. Project (§11.3.7) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.3.7
 * @metaclass Project (concrete)
 * @generalization InventoryContainer
 * @definition The Project meta-model element represents an arbitrary logical
 *   container for inventory items. Project is an arbitrary container for
 *   Inventory items. It can be used in combination with Directory containers.
 *   The Project element does not contribute to the hierarchical resolution of
 *   the relative URI references of InventoryItems.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §11.3.7)
 */
export interface IProject extends IInventoryContainer {}

export class Project extends InventoryContainer implements IProject {
  override readonly metaClass = "Project" as const;
}

// ─── 41. Track (§11.6.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.6.2
 * @metaclass Track (concrete)
 * @generalization AbstractInventoryElement
 * @definition Track is part of the KDM's traceability mechanism. The Track
 *   element is the origin of the TraceableTo relations between arbitrary KDM
 *   elements. Since the Track element and the TraceableTo relation are both
 *   defined as part of the InventoryModel, they can be added to any KDMEntity
 *   element in any KDMModel. The Track element can be extended so that
 *   additional attributes can be added.
 * @ownedAttributes
 *   • description : String -- Description of the nature of the traceability
 *     link. (§11.6.2)
 * @associationEnds
 *   • owner : KDMEntity [0..1] -- The logical origin element for the
 *     traceability link. (§11.6.2)
 * @operations (none)
 * @constraints (none declared in §11.6.2)
 */
export interface ITrack extends IAbstractInventoryElement {
  readonly description: string;
  readonly owner: IKDMEntity | undefined;
}

export class Track extends AbstractInventoryElement implements ITrack {
  readonly metaClass = "Track" as const;
  readonly description: string;
  readonly owner: IKDMEntity | undefined;
  constructor(args?: {
    name?: string;
    description?: string;
    owner?: IKDMEntity;
    inventoryRelation?: ReadonlyArray<IAbstractInventoryRelationship>;
  }) {
    super();
    if (args?.name !== undefined) {
      Object.defineProperty(this, "name", { value: args.name, writable: false, enumerable: true });
    }
    if (args?.inventoryRelation !== undefined) {
      Object.defineProperty(this, "inventoryRelation", { value: args.inventoryRelation, writable: false, enumerable: true });
    }
    this.description = args?.description ?? "";
    this.owner = args?.owner;
  }
}

// ─── 42. Region (§11.7.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.7.1
 * @metaclass Region (abstract)
 * @generalization AnnotatableElement
 * @definition The Region element is an abstract element that identifies a
 *   single region within a resource that is considered to be the physical
 *   artifact of the corresponding KDM element. The concrete subclasses of the
 *   Region element provide the capability to precisely map model elements to
 *   a particular region of source that can be text, binary, or any other
 *   format.
 * @ownedAttributes
 *   • format : String -- (Optional) describes the organization of the
 *     physical artifact. (§11.7.1)
 *   • path   : String -- (Optional) full URI reference of the physical
 *     artifact that contains the given region. (§11.7.1)
 * @associationEnds
 *   • file : InventoryItem [0..1] -- Allows zero or more Region elements to be
 *     associated with a single InventoryItem element of the Inventory Model.
 *     (§11.7.1)
 * @operations (none)
 * @constraints
 *   1. The location of the source file should be provided using at least one
 *      of the following methods: path attribute of the Region element, or
 *      path attribute of the referenced InventoryItem element of the Inventory
 *      model. (§11.7.1)
 */
export interface IRegion extends IAnnotatableElement {
  readonly format: string;
  readonly path: string;
  readonly file: IInventoryItem | undefined;
}

export abstract class Region extends AnnotatableElement implements IRegion {
  readonly format: string = "";
  readonly path: string = "";
  readonly file: IInventoryItem | undefined = undefined;
}

// ─── 43. SourceRegion (§11.7.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.7.2
 * @metaclass SourceRegion (concrete)
 * @generalization Region
 * @definition The SourceRegion element identifies a single region within some
 *   InventoryItem that is the physical representation of the corresponding
 *   KDM element. The SourceRegion element provides the capability to precisely
 *   map model elements to a particular region of source code in text format.
 * @ownedAttributes
 *   • startLine     : Integer -- The line number of the first character of
 *     the source region. (§11.7.2)
 *   • startPosition : Integer -- The position of the first character of the
 *     source region. (§11.7.2)
 *   • endLine       : Integer -- The line number of the last character of
 *     the source region. (§11.7.2)
 *   • endPosition   : Integer -- The position of the last character of the
 *     source region. (§11.7.2)
 *   • language      : String  -- (Optional) The language indicator of the
 *     source code for the given source region. (§11.7.2)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints
 *   1. The file attribute of the SourceRegion element shall refer to an
 *      InventoryItem with text format. (§11.7.2)
 */
export interface ISourceRegion extends IRegion {
  readonly startLine: number;
  readonly startPosition: number;
  readonly endLine: number;
  readonly endPosition: number;
  readonly language: string;
}

export class SourceRegion extends Region implements ISourceRegion {
  readonly metaClass = "SourceRegion" as const;
  readonly startLine: number;
  readonly startPosition: number;
  readonly endLine: number;
  readonly endPosition: number;
  readonly language: string;
  constructor(args?: {
    format?: string;
    path?: string;
    file?: IInventoryItem;
    startLine?: number;
    startPosition?: number;
    endLine?: number;
    endPosition?: number;
    language?: string;
  }) {
    super();
    if (args?.format !== undefined) {
      Object.defineProperty(this, "format", { value: args.format, writable: false, enumerable: true });
    }
    if (args?.path !== undefined) {
      Object.defineProperty(this, "path", { value: args.path, writable: false, enumerable: true });
    }
    if (args?.file !== undefined) {
      Object.defineProperty(this, "file", { value: args.file, writable: false, enumerable: true });
    }
    this.startLine = args?.startLine ?? 0;
    this.startPosition = args?.startPosition ?? 0;
    this.endLine = args?.endLine ?? 0;
    this.endPosition = args?.endPosition ?? 0;
    this.language = args?.language ?? "";
  }
}

// ─── 44. BinaryRegion (§11.7.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.7.3
 * @metaclass BinaryRegion (concrete)
 * @generalization Region
 * @definition The BinaryRegion element identifies a single region within some
 *   InventoryItem that has binary format. Specification of a BinaryRegion
 *   assumes that the corresponding resource is a sequence of bytes, where
 *   each byte has 8-bit size, representable as an octet. Addresses in a
 *   BinaryRegion are represented as non-negative integers.
 * @ownedAttributes
 *   • startAddr : Integer -- The address of the first byte of the binary
 *     region. (§11.7.3)
 *   • endAddr   : Integer -- The address of the last byte of the binary
 *     region. (§11.7.3)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §11.7.3)
 */
export interface IBinaryRegion extends IRegion {
  readonly startAddr: number;
  readonly endAddr: number;
}

export class BinaryRegion extends Region implements IBinaryRegion {
  readonly metaClass = "BinaryRegion" as const;
  readonly startAddr: number;
  readonly endAddr: number;
  constructor(args?: {
    format?: string;
    path?: string;
    file?: IInventoryItem;
    startAddr?: number;
    endAddr?: number;
  }) {
    super();
    if (args?.format !== undefined) {
      Object.defineProperty(this, "format", { value: args.format, writable: false, enumerable: true });
    }
    if (args?.path !== undefined) {
      Object.defineProperty(this, "path", { value: args.path, writable: false, enumerable: true });
    }
    if (args?.file !== undefined) {
      Object.defineProperty(this, "file", { value: args.file, writable: false, enumerable: true });
    }
    this.startAddr = args?.startAddr ?? 0;
    this.endAddr = args?.endAddr ?? 0;
  }
}

// ─── 45. ReferenceableRegion (§11.7.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.7.4
 * @metaclass ReferenceableRegion (concrete)
 * @generalization Region
 * @definition The ReferenceableRegion element identifies a single element
 *   within some InventoryItem using a custom reference. The semantics of the
 *   reference is outside of the scope of KDM. The implementer shall provide
 *   appropriate reference.
 * @ownedAttributes
 *   • ref : String -- The reference to the element. (§11.7.4)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §11.7.4)
 */
export interface IReferenceableRegion extends IRegion {
  readonly ref: string;
}

export class ReferenceableRegion extends Region implements IReferenceableRegion {
  readonly metaClass = "ReferenceableRegion" as const;
  readonly ref: string;
  constructor(args?: {
    format?: string;
    path?: string;
    file?: IInventoryItem;
    ref?: string;
  }) {
    super();
    if (args?.format !== undefined) {
      Object.defineProperty(this, "format", { value: args.format, writable: false, enumerable: true });
    }
    if (args?.path !== undefined) {
      Object.defineProperty(this, "path", { value: args.path, writable: false, enumerable: true });
    }
    if (args?.file !== undefined) {
      Object.defineProperty(this, "file", { value: args.file, writable: false, enumerable: true });
    }
    this.ref = args?.ref ?? "";
  }
}

// ─── 46. SourceRef (§11.6.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.6.1
 * @metaclass SourceRef (concrete)
 * @generalization AnnotatableElement
 * @definition The SourceRef class represents a traceability link between a
 *   particular model element and the corresponding source code. SourceRef
 *   meta-model element represents a traceability link between an instance of
 *   a KDM element to its original "source" representation as part of a
 *   physical artifact of the existing software system.
 * @ownedAttributes
 *   • language : String -- (Optional) Indicates the source language of the
 *     snippet attribute. (§11.6.1)
 *   • snippet  : String -- (Optional) The source snippet for the given KDM
 *     element. The interpretation of code snippets is outside the scope of
 *     KDM. (§11.6.1)
 * @associationEnds
 *   • region : Region [0..*] -- (Optional) A list of Region elements that
 *     provide further details related to the physical representation of the
 *     element. (§11.6.1)
 * @operations (none)
 * @constraints
 *   1. Language indicator has to be provided using at least one of the
 *      following methods: as the attribute of the SourceRef element, as the
 *      attribute of the SourceRegion element, or as the attribute of the
 *      SourceFile element. (§11.6.1)
 *   2. If both the snippet and the language attributes of the SourceRef
 *      element are present, then the language attribute should describe the
 *      nature of the code snippet, in which case the nature of the source
 *      code region accessible through the SourceRegion may be different
 *      from the nature of the code snippet. (§11.6.1)
 */
// Note: ISourceRef was forward-declared in Wave 1 (KDMEntity.source / .track
// reference it). The Wave-1 forward type was `unknown`; here in Wave 2 we
// emit the full structural interface and concrete class. Existing Wave-1
// type aliases (`type ISourceRef = unknown;`) are NOT redefined — instead,
// downstream consumers can cast from the unknown alias to ISourceRefFull at
// the boundary. We expose the full surface here as ISourceRefFull / SourceRef.
export interface ISourceRefFull {
  readonly annotation: ReadonlyArray<IAnnotation>;
  readonly attribute: ReadonlyArray<IAttribute>;
  readonly language: string;
  readonly snippet: string;
  readonly region: ReadonlyArray<IRegion>;
}

export class SourceRef extends AnnotatableElement implements ISourceRefFull {
  readonly metaClass = "SourceRef" as const;
  readonly language: string;
  readonly snippet: string;
  readonly region: ReadonlyArray<IRegion>;
  constructor(args?: {
    language?: string;
    snippet?: string;
    region?: ReadonlyArray<IRegion>;
  }) {
    super();
    this.language = args?.language ?? "";
    this.snippet = args?.snippet ?? "";
    this.region = args?.region ?? [];
  }
}

// ─── 47. InventoryRelationship (§11.9.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.9.2
 * @metaclass InventoryRelationship (generic / concrete)
 * @generalization AbstractInventoryRelationship
 * @definition The InventoryRelationship class is a generic meta-model element
 *   that can be used to define new extended inventory relationships through
 *   the KDM light-weight extension mechanism. An inventory relationship with
 *   under specified semantics. It is a concrete class that can be used as the
 *   base element of a new extended meta-model relationship type of the
 *   inventory model.
 * @ownedAttributes
 *   • from : AbstractInventoryElement [1] -- The inventory element origin
 *     endpoint of the relationship. (§11.9.2)
 *   • to   : KDMEntity [1] -- The target of the relationship. (§11.9.2)
 * @associationEnds (none new beyond from/to)
 * @operations (none)
 * @constraints
 *   1. InventoryRelationship should have at least one stereotype. (§11.9.2)
 */
export interface IInventoryRelationship extends IAbstractInventoryRelationship {
  readonly from: IAbstractInventoryElement;
  readonly to: IKDMEntity;
}

export class InventoryRelationship extends AbstractInventoryRelationship implements IInventoryRelationship {
  readonly metaClass: string = "InventoryRelationship";
  readonly from: IAbstractInventoryElement;
  readonly to: IKDMEntity;
  constructor(args: { from: IAbstractInventoryElement; to: IKDMEntity }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 48. InventoryElement (§11.9.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.9.1
 * @metaclass InventoryElement (generic / concrete)
 * @generalization AbstractInventoryElement
 * @definition The InventoryElement class is a generic meta-model element that
 *   can be used to define new extended meta-model elements through the KDM
 *   light-weight extension mechanism. An inventory entity with under-specified
 *   semantics, intended to be used as the base element of a new extended
 *   meta-model entity type of the inventory model.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints
 *   1. InventoryElement should have at least one stereotype. (§11.9.1)
 */
export interface IInventoryElement extends IAbstractInventoryElement {}

export class InventoryElement extends AbstractInventoryElement implements IInventoryElement {
  readonly metaClass = "InventoryElement" as const;
  constructor(args?: {
    name?: string;
    inventoryRelation?: ReadonlyArray<IAbstractInventoryRelationship>;
  }) {
    super();
    if (args?.name !== undefined) {
      Object.defineProperty(this, "name", { value: args.name, writable: false, enumerable: true });
    }
    if (args?.inventoryRelation !== undefined) {
      Object.defineProperty(this, "inventoryRelation", { value: args.inventoryRelation, writable: false, enumerable: true });
    }
  }
}

// ─── 49. DependsOn (§11.8.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.8.1
 * @metaclass DependsOn (concrete)
 * @generalization AbstractInventoryRelationship
 * @definition DependsOn class is a meta-model element that represents an
 *   optional relationship between two inventory items, in which one inventory
 *   element requires another inventory element during one or more steps of
 *   the engineering process.
 * @ownedAttributes
 *   • from : AbstractInventoryElement [1] -- The base inventory item.
 *   • to   : AbstractInventoryElement [1] -- Another inventory item on which
 *     the base item depends. (§11.8.1)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. An inventory item should not depend on itself. (§11.8.1)
 */
export interface IDependsOn extends IAbstractInventoryRelationship {
  readonly from: IAbstractInventoryElement;
  readonly to: IAbstractInventoryElement;
}

export class DependsOn extends AbstractInventoryRelationship implements IDependsOn {
  readonly metaClass = "DependsOn" as const;
  readonly from: IAbstractInventoryElement;
  readonly to: IAbstractInventoryElement;
  constructor(args: { from: IAbstractInventoryElement; to: IAbstractInventoryElement }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 50. TraceableTo (§11.8.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §11.8.2
 * @metaclass TraceableTo (concrete)
 * @generalization AbstractInventoryRelationship
 * @definition TraceableTo class is a meta-model element that represents an
 *   optional relationship between any KDMEntity and an InventoryItem. This
 *   relationship represents situations where the KDMEntity is traceable to
 *   the inventory element during one or more steps of the engineering
 *   process.
 * @ownedAttributes
 *   • from : Track     [1] -- The Track element that is owned by some
 *     KDMEntity. (§11.8.2)
 *   • to   : KDMEntity [1] -- Another KDMEntity to which the owner of the
 *     Track element is traceable to. (§11.8.2)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. A KDMEntity should not be traceable to itself. (§11.8.2)
 */
export interface ITraceableTo extends IAbstractInventoryRelationship {
  readonly from: ITrack;
  readonly to: IKDMEntity;
}

export class TraceableTo extends AbstractInventoryRelationship implements ITraceableTo {
  readonly metaClass = "TraceableTo" as const;
  readonly from: ITrack;
  readonly to: IKDMEntity;
  constructor(args: { from: ITrack; to: IKDMEntity }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Code package (§12) — Program-Elements layer (CAST + datatypes + relations)
// ───────────────────────────────────────────────────────────────────────────

// ─── Code-package enumerations (§12.6.3 + §12.6.5 + §12.6.6 + §12.7.3 +
//     §12.14.2 + §12.22.3) ───

/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.6.3
 * @enumeration CallableKind
 * @definition CallableKind enumerated data type specifies some common
 *   properties of the CallableUnit. Literals: regular, external, operator,
 *   stored, unknown.
 */
export const CallableKind = {
  Regular: "regular",
  External: "external",
  Operator: "operator",
  Stored: "stored",
  Unknown: "unknown",
} as const;
export type CallableKind = (typeof CallableKind)[keyof typeof CallableKind];

/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.6.5
 * @enumeration MethodKind
 * @definition MethodKind enumerated data type defines additional specification
 *   of the kind of method, defined by a MethodUnit model element. Literals:
 *   method, constructor, destructor, operator, unknown.
 */
export const MethodKind = {
  Method: "method",
  Constructor: "constructor",
  Destructor: "destructor",
  Operator: "operator",
  Unknown: "unknown",
} as const;
export type MethodKind = (typeof MethodKind)[keyof typeof MethodKind];

/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.6.6
 * @enumeration ExportKind
 * @definition ExportKind enumeration data type defines several common
 *   properties of a MemberUnit, MethodUnit, or entire ClassUnit related to
 *   their visibility and other properties. Literals: public, private,
 *   protected, unknown.
 */
export const ExportKind = {
  Public: "public",
  Private: "private",
  Protected: "protected",
  Unknown: "unknown",
} as const;
export type ExportKind = (typeof ExportKind)[keyof typeof ExportKind];

/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.7.3
 * @enumeration StorableKind
 * @definition StorableKind enumeration data type defines several common
 *   properties of a StorableUnit related to their life-cycle, visibility, and
 *   memory type. Literals: global, local, external, register, unknown.
 */
export const StorableKind = {
  Global: "global",
  Local: "local",
  External: "external",
  Register: "register",
  Unknown: "unknown",
} as const;
export type StorableKind = (typeof StorableKind)[keyof typeof StorableKind];

/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.14.2
 * @enumeration ParameterKind
 * @definition ParameterKind datatype defines the kind of parameter passing
 *   conventions. Literals: byValue, byName, byReference, variadic, return,
 *   throws, exception, catchall, unknown.
 */
export const ParameterKind = {
  ByValue: "byValue",
  ByName: "byName",
  ByReference: "byReference",
  Variadic: "variadic",
  Return: "return",
  Throws: "throws",
  Exception: "exception",
  Catchall: "catchall",
  Unknown: "unknown",
} as const;
export type ParameterKind = (typeof ParameterKind)[keyof typeof ParameterKind];

/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.22.3
 * @enumeration MacroKind
 * @definition MacroKind enumeration datatype describes several semantic
 *   classes of MacroUnits. Literals: regular, option, undefined, external,
 *   unknown.
 */
export const MacroKind = {
  Regular: "regular",
  Option: "option",
  Undefined: "undefined",
  External: "external",
  Unknown: "unknown",
} as const;
export type MacroKind = (typeof MacroKind)[keyof typeof MacroKind];

// ─── 51. CodeModel (§12.3.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.3.1
 * @metaclass CodeModel (concrete)
 * @generalization KDMModel
 * @definition The CodeModel is the specific KDM model that owns collections of
 *   facts about the existing software system such that these facts correspond
 *   to the Code domain. CodeModel is the only model of the Program Elements
 *   Layer of KDM. CodeModel follows the uniform pattern for KDM models.
 *   CodeModel is a container for code elements. The implementer shall arrange
 *   code elements into one or more code models.
 * @ownedAttributes
 *   • codeElement : AbstractCodeElement [0..*] {ordered} (composite) -- §12.3.1:
 *     The set of the top-level elements that are defined in this code model.
 * @associationEnds
 *   • CodeElements -- codeElement end (composite, ordered)
 * @operations (none)
 * @constraints (none declared in §12.3.1)
 */
export interface ICodeModel extends IKDMModel {
  readonly codeElement: ReadonlyArray<IAbstractCodeElement>;
}

export class CodeModel extends KDMModel implements ICodeModel {
  readonly metaClass = "CodeModel" as const;
  readonly codeElement: ReadonlyArray<IAbstractCodeElement>;
  constructor(args?: {
    name?: string;
    codeElement?: ReadonlyArray<IAbstractCodeElement>;
  }) {
    super();
    if (args?.name !== undefined) {
      Object.defineProperty(this, "name", { value: args.name, writable: false, enumerable: true });
    }
    this.codeElement = args?.codeElement ?? [];
  }
  getOwnedElement(): ReadonlyArray<IKDMEntity> {
    return this.codeElement as ReadonlyArray<IKDMEntity>;
  }
}

// ─── 52. AbstractCodeElement (§12.3.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.3.2
 * @metaclass AbstractCodeElement (abstract)
 * @generalization KDMEntity
 * @definition The AbstractCodeElement is an abstract class representing any
 *   generic determined by a programming language. The key subclasses of
 *   AbstractCodeElement are CodeItem and ActionElement. AbstractCodeElement
 *   is an abstract class that is used to constrain the owned elements of some
 *   KDM containers in the Code model.
 * @ownedAttributes
 *   • codeRelation : AbstractCodeRelationship [0..*] (composite) -- §12.3.2:
 *     The set of code relations owned by this code element.
 *   • comment      : CommentUnit [0..*] (composite) -- §12.24.2 additional
 *     properties: CommentUnits associated with the AbstractCodeElement.
 *   • entryFlow    : EntryFlow [0..*] (composite) -- forward-ref to Wave 3
 *     §13.4: Entry-flow relations from the AbstractCodeElement.
 * @associationEnds (per ownedAttributes, all composite)
 * @operations (none)
 * @constraints (none declared in §12.3.2)
 */
export interface IAbstractCodeElement extends IKDMEntity {
  readonly codeRelation: ReadonlyArray<IAbstractCodeRelationship>;
  readonly comment: ReadonlyArray<ICommentUnit>;
  readonly entryFlow: ReadonlyArray<IEntryFlow>;
}

export abstract class AbstractCodeElement extends KDMEntity implements IAbstractCodeElement {
  readonly codeRelation: ReadonlyArray<IAbstractCodeRelationship> = [];
  readonly comment: ReadonlyArray<ICommentUnit> = [];
  readonly entryFlow: ReadonlyArray<IEntryFlow> = [];
  // Provide sensible defaults for KDMEntity's abstract navigation operations,
  // mirroring the AbstractInventoryElement pattern.
  getOwner(): IKDMEntity | undefined { return undefined; }
  getOwnedElement(): ReadonlyArray<IKDMEntity> { return []; }
  getGroup(): ReadonlyArray<IKDMEntity> { return []; }
  getGroupedElement(): ReadonlyArray<IKDMEntity> { return []; }
  getInbound(): ReadonlyArray<IKDMRelationship> { return []; }
  getOutbound(): ReadonlyArray<IKDMRelationship> { return []; }
  getOwnedRelation(): ReadonlyArray<IKDMRelationship> {
    return this.codeRelation as ReadonlyArray<IKDMRelationship>;
  }
  getModel(): IKDMModel | undefined { return undefined; }
  createAggregation(otherEntity: IKDMEntity): IAggregatedRelationship {
    return new AggregatedRelationship({ from: this, to: otherEntity });
  }
  deleteAggregation(_aggregation: IAggregatedRelationship): void { /* metamodel-surface no-op */ }
}

// ─── 53. AbstractCodeRelationship (§12.3.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.3.3
 * @metaclass AbstractCodeRelationship (abstract)
 * @generalization KDMRelationship
 * @definition The AbstractCodeRelationship is an abstract class representing
 *   any relationship determined by a programming language. AbstractCodeRelationship
 *   is an abstract class that is used to constrain the subclasses of
 *   KDMRelationship in the Code model.
 * @ownedAttributes (none)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.3.3)
 */
export interface IAbstractCodeRelationship extends IKDMRelationship {}

export abstract class AbstractCodeRelationship extends KDMRelationship implements IAbstractCodeRelationship {}

// ─── 54. CodeItem (§12.3.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.3.4
 * @metaclass CodeItem (abstract)
 * @generalization AbstractCodeElement
 * @definition CodeItem class represents the named elements determined by the
 *   programming language (the so-called "symbols," "definitions," etc.). There
 *   are AbstractCodeElements that are not CodeItems, for example
 *   ActionElements that are defined in the Action package.
 * @ownedAttributes (none)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.3.4)
 */
export interface ICodeItem extends IAbstractCodeElement {}

export abstract class CodeItem extends AbstractCodeElement implements ICodeItem {}

// ─── 55. ComputationalObject (§12.3.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.3.5
 * @metaclass ComputationalObject (generic / concrete)
 * @generalization CodeItem
 * @definition ComputationalObject class represents the named elements
 *   determined by the programming language, which describe certain
 *   computational objects at the runtime, for example, procedures, and
 *   variables. ComputationalObject is a generic element with under specified
 *   semantics that can be used as an extension point.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints
 *   1. Instance of the ComputationalObject element should have at least one
 *      stereotype. (§12.3.5)
 */
export interface IComputationalObject extends ICodeItem {}

export class ComputationalObject extends CodeItem implements IComputationalObject {
  readonly metaClass: string = "ComputationalObject";
  constructor(args?: { name?: string }) {
    super();
    if (args?.name !== undefined) {
      Object.defineProperty(this, "name", { value: args.name, writable: false, enumerable: true });
    }
  }
}

// ─── 56. Datatype (§12.3.6) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.3.6
 * @metaclass Datatype (generic / concrete)
 * @generalization CodeItem
 * @definition Datatype class represents the named elements determined by the
 *   programming language that describes datatypes. The key subclasses of
 *   Datatype are: PrimitiveType, EnumeratedType, CompositeType, DerivedType,
 *   Signature, DefinedType, ClassUnit, InterfaceUnit, TemplateElement.
 *   Datatype is a generic element with under-specified semantics that can be
 *   used as an extension point.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints
 *   1. Instance of the Datatype element should have at least one stereotype.
 *      (§12.3.6)
 */
export interface IDatatype extends ICodeItem {}

export class Datatype extends CodeItem implements IDatatype {
  readonly metaClass: string = "Datatype";
  constructor(args?: { name?: string }) {
    super();
    if (args?.name !== undefined) {
      Object.defineProperty(this, "name", { value: args.name, writable: false, enumerable: true });
    }
  }
}

// ─── 57. Module (§12.5.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.5.1
 * @metaclass Module (generic / concrete)
 * @generalization CodeItem
 * @definition The Module class is a generic KDM modeling element that
 *   represents an entire software module or a component, as determined by the
 *   programming language and the software development environment. Instances
 *   of the Module class represent the logical containers for program elements
 *   determined by the programming language.
 * @ownedAttributes
 *   • codeElement : AbstractCodeElement [0..*] {ordered} (composite) -- §12.5.1:
 *     The list of owned CodeElement.
 * @associationEnds
 *   • OwnedCode -- codeElement end (composite, ordered)
 * @operations (none)
 * @constraints
 *   1. Module class and its subclasses should not own SourceRef elements.
 *   2. Code Model cannot directly own any code elements other than the
 *      subclasses of the Module class.
 *   3. Every code element should be owned by some instance of the Module
 *      class or its subclasses.
 *   4. Instance of the Module element should have at least one stereotype.
 *   5. No other code element should own Module elements and its subclasses.
 *   6. If Module directly owns ActionElement, then the Module shall own
 *      EntryFlow to the logically first ActionElement. (§12.5.1)
 */
export interface IModule extends ICodeItem {
  readonly codeElement: ReadonlyArray<IAbstractCodeElement>;
}

export class Module extends CodeItem implements IModule {
  readonly metaClass: string = "Module";
  readonly codeElement: ReadonlyArray<IAbstractCodeElement>;
  constructor(args?: {
    name?: string;
    codeElement?: ReadonlyArray<IAbstractCodeElement>;
  }) {
    super();
    if (args?.name !== undefined) {
      Object.defineProperty(this, "name", { value: args.name, writable: false, enumerable: true });
    }
    this.codeElement = args?.codeElement ?? [];
  }
  override getOwnedElement(): ReadonlyArray<IKDMEntity> {
    return this.codeElement as ReadonlyArray<IKDMEntity>;
  }
}

// ─── 58. CompilationUnit (§12.5.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.5.2
 * @metaclass CompilationUnit (concrete)
 * @generalization Module
 * @definition The CompilationUnit class is a meta-model element that
 *   represents a logical container that owns program elements. A compilation
 *   unit is a logical part of the existing software system that is
 *   sufficiently complete to be processed by the corresponding software
 *   development environment.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints
 *   1. When CompilationUnit owns one or more initialization BlockUnit, the
 *      CompilationUnit shall own EntryFlow relation to the logically first
 *      initialization block. (§12.5.2)
 */
export interface ICompilationUnit extends IModule {}

export class CompilationUnit extends Module implements ICompilationUnit {
  // Note: typed `string` (not literal) so SharedUnit (§12.5.3) — which
  // extends CompilationUnit per Code.xsd — can narrow to its own
  // metaClass discriminant without TS2416.
  override readonly metaClass: string = "CompilationUnit";
}

// ─── 59. SharedUnit (§12.5.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.5.3
 * @metaclass SharedUnit (concrete)
 * @generalization Module (per CMOF; spec §12.5.3 prose mentions Module while
 *   referring to it as a sibling-of-CompilationUnit, but the CMOF and Code.xsd
 *   resolve the parent to Module via CompilationUnit's sibling — see XSD's
 *   `code:CompilationUnit` heritage; we follow the CMOF-explicit parent.)
 * @definition The SharedUnit class is a meta-model element that represents a
 *   shared source file as supported by the selected programming languages of
 *   the existing software system and as determined by the engineering
 *   process. SharedUnit emphasizes the ability of the program elements owned
 *   by the SharedUnit to be shared among stand-alone program elements through
 *   some form of inclusion mechanism.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.5.3)
 */
export interface ISharedUnit extends ICompilationUnit {}

// Per Code.xsd: <complexType name="SharedUnit"><extension base="code:CompilationUnit"/></complexType>
export class SharedUnit extends CompilationUnit implements ISharedUnit {
  override readonly metaClass = "SharedUnit" as const;
}

// ─── 60. LanguageUnit (§12.5.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.5.4
 * @metaclass LanguageUnit (concrete)
 * @generalization Module
 * @definition The LanguageUnit class is a meta-model element, which represents
 *   predefined datatypes and other common elements determined by a particular
 *   programming language. LanguageUnit is a logical container that owns
 *   definitions of primitive and predefined datatypes for a particular
 *   language, as well as other common elements for a particular programming
 *   language.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints
 *   1. PredefinedType class and its subclasses can only be contained in a
 *      LanguageUnit container. (§12.5.4)
 */
export interface ILanguageUnit extends IModule {}

export class LanguageUnit extends Module implements ILanguageUnit {
  override readonly metaClass = "LanguageUnit" as const;
}

// ─── 61. CodeAssembly (§12.5.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.5.5
 * @metaclass CodeAssembly (concrete)
 * @generalization Module
 * @definition The CodeAssembly represents a logical container for the program
 *   elements that were built together (for example, compiled and linked into
 *   an executable, so that all variant selection during the compilation and
 *   static linking was resolved in a certain coordinated fashion). The
 *   CodeAssembly represents a collection of entities that have been analyzed
 *   together.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.5.5)
 */
export interface ICodeAssembly extends IModule {}

export class CodeAssembly extends Module implements ICodeAssembly {
  override readonly metaClass = "CodeAssembly" as const;
}

// ─── 62. Package (§12.5.6) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.5.6
 * @metaclass Package (concrete) -- KDM-Code Package, distinct from
 *   OMG-MOF/UML Package; serialized to XMI as code:Package.
 * @generalization Module
 * @definition The Package class is a subtype for Module that holds logical
 *   collections of program elements, as directly supported by some programming
 *   languages, such as Java. A Package is a logical container for program
 *   elements as well as Modules. Packages can be nested.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.5.6)
 */
export interface ICodePackage extends IModule {}

// Exported as `CodePackage` to avoid any global TypeScript Package collision
// while preserving the spec metaClass discriminant "Package".
export class CodePackage extends Module implements ICodePackage {
  override readonly metaClass = "Package" as const;
}

// ─── 63. ControlElement (§12.6.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.6.1
 * @metaclass ControlElement (generic / concrete)
 * @generalization ComputationalObject
 * @definition The ControlElement class is a common superclass that defines
 *   attributes for callable code elements. In the meta-model it has the role
 *   of an endpoint for some KDM relations. ControlElement represents named
 *   items of the software system that describe certain behavior that can be
 *   performed by demand, through the invocation mechanism.
 * @ownedAttributes
 *   • type        : Datatype [0..1] -- Optional association to the datatype
 *     of this control element. (§12.6.1)
 *   • codeElement : AbstractCodeElement [0..*] {ordered} (composite) --
 *     Represents owned code elements, such as local definitions and actions.
 *     (§12.6.1)
 * @associationEnds
 *   • Type -- type end
 *   • OwnedCode -- codeElement end (composite, ordered)
 * @operations
 *   getSignature()  : Signature [0..1] -- Signature of the current
 *     ControlElement.
 *   getReturnType() : Datatype  [0..1] -- Return Datatype of the current
 *     ControlElement.
 * @constraints
 *   1. ControlElement should have at least one stereotype.
 *   2. ControlElement should own a Signature.
 *   3. The Signature returned by the getSignature operation is the Signature
 *      owned by the ControlElement.
 *   4. The DataType returned by the getReturnType operation is the Datatype
 *      of the ParameterUnit owned by the Signature of the current
 *      ControlElement, where the ParameterKind of the ParameterUnit is
 *      "return." (§12.6.1)
 */
export interface IControlElement extends IComputationalObject {
  readonly type: IDatatype | undefined;
  readonly codeElement: ReadonlyArray<IAbstractCodeElement>;
  getSignature(): ISignature | undefined;
  getReturnType(): IDatatype | undefined;
}

export class ControlElement extends ComputationalObject implements IControlElement {
  override readonly metaClass: string = "ControlElement";
  readonly type: IDatatype | undefined;
  readonly codeElement: ReadonlyArray<IAbstractCodeElement>;
  constructor(args?: {
    name?: string;
    type?: IDatatype;
    codeElement?: ReadonlyArray<IAbstractCodeElement>;
  }) {
    super(args);
    this.type = args?.type;
    this.codeElement = args?.codeElement ?? [];
  }
  override getOwnedElement(): ReadonlyArray<IKDMEntity> {
    return this.codeElement as ReadonlyArray<IKDMEntity>;
  }
  getSignature(): ISignature | undefined {
    for (const ce of this.codeElement) {
      // Reflective lookup: a Signature is the unique owned Datatype-with-
      // metaClass-"Signature" per §12.6.1 Constraint 2.
      const mc = (ce as { metaClass?: string }).metaClass;
      if (mc === "Signature") return ce as unknown as ISignature;
    }
    return undefined;
  }
  getReturnType(): IDatatype | undefined {
    const sig = this.getSignature();
    if (sig === undefined) return undefined;
    for (const p of sig.parameterUnit) {
      if (p.kind === ParameterKind.Return) return p.type;
    }
    return undefined;
  }
}

// ─── 64. CallableUnit (§12.6.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.6.2
 * @metaclass CallableUnit (concrete)
 * @generalization ControlElement
 * @definition The CallableUnit represents a basic stand-alone element that can
 *   be called, such as a procedure or a function. From the runtime
 *   perspective, a CallableUnit element represents a single computational
 *   object, which is identified directly (using the name) or indirectly
 *   (using a reference). A CallableUnit represents global or local procedures
 *   and functions.
 * @ownedAttributes
 *   • kind     : CallableKind -- Indicator of the kind of the callable unit.
 *   • isStatic : Boolean -- Indicates that the element is declared as
 *     "static" (is visible only in the owner CompilationUnit). (§12.6.2)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.6.2)
 */
export interface ICallableUnit extends IControlElement {
  readonly kind: CallableKind;
  readonly isStatic: boolean;
}

export class CallableUnit extends ControlElement implements ICallableUnit {
  override readonly metaClass = "CallableUnit" as const;
  readonly kind: CallableKind;
  readonly isStatic: boolean;
  constructor(args?: {
    name?: string;
    type?: IDatatype;
    codeElement?: ReadonlyArray<IAbstractCodeElement>;
    kind?: CallableKind;
    isStatic?: boolean;
  }) {
    super(args);
    this.kind = args?.kind ?? CallableKind.Unknown;
    this.isStatic = args?.isStatic ?? false;
  }
}

// ─── 65. MethodUnit (§12.6.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.6.4
 * @metaclass MethodUnit (concrete)
 * @generalization ControlElement
 * @definition The MethodUnit represents member functions owned by a ClassUnit,
 *   including user-defined operators, constructors, and destructors. From the
 *   runtime perspective, each MethodUnit element represents a computational
 *   object that exists in the context of some class instance.
 * @ownedAttributes
 *   • kind       : MethodKind -- Indicator of the kind of the method.
 *   • export     : ExportKind -- Represents the visibility of the method.
 *   • isFinal    : Boolean -- Method may not be redefined in a subtype.
 *   • isStatic   : Boolean -- Method characterizes the ClassUnit.
 *   • isVirtual  : Boolean -- Method is declared as virtual.
 *   • isAbstract : Boolean -- Method is declared as abstract or part of an
 *     interface. (§12.6.4)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.6.4)
 */
export interface IMethodUnit extends IControlElement {
  readonly kind: MethodKind;
  readonly export: ExportKind;
  readonly isFinal: boolean;
  readonly isStatic: boolean;
  readonly isVirtual: boolean;
  readonly isAbstract: boolean;
}

export class MethodUnit extends ControlElement implements IMethodUnit {
  override readonly metaClass = "MethodUnit" as const;
  readonly kind: MethodKind;
  readonly export: ExportKind;
  readonly isFinal: boolean;
  readonly isStatic: boolean;
  readonly isVirtual: boolean;
  readonly isAbstract: boolean;
  constructor(args?: {
    name?: string;
    type?: IDatatype;
    codeElement?: ReadonlyArray<IAbstractCodeElement>;
    kind?: MethodKind;
    export?: ExportKind;
    isFinal?: boolean;
    isStatic?: boolean;
    isVirtual?: boolean;
    isAbstract?: boolean;
  }) {
    super(args);
    this.kind = args?.kind ?? MethodKind.Unknown;
    this.export = args?.export ?? ExportKind.Unknown;
    this.isFinal = args?.isFinal ?? false;
    this.isStatic = args?.isStatic ?? false;
    this.isVirtual = args?.isVirtual ?? false;
    this.isAbstract = args?.isAbstract ?? false;
  }
}

// ─── 66. DataElement (§12.7.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.7.1
 * @metaclass DataElement (generic / concrete)
 * @generalization ComputationalObject
 * @definition The DataElement class is a generic modeling element that defines
 *   the common properties of several concrete classes that represent the
 *   named data items of existing software systems (for example, global and
 *   local variables, record fields, and formal parameters).
 * @ownedAttributes
 *   • ext         : String -- Optional extension representing the original
 *     representation of the data element.
 *   • size        : Integer -- Specifies the optional constraint on the number
 *     of elements any value of the storable element may contain.
 *   • type        : Datatype [1] -- The datatype of the DataElement that
 *     describes the values of the DataElement.
 *   • codeElement : Datatype [0..*] (composite) -- Anonymous datatypes used
 *     in the definition of the datatype of the current DataElement. (§12.7.1)
 * @associationEnds
 *   • Type -- type end
 *   • AnonymousTypes -- codeElement end (composite)
 * @operations (none)
 * @constraints
 *   1. DataElement class should have at least one Stereotype. (§12.7.1)
 */
export interface IDataElement extends IComputationalObject {
  readonly ext: string;
  readonly size: number;
  readonly type: IDatatype | undefined;
  readonly codeElement: ReadonlyArray<IDatatype>;
}

export class DataElement extends ComputationalObject implements IDataElement {
  override readonly metaClass: string = "DataElement";
  readonly ext: string;
  readonly size: number;
  readonly type: IDatatype | undefined;
  readonly codeElement: ReadonlyArray<IDatatype>;
  constructor(args?: {
    name?: string;
    ext?: string;
    size?: number;
    type?: IDatatype;
    codeElement?: ReadonlyArray<IDatatype>;
  }) {
    super(args);
    this.ext = args?.ext ?? "";
    this.size = args?.size ?? 0;
    this.type = args?.type;
    this.codeElement = args?.codeElement ?? [];
  }
}

// ─── 67. StorableUnit (§12.7.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.7.2
 * @metaclass StorableUnit (concrete)
 * @generalization DataElement
 * @definition StorableUnit class is a concrete subclass of the DataElement
 *   class that represents variables of the existing software system.
 *   StorableUnit represents both global and local variables.
 * @ownedAttributes
 *   • kind     : StorableKind -- Optional attribute that specifies the common
 *     details of a StorableUnit. (§12.7.2)
 *   • isStatic : Boolean -- Indicates that the element is declared as
 *     "static." (§12.7.2)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.7.2)
 */
export interface IStorableUnit extends IDataElement {
  readonly kind: StorableKind;
  readonly isStatic: boolean;
}

export class StorableUnit extends DataElement implements IStorableUnit {
  override readonly metaClass = "StorableUnit" as const;
  readonly kind: StorableKind;
  readonly isStatic: boolean;
  constructor(args?: {
    name?: string;
    ext?: string;
    size?: number;
    type?: IDatatype;
    codeElement?: ReadonlyArray<IDatatype>;
    kind?: StorableKind;
    isStatic?: boolean;
  }) {
    super(args);
    this.kind = args?.kind ?? StorableKind.Unknown;
    this.isStatic = args?.isStatic ?? false;
  }
}

// ─── 68. ItemUnit (§12.7.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.7.4
 * @metaclass ItemUnit (concrete)
 * @generalization DataElement
 * @definition ItemUnit class is a concrete subclass of the DataElement class
 *   that represents anonymous data items that are parts of complex datatypes;
 *   for example, record fields, pointers, and arrays.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.7.4)
 */
export interface IItemUnit extends IDataElement {}

export class ItemUnit extends DataElement implements IItemUnit {
  override readonly metaClass = "ItemUnit" as const;
}

// ─── 69. IndexUnit (§12.7.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.7.5
 * @metaclass IndexUnit (concrete)
 * @generalization DataElement
 * @definition IndexUnit class is a concrete subclass of the DataElement class
 *   that represents an index of an array datatype. IndexUnit is an optional
 *   element. When an IndexUnit is omitted, it is assumed to be a data element
 *   of IntegerType.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.7.5)
 */
export interface IIndexUnit extends IDataElement {}

export class IndexUnit extends DataElement implements IIndexUnit {
  override readonly metaClass = "IndexUnit" as const;
}

// ─── 70. MemberUnit (§12.7.6) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.7.6
 * @metaclass MemberUnit (concrete)
 * @generalization DataElement
 * @definition MemberUnit class is a concrete subclass of the DataElement
 *   class that represents a member of a class type. MemberUnit represents a
 *   member of a class.
 * @ownedAttributes
 *   • export   : ExportKind -- Visibility of the member.
 *   • isFinal  : Boolean    -- Indicates that the member may not be redefined
 *     in a subtype.
 *   • isStatic : Boolean    -- Indicates that the member characterizes the
 *     ClassUnit. (§12.7.6)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints
 *   1. MemberUnit can be owned only by a ClassUnit. (§12.7.6)
 */
export interface IMemberUnit extends IDataElement {
  readonly export: ExportKind;
  readonly isFinal: boolean;
  readonly isStatic: boolean;
}

export class MemberUnit extends DataElement implements IMemberUnit {
  override readonly metaClass = "MemberUnit" as const;
  readonly export: ExportKind;
  readonly isFinal: boolean;
  readonly isStatic: boolean;
  constructor(args?: {
    name?: string;
    ext?: string;
    size?: number;
    type?: IDatatype;
    codeElement?: ReadonlyArray<IDatatype>;
    export?: ExportKind;
    isFinal?: boolean;
    isStatic?: boolean;
  }) {
    super(args);
    this.export = args?.export ?? ExportKind.Unknown;
    this.isFinal = args?.isFinal ?? false;
    this.isStatic = args?.isStatic ?? false;
  }
}

// ─── 71. ParameterUnit (§12.7.7) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.7.7
 * @metaclass ParameterUnit (concrete)
 * @generalization DataElement
 * @definition ParameterUnit class is a concrete subclass of the DataElement
 *   class that represents a formal parameter; for example, a formal parameter
 *   of a procedure. ParameterUnits are owned by the Signature element.
 * @ownedAttributes
 *   • kind    : ParameterKind -- Optional attribute defining the parameter
 *     passing convention.
 *   • isFinal : Boolean       -- Indicates that the parameter may not be
 *     written to.
 *   • pos     : Integer       -- Position of the attribute in the signature.
 *     (§12.7.7)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints
 *   1. Return parameter of a signature does not have a pos attribute.
 *   2. Return ParameterUnit in a signature should have a kind="return."
 *   3. There can be at most one ParameterUnit within a certain Signature with
 *      a return kind. (§12.7.7)
 */
export interface IParameterUnit extends IDataElement {
  readonly kind: ParameterKind;
  readonly isFinal: boolean;
  readonly pos: number;
}

export class ParameterUnit extends DataElement implements IParameterUnit {
  override readonly metaClass = "ParameterUnit" as const;
  readonly kind: ParameterKind;
  readonly isFinal: boolean;
  readonly pos: number;
  constructor(args?: {
    name?: string;
    ext?: string;
    size?: number;
    type?: IDatatype;
    codeElement?: ReadonlyArray<IDatatype>;
    kind?: ParameterKind;
    isFinal?: boolean;
    pos?: number;
  }) {
    super(args);
    this.kind = args?.kind ?? ParameterKind.ByValue;
    this.isFinal = args?.isFinal ?? false;
    this.pos = args?.pos ?? 0;
  }
}

// ─── 72. ValueElement (§12.8.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.8.1
 * @metaclass ValueElement (generic / concrete)
 * @generalization DataElement
 * @definition ValueElement class is a generic meta-model element that
 *   represents values used in the artifacts of existing software systems.
 *   This class defines the common properties of the concrete subclasses, for
 *   which more precise semantics is provided.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints
 *   1. ValueElement and its subclasses should not have owned code elements.
 *   2. ValueElement and its subclasses cannot be used as the target of
 *      relations Writes and Addresses.
 *   3. ValueElement class instance should have at least one Stereotype.
 *      (§12.8.1)
 */
export interface IValueElement extends IDataElement {}

export class ValueElement extends DataElement implements IValueElement {
  override readonly metaClass: string = "ValueElement";
}

// ─── 73. Value (§12.8.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.8.2
 * @metaclass Value (concrete)
 * @generalization ValueElement
 * @definition Value class is a meta-model element that represents values used
 *   in the artifacts of existing software systems. Value class corresponds to
 *   ISO/IEC 11404 literals of primitive types, such as boolean-literal,
 *   state-literal, enumerated-literal, character-literal, ordinal-literal,
 *   time-literal, integer-literal, rational-literal, scaled-literal,
 *   real-literal, void-literal, pointer-literal, bitstring-literal,
 *   string-literal. The name attribute of the ValueClass represents the name
 *   or a string representation of the value.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.8.2)
 */
export interface IValue extends IValueElement {}

export class Value extends ValueElement implements IValue {
  override readonly metaClass = "Value" as const;
}

// ─── 74. ValueList (§12.8.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.8.3
 * @metaclass ValueList (concrete)
 * @generalization ValueElement
 * @definition The ValueList class is a meta-model element that represents
 *   values of aggregated datatypes. A ValueList is a data element associated
 *   with a single value of some non-primitive datatype. The value of the
 *   complex datatype is represented as a tuple of values for each
 *   subcomponent of the complex datatype.
 * @ownedAttributes
 *   • valueElement : ValueElement [0..*] (composite) -- component values
 *     (§12.8.3)
 * @associationEnds
 *   • Components -- valueElement end (composite)
 * @operations (none)
 * @constraints (none declared in §12.8.3)
 */
export interface IValueList extends IValueElement {
  readonly valueElement: ReadonlyArray<IValueElement>;
}

export class ValueList extends ValueElement implements IValueList {
  override readonly metaClass = "ValueList" as const;
  readonly valueElement: ReadonlyArray<IValueElement>;
  constructor(args?: {
    name?: string;
    ext?: string;
    size?: number;
    type?: IDatatype;
    codeElement?: ReadonlyArray<IDatatype>;
    valueElement?: ReadonlyArray<IValueElement>;
  }) {
    super(args);
    this.valueElement = args?.valueElement ?? [];
  }
}

// ─── 75. PrimitiveType (§12.10.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.10.1
 * @metaclass PrimitiveType (generic / concrete)
 * @generalization Datatype
 * @definition The PrimitiveType is a generic meta-model element that
 *   represents primitive data types determined by various programming
 *   languages.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints
 *   1. PrimitiveType should have at least one stereotype. (§12.10.1)
 */
export interface IPrimitiveType extends IDatatype {}

export class PrimitiveType extends Datatype implements IPrimitiveType {
  override readonly metaClass: string = "PrimitiveType";
}

// ─── 76. BooleanType (§12.10.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.10.2
 * @metaclass BooleanType (concrete)
 * @generalization PrimitiveType
 * @definition The BooleanType is a meta-model element that represents Boolean
 *   data types common to various programming languages. The KDM BooleanType
 *   class corresponds to ISO/IEC 11404 Boolean datatype.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.10.2)
 */
export interface IBooleanType extends IPrimitiveType {}

export class BooleanType extends PrimitiveType implements IBooleanType {
  override readonly metaClass = "BooleanType" as const;
}

// ─── 77. CharType (§12.10.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.10.3
 * @metaclass CharType (concrete)
 * @generalization PrimitiveType
 * @definition The CharType is a meta-model element that represents character
 *   data types common to various programming languages. Character is a family
 *   of datatypes whose value spaces are character-sets. The KDM CharType
 *   class corresponds to ISO/IEC 11404 Character datatype.
 * @ownedAttributes
 *   • charset : String -- ISO identification of the characterset. (§12.10.3)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.10.3)
 */
export interface ICharType extends IPrimitiveType {
  readonly charset: string;
}

export class CharType extends PrimitiveType implements ICharType {
  override readonly metaClass = "CharType" as const;
  readonly charset: string;
  constructor(args?: { name?: string; charset?: string }) {
    super(args);
    this.charset = args?.charset ?? "ISO-8859-1";
  }
}

// ─── 78. OrdinalType (§12.10.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.10.4
 * @metaclass OrdinalType (concrete)
 * @generalization PrimitiveType
 * @definition The OrdinalType class is a meta-model element that represents
 *   ordinal datatypes available in some programming languages. Ordinal is the
 *   datatype of the ordinal numbers, as distinct from the quantifying numbers
 *   (datatype Integer). The KDM OrdinalType class corresponds to ISO/IEC
 *   11404 Ordinal datatype.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.10.4)
 */
export interface IOrdinalType extends IPrimitiveType {}

export class OrdinalType extends PrimitiveType implements IOrdinalType {
  override readonly metaClass = "OrdinalType" as const;
}

// ─── 79. DateType (§12.10.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.10.5
 * @metaclass DateType (concrete)
 * @generalization PrimitiveType
 * @definition The DateType is a meta-model element that represents built-in
 *   data types related to dates.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.10.5)
 */
export interface IDateType extends IPrimitiveType {}

export class DateType extends PrimitiveType implements IDateType {
  override readonly metaClass = "DateType" as const;
}

// ─── 80. TimeType (§12.10.6) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.10.6
 * @metaclass TimeType (concrete)
 * @generalization PrimitiveType
 * @definition The TimeType is a meta-model element that represents built-in
 *   data types related to time. Time is a family of datatypes whose values
 *   are points in time to various common resolutions.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.10.6)
 */
export interface ITimeType extends IPrimitiveType {}

export class TimeType extends PrimitiveType implements ITimeType {
  override readonly metaClass = "TimeType" as const;
}

// ─── 81. IntegerType (§12.10.7) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.10.7
 * @metaclass IntegerType (concrete)
 * @generalization PrimitiveType
 * @definition The IntegerType is a meta-model element that represents integer
 *   data type common to various programming languages. The KDM IntegerType
 *   class corresponds to ISO/IEC 11404 Integer datatype.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.10.7)
 */
export interface IIntegerType extends IPrimitiveType {}

export class IntegerType extends PrimitiveType implements IIntegerType {
  override readonly metaClass = "IntegerType" as const;
}

// ─── 82. DecimalType (§12.10.8) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.10.8
 * @metaclass DecimalType (concrete)
 * @generalization PrimitiveType
 * @definition The DecimalType is a meta-model element that represents decimal
 *   data types common to various programming languages.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.10.8)
 */
export interface IDecimalType extends IPrimitiveType {}

export class DecimalType extends PrimitiveType implements IDecimalType {
  override readonly metaClass = "DecimalType" as const;
}

// ─── 83. ScaledType (§12.10.9) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.10.9
 * @metaclass ScaledType (concrete)
 * @generalization PrimitiveType
 * @definition The ScaledType is a meta-model element that represents fixed
 *   point data types common to various programming languages. The KDM
 *   ScaledType class corresponds to ISO/IEC 11404 Scaled datatype.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.10.9)
 */
export interface IScaledType extends IPrimitiveType {}

export class ScaledType extends PrimitiveType implements IScaledType {
  override readonly metaClass = "ScaledType" as const;
}

// ─── 84. FloatType (§12.10.10) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.10.10
 * @metaclass FloatType (concrete)
 * @generalization PrimitiveType
 * @definition The FloatType is a meta-model element that represents float
 *   data types common to various programming languages. The KDM FloatType
 *   class corresponds to ISO/IEC 11404 Real datatype.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.10.10)
 */
export interface IFloatType extends IPrimitiveType {}

export class FloatType extends PrimitiveType implements IFloatType {
  override readonly metaClass = "FloatType" as const;
}

// ─── 85. VoidType (§12.10.11) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.10.11
 * @metaclass VoidType (concrete)
 * @generalization PrimitiveType
 * @definition The VoidType is a meta-model element that represents built-in
 *   "void" type defined in certain programming languages. The KDM VoidType
 *   class corresponds to ISO/IEC 11404 Void datatype.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.10.11)
 */
export interface IVoidType extends IPrimitiveType {}

export class VoidType extends PrimitiveType implements IVoidType {
  override readonly metaClass = "VoidType" as const;
}

// ─── 86. StringType (§12.10.12) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.10.12
 * @metaclass StringType (concrete)
 * @generalization PrimitiveType
 * @definition The StringType is a meta-model element that represents string
 *   data type common to various programming languages. The KDM StringType
 *   class corresponds to ISO/IEC 11404 defined datatype Character string.
 * @ownedAttributes
 *   • charset : String -- ISO identification of the characterset. (§12.10.12)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.10.12)
 */
export interface IStringType extends IPrimitiveType {
  readonly charset: string;
}

export class StringType extends PrimitiveType implements IStringType {
  override readonly metaClass = "StringType" as const;
  readonly charset: string;
  constructor(args?: { name?: string; charset?: string }) {
    super(args);
    this.charset = args?.charset ?? "ISO-8859-1";
  }
}

// ─── 87. BitType (§12.10.13) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.10.13
 * @metaclass BitType (concrete)
 * @generalization PrimitiveType
 * @definition The BitType class is a meta-model element representing the bit
 *   datatype available in some programming languages. The KDM BitType class
 *   corresponds to ISO/IEC 11404 defined datatype Bit.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.10.13)
 */
export interface IBitType extends IPrimitiveType {}

export class BitType extends PrimitiveType implements IBitType {
  override readonly metaClass = "BitType" as const;
}

// ─── 88. BitstringType (§12.10.14) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.10.14
 * @metaclass BitstringType (concrete)
 * @generalization PrimitiveType
 * @definition The BitstringType class is a meta-model element that represents
 *   bit string datatypes available in some programming languages. The KDM
 *   BitstringType class corresponds to ISO/IEC 11404 defined datatype Bit
 *   string.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.10.14)
 */
export interface IBitstringType extends IPrimitiveType {}

export class BitstringType extends PrimitiveType implements IBitstringType {
  override readonly metaClass = "BitstringType" as const;
}

// ─── 89. OctetType (§12.10.15) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.10.15
 * @metaclass OctetType (concrete)
 * @generalization PrimitiveType
 * @definition The OctetType class is a meta-model element that represents
 *   octet datatypes available in some programming languages. The KDM
 *   OctetType class corresponds to ISO/IEC 11404 defined datatype Octet.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.10.15)
 */
export interface IOctetType extends IPrimitiveType {}

export class OctetType extends PrimitiveType implements IOctetType {
  override readonly metaClass = "OctetType" as const;
}

// ─── 90. OctetstringType (§12.10.16) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.10.16
 * @metaclass OctetstringType (concrete)
 * @generalization PrimitiveType
 * @definition The OctetstringType class is a meta-model element that
 *   represents octet string datatypes available in some programming
 *   languages. The KDM OctetstringType class corresponds to ISO/IEC 11404
 *   defined datatype Octet string.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.10.16)
 */
export interface IOctetstringType extends IPrimitiveType {}

export class OctetstringType extends PrimitiveType implements IOctetstringType {
  override readonly metaClass = "OctetstringType" as const;
}

// ─── 91. EnumeratedType (§12.11.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.11.1
 * @metaclass EnumeratedType (concrete)
 * @generalization Datatype
 * @definition The EnumeratedType is a meta-model element that represents
 *   user-defined enumerated data types. EnumeratedType corresponds to ISO/IEC
 *   11404 Enumerated and State families of datatypes. Values of the
 *   Enumerated and State datatypes are represented by a Value meta-model
 *   element that is owned by the EnumeratedType.
 * @ownedAttributes
 *   • value : Value [0..*] {ordered} (composite) -- The list of enumerated
 *     literals defined for the given EnumeratedType. (§12.11.1)
 * @associationEnds
 *   • EnumLiterals -- value end (composite, ordered)
 * @operations (none)
 * @constraints
 *   1. Each ValueElement owned by an EnumeratedType shall have its type
 *      property set to this EnumeratedType. (§12.11.1)
 */
export interface IEnumeratedType extends IDatatype {
  readonly value: ReadonlyArray<IValue>;
}

export class EnumeratedType extends Datatype implements IEnumeratedType {
  override readonly metaClass = "EnumeratedType" as const;
  readonly value: ReadonlyArray<IValue>;
  constructor(args?: { name?: string; value?: ReadonlyArray<IValue> }) {
    super(args);
    this.value = args?.value ?? [];
  }
}

// ─── 92. CompositeType (§12.12.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.12.1
 * @metaclass CompositeType (generic / concrete)
 * @generalization Datatype
 * @definition The CompositeType is a meta-model element that represents
 *   user-defined composite datatypes, such as records, structures, and
 *   unions. CompositeType class corresponds to ISO/IEC 11404 generated
 *   datatypes each of whose values is made up of values of component
 *   datatypes.
 * @ownedAttributes
 *   • itemUnit : ItemUnit [0..*] {ordered} (composite) -- The list of named
 *     items that represent components of the composite datatype. (§12.12.1)
 * @associationEnds
 *   • Components -- itemUnit end (composite, ordered)
 * @operations (none)
 * @constraints
 *   1. CompositeType class should be used with a stereotype. (§12.12.1)
 */
export interface ICompositeType extends IDatatype {
  readonly itemUnit: ReadonlyArray<IItemUnit>;
}

export class CompositeType extends Datatype implements ICompositeType {
  override readonly metaClass: string = "CompositeType";
  readonly itemUnit: ReadonlyArray<IItemUnit>;
  constructor(args?: { name?: string; itemUnit?: ReadonlyArray<IItemUnit> }) {
    super(args);
    this.itemUnit = args?.itemUnit ?? [];
  }
}

// ─── 93. RecordType (§12.12.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.12.3
 * @metaclass RecordType (concrete)
 * @generalization CompositeType
 * @definition The RecordType class is a meta-model element that represents
 *   record datatypes: user-defined datatypes in existing software systems,
 *   whose values are heterogeneous aggregations (tuples) of values of
 *   component datatypes.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.12.3)
 */
export interface IRecordType extends ICompositeType {}

export class RecordType extends CompositeType implements IRecordType {
  override readonly metaClass = "RecordType" as const;
}

// ─── 94. ChoiceType (§12.12.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.12.2
 * @metaclass ChoiceType (concrete)
 * @generalization CompositeType
 * @definition The ChoiceType class is a meta-model element that represents
 *   choice datatypes: user-defined datatypes in existing software systems,
 *   each of whose values is a single value from any of a set of alternative
 *   datatypes. Examples: Pascal/Ada variant record, C union.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.12.2)
 */
export interface IChoiceType extends ICompositeType {}

export class ChoiceType extends CompositeType implements IChoiceType {
  override readonly metaClass = "ChoiceType" as const;
}

// ─── 95. DerivedType (§12.13.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.13.1
 * @metaclass DerivedType (generic / concrete)
 * @generalization Datatype
 * @definition DerivedType class defines common properties for its specific
 *   subclasses, each of which has distinct semantics. DerivedType corresponds
 *   to several ISO/IEC 11404 aggregated datatypes, whose values are made up
 *   of values of a single component datatype.
 * @ownedAttributes
 *   • itemUnit : ItemUnit [0..*] (composite) -- The ItemUnit that represents
 *     the base class of the derived type. (§12.13.1)
 * @associationEnds
 *   • Component -- itemUnit end (composite)
 * @operations (none)
 * @constraints
 *   1. DerivedType class should be used with a stereotype. (§12.13.1)
 */
export interface IDerivedType extends IDatatype {
  readonly itemUnit: ReadonlyArray<IItemUnit>;
}

export class DerivedType extends Datatype implements IDerivedType {
  override readonly metaClass: string = "DerivedType";
  readonly itemUnit: ReadonlyArray<IItemUnit>;
  constructor(args?: { name?: string; itemUnit?: ReadonlyArray<IItemUnit> }) {
    super(args);
    this.itemUnit = args?.itemUnit ?? [];
  }
}

// ─── 96. ArrayType (§12.13.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.13.2
 * @metaclass ArrayType (concrete)
 * @generalization DerivedType
 * @definition The ArrayType is a meta-model element that represents array
 *   datatypes. ArrayType corresponds to ISO/IEC 11404 array datatype.
 *   Multidimensional arrays are represented by nested ArrayType elements.
 * @ownedAttributes
 *   • size      : Integer -- The size of the array (the maximum number of
 *     elements). (§12.13.2)
 *   • indexUnit : IndexUnit [0..1] (composite) -- The optional index of the
 *     array. (§12.13.2)
 * @associationEnds
 *   • Index -- indexUnit end (composite)
 * @operations (none)
 * @constraints
 *   1. Any anonymous datatype used by IndexUnit of the ArrayType should be
 *      owned by that IndexUnit. (§12.13.2)
 */
export interface IArrayType extends IDerivedType {
  readonly size: number;
  readonly indexUnit: IIndexUnit | undefined;
}

export class ArrayType extends DerivedType implements IArrayType {
  override readonly metaClass = "ArrayType" as const;
  readonly size: number;
  readonly indexUnit: IIndexUnit | undefined;
  constructor(args?: {
    name?: string;
    itemUnit?: ReadonlyArray<IItemUnit>;
    size?: number;
    indexUnit?: IIndexUnit;
  }) {
    super(args);
    this.size = args?.size ?? 0;
    this.indexUnit = args?.indexUnit;
  }
}

// ─── 97. PointerType (§12.13.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.13.3
 * @metaclass PointerType (concrete)
 * @generalization DerivedType
 * @definition The PointerType is a meta-model element that represents pointer
 *   datatypes whose values constitute a means of reference to values of
 *   another datatype, designated the element datatype.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.13.3)
 */
export interface IPointerType extends IDerivedType {}

export class PointerType extends DerivedType implements IPointerType {
  override readonly metaClass = "PointerType" as const;
}

// ─── 98. RangeType (§12.13.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.13.4
 * @metaclass RangeType (concrete)
 * @generalization DerivedType
 * @definition RangeType is a meta-model element that represents user-defined
 *   subtypes of any ordered datatype by placing new upper and/or lower bounds
 *   on the value space.
 * @ownedAttributes
 *   • lower : Value [0..1] (composite) -- The optional lower boundary of the
 *     range. (§12.13.4)
 *   • upper : Value [0..1] (composite) -- The optional upper boundary of the
 *     range. (§12.13.4)
 * @associationEnds
 *   • LowerBound -- lower end (composite)
 *   • UpperBound -- upper end (composite)
 * @operations (none)
 * @constraints
 *   1. At least one boundary value element should be present.
 *   2. The type property of a boundary Value element owned by a RangeType
 *      shall be the same as the type property of the owned ItemUnit of this
 *      RangeType instance. (§12.13.4)
 */
export interface IRangeType extends IDerivedType {
  readonly lower: IValue | undefined;
  readonly upper: IValue | undefined;
}

export class RangeType extends DerivedType implements IRangeType {
  override readonly metaClass = "RangeType" as const;
  readonly lower: IValue | undefined;
  readonly upper: IValue | undefined;
  constructor(args?: {
    name?: string;
    itemUnit?: ReadonlyArray<IItemUnit>;
    lower?: IValue;
    upper?: IValue;
  }) {
    super(args);
    this.lower = args?.lower;
    this.upper = args?.upper;
  }
}

// ─── 99. BagType (§12.13.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.13.5
 * @metaclass BagType (concrete)
 * @generalization DerivedType
 * @definition BagType class is a meta-model element that represents bag types
 *   in existing software systems: the user-defined datatypes, whose values
 *   are collections of instances of values from the element datatype.
 * @ownedAttributes
 *   • size : Integer -- (per Code.xsd) maximum size of the bag.
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.13.5)
 */
export interface IBagType extends IDerivedType {
  readonly size: number;
}

export class BagType extends DerivedType implements IBagType {
  override readonly metaClass = "BagType" as const;
  readonly size: number;
  constructor(args?: { name?: string; itemUnit?: ReadonlyArray<IItemUnit>; size?: number }) {
    super(args);
    this.size = args?.size ?? 0;
  }
}

// ─── 100. SetType (§12.13.6) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.13.6
 * @metaclass SetType (concrete)
 * @generalization DerivedType
 * @definition SetType is a meta-model element that represents set types in
 *   existing software systems: the user-defined datatypes, whose value space
 *   is the set of all subsets of the value space of the element datatype.
 * @ownedAttributes
 *   • size : Integer -- (per Code.xsd) maximum size of the set.
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.13.6)
 */
export interface ISetType extends IDerivedType {
  readonly size: number;
}

export class SetType extends DerivedType implements ISetType {
  override readonly metaClass = "SetType" as const;
  readonly size: number;
  constructor(args?: { name?: string; itemUnit?: ReadonlyArray<IItemUnit>; size?: number }) {
    super(args);
    this.size = args?.size ?? 0;
  }
}

// ─── 101. SequenceType (§12.13.7) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.13.7
 * @metaclass SequenceType (concrete)
 * @generalization DerivedType
 * @definition SequenceType class is a meta-model element that represents
 *   sequence types in existing software systems: the user-defined datatypes,
 *   whose values are ordered sequences of values from the element datatype.
 * @ownedAttributes
 *   • size : Integer -- (per Code.xsd) maximum size of the sequence.
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.13.7)
 */
export interface ISequenceType extends IDerivedType {
  readonly size: number;
}

export class SequenceType extends DerivedType implements ISequenceType {
  override readonly metaClass = "SequenceType" as const;
  readonly size: number;
  constructor(args?: { name?: string; itemUnit?: ReadonlyArray<IItemUnit>; size?: number }) {
    super(args);
    this.size = args?.size ?? 0;
  }
}

// ─── 102. Signature (§12.14.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.14.1
 * @metaclass Signature (concrete)
 * @generalization Datatype
 * @definition The Signature is a meta-model element that represents the
 *   concept of a procedure signature, which is common to various programming
 *   languages. Signature corresponds to a procedure-type family of datatypes
 *   from ISO/IEC 11404, and to a specific data element as part of a
 *   computational object represented by a ControlElement.
 * @ownedAttributes
 *   • parameterUnit : ParameterUnit [0..*] {ordered} (composite) -- The list
 *     of parameters of the current Signature. (§12.14.1)
 * @associationEnds
 *   • Parameters -- parameterUnit end (composite, ordered)
 * @operations (none)
 * @constraints (none declared in §12.14.1)
 */
export interface ISignature extends IDatatype {
  readonly parameterUnit: ReadonlyArray<IParameterUnit>;
}

export class Signature extends Datatype implements ISignature {
  override readonly metaClass = "Signature" as const;
  readonly parameterUnit: ReadonlyArray<IParameterUnit>;
  constructor(args?: { name?: string; parameterUnit?: ReadonlyArray<IParameterUnit> }) {
    super(args);
    this.parameterUnit = args?.parameterUnit ?? [];
  }
}

// ─── 103. DefinedType (§12.15.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.15.1
 * @metaclass DefinedType (generic / concrete)
 * @generalization Datatype
 * @definition The DefinedType is generic class that defines the common
 *   properties of several concrete classes that represent type declarations
 *   in existing software systems. DefinedType element represents a named
 *   element of existing software system, which corresponds to a user-defined
 *   datatype.
 * @ownedAttributes
 *   • type        : Datatype [1] -- The datatype of the DefinedType that
 *     describes the values of the corresponding datatype.
 *   • codeElement : Datatype [0..*] (composite) -- Anonymous datatypes used
 *     in the definition of the datatype. (§12.15.1)
 * @associationEnds
 *   • Type -- type end
 *   • AnonymousTypes -- codeElement end (composite)
 * @operations (none)
 * @constraints
 *   1. DefinedType class shall be used with at least one stereotype.
 *      (§12.15.1)
 */
export interface IDefinedType extends IDatatype {
  readonly type: IDatatype | undefined;
  readonly codeElement: ReadonlyArray<IDatatype>;
}

export class DefinedType extends Datatype implements IDefinedType {
  override readonly metaClass: string = "DefinedType";
  readonly type: IDatatype | undefined;
  readonly codeElement: ReadonlyArray<IDatatype>;
  constructor(args?: {
    name?: string;
    type?: IDatatype;
    codeElement?: ReadonlyArray<IDatatype>;
  }) {
    super(args);
    this.type = args?.type;
    this.codeElement = args?.codeElement ?? [];
  }
}

// ─── 104. TypeUnit (§12.15.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.15.2
 * @metaclass TypeUnit (concrete)
 * @generalization DefinedType
 * @definition The TypeUnit meta-model element represents the so-called new
 *   datatype declarations. New datatype declarations define the value-space
 *   of a new datatype, which is distinct from any other datatype. TypeUnit
 *   corresponds to ISO/IEC 11404 New datatype declaration and New generator
 *   declarations.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.15.2)
 */
export interface ITypeUnit extends IDefinedType {}

export class TypeUnit extends DefinedType implements ITypeUnit {
  override readonly metaClass = "TypeUnit" as const;
}

// ─── 105. SynonymType (§12.15.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.15.3
 * @metaclass SynonymType (concrete) -- spec text refers to "SynonymUnit" but
 *   Code.xsd uses "SynonymType"; both spell the same metaclass — we honor
 *   the wire-format name from the XSD (`code:SynonymType`).
 * @generalization DefinedType
 * @definition The Synonym meta-model element represents the so-called
 *   renaming declarations. Renaming declarations declare the type name to be
 *   a synonym for another datatype. SynonymType corresponds to ISO/IEC 11404
 *   Renaming declarations.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.15.3)
 */
export interface ISynonymType extends IDefinedType {}

export class SynonymType extends DefinedType implements ISynonymType {
  override readonly metaClass = "SynonymType" as const;
}

// ─── 106. ClassUnit (§12.16.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.16.1
 * @metaclass ClassUnit (concrete)
 * @generalization Datatype
 * @definition The ClassUnit is a meta-model element that represents
 *   user-defined classes in object-oriented languages. A class datatype is a
 *   named datatype that represents a class: an ordered collection of named
 *   elements, each of which can be another CodeItem, such as a MemberUnit or
 *   a MethodUnit.
 * @ownedAttributes
 *   • isAbstract  : Boolean    -- The indicator of an abstract class.
 *   • isFinal     : Boolean    -- May not have subtypes.
 *   • exportKind  : ExportKind -- Visibility of the class.
 *   • codeElement : AbstractCodeElement [0..*] {ordered} (composite) -- The
 *     list of class members and methods. (§12.16.1)
 * @associationEnds
 *   • OwnedCode -- codeElement end (composite, ordered)
 * @operations (none)
 * @constraints (none declared in §12.16.1)
 */
export interface IClassUnit extends IDatatype {
  readonly isAbstract: boolean;
  readonly isFinal: boolean;
  readonly exportKind: ExportKind;
  readonly codeElement: ReadonlyArray<IAbstractCodeElement>;
}

export class ClassUnit extends Datatype implements IClassUnit {
  override readonly metaClass = "ClassUnit" as const;
  readonly isAbstract: boolean;
  readonly isFinal: boolean;
  readonly exportKind: ExportKind;
  readonly codeElement: ReadonlyArray<IAbstractCodeElement>;
  constructor(args?: {
    name?: string;
    isAbstract?: boolean;
    isFinal?: boolean;
    exportKind?: ExportKind;
    codeElement?: ReadonlyArray<IAbstractCodeElement>;
  }) {
    super(args);
    this.isAbstract = args?.isAbstract ?? false;
    this.isFinal = args?.isFinal ?? false;
    this.exportKind = args?.exportKind ?? ExportKind.Unknown;
    this.codeElement = args?.codeElement ?? [];
  }
}

// ─── 107. InterfaceUnit (§12.16.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.16.2
 * @metaclass InterfaceUnit (concrete)
 * @generalization Datatype
 * @definition The InterfaceUnit is a meta-model element that represents the
 *   interface concept common to various programming languages. InterfaceUnit
 *   is a logical container for code items. InterfaceUnit corresponds to a
 *   compile time description of the capabilities, that can be implemented by
 *   computational objects.
 * @ownedAttributes
 *   • codeElement : CodeItem [0..*] {ordered} (composite) -- The list of
 *     TypeElements that corresponds with the target Interface. (§12.16.2)
 * @associationEnds
 *   • OwnedCode -- codeElement end (composite, ordered)
 * @operations (none)
 * @constraints (none declared in §12.16.2)
 */
export interface IInterfaceUnit extends IDatatype {
  readonly codeElement: ReadonlyArray<IAbstractCodeElement>;
}

export class InterfaceUnit extends Datatype implements IInterfaceUnit {
  override readonly metaClass = "InterfaceUnit" as const;
  readonly codeElement: ReadonlyArray<IAbstractCodeElement>;
  constructor(args?: {
    name?: string;
    codeElement?: ReadonlyArray<IAbstractCodeElement>;
  }) {
    super(args);
    this.codeElement = args?.codeElement ?? [];
  }
}

// ─── 108. TemplateElement (§12.17.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.17.1
 * @metaclass TemplateElement (generic / concrete)
 * @generalization Datatype
 * @definition The TemplateElement is a generic meta-model element that
 *   represents various code elements related to templates, their parameters
 *   and instantiations.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints
 *   1. TemplateElement class shall be used with at least one stereotype.
 *      (§12.17.1)
 */
export interface ITemplateElement extends IDatatype {}

export class TemplateElement extends Datatype implements ITemplateElement {
  override readonly metaClass: string = "TemplateElement";
}

// ─── 109. TemplateUnit (§12.17.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.17.2
 * @metaclass TemplateUnit (concrete)
 * @generalization TemplateElement
 * @definition The TemplateUnit is a meta-model element that represents
 *   parameterized datatypes, common to some programming languages; for
 *   example, Ada generics, Java generics, C++ templates.
 * @ownedAttributes
 *   • codeElement : AbstractCodeElement [0..*] (composite) -- Template formal
 *     parameters and the base datatype or computational object. (§12.17.2)
 * @associationEnds
 *   • OwnedCode -- codeElement end (composite)
 * @operations (none)
 * @constraints
 *   1. TemplateParameter should be first in the list of code elements owned
 *      by the TemplateUnit. (§12.17.2)
 */
export interface ITemplateUnit extends ITemplateElement {
  readonly codeElement: ReadonlyArray<IAbstractCodeElement>;
}

export class TemplateUnit extends TemplateElement implements ITemplateUnit {
  override readonly metaClass = "TemplateUnit" as const;
  readonly codeElement: ReadonlyArray<IAbstractCodeElement>;
  constructor(args?: {
    name?: string;
    codeElement?: ReadonlyArray<IAbstractCodeElement>;
  }) {
    super(args);
    this.codeElement = args?.codeElement ?? [];
  }
}

// ─── 110. TemplateParameter (§12.17.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.17.3
 * @metaclass TemplateParameter (concrete)
 * @generalization TemplateElement
 * @definition TemplateParameter is a meta-model element that represents
 *   parameters of a TemplateUnit. TemplateParameter represents a formal
 *   parameter of a type declaration with formal parameters (corresponding to
 *   ISO/IEC 11404). Correspondence between actual and formal parameters is
 *   positional.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.17.3)
 */
export interface ITemplateParameter extends ITemplateElement {}

export class TemplateParameter extends TemplateElement implements ITemplateParameter {
  override readonly metaClass = "TemplateParameter" as const;
}

// ─── 111. TemplateType (§12.17.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.17.4
 * @metaclass TemplateType (concrete)
 * @generalization TemplateElement
 * @definition TemplateType class is a meta-model element that represents
 *   references to parameterized datatypes. The TemplateType class owns the
 *   actual parameters to the datatype reference, represented by "ParameterTo"
 *   relationships. The TemplateType class also owns the "InstanceOf"
 *   relationship to the TemplateUnit that represents the referenced
 *   parameterized datatype.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints
 *   1. TemplateType class should be the origin only to template relations
 *      "InstanceOf" and "ParameterTo." (§12.17.4)
 */
export interface ITemplateType extends ITemplateElement {}

export class TemplateType extends TemplateElement implements ITemplateType {
  override readonly metaClass = "TemplateType" as const;
}

// ─── 112. NamespaceUnit (§12.25.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.25.1
 * @metaclass NamespaceUnit (concrete) -- spec text uses "Namespace" while the
 *   wire-format Code.xsd uses "NamespaceUnit"; we honor the XSD wire name.
 * @generalization CodeItem
 * @definition The Namespace is a specific meta-model element that represents
 *   the target of the VisibleIn or Imports visibility relationships. A
 *   Namespace is a group of code elements. A Namespace can be owned by Module
 *   element or one of its subclasses. Namespace class represents a unit of
 *   visibility (for example, the namespace concept in C++).
 * @ownedAttributes
 *   • groupedCode : CodeItem [0..*] -- A KDM group of code elements that
 *     belong to the namespace. The actual owners of these elements are the
 *     corresponding modules, not the namespace, since namespaces can, in
 *     general cross cut the module boundaries. (§12.25.1)
 * @associationEnds
 *   • Group -- groupedCode end (non-composite)
 * @operations (none)
 * @constraints
 *   1. Namespace element should not belong to own group. (§12.25.1)
 */
export interface INamespaceUnit extends ICodeItem {
  readonly groupedCode: ReadonlyArray<ICodeItem>;
}

export class NamespaceUnit extends CodeItem implements INamespaceUnit {
  readonly metaClass = "NamespaceUnit" as const;
  readonly groupedCode: ReadonlyArray<ICodeItem>;
  constructor(args?: {
    name?: string;
    groupedCode?: ReadonlyArray<ICodeItem>;
  }) {
    super();
    if (args?.name !== undefined) {
      Object.defineProperty(this, "name", { value: args.name, writable: false, enumerable: true });
    }
    this.groupedCode = args?.groupedCode ?? [];
  }
}

// ─── 113. CommentUnit (§12.24.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.24.1
 * @metaclass CommentUnit (concrete)
 * @generalization ModelElement -- (CommentUnit is special: it is a subclass of
 *   ModelElement, NOT KDMEntity, so that it can occur in all containers
 *   without restrictions; see §12.24.1)
 * @definition The CommentUnit is a meta-model element that represents
 *   comments in existing systems (including any special comments). CommentUnit
 *   element can be used to introduce comments during transformation of the
 *   existing system. CommentUnits are associated with a certain code element.
 * @ownedAttributes
 *   • text : String -- The representation of the comment. (§12.24.1)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints
 *   1. CommentUnit does not have SourceRef.
 *   2. The only connection of CommentUnit to the SourceFile is through the
 *      owner code element. (§12.24.1)
 */
export interface ICommentUnit extends IModelElement {
  readonly text: string;
}

export class CommentUnit extends ModelElement implements ICommentUnit {
  readonly metaClass = "CommentUnit" as const;
  readonly text: string;
  constructor(args?: { text?: string }) {
    super();
    this.text = args?.text ?? "";
  }
}

// ─── 114. PreprocessorDirective (§12.22.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.22.1
 * @metaclass PreprocessorDirective (generic / concrete)
 * @generalization AbstractCodeElement
 * @definition PreprocessorDirective is a generic meta-model element that
 *   represents preprocessor directives common to some programming languages
 *   (for example, the C language preprocessor capabilities). From the KDM
 *   perspective, each preprocessor directive (an embedded language statement)
 *   is a container for code elements (possibly empty).
 * @ownedAttributes
 *   • codeElement : AbstractCodeElement [0..*] (composite) -- This optional
 *     code element represents the content of the preprocessor directive.
 *     (§12.22.1)
 * @associationEnds
 *   • OwnedCode -- codeElement end (composite)
 * @operations (none)
 * @constraints
 *   1. PreprocessorDirective should have a stereotype. (§12.22.1)
 */
export interface IPreprocessorDirective extends IAbstractCodeElement {
  readonly codeElement: ReadonlyArray<IAbstractCodeElement>;
}

export class PreprocessorDirective extends AbstractCodeElement implements IPreprocessorDirective {
  readonly metaClass: string = "PreprocessorDirective";
  readonly codeElement: ReadonlyArray<IAbstractCodeElement>;
  constructor(args?: {
    name?: string;
    codeElement?: ReadonlyArray<IAbstractCodeElement>;
  }) {
    super();
    if (args?.name !== undefined) {
      Object.defineProperty(this, "name", { value: args.name, writable: false, enumerable: true });
    }
    this.codeElement = args?.codeElement ?? [];
  }
  override getOwnedElement(): ReadonlyArray<IKDMEntity> {
    return this.codeElement as ReadonlyArray<IKDMEntity>;
  }
}

// ─── 115. MacroUnit (§12.22.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.22.2
 * @metaclass MacroUnit (concrete)
 * @generalization PreprocessorDirective
 * @definition MacroUnit class represents macro definitions common to several
 *   programming languages. The kind attribute provides some additional
 *   semantic information about the macro definition.
 * @ownedAttributes
 *   • kind : MacroKind -- Additional semantic properties of the macro
 *     definition. (§12.22.2)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.22.2)
 */
export interface IMacroUnit extends IPreprocessorDirective {
  readonly kind: MacroKind;
}

export class MacroUnit extends PreprocessorDirective implements IMacroUnit {
  override readonly metaClass = "MacroUnit" as const;
  readonly kind: MacroKind;
  constructor(args?: {
    name?: string;
    codeElement?: ReadonlyArray<IAbstractCodeElement>;
    kind?: MacroKind;
  }) {
    super(args);
    this.kind = args?.kind ?? MacroKind.Unknown;
  }
}

// ─── 116. MacroDirective (§12.22.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.22.4
 * @metaclass MacroDirective (concrete)
 * @generalization PreprocessorDirective
 * @definition MacroDirective class represents the so-called "macro call," the
 *   occurrence of a macro name (possible with parameters) in the primary
 *   code, such that the preprocessor recognizes it and "expands" by
 *   substituting the macro directive construct with its "definition."
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.22.4)
 */
export interface IMacroDirective extends IPreprocessorDirective {}

export class MacroDirective extends PreprocessorDirective implements IMacroDirective {
  override readonly metaClass = "MacroDirective" as const;
}

// ─── 117. IncludeDirective (§12.22.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.22.5
 * @metaclass IncludeDirective (concrete)
 * @generalization PreprocessorDirective
 * @definition IncludeDirective class represents the so-called include
 *   directive, common to several programming languages and their
 *   preprocessors (for example, the COPY statement in Cobol, the #include
 *   directive in the C language).
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.22.5)
 */
export interface IIncludeDirective extends IPreprocessorDirective {}

export class IncludeDirective extends PreprocessorDirective implements IIncludeDirective {
  override readonly metaClass = "IncludeDirective" as const;
}

// ─── 118. ConditionalDirective (§12.22.6) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.22.6
 * @metaclass ConditionalDirective (concrete)
 * @generalization PreprocessorDirective
 * @definition ConditionalDirective class represents the so-called "variant"
 *   of a software system, resulting from the use of conditional compilation
 *   capabilities, common to several programming languages and their
 *   preprocessors. ConditionalDirective represents a single "branch" of the
 *   conditional compilation construct.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints (none declared in §12.22.6)
 */
export interface IConditionalDirective extends IPreprocessorDirective {}

export class ConditionalDirective extends PreprocessorDirective implements IConditionalDirective {
  override readonly metaClass = "ConditionalDirective" as const;
}

// ─── 119. CodeElement (§12.27.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.27.1
 * @metaclass CodeElement (generic / concrete)
 * @generalization CodeItem
 * @definition The CodeElement is a generic meta-model element that can be
 *   used to define new extended meta-model elements through the KDM
 *   light-weight extension mechanism.
 * @ownedAttributes (none new)
 * @associationEnds (none new)
 * @operations (none)
 * @constraints
 *   1. CodeElement should have at least one stereotype. (§12.27.1)
 */
export interface ICodeElement extends ICodeItem {}

export class CodeElement extends CodeItem implements ICodeElement {
  readonly metaClass = "CodeElement" as const;
  constructor(args?: { name?: string }) {
    super();
    if (args?.name !== undefined) {
      Object.defineProperty(this, "name", { value: args.name, writable: false, enumerable: true });
    }
  }
}

// ─── Code-package relationships (§12.18 + §12.19 + §12.20 + §12.21 + §12.23 +
//     §12.26 + §12.27.2) ───

// ─── 120. CodeRelationship (§12.27.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.27.2
 * @metaclass CodeRelationship (generic / concrete)
 * @generalization AbstractCodeRelationship
 * @definition The CodeRelationship is a generic meta-model element that can
 *   be used to define new extended meta-model elements through the KDM
 *   light-weight extension mechanism.
 * @ownedAttributes
 *   • from : CodeItem  [1] -- the CodeItem.
 *   • to   : KDMEntity [1] -- the KDMEntity. (§12.27.2)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. CodeRelationship should have at least one stereotype. (§12.27.2)
 */
export interface ICodeRelationship extends IAbstractCodeRelationship {
  readonly from: ICodeItem;
  readonly to: IKDMEntity;
}

export class CodeRelationship extends AbstractCodeRelationship implements ICodeRelationship {
  readonly metaClass: string = "CodeRelationship";
  readonly from: ICodeItem;
  readonly to: IKDMEntity;
  constructor(args: { from: ICodeItem; to: IKDMEntity }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 121. Imports (§12.26.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.26.2
 * @metaclass Imports (concrete)
 * @generalization AbstractCodeRelationship
 * @definition The Imports meta-model element represents an association
 *   between two CodeItems where one CodeItem "imports" definitions from
 *   another. The "import" relationship is common to several programming
 *   languages.
 * @ownedAttributes
 *   • from : CodeItem [1] -- The "consumer" of the imported definitions.
 *   • to   : CodeItem [1] -- The "owner" of the imported definitions.
 *     (§12.26.2)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. The origin of the Imports relationship should be a subclass of Module.
 *      (§12.26.2)
 */
export interface IImports extends IAbstractCodeRelationship {
  readonly from: ICodeItem;
  readonly to: ICodeItem;
}

export class Imports extends AbstractCodeRelationship implements IImports {
  readonly metaClass = "Imports" as const;
  readonly from: ICodeItem;
  readonly to: ICodeItem;
  constructor(args: { from: ICodeItem; to: ICodeItem }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 122. Extends (§12.21.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.21.1
 * @metaclass Extends (concrete)
 * @generalization AbstractCodeRelationship
 * @definition The Extends is a specific meta-model element that represents
 *   semantic relation between two classes, where one class (called a "child"
 *   class) extends another class (called its "parent" class) through
 *   inheritance.
 * @ownedAttributes
 *   • from : Datatype [1] -- the child Class.
 *   • to   : Datatype [1] -- the parent Class. (§12.21.1)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. The from- and to- endpoints should be different. (§12.21.1)
 */
export interface IExtends extends IAbstractCodeRelationship {
  readonly from: IDatatype;
  readonly to: IDatatype;
}

export class Extends extends AbstractCodeRelationship implements IExtends {
  readonly metaClass = "Extends" as const;
  readonly from: IDatatype;
  readonly to: IDatatype;
  constructor(args: { from: IDatatype; to: IDatatype }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 123. Implements (§12.19.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.19.1
 * @metaclass Implements (concrete)
 * @generalization AbstractCodeRelationship
 * @definition The Implements is a specific meta-model element that represents
 *   "implementation" association between a CodeItem (for example, a
 *   ClassUnit) and an InterfaceUnit. "Implements" relationship is similar to
 *   "Extends." Java "implements" construct can be represented by KDM
 *   "Implements" relationship.
 * @ownedAttributes
 *   • from : CodeItem [1] -- The CodeItem that implements a certain
 *     InterfaceUnit.
 *   • to   : CodeItem [1] -- The InterfaceUnit that is being implemented.
 *     (§12.19.1)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. The from- and to- endpoints should be different. (§12.19.1)
 */
export interface IImplements extends IAbstractCodeRelationship {
  readonly from: ICodeItem;
  readonly to: ICodeItem;
}

export class Implements extends AbstractCodeRelationship implements IImplements {
  readonly metaClass = "Implements" as const;
  readonly from: ICodeItem;
  readonly to: ICodeItem;
  constructor(args: { from: ICodeItem; to: ICodeItem }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 124. ImplementationOf (§12.19.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.19.2
 * @metaclass ImplementationOf (concrete)
 * @generalization AbstractCodeRelationship
 * @definition The ImplementationOf is a meta-model element that represents
 *   "implementation" association between a CodeItem (e.g., MethodUnit) and a
 *   particular "external" entity (e.g., MethodUnit owned by an InterfaceUnit).
 * @ownedAttributes
 *   • from : CodeItem [1] -- CodeItem that implements a certain "declaration."
 *   • to   : CodeItem [1] -- "declaration" that is being implemented.
 *     (§12.19.2)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. Either the origin is a ControlElement and the target is a
 *      ControlElement, or the origin is a DataElement and the target is a
 *      DataElement.
 *   2. The kind attribute of the CodeItem at the origin should not equal
 *      "external."
 *   3. The kind attribute of the CodeItem at the target should equal
 *      "external" or "abstract."
 *   4. The from- and to- endpoints should be different. (§12.19.2)
 */
export interface IImplementationOf extends IAbstractCodeRelationship {
  readonly from: ICodeItem;
  readonly to: ICodeItem;
}

export class ImplementationOf extends AbstractCodeRelationship implements IImplementationOf {
  readonly metaClass = "ImplementationOf" as const;
  readonly from: ICodeItem;
  readonly to: ICodeItem;
  constructor(args: { from: ICodeItem; to: ICodeItem }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 125. HasType (§12.20.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.20.1
 * @metaclass HasType (concrete)
 * @generalization AbstractCodeRelationship
 * @definition The HasType is a specific meta-model element that represents
 *   semantic relation between a data element and the corresponding type
 *   element.
 * @ownedAttributes
 *   • from : CodeItem [1] -- The source data element.
 *   • to   : Datatype [1] -- The target datatype element. (§12.20.1)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. The from- and to- endpoints should be different. (§12.20.1)
 */
export interface IHasType extends IAbstractCodeRelationship {
  readonly from: ICodeItem;
  readonly to: IDatatype;
}

export class HasType extends AbstractCodeRelationship implements IHasType {
  readonly metaClass = "HasType" as const;
  readonly from: ICodeItem;
  readonly to: IDatatype;
  constructor(args: { from: ICodeItem; to: IDatatype }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 126. HasValue (§12.20.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.20.2
 * @metaclass HasValue (concrete)
 * @generalization AbstractCodeRelationship
 * @definition The HasValue is a specific meta-model element that represents
 *   semantic relation between a data element and its initialization element,
 *   which can be a data element or an action element for complex
 *   initializations that involve expressions.
 * @ownedAttributes
 *   • from : CodeItem            [1] -- The source data element.
 *   • to   : AbstractCodeElement [1] -- The target AbstractCodeElement
 *     (datatype or action element). (§12.20.2)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. If the target is an ActionElement, then this ActionElement should
 *      have an outgoing Writes or Addresses relationship to the source
 *      CodeItem of the HasValue relationship. (§12.20.2)
 */
export interface IHasValue extends IAbstractCodeRelationship {
  readonly from: ICodeItem;
  readonly to: IAbstractCodeElement;
}

export class HasValue extends AbstractCodeRelationship implements IHasValue {
  readonly metaClass = "HasValue" as const;
  readonly from: ICodeItem;
  readonly to: IAbstractCodeElement;
  constructor(args: { from: ICodeItem; to: IAbstractCodeElement }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 127. InstanceOf (§12.18.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.18.1
 * @metaclass InstanceOf (concrete)
 * @generalization AbstractCodeRelationship
 * @definition The InstanceOf is a meta-model element that represents
 *   "instantiation" relation between an AbstractCodeElement (for example, a
 *   ClassUnit) and a TemplateUnit.
 * @ownedAttributes
 *   • from : AbstractCodeElement [1] -- Represents the instantiation of a
 *     template.
 *   • to   : TemplateUnit        [1] -- The TemplateUnit being instantiated.
 *     (§12.18.1)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. The to- and from- endpoints of the relationship should be different.
 *      (§12.18.1)
 */
export interface IInstanceOf extends IAbstractCodeRelationship {
  readonly from: IAbstractCodeElement;
  readonly to: ITemplateUnit;
}

export class InstanceOf extends AbstractCodeRelationship implements IInstanceOf {
  readonly metaClass = "InstanceOf" as const;
  readonly from: IAbstractCodeElement;
  readonly to: ITemplateUnit;
  constructor(args: { from: IAbstractCodeElement; to: ITemplateUnit }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 128. ParameterTo (§12.18.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.18.2
 * @metaclass ParameterTo (concrete)
 * @generalization AbstractCodeRelationship
 * @definition The ParameterTo is a meta-model element that represents an
 *   actual type parameter in the context of a reference to a parameterized
 *   entity.
 * @ownedAttributes
 *   • from : AbstractCodeElement [1] -- The reference to the parameterized
 *     entity (the context of the actual type parameter).
 *   • to   : CodeItem            [1] -- Actual parameter to template
 *     instantiation. (§12.18.2)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. ParameterTo relationship should be owned only by TemplateType or
 *      ActionElement.
 *   2. The to- and from- endpoints should be different. (§12.18.2)
 */
export interface IParameterTo extends IAbstractCodeRelationship {
  readonly from: IAbstractCodeElement;
  readonly to: ICodeItem;
}

export class ParameterTo extends AbstractCodeRelationship implements IParameterTo {
  readonly metaClass = "ParameterTo" as const;
  readonly from: IAbstractCodeElement;
  readonly to: ICodeItem;
  constructor(args: { from: IAbstractCodeElement; to: ICodeItem }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 129. VisibleIn (§12.26.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.26.1
 * @metaclass VisibleIn (concrete)
 * @generalization AbstractCodeRelationship
 * @definition The VisibleIn is a specific meta-model element that represents
 *   semantic relation between two code items, where one provides the
 *   restricted visibility context for another code item.
 * @ownedAttributes
 *   • from : CodeItem [1] -- The CodeItem visibility of which is specified.
 *   • to   : CodeItem [1] -- The CodeItem that provides the visibility
 *     context. (§12.26.1)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared in §12.26.1)
 */
export interface IVisibleIn extends IAbstractCodeRelationship {
  readonly from: ICodeItem;
  readonly to: ICodeItem;
}

export class VisibleIn extends AbstractCodeRelationship implements IVisibleIn {
  readonly metaClass = "VisibleIn" as const;
  readonly from: ICodeItem;
  readonly to: ICodeItem;
  constructor(args: { from: ICodeItem; to: ICodeItem }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 130. Expands (§12.23.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.23.1
 * @metaclass Expands (concrete)
 * @generalization AbstractCodeRelationship
 * @definition Expands class represents the relationship between a MacroUnit
 *   to another MacroUnit or from a MacroDirective to a MacroUnit. This
 *   relationship results from using the name of the target macro definition
 *   in the context of the origin MacroUnit or MacroDirective.
 * @ownedAttributes
 *   • from : PreprocessorDirective [1] -- The origin context.
 *   • to   : MacroUnit             [1] -- The target MacroUnit. (§12.23.1)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared in §12.23.1)
 */
export interface IExpands extends IAbstractCodeRelationship {
  readonly from: IPreprocessorDirective;
  readonly to: IMacroUnit;
}

export class Expands extends AbstractCodeRelationship implements IExpands {
  readonly metaClass = "Expands" as const;
  readonly from: IPreprocessorDirective;
  readonly to: IMacroUnit;
  constructor(args: { from: IPreprocessorDirective; to: IMacroUnit }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 131. GeneratedFrom (§12.23.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.23.2
 * @metaclass GeneratedFrom (concrete)
 * @generalization AbstractCodeRelationship
 * @definition GeneratedFrom class represents the relationship between a
 *   block of code elements that were not originally produced by the
 *   developers, but were produced by the preprocessor as the result of
 *   processing a certain preprocessor directive.
 * @ownedAttributes
 *   • from : AbstractCodeElement   [1] -- The BlockUnit that owns the
 *     "generated" code.
 *   • to   : PreprocessorDirective [1] -- The preprocessor directive that
 *     was involved in producing the code. (§12.23.2)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. The origin of the GeneratedFrom relationship should be a BlockUnit.
 *      (§12.23.2)
 */
export interface IGeneratedFrom extends IAbstractCodeRelationship {
  readonly from: IAbstractCodeElement;
  readonly to: IPreprocessorDirective;
}

export class GeneratedFrom extends AbstractCodeRelationship implements IGeneratedFrom {
  readonly metaClass = "GeneratedFrom" as const;
  readonly from: IAbstractCodeElement;
  readonly to: IPreprocessorDirective;
  constructor(args: { from: IAbstractCodeElement; to: IPreprocessorDirective }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 132. Includes (§12.23.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.23.3
 * @metaclass Includes (concrete)
 * @generalization AbstractCodeRelationship
 * @definition Includes class represents the relationship from an
 *   IncludeDirective to a SharedUnit that represents the code elements being
 *   included.
 * @ownedAttributes
 *   • from : PreprocessorDirective [1] -- The IncludeDirective class that
 *     represents the include directive.
 *   • to   : AbstractCodeElement   [1] -- The code elements being included
 *     (usually a SharedUnit). (§12.23.3)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. The origin of the Includes relationship should be an IncludeDirective.
 *      (§12.23.3)
 */
export interface IIncludes extends IAbstractCodeRelationship {
  readonly from: IPreprocessorDirective;
  readonly to: IAbstractCodeElement;
}

export class Includes extends AbstractCodeRelationship implements IIncludes {
  readonly metaClass = "Includes" as const;
  readonly from: IPreprocessorDirective;
  readonly to: IAbstractCodeElement;
  constructor(args: { from: IPreprocessorDirective; to: IAbstractCodeElement }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 133. VariantTo (§12.23.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.23.4
 * @metaclass VariantTo (concrete)
 * @generalization AbstractCodeRelationship
 * @definition VariantTo class represents the relationship between variants of
 *   a software product line with conditional compilation. This relationship
 *   connects the ConditionalDirective to each alternative branch of the
 *   conditional compilation directive.
 * @ownedAttributes
 *   • from : PreprocessorDirective [1] -- A ConditionalDirective representing
 *     the default variant of the conditional.
 *   • to   : PreprocessorDirective [1] -- ConditionalDirective representing
 *     an alternative variant. (§12.23.4)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. The origin of the VariantTo relationship should be a
 *      ConditionalDirective.
 *   2. The target of the VariantTo relationship should be a
 *      ConditionalDirective. (§12.23.4)
 */
export interface IVariantTo extends IAbstractCodeRelationship {
  readonly from: IPreprocessorDirective;
  readonly to: IPreprocessorDirective;
}

export class VariantTo extends AbstractCodeRelationship implements IVariantTo {
  readonly metaClass = "VariantTo" as const;
  readonly from: IPreprocessorDirective;
  readonly to: IPreprocessorDirective;
  constructor(args: { from: IPreprocessorDirective; to: IPreprocessorDirective }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 134. Redefines (§12.23.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §12.23.5
 * @metaclass Redefines (concrete)
 * @generalization AbstractCodeRelationship
 * @definition Redefines class represents the relationship between a MacroUnit
 *   and another MacroUnit (usually with the same name) where the origin
 *   MacroUnit is a redefinition of the MacroUnit that is the target of the
 *   relationship.
 * @ownedAttributes
 *   • from : PreprocessorDirective [1] -- the new MacroUnit.
 *   • to   : MacroUnit             [1] -- the old MacroUnit. (§12.23.5)
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. The origin of the Redefines relationship should be a MacroUnit.
 *      (§12.23.5)
 */
export interface IRedefines extends IAbstractCodeRelationship {
  readonly from: IPreprocessorDirective;
  readonly to: IMacroUnit;
}

export class Redefines extends AbstractCodeRelationship implements IRedefines {
  readonly metaClass = "Redefines" as const;
  readonly from: IPreprocessorDirective;
  readonly to: IMacroUnit;
  constructor(args: { from: IPreprocessorDirective; to: IMacroUnit }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// END Implementer #2: Source + Code packages
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// BEGIN Implementer #3: Action + Platform + UI + Event packages
//
// Scope: Wave 3 covers the Runtime Resource Layer + Action sub-layer of KDM 1.4:
//   • Action package (§13) — implementation-level behavior: ActionElements,
//     control-flow, data-flow, exception, callable, interface, and uses
//     relationships, plus exception block units (TryUnit / CatchUnit /
//     FinallyUnit).
//   • Platform package (§15) — operating-environment resources: PlatformModel,
//     resource subtypes, platform actions, deployment, runtime resources, and
//     platform relationships.
//   • UI package (§16) — user-interface elements: UIModel, UIResources,
//     screens / reports / fields, UIEvent / UIAction, UI relationships.
//   • Event package (§17) — state-machine semantics: EventModel, States,
//     Transitions, Events, EventActions, event-driven relationships.
//
// Cross-package forward references resolved by this wave: IActionElement,
// IAbstractActionRelationship, IEntryFlow (placeholder type aliases removed
// in Wave 2's forward block — replaced by the real interfaces below).
//
// Cross-package forward references INTRODUCED by this wave (Wave 4 will
// resolve): IDatatype-cell endpoints already in Wave 2 — none new.
//   • Note: EventModel.eventElement targets AbstractEventElement; UIModel
//     targets UIElement (extension subclass) — both are declared in this
//     wave. No NEW forward placeholders are introduced.
// ═══════════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────────
// Action package (§13) — Program-element behavioral layer
// ───────────────────────────────────────────────────────────────────────────

// ─── 135. AbstractActionRelationship (§13.3.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.3.2
 * @metaclass AbstractActionRelationship (abstract)
 * @generalization KDMRelationship
 * @definition The AbstractActionRelationship is the parent class representing
 *   various KDM relationships that originate from an ActionElement.
 * @ownedAttributes (none introduced at this level)
 * @associationEnds (none introduced at this level)
 * @operations (none)
 * @constraints
 *   Usually, an action relationship corresponds to some usage of a name in a
 *   programming language statement. Action relationships originate from
 *   ActionElements as opposed to code relationships that originate from code
 *   elements. AbstractActionRelationship is subclassed by several concrete
 *   action relationship meta-elements. (§13.3.2)
 */
export interface IAbstractActionRelationship extends IKDMRelationship {}

export abstract class AbstractActionRelationship extends KDMRelationship implements IAbstractActionRelationship {}

// ─── 136. ActionElement (§13.3.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.3.1
 * @metaclass ActionElement (concrete)
 * @generalization AbstractCodeElement
 * @definition The ActionElement is a class to describe a basic unit of
 *   behavior. ActionElements are endpoints for a large number of explicit KDM
 *   relations that describe control and data flow between various code
 *   elements. ActionElement can be linked to the original representation
 *   through the SourceRef element from the Source package.
 * @ownedAttributes
 *   • kind : String -- §13.3.1: Represents the meaning of the operations,
 *     performed by the ActionElement.
 *   • actionRelation : AbstractActionRelationship [0..*] (composite, ordered)
 *     -- §13.3.1: Ordered action relationships originating from the given
 *     action element.
 *   • codeElement : AbstractCodeElement [0..*] (composite, ordered) --
 *     §13.3.1: Ordered owned code elements (for example, nested action
 *     elements, or nested BlockUnits, or nested definitions of datatypes
 *     and computational objects).
 * @associationEnds
 *   • A_ActionElement_actionRelation -- A_708 -- actionRelation end (composite)
 *   • A_ActionElement_codeElement    -- A_711 -- codeElement   end (composite)
 * @operations (none)
 * @constraints
 *   1. ActionElement may own StorableUnit or ValueElement and their
 *      subclasses and nested action elements. (§13.3.1)
 *   2. Compound ActionElement shall have an EntryFlow to the logically
 *      first owned ActionElement. (§13.3.1)
 */
export interface IActionElement extends IAbstractCodeElement {
  readonly kind?: string;
  readonly actionRelation: ReadonlyArray<IAbstractActionRelationship>;
  readonly codeElement: ReadonlyArray<IAbstractCodeElement>;
}

export class ActionElement extends AbstractCodeElement implements IActionElement {
  readonly metaClass: string = "ActionElement";
  readonly kind?: string;
  readonly actionRelation: ReadonlyArray<IAbstractActionRelationship>;
  readonly codeElement: ReadonlyArray<IAbstractCodeElement>;
  constructor(args: {
    kind?: string;
    actionRelation?: ReadonlyArray<IAbstractActionRelationship>;
    codeElement?: ReadonlyArray<IAbstractCodeElement>;
  } = {}) {
    super();
    this.kind = args.kind;
    this.actionRelation = args.actionRelation ?? [];
    this.codeElement = args.codeElement ?? [];
  }
}

// ─── 137. BlockUnit (§13.3.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.3.3
 * @metaclass BlockUnit (concrete)
 * @generalization ActionElement
 * @definition The BlockUnit represents logically and physically related blocks
 *   of ActionElement, for example, blocks of statements. BlockUnit can also
 *   represent initialization blocks of individual ControlElement, ClassUnit,
 *   CompilationUnit, and CodeAssembly. These BlockUnit own ActionElement
 *   related to initialization of global, static, and local variables and
 *   creation of static objects.
 * @ownedAttributes
 *   • codeElement : AbstractCodeElement [0..*] (inherited) -- §13.3.3:
 *     owned code elements including nested BlockUnits.
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints
 *   1. BlockUnit shall have an EntryFlow relation to the logically first
 *      ActionElement. (§13.3.3)
 */
export interface IBlockUnit extends IActionElement {}

export class BlockUnit extends ActionElement implements IBlockUnit {
  override readonly metaClass: string = "BlockUnit";
}

// ─── 138. ExceptionUnit (§13.8.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.8.1
 * @metaclass ExceptionUnit (concrete; extension element requiring a stereotype)
 * @generalization BlockUnit
 * @definition ExceptionUnit class is a generic meta-model element that
 *   provides a common superclass to various KDM containers for representing
 *   exception handling. ExceptionUnit is a subclass of a BlockUnit.
 *   ExceptionUnit is a KDM container, which can own both ActionElement (for
 *   example, statements in the catch-block) as well as CodeItem (for example,
 *   parameters to the catch-block, local definitions, and nested blocks).
 *   ExceptionUnit is a generic element, and KDM models are expected to use
 *   concrete subclasses of ExceptionUnit with more precise semantics. However,
 *   ExceptionUnit can be used as an extended modeling element with a
 *   stereotype. ExceptionUnit is more specific than a BlockUnit.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints
 *   1. ExceptionUnit should have a stereotype. (§13.8.1)
 */
export interface IExceptionUnit extends IBlockUnit {}

export class ExceptionUnit extends BlockUnit implements IExceptionUnit {
  override readonly metaClass: string = "ExceptionUnit";
}

// ─── 139. TryUnit (§13.8.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.8.2
 * @metaclass TryUnit (concrete)
 * @generalization ExceptionUnit
 * @definition TryUnit class is a meta-model element that represents
 *   try-blocks common to several programming languages. TryUnit is a
 *   container for action elements and associated definitions of CodeItems.
 *   The purpose of a TryUnit is to represent try-blocks and to manage
 *   exception flow to related catch-blocks and finally-block (for programming
 *   languages that support this concept). In particular, the TryUnit is the
 *   origin of ExceptionFlow relations to the corresponding CatchUnits and
 *   FinallyUnit blocks, which represent related catch- and finally-blocks.
 *   TryUnit may own nested TryUnit blocks.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface ITryUnit extends IExceptionUnit {}

export class TryUnit extends ExceptionUnit implements ITryUnit {
  override readonly metaClass = "TryUnit" as const;
}

// ─── 140. CatchUnit (§13.8.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.8.3
 * @metaclass CatchUnit (concrete)
 * @generalization ExceptionUnit
 * @definition CatchUnit is a meta-model element that represents catch-blocks.
 *   Particular CatchUnit should be associated to a particular TryUnit through
 *   ExceptionFlow relation. CatchUnit may contain ParameterUnit that
 *   represents the exception object passed to the catch-block by the
 *   exception-handling mechanism.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints
 *   1. CatchUnit should be associated to a TryUnit. In particular, a
 *      CatchUnit should be the target of an ExceptionFlow relationship that
 *      originates from some TryUnit. (§13.8.3)
 */
export interface ICatchUnit extends IExceptionUnit {}

export class CatchUnit extends ExceptionUnit implements ICatchUnit {
  override readonly metaClass = "CatchUnit" as const;
}

// ─── 141. FinallyUnit (§13.8.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.8.4
 * @metaclass FinallyUnit (concrete)
 * @generalization ExceptionUnit
 * @definition FinallyUnit is a meta-model element that represents finally-block
 *   associated with a certain try-block. The FinallyUnit is associated with
 *   the code responding TryUnit through an ExitFlow relation.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints
 *   1. FinallyBlock should be associated to a TryUnit. In particular, a
 *      FinallyUnit should be the target of an ExitFlow relationship that
 *      originates from some TryUnit. (§13.8.4)
 *   2. TryUnit should not be associated with more than one FinallyBlock.
 *      (§13.8.4)
 */
export interface IFinallyUnit extends IExceptionUnit {}

export class FinallyUnit extends ExceptionUnit implements IFinallyUnit {
  override readonly metaClass = "FinallyUnit" as const;
}

// ─── 142. ControlFlow (§13.5.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.5.1
 * @metaclass ControlFlow (concrete; generic — must carry a stereotype)
 * @generalization AbstractActionRelationship
 * @definition The ControlFlow is a generic modeling element that represents
 *   control flow relation between two ActionElements. It is further subclassed
 *   with more specific modeling elements. ControlFlow class could be used to
 *   represent programming constructs that are not covered by any of the
 *   specific subclasses as an extension point.
 * @ownedAttributes
 *   • from : ActionElement [1] -- the origin of the control flow.
 *   • to   : ActionElement [1] -- the target of control flow, when represented
 *     by the next action element in the trace determined by the control flow.
 * @associationEnds (from/to as above; redefined from KDMRelationship.from/to)
 * @operations (none)
 * @constraints
 *   1. ControlFlow class should always be used with a stereotype. (§13.5.1)
 */
export interface IControlFlow extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IActionElement;
}

export class ControlFlow extends AbstractActionRelationship implements IControlFlow {
  readonly metaClass: string = "ControlFlow";
  readonly from: IActionElement;
  readonly to: IActionElement;
  constructor(args: { from: IActionElement; to: IActionElement }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 143. EntryFlow (§13.5.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.5.2
 * @metaclass EntryFlow (concrete)
 * @generalization AbstractActionRelationship
 * @definition The EntryFlow is a modeling element that represents an initial
 *   flow of control into a KDM element. The EntryFlow relationship is used in
 *   a uniform way for describing entry points to other KDM code elements. It
 *   should be used to represent any type of special entry flows, such as the
 *   entry from a CodeAssembly to the initialization code block or action,
 *   from CompilationUnit to initialization block, from a callable unit to
 *   the initialization block, from a class to the initialization block, from
 *   BlockUnit to the logically first internal action or from a compound
 *   action to the logically first internal action.
 * @ownedAttributes
 *   • from : AbstractCodeElement [1] -- AbstractCodeElement that owns one or
 *     more action elements that represents its behavior.
 *   • to   : ActionElement [1] -- The action element that is selected when
 *     the owner element is called.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. Each AbstractCodeElement or its subclass such that it owns one or more
 *      ActionElement should have a corresponding EntryFlow relationship in
 *      which the "from" attribute is the AbstractCodeElement. (§13.5.2)
 *   2. The "to" attribute of an EntryFlow element should be an ActionElement
 *      that is owned by the AbstractCodeElement that is the "from" attribute
 *      of the EntryFlow. (§13.5.2)
 */
export interface IEntryFlow extends IAbstractActionRelationship {
  readonly from: IAbstractCodeElement;
  readonly to: IActionElement;
}

export class EntryFlow extends AbstractActionRelationship implements IEntryFlow {
  readonly metaClass = "EntryFlow" as const;
  readonly from: IAbstractCodeElement;
  readonly to: IActionElement;
  constructor(args: { from: IAbstractCodeElement; to: IActionElement }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 144. Flow (§13.5.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.5.3
 * @metaclass Flow (concrete)
 * @generalization ControlFlow
 * @definition The Flow class is a modeling element that represents control
 *   flow relationship between two ActionElements such that the ActionElement
 *   that corresponds to the "to" attribute of the Flow is a successor of the
 *   ActionElement that corresponds to the "from" attribute of the Flow.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints
 *   1. If there is one or more Flow elements there should be no TrueFlow,
 *      FalseFlow, or GuardedFlow with the same action element as the "from"
 *      attribute. (§13.5.3)
 */
export interface IFlow extends IControlFlow {}

export class Flow extends ControlFlow implements IFlow {
  override readonly metaClass = "Flow" as const;
}

// ─── 145. TrueFlow (§13.5.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.5.4
 * @metaclass TrueFlow (concrete)
 * @generalization ControlFlow
 * @definition The TrueFlow class is a modeling element that represents control
 *   flow relationship between two ActionElements such that
 *     • the ActionElement that corresponds to the "from" attribute of the
 *       TrueFlow represents the logical condition; and
 *     • the ActionElement that corresponds to the "to" attribute of the
 *       TrueFlow is a successor of the ActionElement that corresponds to the
 *       "from" attribute of the TrueFlow when the value of the condition is
 *       true.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints
 *   1. If there exists an ActionElement with a TrueFlow element, there should
 *      be no GuardedFlow or Flow elements that have the same ActionElement as
 *      the "from" attribute (but there can be FalseFlow). (§13.5.4)
 */
export interface ITrueFlow extends IControlFlow {}

export class TrueFlow extends ControlFlow implements ITrueFlow {
  override readonly metaClass = "TrueFlow" as const;
}

// ─── 146. FalseFlow (§13.5.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.5.5
 * @metaclass FalseFlow (concrete)
 * @generalization ControlFlow
 * @definition The FalseFlow class is a modeling element that represents
 *   control flow relationship between two ActionElements such that
 *     • the ActionElement that corresponds to the "from" attribute of the
 *       FalseFlow represents the logical condition, and
 *     • the ActionElement that corresponds to the "to" attribute of the
 *       FalseFlow is a successor of the ActionElement that corresponds to
 *       the "from" attribute of the FalseFlow when the value of other
 *       conditions is not satisfied.
 *   FalseFlow represents the "default" control flow branch in representing
 *   conditional statements and switch statements. FalseFlow is a specific
 *   modeling element that is used in combination with either TrueFlow or
 *   GuardedFlow.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (per §13.5.5)
 */
export interface IFalseFlow extends IControlFlow {}

export class FalseFlow extends ControlFlow implements IFalseFlow {
  override readonly metaClass = "FalseFlow" as const;
}

// ─── 147. GuardedFlow (§13.5.6) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.5.6
 * @metaclass GuardedFlow (concrete)
 * @generalization ControlFlow
 * @definition The GuardedFlow class is a modeling element that represents
 *   control flow relationship between two or more ActionElements such that:
 *     • the ActionElement that corresponds to the "from" attribute of the
 *       GuardedFlow represents the selection statement (for example, a
 *       "switch" statement); and
 *     • the ActionElement that corresponds to the "to" attribute of the
 *       GuardedFlow represents the guarding condition that determines a
 *       branch of control flow; and
 *     • the branch of control flow determined by the ActionElement that
 *       corresponds to the "to" attribute of the GuardedFlow element is a
 *       successor of the ActionElement that corresponds to the "from"
 *       attribute of the GuardedFlow when the guarded condition in the
 *       context of the selection statement is satisfied.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (per §13.5.6)
 */
export interface IGuardedFlow extends IControlFlow {}

export class GuardedFlow extends ControlFlow implements IGuardedFlow {
  override readonly metaClass = "GuardedFlow" as const;
}

// ─── 148. Calls (§13.6.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.6.1
 * @metaclass Calls (concrete)
 * @generalization AbstractActionRelationship
 * @definition Calls is a modeling element that represents a call-type
 *   relationship between an ActionElement and a CodeItem, which can be a
 *   ControlElement or one of its subclasses, or an entire CompilationUnit.
 *   The ActionElement represents some form of a call statement, and the
 *   CodeItem represents the element being called. In the meta-model the Calls
 *   element is a subclass of ActionRelationship.
 * @ownedAttributes
 *   • from : ActionElement [1] -- The action element from which the call
 *     relation originates.
 *   • to   : CodeItem      [1] -- the target CodeItem.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface ICalls extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: ICodeItem;
}

export class Calls extends AbstractActionRelationship implements ICalls {
  readonly metaClass = "Calls" as const;
  readonly from: IActionElement;
  readonly to: ICodeItem;
  constructor(args: { from: IActionElement; to: ICodeItem }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 149. Dispatches (§13.6.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.6.2
 * @metaclass Dispatches (concrete)
 * @generalization AbstractActionRelationship
 * @definition Dispatches is a modeling element that represents a by pointer
 *   relationship between an ActionElement and a data item. The ActionElement
 *   represents some form of a call behavior, and the data item represents a
 *   pointer to a procedure type.
 * @ownedAttributes
 *   • from : ActionElement [1] -- The action element from which the call
 *     relation originates.
 *   • to   : DataElement   [1] -- The data element that represents the pointer
 *     to a procedure type.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IDispatches extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IDataElement;
}

export class Dispatches extends AbstractActionRelationship implements IDispatches {
  readonly metaClass = "Dispatches" as const;
  readonly from: IActionElement;
  readonly to: IDataElement;
  constructor(args: { from: IActionElement; to: IDataElement }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 150. Reads (§13.7.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.7.1
 * @metaclass Reads (concrete)
 * @generalization AbstractActionRelationship
 * @definition The Reads relationship represents a flow of data from a
 *   DataElement to an ActionElement (read access to the DataElement).
 * @ownedAttributes
 *   • from : ActionElement [1] -- The action element that owns the Reads
 *     relationship.
 *   • to   : DataElement   [1] -- The DataElement that is the source of the
 *     flow of data.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IReads extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IDataElement;
}

export class Reads extends AbstractActionRelationship implements IReads {
  readonly metaClass = "Reads" as const;
  readonly from: IActionElement;
  readonly to: IDataElement;
  constructor(args: { from: IActionElement; to: IDataElement }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 151. Writes (§13.7.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.7.2
 * @metaclass Writes (concrete)
 * @generalization AbstractActionRelationship
 * @definition The Writes represents flow of data from an ActionElement to a
 *   DataElement (write access to the DataElement).
 * @ownedAttributes
 *   • from : ActionElement [1] -- The action element that owns the Writes
 *     relationship.
 *   • to   : DataElement   [1] -- The DataElement that is the sink of the
 *     flow of data.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IWrites extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IDataElement;
}

export class Writes extends AbstractActionRelationship implements IWrites {
  readonly metaClass = "Writes" as const;
  readonly from: IActionElement;
  readonly to: IDataElement;
  constructor(args: { from: IActionElement; to: IDataElement }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 152. Addresses (§13.7.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.7.3
 * @metaclass Addresses (concrete)
 * @generalization AbstractActionRelationship
 * @definition Addresses relationship represents access to a complex data
 *   structure, where the Reads or Writes relationships are applied to the
 *   elements of the data structure, or where an address of a data element
 *   is taken.
 * @ownedAttributes
 *   • from : ActionElement       [1] -- The action element that owns the
 *     Addresses relationship.
 *   • to   : ComputationalObject [1] -- The Computational object that is
 *     being accessed.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IAddresses extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IComputationalObject;
}

export class Addresses extends AbstractActionRelationship implements IAddresses {
  readonly metaClass = "Addresses" as const;
  readonly from: IActionElement;
  readonly to: IComputationalObject;
  constructor(args: { from: IActionElement; to: IComputationalObject }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 153. Creates (§13.7.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.7.4
 * @metaclass Creates (concrete)
 * @generalization AbstractActionRelationship
 * @definition The Creates represents an association between an ActionElement
 *   and a Datatype such that the ActionElement creates a new instance of the
 *   Datatype.
 * @ownedAttributes
 *   • from : ActionElement [1] -- The action element that owns the Creates
 *     relationship.
 *   • to   : Datatype      [1] -- The DataElement that is instantiated by
 *     the ActionElement.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface ICreates extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IDatatype;
}

export class Creates extends AbstractActionRelationship implements ICreates {
  readonly metaClass = "Creates" as const;
  readonly from: IActionElement;
  readonly to: IDatatype;
  constructor(args: { from: IActionElement; to: IDatatype }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 154. ExitFlow (§13.9.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.9.1
 * @metaclass ExitFlow (concrete)
 * @generalization AbstractActionRelationship
 * @definition ExitFlow class is a meta-model element that represents an
 *   implicit flow of control that should be taken when the corresponding
 *   block is exiting and has terminated normally or abruptly after executing
 *   the catch-block. For example, ExitFlow can be used to relate a try-block
 *   with the corresponding finally-block.
 * @ownedAttributes
 *   • from : ActionElement [1] -- ActionElement (for example, a try-block)
 *     for which the "on-exit" behavior was specified.
 *   • to   : ActionElement [1] -- ActionElement (usually, a finally-block)
 *     that represents the behavior that is invoked upon successful exit of
 *     the origin block ("on exit").
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IExitFlow extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IActionElement;
}

export class ExitFlow extends AbstractActionRelationship implements IExitFlow {
  readonly metaClass = "ExitFlow" as const;
  readonly from: IActionElement;
  readonly to: IActionElement;
  constructor(args: { from: IActionElement; to: IActionElement }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 155. ExceptionFlow (§13.9.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.9.2
 * @metaclass ExceptionFlow (concrete)
 * @generalization AbstractActionRelationship
 * @definition The ExceptionFlow relationship represents an exception flow of
 *   control between an ActionElement that produces an exception, such as a
 *   TryUnit, and the ActionElement that handles the exception, such as the
 *   corresponding CatchUnit.
 * @ownedAttributes
 *   • from : ActionElement [1] -- The origin of the exception flow.
 *   • to   : ActionElement [1] -- The CatchUnit to which control is
 *     transferred when an exception is raised.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IExceptionFlow extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IActionElement;
}

export class ExceptionFlow extends AbstractActionRelationship implements IExceptionFlow {
  readonly metaClass = "ExceptionFlow" as const;
  readonly from: IActionElement;
  readonly to: IActionElement;
  constructor(args: { from: IActionElement; to: IActionElement }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 156. Throws (§13.10.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.10.1
 * @metaclass Throws (concrete)
 * @generalization AbstractActionRelationship
 * @definition The Throws class is a meta-model element that represents
 *   throw-statements supported by several programming languages. These are
 *   the user-defined throws for exception, as opposed to the so-called normal
 *   system exceptions and runtime exceptions. Throw statements are essentially
 *   regular code elements, which simply have an additional relationship to
 *   their throw entity, using the Throws relationship.
 * @ownedAttributes
 *   • from : ActionElement [1] -- The ActionElement that throws the exception.
 *   • to   : DataElement   [1] -- The exception data element being thrown.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IThrows extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IDataElement;
}

export class Throws extends AbstractActionRelationship implements IThrows {
  readonly metaClass = "Throws" as const;
  readonly from: IActionElement;
  readonly to: IDataElement;
  constructor(args: { from: IActionElement; to: IDataElement }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 157. CompliesTo (§13.11.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.11.1
 * @metaclass CompliesTo (concrete)
 * @generalization AbstractActionRelationship
 * @definition The CompliesTo is a meta-model element that represents an
 *   association between an action element that "uses" some computational
 *   object, and the "declaration" of that computational object.
 * @ownedAttributes
 *   • from : ActionElement [1] -- The origin of the relationship; action
 *     element that "uses" some computational object.
 *   • to   : CodeItem      [1] -- The "declaration" of that computational
 *     object.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. The kind attribute of the CodeItem at the target of the CompliesTo
 *      relationship should be equal to "external" or "abstract." (§13.11.1)
 *   2. The action element that is the origin of the "CompliesTo" relationship
 *      should own a callable or data action relationship to some computational
 *      object and the target of CompliesTo relationship should be one of the
 *      declarations of that computational object. (§13.11.1)
 */
export interface ICompliesTo extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: ICodeItem;
}

export class CompliesTo extends AbstractActionRelationship implements ICompliesTo {
  readonly metaClass = "CompliesTo" as const;
  readonly from: IActionElement;
  readonly to: ICodeItem;
  constructor(args: { from: IActionElement; to: ICodeItem }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 158. UsesType (§13.12.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.12.1
 * @metaclass UsesType (concrete)
 * @generalization AbstractActionRelationship
 * @definition The UsesType relationship represents a type cast or a type
 *   conversion performed by an ActionElement.
 * @ownedAttributes
 *   • from : ActionElement [1] -- The action element that performs a type
 *     cast or a type conversion.
 *   • to   : Datatype      [1] -- The datatype involved in a type operation.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IUsesType extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IDatatype;
}

export class UsesType extends AbstractActionRelationship implements IUsesType {
  readonly metaClass = "UsesType" as const;
  readonly from: IActionElement;
  readonly to: IDatatype;
  constructor(args: { from: IActionElement; to: IDatatype }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 159. ActionRelationship (§13.13.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §13.13.1
 * @metaclass ActionRelationship (concrete; generic — must carry a stereotype)
 * @generalization AbstractActionRelationship
 * @definition The ActionRelationship is a generic meta-model element that
 *   can be used to define new extended meta-model elements through the KDM
 *   light-weight extension mechanism.
 * @ownedAttributes
 *   • from : ActionElement [1] -- The origin action element.
 *   • to   : KDMEntity     [1] -- The target KDM entity.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. ActionRelationship should have at least one stereotype. (§13.13.1)
 */
export interface IActionRelationship extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IKDMEntity;
}

export class ActionRelationship extends AbstractActionRelationship implements IActionRelationship {
  readonly metaClass: string = "ActionRelationship";
  readonly from: IActionElement;
  readonly to: IKDMEntity;
  constructor(args: { from: IActionElement; to: IKDMEntity }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Platform package (§15) — Operating-environment runtime resources
// ───────────────────────────────────────────────────────────────────────────

// ─── 160. AbstractPlatformElement (§15.3.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.3.2
 * @metaclass AbstractPlatformElement (abstract)
 * @generalization KDMEntity
 * @definition The AbstractPlatformElement is an abstract meta-model element
 *   that represents entities of the operating environments of software
 *   systems. The key subclasses of AbstractPlatformElement are
 *   PlatformResource, PlatformAction, DeploymentResource, and RuntimeResource.
 * @ownedAttributes
 *   • relation       : AbstractPlatformRelationship [0..*] (composite) --
 *     §15.3.2: Platform relationship that originates from the platform element.
 *   • abstraction    : ActionElement                [0..*] (composite, ordered)
 *     -- §15.3.2: owned "abstraction" actions.
 *   • implementation : AbstractCodeElement          [0..*] (group, non-comp.)
 *     -- §15.3.2: Grouped association to AbstractCodeElement that are
 *     represented by the current PlatformElement from some CodeModel.
 * @associationEnds
 *   • A_AbstractPlatformElement_relation       -- A_101 -- relation       end
 *   • A_AbstractPlatformElement_abstraction    -- A_105 -- abstraction    end
 *   • A_AbstractPlatformElement_implementation -- A_107 -- implementation end
 * @operations (none)
 * @constraints
 *   1. Implementation AbstractCodeElement should be owned by some CodeModel.
 *      (§15.3.2)
 *   2. Implementation AbstractCodeElement should be subclasses of
 *      ComputationalObject or ActionElement. (§15.3.2)
 *   3. Abstraction ActionElement should be owned by the same PlatformModel.
 *      (§15.3.2)
 */
export interface IAbstractPlatformElement extends IKDMEntity {
  readonly relation: ReadonlyArray<IAbstractPlatformRelationship>;
  readonly abstraction: ReadonlyArray<IActionElement>;
  readonly implementation: ReadonlyArray<IAbstractCodeElement>;
}

export abstract class AbstractPlatformElement extends KDMEntity implements IAbstractPlatformElement {
  readonly relation: ReadonlyArray<IAbstractPlatformRelationship> = [];
  readonly abstraction: ReadonlyArray<IActionElement> = [];
  readonly implementation: ReadonlyArray<IAbstractCodeElement> = [];
  // KDMEntity abstract operation defaults — mirror AbstractCodeElement pattern.
  getOwner(): IKDMEntity | undefined { return undefined; }
  getOwnedElement(): ReadonlyArray<IKDMEntity> { return []; }
  getGroup(): ReadonlyArray<IKDMEntity> { return []; }
  getGroupedElement(): ReadonlyArray<IKDMEntity> { return []; }
  getInbound(): ReadonlyArray<IKDMRelationship> { return []; }
  getOutbound(): ReadonlyArray<IKDMRelationship> { return []; }
  getOwnedRelation(): ReadonlyArray<IKDMRelationship> {
    return this.relation as ReadonlyArray<IKDMRelationship>;
  }
  getModel(): IKDMModel | undefined { return undefined; }
  createAggregation(otherEntity: IKDMEntity): IAggregatedRelationship {
    return new AggregatedRelationship({ from: this, to: otherEntity });
  }
  deleteAggregation(_aggregation: IAggregatedRelationship): void { /* metamodel-surface no-op */ }
}

// ─── 161. AbstractPlatformRelationship (§15.3.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.3.3
 * @metaclass AbstractPlatformRelationship (abstract)
 * @generalization KDMRelationship
 * @definition The AbstractPlatformRelationship is an abstract meta-model
 *   element that represents associations between platform entities.
 * @ownedAttributes (none introduced at this level)
 * @associationEnds (none introduced at this level)
 * @operations (none)
 * @constraints
 *   An instance of an AbstractPlatformRelationship represents structural
 *   association between two runtime resources. (§15.3.3)
 */
export interface IAbstractPlatformRelationship extends IKDMRelationship {}

export abstract class AbstractPlatformRelationship extends KDMRelationship implements IAbstractPlatformRelationship {}

// ─── 162. PlatformModel (§15.3.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.3.1
 * @metaclass PlatformModel (concrete)
 * @generalization KDMModel
 * @definition PlatformModel is a specific KDM model that owns collections of
 *   facts about the existing software system such that these facts correspond
 *   to the Platform domain. PlatformModel provides a container for platform
 *   elements.
 * @ownedAttributes
 *   • platformElement : AbstractPlatformElement [0..*] (composite) -- §15.3.1
 * @associationEnds
 *   • A_PlatformModel_platformElement -- A_109 -- platformElement end
 * @operations (none)
 * @constraints
 *   PlatformModel is a logical container for platform elements. The
 *   implementer shall arrange platform elements into one or more platform
 *   models. (§15.3.1)
 */
export interface IPlatformModel extends IKDMModel {
  readonly platformElement: ReadonlyArray<IAbstractPlatformElement>;
}

export class PlatformModel extends KDMModel implements IPlatformModel {
  readonly metaClass = "PlatformModel" as const;
  readonly platformElement: ReadonlyArray<IAbstractPlatformElement>;
  constructor(args: {
    name?: string;
    platformElement?: ReadonlyArray<IAbstractPlatformElement>;
  } = {}) {
    super();
    if (args.name !== undefined) {
      Object.defineProperty(this, "name", { value: args.name, writable: false, enumerable: true });
    }
    this.platformElement = args.platformElement ?? [];
  }
  getOwnedElement(): ReadonlyArray<IKDMEntity> {
    return this.platformElement as ReadonlyArray<IKDMEntity>;
  }
}

// ─── 163. PlatformResource (§15.5.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.5.1
 * @metaclass PlatformResource (concrete)
 * @generalization AbstractPlatformElement
 * @definition The PlatformResource is a meta-model element that represents a
 *   platform resource. The purpose of a platform is to simplify application
 *   development by closing the gap between the application domain and the
 *   facilities that are available to application programmers. The latter are
 *   referred to as platform resources. Examples of resource types include
 *   UNIX File, UNIX IO Stream, UNIX socket, UNIX Process, UNIX thread, AWT
 *   widget, CICS File, CICS transaction, UNIX semaphore, UNIX shared memory
 *   segment, OS/390 VSAM file, JDBC connection, HTTP session, HTTP request,
 *   UNIX memory block, CICS commarea, COBOL file.
 * @ownedAttributes
 *   • platformElement : AbstractPlatformElement [0..*] (composite) -- §15.5.1
 * @associationEnds
 *   • A_PlatformResource_platformElement -- A_120 -- platformElement end
 * @operations (none)
 * @constraints (none declared)
 */
export interface IPlatformResource extends IAbstractPlatformElement {
  readonly platformElement: ReadonlyArray<IAbstractPlatformElement>;
}

export class PlatformResource extends AbstractPlatformElement implements IPlatformResource {
  readonly metaClass: string = "PlatformResource";
  readonly platformElement: ReadonlyArray<IAbstractPlatformElement>;
  constructor(args: { platformElement?: ReadonlyArray<IAbstractPlatformElement> } = {}) {
    super();
    this.platformElement = args.platformElement ?? [];
  }
}

// ─── 164. NamingResource (§15.5.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.5.2
 * @metaclass NamingResource (concrete)
 * @generalization PlatformResource
 * @definition NamingResource represents platform resources that provide
 *   registration and lookup services (e.g., registry). In the meta-model
 *   NamingResource is a subclass of PlatformResource.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface INamingResource extends IPlatformResource {}

export class NamingResource extends PlatformResource implements INamingResource {
  override readonly metaClass = "NamingResource" as const;
}

// ─── 165. MarshalledResource (§15.5.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.5.3
 * @metaclass MarshalledResource (concrete)
 * @generalization PlatformResource
 * @definition MarshalledResource represents platform resources that provide
 *   intercomponent communication via remote synchronous calls (for example,
 *   RPC, CORBA method call, Java remote method invocation). In the meta-model
 *   MarshalledResource is a subclass of PlatformResource.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IMarshalledResource extends IPlatformResource {}

export class MarshalledResource extends PlatformResource implements IMarshalledResource {
  override readonly metaClass = "MarshalledResource" as const;
}

// ─── 166. MessagingResource (§15.5.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.5.4
 * @metaclass MessagingResource (concrete)
 * @generalization PlatformResource
 * @definition MessagingResource represents platform resources that provide
 *   intercomponent communication via asynchronous messages (e.g., IBM
 *   MQSeries messages).
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IMessagingResource extends IPlatformResource {}

export class MessagingResource extends PlatformResource implements IMessagingResource {
  override readonly metaClass = "MessagingResource" as const;
}

// ─── 167. FileResource (§15.5.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.5.5
 * @metaclass FileResource (concrete)
 * @generalization PlatformResource
 * @definition FileResource represents platform resources that provide any
 *   non-database related storage. In the meta-model the FileResource class is
 *   a subclass of PlatformResource.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IFileResource extends IPlatformResource {}

export class FileResource extends PlatformResource implements IFileResource {
  override readonly metaClass = "FileResource" as const;
}

// ─── 168. ExecutionResource (§15.5.6) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.5.6
 * @metaclass ExecutionResource (concrete)
 * @generalization PlatformResource
 * @definition ExecutionResource represents dynamic Runtime elements (e.g.,
 *   process or thread).
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IExecutionResource extends IPlatformResource {}

export class ExecutionResource extends PlatformResource implements IExecutionResource {
  override readonly metaClass = "ExecutionResource" as const;
}

// ─── 169. LockResource (§15.5.7) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.5.7
 * @metaclass LockResource (concrete)
 * @generalization PlatformResource
 * @definition LockResource represents a synchronization resource common to
 *   multithreaded runtime environments.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface ILockResource extends IPlatformResource {}

export class LockResource extends PlatformResource implements ILockResource {
  override readonly metaClass = "LockResource" as const;
}

// ─── 170. StreamResource (§15.5.8) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.5.8
 * @metaclass StreamResource (concrete)
 * @generalization PlatformResource
 * @definition StreamResource represents a simple input/output resource, for
 *   example UNIX-like stream.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IStreamResource extends IPlatformResource {}

export class StreamResource extends PlatformResource implements IStreamResource {
  override readonly metaClass = "StreamResource" as const;
}

// ─── 171. DataManager (§15.5.9) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.5.9
 * @metaclass DataManager (concrete)
 * @generalization PlatformResource
 * @definition DataManager represents a database management system. DataManager
 *   is associated with particular data elements that represent the data
 *   description of the data managed by the data manager.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IDataManager extends IPlatformResource {}

export class DataManager extends PlatformResource implements IDataManager {
  override readonly metaClass = "DataManager" as const;
}

// ─── 172. PlatformEvent (§15.5.10) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.5.10
 * @metaclass PlatformEvent (concrete)
 * @generalization PlatformResource
 * @definition The PlatformEvent class is a meta-model element representing
 *   various events and callbacks associated with runtime platforms. This
 *   class follows the KDM event pattern, common to Resource Layer packages.
 * @ownedAttributes
 *   • kind : String -- §15.5.10: Represents the nature of the action performed
 *     by this Event.
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IPlatformEvent extends IPlatformResource {
  readonly kind?: string;
}

export class PlatformEvent extends PlatformResource implements IPlatformEvent {
  override readonly metaClass = "PlatformEvent" as const;
  readonly kind?: string;
  constructor(args: {
    kind?: string;
    platformElement?: ReadonlyArray<IAbstractPlatformElement>;
  } = {}) {
    super({ platformElement: args.platformElement });
    this.kind = args.kind;
  }
}

// ─── 173. PlatformAction (§15.5.11) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.5.11
 * @metaclass PlatformAction (concrete)
 * @generalization AbstractPlatformElement
 * @definition PlatformAction class follows the pattern of a "resource action"
 *   class, specific to the Platform package. The nature of the action
 *   represented by a particular element is designated by its "kind" attribute.
 * @ownedAttributes
 *   • kind            : String           -- §15.5.11: Represents the nature
 *     of the action performed by this element.
 *   • platformElement : PlatformEvent [0..*] -- §15.5.11: The set of platform
 *     events that are owned by the given PlatformAction.
 * @associationEnds
 *   • A_PlatformAction_platformElement -- A_123 -- platformElement end
 * @operations (none)
 * @constraints (none declared)
 */
export interface IPlatformAction extends IAbstractPlatformElement {
  readonly kind?: string;
  readonly platformElement: ReadonlyArray<IPlatformEvent>;
}

export class PlatformAction extends AbstractPlatformElement implements IPlatformAction {
  readonly metaClass: string = "PlatformAction";
  readonly kind?: string;
  readonly platformElement: ReadonlyArray<IPlatformEvent>;
  constructor(args: {
    kind?: string;
    platformElement?: ReadonlyArray<IPlatformEvent>;
  } = {}) {
    super();
    this.kind = args.kind;
    this.platformElement = args.platformElement ?? [];
  }
}

// ─── 174. ExternalActor (§15.5.12) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.5.12
 * @metaclass ExternalActor (concrete)
 * @generalization PlatformAction
 * @definition ExternalActor is a meta-model element that represents entities
 *   outside of the boundary of the software system being modeled. For example,
 *   external actor can be a user of the system. External actors interact with
 *   the software system. In the meta-model ExternalActor is a PlatformElement.
 *   Semantics of ExternalActors is outside of the scope of KDM.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IExternalActor extends IPlatformAction {}

export class ExternalActor extends PlatformAction implements IExternalActor {
  override readonly metaClass = "ExternalActor" as const;
}

// ─── 175. BindsTo (§15.6.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.6.1
 * @metaclass BindsTo (concrete)
 * @generalization AbstractPlatformRelationship
 * @definition BindsTo defines a semantic association between a
 *   PlatformResource and its binding target.
 * @ownedAttributes
 *   • from : PlatformResource [1] -- The PlatformResource that is the source
 *     of the relationship (the from-endpoint).
 *   • to   : KDMEntity        [1] -- The KDMEntity to which the current
 *     Resource is bound (the to-endpoint).
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IBindsTo extends IAbstractPlatformRelationship {
  readonly from: IPlatformResource;
  readonly to: IKDMEntity;
}

export class BindsTo extends AbstractPlatformRelationship implements IBindsTo {
  readonly metaClass = "BindsTo" as const;
  readonly from: IPlatformResource;
  readonly to: IKDMEntity;
  constructor(args: { from: IPlatformResource; to: IKDMEntity }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 176. DeploymentElement (§15.9.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.9.1
 * @metaclass DeploymentElement (concrete; generic — must carry a stereotype)
 * @generalization AbstractPlatformElement
 * @definition The DeploymentElement is a generic class is a common meta-model
 *   element for various classes related to deployment of computational objects
 *   and related platform resources across multiple nodes. The DeploymentElement
 *   class itself is a concrete class that can be used as an extended code
 *   element, with a certain stereotype. As an extended element DeploymentElement
 *   is more specific than AbstractPlatformElement.
 * @ownedAttributes (none introduced at this level)
 * @associationEnds (none introduced at this level)
 * @operations (none)
 * @constraints
 *   1. DeploymentElement class shall be used with at least one stereotype.
 *      (§15.9.1)
 */
export interface IDeploymentElement extends IAbstractPlatformElement {}

export class DeploymentElement extends AbstractPlatformElement implements IDeploymentElement {
  readonly metaClass: string = "DeploymentElement";
}

// ─── 177. DeployedComponent (§15.9.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.9.2
 * @metaclass DeployedComponent (concrete)
 * @generalization DeploymentElement
 * @definition The DeployedComponent represents a unit of deployment as defined
 *   by a particular platform. Major platform resources provide a packaging
 *   mechanism of deploying application functionality. Deployment component is
 *   a replaceable unit of an application. For example, DLL, shared library,
 *   COM, Eclipse plugin, Executable, Jar file, War file for Tomcat, SQL Stored
 *   procedure, CORBA module, EJB, JavaBean, Jakarta Struts Action, Jakarta
 *   Struts Form.
 * @ownedAttributes
 *   • groupedCode : Module [0..*] (group, non-composite) -- §15.9.2: The code
 *     components that are deployed to the target DeployedComponent (KDM
 *     grouping association).
 * @associationEnds
 *   • A_DeployedComponent_groupedCode -- A_150 -- groupedCode end
 * @operations (none)
 * @constraints (none declared)
 */
export interface IDeployedComponent extends IDeploymentElement {
  readonly groupedCode: ReadonlyArray<IModule>;
}

export class DeployedComponent extends DeploymentElement implements IDeployedComponent {
  override readonly metaClass = "DeployedComponent" as const;
  readonly groupedCode: ReadonlyArray<IModule>;
  constructor(args: { groupedCode?: ReadonlyArray<IModule> } = {}) {
    super();
    this.groupedCode = args.groupedCode ?? [];
  }
}

// ─── 178. DeployedSoftwareSystem (§15.9.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.9.3
 * @metaclass DeployedSoftwareSystem (concrete)
 * @generalization DeploymentElement
 * @definition The DeployedSoftwareSystem is a meta-model element that
 *   represents an instance of a software system at deployment or at the
 *   initialization time. DeployedSoftwareSystem is a physical instance of
 *   some logical SoftwareSystem. DeployedSoftwareSystem is associated with a
 *   set of DeployedComponents, which correspond to the set of logical
 *   components of the logical SoftwareSystem.
 * @ownedAttributes
 *   • groupedComponent : DeployedComponent [0..*] (group, non-composite) --
 *     §15.9.3: The set of physical DeployedComponents that make up the target
 *     system.
 * @associationEnds
 *   • A_DeployedSoftwareSystem_groupedComponent -- A_141 -- groupedComponent end
 * @operations (none)
 * @constraints (none declared)
 */
export interface IDeployedSoftwareSystem extends IDeploymentElement {
  readonly groupedComponent: ReadonlyArray<IDeployedComponent>;
}

export class DeployedSoftwareSystem extends DeploymentElement implements IDeployedSoftwareSystem {
  override readonly metaClass = "DeployedSoftwareSystem" as const;
  readonly groupedComponent: ReadonlyArray<IDeployedComponent>;
  constructor(args: { groupedComponent?: ReadonlyArray<IDeployedComponent> } = {}) {
    super();
    this.groupedComponent = args.groupedComponent ?? [];
  }
}

// ─── 179. DeployedResource (§15.9.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.9.5
 * @metaclass DeployedResource (concrete)
 * @generalization DeploymentElement
 * @definition The DeployedResource is a meta-model element that represents a
 *   set of platform resource instances as they are deployed in a particular
 *   deployment configuration. DeployedResource is associated with a set of
 *   PlatformResource elements. DeployedResource provides a unique physical
 *   context for a logical resource, as each logical resource can be
 *   associated with multiple DeployedResources.
 * @ownedAttributes
 *   • platformElement : PlatformResource [0..*] (composite) -- §15.9.5: The
 *     set of PlatformResource elements that are deployed into the target
 *     DeployedResource.
 * @associationEnds
 *   • A_DeployedResource_platformElement -- A_153 -- platformElement end
 * @operations (none)
 * @constraints (none declared)
 */
export interface IDeployedResource extends IDeploymentElement {
  readonly platformElement: ReadonlyArray<IPlatformResource>;
}

export class DeployedResource extends DeploymentElement implements IDeployedResource {
  override readonly metaClass = "DeployedResource" as const;
  readonly platformElement: ReadonlyArray<IPlatformResource>;
  constructor(args: { platformElement?: ReadonlyArray<IPlatformResource> } = {}) {
    super();
    this.platformElement = args.platformElement ?? [];
  }
}

// ─── 180. Machine (§15.9.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.9.4
 * @metaclass Machine (concrete)
 * @generalization DeploymentElement
 * @definition The Machine is a meta-model element that represents the hardware
 *   node which hosts deployed components.
 * @ownedAttributes
 *   • deployedComponent : DeployedComponent [0..*] (composite) -- §15.9.4:
 *     The set of DeployedComponent elements deployed to this node.
 *   • deployedResource  : DeployedResource  [0..*] (composite) -- §15.9.4:
 *     The set of DeployedResource elements deployed to this node.
 * @associationEnds
 *   • A_Machine_deployedComponent -- A_144 -- deployedComponent end
 *   • A_Machine_deployedResource  -- A_147 -- deployedResource  end
 * @operations (none)
 * @constraints (none declared)
 */
export interface IMachine extends IDeploymentElement {
  readonly deployedComponent: ReadonlyArray<IDeployedComponent>;
  readonly deployedResource: ReadonlyArray<IDeployedResource>;
}

export class Machine extends DeploymentElement implements IMachine {
  override readonly metaClass = "Machine" as const;
  readonly deployedComponent: ReadonlyArray<IDeployedComponent>;
  readonly deployedResource: ReadonlyArray<IDeployedResource>;
  constructor(args: {
    deployedComponent?: ReadonlyArray<IDeployedComponent>;
    deployedResource?: ReadonlyArray<IDeployedResource>;
  } = {}) {
    super();
    this.deployedComponent = args.deployedComponent ?? [];
    this.deployedResource = args.deployedResource ?? [];
  }
}

// ─── 181. Requires (§15.7.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.7.1
 * @metaclass Requires (concrete)
 * @generalization AbstractPlatformRelationship
 * @definition Requires defines semantic relationship between a
 *   DeployedComponent and an AbstractPlatformElement.
 * @ownedAttributes
 *   • from : DeployedComponent       [1] -- The DeployedComponent that is the
 *     source of the relationship (the from-endpoint).
 *   • to   : AbstractPlatformElement [1] -- The AbstractPlatformElement that
 *     is the target of the relationship (the to-endpoint).
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IRequires extends IAbstractPlatformRelationship {
  readonly from: IDeployedComponent;
  readonly to: IAbstractPlatformElement;
}

export class Requires extends AbstractPlatformRelationship implements IRequires {
  readonly metaClass = "Requires" as const;
  readonly from: IDeployedComponent;
  readonly to: IAbstractPlatformElement;
  constructor(args: { from: IDeployedComponent; to: IAbstractPlatformElement }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 182. RuntimeResource (§15.10.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.10.1
 * @metaclass RuntimeResource (concrete; generic)
 * @generalization PlatformResource
 * @definition The RuntimeResource is a generic meta-model element that
 *   represents an entity that has its own execution thread (for example,
 *   process or thread). RuntimeResource is subclassed by Process and Thread.
 *   In the meta-model RuntimeResource is used as the endpoint of certain
 *   relationships.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IRuntimeResource extends IPlatformResource {}

export class RuntimeResource extends PlatformResource implements IRuntimeResource {
  override readonly metaClass: string = "RuntimeResource";
}

// ─── 183. Process (§15.10.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.10.2
 * @metaclass Process (concrete)
 * @generalization RuntimeResource
 * @definition The Process is a meta-model element that represents instances
 *   of processes.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IProcess extends IRuntimeResource {}

export class Process extends RuntimeResource implements IProcess {
  override readonly metaClass = "Process" as const;
}

// ─── 184. Thread (§15.10.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.10.3
 * @metaclass Thread (concrete)
 * @generalization RuntimeResource
 * @definition The Thread is a meta-model element that represents instances of
 *   the so-called threads (light-weight processes).
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IThread extends IRuntimeResource {}

export class Thread extends RuntimeResource implements IThread {
  override readonly metaClass = "Thread" as const;
}

// ─── 185. Loads (§15.11.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.11.1
 * @metaclass Loads (concrete)
 * @generalization AbstractPlatformRelationship
 * @definition The Loads class is a meta-model element that represents
 *   "dynamic loading relationship" between a LoadingService action endpoint
 *   and the DeployedComponent.
 * @ownedAttributes
 *   • from : ActionElement     [1] -- "abstracted" action element owned by
 *     some resource.
 *   • to   : DeployedComponent [1] -- The component that is being loaded.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface ILoads extends IAbstractPlatformRelationship {
  readonly from: IActionElement;
  readonly to: IDeployedComponent;
}

export class Loads extends AbstractPlatformRelationship implements ILoads {
  readonly metaClass = "Loads" as const;
  readonly from: IActionElement;
  readonly to: IDeployedComponent;
  constructor(args: { from: IActionElement; to: IDeployedComponent }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 186. Spawns (§15.11.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.11.2
 * @metaclass Spawns (concrete)
 * @generalization AbstractPlatformRelationship
 * @definition The Spawns class is a meta-model element that represents
 *   "dynamic process creation" or "dynamic thread creation" relationship
 *   between a SpawningService action endpoint and the RunnableInterface
 *   (Process or Thread).
 * @ownedAttributes
 *   • from : ActionElement   [1] -- "abstracted" action element owned by
 *     some resource.
 *   • to   : RuntimeResource [1] -- The runtime resource element (Process or
 *     Thread) that is being spawned.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface ISpawns extends IAbstractPlatformRelationship {
  readonly from: IActionElement;
  readonly to: IRuntimeResource;
}

export class Spawns extends AbstractPlatformRelationship implements ISpawns {
  readonly metaClass = "Spawns" as const;
  readonly from: IActionElement;
  readonly to: IRuntimeResource;
  constructor(args: { from: IActionElement; to: IRuntimeResource }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 187. ManagesResource (§15.8.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.8.1
 * @metaclass ManagesResource (concrete)
 * @generalization Action::AbstractActionRelationship
 * @definition ManagesResource class follows the pattern of a "resource action
 *   relationship." It represents various types of accesses to platform
 *   resources that are not related to the flow of data to and from the
 *   resource. ManagesResource relationship is similar to Addresses
 *   relationship from Action Package.
 * @ownedAttributes
 *   • from : ActionElement    [1] -- "abstracted" action owned by some
 *     resource.
 *   • to   : PlatformResource [1] -- The resource being accessed.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. This relationship should not be used in Code models. (§15.8.1)
 */
export interface IManagesResource extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IPlatformResource;
}

export class ManagesResource extends AbstractActionRelationship implements IManagesResource {
  readonly metaClass = "ManagesResource" as const;
  readonly from: IActionElement;
  readonly to: IPlatformResource;
  constructor(args: { from: IActionElement; to: IPlatformResource }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 188. ReadsResource (§15.8.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.8.2
 * @metaclass ReadsResource (concrete)
 * @generalization Action::AbstractActionRelationship
 * @definition ReadsResource class follows the pattern of a "resource action
 *   relationship." It represents various types of accesses to platform
 *   resources where there is a flow of data from the resource. ReadsResource
 *   relationship is similar to Reads relationship from Action Package.
 * @ownedAttributes
 *   • from : ActionElement    [1] -- "abstracted" action owned by some
 *     resource.
 *   • to   : PlatformResource [1] -- The resource being accessed.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. This relationship should not be used in Code models. (§15.8.2)
 */
export interface IReadsResource extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IPlatformResource;
}

export class ReadsResource extends AbstractActionRelationship implements IReadsResource {
  readonly metaClass = "ReadsResource" as const;
  readonly from: IActionElement;
  readonly to: IPlatformResource;
  constructor(args: { from: IActionElement; to: IPlatformResource }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 189. WritesResource (§15.8.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.8.3
 * @metaclass WritesResource (concrete)
 * @generalization Action::AbstractActionRelationship
 * @definition WritesResource class follows the pattern of a "resource action
 *   relationship." It represents various types of accesses to platform
 *   resources where there is a flow of data to the resource. WritesResource
 *   relationship is similar to Writes relationship from Action Package.
 * @ownedAttributes
 *   • from : ActionElement    [1] -- "abstracted" action owned by some
 *     resource.
 *   • to   : PlatformResource [1] -- The resource being accessed.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. This relationship should not be used in Code models. (§15.8.3)
 */
export interface IWritesResource extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IPlatformResource;
}

export class WritesResource extends AbstractActionRelationship implements IWritesResource {
  readonly metaClass = "WritesResource" as const;
  readonly from: IActionElement;
  readonly to: IPlatformResource;
  constructor(args: { from: IActionElement; to: IPlatformResource }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 190. DefinedBy (§15.8.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.8.4
 * @metaclass DefinedBy (concrete)
 * @generalization Action::AbstractActionRelationship
 * @definition DefinedBy is a meta-model element that represents association
 *   between a platform resource and the logical package that describes the
 *   interface to this resource. The CodeItem at the to-endpoint of this KDM
 *   relationship is usually an interface or a package.
 * @ownedAttributes
 *   • from : ActionElement [1] -- "abstracted" action owned by some resource.
 *   • to   : CodeItem      [1] -- The CodeItem describing the resource.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. This relationship cannot be used in the Code Model. (§15.8.4)
 */
export interface IDefinedBy extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: ICodeItem;
}

export class DefinedBy extends AbstractActionRelationship implements IDefinedBy {
  readonly metaClass = "DefinedBy" as const;
  readonly from: IActionElement;
  readonly to: ICodeItem;
  constructor(args: { from: IActionElement; to: ICodeItem }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 191. ProducesPlatformEvent (§15.8.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.8.5
 * @metaclass ProducesPlatformEvent (concrete)
 * @generalization Action::AbstractActionRelationship
 * @definition ProducesPlatformEvent class follows the pattern of a "resource
 *   action relationship." This relation represents various situations where
 *   an ActionElement produces a PlatformEvent. The action is usually an
 *   "abstracted" action owned by some platform resource.
 * @ownedAttributes
 *   • from : ActionElement [1] -- "abstracted" action owned by some resource.
 *   • to   : PlatformEvent [1] -- The PlatformEvent being produced.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. This relationship should not be used in Code models. (§15.8.5)
 */
export interface IProducesPlatformEvent extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IPlatformEvent;
}

export class ProducesPlatformEvent extends AbstractActionRelationship implements IProducesPlatformEvent {
  readonly metaClass = "ProducesPlatformEvent" as const;
  readonly from: IActionElement;
  readonly to: IPlatformEvent;
  constructor(args: { from: IActionElement; to: IPlatformEvent }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 192. PlatformElement (§15.12.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.12.1
 * @metaclass PlatformElement (concrete; generic — must carry a stereotype)
 * @generalization AbstractPlatformElement
 * @definition The PlatformElement class is a generic meta-model element that
 *   can be used to define new extended meta-model elements through the KDM
 *   light-weight extension mechanism.
 * @ownedAttributes (none introduced at this level)
 * @associationEnds (none introduced at this level)
 * @operations (none)
 * @constraints
 *   1. PlatformElement should have at least one stereotype. (§15.12.1)
 */
export interface IPlatformElement extends IAbstractPlatformElement {}

export class PlatformElement extends AbstractPlatformElement implements IPlatformElement {
  readonly metaClass: string = "PlatformElement";
}

// ─── 193. PlatformRelationship (§15.12.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §15.12.2
 * @metaclass PlatformRelationship (concrete; generic — must carry a stereotype)
 * @generalization AbstractPlatformRelationship
 * @definition The PlatformRelationship class is a generic meta-model element
 *   that can be used to define new extended meta-model elements through the
 *   KDM light-weight extension mechanism.
 * @ownedAttributes
 *   • from : AbstractPlatformElement [1] -- The platform element endpoint.
 *   • to   : KDMEntity               [1] -- The target of the relationship.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. PlatformRelationship should have at least one stereotype. (§15.12.2)
 */
export interface IPlatformRelationship extends IAbstractPlatformRelationship {
  readonly from: IAbstractPlatformElement;
  readonly to: IKDMEntity;
}

export class PlatformRelationship extends AbstractPlatformRelationship implements IPlatformRelationship {
  readonly metaClass: string = "PlatformRelationship";
  readonly from: IAbstractPlatformElement;
  readonly to: IKDMEntity;
  constructor(args: { from: IAbstractPlatformElement; to: IKDMEntity }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ───────────────────────────────────────────────────────────────────────────
// UI package (§16) — User-interface viewpoint
// ───────────────────────────────────────────────────────────────────────────

// ─── 194. AbstractUIElement (§16.3.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.3.2
 * @metaclass AbstractUIElement (abstract)
 * @generalization KDMEntity
 * @definition The AbstractUIElement is the abstract superclass for various
 *   concrete user interface elements. As such, it is the class that represents
 *   both compound and elementary items in a model of a system's user interface.
 *   The key subclasses of AbstractUIElement are UIResource and UIAction.
 * @ownedAttributes
 *   • uiRelation     : AbstractUIRelationship [0..*] (composite) -- §16.3.2:
 *     UI relationships originating from the given UI element.
 *   • abstraction    : ActionElement          [0..*] (composite, ordered) --
 *     §16.3.2: owned "abstraction" actions.
 *   • implementation : AbstractCodeElement    [0..*] (group, non-composite) --
 *     §16.3.2: Grouped association to AbstractCodeElement from some CodeModel
 *     that are represented by the current UI element.
 * @associationEnds
 *   • A_AbstractUIElement_uiRelation     -- A_2  -- uiRelation     end
 *   • A_AbstractUIElement_abstraction    -- A_13 -- abstraction    end
 *   • A_AbstractUIElement_implementation -- A_8  -- implementation end
 * @operations (none)
 * @constraints
 *   1. Implementation AbstractCodeElement should be owned by some CodeModel.
 *      (§16.3.2)
 *   2. Implementation AbstractCodeElement should be subclasses of
 *      ComputationalObject or ActionElement. (§16.3.2)
 *   3. Abstraction ActionElement should be owned by the same UIModel.
 *      (§16.3.2)
 */
export interface IAbstractUIElement extends IKDMEntity {
  readonly uiRelation: ReadonlyArray<IAbstractUIRelationship>;
  readonly abstraction: ReadonlyArray<IActionElement>;
  readonly implementation: ReadonlyArray<IAbstractCodeElement>;
}

export abstract class AbstractUIElement extends KDMEntity implements IAbstractUIElement {
  readonly uiRelation: ReadonlyArray<IAbstractUIRelationship> = [];
  readonly abstraction: ReadonlyArray<IActionElement> = [];
  readonly implementation: ReadonlyArray<IAbstractCodeElement> = [];
  // KDMEntity abstract operation defaults — mirror AbstractCodeElement pattern.
  getOwner(): IKDMEntity | undefined { return undefined; }
  getOwnedElement(): ReadonlyArray<IKDMEntity> { return []; }
  getGroup(): ReadonlyArray<IKDMEntity> { return []; }
  getGroupedElement(): ReadonlyArray<IKDMEntity> { return []; }
  getInbound(): ReadonlyArray<IKDMRelationship> { return []; }
  getOutbound(): ReadonlyArray<IKDMRelationship> { return []; }
  getOwnedRelation(): ReadonlyArray<IKDMRelationship> {
    return this.uiRelation as ReadonlyArray<IKDMRelationship>;
  }
  getModel(): IKDMModel | undefined { return undefined; }
  createAggregation(otherEntity: IKDMEntity): IAggregatedRelationship {
    return new AggregatedRelationship({ from: this, to: otherEntity });
  }
  deleteAggregation(_aggregation: IAggregatedRelationship): void { /* metamodel-surface no-op */ }
}

// ─── 195. AbstractUIRelationship (§16.3.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.3.3
 * @metaclass AbstractUIRelationship (abstract)
 * @generalization KDMRelationship
 * @definition The AbstractUIRelationship is the abstract superclass for
 *   various user interface relationships.
 * @ownedAttributes (none introduced at this level)
 * @associationEnds (none introduced at this level)
 * @operations (none)
 * @constraints
 *   The implementer shall map specific user interface association types
 *   determined by the particular user-interface system of the existing
 *   software system, into concrete subclasses of the AbstractUIRelationship.
 *   (§16.3.3)
 */
export interface IAbstractUIRelationship extends IKDMRelationship {}

export abstract class AbstractUIRelationship extends KDMRelationship implements IAbstractUIRelationship {}

// ─── 196. UIModel (§16.3.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.3.1
 * @metaclass UIModel (concrete)
 * @generalization KDMModel
 * @definition The UIModel is the specific KDM model that corresponds to the
 *   user interface of the existing software system.
 * @ownedAttributes
 *   • uiElement : AbstractUIElement [0..*] (composite) -- §16.3.1: User
 *     interface elements owned by the given UIModel.
 * @associationEnds
 *   • A_UIModel_uiElement -- A_21 -- uiElement end
 * @operations (none)
 * @constraints
 *   UIModel provides a container for various user-interface elements. The
 *   implementer shall arrange user-interface elements into one or more UIModel
 *   containers. (§16.3.1)
 */
export interface IUIModel extends IKDMModel {
  readonly uiElement: ReadonlyArray<IAbstractUIElement>;
}

export class UIModel extends KDMModel implements IUIModel {
  readonly metaClass = "UIModel" as const;
  readonly uiElement: ReadonlyArray<IAbstractUIElement>;
  constructor(args: {
    name?: string;
    uiElement?: ReadonlyArray<IAbstractUIElement>;
  } = {}) {
    super();
    if (args.name !== undefined) {
      Object.defineProperty(this, "name", { value: args.name, writable: false, enumerable: true });
    }
    this.uiElement = args.uiElement ?? [];
  }
  getOwnedElement(): ReadonlyArray<IKDMEntity> {
    return this.uiElement as ReadonlyArray<IKDMEntity>;
  }
}

// ─── 197. UIResource (§16.5.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.5.1
 * @metaclass UIResource (concrete; generic — must carry a stereotype)
 * @generalization AbstractUIElement
 * @definition The UIResource is the superclass for several user interface
 *   elements that can be containers for other user interface elements. For
 *   example, it represents a compound unit of display. This is a generic
 *   element.
 * @ownedAttributes
 *   • uiElement : AbstractUIElement [0..*] (composite) -- §16.5.1: UI elements
 *     owned by this UIResource.
 * @associationEnds
 *   • A_UIResource_uiElement -- A_18 -- uiElement end
 * @operations (none)
 * @constraints
 *   1. UIResource should have at least one stereotype. (§16.5.1)
 */
export interface IUIResource extends IAbstractUIElement {
  readonly uiElement: ReadonlyArray<IAbstractUIElement>;
}

export class UIResource extends AbstractUIElement implements IUIResource {
  readonly metaClass: string = "UIResource";
  readonly uiElement: ReadonlyArray<IAbstractUIElement>;
  constructor(args: { uiElement?: ReadonlyArray<IAbstractUIElement> } = {}) {
    super();
    this.uiElement = args.uiElement ?? [];
  }
}

// ─── 198. UIDisplay (§16.5.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.5.2
 * @metaclass UIDisplay (concrete; generic — must carry a stereotype)
 * @generalization UIResource
 * @definition The UIDisplay is the superclass of Screen and Report. It
 *   represents a compound unit of display.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints
 *   1. UIDisplay should have at least one stereotype. (§16.5.2)
 */
export interface IUIDisplay extends IUIResource {}

export class UIDisplay extends UIResource implements IUIDisplay {
  override readonly metaClass: string = "UIDisplay";
}

// ─── 199. Screen (§16.5.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.5.3
 * @metaclass Screen (concrete)
 * @generalization UIDisplay
 * @definition The Screen is a compound unit of display, such as a Web page
 *   or character-mode terminal that is used to present and capture
 *   information. The screen may be composed of multiple instances of
 *   AbstractUIElement and its subclasses.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IScreen extends IUIDisplay {}

export class Screen extends UIDisplay implements IScreen {
  override readonly metaClass = "Screen" as const;
}

// ─── 200. Report (§16.5.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.5.4
 * @metaclass Report (concrete)
 * @generalization UIDisplay
 * @definition The Report is a compound unit of display, such as a printed
 *   report, that is used to present information. The report may be composed
 *   of multiple instances of AbstractUIElement and its subclasses.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IReport extends IUIDisplay {}

export class Report extends UIDisplay implements IReport {
  override readonly metaClass = "Report" as const;
}

// ─── 201. UIField (§16.5.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.5.5
 * @metaclass UIField (concrete)
 * @generalization UIResource
 * @definition The UIField is a unit of display, such as a control on a form,
 *   a text field on a character-mode terminal, or a field printed on a report.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IUIField extends IUIResource {}

export class UIField extends UIResource implements IUIField {
  override readonly metaClass = "UIField" as const;
}

// ─── 202. UIEvent (§16.5.6) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.5.6
 * @metaclass UIEvent (concrete)
 * @generalization AbstractUIElement
 * @definition The UIEvent class is a meta-model element representing various
 *   events and callbacks associated with user interfaces. This class follows
 *   the KDM event pattern, common to Resource Layer packages.
 * @ownedAttributes
 *   • kind : String -- §16.5.6: Represents the nature of the action performed
 *     by this Event.
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 *
 * @specAmbiguity The CMOF declares UIEvent.superClass = C_7 (AbstractUIElement),
 *   which is reflected here. The PDF prose at §16.5.6 reads "Superclass:
 *   UIResource"; the CMOF (machine-readable spec) supersedes the prose.
 */
export interface IUIEvent extends IAbstractUIElement {
  readonly kind?: string;
}

export class UIEvent extends AbstractUIElement implements IUIEvent {
  readonly metaClass = "UIEvent" as const;
  readonly kind?: string;
  constructor(args: { kind?: string } = {}) {
    super();
    this.kind = args.kind;
  }
}

// ─── 203. UIAction (§16.5.7) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.5.7
 * @metaclass UIAction (concrete)
 * @generalization AbstractUIElement
 * @definition UIAction class follows the pattern of a "resource action" class,
 *   specific to the UI package. The nature of the action represented by a
 *   particular element is designated by its "kind" attribute.
 * @ownedAttributes
 *   • kind      : String          -- §16.5.7: Represents the nature of the
 *     action performed by this element.
 *   • uiElement : UIEvent [0..*]  -- §16.5.7: UI events owned by this UIAction.
 * @associationEnds
 *   • A_UIAction_uiElement -- A_69 -- uiElement end
 * @operations (none)
 * @constraints (none declared)
 */
export interface IUIAction extends IAbstractUIElement {
  readonly kind?: string;
  readonly uiElement: ReadonlyArray<IUIEvent>;
}

export class UIAction extends AbstractUIElement implements IUIAction {
  readonly metaClass = "UIAction" as const;
  readonly kind?: string;
  readonly uiElement: ReadonlyArray<IUIEvent>;
  constructor(args: {
    kind?: string;
    uiElement?: ReadonlyArray<IUIEvent>;
  } = {}) {
    super();
    this.kind = args.kind;
    this.uiElement = args.uiElement ?? [];
  }
}

// ─── 204. UIElement (extension class — §16.8.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.8.1
 * @metaclass UIElement (concrete; generic — must carry a stereotype)
 * @generalization AbstractUIElement
 * @definition The UIElement class is a generic meta-model element that can be
 *   used to define new extended meta-model elements through the KDM
 *   light-weight extension mechanism.
 * @ownedAttributes (none introduced at this level)
 * @associationEnds (none introduced at this level)
 * @operations (none)
 * @constraints
 *   1. UIElement should have at least one stereotype. (§16.8.1)
 */
export interface IUIElement extends IAbstractUIElement {}

export class UIElement extends AbstractUIElement implements IUIElement {
  readonly metaClass: string = "UIElement";
}

// ─── 205. UIFlow (§16.6.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.6.1
 * @metaclass UIFlow (concrete)
 * @generalization AbstractUIRelationship
 * @definition The UIFlow relationship class captures the behavior of the user
 *   interface as the sequential flow from one instance of Display to another.
 * @ownedAttributes
 *   • from : AbstractUIElement [1]
 *   • to   : AbstractUIElement [1]
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IUIFlow extends IAbstractUIRelationship {
  readonly from: IAbstractUIElement;
  readonly to: IAbstractUIElement;
}

export class UIFlow extends AbstractUIRelationship implements IUIFlow {
  readonly metaClass = "UIFlow" as const;
  readonly from: IAbstractUIElement;
  readonly to: IAbstractUIElement;
  constructor(args: { from: IAbstractUIElement; to: IAbstractUIElement }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 206. UILayout (§16.6.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.6.2
 * @metaclass UILayout (concrete)
 * @generalization AbstractUIRelationship
 * @definition The UILayout relationship class captures an association between
 *   two instances of Display — one that defines the content for a portion of
 *   a user interface, and one that defines its layout.
 * @ownedAttributes
 *   • from : UIResource [1] -- the origin UI Resource.
 *   • to   : UIResource [1] -- the target UI Resource.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IUILayout extends IAbstractUIRelationship {
  readonly from: IUIResource;
  readonly to: IUIResource;
}

export class UILayout extends AbstractUIRelationship implements IUILayout {
  readonly metaClass = "UILayout" as const;
  readonly from: IUIResource;
  readonly to: IUIResource;
  constructor(args: { from: IUIResource; to: IUIResource }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 207. Displays (§16.7.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.7.1
 * @metaclass Displays (concrete)
 * @generalization AbstractUIRelationship
 * @definition The Displays relationship class represents the relationship
 *   between an instance of CallableInterface and the instance of UIElement
 *   that is presented on the interface as a result of the execution of the
 *   CallableInterface.
 * @ownedAttributes
 *   • from : ActionElement [1] -- The ActionElement that displays a certain
 *     UI resource.
 *   • to   : UIResource    [1] -- the target UI resource.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IDisplays extends IAbstractUIRelationship {
  readonly from: IActionElement;
  readonly to: IUIResource;
}

export class Displays extends AbstractUIRelationship implements IDisplays {
  readonly metaClass = "Displays" as const;
  readonly from: IActionElement;
  readonly to: IUIResource;
  constructor(args: { from: IActionElement; to: IUIResource }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 208. DisplaysImage (§16.7.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.7.2
 * @metaclass DisplaysImage (concrete)
 * @generalization AbstractUIRelationship
 * @definition The DisplaysImage captures the relationship between an image
 *   file — an instance of Image — and its presentation on a user interface —
 *   an instance of DisplayUnit.
 * @ownedAttributes
 *   • from : ActionElement [1] -- The ActionElement that displays a certain
 *     Image.
 *   • to   : ImageFile     [1] -- the target Image element.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 *
 * @specAmbiguity Spec prose calls this "Image"; the CMOF resolves the type
 *   to ImageFile (C_45 in §11.5.4) which is the only "Image"-shaped concrete
 *   metaclass in the metamodel. We project the CMOF type.
 */
export interface IDisplaysImage extends IAbstractUIRelationship {
  readonly from: IActionElement;
  readonly to: IImageFile;
}

export class DisplaysImage extends AbstractUIRelationship implements IDisplaysImage {
  readonly metaClass = "DisplaysImage" as const;
  readonly from: IActionElement;
  readonly to: IImageFile;
  constructor(args: { from: IActionElement; to: IImageFile }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 209. ManagesUI (§16.7.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.7.3
 * @metaclass ManagesUI (concrete)
 * @generalization Action::AbstractActionRelationship
 * @definition ManagesUI class follows the pattern of a "resource action
 *   relationship." It represents various types of accesses to user interface
 *   resources that are not related to the flow of data to and from the
 *   resource. ManagesUI relationship is similar to Addresses relationship from
 *   Action Package.
 * @ownedAttributes
 *   • from : ActionElement [1] -- "abstracted" action owned by some resource.
 *   • to   : UIResource    [1] -- The user interface resource being accessed.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. This relationship should not be used in Code models. (§16.7.3)
 */
export interface IManagesUI extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IUIResource;
}

export class ManagesUI extends AbstractActionRelationship implements IManagesUI {
  readonly metaClass = "ManagesUI" as const;
  readonly from: IActionElement;
  readonly to: IUIResource;
  constructor(args: { from: IActionElement; to: IUIResource }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 210. ReadsUI (§16.7.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.7.4
 * @metaclass ReadsUI (concrete)
 * @generalization Action::AbstractActionRelationship
 * @definition ReadsUI class follows the pattern of a "resource action
 *   relationship." It represents various types of accesses to user interface
 *   resources where there is a flow of data from the resource. ReadsUI
 *   relationship is similar to Reads relationship from Action Package.
 * @ownedAttributes
 *   • from : ActionElement [1] -- "abstracted" action owned by some resource.
 *   • to   : UIResource    [1] -- The user interface resource being accessed.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. This relationship should not be used in Code models. (§16.7.4)
 */
export interface IReadsUI extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IUIResource;
}

export class ReadsUI extends AbstractActionRelationship implements IReadsUI {
  readonly metaClass = "ReadsUI" as const;
  readonly from: IActionElement;
  readonly to: IUIResource;
  constructor(args: { from: IActionElement; to: IUIResource }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 211. WritesUI (§16.7.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.7.5
 * @metaclass WritesUI (concrete)
 * @generalization Action::AbstractActionRelationship
 * @definition WritesUI class follows the pattern of a "resource action
 *   relationship." It represents various types of accesses to user interface
 *   resources where there is a flow of data to the resource. WritesUI
 *   relationship is similar to Writes relationship from Action Package.
 * @ownedAttributes
 *   • from : ActionElement [1] -- "abstracted" action owned by some resource.
 *   • to   : UIResource    [1] -- The user interface resource being accessed.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. This relationship should not be used in Code models. (§16.7.5)
 */
export interface IWritesUI extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IUIResource;
}

export class WritesUI extends AbstractActionRelationship implements IWritesUI {
  readonly metaClass = "WritesUI" as const;
  readonly from: IActionElement;
  readonly to: IUIResource;
  constructor(args: { from: IActionElement; to: IUIResource }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 212. ProducesUIEvent (§16.7.6) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.7.6
 * @metaclass ProducesUIEvent (concrete)
 * @generalization Action::AbstractActionRelationship
 * @definition ProducesUIEvent class follows the pattern of a "resource action
 *   relationship." This relation represents various situations where an
 *   ActionElement produces a UIEvent. The action is usually an "abstracted"
 *   action owned by some UI resource.
 * @ownedAttributes
 *   • from : ActionElement [1] -- "abstracted" action owned by some resource.
 *   • to   : UIEvent       [1] -- The UI Event being produced.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. This relationship should not be used in Code models. (§16.7.6)
 */
export interface IProducesUIEvent extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IUIEvent;
}

export class ProducesUIEvent extends AbstractActionRelationship implements IProducesUIEvent {
  readonly metaClass = "ProducesUIEvent" as const;
  readonly from: IActionElement;
  readonly to: IUIEvent;
  constructor(args: { from: IActionElement; to: IUIEvent }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 213. UIRelationship (§16.8.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §16.8.2
 * @metaclass UIRelationship (concrete; generic — must carry a stereotype)
 * @generalization AbstractUIRelationship
 * @definition The UIRelationship relationship is a generic meta-model element
 *   that can be used to define new extended meta-model elements through the
 *   KDM light-weight extension mechanism.
 * @ownedAttributes
 *   • from : AbstractUIElement [1] -- the origin UI element.
 *   • to   : KDMEntity         [1] -- the target KDM entity.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. UIRelationship should have at least one stereotype. (§16.8.2)
 */
export interface IUIRelationship extends IAbstractUIRelationship {
  readonly from: IAbstractUIElement;
  readonly to: IKDMEntity;
}

export class UIRelationship extends AbstractUIRelationship implements IUIRelationship {
  readonly metaClass: string = "UIRelationship";
  readonly from: IAbstractUIElement;
  readonly to: IKDMEntity;
  constructor(args: { from: IAbstractUIElement; to: IKDMEntity }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Event package (§17) — State-machine and event-driven semantics
// ───────────────────────────────────────────────────────────────────────────

// ─── 214. AbstractEventElement (§17.3.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.3.2
 * @metaclass AbstractEventElement (abstract)
 * @generalization KDMEntity
 * @definition The AbstractEventElement is an abstract superclass for various
 *   event elements. The key subclasses of AbstractEventElement are
 *   EventResource and EventAction.
 * @ownedAttributes
 *   • eventRelation  : AbstractEventRelationship [0..*] (composite) -- §17.3.2:
 *     Event relations owned by the give element.
 *   • abstraction    : ActionElement             [0..*] (composite, ordered) --
 *     §17.3.2: owned "abstracted" action elements.
 *   • implementation : AbstractCodeElement       [0..*] (group, non-composite)
 *     -- §17.3.2: Group association to AbstractCodeElement elements from some
 *     CodeModel that are represented by the current EventElement.
 * @associationEnds
 *   • A_AbstractEventElement_eventRelation  -- A_859 -- eventRelation  end
 *   • A_AbstractEventElement_abstraction    -- A_862 -- abstraction    end
 *   • A_AbstractEventElement_implementation -- A_864 -- implementation end
 * @operations (none)
 * @constraints
 *   1. Implementation AbstractCodeElement should be owned by some CodeModel.
 *      (§17.3.2)
 *   2. Implementation AbstractCodeElement should be subclass of
 *      ComputationalObject or ActionElement. (§17.3.2)
 *   3. Abstraction ActionElement should be owned by the same EventModel.
 *      (§17.3.2)
 */
export interface IAbstractEventElement extends IKDMEntity {
  readonly eventRelation: ReadonlyArray<IAbstractEventRelationship>;
  readonly abstraction: ReadonlyArray<IActionElement>;
  readonly implementation: ReadonlyArray<IAbstractCodeElement>;
}

export abstract class AbstractEventElement extends KDMEntity implements IAbstractEventElement {
  readonly eventRelation: ReadonlyArray<IAbstractEventRelationship> = [];
  readonly abstraction: ReadonlyArray<IActionElement> = [];
  readonly implementation: ReadonlyArray<IAbstractCodeElement> = [];
  // KDMEntity abstract operation defaults — mirror AbstractCodeElement pattern.
  getOwner(): IKDMEntity | undefined { return undefined; }
  getOwnedElement(): ReadonlyArray<IKDMEntity> { return []; }
  getGroup(): ReadonlyArray<IKDMEntity> { return []; }
  getGroupedElement(): ReadonlyArray<IKDMEntity> { return []; }
  getInbound(): ReadonlyArray<IKDMRelationship> { return []; }
  getOutbound(): ReadonlyArray<IKDMRelationship> { return []; }
  getOwnedRelation(): ReadonlyArray<IKDMRelationship> {
    return this.eventRelation as ReadonlyArray<IKDMRelationship>;
  }
  getModel(): IKDMModel | undefined { return undefined; }
  createAggregation(otherEntity: IKDMEntity): IAggregatedRelationship {
    return new AggregatedRelationship({ from: this, to: otherEntity });
  }
  deleteAggregation(_aggregation: IAggregatedRelationship): void { /* metamodel-surface no-op */ }
}

// ─── 215. AbstractEventRelationship (§17.3.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.3.3
 * @metaclass AbstractEventRelationship (abstract)
 * @generalization KDMRelationship
 * @definition The AbstractEventRelationship is the superclass of associations
 *   of the event model. This is an abstract meta-model element for representing
 *   various relations involving states and events.
 * @ownedAttributes (none introduced at this level)
 * @associationEnds (none introduced at this level)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IAbstractEventRelationship extends IKDMRelationship {}

export abstract class AbstractEventRelationship extends KDMRelationship implements IAbstractEventRelationship {}

// ─── 216. EventModel (§17.3.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.3.1
 * @metaclass EventModel (concrete)
 * @generalization KDMModel
 * @definition The EventModel is a specific KDM model that represents entities
 *   and relations describing events and responses to events in an enterprise
 *   application.
 * @ownedAttributes
 *   • eventElement : AbstractEventElement [0..*] (composite) -- §17.3.1: Event
 *     elements owned by the given event model.
 * @associationEnds
 *   • A_EventModel_eventElement -- A_855 -- eventElement end
 * @operations (none)
 * @constraints
 *   EventModel is a container for instances of event elements. The implementer
 *   shall arrange event elements into one or more event models. (§17.3.1)
 */
export interface IEventModel extends IKDMModel {
  readonly eventElement: ReadonlyArray<IAbstractEventElement>;
}

export class EventModel extends KDMModel implements IEventModel {
  readonly metaClass = "EventModel" as const;
  readonly eventElement: ReadonlyArray<IAbstractEventElement>;
  constructor(args: {
    name?: string;
    eventElement?: ReadonlyArray<IAbstractEventElement>;
  } = {}) {
    super();
    if (args.name !== undefined) {
      Object.defineProperty(this, "name", { value: args.name, writable: false, enumerable: true });
    }
    this.eventElement = args.eventElement ?? [];
  }
  getOwnedElement(): ReadonlyArray<IKDMEntity> {
    return this.eventElement as ReadonlyArray<IKDMEntity>;
  }
}

// ─── 217. EventResource (§17.5.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.5.1
 * @metaclass EventResource (concrete; generic)
 * @generalization AbstractEventElement
 * @definition The EventResource is the generic AbstractEventElement that can
 *   be instantiated in KDM instances.
 * @ownedAttributes
 *   • eventElement : AbstractEventElement [0..*] (composite) -- §17.5.1:
 *     Event elements owned by this EventResource.
 * @associationEnds
 *   • A_EventResource_eventElement -- A_873 -- eventElement end
 * @operations (none)
 * @constraints (none declared)
 */
export interface IEventResource extends IAbstractEventElement {
  readonly eventElement: ReadonlyArray<IAbstractEventElement>;
}

export class EventResource extends AbstractEventElement implements IEventResource {
  readonly metaClass: string = "EventResource";
  readonly eventElement: ReadonlyArray<IAbstractEventElement>;
  constructor(args: { eventElement?: ReadonlyArray<IAbstractEventElement> } = {}) {
    super();
    this.eventElement = args.eventElement ?? [];
  }
}

// ─── 218. Event (§17.5.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.5.2
 * @metaclass Event (concrete)
 * @generalization AbstractEventElement
 * @definition The Event is the generic AbstractEventElement that can be
 *   instantiated in KDM instances.
 * @ownedAttributes
 *   • kind : String -- §17.5.2: Represents the nature of this Event.
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 *
 * @specAmbiguity The CMOF declares Event.superClass = C_857 (AbstractEventElement)
 *   directly; the prose at §17.5.2 reads "Superclass: EventResource". The CMOF
 *   (machine-readable spec) supersedes the prose.
 */
export interface IEvent extends IAbstractEventElement {
  readonly kind?: string;
}

export class Event extends AbstractEventElement implements IEvent {
  readonly metaClass = "Event" as const;
  readonly kind?: string;
  constructor(args: { kind?: string } = {}) {
    super();
    this.kind = args.kind;
  }
}

// ─── 219. State (§17.5.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.5.3
 * @metaclass State (concrete)
 * @generalization EventResource
 * @definition The State class represents a state associated with certain
 *   behavior. This can be a concrete state, for example, supported by a
 *   state-machine runtime framework. This can also be an abstract state
 *   associated with some process, algorithm, component, or resource discovered
 *   during the analysis of the software system.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IState extends IEventResource {}

export class State extends EventResource implements IState {
  override readonly metaClass: string = "State";
}

// ─── 220. InitialState (§17.5.4) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.5.4
 * @metaclass InitialState (concrete)
 * @generalization State
 * @definition The InitialState class is a subclass of the State class. It
 *   represents a default initial state.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IInitialState extends IState {}

export class InitialState extends State implements IInitialState {
  override readonly metaClass = "InitialState" as const;
}

// ─── 221. Transition (§17.5.5) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.5.5
 * @metaclass Transition (concrete)
 * @generalization EventResource
 * @definition The Transition class represents a transition that is performed
 *   when a certain event is consumed is a certain state. Transition element
 *   should be owned by some state element. Transition can be associated with
 *   the corresponding Event by using the "ConsumesEvent" resource relation.
 *   A transition element can also own some Event elements. Transition does
 *   not have an "implementation" group. Instead, it is considered as some
 *   sort of a trigger.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface ITransition extends IEventResource {}

export class Transition extends EventResource implements ITransition {
  override readonly metaClass: string = "Transition";
}

// ─── 222. OnEntry (§17.5.6) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.5.6
 * @metaclass OnEntry (concrete)
 * @generalization Transition
 * @definition The OnEntry class represents specific transitions that are
 *   configured to be performed by the runtime framework when a certain state
 *   has been entered.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IOnEntry extends ITransition {}

export class OnEntry extends Transition implements IOnEntry {
  override readonly metaClass = "OnEntry" as const;
}

// ─── 223. OnExit (§17.5.7) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.5.7
 * @metaclass OnExit (concrete)
 * @generalization Transition
 * @definition The OnExit class represents specific transitions that are
 *   configured to be performed by the runtime framework when a certain state
 *   has been exited.
 * @ownedAttributes (inherited)
 * @associationEnds (inherited)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IOnExit extends ITransition {}

export class OnExit extends Transition implements IOnExit {
  override readonly metaClass = "OnExit" as const;
}

// ─── 224. EventAction (§17.5.8) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.5.8
 * @metaclass EventAction (concrete)
 * @generalization AbstractEventElement
 * @definition EventAction class follows the pattern of a "resource action"
 *   class, specific to the event package. The nature of the action represented
 *   by a particular element is designated by its "kind" attribute.
 * @ownedAttributes
 *   • kind         : String           -- §17.5.8: Represents the nature of
 *     the action performed by this element.
 *   • eventElement : Event   [0..*]   -- §17.5.8: The set of Event elements
 *     that is owned by the current EventAction element.
 * @associationEnds
 *   • A_EventAction_eventElement -- A_876 -- eventElement end
 * @operations (none)
 * @constraints (none declared)
 */
export interface IEventAction extends IAbstractEventElement {
  readonly kind?: string;
  readonly eventElement: ReadonlyArray<IEvent>;
}

export class EventAction extends AbstractEventElement implements IEventAction {
  readonly metaClass = "EventAction" as const;
  readonly kind?: string;
  readonly eventElement: ReadonlyArray<IEvent>;
  constructor(args: { kind?: string; eventElement?: ReadonlyArray<IEvent> } = {}) {
    super();
    this.kind = args.kind;
    this.eventElement = args.eventElement ?? [];
  }
}

// ─── 225. EventElement (§17.8.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.8.1
 * @metaclass EventElement (concrete; generic — must carry a stereotype)
 * @generalization AbstractEventElement
 * @definition The EventElement class is a generic meta-model element that can
 *   be used to define new extended meta-model elements through the KDM
 *   light-weight extension mechanism.
 * @ownedAttributes (none introduced at this level)
 * @associationEnds (none introduced at this level)
 * @operations (none)
 * @constraints
 *   1. EventElement should have at least one stereotype. (§17.8.1)
 */
export interface IEventElement extends IAbstractEventElement {}

export class EventElement extends AbstractEventElement implements IEventElement {
  readonly metaClass: string = "EventElement";
}

// ─── 226. NextState (§17.6.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.6.1
 * @metaclass NextState (concrete)
 * @generalization AbstractEventRelationship
 * @definition The NextState class represents the knowledge that upon completion
 *   of the behavior associated with a certain transition element, the
 *   corresponding behavior will enter the given state.
 * @ownedAttributes
 *   • to   : Transition [1] -- the transition.
 *   • from : State      [1] -- the state.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface INextState extends IAbstractEventRelationship {
  readonly from: IState;
  readonly to: ITransition;
}

export class NextState extends AbstractEventRelationship implements INextState {
  readonly metaClass = "NextState" as const;
  readonly from: IState;
  readonly to: ITransition;
  constructor(args: { from: IState; to: ITransition }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 227. ConsumesEvent (§17.6.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.6.2
 * @metaclass ConsumesEvent (concrete)
 * @generalization AbstractEventRelationship
 * @definition The ConsumesEvent class represents the knowledge that a certain
 *   transition element is associated with a certain event. For example, in
 *   statically configured state-machine based frameworks this information can
 *   be derived from the initialization of framework specific data structures.
 * @ownedAttributes
 *   • from : Transition [1] -- the transition.
 *   • to   : Event      [1] -- the event.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints (none declared)
 */
export interface IConsumesEvent extends IAbstractEventRelationship {
  readonly from: ITransition;
  readonly to: IEvent;
}

export class ConsumesEvent extends AbstractEventRelationship implements IConsumesEvent {
  readonly metaClass = "ConsumesEvent" as const;
  readonly from: ITransition;
  readonly to: IEvent;
  constructor(args: { from: ITransition; to: IEvent }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 228. EventRelationship (§17.8.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.8.2
 * @metaclass EventRelationship (concrete; generic — must carry a stereotype)
 * @generalization AbstractEventRelationship
 * @definition The EventRelationship class is a generic meta-model element
 *   that can be used to define new extended meta-model elements through the
 *   KDM light-weight extension mechanism.
 * @ownedAttributes
 *   • from : AbstractEventElement [1] -- the event element origin endpoint
 *     of the relationship.
 *   • to   : KDMEntity            [1] -- the target of the relationship.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. EventRelationship should have at least one stereotype. (§17.8.2)
 */
export interface IEventRelationship extends IAbstractEventRelationship {
  readonly from: IAbstractEventElement;
  readonly to: IKDMEntity;
}

export class EventRelationship extends AbstractEventRelationship implements IEventRelationship {
  readonly metaClass: string = "EventRelationship";
  readonly from: IAbstractEventElement;
  readonly to: IKDMEntity;
  constructor(args: { from: IAbstractEventElement; to: IKDMEntity }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 229. ReadsState (§17.7.1) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.7.1
 * @metaclass ReadsState (concrete)
 * @generalization Action::AbstractActionRelationship
 * @definition ReadsState class follows the pattern of a "resource action
 *   relationship." It represents various types of accesses to the state-based
 *   runtime framework that provides a concrete implementation of states,
 *   where access is made to a particular state.
 * @ownedAttributes
 *   • from : ActionElement [1] -- "abstracted" action owned by some resource.
 *   • to   : EventResource [1] -- The event resource being accessed.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. This relationship should not be used in Code models. (§17.7.1)
 *   2. The to endpoint of the relationship should be State of one of its
 *      subclasses. (§17.7.1)
 */
export interface IReadsState extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IEventResource;
}

export class ReadsState extends AbstractActionRelationship implements IReadsState {
  readonly metaClass = "ReadsState" as const;
  readonly from: IActionElement;
  readonly to: IEventResource;
  constructor(args: { from: IActionElement; to: IEventResource }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 230. ProducesEvent (§17.7.2) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.7.2
 * @metaclass ProducesEvent (concrete)
 * @generalization Action::AbstractActionRelationship
 * @definition ProducesEvent class follows the pattern of a "resource action
 *   relationship." It represents various types of accesses to the state-based
 *   runtime framework where the application produces the event.
 * @ownedAttributes
 *   • from : ActionElement [1] -- "abstracted" action owned by some resource.
 *   • to   : EventResource [1] -- The event resource being produced.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. This relationship should not be used in Code models. (§17.7.2)
 *   2. The "to" endpoint of the relationship should be Event. (§17.7.2)
 */
export interface IProducesEvent extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IEventResource;
}

export class ProducesEvent extends AbstractActionRelationship implements IProducesEvent {
  readonly metaClass = "ProducesEvent" as const;
  readonly from: IActionElement;
  readonly to: IEventResource;
  constructor(args: { from: IActionElement; to: IEventResource }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ─── 231. HasState (§17.7.3) ───
/**
 * @standard OMG KDM 1.4 -- formal/16-09-01
 * @section §17.7.3
 * @metaclass HasState (concrete)
 * @generalization Action::AbstractActionRelationship
 * @definition HasState class follows the pattern of a "resource action
 *   relationship." HasState is a structural relationship. It does not
 *   represent resource manipulations. HasState relationship uses the
 *   "abstracted" action container mechanism to provide certain capabilities
 *   to other Resource Layer packages.
 * @ownedAttributes
 *   • from : ActionElement [1] -- "abstracted" action owned by some resource.
 *   • to   : EventResource [1] -- The event resource being accessed.
 * @associationEnds (from/to as above)
 * @operations (none)
 * @constraints
 *   1. This relationship should not be used in Code models. (§17.7.3)
 */
export interface IHasState extends IAbstractActionRelationship {
  readonly from: IActionElement;
  readonly to: IEventResource;
}

export class HasState extends AbstractActionRelationship implements IHasState {
  readonly metaClass = "HasState" as const;
  readonly from: IActionElement;
  readonly to: IEventResource;
  constructor(args: { from: IActionElement; to: IEventResource }) {
    super();
    this.from = args.from;
    this.to = args.to;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// END Implementer #3: Action + Platform + UI + Event packages
// ═══════════════════════════════════════════════════════════════════════════
