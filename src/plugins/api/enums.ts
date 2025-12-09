export enum KindEnum {
  BOOL = "bool",
  STR = "str",
  FLOAT = "float",
  INT = "int",
  SINGLE = "single",
  MULTI = "multi",
  INTEXT = "intext",
}

export enum AssignmentStatusEnum {
  FULL = "FULL",
  PARTIAL = "PARTIAL",
  OPEN = "OPEN",
  INVALID = "INVALID",
}

export enum BotKindEnum {
  CLASSIFICATION = "CLASSIFICATION",
  RULES = "RULES",
  TOPICS = "TOPICS",
  RESOLVE = "RESOLVE",
  SCRIPT = "SCRIPT",
}

export enum EventEnum {
  EXAMPLE_SUB_EVENT = "ExampleSubEvent",
  EXAMPLE_EVENT = "ExampleEvent",
}

export enum FieldEnum {
  TITLE = "title",
  ABSTRACT = "abstract",
  PUB_YEAR = "pub_year",
  DATE = "date",
  SOURCE = "source",
}

export enum ItemTypeEnum {
  GENERIC = "generic",
  TWITTER = "twitter",
  ACADEMIC = "academic",
  PATENTS = "patents",
  LEXIS = "lexis",
}

export enum TypeEnum {
  USER = "user",
  BOT = "bot",
  RESOLVED = "resolved",
}

export enum ScopeTypeEnum {
  H = "H",
  R = "R",
}

/**
 * This is a type to specify an entry in the many-to-many relation for items to imports.
 *
 * - An `explicit` m2m relation is used for cases where the import "explicitly" matched this item.
 * For example: A tweet or paper matched a keyword specified in the query
 * - An `implicit` m2m relation is used for cases where the import only "implicitly" includes this item.
 * For example: A tweet is part of the conversation that contained a specified keyword or an
 * article that is referenced by an article that is included "explicitly" in the query.
 */
export enum M2MImportItemTypeEnum {
  EXPLICIT = "explicit",
  IMPLICIT = "implicit",
}

export enum OpEnum {
  OR = "OR",
  AND = "AND",
}

export enum ResolutionMethodEnum {
  MAJORITY = "majority",
  FIRST = "first",
}

export enum ResolutionStatusEnum {
  NEW = "NEW",
  CHANGED = "CHANGED",
  UNCHANGED = "UNCHANGED",
}

export enum KernelEnum {
  LINEAR = "linear",
  POLY = "poly",
  RBF = "rbf",
  SIGMOID = "sigmoid",
  PRECOMPUTED = "precomputed",
}

export enum TaskStatusEnum {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum ModeEnum {
  ALL = "ALL",
  ANY = "ANY",
}
export enum DefTypeEnum {
  EDISMAX = "edismax",
  LUCENE = "lucene",
  DISMAX = "dismax",
}
export enum SearchFieldEnum {
  TITLE = "title",
  ABSTRACT = "abstract",
  TITLE_ABSTRACT = "title_abstract",
}

export enum AssignmentScopeBaseConfigTypesEnum {
  RANDOM = "random",
  RANDOM_EXCLUSION = "random_exclusion",
  RANDOM_NQL = "random_nql",
}

export enum AnnotationSchemeLabelKindEnum {
  BOOL = "bool",
  STR = "str",
  FLOAT = "float",
  INT = "int",
  SINGLE = "single",
  MULTI = "multi",
  INTEXT = "intext",
}

export enum ImportConfigEnum {
  WOS = "wos",
  SCOPUS = "scopus",
  SCOPUS_API = "scopus-api",
  ACADEMIC = "academic",
  OA_FILE = "oa-file",
  OA_SOLR = "oa-solr",
}
