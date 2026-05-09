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
