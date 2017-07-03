import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from "react-ace";

import "brace/mode/javascript";
import "brace/theme/monokai";

export default class Editor extends React.Component {
  render() {
    return (
      <div className={`col-md-${this.props.colSize}`}>
        <h3 className="text-center">Escreva seu código abaixo</h3>
        <AceEditor
          mode="javascript"
          theme="monokai"
          onChange={this.props.onChange}
          value={this.props.codigo}
          name="javascript-editor"
          editorProps={{ $blockScrolling: true }}
          fontSize={14}
          width={"100%"}
        />
      </div>
    );
  }
}

Editor.propTypes = {
  colSize: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  codigo: PropTypes.string,
};

Editor.defaultProps = {
  colSize: 12,
  codigo: ''
}
