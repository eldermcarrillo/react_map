//import
import React from 'react'
import { render } from "react-dom"
import PropTypes from 'prop-types'
import moment from 'moment'
import axios from "axios"

import 'react-dates/initialize'
import DateRangePicker from 'react-dates/lib/components/DateRangePicker'
import isInclusivelyBeforeDay from 'react-dates/lib/utils/isInclusivelyBeforeDay'

import ReactTable from "react-table"
import selectTableHOC from "react-table/lib/hoc/selectTable"

//import ReactExport from "react-data-export"

import { API } from '../utils/constants'
import { tokenCopyPaste } from '../utils/functions'

//Const
const SelectTable = selectTableHOC(ReactTable)

//const ExcelFile = ReactExport.ExcelFile
//const ExcelSheet = ReactExport.ExcelFile.ExcelSheet

class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      filtered: [],
      isLoading: false,
      filterAll: '',
      dateinit: '2000-01-01',
      datefinal: moment(new Date()).format('YYYY-MM-DD'),
      startDate: null,
      endDate: null,
      focusedInput: null,
      categoria:''
    };

    this.filterAll = this.filterAll.bind(this);
    this.refreshTable = this.refreshTable.bind(this);
    this.onChange = this.onChange.bind(this);
    this.refresFromPicker = this.refresFromPicker.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.exportExcel = this.exportExcel.bind(this);
    
    this.dt = this.dt.bind(this);
  }

  filterAll(e) {
    const { value } = e.target;
    const filterAll = value;
    const filtered = [filterAll];
    this.setState({ filterAll, filtered});
  }
  dt(){
    return this.state.data;
  }

  refreshTable(e){
    this.setState({
      startDate: null,
      endDate: null,
      dateinit: '2000-01-01',
      datefinal: moment(new Date()).format('YYYY-MM-DD')
    });
    this.filterAll(e);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  refresFromPicker(){
    var c = document.createElement("button");
    c.value = "";
    var target = {};
    var p = new Proxy(target, {});

    p.value = c;

    this.filterAll(p);
  }

  onDatesChange({ startDate, endDate }) {
    this.setState({
      startDate: startDate,
      endDate: endDate,
      dateinit: moment(startDate).format('YYYY-MM-DD'),
      datefinal: moment(endDate).format('YYYY-MM-DD')
    });
    if (startDate && endDate) {
      this.filterAll(this.createEvent(document.getElementById('clickDateRangePicker'), 'click'));
    }
  }

  exportExcel(){
    //this.props.exportTable(this.state.data);
  }

  //--------------------------------------

  onFilteredChange(filtered) {
    if (filtered.length > 1 && this.state.filterAll.length) {
      const filterAll = '';
      this.setState({ filtered: filtered.filter((item) => item.id != 'all'), filterAll })
    }
    else
      this.setState({ filtered });
  }

  createEvent(el, etype){
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
    return evObj;
  }

  renderDatepicker(){
    if(this.props.date == "true"){
      return (
        <DateRangePicker
          startDateId="startDate"
          endDateId="endDate"
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onDatesChange={this.onDatesChange}
          focusedInput={this.state.focusedInput}
          onFocusChange={(focusedInput) => { this.setState({ focusedInput })}}
          isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
        />
      );
    }
  }

  deleteRange(){
    if(this.props.date == "true"){
      return (
        <button className="btn btn-default" onClick={this.refreshTable}>x</button>
      );
    }
  }

  renderExportExcel(){
    if (this.props.excel == "true") {
      return(
        <ExcelFile element={<button className="btn btn-default">Exportar a excel</button>} filename={this.props.nameExcelFile}>
          <ExcelSheet dataSet={this.props.dataTable} name={this.props.nameExcelTab}/>
        </ExcelFile>
      )
    }
  }

  render() {
    const { columns, controller, type ,categoria} = this.props;

    return (
      <div style={{ paddingTop: '30px' }}>
        <div className="row">
          <div className="col-md-6">
            { this.renderDatepicker() }
            { this.deleteRange() }
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div style={{ paddingTop: '30px' }}>
              { this.renderExportExcel() }
            </div>
          </div>
          <div className="col-md-6">
            <div style={{ paddingTop: '30px' }} align="right">
              <input style={{ width: '200px' }} className="form-control" value={this.state.filterAll} onChange={this.filterAll} placeholder="Search.." />
            </div>
          </div>
        </div>
        <button id="clickDateRangePicker" style={{visibility:'hidden'}} className="btn btn-success">hidden</button>
        <ReactTable
          filtered={this.state.filtered}
          onFilteredChange={this.onFilteredChange.bind(this)}
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value
          }
          columns={columns}
          ref={r => (this.selectTable = r)}
          className="-striped -highlight"
          defaultPageSize={10}
          data={this.state.data}
          pages={this.state.pages}
          loading={this.state.loading}
          manual
          resizable={true}
          filterable
          filterAll={true}
          onFetchData={(state, instance) => {
            this.setState({loading: true})
            axios.get(`${API}${controller}`, {
              params: {
                pages: state.page,
                pageSize: state.pageSize,
                filtered: state.filtered,
                typeOption: `${type}`,
                categoria: categoria,
                dateinit: `${this.state.dateinit}`,
                datefinal: `${this.state.datefinal}`,
                data: this.props.data
              },
              headers: { 'Authorization': `${tokenCopyPaste()}` }
            })
              .then((res) => {
              //  this.props.exportTable(res.data, type);
                this.props.datamarkers(res.data.data);
                this.setState({
                  data: res.data.data,
                  fulldata: res.data,
                  pages: Math.ceil(res.data.pages / state.pageSize),
                  loading: false
                })
              })
          }
          }
        />
      </div>
    );
  }
}

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  controller: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  categoria:PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  excel: PropTypes.string.isRequired,
//  exportTable: PropTypes.func.isRequired,
  data: PropTypes.object,
  dataTable: PropTypes.array,
  nameExcelFile: PropTypes.string,
  nameExcelTab: PropTypes.string,
  datamarkers:PropTypes.func.isRequired
}

export default Table;