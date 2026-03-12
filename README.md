# README

Базовый адрес:

`http://localhost:3000`

## Товары

### 1. Получить все товары

Тип запроса: `GET`  
Запрос:

```text
http://localhost:3000/products
```

Для чего нужен: получить список всех товаров.

### 2. Получить товар по id

Тип запроса: `GET`  
Запрос:

```text
http://localhost:3000/products/1/
```

Для чего нужен: получить один товар по его `id`.

### 3. Найти товар по имени или описанию

Тип запроса: `GET`  
Запрос:

```text
http://localhost:3000/products/search?name=кровать&description=деревянная
```

Для чего нужен: поиск товаров по имени или описанию.

Параметры:

- `name` - имя товара
- `description` - описание товара

### 4. Сортировать товары по цене

Тип запроса: `GET`  
Запрос:

```text
http://localhost:3000/products/sort?sort=smal
```

или

```text
http://localhost:3000/products/sort?sort=high
```

Для чего нужен: отсортировать товары по цене.

Параметр:

- `sort=smal` - по возрастанию
- `sort=high` - по убыванию

### 5. Фильтр товаров по категории

Тип запроса: `GET`  
Запрос:

```text
http://localhost:3000/product/filter?category=bed
```
Для чего нужен: получить товары только одной категории.
Примеры категорий:
- `bed`
- `chair`
- `sofa`
- `table`
## Пользователи
### 6. Получить всех пользователей

Тип запроса: `GET`  
Запрос:
http://localhost:3000/users

Для чего нужен: получить список всех пользователей.

### 7. Получить пользователя по id

Тип запроса: `GET`  
Запрос:

```text
http://localhost:3000/users/1
```

Для чего нужен: получить пользователя по `id`.

### 8. Найти пользователя по имени

Тип запроса: `GET`  
Запрос:

```text
http://localhost:3000/users/search?name=Никита
```

Для чего нужен: найти пользователя по имени.

Параметр:

- `name` - имя пользователя

### 9. Проверить логин и пароль

Тип запроса: `GET`  
Запрос:

```text
http://localhost:3000/users/verif/nikita10/26042007
```

Для чего нужен: проверить логин и пароль пользователя.

Формат:

```text
http://localhost:3000/users/verif/{login}/{password}
```

### 10. Зарегистрировать пользователя

Тип запроса: `POST`  
Запрос:

```text
http://localhost:3000/users/register
```

Для чего нужен: создать нового пользователя.

Body, `raw`, `JSON`:

```json
{
  "name": "Иван",
  "email": "ivan@example.com",
  "login": "ivan123",
  "phone": "+375291112233",
  "password": "123456"
}
```

## Корзина

### 11. Получить все корзины

Тип запроса: `GET`  
Запрос:

```text
http://localhost:3000/baskets
```

Для чего нужен: получить все корзины.

### 12. Получить корзину пользователя

Тип запроса: `GET`  
Запрос:

```text
http://localhost:3000/basket/1
```

Для чего нужен: получить корзину конкретного пользователя.

Формат:

```text
http://localhost:3000/basket/{userId}
```

### 13. Добавить товар в корзину

Тип запроса: `POST`  
Запрос:

```text
http://localhost:3000/basket/add/1
```

Для чего нужен: добавить товар в корзину пользователя.

Body, `raw`, `JSON`:

```json
{
  "productId": 5
}
```

Формат:

```text
http://localhost:3000/basket/add/{userId}
```

### 14. Удалить товар из корзины

Тип запроса: `DELETE`  
Запрос:

```text
http://localhost:3000/basket/delete/1/5
```

Для чего нужен: удалить товар из корзины пользователя.

Формат:

```text
http://localhost:3000/basket/delete/{userId}/{productId}
```

### 15. Очистить корзину

Тип запроса: `DELETE`  
Запрос:

```text
http://localhost:3000/basket/clean/1
```

Для чего нужен: полностью очистить корзину пользователя.

Формат:

```text
http://localhost:3000/basket/clean/{userId}
```

## Доставка

### 16. Получить все доставки

Тип запроса: `GET`  
Запрос:

```text
http://localhost:3000/delivery
```

Для чего нужен: получить все доставки.

### 17. Получить доставку пользователя

Тип запроса: `GET`  
Запрос:

```text
http://localhost:3000/delivery/1
```

Для чего нужен: получить доставку конкретного пользователя.

Формат:

```text
http://localhost:3000/delivery/{userId}
```

### 18. Создать доставку

Тип запроса: `POST`  
Запрос:

```text
http://localhost:3000/delivery/create/1
```

Для чего нужен: создать доставку для пользователя.

Body, `raw`, `JSON`:

```json
{
  "address": "Минск, ул. Ленина, 10",
  "deliveryType": "courier",
  "status": "создано"
}
```

Формат:

```text
http://localhost:3000/delivery/create/{userId}
```

### 19. Изменить статус доставки

Тип запроса: `PUT`  
Запрос:

```text
http://localhost:3000/delivery/status/1
```

Для чего нужен: изменить статус доставки пользователя.

Body, `raw`, `JSON`:

```json
{
  "status": "выдано"
}
```

Формат:

```text
http://localhost:3000/delivery/status/{userId}
```

### 20. Очистить доставку

Тип запроса: `DELETE`  
Запрос:

```text
http://localhost:3000/delivery/clean/1
```

Для чего нужен: очистить доставку пользователя.

Формат:

```text
http://localhost:3000/delivery/clean/{userId}
```
