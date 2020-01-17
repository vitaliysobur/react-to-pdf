import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import JsPdf from 'jspdf';
import html2canvas from 'html2canvas';

class ReactToPdf extends PureComponent {
  constructor(props) {
    super(props);
    this.toPdf = this.toPdf.bind(this);
    this.targetRef = React.createRef();
  }

  toPdf() {
    const { targetRef, filename, x, y, isFullWidth, options, onComplete } = this.props;
    const source = targetRef || this.targetRef;
    const targetComponent = source.current || source;
    if (!targetComponent) {
      throw new Error(
        'Target ref must be used or informed. See https://github.com/ivmarcos/react-to-pdf#usage.'
      );
    }
    html2canvas(targetComponent, { logging: false }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new JsPdf(options);
      const width = isFullWidth && pdf.internal.pageSize.getWidth();
      const height = isFullWidth && pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'JPEG', x, y, width, height);
      pdf.save(filename);
      if (onComplete) onComplete();
    });
  }

  render() {
    const { children } = this.props;
    return children({ toPdf: this.toPdf, targetRef: this.targetRef });
  }
}

ReactToPdf.propTypes = {
  filename: PropTypes.string.isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  isFullWidth: PropTypes.bool,
  options: PropTypes.object,
  children: PropTypes.func.isRequired,
  onComplete: PropTypes.func,
  targetRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
};

ReactToPdf.defaultProps = {
  filename: 'download.pdf',
  x: 0,
  y: 0,
  isFullWidth: false,
  onComplete: undefined,
  targetRef: undefined,
  options: {}
};

export default ReactToPdf;
