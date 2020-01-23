import fetchJson from '../lib/fetchJson.js'
import createElement from '../lib/createElement.js'
import {fields} from './fields.js';

export class SortableTable {
  tableRows = [];
  pageLength = 30;

  constructor({
      url,
      isDynamic,
      fields,
      order: {
        field,
        direction
      }
  }) {
    this.url = new URL(url);
    this.isDynamic = isDynamic;
    this.fieldsEnabled = fields;
    this.direction = direction;
    this.fieldSort = this.transformName(field);
    this.onHeaderClick = this.onHeaderClick.bind(this);
    this.onPageScroll = this.onPageScroll.bind(this);
    this.renderHead();
    this.loadData();
  }


  onPageScroll() {
    if (this.isLoaded) return; //full loaded
    if (this.elem.classList.contains('sortable-table_loading')) return; //loading right now
    if (this.elem.getBoundingClientRect().bottom > document.documentElement.clientHeight) return;
    this.loadData();
  }

  async loadData() {
    if (this.isDynamic) {
      this.url.searchParams.set('_start', this.tableRows.length);
      this.url.searchParams.set('_end', this.tableRows.length + this.pageLength);
    }
    this.url.searchParams.set('_sort', this.fieldSort);
    this.url.searchParams.set('_order', this.direction == 1 ? 'asc' : 'desc');

    this.elem.classList.add('sortable-table_loading');

    let data = await fetchJson(this.url);
    if (data.length == 0) {
      this.isLoaded = true;
      return;
    }
    this.tableRows.push(...data);
    this.sort(this.fieldSort);
    this.elem.classList.remove('sortable-table_loading');

    if (this.isDynamic) {
      window.addEventListener('scroll', this.onPageScroll);
    }
  }

  renderHead() {
    let tableHeadHTML = '';
    for (let field of this.fieldsEnabled) {
      let title = fields[this.transformName(field)].title
      let headData =  `<span>${title}</span>`;
      if (this.transformName(field) === this.fieldSort) {
        headData += `<span class="sortable-table__sort-arrow">
          <span class="sortable-table__sort-arrow_${this.direction == 1 ? 'asc' : 'desc'}"></span>
        </span>`;
      }
      if (fields[this.transformName(field)].compare) {
        tableHeadHTML += `<div class="sortable-table__cell" data-sortable="${title.toLowerCase()}">${headData}</div>`;
      } else {
        tableHeadHTML += `<div class="sortable-table__cell">${headData}</div>`;
      }
    }

    this.elem = createElement(
        `<div class="sortable-table sortable-table_loading">
            <div class="sortable-table__header sortable-table__row">${tableHeadHTML}</div>
            <div class="sortable-table__body"></div>
        </div>`
    );

    this.elem.addEventListener('click', this.onHeaderClick);

    this.body = this.elem.querySelector('.sortable-table__body');

  };

  onHeaderClick(event) {
      let target = event.target.closest('.sortable-table__header .sortable-table__cell');
      if(!target) return;
      let fieldName = target.dataset.sortable;
      if (!fieldName) return;

    if (this.fieldSort == fieldName) {
      this.direction = - this.direction;
    } else {
      this.direction = 1;
    }
      this.sort(fieldName);
    }


  renderData() {
    let tableDataHTML = '';
    for (let row of this.tableRows) {
      let tableField = '';
      for (let field of this.fieldsEnabled) {
        let tableData = fields[this.transformName(field)].render(row[field]);
        tableField +=  `<div class="sortable-table__cell">${tableData}</div>`;
      }
      tableDataHTML += `<div class="sortable-table__row">${tableField}</div>`;
    }
    this.body.innerHTML = tableDataHTML;
  }

  sort(fieldName) {
    let compare = fields[fieldName].compare;
    if (!compare) return;
    let elemSortable = this.elem.querySelector(`[data-sortable="${fieldName}"]`);
    let elemArrow = this.elem.querySelector('.sortable-table__sort-arrow');
    elemSortable.append(elemArrow); //move arrow

    if (this.direction == 1) {
      this.tableRows.sort(compare);
      elemArrow.firstElementChild.className = 'sortable-table__sort-arrow_asc';
    } else {
      this.tableRows.sort(compare);
      this.tableRows.reverse();
      elemArrow.firstElementChild.className = `sortable-table__sort-arrow_desc`;
    }

    this.fieldSort = fieldName;
    // re-fill the table body
    this.renderData();
  }



  transformName(fieldName) {
    switch (fieldName) {
      case 'images':
        return 'image';
      case 'title':
        return 'name';
      case 'subcategory':
        return 'category';
      case 'quantity':
        return 'quantity';
      case 'price':
        return 'price';
      case 'discount':
        return 'sales';
      default:
        return fieldName;
    }
  }

}
