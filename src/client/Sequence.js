import DownloadIcon from "@mui/icons-material/Download";
import { IconButton } from "@mui/material";
import { SeqViz } from "seqviz";
import axios from "axios";
import { exportToJson } from "./utils";
import "./Sequence.css";

const Sequence = function ({ name, id, matchIndices, bases, matchLength }) {
  const handleDownload = (id) => async () => {
    const { data } = await axios.get("api/sequence", {
      params: {
        id,
      },
    });
    exportToJson(`${id}.json`, data);
  };

  return (
    <div className="seq-container">
      <div className="seq-flex">
        <h3 className="align-left">{name}</h3>
        <IconButton
          color="primary"
          style={{ marginTop: -5 }}
          onClick={handleDownload(id)}
        >
          <DownloadIcon />
        </IconButton>
      </div>
      <h3 className="align-left">Match count: {matchIndices.length}</h3>
      <SeqViz
        style={{ height: 300, width: 1000, marginBottom: 40 }}
        seq={bases}
        showComplement={false}
        annotations={matchIndices.map((i) => ({
          id: id + i,
          name: `match i${i}`,
          start: i,
          end: i + matchLength,
          color: "blue",
        }))}
      />
      <hr />
    </div>
  );
};

export default Sequence;
