import SVGCat from "./SVGCat";
// Future: import RiveCat from "./RiveCat";

export default function PetRenderer({ engine = "svg", petType = "cat", state, size, facing }) {
  if (engine === "svg" && petType === "cat") {
    return <SVGCat state={state} size={size} facing={facing} />;
  }
  // Future:
  // if (engine === "rive") return <RiveCat state={state} size={size} />;
  return <SVGCat state={state} size={size} facing={facing} />;
}