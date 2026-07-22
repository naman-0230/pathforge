// codeExecutor/harness/cpp.js — C++ code wrapper.
//
// The user writes just their `class Solution { ... };` code. This harness
// generates a full compilable program:
//   1. Standard includes
//   2. User's class code (unmodified)
//   3. Auto-generated main() that reads test input as JSON from stdin,
//      calls the method, prints result as JSON to stdout
//
// SUPPORTED INPUT TYPES (v1):
//   int, long, double, string, bool
//   int[], string[], int[][]  (canonical form)
//   vector<int>, vector<string>, vector<vector<int>>  (LeetCode alias)
//
// SUPPORTED RETURN TYPES (v1):
//   All of the above.
//
// NOT SUPPORTED (v2 placeholder):
//   TreeNode*, ListNode*, GraphNode*  — need custom serializers
//
// INPUT PROTOCOL:
//   stdin contains a JSON object like {"nums": [2,7,11,15], "target": 9}
//   Order of arguments to the method is defined by problemSpec.paramOrder.
//
// OUTPUT PROTOCOL:
//   Program prints JSON-encoded result on the last line of stdout.

// wrapCpp — main export. Returns { fullCode, stdin } for one test case.
export function wrapCpp({ userCode, testCase, problemSpec }) {
  const { functionName, className = 'Solution', paramOrder, paramTypes } = problemSpec;

  const argParsing = buildArgParsing(paramOrder, paramTypes);
  const argList = paramOrder.join(', ');

  const harness = `
${INCLUDES}

${USER_CODE_MARKER_START}
${userCode}
${USER_CODE_MARKER_END}

${JSON_UTILS}

int main() {
    // Read all of stdin
    std::string input((std::istreambuf_iterator<char>(std::cin)), std::istreambuf_iterator<char>());
    JsonValue parsed = parseJson(input);

${argParsing}

    ${className} solution;
    auto result = solution.${functionName}(${argList});

    cout << toJson(result) << endl;

    return 0;
}
`.trim();

  return {
    fullCode: harness,
    stdin: JSON.stringify(testCase.input),
  };
}

// ============================================================
// TYPE NORMALIZATION
// ============================================================

// TYPE_MAP — normalize all supported input type strings to a canonical
// C++ type + a canonical extractor name. Both LeetCode-style (`vector<int>`)
// and Java/canonical style (`int[]`) map to the same C++ type.
const TYPE_MAP = {
  int:                { cppType: 'int',                  extractor: 'extract_int' },
  long:               { cppType: 'long',                 extractor: 'extract_long' },
  double:             { cppType: 'double',               extractor: 'extract_double' },
  string:             { cppType: 'string',               extractor: 'extract_string' },
  bool:               { cppType: 'bool',                 extractor: 'extract_bool' },
  'int[]':            { cppType: 'vector<int>',          extractor: 'extract_vector_int' },
  'string[]':         { cppType: 'vector<string>',       extractor: 'extract_vector_string' },
  'int[][]':          { cppType: 'vector<vector<int>>',  extractor: 'extract_vector_vector_int' },
  'vector<int>':      { cppType: 'vector<int>',          extractor: 'extract_vector_int' },
  'vector<string>':   { cppType: 'vector<string>',       extractor: 'extract_vector_string' },
  'vector<vector<int>>': { cppType: 'vector<vector<int>>', extractor: 'extract_vector_vector_int' },
};

function resolveType(type) {
  const entry = TYPE_MAP[type];
  if (!entry) {
    console.error(`[cpp harness] Unsupported type: ${type}. Defaulting to int.`);
    return TYPE_MAP.int;
  }
  return entry;
}

// ============================================================
// CODE TEMPLATES
// ============================================================

const INCLUDES = `
#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <unordered_map>
#include <set>
#include <unordered_set>
#include <sstream>
#include <algorithm>
#include <cmath>
#include <climits>
#include <cctype>
#include <cstring>
#include <numeric>
#include <queue>
#include <stack>
#include <deque>
#include <utility>
using namespace std;
`.trim();

const USER_CODE_MARKER_START = '// ═══ USER CODE START ═══';
const USER_CODE_MARKER_END = '// ═══ USER CODE END ═══';

