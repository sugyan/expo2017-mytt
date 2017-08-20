import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
    filterToggleCheckbox, filterChangeKeyword,
    selectItem
} from './redux/actions';

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.days = [
            { label: '8/26(土)', key: '08-26' },
            { label: '8/27(日)', key: '08-27' },
        ];
        this.stages = [
            { label: 'ストロベリー', key: 'strawberry' },
            { label: 'ブルーベリー', key: 'blueberry'  },
            { label: 'オレンジ',     key: 'orange'     },
            { label: 'グレープ',     key: 'grape'      },
            { label: 'キウイ',       key: 'kiwi'       },
            { label: 'ピーチ',       key: 'peach'      },
            { label: 'パイナップル', key: 'pinapple'   },
            { label: 'トーク',       key: 'talk'       },
            { label: 'ふれあい',     key: 'greeting'   },
        ];
    }
    render() {
        const days = this.days.map((e, i) => {
            return (
                <label key={i} className="checkbox-inline">
                    <input
                        type="checkbox"
                        checked={this.props.day[e.key]}
                        onChange={() => this.props.dispatch(filterToggleCheckbox(e.key))} />
                    {e.label}
                </label>
            );
        });
        const stages = this.stages.map((e, i) => {
            return (
                <label key={i} className="checkbox-inline" style={{ marginLeft: '0px', marginRight: '10px' }}>
                    <input
                        type="checkbox"
                        checked={this.props.stage[e.key]}
                        onChange={() => this.props.dispatch(filterToggleCheckbox(e.key))} />
                    {e.label}
                </label>
            );
        });
        return (
            <form className="form-horizontal" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label className="col-sm-2 control-label">日付</label>
                    <div className="col-sm-10">{days}</div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">ステージ</label>
                    <div className="col-sm-10">{stages}</div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">出演者名</label>
                    <div className="col-sm-10">
                        <input
                            className="form-control"
                            type="text"
                            value={this.props.keyword}
                            onChange={(e) => this.props.dispatch(filterChangeKeyword(e.target.value))} />
                    </div>
                </div>
            </form>
        );
    }
}
const FilterForm = connect(
    (state) => state.filter
)(Form);

class Row extends React.Component {
    render() {
        let content = this.props.item.artist || this.props.item.detail.replace(/<br>/g, ', ');
        return (
            <tr>
                <td style={{ whiteSpace: 'nowrap' }}>
                    <div className="checkbox" style={{ marginTop: 0, marginBottom: 0 }}>
                        <label>
                            <input
                                id={this.props.item.id}
                                type="checkbox"
                                checked={this.props.timetable.selected[this.props.item.id] ? true : false}
                                onChange={(e) => this.props.dispatch(selectItem(this.props.item.id, e.target.checked))} />
                            {this.props.item.start.format('M/D(ddd) HH:mm')} - {this.props.item.end.format('HH:mm')}
                        </label>
                    </div>
                </td>
                <td style={{ backgroundColor: this.props.item.color, padding: '4px', width: '100%' }}>
                    <label
                        style={{
                            backgroundColor: '#ffffff', padding: '4px', borderRadius: '4px',
                            display: 'block', marginBottom: 'initial', fontWeight: 'normal', cursor: 'pointer'
                        }}
                        htmlFor={this.props.item.id} >
                        <small>{this.props.item.stage}</small>
                        <br />
                        <strong>{content}</strong>
                    </label>
                </td>
            </tr>
        );
    }
}
const SelectedRow = connect(
    (state) => state
)(Row);

class Table extends React.Component {
    render() {
        const rows = this.props.items.map((item, i) => {
            return <SelectedRow key={i} item={item} />;
        });
        return (
            <table className="table">
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class BottomNavbar extends React.Component {
    handleClick() {
        this.props.history.push('/result');
    }
    render() {
        return (
            <nav className="navbar navbar-default navbar-fixed-bottom">
                <div className="container-fluid">
                    <div className="navbar-collapse navbar-right">
                        <button className="btn btn-primary navbar-btn" onClick={this.handleClick.bind(this)}>
                            選択中の
                            <strong>{this.props.count}</strong>
                            件でタイムテーブルを生成
                        </button>
                    </div>
                </div>
            </nav>
        );
    }
}
const RoutingBottomNavbar = withRouter(BottomNavbar);

class TimeTable extends React.Component {
    render() {
        const regexp = this.props.filter.keyword ? new RegExp(this.props.filter.keyword, 'i') : null;
        const items = this.props.timetable.items.filter((item) => {
            if (! this.props.filter.day[item.day]) {
                return false;
            }
            if (! this.props.filter.stage[item.stage_key]) {
                return false;
            }
            var artist = item.artist || item.detail;
            // if (item.detail !== 'null') {
            //     artist += ` (${item.detail})`;
            // }
            if (regexp && ! artist.match(regexp)) {
                return false;
            }
            return true;
        });
        const selectedCount = Object.keys(this.props.timetable.selected).length;
        const footer = selectedCount > 0 ? <RoutingBottomNavbar count={selectedCount} /> : null;
        return (
            <div>
                <FilterForm />
                <hr />
                <p>全{items.length}件</p>
                <Table items={items} />
                {footer}
            </div>
        );
    }
}
export default connect(
    (state) => state
)(TimeTable);