import { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import Sequence from "./Sequence";
import "./App.css";

const App = function () {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(" ");
  const [isUploading, setIsUploading] = useState(false);
  const [matchLength, setMatchLength] = useState(0);
  const [error, setError] = useState(null);

  // Get total seq document count from db
  const getCount = async () => {
    const count = await axios.get("api/sequence", {
      params: {
        count: true,
      },
    });
    setCount(count.data);
  };

  // Get total count on page load
  useEffect(() => {
    getCount();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);

    if (!search || search.length < 2)
      return setError("Sequence must be at least 2 characters");

    const seqData = await axios.get("api/sequence", {
      params: {
        match: search,
      },
    });
    setMatchLength(search.length);
    setData(seqData.data);
  };

  // Upload files as multipart/form-data
  const handleUpload = async (e) => {
    setIsUploading(true);
    const formData = new FormData();
    const { files } = e.target;

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      formData.append(file.name, file);
    }

    await axios.post("api/sequence", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await getCount();
    setIsUploading(false);
  };

  return (
    <div className="App">
      <h1>Base Matcher</h1>
      <h2>{`Currently searching ${count} record(s)`}</h2>
      <ol>
        <li>
          Upload additional json files by pressing the "upload records" button
        </li>
        <li>
          Execute a search by filling in the search field and pressing enter or
          the search icon
        </li>
      </ol>
      <div className="control-container">
        <label htmlFor="contained-button-file">
          <input
            id="contained-button-file"
            multiple
            type="file"
            accept="application/json"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
          <LoadingButton
            loading={isUploading}
            loadingIndicator="Uploading.."
            variant="contained"
            component="span"
          >
            Upload Records
          </LoadingButton>
        </label>

        <form>
          <TextField
            error={!!error}
            helperText={error}
            id="outlined-basic"
            label="Search"
            variant="outlined"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSearch}
                    type="submit"
                    color="primary"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </div>
      {data.map((seq) => (
        <Sequence
          key={seq.id}
          id={seq.id}
          name={seq.name}
          bases={seq.bases}
          matchIndices={seq.matchIndices}
          matchLength={matchLength}
        />
      ))}
    </div>
  );
};

export default App;