// Minimal embedded JSON parser + output helpers.
const JSON_UTILS = `
struct JsonValue {
    enum Type { NUL, BOOL, NUM, STR, ARR, OBJ };
    Type type = NUL;
    bool boolVal = false;
    double numVal = 0;
    string strVal;
    vector<JsonValue> arrVal;
    map<string, JsonValue> objVal;
};

struct JsonParser {
    string s;
    size_t pos = 0;

    void skipWs() {
        while (pos < s.size() && isspace((unsigned char)s[pos])) pos++;
    }

    JsonValue parseValue() {
        skipWs();
        if (pos >= s.size()) return {};
        char c = s[pos];
        if (c == '{') return parseObject();
        if (c == '[') return parseArray();
        if (c == '"') return parseString();
        if (c == 't' || c == 'f') return parseBool();
        if (c == 'n') return parseNull();
        return parseNumber();
    }

    JsonValue parseObject() {
        JsonValue v; v.type = JsonValue::OBJ;
        pos++;
        skipWs();
        if (pos < s.size() && s[pos] == '}') { pos++; return v; }
        while (pos < s.size()) {
            skipWs();
            JsonValue key = parseString();
            skipWs();
            if (pos < s.size() && s[pos] == ':') pos++;
            JsonValue val = parseValue();
            v.objVal[key.strVal] = val;
            skipWs();
            if (pos < s.size() && s[pos] == ',') { pos++; continue; }
            if (pos < s.size() && s[pos] == '}') { pos++; break; }
        }
        return v;
    }

    JsonValue parseArray() {
        JsonValue v; v.type = JsonValue::ARR;
        pos++;
        skipWs();
        if (pos < s.size() && s[pos] == ']') { pos++; return v; }
        while (pos < s.size()) {
            v.arrVal.push_back(parseValue());
            skipWs();
            if (pos < s.size() && s[pos] == ',') { pos++; continue; }
            if (pos < s.size() && s[pos] == ']') { pos++; break; }
        }
        return v;
    }

    JsonValue parseString() {
        JsonValue v; v.type = JsonValue::STR;
        pos++;
        string result;
        while (pos < s.size() && s[pos] != '"') {
            if (s[pos] == '\\\\' && pos + 1 < s.size()) {
                char next = s[pos+1];
                if (next == 'n') result += '\\n';
                else if (next == 't') result += '\\t';
                else if (next == '"') result += '"';
                else if (next == '\\\\') result += '\\\\';
                else result += next;
                pos += 2;
            } else {
                result += s[pos++];
            }
        }
        if (pos < s.size()) pos++;
        v.strVal = result;
        return v;
    }

    JsonValue parseNumber() {
        JsonValue v; v.type = JsonValue::NUM;
        size_t start = pos;
        if (s[pos] == '-') pos++;
        while (pos < s.size() && (isdigit((unsigned char)s[pos]) || s[pos] == '.' || s[pos] == 'e' || s[pos] == 'E' || s[pos] == '+' || s[pos] == '-')) pos++;
        v.numVal = stod(s.substr(start, pos - start));
        return v;
    }

    JsonValue parseBool() {
        JsonValue v; v.type = JsonValue::BOOL;
        if (s.substr(pos, 4) == "true") { v.boolVal = true; pos += 4; }
        else { v.boolVal = false; pos += 5; }
        return v;
    }

    JsonValue parseNull() {
        JsonValue v; v.type = JsonValue::NUL;
        pos += 4;
        return v;
    }
};

JsonValue parseJson(const string& input) {
    JsonParser p; p.s = input; p.pos = 0;
    return p.parseValue();
}

// Extractors — all defined at file scope so buildArgParsing can just
// reference them by name.
int extract_int(const JsonValue& v) { return (int)v.numVal; }
long extract_long(const JsonValue& v) { return (long)v.numVal; }
double extract_double(const JsonValue& v) { return v.numVal; }
string extract_string(const JsonValue& v) { return v.strVal; }
bool extract_bool(const JsonValue& v) { return v.boolVal; }

vector<int> extract_vector_int(const JsonValue& v) {
    vector<int> result;
    for (const auto& item : v.arrVal) result.push_back((int)item.numVal);
    return result;
}

vector<string> extract_vector_string(const JsonValue& v) {
    vector<string> result;
    for (const auto& item : v.arrVal) result.push_back(item.strVal);
    return result;
}

vector<vector<int>> extract_vector_vector_int(const JsonValue& v) {
    vector<vector<int>> result;
    for (const auto& row : v.arrVal) {
        vector<int> r;
        for (const auto& item : row.arrVal) r.push_back((int)item.numVal);
        result.push_back(r);
    }
    return result;
}

// JSON output helpers
string jsonEscape(const string& s) {
    string out = "\\"";
    for (char c : s) {
        if (c == '"') out += "\\\\\\"";
        else if (c == '\\\\') out += "\\\\\\\\";
        else if (c == '\\n') out += "\\\\n";
        else out += c;
    }
    out += '"';
    return out;
}

string toJson(int val) { return to_string(val); }
string toJson(long val) { return to_string(val); }
string toJson(long long val) { return to_string(val); }
string toJson(double val) {
    ostringstream oss; oss << val; return oss.str();
}
string toJson(bool val) { return val ? "true" : "false"; }
string toJson(const string& val) { return jsonEscape(val); }

template<typename T>
string toJson(const vector<T>& v) {
    string out = "[";
    for (size_t i = 0; i < v.size(); i++) {
        if (i > 0) out += ",";
        out += toJson(v[i]);
    }
    out += "]";
    return out;
}
`.trim();

// ============================================================
// ARG PARSING GENERATION
// ============================================================

function buildArgParsing(paramOrder, paramTypes) {
  const lines = [];
  for (const name of paramOrder) {
    const type = paramTypes[name];
    const { cppType, extractor } = resolveType(type);
    lines.push(`    ${cppType} ${name} = ${extractor}(parsed.objVal["${name}"]);`);
  }
  return lines.join('\n');
}