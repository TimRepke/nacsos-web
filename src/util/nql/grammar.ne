@preprocessor typescript

main -> _ query _ {% (d) => d[1] %}

query ->
    TITLE    ":" _ dqstring           {% (d) => ({ field: 'title',    value: d[3]             }) %}
  | ABSTRACT ":" _ dqstring           {% (d) => ({ field: 'abstract', value: d[3]             }) %}
  | PYEAR    ":" _ COMP _ year        {% (d) => ({ field: 'pub_year', value: d[5], comp: d[3] }) %}
  | PDATE    ":" _ COMP _ date        {% (d) => ({ field: 'date',     value: d[5], comp: d[3] }) %}
  | META     ":" _ meta_clause        {% (d) => ({ filter: 'meta',    ...d[3]                 }) %}
  | LABEL    ":" _ label_clause       {% (d) => ({ filter: 'label',   ...d[3]                 }) %}
  | IMPORT   ":" _ ie_uuids           {% (d) => ({ filter: 'import',  import_ids: d[3]        }) %}
  | query __ AND __ query             {% (d) => ({ 'and': [d[0], d[4]]                        }) %}
  | query __ OR  __ query             {% (d) => ({ 'or':  [d[0], d[4]]                        }) %}
  | "(" _ query _ ")"                 {% (d) => d[2]                                            %}

meta_clause ->
    KEY _  COMP    _  bool      {% (d) => ({ field: d[0], comp: d[2],   value: d[4] }) %}
  | KEY _  COMP    _  uint      {% (d) => ({ field: d[0], comp: d[2],   value: d[4] }) %}
  | KEY __ "LIKE"  __ dqstring  {% (d) => ({ field: d[0], comp: "LIKE", value: d[4] }) %}

label_clause -> label_clause_val (__ "FROM" __ ie_uuids | null) (__ "BY" __ ie_uuids | null) {%
        (d) => ({
            ...d[0],
            scopes: (d[1]||[])[3],
            users:  (d[2]||[])[3],
        })
    %}

label_clause_val ->
    KEY _ COMP     _ uint   {% (d) => ({ key: d[0], value_int:  d[4], comp: d[2] }) %}
  | KEY _ "="      _ bool   {% (d) => ({ key: d[0], value_bool: d[4]             }) %}
  | KEY _ COMP_SET _ uints  {% (d) => ({ key: d[0], multi_int:  d[4], comp: d[2] }) %}

KEY -> [A-Za-z_-]:+   {% (d) => d[0].join("") %}

TITLE    -> "ti"i  | "title"i
ABSTRACT -> "abs"i | "abstract"i
PYEAR    -> "py"i  | "year"i | "yr"i
PDATE    -> "pd"i  | "date"i
IMPORT   -> "import"i
LABEL    -> "label"i
META     -> "meta"i


AND -> "and"i | "&"
OR  -> "or"i  | "|"

COMP ->
    "="   {% id %}
  | "<"   {% id %}
  | "<="  {% id %}
  | ">"   {% id %}
  | ">="  {% id %}
  | "!="  {% id %}

COMP_EXT ->
    "LIKE"  {% id %}
  | COMP    {% id %}

COMP_SET ->
    "=="  {% id %}
  | "@>"  {% id %}  # Does the first array contain the second? Example: [1,4,3] @> [3,1,3] → t
  | "!>"  {% id %}  # Does the first array contain none of the second? Example: [1,4,3] !> [2,5,6] → t
 #| "<@"  {% id %}  # Is the first array contained by the second? Example: [2,2,7] <@ [1,7,4,2,6] → t
  | "&&"  {% id %}  # Do the arrays overlap; any elements in common? Example: [1,4,3] && [2,1] → t

NEGATE ->
    "not"i __
  | "~"
  | "-"

# Whitespaces
_  -> [\s]:* {% (d) => null %}
__ -> [\s]:+ {% (d) => null %}

date  -> year "-" [0-9] [0-9] "-" [0-9] [0-9]  {% (d) => d.join("") %}
year  -> [0-9] [0-9] [0-9] [0-9]               {% (d) => parseInt(d.join("")) %}

uints ->
    uint                      {% (d) => [d[0]] %}
  | uints _ "," _ uint        {% (d) => d[0].concat([d[4]]) %}
uint  -> [0-9]:+              {% (d) => parseInt(d[0].join("")) %}
float -> [0-9]:+ "." [0-9]:*  {% (d) => parseFloat(d[0].join("") + "." + d[2].join("")) %}
bool  ->
    "true"  {% (d) => true  %}
  | "false" {% (d) => false %}

dqstring -> "\"" dstrchar:* "\"" {% (d) => d[1].join("") %}
sqstring -> "'"  sstrchar:* "'"  {% (d) => d[1].join("") %}
btstring -> "`"  [^`]:*     "`"  {% (d) => d[1].join("") %}

dstrchar ->
    [^\\"\n]        {% id %}
  | "\\" strescape  {% (d) => JSON.parse("\""+d.join("")+"\"") %}

sstrchar ->
    [^\\'\n]        {% id %}
  | "\\" strescape  {% (d) => JSON.parse("\""+d.join("")+"\"") %}
  | "\\'"           {% (d) => "'" %}

strescape ->
    ["\\/bfnrt]     {% id %}
  | "u" [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] {% (d) => d.join("") %}

uuids ->
    UUID                      {% (d) => [d[0]]              %}
  | uuids _ "," _ UUID        {% (d) => d[0].concat([d[4]]) %}
ie_uuids ->
    ie_uuid                   {% (d) => [d[0]]              %}
  | ie_uuids _ "," _ ie_uuid  {% (d) => d[0].concat([d[4]]) %}
ie_uuid -> 
    UUID                      {% (d) => ({incl: true,  uuid: d[0]}) %}
  | NEGATE _ UUID             {% (d) => ({incl: false, uuid: d[2]}) %}

# /[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}/
# /[A-Fa-f0-9]{32}/
UUID ->
    H H H H H H H H "-" H H H H "-" H H H H "-" H H H H "-" H H H H H H H H H H H H  {% (d) => d.join("") %}
  | H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H                  {% (d) => d.join("") %}
  | H H H                                                                            {% (d) => d.join("") %}
H -> [A-Fa-f0-9]
