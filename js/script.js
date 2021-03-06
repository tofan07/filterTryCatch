// Создается стрелочная функция принимающая в качестве параметров тип данных и все значения из поля "Данные" в виде массива с помощью rest параметра и затем с помощью метода filter из массива выбираются те значения, которые соответствуют заданному типу в поле "Тип данных";
const filterByType = (type, ...values) => values.filter(value => typeof value === type),

	// Создается функция которая скрывает все блоки сообщений;
	hideAllResponseBlocks = () => {
		// Создается переменная, которой присваивается массив элементов DOM;
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
		// С помощью цикла forEach каждому элементу назначается стиль display: none, который скрывает элемент со страницы;
		responseBlocksArray.forEach(block => block.style.display = 'none');
	},
	// Создается функция, которая выводит блоки сообщений, которая принимает в качестве параметров:
	// 1 - селектор блока сообщения; 2 - текст сообщения, 3 - селектор элемента в который будет вставлен текст ошибки;
	showResponseBlock = (blockSelector, msgText, spanSelector) => {
		// Вызывается функция, скрывающая все сообщения, для того чтобы не было наложения (дублирования) сообщений ;
		hideAllResponseBlocks();
		// происходит поиск переданного в функцию блока ошибки, и после нахождения ему назначается
		// свойство display: block;
		document.querySelector(blockSelector).style.display = 'block';
		// Происходит проверка: если селектор элемента был передан в функцию, выполняются действия в фигурных скобках;
		if (spanSelector) {
			// Происходит поиск элемента в DOM, и в него вставляется текст ошибки, который передали в функцию, с помощью метода textContent;
			document.querySelector(spanSelector).textContent = msgText;
		}
	},
	// Создаются стрелочные функции, принимающие текст сообщения, и вызывающие функцию showResponseBlock, которая описана выше;
	// Функция для вывода ошибки;
	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),
	// Функция для вывода результата;
	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),
	// Функция для вывода сообщения в случае если данные не введены в инпут;
	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),

	// Создается стрелочная функция, принимающая тип данных и значения;
	tryFilterByType = (type, values) => {
		// С помощью конструкции try{} производится попытка выполнения кода;
		try {
			// Создается переменная, в которую присвается результат выполнения функции filterByType(), записанной в виде строки и выполненной с помощью метода eval(); Изначально из функции получаем массив, а затем превращаем в строку с помощью метода join(', '), разделителем является запятая и пробел; 
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");

			// Создается переменная, которой присвается выражение с тернарным оператором (Если в переменной valuesArray есть хоть одно значение, подставляется левая часть, если нет - правая);
			const alertMsg = (valuesArray.length) ?
				// (Левая часть) Выводится сообщение с результатом фильтрации;
				`Данные с типом ${type}: ${valuesArray}` :
				// (Правая часть) Выводится сообщение об отсутствии данных заданного типа;
				`Отсутствуют данные типа ${type}`;
				
			// вызывается функция showResults и передается переменная alertMsg;
			showResults(alertMsg);
			// В случае появления ошибки, происходит ее перехват с помощью конструкции catch() {};
		} catch (e) {
			// Вызывается функция showError, в которую передается ошибка перехваченная catch, и функция выводит эту ошибку на страницу, а не в консоль, а
			// также выполнения дальнейшего скрипта не прервется;
			showError(`Ошибка: ${e}`);
		}
	};

// Создается переменная, которой присваивается кнопка "Фильтровать"
const filterButton = document.querySelector('#filter-btn');

// На кнопку вешается постоянный мониторинг (слушатель) события клик, после фиксации клика по кнопке, производятся действия в фигурных скобках;
filterButton.addEventListener('click', e => {
	// Создаются переменные, которым присваиваются элементы DOM, найденные с помощью метода querySelector по их id;
	const typeInput = document.querySelector('#type');
	const dataInput = document.querySelector('#data');
	// Происходит проверка на ввод данных, если в поле ничего не ввели до нажатии кнопки, выполнится блок в фигурных скобках, в другом случае
	// выполнится блок else {};
	if (dataInput.value === '') {
		// Выводится браузерная ошибка валидации на пустое поле;
		dataInput.setCustomValidity('Поле не должно быть пустым!');
		// выполняется функция showNoResults() описанная выше;
		showNoResults();
	} else {
		// Удаляется сообщение об ошибке валидации;
		dataInput.setCustomValidity('');
		// Блокируется событие по умолчанию (submit), предотвращает перезагрузку страницы;
		e.preventDefault();
		// вызывается функия tryFilterByType, в которую передаются содержимое поля "Тип данных" и поля "Данные", предварительно очищенные от 
		// пробелов в начале и в конце строки  c помощью метода trim();
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
	}
});

