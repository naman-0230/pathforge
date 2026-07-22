// codeExecutor/harness/java.js — Java code wrapper.
//
// Similar architecture to cpp.js. User writes `class Solution { ... }`,
// this generates a full Main class with a main() method that:
//   1. Reads stdin
//   2. Parses JSON test input using a minimal embedded parser
//   3. Instantiates Solution
//   4. Calls the method with parsed args
//   5. Prints result as JSON
//
// JAVA-SPECIFIC NOTES:
//   - File must be named Main.java (Piston/Judge0 requirement for main class)
//   - Both Main and Solution classes coexist — Solution is user's code,
//     Main contains the harness
//   - Java doesn't have vector<int> — we use int[] or List<Integer>. Test
//     case JSON uses List<Integer> where it matters, primitive int[] where
//     the problem naturally uses arrays (like Two Sum's `int[] twoSum`)

export function wrapJava({ userCode, testCase, problemSpec }) {
  const { functionName, paramOrder, paramTypes, returnType } = problemSpec;

  const argParsing = buildArgParsing(paramOrder, paramTypes);
  const argList = paramOrder.join(', ');
  const returnPrint = buildReturnPrint(returnType);

  const harness = `
${IMPORTS}

${USER_CODE_MARKER_START}
${userCode}
${USER_CODE_MARKER_END}

public class Main {
    ${JSON_UTILS}

    public static void main(String[] args) throws Exception {
        StringBuilder sb = new StringBuilder();
        java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader(System.in));
        String line;
        while ((line = br.readLine()) != null) sb.append(line);

        JsonValue parsed = parseJson(sb.toString());

${argParsing}

        Solution solution = new Solution();
        ${javaTypeFor(returnType)} result = solution.${functionName}(${argList});

${returnPrint}
    }
}
`.trim();

  return {
    fullCode: harness,
    stdin: JSON.stringify(testCase.input),
  };
}

// ============================================================
// TEMPLATES
// ============================================================

const IMPORTS = `
import java.util.*;
import java.io.*;
`.trim();

const USER_CODE_MARKER_START = '// ═══ USER CODE START ═══';
const USER_CODE_MARKER_END = '// ═══ USER CODE END ═══';

