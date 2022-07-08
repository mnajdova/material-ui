import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function App() {
  return (
    <div>
      <div style={{ height: "250px", backgroundColor: "#aaa" }}>
        {/* empty space */}
      </div>
      <div style={{ height: "250px", backgroundColor: "#bbb" }}>
        {/* empty space */}
      </div>
      <div style={{ height: "250px", backgroundColor: "#ccc" }}>
        {/* empty space */}
      </div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Without label</FormHelperText>
      </FormControl>
    </div>
  );
}

export default App;
