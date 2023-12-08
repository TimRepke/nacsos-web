@preprocessor typescript

main -> _ query _ {% (d) => d[1] %}

query ->
    title_filter            {% (d) => d[0] %}
  | abstract_filter         {% (d) => d[0] %}
  | py_filter               {% (d) => d[0] %}
  | import_filter           {% (d) => d[0] %}
  | label_filter            {% (d) => d[0] %}
  | query __ AND __ query   {% (d) => ({'and': [d[0], d[4]]}) %}
  | query __ OR  __ query   {% (d) => ({'or':  [d[0], d[4]]}) %}
  | "(" _ query _ ")"       {% (d) => d[2] %}
  #| _ query _               {% (d) => d[1] %}

title_filter    -> TITLE    ":" _ dqstring           {% (d) => ({field: 'title',    value: d[3]}) %}
abstract_filter -> ABSTRACT ":" _ dqstring           {% (d) => ({field: 'abstract', value: d[3]}) %}
py_filter       -> PYEAR    ":" _ COMPARATOR _ uint  {% (d) => ({field: 'pub_year', value: d[5], comp: d[3]}) %}
import_filter   -> IMPORT   ":" _ uuids              {% (d) => ({filter: 'import',  import_ids: d[3]}) %}
label_filter    -> LABEL    ":" _ label_clause       {% (d) => ({filter: 'label',   clause: d[3]}) %}

label_clause -> KEY _ COMPARATOR _ uint
KEY -> [A-Za-z_-]:+   {% (d) => d.join("") %}

TITLE    -> "ti"i  | "title"i
ABSTRACT -> "abs"i | "abstract"i
PYEAR    -> "py"i  | "year"i | "yr"i
IMPORT   -> "import"i
LABEL    -> "label"i

# Whitespaces
_  -> [\s]:* {% (d) => null %}
__ -> [\s]:+ {% (d) => null %}

uint  -> [0-9]:+              {% (d) => parseInt(d[0].join("")) %}
float -> [0-9]:+ "." [0-9]:*  {% (d) => parseFloat(d[0].join("") + "." + d[2].join("")) %}
bool  ->
    "true"  {% (d) => true %}
  | "false" {% (d) => false %}

AND -> "and"i | "&"
OR  -> "or"i  | "|"

COMPARATOR ->
    "="  {% id %}
  | "<"  {% id %}
  | "<=" {% id %}
  | ">"  {% id %}
  | ">=" {% id %}
  | "!=" {% id %}
NEGATE -> 
    "not"i __
  | "~"
  | "-"

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
    ie_uuid {% (d) => [d[0]] %}
  | uuids _ "," _ ie_uuid {% (d) => d[0].concat([d[4]]) %}

ie_uuid -> 
    UUID            {% (d) => ({incl: true,  uuid: d[0]}) %}
  | NEGATE _ UUID  {% (d) => ({incl: false, uuid: d[2]}) %}


# /[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}/
# /[A-Fa-f0-9]{32}/
UUID ->
    H H H H H H H H "-" H H H H "-" H H H H "-" H H H H "-" H H H H H H H H H H H H  {% (d) => d.join("") %}
  | H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H                  {% (d) => d.join("") %}
  | H H H                                                                            {% (d) => d.join("") %}
H -> [A-Fa-f0-9]