// Minimal JSON parser as static nested class inside Main.
const JSON_UTILS = `
    static class JsonValue {
        enum Type { NUL, BOOL, NUM, STR, ARR, OBJ }
        Type type = Type.NUL;
        boolean boolVal;
        double numVal;
        String strVal = "";
        List<JsonValue> arrVal = new ArrayList<>();
        Map<String, JsonValue> objVal = new LinkedHashMap<>();
    }

    static class JsonParser {
        String s; int pos = 0;
        void skipWs() { while (pos < s.length() && Character.isWhitespace(s.charAt(pos))) pos++; }
        JsonValue parseValue() {
            skipWs();
            if (pos >= s.length()) return new JsonValue();
            char c = s.charAt(pos);
            if (c == '{') return parseObject();
            if (c == '[') return parseArray();
            if (c == '"') return parseString();
            if (c == 't' || c == 'f') return parseBool();
            if (c == 'n') return parseNull();
            return parseNumber();
        }
        JsonValue parseObject() {
            JsonValue v = new JsonValue(); v.type = JsonValue.Type.OBJ;
            pos++; skipWs();
            if (pos < s.length() && s.charAt(pos) == '}') { pos++; return v; }
            while (pos < s.length()) {
                skipWs();
                JsonValue key = parseString();
                skipWs();
                if (pos < s.length() && s.charAt(pos) == ':') pos++;
                JsonValue val = parseValue();
                v.objVal.put(key.strVal, val);
                skipWs();
                if (pos < s.length() && s.charAt(pos) == ',') { pos++; continue; }
                if (pos < s.length() && s.charAt(pos) == '}') { pos++; break; }
            }
            return v;
        }
        JsonValue parseArray() {
            JsonValue v = new JsonValue(); v.type = JsonValue.Type.ARR;
            pos++; skipWs();
            if (pos < s.length() && s.charAt(pos) == ']') { pos++; return v; }
            while (pos < s.length()) {
                v.arrVal.add(parseValue());
                skipWs();
                if (pos < s.length() && s.charAt(pos) == ',') { pos++; continue; }
                if (pos < s.length() && s.charAt(pos) == ']') { pos++; break; }
            }
            return v;
        }
        JsonValue parseString() {
            JsonValue v = new JsonValue(); v.type = JsonValue.Type.STR;
            pos++;
            StringBuilder sb = new StringBuilder();
            while (pos < s.length() && s.charAt(pos) != '"') {
                if (s.charAt(pos) == '\\\\' && pos + 1 < s.length()) {
                    char next = s.charAt(pos + 1);
                    if (next == 'n') sb.append('\\n');
                    else if (next == 't') sb.append('\\t');
                    else if (next == '"') sb.append('"');
                    else if (next == '\\\\') sb.append('\\\\');
                    else sb.append(next);
                    pos += 2;
                } else sb.append(s.charAt(pos++));
            }
            if (pos < s.length()) pos++;
            v.strVal = sb.toString();
            return v;
        }
        JsonValue parseNumber() {
            JsonValue v = new JsonValue(); v.type = JsonValue.Type.NUM;
            int start = pos;
            if (s.charAt(pos) == '-') pos++;
            while (pos < s.length() && (Character.isDigit(s.charAt(pos)) || s.charAt(pos) == '.' || s.charAt(pos) == 'e' || s.charAt(pos) == 'E' || s.charAt(pos) == '+' || s.charAt(pos) == '-')) pos++;
            v.numVal = Double.parseDouble(s.substring(start, pos));
            return v;
        }
        JsonValue parseBool() {
            JsonValue v = new JsonValue(); v.type = JsonValue.Type.BOOL;
            if (s.startsWith("true", pos)) { v.boolVal = true; pos += 4; }
            else { v.boolVal = false; pos += 5; }
            return v;
        }
        JsonValue parseNull() {
            JsonValue v = new JsonValue(); v.type = JsonValue.Type.NUL;
            pos += 4;
            return v;
        }
    }

    static JsonValue parseJson(String input) {
        JsonParser p = new JsonParser();
        p.s = input; p.pos = 0;
        return p.parseValue();
    }

    static String toJson(Object v) {
        if (v == null) return "null";
        if (v instanceof Boolean) return v.toString();
        if (v instanceof Number) return v.toString();
        if (v instanceof String) return jsonEscape((String) v);
        if (v instanceof int[]) {
            int[] arr = (int[]) v;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) {
                if (i > 0) sb.append(",");
                sb.append(arr[i]);
            }
            sb.append("]");
            return sb.toString();
        }
        if (v instanceof int[][]) {
            int[][] arr = (int[][]) v;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) {
                if (i > 0) sb.append(",");
                sb.append(toJson(arr[i]));
            }
            sb.append("]");
            return sb.toString();
        }
        if (v instanceof String[]) {
            String[] arr = (String[]) v;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) {
                if (i > 0) sb.append(",");
                sb.append(jsonEscape(arr[i]));
            }
            sb.append("]");
            return sb.toString();
        }
        if (v instanceof List) {
            List<?> list = (List<?>) v;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(",");
                sb.append(toJson(list.get(i)));
            }
            sb.append("]");
            return sb.toString();
        }
        return v.toString();
    }

    static String jsonEscape(String s) {
        StringBuilder sb = new StringBuilder("\\"");
        for (char c : s.toCharArray()) {
            if (c == '"') sb.append("\\\\\\"");
            else if (c == '\\\\') sb.append("\\\\\\\\");
            else if (c == '\\n') sb.append("\\\\n");
            else sb.append(c);
        }
        sb.append('"');
        return sb.toString();
    }

    // ============================================================
    // TYPE-SPECIFIC EXTRACTORS (called from generated arg parsing)
    // ============================================================
    static int extractInt(JsonValue v) { return (int) v.numVal; }
    static long extractLong(JsonValue v) { return (long) v.numVal; }
    static double extractDouble(JsonValue v) { return v.numVal; }
    static String extractString(JsonValue v) { return v.strVal; }
    static boolean extractBool(JsonValue v) { return v.boolVal; }

    static int[] extractIntArr(JsonValue v) {
        int[] arr = new int[v.arrVal.size()];
        for (int i = 0; i < arr.length; i++) arr[i] = (int) v.arrVal.get(i).numVal;
        return arr;
    }
    static String[] extractStringArr(JsonValue v) {
        String[] arr = new String[v.arrVal.size()];
        for (int i = 0; i < arr.length; i++) arr[i] = v.arrVal.get(i).strVal;
        return arr;
    }
    static int[][] extractIntMatrix(JsonValue v) {
        int[][] result = new int[v.arrVal.size()][];
        for (int i = 0; i < result.length; i++) {
            JsonValue row = v.arrVal.get(i);
            result[i] = new int[row.arrVal.size()];
            for (int j = 0; j < result[i].length; j++) {
                result[i][j] = (int) row.arrVal.get(j).numVal;
            }
        }
        return result;
    }
`.trim();

// ============================================================
// PER-TYPE ARG PARSING
// ============================================================

function buildArgParsing(paramOrder, paramTypes) {
  const lines = [];
  for (const name of paramOrder) {
    const type = paramTypes[name];
    const extractor = javaExtractorFor(type);
    lines.push(`        ${javaTypeFor(type)} ${name} = ${extractor}(parsed.objVal.get("${name}"));`);
  }
  return lines.join('\n');
}

function javaTypeFor(type) {
  const map = {
    int: 'int',
    long: 'long',
    double: 'double',
    string: 'String',
    bool: 'boolean',
    'int[]': 'int[]',
    'string[]': 'String[]',
    'int[][]': 'int[][]',
    // LeetCode common
    'vector<int>': 'int[]',
    'vector<string>': 'String[]',
    'vector<vector<int>>': 'int[][]',
  };
  return map[type] || 'Object';
}

function javaExtractorFor(type) {
  const map = {
    int: 'extractInt',
    long: 'extractLong',
    double: 'extractDouble',
    string: 'extractString',
    bool: 'extractBool',
    'int[]': 'extractIntArr',
    'string[]': 'extractStringArr',
    'int[][]': 'extractIntMatrix',
    'vector<int>': 'extractIntArr',
    'vector<string>': 'extractStringArr',
    'vector<vector<int>>': 'extractIntMatrix',
  };
  return map[type] || 'extractInt';
}

function buildReturnPrint(returnType) {
  return `        System.out.println(toJson(result));`;
}