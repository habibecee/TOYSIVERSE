let toyList = [];

const toggleModal = () => {
	const basketModalEl = document.querySelector(".basket");
	basketModalEl.classList.toggle("active");
};

const getToys = () => {
	fetch("./products.json")
		.then((res) => res.json())
		.then((toys) => (toyList = toys));
};

getToys();

const createToyStars = (starRate) => {
	let starRateHtml = "";
	for (let i = 1; i <= 5; i++) {
		if (Math.round(starRate) >= i) {
			starRateHtml += `<span class="fa fa-star checked m-0 p-0"></span>`;
		} else {
			starRateHtml += `<span class="fa fa-star m-0 p-0"></span>`;
		}
	}
	return starRateHtml;
};

const createToyItemsHtml = () => {
	const toyListEl = document.querySelector(".toy--list");
	let toyListHtml = "";
	toyList.forEach((toy, index) => {
		toyListHtml += `
		
		<div class="row col-12 ${index % 1 == 0 && "card"} shadow rounded">
		<div class="card-img-div col-4">
			<img href='#' src="${toy.imgSource}" class="card-img-top" alt="..."
				style="width:100%; height:100%;">
		</div>
		<div class="card-div col-8">

			<h4 class="card-title ürün-ad"> ${toy.name} </h4>
			<h6 class="cart-title "> ${toy.brand} </h6>
			<span class="m-0 p-0"> ${toy.starRate} </span>
			${createToyStars(toy.starRate)}
			
			<span class="m-0 p-0"> (${toy.reviewCount}) </span>

			<div class="card-details-div col ">
				<p class="card-text m-0">${toy.description} </p>
				${
					toy.oldPrice
						? `<span class="price"> <del class="text-danger margin-right-3"> ${toy.oldPrice} &#8378 </del> `
						: ""
				}
				<b style="font-size: 23px ;"> ${toy.price} &#8378 </b> </span>
				<button type="button" class="btn btn-a card-btn"><a href="#" class="card-link">Ürün Detayını
						Gör</a></button>
				<button type="button" class="btn sepet-fav" onclick="alert('ürün sepete eklendi')"><i
						class="bi bi-cart-check basket-icon"></i></button>
				<button type="button" class="btn sepet-fav" onclick="alert('ürün favorilere eklendi')"><i
						class="bi bi-heart"></i></button>
			</div>
		</div>
	</div>`;
	});

	toyListEl.innerHTML = toyListHtml;
};

const TOYS_TYPES = {
	ALL: "TÜMÜ",
	BABY: "O-3 YAŞA UYGUN",
	HANDMADE: "EL YAPIMI OYUNCAKLAR",
	CHARACTER: "KARAKTER OYUNCAKLARI ",
	LEGO: "LEGO",
	PLUSH: "PELUŞ  ",
	OTHER: "DİĞERLERİ",
};

const createToysTypesHtml = () => {
	const filterEl = document.querySelector("#filter");
	let filterHtml = "";
	let filterTypes = ["ALL"];
	toyList.forEach((toy) => {
		if (filterTypes.findIndex((filter) => filter == toy.type) == -1) {
			filterTypes.push(toy.type);
		}
	});

	filterTypes.forEach((type, index) => {
		filterHtml += `<li class="${
			index == 0 ? "active" : null
		}" onclick="filterToy(this)" data-type="${type}" > ${
			TOYS_TYPES[type] || type
		} </li>`;
	});

	filterEl.innerHTML = filterHtml;
};

const filterToy = (filterEl) => {
	document.querySelector("#filter .active").classList.remove("active");
	filterEl.classList.add("active");
	let toyType = filterEl.dataset.type;
	getToys();
	if (toyType != "ALL") toyList = toyList.filter((toy) => toy.type == toyType);
	createToyItemsHtml();
};

setTimeout(() => {
	createToyItemsHtml();
	createToysTypesHtml();
}, 300);
