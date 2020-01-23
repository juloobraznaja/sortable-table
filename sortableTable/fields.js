export let fields = {
  image: {
    title: "Image",
    render(arrSrc) {
      return `<img class="sortable-table__cell-img" alt="Image" src="${arrSrc[0].url}" width="100">`;
    },
    compare: null
  },
  name: {
    title: "Name",
    render(text) {
      return text;
    },
    compare(value1, value2) {
      return value1.title > value2.title ? 1 :
        value1.title == value2.title ? 0 : -1;
    }
  }, 
  category: {
    title: "Category",
    render(obj) {
      return obj.category.title;
    },
    compare(value1, value2) {
      return value1.subcategory.category.title > value2.subcategory.category.title ? 1 :
        value1.subcategory.category.title == value2.subcategory.category.title ? 0 : -1;
    }
  },
  quantity: {
    title: "Quantity",
    render(value) {
      return value;
    },
    compare(value1, value2) {
      return +value1.quantity - +value2.quantity;
    }
  },
  price: {
    title: "Price",
    render(value) {
      return '$' + value;
    },
    compare(value1, value2) {
      return +value1.price - +value2.price;
    }
  },
  sales: {
    title: "Sales",
    render(value) {
      return value;
    },
    compare(value1, value2) {
      return +value1.discount - +value2.discount;
    }
  }
};