import _ from 'lodash'
import { codeBlock, valueOrEmpty } from './util'


export class Table {
  constructor(columns, rows, opts = {}) {
    this.rows = rows
    this.opts = this.initOptions(opts)
    // decorate the incoming columns with max lengths
    // for table formatting
    this.columns = this.initColumns(columns)
  }

  initOptions(options) {
    return Object.assign(this.getDefaultOptions(), options)
  }

  getDefaultOptions() {
    return {
      cellPadding: 1,
      colDelim: '',
      headerDelim: '=',
    }
  }

  initColumns(columns) {
    return columns.map(col => {
      // find the columns max length relative
      // to its label and row values
      col.maxLen = this.rows.reduce((c, row) => {
        const cellVal = col.accessor(row)
        const cellValLen = this.countCellLen(cellVal)
        return cellValLen > c ? cellValLen : c
      }, col.label.length + (this.opts.cellPadding * 2))
      return col
    })
  }

  countCellLen(value) {
    return (value ? value.length : 0) + (this.opts.cellPadding * 2)
  }

  getTotalRowLength() {
    return this.columns.reduce((c, col) =>
      c + col.maxLen,
      0
    ) + (this.columns.length * this.opts.colDelim.length) + this.opts.colDelim.length
  }

  buildHeaderSeparator() {
    return this.opts.headerDelim.repeat(this.getTotalRowLength())
  }

  wrapRow(row) {
    return `${this.opts.colDelim}${row}${this.opts.colDelim}`
  }

  padCell(cell) {
    const pad = ' '.repeat(this.opts.cellPadding)
    return `${pad}${cell}${pad}`
  }

  buildHeaderRow() {
    const headerSeparator = this.buildHeaderSeparator()
    const headerRow = this.columns.map(col =>
      this.buildCell(col.label, col.maxLen)
    ).join(this.opts.colDelim)

    return [
      headerSeparator,
      this.wrapRow(headerRow),
      headerSeparator,
    ]
  }

  buildRow(row) {
    const rowStr = this.columns.map(col =>
      this.buildCell(
        valueOrEmpty(col.accessor(row)),
        col.maxLen
      )
    ).join(this.opts.colDelim)
    return this.wrapRow(rowStr)
  }

  buildRows() {
    return this.rows.map(row => this.buildRow(row))
  }

  buildCell(value, maxLen) {
    const valueLen = value ? value.length : 0
    const pad = this.opts.cellPadding * 2
    const spaceCount = Math.max(maxLen - valueLen - pad, 0)
    const spaces = ' '.repeat(spaceCount)
    const cell = `${value}${spaces}`
    return this.padCell(cell)
  }

  buildTableList() {
    return this.buildHeaderRow()
    .concat(this.buildRows())
    .concat([this.buildHeaderSeparator()])
  }

  buildTableString() {
    return codeBlock(this.buildTableList().join('\n'))
  }
}

export class TableColumn {
  constructor(label, accessor) {
    this.label = label
    this.accessor = accessor
    this.maxLen = null
  }
}
