toastr.options = {
	closeButton: false,
	debug: false,
	newestOnTop: true,
	progressBar: false,
	positionClass: "toast-top-center",
	preventDuplicates: false,
	onclick: null,
	showDuration: "200",
	hideDuration: "600",
	timeOut: "1000",
	extendedTimeOut: "500",
	showEasing: "linear",
	hideEasing: "linear",
	showMethod: "fadeIn",
	hideMethod: "fadeOut",
};

let toyList = [],
	basketList = [],
	favList = [];

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
				<button type="button" class="btn sepet-fav" onclick="addBasket(${toy.id})"><i
						class="bi bi-cart-check basket-icon" id="basketIcon"></i></button>
				<button type="button" class="btn sepet-fav"  onclick="addFav(${toy.id})"><i
						class="bi bi-heart" id="favIcon"></i></button>
			</div>
		</div>
	</div>`;
	});

	toyListEl.innerHTML = toyListHtml;
};

const TOYS_TYPES = {
	ALL: "TÜMÜ (18)",
	BABY: "O-3 YAŞA UYGUN (3)",
	HANDMADE: "EL YAPIMI OYUNCAKLAR (3)",
	CHARACTER: "KARAKTER OYUNCAKLARI (3) ",
	LEGO: "LEGO (3)",
	PLUSH: "PELUŞ (3) ",
	OTHER: "DİĞERLERİ (3)",
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

const listBasketItems = () => {
	localStorage.setItem("basketList", JSON.stringify(basketList));
	const basketListEl = document.querySelector(".items-list");
	const basketCountEl = document.querySelector(".basket-count");
	basketCountEl.innerHTML = basketList.length > 0 ? basketList.length : null;
	const totalPriceEl = document.querySelector(".total-price");
	const oldTotalPriceEl = document.querySelector("#oldTotal-price");
	let basketListHtml = "";
	let totalPrice = 0;
	let oldTotalPrice = 0;
	basketList.forEach((item) => {
		totalPrice += item.product.price * item.quantity;
		oldTotalPrice += item.product.oldPrice * item.quantity;

		basketListHtml += ` <li class="basket-item" style="list-style-type:none;">
		<div class="sepet-img" style="width: 100px; height: 100px; ">
			<img src="${item.product.imgSource} " alt="" style='width: 100%; height: 100%;'>
		</div>
		<div class="sepet-item-info">
			<h3 class="sepet-baslik fs-5" style="cursor:pointer ;"> ${item.product.name} </h3>
			<span class="sepet-fiyat"> <del class="text-danger" > ${item.product.oldPrice} &#8378 </del> <b> ${item.product.price} &#8378
				</b> </span>

		</div>
		<div class="creased">
			<span class="decrease text-danger fs-5" onclick="decreaseItem(${item.product.id})" > - </span>
			<span class="number fs-5"> ${item.quantity} </span>
			<span class="increase text-success fs-5" onclick="increaseItem(${item.product.id})"> + </span>
		</div>
		<div class="trashcan" style="cursor:pointer ;">
			<i class="fa-solid fa-trash-can text-danger" onclick="removeItemBasket(${item.product.id})"></i>
		</div>
	</li>`;
	});

	basketListEl.innerHTML = basketListHtml
		? basketListHtml
		: `<li class="basket-item" style="list-style-type:none;"><span class="noItem">No Items to Buy </span> </li>`;
	totalPriceEl.innerHTML =
		totalPrice > 0 ? totalPrice.toFixed(2) + "&#8378" : null;
	oldTotalPriceEl.innerHTML =
		oldTotalPrice > 0 ? oldTotalPrice.toFixed(2) + "&#8378" : null;
};

const addBasket = (toyId) => {
	let findedToy = toyList.find((toy) => toy.id == toyId);
	const basketIcon = document.querySelector("#basketIcon");
	if (findedToy) {
		const basketAlreadyIndex = basketList.findIndex(
			(basket) => basket.product.id == toyId
		);
		if (basketAlreadyIndex < 0) {
			let addedItem = { quantity: 1, product: findedToy };
			basketList.push(addedItem);
			toastr.success("ÜRÜN SEPETE EKLENDİ");
		} else {
			if (
				basketList[basketAlreadyIndex].quantity <
				basketList[basketAlreadyIndex].product.stock
			) {
				basketList[basketAlreadyIndex].quantity += 1;
				toastr.info("ÜRÜN SAYISI ARTIRILDI");
			} else {
				toastr.error("YETERLİ STOK YOK! ÜRÜN EKLENEMEDİ!");
				return;
			}
		}

		console.log(basketList);
		listBasketItems();
	}
};

const addFav = (toyId) => {
	let favToy = toyList.find((toy) => toy.id == toyId);
	const favIcon = document.querySelector("#favIcon");
	if (favToy) {
		const toyIndex = favList.findIndex((fav) => fav.product.id == toyId);
		if (toyIndex == -1) {
			let addedFav = { fav: true, product: favToy };
			favList.push(addedFav);
			toastr.success("ÜRÜN FAVORİLERE EKLENDİ");
			console.log(favList);
		} else {
			let removeFav = { fav: false, product: favToy };
			favList.splice(removeFav);
			toastr.info("ÜRÜN FAVORİLERDEN KALDIRILDI");
			console.log(favList);
			return;
		}
	}
};

const removeItemBasket = (toyId) => {
	const findedIndex = basketList.findIndex(
		(basket) => basket.product.id == toyId
	);
	if (findedIndex != -1) {
		basketList.splice(findedIndex, 1);
	}
	listBasketItems();
};

const decreaseItem = (toyId) => {
	const findedIndex = basketList.findIndex(
		(basket) => basket.product.id == toyId
	);
	if (findedIndex != -1) {
		if (basketList[findedIndex].quantity != 1) {
			basketList[findedIndex].quantity -= 1;
		} else removeItemBasket(toyId);
	}
	listBasketItems();
};

const increaseItem = (toyId) => {
	const findedIndex = basketList.findIndex(
		(basket) => basket.product.id == toyId
	);
	if (findedIndex != -1) {
		if (
			basketList[findedIndex].quantity < basketList[findedIndex].product.stock
		) {
			basketList[findedIndex].quantity += 1;
		} else {
			toastr.error("YETERLİ STOK YOK! ÜRÜN EKLENEMEDİ!");
		}
		listBasketItems();
	}
};

if (localStorage.getItem("basketList")) {
	basketList = JSON.parse(localStorage.getItem("basketList"));
	listBasketItems();
}

setTimeout(() => {
	createToyItemsHtml();
	createToysTypesHtml();
}, 300);
