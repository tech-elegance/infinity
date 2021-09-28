import React, { useState } from "react";
import XLSX from "xlsx";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setImportReside } from "../../../libs/redux/action";

const SheetJSApp = ({ setImportReside, project }) => {
  const { addToast } = useToasts(); //* toast
  const [data, setData] = useState([]);
  const [cols, setCol] = useState([]);

  const handleFile = (file) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (e) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });

      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      setData(data);
      setCol(make_cols(ws["!ref"]));

      setImportReside(data);
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <DragDropFile handleFile={handleFile}>
        <div className="grid ">
          <div>
            <DataInput handleFile={handleFile} />
          </div>
          <div className="mt-3">
            <OutTable data={data} cols={cols} />
          </div>
        </div>
      </DragDropFile>
    </div>
  );
};

class DragDropFile extends React.Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
  }
  suppress(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  }
  onDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    const files = evt.dataTransfer.files;
    if (files && files[0]) this.props.handleFile(files[0]);
  }
  render() {
    return (
      <div
        onDrop={this.onDrop}
        onDragEnter={this.suppress}
        onDragOver={this.suppress}
      >
        {this.props.children}
      </div>
    );
  }
}

class DataInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.props.handleFile(files[0]);
  }
  render() {
    return (
      <div className="flex">
        <label className="w-64 flex flex-col items-center px-4 py-2  rounded-md shadow-md tracking-wide uppercase border border-blue cursor-pointer hover:bg-purple-600 hover:text-white text-purple-600 ease-linear transition-all duration-150">
          <i className="fas fa-cloud-upload-alt fa-3x"></i>
          <span className="mt-2 text-base leading-normal">เลือกไฟล์ .xlsx</span>
          <input
            type="file"
            id="file"
            accept={SheetJSFT}
            onChange={this.handleChange}
            className="hidden"
          />
        </label>
      </div>
    );
  }
}

class OutTable extends React.Component {
  render() {
    return (
      <div className="overflow-auto w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-center">
            <tr>
              {this.props.cols.map((c) => (
                <th key={c.key}>{c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.props.data.map((r, i) => (
              <tr key={i} className="text-center ">
                {this.props.cols.map((c) => (
                  <td key={c.key}>{r[c.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm",
]
  .map(function (x) {
    return "." + x;
  })
  .join(",");

const make_cols = (refstr) => {
  let o = [],
    C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
  return o;
};

const mapStateToProps = (state) => ({
  project: state.project,
});

const mapDispatchToProps = (dispatch) => ({
  setImportReside: bindActionCreators(setImportReside, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SheetJSApp);
